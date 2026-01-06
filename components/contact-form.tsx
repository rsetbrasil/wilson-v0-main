"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactFormProps {
  submitLabel: string
  phones: string[]
}

function toWhatsappPhone(rawPhone: string): string {
  const digits = (rawPhone ?? "").replace(/\D/g, "")
  if (!digits) return ""
  if (digits.startsWith("55")) return digits
  if (digits.length === 10 || digits.length === 11) return `55${digits}`
  return digits
}

export function ContactForm({ submitLabel, phones }: ContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const whatsappPhone = useMemo(() => toWhatsappPhone(phones[0] ?? ""), [phones])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const lines = [
      "Solicitação de Orçamento",
      "",
      `Nome: ${name}`,
      email.trim() ? `E-mail: ${email.trim()}` : null,
      `Telefone: ${phone}`,
      message.trim() ? "" : null,
      message.trim() ? `Mensagem: ${message.trim()}` : null
    ].filter(Boolean)

    const text = lines.join("\n")
    const url = whatsappPhone
      ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`

    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label htmlFor="name" className="text-sm font-medium mb-2 block">
          Nome
        </label>
        <Input id="name" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-medium mb-2 block">
          E-mail (opcional)
        </label>
        <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium mb-2 block">
          Telefone
        </label>
        <Input id="phone" type="tel" placeholder="(85) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="message" className="text-sm font-medium mb-2 block">
          Mensagem
        </label>
        <Textarea
          id="message"
          placeholder="Conte-nos sobre sua necessidade de transporte ou turismo"
          className="min-h-[120px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        {submitLabel}
      </Button>
    </form>
  )
}

