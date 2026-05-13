import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertTriangle, Download, Search, Image as ImageIcon } from "lucide-react";
import KeywordsInput from "@/components/admin/KeywordsInput";
import { useKeywordSuggestions } from "@/hooks/useKeywordSuggestions";

type Source = "realisations" | "sections" | "blog";

type MediaRow = {
  source: Source;
  rowId: string;
  parentId: string | null;
  parentLabel: string;
  url: string;
  fileName: string;
  alt_text: string;
  keywords: string[];
  caption: string | null;
};

const fileNameFromUrl = (url: string) => {
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.split("/").pop() || url);
  } catch {
    return url.split("/").pop() || url;
  }
};

const tableForSource = (s: Source) =>
  s === "realisations" ? "realisation_photos" : s === "sections" ? "section_photos" : "blog_articles";

const AdminMedias = () => {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Source | "all">("all");
  const [search, setSearch] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);
  const suggestions = useKeywordSuggestions();

  const load = async () => {
    setLoading(true);
    const [r, s, b] = await Promise.all([
      supabase
        .from("realisation_photos")
        .select("id,url,alt_text,keywords,caption,realisation_id,realisations(title)")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("section_photos")
        .select("id,url,alt_text,keywords,caption,section_id,site_sections(title,page)")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("blog_articles")
        .select("id,title,cover_image_url,cover_alt_text,cover_keywords")
        .not("cover_image_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(1000),
    ]);

    const list: MediaRow[] = [];

    type RPhoto = { id: string; url: string; alt_text: string | null; keywords: string[] | null; caption: string | null; realisation_id: string; realisations?: { title?: string } | null };
    (r.data as RPhoto[] | null)?.forEach((p) => {
      list.push({
        source: "realisations",
        rowId: p.id,
        parentId: p.realisation_id,
        parentLabel: p.realisations?.title || "Réalisation",
        url: p.url,
        fileName: fileNameFromUrl(p.url),
        alt_text: p.alt_text || "",
        keywords: p.keywords || [],
        caption: p.caption,
      });
    });
    type SPhoto = { id: string; url: string; alt_text: string | null; keywords: string[] | null; caption: string | null; section_id: string; site_sections?: { title?: string; page?: string } | null };
    (s.data as SPhoto[] | null)?.forEach((p) => {
      list.push({
        source: "sections",
        rowId: p.id,
        parentId: p.section_id,
        parentLabel: p.site_sections?.title || "Section",
        url: p.url,
        fileName: fileNameFromUrl(p.url),
        alt_text: p.alt_text || "",
        keywords: p.keywords || [],
        caption: p.caption,
      });
    });
    type BArt = { id: string; title: string; cover_image_url: string; cover_alt_text: string | null; cover_keywords: string[] | null };
    (b.data as BArt[] | null)?.forEach((a) => {
      list.push({
        source: "blog",
        rowId: a.id,
        parentId: a.id,
        parentLabel: a.title,
        url: a.cover_image_url,
        fileName: fileNameFromUrl(a.cover_image_url),
        alt_text: a.cover_alt_text || "",
        keywords: a.cover_keywords || [],
        caption: null,
      });
    });

    setRows(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (filter !== "all" && r.source !== filter) return false;
      if (onlyMissing && r.alt_text.trim()) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay =
          r.fileName.toLowerCase() +
          " " +
          r.alt_text.toLowerCase() +
          " " +
          r.keywords.join(" ").toLowerCase() +
          " " +
          r.parentLabel.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filter, onlyMissing, search]);

  const missingCount = rows.filter((r) => !r.alt_text.trim()).length;

  const updateRow = (rowId: string, source: Source, patch: Partial<MediaRow>) => {
    setRows((prev) => prev.map((r) => (r.rowId === rowId && r.source === source ? { ...r, ...patch } : r)));
  };

  const commitRow = async (row: MediaRow, patch: Partial<MediaRow>) => {
    const t = tableForSource(row.source);
    const update: Record<string, unknown> = {};
    if (row.source === "blog") {
      if ("alt_text" in patch) update.cover_alt_text = patch.alt_text || null;
      if ("keywords" in patch) update.cover_keywords = patch.keywords || [];
    } else {
      if ("alt_text" in patch) update.alt_text = patch.alt_text || "";
      if ("keywords" in patch) update.keywords = patch.keywords || [];
      if ("caption" in patch) update.caption = patch.caption ?? null;
    }
    if (!Object.keys(update).length) return;
    // @ts-expect-error dynamic table
    const { error } = await supabase.from(t).update(update).eq("id", row.rowId);
    if (error) toast.error(error.message);
  };

  const exportCsv = () => {
    const header = ["source", "parent", "url", "file", "alt_text", "keywords", "caption"];
    const escape = (v: string) => `"${(v || "").replace(/"/g, '""')}"`;
    const lines = [
      header.join(","),
      ...filtered.map((r) =>
        [
          r.source,
          escape(r.parentLabel),
          escape(r.url),
          escape(r.fileName),
          escape(r.alt_text),
          escape(r.keywords.join("|")),
          escape(r.caption || ""),
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `medias-equation-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading text-2xl flex items-center gap-2">
            <ImageIcon className="w-6 h-6" /> Médias
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {rows.length} image(s) • {missingCount > 0 ? (
              <span className="text-destructive font-semibold">
                {missingCount} sans texte alternatif — à compléter pour le SEO
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold">Toutes les images sont documentées 🎉</span>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="w-4 h-4 mr-1" /> Exporter CSV
        </Button>
      </header>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par mot-clé, alt, fichier…"
            className="pl-8"
          />
        </div>
        {(["all", "realisations", "sections", "blog"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Tout" : f === "realisations" ? "Réalisations" : f === "sections" ? "Sections" : "Blog"}
          </Button>
        ))}
        <Button
          variant={onlyMissing ? "destructive" : "outline"}
          size="sm"
          onClick={() => setOnlyMissing((v) => !v)}
        >
          <AlertTriangle className="w-4 h-4 mr-1" /> Sans alt
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border rounded-xl p-10 text-center text-muted-foreground">
          Aucune image ne correspond à vos filtres.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((row) => {
            const altMissing = !row.alt_text.trim();
            return (
              <div
                key={`${row.source}-${row.rowId}`}
                className={`bg-card border rounded-lg p-3 grid grid-cols-1 md:grid-cols-[88px_1fr_1.5fr] gap-3 ${
                  altMissing ? "border-destructive/40" : ""
                }`}
              >
                <a href={row.url} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={row.url}
                    alt={row.alt_text || row.fileName}
                    loading="lazy"
                    className="w-22 h-22 md:w-[88px] md:h-[88px] object-cover rounded-md bg-muted"
                  />
                </a>
                <div className="min-w-0 text-sm space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-semibold tracking-wide bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                      {row.source}
                    </span>
                    <span className="text-foreground font-medium truncate">{row.parentLabel}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate" title={row.fileName}>
                    {row.fileName}
                  </p>
                  {altMissing && (
                    <p className="text-xs text-destructive font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Sans texte alternatif
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    value={row.alt_text}
                    onChange={(e) => updateRow(row.rowId, row.source, { alt_text: e.target.value })}
                    onBlur={(e) => commitRow(row, { alt_text: e.target.value })}
                    placeholder="Texte alternatif (SEO) — décrivez l'image"
                    className={altMissing ? "border-destructive/60" : ""}
                  />
                  <KeywordsInput
                    value={row.keywords}
                    onChange={(v) => updateRow(row.rowId, row.source, { keywords: v })}
                    onCommit={(v) => commitRow(row, { keywords: v })}
                    suggestions={suggestions}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminMedias;
