import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  published_at: string | null;
  updated_at: string;
}

const ArticlesList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_articles")
      .select("id, title, slug, category, status, published_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cet article ?")) return;
    const { error } = await supabase.from("blog_articles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Article supprimé");
    load();
  };

  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Articles de blog</h1>
          <p className="text-muted-foreground font-body mt-1">{articles.length} article{articles.length > 1 ? "s" : ""}</p>
        </div>
        <Button asChild>
          <Link to="/admin/articles/new"><Plus className="w-4 h-4 mr-1" /> Nouvel article</Link>
        </Button>
      </header>

      {loading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : articles.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <p className="text-muted-foreground mb-4">Aucun article pour le moment</p>
          <Button asChild><Link to="/admin/articles/new">Créer le premier article</Link></Button>
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Modifié</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium text-foreground">{a.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.category}</td>
                  <td className="px-4 py-3">
                    {a.status === "published" ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"><Eye className="w-3 h-3" /> Publié</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded"><EyeOff className="w-3 h-3" /> Brouillon</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(a.updated_at).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/articles/${a.id}`}><Pencil className="w-4 h-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
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

export default ArticlesList;
