import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, Wifi } from "lucide-react"
import { getSiteContent } from "@/lib/actions"

export async function Fleet() {
  const content = await getSiteContent()
  const fleet = content.fleet

  return (
    <section id="frota" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossa Frota</h2>
          <p className="text-lg text-muted-foreground">
            Veículos modernos e bem conservados para sua segurança e conforto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {fleet.map((item, index) => (
            <Card key={index} className="overflow-hidden border-border">
              <div className="aspect-video relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {item.description}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{item.capacity}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Seguro Total</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Wifi className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Wi-Fi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
