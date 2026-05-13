import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  keywords?: string[];
};

type PhotoGalleryProps = {
  images: GalleryImage[];
  layout?: "carousel" | "grid";
  enableLightbox?: boolean;
  maxThumbnails?: number;
  className?: string;
  mainHeightClass?: string;
};

const PhotoGallery = ({
  images,
  layout = "carousel",
  enableLightbox = true,
  maxThumbnails = 6,
  className,
  mainHeightClass = "h-72 md:h-96",
}: PhotoGalleryProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = images.length;
  const hasMultiple = total > 1;

  const goPrev = useCallback(
    (current: number, setter: (n: number) => void) => setter((current - 1 + total) % total),
    [total],
  );
  const goNext = useCallback(
    (current: number, setter: (n: number) => void) => setter((current + 1) % total),
    [total],
  );

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") setLightboxIdx((i) => (i === null ? null : (i - 1 + total) % total));
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? null : (i + 1) % total));
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightboxIdx, total]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent, current: number, setter: (n: number) => void) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) goNext(current, setter);
      else goPrev(current, setter);
    }
    touchStartX.current = null;
  };

  if (!images.length) return null;

  // GRID layout
  if (layout === "grid") {
    return (
      <>
        <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", className)}>
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => enableLightbox && setLightboxIdx(i)}
              className="group relative overflow-hidden rounded-lg aspect-square focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                width={1408}
                height={768}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {enableLightbox && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </button>
          ))}
        </div>
        {lightboxIdx !== null && renderLightbox()}
      </>
    );
  }

  // CAROUSEL layout
  return (
    <figure className={cn("w-full max-w-full min-w-0 overflow-hidden m-0", className)}>
      <div
        className={cn("relative group rounded-xl overflow-hidden bg-muted", mainHeightClass)}
        onTouchStart={onTouchStart}
        onTouchEnd={(e) => onTouchEnd(e, activeIdx, setActiveIdx)}
      >
        <img
          key={activeIdx}
          src={images[activeIdx].src}
          alt={images[activeIdx].alt}
          loading="lazy"
          decoding="async"
          width={1408}
          height={768}
          data-keywords={images[activeIdx].keywords?.join(",") || undefined}
          className="w-full h-full object-cover animate-in fade-in duration-300"
        />

        {enableLightbox && (
          <button
            type="button"
            onClick={() => setLightboxIdx(activeIdx)}
            aria-label="Agrandir l'image"
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors"
          >
            <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev(activeIdx, setActiveIdx);
              }}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext(activeIdx, setActiveIdx);
              }}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
              {activeIdx + 1} / {total}
            </div>
          </>
        )}
      </div>

      {images[activeIdx].caption && (
        <figcaption className="mt-3 max-w-full break-words text-sm font-body text-muted-foreground italic border-l-2 border-primary pl-3">
          {images[activeIdx].caption}
        </figcaption>
      )}

      {hasMultiple && (
        <div
          className="mt-3 flex max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {images.slice(0, Math.min(maxThumbnails, total)).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              aria-label={`Voir image ${i + 1}`}
              className={cn(
                "shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
                i === activeIdx ? "border-primary opacity-100" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" width={80} height={80} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxIdx !== null && renderLightbox()}
    </div>
  );

  function renderLightbox() {
    if (lightboxIdx === null) return null;
    const img = images[lightboxIdx];
    return (
      <div
        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center animate-in fade-in duration-200"
        onClick={() => setLightboxIdx(null)}
        onTouchStart={onTouchStart}
        onTouchEnd={(e) =>
          onTouchEnd(e, lightboxIdx, (n) => setLightboxIdx(n))
        }
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIdx(null);
          }}
          aria-label="Fermer"
          className="absolute top-4 right-4 text-white hover:text-primary transition-colors p-2 z-10"
        >
          <X className="w-8 h-8" />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((lightboxIdx - 1 + total) % total);
              }}
              aria-label="Image précédente"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-primary bg-black/40 hover:bg-black/60 rounded-full p-3 transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((lightboxIdx + 1) % total);
              }}
              aria-label="Image suivante"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-primary bg-black/40 hover:bg-black/60 rounded-full p-3 transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div
          className="max-w-[95vw] max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            key={lightboxIdx}
            src={img.src}
            alt={img.alt}
            className="max-w-full max-h-[85vh] object-contain animate-in fade-in duration-200"
          />
          {img.caption && (
            <p className="text-white/80 text-sm mt-3 text-center font-body">{img.caption}</p>
          )}
        </div>

        {hasMultiple && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-medium px-3 py-1.5 rounded-full">
            {lightboxIdx + 1} / {total}
          </div>
        )}
      </div>
    );
  }
};

export default PhotoGallery;
