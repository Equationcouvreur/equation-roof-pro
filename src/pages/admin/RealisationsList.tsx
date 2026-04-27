import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

interface Realisation {
  id: string;
  title: string;
  category: string;
  status: string;
  cover?: string | null;
  photo_count: number;
}

const RealisationsList = () => {
  const [items, setItems] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("realisations")
      .select("id, title, category, status, display_order, realisation_photos(url, is_favorite)")
      .order("display_order", { ascending: true });
    if (error) toast.error(error.message);
    setItems(
      (data || []).map((r: { id: string; title: string; category: string; status: string; realisation_photos: { url: string; is_favorite: boolean }[] }) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        status: r.status,
        photo_count: r.realisation_photos?.length || 0,
        cover: r.realisation_photos?.find((p) => p.is_favorite)?.url || r.realisation_photos?.[0]?.url || null,
      })),
    );
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette réalisation et toutes ses photos ?")) return;
    const { error } = await supabase.from("realisations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Réalisation supprimée");
    load();
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Réalisations</h1>
          <p className="text-muted-foreground font-body mt-1">{items.length} projet{items.length > 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link to="/admin/realisations/new"><Plus className="w-4 h-4 mr-1" /> Nouveau projet</Link>
        </Button>
      </header>

      {loading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-4">Aucune réalisation</p>
          <Button asChild><Link to="/admin/realisations/new">Créer la première réalisation</Link></Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <div key={r.id} className="bg-card border rounded-xl overflow-hidden group">
              <Link to={`/admin/realisations/${r.id}`} className="block relative h-40 bg-muted">
                {r.cover ? (
                  <img src={r.cover} alt={r.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Pas de photo</div>
                )}
                <span className="absolute top-2 left-2 text-xs bg-background/90 px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" /> {r.photo_count}
                </span>
                {r.status === "draft" && (
                  <span className="absolute top-2 right-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Brouillon</span>
                )}
              </Link>
              <div className="p-3">
                <div className="text-xs text-muted-foreground">{r.category}</div>
                <h3 className="font-heading text-sm text-foreground line-clamp-1">{r.title}</h3>
                <div className="flex gap-1 mt-2">
                  <Button variant="ghost" size="sm" asChild className="flex-1">
                    <Link to={`/admin/realisations/${r.id}`}><Pencil className="w-3 h-3 mr-1" /> Éditer</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RealisationsList;
