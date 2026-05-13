import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/uploadImage";
import YouTubeUrlField from "@/components/admin/YouTubeUrlField";
import PhotoSeoFields from "@/components/admin/PhotoSeoFields";
import { useKeywordSuggestions } from "@/hooks/useKeywordSuggestions";
import { toast } from "sonner";
import { ArrowDown, ArrowLeft, ArrowUp, Save, Send, Star, Trash2, Upload, GripVertical } from "lucide-react";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CATEGORIES = ["Étanchéité bitumineuse", "Étanchéité résine", "Toiture végétalisée", "Dalles sur plots", "Terrasse bois IPE", "Bardage zinc", "Autre"];

const schema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.string().min(1),
  description: z.string().max(2000).optional(),
});

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  alt_text: string | null;
  keywords: string[] | null;
  is_favorite: boolean;
  display_order: number;
}

const SortablePhoto = ({
  photo,
  canMoveDown,
  canMoveUp,
  suggestions,
  onSetFavorite,
  onUpdateField,
  onCommitField,
  onDelete,
  onMove,
}: {
  photo: Photo;
  canMoveDown: boolean;
  canMoveUp: boolean;
  suggestions: string[];
  onSetFavorite: (id: string) => void;
  onUpdateField: (id: string, patch: Partial<Photo>) => void;
  onCommitField: (id: string, patch: Partial<Photo>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg overflow-hidden group">
      <div className="relative h-40 bg-muted">
        <img src={photo.url} alt={photo.alt_text || photo.caption || ""} className="w-full h-full object-cover pointer-events-none" />
        <div
          {...attributes}
          {...listeners}
          role="button"
          tabIndex={0}
          aria-label="Réordonner"
          title="Glisser pour réordonner"
          style={{ touchAction: "none" }}
          className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing select-none"
        />
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 pointer-events-none">
          <span className="bg-background/90 rounded p-1 shadow-sm">
            <GripVertical className="w-4 h-4" />
          </span>
        </div>
        <div className="absolute bottom-2 left-2 z-10 flex gap-1">
          <button type="button" disabled={!canMoveUp} onPointerDown={(e) => e.stopPropagation()} onClick={() => onMove(photo.id, -1)} className="bg-background/90 text-foreground rounded p-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed" title="Monter">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button type="button" disabled={!canMoveDown} onPointerDown={(e) => e.stopPropagation()} onClick={() => onMove(photo.id, 1)} className="bg-background/90 text-foreground rounded p-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed" title="Descendre">
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSetFavorite(photo.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`absolute top-2 right-2 z-10 rounded-full p-1.5 transition-all ${photo.is_favorite ? "bg-amber-500 text-white" : "bg-background/90 text-muted-foreground hover:text-amber-500"}`}
          title={photo.is_favorite ? "Photo favorite" : "Définir comme favorite"}
        >
          <Star className={`w-4 h-4 ${photo.is_favorite ? "fill-current" : ""}`} />
        </button>
        <button type="button" onClick={() => onDelete(photo.id)} onPointerDown={(e) => e.stopPropagation()} className="absolute bottom-2 right-2 z-10 bg-destructive text-destructive-foreground rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" title="Supprimer">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <PhotoSeoFields
        altText={photo.alt_text || ""}
        keywords={photo.keywords || []}
        caption={photo.caption || ""}
        suggestions={suggestions}
        onAltChange={(v) => onUpdateField(photo.id, { alt_text: v })}
        onAltBlur={(v) => onCommitField(photo.id, { alt_text: v })}
        onKeywordsChange={(v) => onUpdateField(photo.id, { keywords: v })}
        onKeywordsCommit={(v) => onCommitField(photo.id, { keywords: v })}
        onCaptionChange={(v) => onUpdateField(photo.id, { caption: v })}
        onCaptionBlur={(v) => onCommitField(photo.id, { caption: v })}
      />
    </div>
  );
};

const RealisationEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const keywordSuggestions = useKeywordSuggestions();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [surface, setSurface] = useState("");
  const [technique, setTechnique] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data: r } = await supabase.from("realisations").select("*").eq("id", id).maybeSingle();
      if (!r) { navigate("/admin/realisations"); return; }
      setTitle(r.title); setCategory(r.category); setDescription(r.description || "");
      setSurface(r.surface || ""); setTechnique(r.technique || ""); setYear(r.year || ""); setLocation(r.location || "");
      setVideoUrl((r as { video_url?: string | null }).video_url || "");
      const { data: ph } = await supabase.from("realisation_photos").select("*").eq("realisation_id", id).order("display_order");
      setPhotos(ph || []);
      setLoading(false);
    })();
  }, [id, isNew, navigate]);

  const slugify = (s: string) =>
    s.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `realisation-${Date.now()}`;

  const ensureProject = async (): Promise<string | null> => {
    if (!isNew) return id!;
    const parsed = schema.safeParse({ title, category, description });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return null; }
    const { data, error } = await supabase.from("realisations").insert({
      title, category, description: description || null, status: "draft", slug: slugify(title),
    }).select("id").single();
    if (error) { toast.error(error.message); return null; }
    navigate(`/admin/realisations/${data.id}`, { replace: true });
    return data.id;
  };

  const handleUpload = async (files: FileList) => {
    const projectId = await ensureProject();
    if (!projectId) return;
    setUploading(true);
    const t = toast.loading(`Téléversement de ${files.length} image(s)…`);
    try {
      const baseOrder = photos.length;
      const newPhotos: Photo[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], "realisations");
        const { data, error } = await supabase.from("realisation_photos").insert({
          realisation_id: projectId,
          url,
          display_order: baseOrder + i,
          is_favorite: photos.length === 0 && i === 0,
        }).select().single();
        if (error) throw error;
        newPhotos.push(data);
      }
      setPhotos([...photos, ...newPhotos]);
      toast.success(`${files.length} photo(s) ajoutée(s)`, { id: t });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur upload", { id: t });
    } finally {
      setUploading(false);
    }
  };

  const setFavorite = async (photoId: string) => {
    setPhotos(photos.map((p) => ({ ...p, is_favorite: p.id === photoId })));
    await supabase.from("realisation_photos").update({ is_favorite: true }).eq("id", photoId);
    toast.success("Photo favorite mise à jour");
  };

  const updatePhoto = (photoId: string, patch: Partial<Photo>) => {
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, ...patch } : p)));
  };

  const commitPhoto = async (photoId: string, patch: Partial<Photo>) => {
    const update: { caption?: string | null; alt_text?: string; keywords?: string[] } = {};
    if ("caption" in patch) update.caption = patch.caption ?? null;
    if ("alt_text" in patch) update.alt_text = patch.alt_text || "";
    if ("keywords" in patch) update.keywords = patch.keywords || [];
    if (!Object.keys(update).length) return;
    const { error } = await supabase.from("realisation_photos").update(update).eq("id", photoId);
    if (error) toast.error(error.message);
  };

  const deletePhoto = async (photoId: string) => {
    if (!window.confirm("Supprimer cette photo ?")) return;
    await supabase.from("realisation_photos").delete().eq("id", photoId);
    setPhotos(photos.filter((p) => p.id !== photoId));
    toast.success("Photo supprimée");
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = photos.findIndex((p) => p.id === active.id);
    const newIdx = photos.findIndex((p) => p.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const reordered = arrayMove(photos, oldIdx, newIdx);
    setPhotos(reordered);
    await Promise.all(reordered.map((p, i) => supabase.from("realisation_photos").update({ display_order: i }).eq("id", p.id)));
  };

  const movePhoto = async (photoId: string, direction: -1 | 1) => {
    const oldIdx = photos.findIndex((p) => p.id === photoId);
    const newIdx = oldIdx + direction;
    if (oldIdx < 0 || newIdx < 0 || newIdx >= photos.length) return;
    const reordered = arrayMove(photos, oldIdx, newIdx);
    setPhotos(reordered);
    const results = await Promise.all(reordered.map((p, i) => supabase.from("realisation_photos").update({ display_order: i }).eq("id", p.id)));
    const error = results.find((result) => result.error)?.error;
    if (error) toast.error(error.message);
  };

  const save = async (status: "draft" | "published") => {
    const parsed = schema.safeParse({ title, category, description });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSaving(true);
    const payload = { title, category, description: description || null, surface: surface || null, technique: technique || null, year: year || null, location: location || null, video_url: videoUrl.trim() || null, status };
    const result = isNew
      ? await supabase.from("realisations").insert({ ...payload, slug: slugify(title) }).select("id").single()
      : await supabase.from("realisations").update(payload).eq("id", id!).select("id").single();
    if (result.error) { toast.error(result.error.message); setSaving(false); return; }
    toast.success(status === "published" ? "Réalisation publiée" : "Brouillon enregistré");
    setSaving(false);
    if (isNew) navigate(`/admin/realisations/${result.data.id}`);
  };

  if (loading) return <p className="text-muted-foreground">Chargement…</p>;

  return (
    <div className="max-w-6xl">
      <header className="flex items-center justify-between mb-6">
        <Link to="/admin/realisations" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => save("draft")} disabled={saving}><Save className="w-4 h-4 mr-1" /> Brouillon</Button>
          <Button onClick={() => save("published")} disabled={saving}><Send className="w-4 h-4 mr-1" /> Publier</Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div>
              <Label>Titre du projet *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 text-lg" placeholder="Ex: Étanchéité hôtel Mercure" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1" placeholder="Présentation du projet, défis techniques, solutions apportées…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Surface</Label>
                <Input value={surface} onChange={(e) => setSurface(e.target.value)} placeholder="850 m²" className="mt-1" />
              </div>
              <div>
                <Label>Année</Label>
                <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" className="mt-1" />
              </div>
              <div>
                <Label>Lieu</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Clermont-Ferrand" className="mt-1" />
              </div>
              <div>
                <Label>Technique</Label>
                <Input value={technique} onChange={(e) => setTechnique(e.target.value)} placeholder="Bicouche soudé" className="mt-1" />
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-lg">Galerie photos</h3>
                <p className="text-xs text-muted-foreground mt-0.5">⭐ étoile = photo favorite • Glisser = réordonner</p>
              </div>
              <label className="cursor-pointer">
                <Button asChild disabled={uploading}>
                  <span><Upload className="w-4 h-4 mr-1" /> {uploading ? "…" : "Ajouter"}</span>
                </Button>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
              </label>
            </div>

            {photos.length === 0 ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/30">
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Cliquer ou glisser des images</p>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
              </label>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {photos.map((p, index) => (
                      <SortablePhoto
                        key={p.id}
                        photo={p}
                        canMoveUp={index > 0}
                        canMoveDown={index < photos.length - 1}
                        suggestions={keywordSuggestions}
                        onSetFavorite={setFavorite}
                        onUpdateField={updatePhoto}
                        onCommitField={commitPhoto}
                        onDelete={deletePhoto}
                        onMove={movePhoto}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          <div className="bg-card border rounded-xl p-5">
            <YouTubeUrlField value={videoUrl} onChange={setVideoUrl} />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-card border rounded-xl p-4">
            <Label>Catégorie *</Label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="bg-card border rounded-xl p-4 text-sm space-y-2">
            <h3 className="font-semibold">Conseils</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Une photo "favorite" est mise en avant sur la liste publique</li>
              <li>Les photos s'affichent dans l'ordre que vous définissez</li>
              <li>Légendes courtes et descriptives recommandées</li>
              <li>Format paysage (4:3 ou 16:9) idéal</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RealisationEditor;
