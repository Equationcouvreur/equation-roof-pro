import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichEditor from "@/components/admin/RichEditor";
import YouTubeUrlField from "@/components/admin/YouTubeUrlField";
import { uploadImage, slugify } from "@/lib/uploadImage";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Image as ImageIcon, X } from "lucide-react";
import { z } from "zod";

const CATEGORIES = ["Conseils", "Guide Technique", "Écologie", "Réglementation", "Économie d'énergie", "Aménagement", "Matériaux", "Diagnostic"];

const schema = z.object({
  title: z.string().trim().min(3, "Titre trop court").max(200),
  slug: z.string().trim().min(3).max(120),
  category: z.string().min(1, "Catégorie requise"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(10, "Contenu trop court"),
});

const ArticleEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("blog_articles").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        toast.error("Article introuvable");
        navigate("/admin/articles");
        return;
      }
      setTitle(data.title);
      setSlug(data.slug);
      setCategory(data.category);
      setExcerpt(data.excerpt || "");
      setContent(data.content || "");
      setCoverUrl(data.cover_image_url || "");
      setVideoUrl((data as { video_url?: string | null }).video_url || "");
      setMetaTitle(data.meta_title || "");
      setMetaDescription(data.meta_description || "");
      setSlugTouched(true);
      setLoading(false);
    })();
  }, [id, isNew, navigate]);

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  const handleCoverUpload = async (file: File) => {
    const t = toast.loading("Téléversement…");
    try {
      const url = await uploadImage(file, "covers");
      setCoverUrl(url);
      toast.success("Image de couverture mise à jour", { id: t });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur", { id: t });
    }
  };

  const save = async (status: "draft" | "published") => {
    const parsed = schema.safeParse({ title, slug, category, excerpt, content });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSaving(true);

    const payload = {
      title,
      slug,
      category,
      excerpt: excerpt || null,
      content,
      cover_image_url: coverUrl || null,
      video_url: videoUrl.trim() || null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      author_id: user?.id,
    };

    const result = isNew
      ? await supabase.from("blog_articles").insert(payload).select("id").single()
      : await supabase.from("blog_articles").update(payload).eq("id", id!).select("id").single();

    if (result.error) {
      toast.error(result.error.message);
      setSaving(false);
      return;
    }
    toast.success(status === "published" ? "Article publié" : "Brouillon enregistré");
    setSaving(false);
    if (isNew) navigate(`/admin/articles/${result.data.id}`);
  };

  if (loading) return <p className="text-muted-foreground">Chargement…</p>;

  return (
    <div className="max-w-5xl">
      <header className="flex items-center justify-between mb-6">
        <Link to="/admin/articles" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => save("draft")} disabled={saving}>
            <Save className="w-4 h-4 mr-1" /> Brouillon
          </Button>
          <Button onClick={() => save("published")} disabled={saving}>
            <Send className="w-4 h-4 mr-1" /> Publier
          </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <Label>Titre de l'article *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mon super article…" className="text-lg mt-1" />
          </div>

          <div>
            <Label>Extrait (résumé court)</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Affiché dans la liste des articles…" rows={2} className="mt-1" />
          </div>

          <div>
            <Label>Contenu *</Label>
            <div className="mt-1">
              <RichEditor value={content} onChange={setContent} />
            </div>
          </div>

          <YouTubeUrlField value={videoUrl} onChange={setVideoUrl} />
        </div>

        <aside className="space-y-5">
          <div className="bg-card border rounded-xl p-4">
            <Label>Image de couverture</Label>
            {coverUrl ? (
              <div className="relative mt-2">
                <img src={coverUrl} alt="Couverture" className="w-full h-40 object-cover rounded-md" />
                <button onClick={() => setCoverUrl("")} className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:bg-muted/30">
                <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Choisir une image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleCoverUpload(e.target.files[0])}
                />
              </label>
            )}
          </div>

          <div className="bg-card border rounded-xl p-4 space-y-3">
            <div>
              <Label>Catégorie *</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <Input value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }} className="mt-1 font-mono text-sm" />
              <p className="text-xs text-muted-foreground mt-1">/blog/{slug || "…"}</p>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-sm">SEO</h3>
            <div>
              <Label className="text-xs">Titre meta (Google)</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={60} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{metaTitle.length}/60</p>
            </div>
            <div>
              <Label className="text-xs">Description meta</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} maxLength={160} rows={2} className="mt-1" />
              <p className="text-xs text-muted-foreground mt-1">{metaDescription.length}/160</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ArticleEditor;
