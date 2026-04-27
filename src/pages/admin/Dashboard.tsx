import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Hammer, Plus, Eye } from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({ articles: 0, drafts: 0, realisations: 0, photos: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: published }, { count: drafts }, { count: rea }, { count: photos }] = await Promise.all([
        supabase.from("blog_articles").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("blog_articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("realisations").select("*", { count: "exact", head: true }),
        supabase.from("realisation_photos").select("*", { count: "exact", head: true }),
      ]);
      setStats({ articles: published || 0, drafts: drafts || 0, realisations: rea || 0, photos: photos || 0 });
    };
    load();
  }, []);

  const cards = [
    { label: "Articles publiés", value: stats.articles, icon: FileText, color: "text-green-600 bg-green-100" },
    { label: "Brouillons", value: stats.drafts, icon: FileText, color: "text-amber-600 bg-amber-100" },
    { label: "Réalisations", value: stats.realisations, icon: Hammer, color: "text-blue-600 bg-blue-100" },
    { label: "Photos", value: stats.photos, icon: Eye, color: "text-purple-600 bg-purple-100" },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-heading text-foreground">Bienvenue 👋</h1>
        <p className="text-muted-foreground font-body mt-1">Gérez le contenu du site EQUATION</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card p-5 rounded-xl border">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color} mb-3`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-heading text-foreground">{c.value}</div>
            <div className="text-sm text-muted-foreground font-body">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/articles/new" className="bg-card p-6 rounded-xl border hover:border-primary transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg text-foreground">Nouvel article</h3>
              <p className="text-sm text-muted-foreground mt-1">Rédiger un article de blog</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </Link>
        <Link to="/admin/realisations/new" className="bg-card p-6 rounded-xl border hover:border-primary transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg text-foreground">Nouvelle réalisation</h3>
              <p className="text-sm text-muted-foreground mt-1">Ajouter un projet avec photos</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
