"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { uploadManagedFile } from "@/lib/actions"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    disabled?: boolean
    pathPrefix?: string
    recommendedSize?: string
    accept?: string
    emptyLabel?: string
    preview?: "image" | "video"
}

export function ImageUpload({
    value,
    onChange,
    disabled,
    pathPrefix = "images",
    recommendedSize,
    accept = "image/*",
    emptyLabel = "Upload de Imagem",
    preview = "image"
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)

            const formData = new FormData()
            formData.append("file", file)
            formData.append("pathPrefix", pathPrefix)

            const result = await uploadManagedFile(formData)
            if (!result.success) {
                toast.error(result.error)
                return
            }

            onChange(result.url)
            toast.success("Upload concluído.")
        } catch (error) {
            console.error("Upload failed:", error)
            toast.error("Falha no upload. Verifique o console.")
        } finally {
            setIsUploading(false)
            e.target.value = ""
        }
    }

    const handleRemove = () => {
        onChange("")
    }

    return (
        <div className="space-y-4 w-full">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-[200px] h-[133px] rounded-md overflow-hidden border">
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                onClick={handleRemove}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {preview === "video" ? (
                            <video className="h-full w-full object-cover" src={value} controls preload="metadata" />
                        ) : (
                            <Image fill className="object-cover" alt="Image" src={value} />
                        )}
                    </div>
                ) : (
                    <div className="h-[133px] w-[200px] rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/5">
                        <div className="text-center p-4">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                            <p className="text-xs text-muted-foreground">{emptyLabel}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Input
                    type="file"
                    accept={accept}
                    disabled={disabled || isUploading}
                    onChange={handleUpload}
                    className="max-w-[300px]"
                />
                {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
            {recommendedSize && (
                <p className="text-xs text-muted-foreground italic">
                    Tamanho recomendado: {recommendedSize}
                </p>
            )}
        </div>
    )
}
