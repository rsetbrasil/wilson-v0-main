"use server"

import fs from "fs/promises"
import path from "path"
import { applicationDefault, cert, getApps as getAdminApps, initializeApp as initializeAdminApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const dataPath = path.join(process.cwd(), "data", "site-content.json")
const uploadsRoot = path.join(process.cwd(), "public", "uploads")

function getAdminDb() {
    try {
        const hasServiceAccount = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim())
        const hasAdc = Boolean(
            process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() ||
            process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
            process.env.GCLOUD_PROJECT?.trim()
        )

        if (!hasServiceAccount && !hasAdc) return null

        if (!getAdminApps().length) {
            const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
            if (raw) {
                const jsonText = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf-8")
                const serviceAccount = JSON.parse(jsonText) as {
                    project_id?: string
                    private_key?: string
                    client_email?: string
                }
                initializeAdminApp({ credential: cert(serviceAccount as any) })
            } else {
                initializeAdminApp({ credential: applicationDefault() })
            }
        }

        return getFirestore()
    } catch {
        return null
    }
}

const firestoreDocPath = "site/content"

async function readSiteContentJson(): Promise<Partial<SiteContent>> {
    const data = await fs.readFile(dataPath, "utf-8")
    return JSON.parse(data) as Partial<SiteContent>
}

function mergeSiteContent(parsed: Partial<SiteContent>): SiteContent {
    const merged: SiteContent = {
        ...defaultSiteContent,
        ...parsed,
        hero: { ...defaultSiteContent.hero, ...parsed.hero },
        contact: { ...defaultSiteContent.contact, ...parsed.contact },
        services: parsed.services ?? defaultSiteContent.services,
        destinations: parsed.destinations ?? defaultSiteContent.destinations,
        about: { ...defaultSiteContent.about, ...parsed.about },
        fleet: parsed.fleet ?? defaultSiteContent.fleet,
        footer: { ...defaultSiteContent.footer, ...parsed.footer },
        auth: { ...defaultSiteContent.auth, ...parsed.auth }
    }

    merged.contact.phones = merged.contact.phones?.length
        ? merged.contact.phones
        : merged.contact.phone
            ? [merged.contact.phone]
            : []

    merged.contact.officeHours = merged.contact.officeHours ?? []

    return merged
}

export interface Service {
    title: string
    description: string
}

export interface Destination {
    name: string
    image: string
}

export interface FleetItem {
    title: string
    description: string
    capacity: string
    image: string
}

export interface AuthContent {
    email: string
    password: string
}

export interface SiteContent {
    hero: {
        title: string
        description: string
        backgroundImage: string
    }
    contact: {
        sectionTitle: string
        sectionSubtitle: string
        phone: string
        phones: string[]
        email: string
        location: string
        address: string
        officeHours: string[]
        formTitle: string
        formSubmitLabel: string
    }
    services: Service[]
    destinations: Destination[]
    about: {
        title: string
        text1: string
        text2: string
        videoUrl: string
        videoPoster: string
    }
    fleet: FleetItem[]
    footer: {
        description: string
        copyright: string
    }
    auth: AuthContent
}

const defaultSiteContent: SiteContent = {
    hero: { title: "", description: "", backgroundImage: "" },
    contact: {
        sectionTitle: "Entre em Contato",
        sectionSubtitle: "Estamos prontos para atender você e planejar sua próxima viagem",
        phone: "",
        phones: [],
        email: "",
        location: "",
        address: "",
        officeHours: [],
        formTitle: "Solicite um Orçamento",
        formSubmitLabel: "Enviar Solicitação"
    },
    services: [],
    destinations: [],
    about: { title: "", text1: "", text2: "", videoUrl: "", videoPoster: "" },
    fleet: [],
    footer: { description: "", copyright: "" },
    auth: { email: "admin@wilsonturismo.com", password: "admin123" }
}

export async function getSiteContent(): Promise<SiteContent> {
    try {
        const adminDb = getAdminDb()
        if (adminDb) {
            const docRef = adminDb.doc(firestoreDocPath)
            const snap = await docRef.get()
            if (snap.exists) {
                return mergeSiteContent((snap.data() as Partial<SiteContent>) ?? {})
            }

            try {
                const fromJson = mergeSiteContent(await readSiteContentJson())
                await docRef.set(fromJson, { merge: false })
                return fromJson
            } catch {
                await docRef.set(defaultSiteContent, { merge: false })
                return defaultSiteContent
            }
        }

        return mergeSiteContent(await readSiteContentJson())
    } catch (error) {
        console.error("Error reading site content:", error)
        return defaultSiteContent
    }
}

export async function updateSiteContent(newContent: SiteContent) {
    try {
        const adminDb = getAdminDb()
        if (adminDb) {
            await adminDb.doc(firestoreDocPath).set(newContent, { merge: false })
            return { success: true }
        }

        await fs.writeFile(dataPath, JSON.stringify(newContent, null, 2), "utf-8")
        return { success: true }
    } catch (error) {
        console.error("Error updating site content:", error)
        return { success: false, error: "Failed to update content" }
    }
}

export async function uploadPublicFile(formData: FormData): Promise<{ success: true; url: string } | { success: false; error: string }> {
    try {
        const file = formData.get("file")
        const pathPrefixRaw = formData.get("pathPrefix")
        const pathPrefix = typeof pathPrefixRaw === "string" && pathPrefixRaw.trim() ? pathPrefixRaw.trim() : "misc"

        if (!(file instanceof File)) {
            return { success: false, error: "Arquivo inválido." }
        }

        const maxBytes = 80 * 1024 * 1024
        if (file.size > maxBytes) {
            return { success: false, error: "Arquivo muito grande (máx 80MB)." }
        }

        const safePrefix = pathPrefix.replace(/[^a-zA-Z0-9-_]/g, "-")
        const originalName = file.name || "upload"
        const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "-")
        const finalName = `${Date.now()}-${safeName}`

        const dirOnDisk = path.join(uploadsRoot, safePrefix)
        await fs.mkdir(dirOnDisk, { recursive: true })

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(path.join(dirOnDisk, finalName), buffer)

        return { success: true, url: `/uploads/${safePrefix}/${finalName}` }
    } catch (error) {
        console.error("Error uploading public file:", error)
        return { success: false, error: "Falha ao fazer upload." }
    }
}
