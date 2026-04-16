import { useState } from "react";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import bitumenImg from "@/assets/bitumen-work.jpg";
import greenRoofImg from "@/assets/green-roof.jpg";
import teamImg from "@/assets/team-construction.jpg";
import ipeImg from "@/assets/ipe-terrace.jpg";
import heroImg from "@/assets/hero-home.jpg";

const categories = ["Tous", "Étanchéité Bitumineuse", "Toiture Végétalisée", "Dalles sur Plots", "Terrasse IPE", "Résine", "Recherche de Fuite"];

const projects = [
  { img: bitumenImg, cat: "Étanchéité Bitumineuse", title: "CPAM Nevers", desc: "6 toitures terrasses, grue GMA, isolation + étanchéité bicouche", surface: "2 500 m²" },
  { img: teamImg, cat: "Étanchéité Bitumineuse", title: "Nièvre Habitat Nevers", desc: "3 immeubles, isolation PU 100mm, garde-corps ODCO", surface: "1 800 m²" },
  { img: heroImg, cat: "Étanchéité Bitumineuse", title: "Groupe La Glacière", desc: "Verre cellulaire au bitume chaud pour Auvergne Habitat", surface: "1 200 m²" },
  { img: greenRoofImg, cat: "Toiture Végétalisée", title: "Assemblia Clermont-Fd", desc: "Végétalisation extensive toiture terrasse", surface: "800 m²" },
  { img: bitumenImg, cat: "Étanchéité Bitumineuse", title: "Université d'Auvergne", desc: "Bât. Paul Collomp — Réfection complète", surface: "800 m²" },
  { img: ipeImg, cat: "Résine", title: "Résidence Arverne", desc: "Square Habitat — 2 000 m² balcons, résine + carrelage collé", surface: "2 000 m²" },
  { img: ipeImg, cat: "Terrasse IPE", title: "Terrasse Privée IPE", desc: "Dalles IPE rectangulaires sur plots réglables", surface: "120 m²" },
  { img: greenRoofImg, cat: "Toiture Végétalisée", title: "Toiture sedum Murol", desc: "Végétalisation extensive avec sedum", surface: "400 m²" },
  { img: teamImg, cat: "Étanchéité Bitumineuse", title: "École Jean Alix", desc: "Extension groupe scolaire, étanchéité + zinguerie", surface: "600 m²" },
  { img: heroImg, cat: "Étanchéité Bitumineuse", title: "Romagnat", desc: "Réhabilitation 18 logements, étanchéité", surface: "1 500 m²" },
  { img: bitumenImg, cat: "Étanchéité Bitumineuse", title: "Centre Multi-Accueil Vic-le-Comte", desc: "Étanchéité neuf petite enfance", surface: "350 m²" },
  { img: teamImg, cat: "Étanchéité Bitumineuse", title: "16 logements Le Cendre", desc: "Étanchéité en accession sociale", surface: "900 m²" },
];

const RealisationsPage = () => {
  const [filter, setFilter] = useState("Tous");
  const filtered = filter === "Tous" ? projects : projects.filter((p) => p.cat === filter);

  return (
    <>
      <PageHero title="Nos Réalisations" subtitle="25 ans de chantiers d'exception en Auvergne et au-delà" />
      <Breadcrumbs items={[{ label: "Réalisations" }]} />

      <section className="container-main section-padding">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-subtitle font-medium transition-all ${
                filter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ScrollReveal key={`${p.title}-${i}`} delay={i * 80}>
              <div className="card-equation overflow-hidden">
                <div className="relative">
                  <img src={p.img} alt={`${p.title} étanchéité`} className="w-full h-52 object-cover" loading="lazy" width={400} height={300} />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-subtitle font-semibold px-3 py-1 rounded-full">
                    {p.cat}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-heading text-foreground">{p.title}</h3>
                  <p className="text-muted-foreground text-sm font-body mt-1">{p.desc}</p>
                  <p className="text-primary font-subtitle font-semibold text-sm mt-2">{p.surface}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
};

export default RealisationsPage;
