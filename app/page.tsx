import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Destinations } from "@/components/destinations"
import { About } from "@/components/about"
import { Fleet } from "@/components/fleet"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
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
