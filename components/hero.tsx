import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import { getSiteContent } from "@/lib/actions"

export async function Hero() {
  const content = await getSiteContent()

  return (
    <section
      id="inicio"
      className="relative min-h-[600px] flex items-center bg-secondary text-secondary-foreground overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url('${content.hero.backgroundImage}')` }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
            {content.hero.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-secondary-foreground/90 leading-relaxed">
            {content.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary-foreground/20 hover:bg-secondary-foreground/10 bg-transparent"
            >
              Conhecer Destinos
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
              <span className="text-sm font-medium">Frota Moderna</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
              <span className="text-sm font-medium">Motoristas Qualificados</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
              <span className="text-sm font-medium">Seguro Total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

