import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Destinations } from "@/components/destinations"
import { About } from "@/components/about"
import { Fleet } from "@/components/fleet"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { getSiteContent } from "@/lib/actions"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const content = await getSiteContent()
  return (
    <main className="min-h-screen">
      <Header header={content.header} />
      {await Hero()}
      {await Services()}
      {await Destinations()}
      {await About()}
      {await Fleet()}
      {await Contact()}
      {await Footer()}
    </main>
  )
}
