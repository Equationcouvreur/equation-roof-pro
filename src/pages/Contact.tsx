import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PageHero from "@/components/PageHero";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal";
import SEO from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo-config";
import { supabase } from "@/integrations/supabase/client";

const projectTypes = [
  "Étanchéité toiture terrasse",
  "Rénovation étanchéité",
  "Recherche de fuite",
  "Terrasse IPE",
  "Toiture végétalisée",
  "Dalles sur plots",
  "Étanchéité Bitumineuse",
  "Résine",
  "Autre",
];

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    nom: "", prenom: "", email: "", telephone: "", type: "", surface: "", message: "", consent: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) setFormData((prev) => ({ ...prev, type }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Adresse email invalide");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-request", {
        body: {
          nom: formData.nom, prenom: formData.prenom, email: formData.email,
          telephone: formData.telephone, type: formData.type,
          surface: formData.surface, message: formData.message,
        },
      });
      if (error) throw error;
      toast.success("Demande envoyée ! Nous vous recontacterons sous 48h.");
      setFormData({ nom: "", prenom: "", email: "", telephone: "", type: "", surface: "", message: "", consent: false });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi. Merci de réessayer ou nous contacter au 04 73 87 53 50.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={PAGE_SEO.contact.title}
        description={PAGE_SEO.contact.description}
        path="/contact"
        breadcrumbs={PAGE_SEO.contact.breadcrumbs}
      />
      <PageHero title="Contact & Devis Gratuit" subtitle="Réponse sous 48h — Intervention dans tout le Puy-de-Dôme" />
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <section className="container-main section-padding">
        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <ScrollReveal>
              <h2 className="text-foreground mb-6">Demandez Votre Devis Gratuit</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Nom *</label>
                    <input type="text" required className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Prénom *</label>
                    <input type="text" required className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Email *</label>
                    <input type="email" required className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Téléphone *</label>
                    <input type="tel" required className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Type de projet</label>
                    <select className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                      <option value="">Sélectionnez...</option>
                      {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Surface approximative (m²)</label>
                    <input type="text" className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" value={formData.surface} onChange={(e) => setFormData({ ...formData, surface: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-subtitle font-medium text-foreground mb-1">Message / Description du projet</label>
                  <textarea rows={5} className="w-full border border-border rounded-lg px-4 py-3 font-body text-sm bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" required checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} className="mt-1 accent-[hsl(350,72%,34%)]" />
                  <span className="text-sm text-muted-foreground font-body">J'accepte que mes données soient utilisées pour traiter ma demande</span>
                </label>
                <button type="submit" disabled={submitting} className="btn-bordeaux w-full text-lg py-4 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? (<><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</>) : "Envoyer ma Demande"}
                </button>
              </form>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ScrollReveal delay={150}>
              <div className="card-equation p-6 space-y-5">
                <h3 className="font-heading text-foreground">Nos Coordonnées</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="font-body text-sm text-muted-foreground">
                    74 avenue du Midi<br />63800 Cournon-d'Auvergne
                  </div>
                </div>
                <a href="tel:0473875350" className="flex items-center gap-3 font-body text-sm text-foreground hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary shrink-0" /> 04 73 87 53 50
                </a>
                <a href="mailto:info@etanche.com" className="flex items-center gap-3 font-body text-sm text-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary shrink-0" /> info@etanche.com
                </a>
                <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary shrink-0" /> Lun-Ven 7h30–17h30
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <div className="card-equation p-6">
                <h3 className="font-heading text-foreground mb-4">Zone d'Intervention</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">
                  EQUATION intervient dans le Puy-de-Dôme (63), l'Allier (03), la Haute-Loire (43), le Cantal (15), la Nièvre (58) et au-delà sur demande pour les chantiers d'envergure.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Puy-de-Dôme (63)", "Allier (03)", "Haute-Loire (43)", "Cantal (15)", "Nièvre (58)"].map((d) => (
                    <span key={d} className="bg-muted text-muted-foreground text-xs font-subtitle px-3 py-1 rounded-full">{d}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={350}>
              <div className="rounded-xl overflow-hidden h-48 bg-muted flex items-center justify-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2810.5!2d3.183!3d45.733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDQ0JzAuMCJOIDPCsDExJzAuMCJF!5e0!3m2!1sfr!2sfr!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EQUATION Cournon-d'Auvergne"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
