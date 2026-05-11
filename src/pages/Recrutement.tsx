import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, HeartHandshake, GraduationCap, Wrench, Mail, Phone, Send, Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";

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

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXT = [".pdf", ".doc", ".docx"];

const formatBytes = (b: number) => {
  if (b < 1024) return `${b} o`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} Ko`;
  return `${(b / 1024 / 1024).toFixed(1)} Mo`;
};

const Recrutement = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", poste: "", message: "" });
  const [postes, setPostes] = useState<JobOffer[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase
      .from("job_offers")
      .select("id,title,contract_type,location,description")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => setPostes(data || []));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const typeOk = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXT.includes(ext);
    if (!typeOk) {
      toast.error("Format non autorisé. Acceptés : PDF, DOC, DOCX");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Fichier trop volumineux (max 5 Mo)");
      e.target.value = "";
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.nom.trim() || !form.telephone.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Adresse email invalide");
      return;
    }
    if (form.message.trim().length < 20) {
      toast.error("Le message doit contenir au moins 20 caractères");
      return;
    }
    if (!cvFile) {
      toast.error("Veuillez joindre votre CV");
      return;
    }

    setSubmitting(true);
    try {
      const id = crypto.randomUUID();
      const safeName = cvFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${id}/${Date.now()}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from("cv-candidats")
        .upload(path, cvFile, { contentType: cvFile.type, upsert: false });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("job_applications").insert({
        id,
        full_name: form.nom.trim(),
        phone: form.telephone.trim(),
        email: form.email.trim().toLowerCase(),
        position: form.poste || "Candidature spontanée",
        message: form.message.trim(),
        cv_url: path,
        cv_filename: cvFile.name,
        cv_size_bytes: cvFile.size,
      });

      if (insertError) throw insertError;

      // Notification email — fire-and-forget, n'empêche pas la candidature
      supabase.functions
        .invoke("notify-new-application", { body: { applicationId: id } })
        .catch((err) => console.warn("Notification email a échoué:", err));

      navigate("/recrutement/merci");
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue. Merci de réessayer ou de nous contacter directement.");
      setSubmitting(false);
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
                <option value="">Candidature spontanée</option>
                {postes.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Votre message * <span className="text-xs text-muted-foreground font-normal">(min 20 caractères)</span></label>
              <textarea required rows={5} minLength={20} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Parlez-nous de votre parcours, vos motivations, vos disponibilités…"
                className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>

            <div>
              <label className="block text-sm font-subtitle font-medium text-foreground mb-2">CV *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />
              {!cvFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors rounded-lg px-4 py-6 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Paperclip className="w-6 h-6" />
                  <span className="text-sm font-subtitle font-medium">Joindre mon CV</span>
                  <span className="text-xs font-body">PDF, DOC, DOCX — max 5 Mo</span>
                </button>
              ) : (
                <div className="border border-border rounded-lg px-4 py-3 flex items-center justify-between gap-3 bg-background">
                  <div className="flex items-center gap-3 min-w-0">
                    <Paperclip className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-subtitle font-medium text-foreground truncate">{cvFile.name}</p>
                      <p className="text-xs font-body text-muted-foreground">{formatBytes(cvFile.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs font-subtitle text-primary hover:underline">
                      Changer
                    </button>
                    <button type="button" onClick={() => { setCvFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-bordeaux w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</>
              ) : (
                <><Send className="w-4 h-4" /> Envoyer ma candidature</>
              )}
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
    </>
  );
};

export default Recrutement;
