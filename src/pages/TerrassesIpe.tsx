import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import ipeImg from "@/assets/ipe-terrace.jpg";

const sections = [
  {
    id: "lames", title: "Lames IPE",
    desc: "Lames de terrasse en bois IPE massif. Fixation invisible ou traditionnelle. Finition lisse ou striée antidérapante. Le bois IPE offre une teinte brun-rouge chaude et une résistance exceptionnelle aux insectes, à l'humidité et aux UV.",
    points: ["Classe de durabilité 1 (>50 ans)", "Densité exceptionnelle : 1 050 kg/m³", "Finition lisse ou striée antidérapante", "Fixation invisible disponible"],
  },
  {
    id: "dalles", title: "Dalles IPE",
    desc: "Dalles modulaires IPE pour terrasses sur plots. Installation rapide et esthétique contemporaine. Format carré ou rectangulaire, ces dalles s'intègrent parfaitement aux aménagements modernes.",
    points: ["Installation rapide sur plots", "Format carré 50x50 ou 100x100", "Esthétique contemporaine", "Remplacement unitaire possible"],
  },
  {
    id: "margelles", title: "Margelles Piscine",
    desc: "Margelles de piscine en IPE massif. Finition antidérapante R11 pour une sécurité optimale aux abords du bassin. Le bois IPE ne chauffe pas excessivement au soleil et résiste au chlore.",
    points: ["Antidérapant classé R11", "Résistant au chlore", "Ne chauffe pas au soleil", "Esthétique premium naturelle"],
  },
  {
    id: "bardage", title: "Bardage IPE",
    desc: "Bardage extérieur en lames IPE. Vieillissement noble vers un gris argenté naturel ou entretien huilé pour conserver la teinte d'origine. Le bardage IPE apporte caractère et modernité à toute façade.",
    points: ["Vieillissement noble gris argenté", "Entretien huilé optionnel", "Excellente stabilité dimensionnelle", "Résistant au feu (classe B)"],
  },
];

const comparison = [
  { essence: "IPE", durabilite: "★★★★★", resistance: "★★★★★", entretien: "Faible", prix: "€€€€", esthetique: "★★★★★" },
  { essence: "Teck", durabilite: "★★★★", resistance: "★★★★", entretien: "Moyen", prix: "€€€€", esthetique: "★★★★" },
  { essence: "Pin traité", durabilite: "★★", resistance: "★★", entretien: "Élevé", prix: "€", esthetique: "★★" },
  { essence: "Composite", durabilite: "★★★", resistance: "★★★", entretien: "Faible", prix: "€€€", esthetique: "★★★" },
];

const TerrassesIpePage = () => (
  <>
    <PageHero title="Terrasses & Aménagements en Bois IPE" subtitle="L'essence la plus résistante pour l'aménagement extérieur" />
    <Breadcrumbs items={[{ label: "Terrasses IPE" }]} />

    <section className="container-main section-padding">
      <ScrollReveal>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Le bois d'IPE est l'essence la plus résistante pour l'aménagement extérieur. Naturellement imputrescible, d'une densité exceptionnelle et d'une durabilité supérieure à 50 ans, le bois IPE est le choix premium pour vos terrasses, contours de piscine et bardages.
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-20">
        {sections.map((s, i) => (
          <ScrollReveal key={s.id}>
            <section id={s.id} className={`grid md:grid-cols-2 gap-12 items-center`}>
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <img src={ipeImg} alt={`${s.title} bois IPE terrasse`} className="rounded-xl w-full h-72 md:h-80 object-cover" loading="lazy" width={600} height={400} />
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <h2 className="text-2xl md:text-3xl text-foreground">{s.title}</h2>
                <p className="text-muted-foreground mt-4 font-body leading-relaxed">{s.desc}</p>
                <ul className="mt-6 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 font-body text-sm text-foreground">
                      <CheckCircle className="w-4 h-4 text-green-success shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-bordeaux inline-block mt-6 text-sm">Demander un Devis</Link>
              </div>
            </section>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="mt-20">
          <h2 className="text-foreground text-center mb-8">Comparatif des Essences</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="bg-noir text-primary-foreground">
                  <th className="p-3 text-left rounded-tl-lg">Essence</th>
                  <th className="p-3 text-center">Durabilité</th>
                  <th className="p-3 text-center">Résistance</th>
                  <th className="p-3 text-center">Entretien</th>
                  <th className="p-3 text-center">Prix</th>
                  <th className="p-3 text-center rounded-tr-lg">Esthétique</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((c, i) => (
                  <tr key={c.essence} className={`${i === 0 ? "bg-primary/10 font-semibold" : "bg-card"} border-b border-border`}>
                    <td className="p-3">{c.essence}</td>
                    <td className="p-3 text-center">{c.durabilite}</td>
                    <td className="p-3 text-center">{c.resistance}</td>
                    <td className="p-3 text-center">{c.entretien}</td>
                    <td className="p-3 text-center">{c.prix}</td>
                    <td className="p-3 text-center">{c.esthetique}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </section>
  </>
);

export default TerrassesIpePage;
