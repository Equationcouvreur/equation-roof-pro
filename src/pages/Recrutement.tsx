import { useEffect, useRef, useState } from "react";
import { Briefcase, HeartHandshake, GraduationCap, Wrench, Mail, Phone, Send, Paperclip, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type JobOffer = {
  id: string;
  title: string;
  contract_type: string;
  location: string;
  description: string;
};

const avantages = [
  { icon: HeartHandshake, titre: "Une équipe humaine", desc: "Une PME familiale fondée en 2001, où chacun compte." },
  { icon: GraduationCap, titre: "Formation continue", desc: "Montée en compétences sur les techniques innovantes (Cool Roof, FOAMGLAS, photovoltaïque)." },
  { icon: Wrench, titre: "Matériel de qualité", desc: "Équipements professionnels, EPI complets, véhicules récents." },
  { icon: Briefcase, titre: "Évolution interne", desc: "Possibilités de progression vers chef d'équipe, conducteur de travaux." },
];

const buildBody = (form: { nom: string; email: string; telephone: string; poste: string; message: string }) => {
  return `Bonjour,

Je vous adresse ma candidature pour le poste : ${form.poste || "Candidature spontanée"}.

Mes coordonnées :
- Nom complet : ${form.nom}
- Téléphone : ${form.telephone}
- Email : ${form.email}

Mon message :
${form.message}

⚠️ N'oubliez pas de joindre votre CV en pièce jointe à ce mail avant de l'envoyer.

Cordialement,
${form.nom}`;
};

const Recrutement = () => {
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", poste: "", message: "" });
  const [postes, setPostes] = useState<JobOffer[]>([]);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const fallbackBodyRef = useRef<string>("");
  const fallbackSubjectRef = useRef<string>("");

  useEffect(() => {
    supabase
      .from("job_offers")
      .select("id,title,contract_type,location,description")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => setPostes(data || []));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nom || !form.telephone || !form.email || !form.message) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    const subject = `Candidature - ${form.poste || "Spontanée"} - ${form.nom}`;
    const body = buildBody(form);
    fallbackSubjectRef.current = subject;
    fallbackBodyRef.current = body;

    const mailtoUrl = `mailto:info@etanche.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    toast.success("Votre client mail va s'ouvrir. Pensez à joindre votre CV avant d'envoyer.");

    // Fallback : si la page a toujours le focus après 1.5s, c'est que rien ne s'est ouvert
    window.setTimeout(() => {
      if (document.hasFocus()) {
        setFallbackOpen(true);
      }
    }, 1500);
  };

  const handleCopyRecap = async () => {
    const text = `Sujet : ${fallbackSubjectRef.current}\n\n${fallbackBodyRef.current}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Récap copié dans le presse-papier");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Impossible de copier — sélectionnez le texte manuellement");
    }
  };

  return (
    <>
      <SEO
        title={PAGE_SEO.recrutement.title}
        description={PAGE_SEO.recrutement.description}
        path="/recrutement"
        breadcrumbs={PAGE_SEO.recrutement.breadcrumbs}
      />
      <PageHero
        title="Recrutement — Nous Rejoindre"
        subtitle="EQUATION recrute des passionnés de l'étanchéité en Auvergne"
      />
      <Breadcrumbs items={[{ label: "Recrutement" }]} />

      {/* Intro */}
      <section className="container-main section-padding">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-foreground mb-6">Construisez votre avenir avec EQUATION</h2>
            <p className="text-lg font-body text-muted-foreground leading-relaxed">
              Depuis plus de 20 ans, EQUATION façonne des toitures qui protègent, isolent et innovent.
              Nous recherchons des collaborateurs engagés, fiers du travail bien fait, qui veulent grandir
              dans une entreprise familiale à taille humaine.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Avantages */}
      <section className="bg-secondary/30 section-padding">
        <div className="container-main">
          <ScrollReveal>
            <h2 className="text-center text-foreground mb-12">Pourquoi nous rejoindre ?</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {avantages.map((a, i) => (
              <ScrollReveal key={a.titre} delay={i * 100}>
                <div className="bg-card p-6 rounded-xl border border-border h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <a.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-2">{a.titre}</h3>
                  <p className="text-sm font-body text-muted-foreground">{a.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Postes */}
      <section className="container-main section-padding">
        <ScrollReveal>
          <h2 className="text-center text-foreground mb-12">Postes à pourvoir</h2>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {postes.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 80}>
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-heading text-xl text-foreground">{p.title}</h3>
                  <span className="text-xs font-subtitle font-semibold uppercase bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
                    {p.contract_type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-body mb-2">📍 {p.location}</p>
                <div className="prose prose-sm max-w-none text-sm font-body text-foreground/80" dangerouslySetInnerHTML={{ __html: p.description || "" }} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Formulaire */}
      <section id="candidature" className="bg-secondary/30 section-padding">
        <div className="container-main max-w-3xl">
          <ScrollReveal>
            <h2 className="text-center text-foreground mb-3">Envoyez votre candidature</h2>
            <p className="text-center text-muted-foreground font-body mb-10">
              Réponse personnalisée sous 7 jours
            </p>
          </ScrollReveal>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-2xl border border-border">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Nom complet *</label>
                <input type="text" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Téléphone *</label>
                <input type="tel" required value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Poste recherché</label>
              <select value={form.poste} onChange={(e) => setForm({ ...form, poste: e.target.value })}
                className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none">
                <option value="">— Choisissez —</option>
                {postes.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Votre message *</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Parlez-nous de votre parcours, vos motivations, vos disponibilités…"
                className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>

            {/* Bloc important CV */}
            <div className="flex gap-3 items-start rounded-xl border-2 border-primary/40 bg-primary/5 p-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Paperclip className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-body text-foreground/90">
                <p className="font-subtitle font-semibold text-foreground mb-1">
                  IMPORTANT — Joindre votre CV
                </p>
                <p>
                  Au clic sur « Envoyer ma candidature », votre client mail va s'ouvrir avec un message pré-rempli.
                  <strong> AVANT de l'envoyer, pensez à JOINDRE VOTRE CV</strong> (PDF de préférence) en pièce jointe.
                </p>
              </div>
            </div>

            <button type="submit" className="btn-bordeaux w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg">
              <Send className="w-4 h-4" /> Envoyer ma candidature
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-body text-muted-foreground mb-3">Ou contactez-nous directement :</p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="tel:0473875350" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-subtitle">
                <Phone className="w-4 h-4" /> 04 73 87 53 50
              </a>
              <a href="mailto:info@etanche.com" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-subtitle">
                <Mail className="w-4 h-4" /> info@etanche.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fallback dialog */}
      <Dialog open={fallbackOpen} onOpenChange={setFallbackOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Votre client mail ne semble pas s'être ouvert</DialogTitle>
            <DialogDescription>
              Pas de panique, vous pouvez transmettre votre candidature de deux autres façons :
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <ul className="text-sm font-body text-foreground/90 space-y-2 list-disc pl-5">
              <li>
                Copier le récap ci-dessous et l'envoyer à <strong>info@etanche.com</strong> depuis votre boîte mail web (Gmail, Outlook…), en joignant votre CV.
              </li>
              <li>
                Appeler directement EQUATION au <a href="tel:0473875350" className="text-primary font-semibold underline">04 73 87 53 50</a>.
              </li>
            </ul>

            <div>
              <label className="block text-xs font-subtitle font-medium text-muted-foreground mb-1">Récap à envoyer</label>
              <textarea
                readOnly
                rows={12}
                className="w-full border border-border rounded-lg p-3 font-mono text-xs bg-background text-foreground"
                value={`Sujet : ${fallbackSubjectRef.current}\n\n${fallbackBodyRef.current}`}
                onFocus={(e) => e.currentTarget.select()}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={handleCopyRecap}
              className="btn-bordeaux inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié !" : "Copier le récap"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Recrutement;
