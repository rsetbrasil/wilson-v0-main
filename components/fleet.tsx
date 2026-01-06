import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, Wifi, CheckCircle, Star, MapPin, Clock } from "lucide-react"
import { getSiteContent } from "@/lib/actions"

export async function Fleet() {
  const content = await getSiteContent()
  const fleet = content.fleet
  const fleetSection = content.fleetSection
  const iconMap = {
    users: Users,
    shield: Shield,
    wifi: Wifi,
    "check-circle": CheckCircle,
    star: Star,
    "map-pin": MapPin,
    clock: Clock
  } as const

  return (
    <section id="frota" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{fleetSection.title}</h2>
          <p className="text-lg text-muted-foreground">
            {fleetSection.subtitle}
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
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: `repeat(${Math.max(1, fleetSection.features.length)}, minmax(0, 1fr))` }}
                >
                  {fleetSection.features.map((feature) => {
                    const Icon = feature.icon !== "none" ? (iconMap as any)[feature.icon] : null
                    const text =
                      feature.type === "capacity" ? item.capacity : feature.label

                    const shouldRender =
                      feature.type === "capacity" ||
                      Boolean((feature.label ?? "").trim()) ||
                      feature.icon !== "none"

                    if (!shouldRender) return null

                    return (
                      <div key={feature.id} className="flex flex-col items-center gap-2">
                        {Icon ? <Icon className="h-6 w-6 text-primary" /> : null}
                        <span className="text-sm font-medium">{text}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
