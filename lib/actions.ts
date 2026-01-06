"use server"

import fs from "fs/promises"
import path from "path"
import { unstable_noStore as noStore } from "next/cache"
import { applicationDefault, cert, getApps as getAdminApps, initializeApp as initializeAdminApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage as getAdminStorage } from "firebase-admin/storage"

const dataPath = path.join(process.cwd(), "data", "site-content.json")
const uploadsRoot = path.join(process.cwd(), "public", "uploads")

function ensureAdminApp() {
    try {
        const hasServiceAccount = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim())
        const hasAdc = Boolean(
            process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim() ||
            process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
            process.env.GCLOUD_PROJECT?.trim()
        )

        if (!hasServiceAccount && !hasAdc) return false

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

        return true
    } catch {
        return false
    }
}

function getAdminDb() {
    if (!ensureAdminApp()) return null
    try {
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
    const parsedFleetSection = (parsed as any).fleetSection as any
    const mergedFleetSectionBase = {
        ...defaultSiteContent.fleetSection,
        ...(parsedFleetSection ?? {})
    }

    const mergedFleetSection = {
        title: mergedFleetSectionBase.title,
        subtitle: mergedFleetSectionBase.subtitle,
        features: Array.isArray(mergedFleetSectionBase.features) ? mergedFleetSectionBase.features : undefined
    } as SiteContent["fleetSection"]

    if (!Array.isArray(mergedFleetSection.features)) {
        const safetyLabel = typeof parsedFleetSection?.safetyLabel === "string" ? parsedFleetSection.safetyLabel : defaultSiteContent.fleetSection.features[1].label
        const wifiLabel = typeof parsedFleetSection?.wifiLabel === "string" ? parsedFleetSection.wifiLabel : defaultSiteContent.fleetSection.features[2].label

        mergedFleetSection.features = [
            defaultSiteContent.fleetSection.features[0],
            { id: "safety", type: "static", icon: "shield", label: safetyLabel },
            { id: "wifi", type: "static", icon: "wifi", label: wifiLabel }
        ]
    }

    const parsedAuth = (parsed as any).auth as any
    const parsedUsersRaw = parsedAuth?.users
    const legacyEmail = typeof parsedAuth?.email === "string" ? parsedAuth.email : ""
    const legacyPassword = typeof parsedAuth?.password === "string" ? parsedAuth.password : ""

    const usersFromParsed = Array.isArray(parsedUsersRaw)
        ? parsedUsersRaw
            .map((u: any, idx: number) => ({
                id: typeof u?.id === "string" && u.id.trim() ? u.id.trim() : `user-${idx + 1}`,
                email: typeof u?.email === "string" ? u.email.trim() : "",
                password: typeof u?.password === "string" ? u.password : ""
            }))
            .filter((u: any) => Boolean(u.email) && Boolean(u.password))
        : []

    const mergedAuth: AuthContent =
        usersFromParsed.length
            ? { users: usersFromParsed }
            : legacyEmail && legacyPassword
                ? { users: [{ id: "user-1", email: legacyEmail, password: legacyPassword }] }
                : defaultSiteContent.auth

    const merged: SiteContent = {
        ...defaultSiteContent,
        ...parsed,
        header: { ...defaultSiteContent.header, ...parsed.header },
        fleetSection: mergedFleetSection,
        hero: { ...defaultSiteContent.hero, ...parsed.hero },
        contact: { ...defaultSiteContent.contact, ...parsed.contact },
        services: parsed.services ?? defaultSiteContent.services,
        destinations: parsed.destinations ?? defaultSiteContent.destinations,
        about: { ...defaultSiteContent.about, ...parsed.about },
        fleet: parsed.fleet ?? defaultSiteContent.fleet,
        footer: { ...defaultSiteContent.footer, ...parsed.footer },
        auth: mergedAuth
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

export type FleetFeatureType = "capacity" | "static"
export type FleetFeatureIcon =
    | "none"
    | "users"
    | "shield"
    | "wifi"
    | "check-circle"
    | "star"
    | "map-pin"
    | "clock"

export interface FleetFeature {
    id: string
    type: FleetFeatureType
    icon: FleetFeatureIcon
    label: string
}

export interface AuthUser {
    id: string
    email: string
    password: string
}

export interface AuthContent {
    users: AuthUser[]
}

export interface SiteContent {
    header: {
        brandName: string
        brandTagline: string
        phone: string
        ctaLabel: string
        ctaHref: string
    }
    fleetSection: {
        title: string
        subtitle: string
        features: FleetFeature[]
    }
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
    header: {
        brandName: "Wilson Turismo",
        brandTagline: "Fretamento e Turismo",
        phone: "(85) 99706-8113",
        ctaLabel: "Solicitar Orçamento",
        ctaHref: "#contato"
    },
    fleetSection: {
        title: "Nossa Frota",
        subtitle: "Veículos modernos e bem conservados para sua segurança e conforto",
        features: [
            { id: "capacity", type: "capacity", icon: "users", label: "" },
            { id: "safety", type: "static", icon: "shield", label: "Seguro Total" },
            { id: "wifi", type: "static", icon: "wifi", label: "Wi-Fi" }
        ]
    },
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
    auth: {
        users: [{ id: "user-1", email: "admin@wilsonturismo.com", password: "admin123" }]
    }
}

export async function getSiteContent(): Promise<SiteContent> {
    noStore()
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
    noStore()
    try {
        const adminDb = getAdminDb()
        if (adminDb) {
            await adminDb.doc(firestoreDocPath).set(newContent, { merge: false })
            return { success: true }
        }

        if (process.env.VERCEL) {
            return {
                success: false,
                error: "Na hospedagem (Vercel), a edição exige Firebase Admin. Configure FIREBASE_SERVICE_ACCOUNT_JSON para salvar no Firestore."
            }
        }

        await fs.writeFile(dataPath, JSON.stringify(newContent, null, 2), "utf-8")
        return { success: true }
    } catch (error) {
        console.error("Error updating site content:", error)
        return { success: false, error: "Falha ao salvar conteúdo." }
    }
}

export async function uploadPublicFile(formData: FormData): Promise<{ success: true; url: string } | { success: false; error: string }> {
    try {
        if (process.env.VERCEL) {
            return {
                success: false,
                error: "Na hospedagem (Vercel), upload local não funciona. Configure Firebase Storage (FIREBASE_SERVICE_ACCOUNT_JSON)."
            }
        }

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

export async function uploadManagedFile(formData: FormData): Promise<{ success: true; url: string } | { success: false; error: string }> {
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
    const objectName = `${safePrefix}/${finalName}`

    if (ensureAdminApp()) {
        const bucketName =
            process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
            process.env.FIREBASE_STORAGE_BUCKET?.trim()

        if (bucketName) {
            try {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                const bucket = getAdminStorage().bucket(bucketName)
                const remoteFile = bucket.file(objectName)

                await remoteFile.save(buffer, {
                    resumable: false,
                    metadata: {
                        contentType: file.type || "application/octet-stream"
                    }
                })

                const [signedUrl] = await remoteFile.getSignedUrl({
                    action: "read",
                    expires: "01-01-2500"
                })

                return { success: true, url: signedUrl }
            } catch {
                if (process.env.VERCEL) {
                    return { success: false, error: "Falha no upload para Firebase Storage. Verifique credenciais, bucket e permissões." }
                }
            }
        } else if (process.env.VERCEL) {
            return {
                success: false,
                error: "Bucket do Firebase Storage não configurado. Defina NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET (ou FIREBASE_STORAGE_BUCKET)."
            }
        }
    } else if (process.env.VERCEL) {
        return {
            success: false,
            error: "Firebase Admin não configurado. Defina FIREBASE_SERVICE_ACCOUNT_JSON na hospedagem para liberar uploads."
        }
    }

    return uploadPublicFile(formData)
}
