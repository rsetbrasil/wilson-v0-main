"use server"

import fs from "fs/promises"
import path from "path"

const dataPath = path.join(process.cwd(), "data", "site-content.json")

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
        phone: string
        email: string
        address: string
    }
    services: Service[]
    destinations: Destination[]
    about: {
        title: string
        text1: string
        text2: string
    }
    fleet: FleetItem[]
    footer: {
        description: string
        copyright: string
    }
    auth: AuthContent
}

export async function getSiteContent(): Promise<SiteContent> {
    try {
        const data = await fs.readFile(dataPath, "utf-8")
        return JSON.parse(data)
    } catch (error) {
        console.error("Error reading site content:", error)
        // Minimal fallback to prevent crash, ideally should be full structure
        return {
            hero: { title: "", description: "", backgroundImage: "" },
            contact: { phone: "", email: "", address: "" },
            services: [],
            destinations: [],
            about: { title: "", text1: "", text2: "" },
            fleet: [],
            footer: { description: "", copyright: "" },
            auth: { email: "admin@wilsonturismo.com", password: "admin123" }
        }
    }
}

export async function updateSiteContent(newContent: SiteContent) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(newContent, null, 2), "utf-8")
        return { success: true }
    } catch (error) {
        console.error("Error updating site content:", error)
        return { success: false, error: "Failed to update content" }
    }
}
