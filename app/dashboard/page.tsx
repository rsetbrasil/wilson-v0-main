"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, User, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getSiteContent, updateSiteContent, type SiteContent } from "@/lib/actions"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

export default function DashboardPage() {
    const router = useRouter()
    const [content, setContent] = useState<SiteContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        getSiteContent().then((data) => {
            const defaultFleetFeatures: SiteContent["fleetSection"]["features"] = [
                { id: "capacity", type: "capacity", icon: "users", label: "" },
                { id: "safety", type: "static", icon: "shield", label: "Seguro Total" },
                { id: "wifi", type: "static", icon: "wifi", label: "Wi-Fi" }
            ]

            const normalizedHeader = {
                brandName: data.header?.brandName ?? "Wilson Turismo",
                brandTagline: data.header?.brandTagline ?? "Fretamento e Turismo",
                phone: data.header?.phone ?? "(85) 99706-8113",
                ctaLabel: data.header?.ctaLabel ?? "Solicitar Orçamento",
                ctaHref: data.header?.ctaHref ?? "#contato"
            }

            const legacyFleetSection = data.fleetSection as any
            const legacySafetyLabel = typeof legacyFleetSection?.safetyLabel === "string" ? legacyFleetSection.safetyLabel : undefined
            const legacyWifiLabel = typeof legacyFleetSection?.wifiLabel === "string" ? legacyFleetSection.wifiLabel : undefined

            const normalizedFleetSection = {
                title: data.fleetSection?.title ?? "Nossa Frota",
                subtitle: data.fleetSection?.subtitle ?? "Veículos modernos e bem conservados para sua segurança e conforto",
                features:
                    data.fleetSection?.features?.length
                        ? data.fleetSection.features
                        : [
                              defaultFleetFeatures[0],
                              { id: "safety", type: "static" as const, icon: "shield" as const, label: legacySafetyLabel ?? defaultFleetFeatures[1].label },
                              { id: "wifi", type: "static" as const, icon: "wifi" as const, label: legacyWifiLabel ?? defaultFleetFeatures[2].label }
                          ] as SiteContent["fleetSection"]["features"]
            }
            const normalizedContact = {
                ...data.contact,
                phones: data.contact.phones?.length ? data.contact.phones : data.contact.phone ? [data.contact.phone] : [],
                officeHours: data.contact.officeHours ?? [],
                sectionTitle: data.contact.sectionTitle ?? "Entre em Contato",
                sectionSubtitle:
                    data.contact.sectionSubtitle ?? "Estamos prontos para atender você e planejar sua próxima viagem",
                location: data.contact.location ?? "",
                formTitle: data.contact.formTitle ?? "Solicite um Orçamento",
                formSubmitLabel: data.contact.formSubmitLabel ?? "Enviar Solicitação"
            }
            setContent({ ...data, header: normalizedHeader, fleetSection: normalizedFleetSection, contact: normalizedContact })
            setIsLoading(false)
        })
    }, [])

    const handleLogout = () => {
        router.push("/login")
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content) return

        setIsSaving(true)
        const result = await updateSiteContent(content)
        setIsSaving(false)

        if (result.success) {
            toast.success("Conteúdo atualizado com sucesso!")
            router.refresh()
        } else {
            toast.error("Erro ao atualizar conteúdo.")
        }
    }

    const updateField = (section: keyof SiteContent, field: string, value: string) => {
        if (!content) return
        // @ts-ignore - dynamic key access
        setContent({
            ...content,
            [section]: {
                // @ts-ignore
                ...content[section],
                [field]: value
            }
        })
    }

    // Helpers for Array handling
    const updateArrayItem = (section: 'services' | 'destinations' | 'fleet', index: number, field: string, value: string) => {
        if (!content) return
        const newArray = [...content[section]]
        // @ts-ignore
        newArray[index] = { ...newArray[index], [field]: value }
        setContent({ ...content, [section]: newArray })
    }

    const updateFleetFeature = (index: number, patch: Partial<SiteContent["fleetSection"]["features"][number]>) => {
        if (!content) return
        const nextFeatures = [...(content.fleetSection.features ?? [])]
        const current = nextFeatures[index]
        if (!current) return
        nextFeatures[index] = { ...current, ...patch }
        setContent({ ...content, fleetSection: { ...content.fleetSection, features: nextFeatures } })
    }

    const addFleetFeature = () => {
        if (!content) return
        const nextFeatures = [
            ...(content.fleetSection.features ?? []),
            { id: `custom-${Date.now()}`, type: "static", icon: "none", label: "" }
        ] as SiteContent["fleetSection"]["features"]
        setContent({ ...content, fleetSection: { ...content.fleetSection, features: nextFeatures } })
    }

    const removeFleetFeature = (index: number) => {
        if (!content) return
        const nextFeatures = [...(content.fleetSection.features ?? [])]
        nextFeatures.splice(index, 1)
        setContent({ ...content, fleetSection: { ...content.fleetSection, features: nextFeatures } })
    }

    const updateContactStringListItem = (field: 'phones' | 'officeHours', index: number, value: string) => {
        if (!content) return
        const nextList = [...(content.contact[field] ?? [])]
        nextList[index] = value

        const nextContact = {
            ...content.contact,
            [field]: nextList
        } as SiteContent["contact"]

        if (field === 'phones') {
            nextContact.phone = nextList[0] ?? ""
        }

        setContent({ ...content, contact: nextContact })
    }

    const addContactStringListItem = (field: 'phones' | 'officeHours') => {
        if (!content) return
        const nextList = [...(content.contact[field] ?? []), ""]

        const nextContact = {
            ...content.contact,
            [field]: nextList
        } as SiteContent["contact"]

        if (field === 'phones' && !nextContact.phone) {
            nextContact.phone = nextList[0] ?? ""
        }

        setContent({ ...content, contact: nextContact })
    }

    const removeContactStringListItem = (field: 'phones' | 'officeHours', index: number) => {
        if (!content) return
        const nextList = [...(content.contact[field] ?? [])]
        nextList.splice(index, 1)

        const nextContact = {
            ...content.contact,
            [field]: nextList
        } as SiteContent["contact"]

        if (field === 'phones') {
            nextContact.phone = nextList[0] ?? ""
        }

        setContent({ ...content, contact: nextContact })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando dados...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/40 p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Gerencie todo o conteúdo do site.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-full border">
                            <User className="h-4 w-4" />
                            {content?.auth.email.split('@')[0] || 'admin'}
                        </div>
                        <Button variant="outline" onClick={handleLogout} className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Sair
                        </Button>
                        <Button asChild>
                            <Link href="/">Ir para o Site</Link>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSave}>
                    <div className="flex justify-end mb-4">
                        <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
                            {isSaving ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Todas Alterações</>}
                        </Button>
                    </div>

                    <Tabs defaultValue="general" className="space-y-4">
                        <TabsList className="bg-background border h-auto flex-wrap p-2">
                            <TabsTrigger value="general">Geral (Hero/Contato)</TabsTrigger>
                            <TabsTrigger value="services">Serviços</TabsTrigger>
                            <TabsTrigger value="destinations">Destinos</TabsTrigger>
                            <TabsTrigger value="fleet">Frota</TabsTrigger>
                            <TabsTrigger value="about">Sobre/Rodapé</TabsTrigger>
                            <TabsTrigger value="security">Segurança</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general">
                            <Card>
                                <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4 border p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Cabeçalho</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Nome</Label>
                                                <Input value={content?.header.brandName || ''} onChange={(e) => updateField('header', 'brandName', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Subtítulo</Label>
                                                <Input value={content?.header.brandTagline || ''} onChange={(e) => updateField('header', 'brandTagline', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Telefone</Label>
                                                <Input value={content?.header.phone || ''} onChange={(e) => updateField('header', 'phone', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Botão (texto)</Label>
                                                <Input value={content?.header.ctaLabel || ''} onChange={(e) => updateField('header', 'ctaLabel', e.target.value)} />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Botão (link)</Label>
                                                <Input value={content?.header.ctaHref || ''} onChange={(e) => updateField('header', 'ctaHref', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Hero */}
                                    <div className="space-y-4 border p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Topo do Site (Hero)</h3>
                                        <div className="space-y-2">
                                            <Label>Título Principal</Label>
                                            <Input value={content?.hero.title || ''} onChange={(e) => updateField('hero', 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Descrição</Label>
                                            <Textarea value={content?.hero.description || ''} onChange={(e) => updateField('hero', 'description', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Imagem de Fundo</Label>
                                            <ImageUpload
                                                value={content?.hero.backgroundImage || ''}
                                                onChange={(url) => updateField('hero', 'backgroundImage', url)}
                                                pathPrefix="hero"
                                                recommendedSize="1920x1080px (Alta Qualidade)"
                                            />
                                        </div>
                                    </div>
                                    {/* Contact */}
                                    <div className="space-y-4 border p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Contato</h3>
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Título da Seção</Label>
                                                    <Input value={content?.contact.sectionTitle || ''} onChange={(e) => updateField('contact', 'sectionTitle', e.target.value)} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Subtítulo da Seção</Label>
                                                    <Textarea value={content?.contact.sectionSubtitle || ''} onChange={(e) => updateField('contact', 'sectionSubtitle', e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Telefone Principal</Label>
                                                    <Input
                                                        value={content?.contact.phone || ''}
                                                        onChange={(e) => {
                                                            if (!content) return
                                                            const nextPhones = [...(content.contact.phones ?? [])]
                                                            if (nextPhones.length === 0) nextPhones.push(e.target.value)
                                                            else nextPhones[0] = e.target.value
                                                            setContent({
                                                                ...content,
                                                                contact: { ...content.contact, phone: e.target.value, phones: nextPhones }
                                                            })
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input value={content?.contact.email || ''} onChange={(e) => updateField('contact', 'email', e.target.value)} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Localização</Label>
                                                    <Input value={content?.contact.location || ''} onChange={(e) => updateField('contact', 'location', e.target.value)} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Endereço</Label>
                                                    <Input value={content?.contact.address || ''} onChange={(e) => updateField('contact', 'address', e.target.value)} />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-4">
                                                    <Label>Telefones (lista)</Label>
                                                    <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addContactStringListItem('phones')}>
                                                        <Plus className="h-4 w-4" />
                                                        Adicionar
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {(content?.contact.phones ?? []).map((phone, index) => (
                                                        <div key={`${index}`} className="flex items-center gap-2">
                                                            <Input value={phone} onChange={(e) => updateContactStringListItem('phones', index, e.target.value)} />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeContactStringListItem('phones', index)}
                                                                aria-label="Remover telefone"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-4">
                                                    <Label>Horário de Atendimento (linhas)</Label>
                                                    <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addContactStringListItem('officeHours')}>
                                                        <Plus className="h-4 w-4" />
                                                        Adicionar
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {(content?.contact.officeHours ?? []).map((line, index) => (
                                                        <div key={`${index}`} className="flex items-center gap-2">
                                                            <Input value={line} onChange={(e) => updateContactStringListItem('officeHours', index, e.target.value)} />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => removeContactStringListItem('officeHours', index)}
                                                                aria-label="Remover horário"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Título do Formulário</Label>
                                                    <Input value={content?.contact.formTitle || ''} onChange={(e) => updateField('contact', 'formTitle', e.target.value)} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Texto do Botão</Label>
                                                    <Input value={content?.contact.formSubmitLabel || ''} onChange={(e) => updateField('contact', 'formSubmitLabel', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="services">
                            <Card>
                                <CardHeader><CardTitle>Serviços</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    {content?.services.map((service, index) => (
                                        <div key={index} className="border p-4 rounded-lg space-y-3 relative bg-background/50">
                                            <div className="bg-muted px-2 py-1 absolute top-2 right-2 rounded text-xs">#{index + 1}</div>
                                            <div className="space-y-2">
                                                <Label>Título do Serviço</Label>
                                                <Input value={service.title} onChange={(e) => updateArrayItem('services', index, 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Descrição</Label>
                                                <Textarea value={service.description} onChange={(e) => updateArrayItem('services', index, 'description', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="text-center text-sm text-muted-foreground p-2">
                                        Para adicionar novos serviços, favor contatar o suporte técnico em atualizações futuras.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="destinations">
                            <Card>
                                <CardHeader><CardTitle>Destinos Populares</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {content?.destinations.map((dest, index) => (
                                            <div key={index} className="border p-4 rounded-lg space-y-3">
                                                <div className="space-y-2">
                                                    <Label>Nome do Destino</Label>
                                                    <Input value={dest.name} onChange={(e) => updateArrayItem('destinations', index, 'name', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Imagem</Label>
                                                    <ImageUpload
                                                        value={dest.image}
                                                        onChange={(url) => updateArrayItem('destinations', index, 'image', url)}
                                                        pathPrefix="destinations"
                                                        recommendedSize="800x600px"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="fleet">
                            <Card>
                                <CardHeader><CardTitle>Nossa Frota</CardTitle></CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-4 border p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Seção Frota</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Título da Seção</Label>
                                                <Input value={content?.fleetSection.title || ''} onChange={(e) => updateField('fleetSection', 'title', e.target.value)} />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label>Subtítulo da Seção</Label>
                                                <Textarea value={content?.fleetSection.subtitle || ''} onChange={(e) => updateField('fleetSection', 'subtitle', e.target.value)} />
                                            </div>
                                            <div className="space-y-3 md:col-span-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <Label>Ícones/Features do Card</Label>
                                                    <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addFleetFeature}>
                                                        <Plus className="h-4 w-4" />
                                                        Adicionar
                                                    </Button>
                                                </div>
                                                <div className="space-y-3">
                                                    {(content?.fleetSection.features ?? []).map((feature, index) => (
                                                        <div key={feature.id} className="grid md:grid-cols-12 gap-2 items-end border rounded-lg p-3">
                                                            <div className="md:col-span-3 space-y-1">
                                                                <Label>Tipo</Label>
                                                                <select
                                                                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                                                    value={feature.type}
                                                                    onChange={(e) => updateFleetFeature(index, { type: e.target.value as any })}
                                                                >
                                                                    <option value="capacity">Capacidade</option>
                                                                    <option value="static">Texto</option>
                                                                </select>
                                                            </div>
                                                            <div className="md:col-span-3 space-y-1">
                                                                <Label>Ícone</Label>
                                                                <select
                                                                    className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                                                    value={feature.icon}
                                                                    onChange={(e) => updateFleetFeature(index, { icon: e.target.value as any })}
                                                                >
                                                                    <option value="none">Sem ícone</option>
                                                                    <option value="users">Users</option>
                                                                    <option value="shield">Shield</option>
                                                                    <option value="wifi">Wifi</option>
                                                                    <option value="check-circle">CheckCircle</option>
                                                                    <option value="star">Star</option>
                                                                    <option value="map-pin">MapPin</option>
                                                                    <option value="clock">Clock</option>
                                                                </select>
                                                            </div>
                                                            <div className="md:col-span-5 space-y-1">
                                                                <Label>Texto</Label>
                                                                <Input
                                                                    value={feature.type === "capacity" ? "usa o campo Capacidade do veículo" : (feature.label ?? "")}
                                                                    disabled={feature.type === "capacity"}
                                                                    onChange={(e) => updateFleetFeature(index, { label: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="md:col-span-1 flex justify-end">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    aria-label="Remover feature"
                                                                    onClick={() => removeFleetFeature(index)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {content?.fleet.map((item, index) => (
                                        <div key={index} className="border p-4 rounded-lg space-y-4">
                                            <h4 className="font-semibold text-primary">Veículo #{index + 1}</h4>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Nome/Modelo</Label>
                                                    <Input value={item.title} onChange={(e) => updateArrayItem('fleet', index, 'title', e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Capacidade</Label>
                                                    <Input value={item.capacity} onChange={(e) => updateArrayItem('fleet', index, 'capacity', e.target.value)} />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Imagem</Label>
                                                    <ImageUpload
                                                        value={item.image}
                                                        onChange={(url) => updateArrayItem('fleet', index, 'image', url)}
                                                        pathPrefix="fleet"
                                                        recommendedSize="1200x800px"
                                                    />
                                                </div>
                                                <div className="space-y-2 md:col-span-2">
                                                    <Label>Descrição</Label>
                                                    <Textarea value={item.description} onChange={(e) => updateArrayItem('fleet', index, 'description', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="about">
                            <Card>
                                <CardHeader><CardTitle>Sobre e Rodapé</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4 border p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Página Sobre</h3>
                                        <div className="space-y-2">
                                            <Label>Título Principal</Label>
                                            <Input value={content?.about.title || ''} onChange={(e) => updateField('about', 'title', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Texto Principal (Parágrafo 1)</Label>
                                            <Textarea className="h-24" value={content?.about.text1 || ''} onChange={(e) => updateField('about', 'text1', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Texto Secundário (Parágrafo 2)</Label>
                                            <Textarea className="h-24" value={content?.about.text2 || ''} onChange={(e) => updateField('about', 'text2', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>URL do Vídeo</Label>
                                            <Input value={content?.about.videoUrl || ''} onChange={(e) => updateField('about', 'videoUrl', e.target.value)} placeholder="https://youtu.be/... ou https://.../video.mp4" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Upload de Vídeo (MP4)</Label>
                                            <ImageUpload
                                                value={content?.about.videoUrl || ''}
                                                onChange={(url) => updateField('about', 'videoUrl', url)}
                                                pathPrefix="about-video"
                                                recommendedSize="MP4"
                                                accept="video/mp4"
                                                preview="video"
                                                emptyLabel="Upload de Vídeo (MP4)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Poster do Vídeo (opcional)</Label>
                                            <ImageUpload
                                                value={content?.about.videoPoster || ''}
                                                onChange={(url) => updateField('about', 'videoPoster', url)}
                                                pathPrefix="about"
                                                recommendedSize="1280x720px"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 border p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Rodapé</h3>
                                        <div className="space-y-2">
                                            <Label>Descrição Curta</Label>
                                            <Input value={content?.footer.description || ''} onChange={(e) => updateField('footer', 'description', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Copyright</Label>
                                            <Input value={content?.footer.copyright || ''} onChange={(e) => updateField('footer', 'copyright', e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Segurança e Acesso</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4 border p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold">Credenciais do Administrador</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Email de Login</Label>
                                                <Input
                                                    type="email"
                                                    value={content?.auth.email || ''}
                                                    onChange={(e) => updateField('auth', 'email', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nova Senha</Label>
                                                <Input
                                                    type="password"
                                                    value={content?.auth.password || ''}
                                                    onChange={(e) => updateField('auth', 'password', e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground italic">
                                                    Mínimo de 6 caracteres recomendado.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-amber-50 border-amber-200 border p-4 rounded-lg flex items-start gap-3">
                                        <div className="bg-amber-100 p-2 rounded-full">
                                            <Save className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-amber-900">Atenção</p>
                                            <p className="text-sm text-amber-700">
                                                Ao alterar essas credenciais, você precisará usá-las no próximo login.
                                                Certifique-se de salvá-las em um local seguro.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </form>
            </div>
        </div>
    )
}
