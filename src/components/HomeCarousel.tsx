import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img1 from "@/assets/carrousel-1.jpg";
import img2 from "@/assets/carrousel-2.jpg";
import img3 from "@/assets/carrousel-3.jpg";
import img4 from "@/assets/carrousel-4.jpg";
import img5 from "@/assets/carrousel-5.jpg";

const slides = [
  { src: img1, alt: "Pose d'étanchéité bitumineuse soudée au chalumeau - signature EQUATION L'efficacité en Action" },
  { src: img2, alt: "Toiture végétalisée réalisée par EQUATION avec vue sur les volcans d'Auvergne" },
  { src: img3, alt: "Pose manuelle d'étanchéité bitumineuse sur dalles - savoir-faire EQUATION" },
  { src: img4, alt: "Terrasse carrelée effet bois en bord de piscine - réalisation EQUATION" },
  { src: img5, alt: "Chantier d'étanchéité de toiture terrasse industrielle avec isolation - EQUATION Auvergne" },
];

const HomeCarousel = () => {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (i: number) => setIdx((i + slides.length) % slides.length);

  return (
    <section
      className="bg-noir"
      aria-label="Carrousel des réalisations EQUATION"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative w-full overflow-hidden h-[350px] md:h-[550px]"
        aria-live="polite"
      >
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.src}
            alt={s.alt}
            width={1600}
            height={900}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        <button
          type="button"
          onClick={() => go(idx - 1)}
          aria-label="Photo précédente"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-noir/50 hover:bg-noir/70 text-primary-foreground rounded-full p-2 transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={() => go(idx + 1)}
          aria-label="Photo suivante"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-noir/50 hover:bg-noir/70 text-primary-foreground rounded-full p-2 transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Aller à la photo ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-2 bg-primary-foreground/60 hover:bg-primary-foreground"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCarousel;
