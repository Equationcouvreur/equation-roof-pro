import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/uploadImage";
import { toast } from "sonner";
import { ArrowDown, ArrowLeft, ArrowUp, Save, Star, Trash2, Upload, GripVertical, Plus, X } from "lucide-react";
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

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  alt_text: string | null;
  is_favorite: boolean;
  display_order: number;
}

const SortablePhoto = ({
  photo,
  canMoveDown,
  canMoveUp,
  onSetFavorite,
  onUpdateCaption,
  onDelete,
  onBlurCaption,
  onMove,
}: {
  photo: Photo;
  canMoveDown: boolean;
  canMoveUp: boolean;
  onSetFavorite: (id: string) => void;
  onUpdateCaption: (id: string, c: string) => void;
  onDelete: (id: string) => void;
  onBlurCaption: (id: string, c: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg overflow-hidden group">
      <div className="relative h-40 bg-muted">
        <img src={photo.url} alt={photo.caption || ""} className="w-full h-full object-cover pointer-events-none" />
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
          <button
            type="button"
            disabled={!canMoveUp}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onMove(photo.id, -1)}
            className="bg-background/90 text-foreground rounded p-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Monter"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canMoveDown}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onMove(photo.id, 1)}
            className="bg-background/90 text-foreground rounded p-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Descendre"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onSetFavorite(photo.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`absolute top-2 right-2 z-10 rounded-full p-1.5 transition-all ${
            photo.is_favorite ? "bg-amber-500 text-white" : "bg-background/90 text-muted-foreground hover:text-amber-500"
          }`}
          title={photo.is_favorite ? "Photo favorite" : "Définir comme favorite"}
        >
          <Star className={`w-4 h-4 ${photo.is_favorite ? "fill-current" : ""}`} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(photo.id)}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-2 right-2 z-10 bg-destructive text-destructive-foreground rounded p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <Input
        value={photo.caption || ""}
        onChange={(e) => onUpdateCaption(photo.id, e.target.value)}
        onBlur={(e) => onBlurCaption(photo.id, e.target.value)}
        placeholder="Légende (optionnel)"
        className="border-0 rounded-none text-sm"
      />
    </div>
  );
};

const SectionEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [slug, setSlug] = useState("");
  const [page, setPage] = useState("");
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [points, setPoints] = useState<string[]>([]);
  const [referenceText, setReferenceText] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: s, error } = await supabase.from("site_sections").select("*").eq("id", id).maybeSingle();
      if (error || !s) {
        toast.error("Section introuvable");
        navigate("/admin/sections");
        return;
      }
      setSlug(s.slug);
      setPage(s.page);
      setTitle(s.title);
      setIntro(s.intro || "");
      setPoints(s.points || []);
      setReferenceText(s.reference_text || "");
      const { data: ph } = await supabase
        .from("section_photos")
        .select("*")
        .eq("section_id", id)
        .order("display_order");
      setPhotos(ph || []);
      setLoading(false);
    })();
  }, [id, navigate]);

  const handleUpload = async (files: FileList) => {
    if (!id) return;
    setUploading(true);
    const t = toast.loading(`Téléversement de ${files.length} image(s)…`);
    try {
      const baseOrder = photos.length;
      const newPhotos: Photo[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i], `sections/${slug}`);
        const { data, error } = await supabase
          .from("section_photos")
          .insert({
            section_id: id,
            url,
            display_order: baseOrder + i,
            is_favorite: photos.length === 0 && i === 0,
          })
          .select()
          .single();
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
    await supabase.from("section_photos").update({ is_favorite: true }).eq("id", photoId);
    toast.success("Photo favorite mise à jour");
  };

  const updateCaption = (photoId: string, caption: string) => {
    setPhotos(photos.map((p) => (p.id === photoId ? { ...p, caption } : p)));
  };

  const saveCaption = async (photoId: string, caption: string) => {
    await supabase.from("section_photos").update({ caption }).eq("id", photoId);
  };

  const deletePhoto = async (photoId: string) => {
    if (!window.confirm("Supprimer cette photo ?")) return;
    await supabase.from("section_photos").delete().eq("id", photoId);
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
    await Promise.all(
      reordered.map((p, i) => supabase.from("section_photos").update({ display_order: i }).eq("id", p.id)),
    );
  };

  const movePhoto = async (photoId: string, direction: -1 | 1) => {
    const oldIdx = photos.findIndex((p) => p.id === photoId);
    const newIdx = oldIdx + direction;
    if (oldIdx < 0 || newIdx < 0 || newIdx >= photos.length) return;
    const reordered = arrayMove(photos, oldIdx, newIdx);
    setPhotos(reordered);
    const results = await Promise.all(
      reordered.map((p, i) => supabase.from("section_photos").update({ display_order: i }).eq("id", p.id)),
    );
    const error = results.find((result) => result.error)?.error;
    if (error) toast.error(error.message);
  };

  const save = async () => {
    if (!id) return;
    if (title.trim().length < 3) {
      toast.error("Le titre doit faire au moins 3 caractères");
      return;
    }
    setSaving(true);
    const cleanPoints = points.map((p) => p.trim()).filter(Boolean);
    const { error } = await supabase
      .from("site_sections")
      .update({
        title,
        intro: intro || null,
        points: cleanPoints,
        reference_text: referenceText || null,
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPoints(cleanPoints);
    toast.success("Section enregistrée");
  };

  if (loading) return <p className="text-muted-foreground">Chargement…</p>;

  return (
    <div className="max-w-6xl">
      <header className="flex items-center justify-between mb-6">
        <Link to="/admin/sections" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <Button onClick={save} disabled={saving}>
          <Save className="w-4 h-4 mr-1" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border rounded-xl p-5 space-y-4">
            <div>
              <Label>Titre de la section *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 text-lg" />
            </div>
            <div>
              <Label>Texte de présentation</Label>
              <Textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={6} className="mt-1" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Points clés</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPoints([...points, ""])}
                >
                  <Plus className="w-3 h-3 mr-1" /> Ajouter
                </Button>
              </div>
              <div className="space-y-2">
                {points.length === 0 && (
                  <p className="text-xs text-muted-foreground">Aucun point clé. Cliquez sur "Ajouter".</p>
                )}
                {points.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={p}
                      onChange={(e) => {
                        const next = [...points];
                        next[idx] = e.target.value;
                        setPoints(next);
                      }}
                      placeholder="Ex: Conforme RE 2020"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setPoints(points.filter((_, i) => i !== idx))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Référence chantier (optionnel)</Label>
              <Textarea
                value={referenceText}
                onChange={(e) => setReferenceText(e.target.value)}
                rows={2}
                className="mt-1"
                placeholder="Ex: Référence : Groupe La Glacière — 1 200 m²"
              />
            </div>
          </div>

          <div className="bg-card border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-lg">Galerie photos</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ⭐ étoile = photo favorite • Glisser = réordonner
                </p>
              </div>
              <label className="cursor-pointer">
                <Button asChild disabled={uploading}>
                  <span>
                    <Upload className="w-4 h-4 mr-1" /> {uploading ? "…" : "Ajouter"}
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
              </label>
            </div>

            {photos.length === 0 ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer hover:bg-muted/30">
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Cliquer ou glisser des images</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
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
                        onSetFavorite={setFavorite}
                        onUpdateCaption={updateCaption}
                        onDelete={deletePhoto}
                        onBlurCaption={saveCaption}
                        onMove={movePhoto}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-card border rounded-xl p-4 text-sm space-y-2">
            <h3 className="font-semibold">Infos</h3>
            <p className="text-xs text-muted-foreground">
              Page : <strong>{page === "coeur-metier" ? "Cœur de Métier" : "Solutions Innovantes"}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Identifiant : <code className="text-[10px]">{slug}</code>
            </p>
          </div>
          <div className="bg-card border rounded-xl p-4 text-sm space-y-2">
            <h3 className="font-semibold">Conseils</h3>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Ajoutez 3 à 6 photos par section pour une galerie riche</li>
              <li>La photo "favorite" est mise en avant en premier</li>
              <li>Légendes courtes recommandées (1 ligne)</li>
              <li>Format paysage (4:3 ou 16:9) idéal</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SectionEditor;
