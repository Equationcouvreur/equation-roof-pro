import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, GitMerge, Pencil, Search, Tag, Trash2 } from "lucide-react";
import { dedupeKeywords, foldKeyword, normalizeKeyword } from "@/lib/keywords";

type TableKey = "realisation_photos" | "section_photos" | "blog_articles";
const TABLES: { table: TableKey; col: "keywords" | "cover_keywords" }[] = [
  { table: "realisation_photos", col: "keywords" },
  { table: "section_photos", col: "keywords" },
  { table: "blog_articles", col: "cover_keywords" },
];

type Row = { id: string; arr: string[]; table: TableKey; col: "keywords" | "cover_keywords" };

const fetchAll = async (): Promise<Row[]> => {
  const out: Row[] = [];
  const [r, s, b] = await Promise.all([
    supabase.from("realisation_photos").select("id,keywords").limit(5000),
    supabase.from("section_photos").select("id,keywords").limit(5000),
    supabase.from("blog_articles").select("id,cover_keywords").limit(5000),
  ]);
  (r.data as { id: string; keywords: string[] | null }[] | null)?.forEach((x) =>
    out.push({ id: x.id, arr: x.keywords || [], table: "realisation_photos", col: "keywords" }),
  );
  (s.data as { id: string; keywords: string[] | null }[] | null)?.forEach((x) =>
    out.push({ id: x.id, arr: x.keywords || [], table: "section_photos", col: "keywords" }),
  );
  (b.data as { id: string; cover_keywords: string[] | null }[] | null)?.forEach((x) =>
    out.push({ id: x.id, arr: x.cover_keywords || [], table: "blog_articles", col: "cover_keywords" }),
  );
  return out;
};

const updateRow = async (row: Row, nextArr: string[]) => {
  const patch = { [row.col]: nextArr } as Record<string, string[]>;
  // @ts-expect-error dynamic table
  const { error } = await supabase.from(row.table).update(patch).eq("id", row.id);
  if (error) throw error;
};

const AdminKeywords = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");

  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [mergeFrom, setMergeFrom] = useState<string>("");
  const [mergeTo, setMergeTo] = useState<string>("");

  const load = async () => {
    setLoading(true);
    setRows(await fetchAll());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of rows) {
      const seen = new Set<string>();
      for (const kw of r.arr) {
        const norm = normalizeKeyword(kw);
        if (!norm || seen.has(norm)) continue;
        seen.add(norm);
        map.set(norm, (map.get(norm) || 0) + 1);
      }
    }
    return Array.from(map.entries())
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => a.keyword.localeCompare(b.keyword, "fr"));
  }, [rows]);

  const filtered = useMemo(() => {
    if (!search.trim()) return counts;
    const q = foldKeyword(search);
    return counts.filter((c) => foldKeyword(c.keyword).includes(q));
  }, [counts, search]);

  // ------------------- Actions -------------------

  const replaceKeyword = async (oldKw: string, newKwRaw: string) => {
    const newKw = normalizeKeyword(newKwRaw);
    if (!newKw) {
      toast.error("Le mot-clé ne peut pas être vide.");
      return;
    }
    const oldFold = foldKeyword(oldKw);
    const newFold = foldKeyword(newKw);
    setBusy(true);
    try {
      const updates: Promise<void>[] = [];
      for (const r of rows) {
        if (!r.arr.some((k) => foldKeyword(k) === oldFold)) continue;
        const next = dedupeKeywords(r.arr.map((k) => (foldKeyword(k) === oldFold ? newKw : normalizeKeyword(k))));
        updates.push(updateRow(r, next));
      }
      await Promise.all(updates);
      toast.success(
        oldFold === newFold
          ? `Mot-clé renommé en "${newKw}".`
          : `Mot-clé fusionné dans "${newKw}".`,
      );
      await load();
    } catch (e) {
      toast.error((e as Error).message || "Erreur lors de la mise à jour.");
    } finally {
      setBusy(false);
    }
  };

  const deleteKeyword = async (kw: string) => {
    const fold = foldKeyword(kw);
    setBusy(true);
    try {
      const updates: Promise<void>[] = [];
      for (const r of rows) {
        if (!r.arr.some((k) => foldKeyword(k) === fold)) continue;
        const next = dedupeKeywords(r.arr.filter((k) => foldKeyword(k) !== fold).map(normalizeKeyword));
        updates.push(updateRow(r, next));
      }
      await Promise.all(updates);
      toast.success(`Mot-clé "${kw}" supprimé partout.`);
      await load();
    } catch (e) {
      toast.error((e as Error).message || "Erreur lors de la suppression.");
    } finally {
      setBusy(false);
    }
  };

  // ------------------- Render -------------------

  return (
    <div className="max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <Link
            to="/admin/medias"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux médias
          </Link>
          <h1 className="font-heading text-2xl flex items-center gap-2">
            <Tag className="w-6 h-6" /> Mots-clés
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {counts.length} mot(s)-clé(s) utilisé(s) sur l'ensemble des images du site.
          </p>
        </div>
        <Button
          variant="default"
          onClick={() => {
            setMergeFrom("");
            setMergeTo("");
            setMergeOpen(true);
          }}
          disabled={counts.length < 2}
        >
          <GitMerge className="w-4 h-4 mr-1" /> Fusionner
        </Button>
      </header>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un mot-clé…"
          className="pl-8"
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border rounded-xl p-10 text-center text-muted-foreground">
          Aucun mot-clé trouvé.
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <ul className="divide-y">
            {filtered.map(({ keyword, count }) => (
              <li
                key={keyword}
                className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-muted/40"
              >
                <span className="font-medium flex-1 min-w-[140px] break-all">{keyword}</span>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {count} image{count > 1 ? "s" : ""}
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRenameTarget(keyword);
                      setRenameValue(keyword);
                    }}
                    disabled={busy}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Renommer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteTarget(keyword)}
                    disabled={busy}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1 text-destructive" /> Supprimer
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rename dialog */}
      <Dialog open={!!renameTarget} onOpenChange={(o) => !o && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le mot-clé</DialogTitle>
            <DialogDescription>
              Le nouveau nom remplacera "{renameTarget}" sur toutes les images concernées.
              Si un mot-clé identique existe déjà, ils seront fusionnés.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Nouveau nom"
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameTarget(null)}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!renameTarget) return;
                await replaceKeyword(renameTarget, renameValue);
                setRenameTarget(null);
              }}
              disabled={busy || !renameValue.trim()}
            >
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce mot-clé ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le mot-clé "{deleteTarget}" est utilisé sur{" "}
              {counts.find((c) => c.keyword === deleteTarget)?.count || 0} image(s). Il sera
              retiré de toutes ces images. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!deleteTarget) return;
                await deleteKeyword(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Merge dialog */}
      <Dialog open={mergeOpen} onOpenChange={setMergeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fusionner deux mots-clés</DialogTitle>
            <DialogDescription>
              Toutes les images marquées avec le 1ᵉʳ mot-clé seront re-marquées avec le 2ⁿᵈ.
              Le 1ᵉʳ disparaît.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Mot-clé à supprimer</label>
              <Select value={mergeFrom} onValueChange={setMergeFrom}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  {counts.map((c) => (
                    <SelectItem key={c.keyword} value={c.keyword}>
                      {c.keyword} ({c.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Mot-clé à conserver</label>
              <Select value={mergeTo} onValueChange={setMergeTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent>
                  {counts
                    .filter((c) => c.keyword !== mergeFrom)
                    .map((c) => (
                      <SelectItem key={c.keyword} value={c.keyword}>
                        {c.keyword} ({c.count})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setMergeOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!mergeFrom || !mergeTo) return;
                await replaceKeyword(mergeFrom, mergeTo);
                setMergeOpen(false);
              }}
              disabled={busy || !mergeFrom || !mergeTo || mergeFrom === mergeTo}
            >
              Fusionner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminKeywords;
