import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type JobOffer = {
  id: string;
  title: string;
  contract_type: string;
  location: string;
  is_published: boolean;
  display_order: number;
};

const JobOffersList = () => {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_offers")
      .select("id,title,contract_type,location,is_published,display_order")
      .order("display_order", { ascending: true });
    if (error) toast.error(error.message);
    else setOffers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from("job_offers")
      .insert({ title: "Nouvelle offre", contract_type: "CDI", location: "", description: "", display_order: offers.length + 1 })
      .select()
      .single();
    if (error) return toast.error(error.message);
    navigate(`/admin/recrutement/${data.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette offre ?")) return;
    const { error } = await supabase.from("job_offers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Offre supprimée");
    load();
  };

  const togglePublish = async (offer: JobOffer) => {
    const { error } = await supabase
      .from("job_offers")
      .update({ is_published: !offer.is_published })
      .eq("id", offer.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Offres d'emploi</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Gérez les postes affichés sur la page Recrutement.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Nouvelle offre
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Chargement…</p>
      ) : offers.length === 0 ? (
        <p className="text-muted-foreground font-body">Aucune offre. Cliquez sur « Nouvelle offre ».</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50 text-left text-xs uppercase font-subtitle text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Lieu</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {offers.map((o) => (
                <tr key={o.id} className="text-sm font-body">
                  <td className="px-4 py-3 font-medium text-foreground">{o.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.contract_type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.location}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(o)} className="inline-flex items-center gap-1 text-xs">
                      {o.is_published ? (
                        <span className="text-green-600 inline-flex items-center gap-1"><Eye className="w-3 h-3" /> Publiée</span>
                      ) : (
                        <span className="text-muted-foreground inline-flex items-center gap-1"><EyeOff className="w-3 h-3" /> Brouillon</span>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Link to={`/admin/recrutement/${o.id}`}>
                        <Button size="sm" variant="ghost"><Pencil className="w-4 h-4" /></Button>
                      </Link>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(o.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobOffersList;
