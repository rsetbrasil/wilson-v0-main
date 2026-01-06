import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { getSiteContent } from "@/lib/actions"
import { ContactForm } from "@/components/contact-form"

export async function Contact() {
  const content = await getSiteContent()

  const phones =
    content.contact.phones?.length ? content.contact.phones : content.contact.phone ? [content.contact.phone] : []

  const officeHours = content.contact.officeHours ?? []

  return (
    <section id="contato" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.contact.sectionTitle}</h2>
          <p className="text-lg text-muted-foreground">{content.contact.sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            <Card className="border-border">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Telefone</h3>
                  {phones.map((phone) => (
                    <p key={phone} className="text-muted-foreground">
                      {phone}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">E-mail</h3>
                  <p className="text-muted-foreground">{content.contact.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Localização</h3>
                  <p className="text-muted-foreground">{content.contact.location || content.contact.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Horário de Atendimento</h3>
                  {officeHours.map((line) => (
                    <p key={line} className="text-muted-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6">{content.contact.formTitle}</h3>
              <ContactForm submitLabel={content.contact.formSubmitLabel} phones={phones} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
