import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { getSiteContent } from "@/lib/actions"

export async function Destinations() {
  const content = await getSiteContent()
  const destinations = content.destinations

  return (
    <section id="destinos" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Turismo Radical e Ecológico</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Descubra o mundo com conforto e comodidade com nossos serviços de turismo e fretamento. Não perca a chance
            de explorar destinos incríveis e criar memórias inesquecíveis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {destinations.map((destination, index) => (
            <Card key={index} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-lg">{destination.name}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-primary text-primary-foreground border-none">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">3 praias em um dia!</h3>
              <p className="text-lg mb-2 font-medium">Morro Branco / Praia das Fontes / Canoa Quebrada</p>
              <p className="mb-6 text-primary-foreground/90 leading-relaxed">
                Começaremos pelo Morro Branco e pela Praia das Fontes, onde passaremos cerca de duas horas passeando por
                labirintos de areias coloridas e mar límpido. Se preferir, você pode fazer um passeio de buggy, uma boa
                oportunidade para conhecer a bela Lagoa do Uruaú.
              </p>
              <Button variant="secondary" size="lg">
                Reservar Seu Lugar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
