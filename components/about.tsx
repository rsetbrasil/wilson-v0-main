import { getSiteContent } from "@/lib/actions"

function toYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "")
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v")
      return id ? `https://www.youtube.com/embed/${id}` : url
    }
    return url
  } catch {
    return url
  }
}

function toVimeoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes("vimeo.com")) return url
    const parts = parsed.pathname.split("/").filter(Boolean)
    const id = parts[0]
    return id ? `https://player.vimeo.com/video/${id}` : url
  } catch {
    return url
  }
}

export async function About() {
  const content = await getSiteContent()
  const { about } = content
  const videoUrl = about.videoUrl?.trim() ?? ""

  const isYouTube = videoUrl.includes("youtu.be") || videoUrl.includes("youtube.com")
  const isVimeo = videoUrl.includes("vimeo.com")
  const isDirectVideo = /\.(mp4|webm|ogg)(\?|#|$)/i.test(videoUrl)
  const iframeSrc = isYouTube ? toYouTubeEmbedUrl(videoUrl) : isVimeo ? toVimeoEmbedUrl(videoUrl) : videoUrl

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

          {videoUrl ? (
            <div className="w-full overflow-hidden rounded-lg border bg-muted">
              <div className="aspect-video">
                {isDirectVideo ? (
                  <video
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                    src={videoUrl}
                    poster={about.videoPoster || undefined}
                  />
                ) : (
                  <iframe
                    className="h-full w-full"
                    src={iframeSrc}
                    title="Vídeo - Quem Somos"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-lg border bg-muted">
              <div className="aspect-video" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
