"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

export function Contact() {
  return (
    <section id="contato" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-lg text-muted-foreground">
            Estamos prontos para atender você e planejar sua próxima viagem
          </p>
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
                  <p className="text-muted-foreground">(85) 99706-8113</p>
                  <p className="text-muted-foreground">(85) 98750-7570</p>
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
                  <p className="text-muted-foreground">contato@wilsonturismo.com.br</p>
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
                  <p className="text-muted-foreground">Fortaleza, Ceará - Brasil</p>
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
                  <p className="text-muted-foreground">Segunda a Sexta: 8h às 18h</p>
                  <p className="text-muted-foreground">Sábado: 8h às 12h</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6">Solicite um Orçamento</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-2 block">
                    Nome
                  </label>
                  <Input id="name" placeholder="Seu nome completo" />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-2 block">
                    E-mail
                  </label>
                  <Input id="email" type="email" placeholder="seu@email.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="text-sm font-medium mb-2 block">
                    Telefone
                  </label>
                  <Input id="phone" type="tel" placeholder="(85) 99999-9999" />
                </div>
                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-2 block">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Conte-nos sobre sua necessidade de transporte ou turismo"
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Enviar Solicitação
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
