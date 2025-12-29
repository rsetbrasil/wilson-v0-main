import { Facebook, Instagram, Mail, Phone } from "lucide-react"
import { getSiteContent } from "@/lib/actions"

export async function Footer() {
  const content = await getSiteContent()
  const { footer, contact } = content

  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">W</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold">Wilson Turismo</span>
                <span className="text-xs text-secondary-foreground/70">Fretamento e Turismo</span>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/80">
              {footer.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors">
                  Fretamento
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors">
                  Turismo
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors">
                  Aluguel de Vans
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-primary transition-colors">
                  Excursões
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Destinos</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>
                <a href="#destinos" className="hover:text-primary transition-colors">
                  Morro Branco
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-primary transition-colors">
                  Canoa Quebrada
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-primary transition-colors">
                  Praia das Fontes
                </a>
              </li>
              <li>
                <a href="#destinos" className="hover:text-primary transition-colors">
                  Beach Park
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3 text-sm text-secondary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{contact.email}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 text-center text-sm text-secondary-foreground/70">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
