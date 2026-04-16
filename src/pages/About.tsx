import { Award, Shield, Leaf, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import teamImg from "@/assets/team-construction.jpg";
import signatureImg from "@/assets/signature-efficacite.png";
import certificationsImg from "@/assets/certifications.png";

const timeline = [
  { year: "2001", text: "Création d'EQUATION par Thierry Meylan à Cournon-d'Auvergne" },
  { year: "2005", text: "Obtention de la certification Qualibat" },
  { year: "2008", text: "Développement de l'activité terrasses IPE" },
  { year: "2012", text: "Premiers chantiers de toitures végétalisées en Auvergne" },
  { year: "2015", text: "Franchissement du cap des 2 millions d'€ de CA" },
  { year: "2018", text: "Engagement FFB Puy-de-Dôme, Thierry Meylan administrateur" },
  { year: "2020", text: "Développement du bureau d'études intégré (DAO 3D)" },
  { year: "2024", text: "Renouvellement certification Qualibat RGE" },
  { year: "2026", text: "25 ans d'excellence et plus de 2 000 chantiers réalisés" },
];

const values = [
  { icon: Award, title: "Excellence Technique", desc: "Chaque chantier est une signature. Nous appliquons les règles de l'art avec rigueur et exigence." },
  { icon: Leaf, title: "Engagement Environnemental", desc: "Toitures végétalisées, isolation performante, matériaux durables : nous construisons pour demain." },
  { icon: Users, title: "Proximité Client", desc: "Du diagnostic au suivi post-travaux, un interlocuteur unique vous accompagne à chaque étape." },
];

const AboutPage = () => (
  <>
    <PageHero title="EQUATION — L'Expertise au Service de Votre Bâtiment" subtitle="Depuis 2001, nous protégeons vos toitures terrasses en Auvergne" />
    <Breadcrumbs items={[{ label: "À Propos" }]} />

    {/* Timeline */}
    <section className="container-main section-padding">
      <ScrollReveal>
        <h2 className="text-foreground text-center mb-12">[ Notre Histoire ]</h2>
      </ScrollReveal>
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />
        {timeline.map((t, i) => (
          <ScrollReveal key={t.year} delay={i * 80}>
            <div className={`relative pl-12 md:pl-0 mb-8 md:flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <div className="absolute left-2 md:left-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background md:-translate-x-2.5 mt-1" />
              <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
                <span className="text-primary font-heading font-bold text-lg">{t.year}</span>
                <p className="text-muted-foreground font-body text-sm mt-1">{t.text}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>

    {/* Valeurs */}
    <section className="bg-warm section-padding">
      <div className="container-main">
        <ScrollReveal>
          <h2 className="text-foreground text-center mb-12">[ Nos Valeurs ]</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 100}>
              <div className="text-center">
                <v.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-foreground font-heading">{v.title}</h3>
                <p className="text-muted-foreground font-body text-sm mt-3">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>

    {/* Fondateur */}
    <section className="container-main section-padding">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <ScrollReveal>
          <img src={teamImg} alt="Équipe EQUATION étanchéité" className="rounded-xl w-full h-80 object-cover" loading="lazy" width={600} height={400} />
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div>
            <h2 className="text-foreground mb-4">Thierry Meylan, Gérant-Fondateur</h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Plus de 25 ans d'expérience dans le BTP, administrateur de la FFB Puy-de-Dôme, intervenant à l'Université Clermont Auvergne sur le social selling et l'image de marque. Thierry Meylan a fondé EQUATION en 2001 avec la conviction que l'étanchéité est un métier d'excellence qui mérite expertise et rigueur.
            </p>
            <p className="text-muted-foreground font-body leading-relaxed mt-4">
              Nos équipes d'étancheurs qualifiés interviennent avec professionnalisme sur tous types de chantiers, du logement social aux bâtiments institutionnels, en passant par les résidences privées.
            </p>
            <img src={signatureImg} alt="Équation - L'efficacité en Action" className="h-16 w-auto mt-6 opacity-80" />
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Certifications */}
    <section className="bg-noir section-padding">
      <div className="container-main">
        <ScrollReveal>
          <h2 className="text-primary-foreground text-center mb-6">[ Nos Certifications ]</h2>
          <p className="text-primary-foreground/60 text-center text-sm font-body mb-10">Certifications et labels — gages de compétence et de fiabilité</p>
        </ScrollReveal>
        <ScrollReveal>
          <div className="flex justify-center mb-10">
            <img src={certificationsImg} alt="Certifications CSFE, Qualibat, Reconnu Grenelle Environnement" className="max-w-lg w-full h-auto" loading="lazy" />
          </div>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "CSFE", desc: "Chambre Syndicale Française de l'Étanchéité — reconnaissance professionnelle du métier." },
            { title: "Qualibat", desc: "Votre label de fiabilité — qualification officielle des entreprises du bâtiment." },
            { title: "Reconnu Grenelle Environnement", desc: "Éligibilité aux aides à la rénovation énergétique (RGE)." },
            { title: "FFB", desc: "Fédération Française du Bâtiment — Thierry Meylan est administrateur FFB63." },
          ].map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 100}>
              <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-6">
                <Shield className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-primary-foreground font-heading text-lg">{c.title}</h3>
                <p className="text-primary-foreground/60 font-body text-sm mt-2">{c.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default AboutPage;
