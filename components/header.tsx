"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Phone, LogIn } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  header?: {
    brandName?: string
    brandTagline?: string
    phone?: string
    ctaLabel?: string
    ctaHref?: string
  }
}

export function Header({ header }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerConfig = {
    brandName: header?.brandName ?? "Wilson Turismo",
    brandTagline: header?.brandTagline ?? "Fretamento e Turismo",
    phone: header?.phone ?? "(85) 99706-8113",
    ctaLabel: header?.ctaLabel ?? "Solicitar Orçamento",
    ctaHref: header?.ctaHref ?? "#contato"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-xl font-bold text-primary-foreground">W</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">{headerConfig.brandName}</span>
              <span className="text-[10px] text-muted-foreground">{headerConfig.brandTagline}</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#inicio" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Início
            </a>
            <a href="#servicos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Serviços
            </a>
            <a href="#destinos" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Destinos
            </a>
            <a href="#frota" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Frota
            </a>
            <a href="#contato" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contato
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-medium">{headerConfig.phone}</span>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <a href={headerConfig.ctaHref}>{headerConfig.ctaLabel}</a>
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="icon" aria-label="Login">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <a href="#inicio" className="text-sm font-medium">
                Início
              </a>
              <a href="#servicos" className="text-sm font-medium">
                Serviços
              </a>
              <a href="#destinos" className="text-sm font-medium">
                Destinos
              </a>
              <a href="#frota" className="text-sm font-medium">
                Frota
              </a>
              <a href="#contato" className="text-sm font-medium">
                Contato
              </a>
              <Button size="sm" className="w-full bg-primary" asChild>
                <a href={headerConfig.ctaHref}>{headerConfig.ctaLabel}</a>
              </Button>
              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
