import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

type JobOffer = {
  id: string;
  title: string;
  contract_type: string;
  location: string;
  description: string;
  display_order: number;
  is_published: boolean;
};

const JobOfferEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<JobOffer | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("job_offers").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) toast.error(error.message);
      else setOffer(data as JobOffer);
    });
  }, [id]);

  const save = async () => {
    if (!offer) return;
    setSaving(true);
    const { error } = await supabase
      .from("job_offers")
      .update({
        title: offer.title,
        contract_type: offer.contract_type,
        location: offer.location,
        description: offer.description,
        display_order: offer.display_order,
        is_published: offer.is_published,
      })
      .eq("id", offer.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Offre enregistrée");
  };

  if (!offer) return <p className="text-muted-foreground font-body">Chargement…</p>;

  const field = "w-full border border-border rounded-lg px-4 py-2 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none";
  const label = "block text-sm font-subtitle font-medium text-foreground mb-1";

  return (
    <div className="max-w-3xl">
      <Link to="/admin/recrutement" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Retour aux offres
      </Link>

      <h1 className="font-heading text-3xl text-foreground mb-8">Modifier l'offre</h1>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div>
          <label className={label}>Titre du poste *</label>
          <input className={field} value={offer.title} onChange={(e) => setOffer({ ...offer, title: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Type de contrat</label>
            <input className={field} value={offer.contract_type} onChange={(e) => setOffer({ ...offer, contract_type: e.target.value })} placeholder="CDI, CDD, Alternance…" />
          </div>
          <div>
            <label className={label}>Lieu</label>
            <input className={field} value={offer.location} onChange={(e) => setOffer({ ...offer, location: e.target.value })} placeholder="Cournon-d'Auvergne (63)" />
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea rows={5} className={field} value={offer.description} onChange={(e) => setOffer({ ...offer, description: e.target.value })} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label}>Ordre d'affichage</label>
            <input type="number" className={field} value={offer.display_order} onChange={(e) => setOffer({ ...offer, display_order: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 font-body text-sm">
              <input type="checkbox" checked={offer.is_published} onChange={(e) => setOffer({ ...offer, is_published: e.target.checked })} />
              Publiée sur le site
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => navigate("/admin/recrutement")}>Annuler</Button>
          <Button onClick={save} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobOfferEditor;
