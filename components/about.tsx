import { getSiteContent } from "@/lib/actions"

export async function About() {
  const content = await getSiteContent()
  const { about } = content

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{about.title}</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{about.text1}</p>
              <p>{about.text2}</p>
              <p className="font-semibold text-foreground">
                Comprometidos com a excelência, proporcionamos experiências memoráveis em cada viagem.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/modern-tour-bus-interior.jpg"
                alt="Interior de ônibus"
                className="rounded-lg w-full h-48 object-cover"
              />
              <img
                src="/tour-guide-with-tourists.jpg"
                alt="Guia com turistas"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="/beach-tourism-ceara-brazil.jpg"
                alt="Turismo praia"
                className="rounded-lg w-full h-64 object-cover"
              />
              <img
                src="/comfortable-bus-seats.jpg"
                alt="Assentos confortáveis"
                className="rounded-lg w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
