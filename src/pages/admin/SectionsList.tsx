import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Image as ImageIcon } from "lucide-react";

interface Section {
  id: string;
  slug: string;
  page: string;
  title: string;
  display_order: number;
  photo_count?: number;
}

const PAGE_LABELS: Record<string, string> = {
  "coeur-metier": "Cœur de Métier",
  "solutions-innovantes": "Solutions Innovantes",
};

const SectionsList = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: secs } = await supabase
        .from("site_sections")
        .select("id, slug, page, title, display_order")
        .order("page")
        .order("display_order");
      const { data: photos } = await supabase
        .from("section_photos")
        .select("section_id");
      const counts: Record<string, number> = {};
      (photos || []).forEach((p) => {
        counts[p.section_id] = (counts[p.section_id] || 0) + 1;
      });
      setSections((secs || []).map((s) => ({ ...s, photo_count: counts[s.id] || 0 })));
      setLoading(false);
    })();
  }, []);

  const grouped = sections.reduce<Record<string, Section[]>>((acc, s) => {
    (acc[s.page] = acc[s.page] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl">
      <header className="mb-6">
        <h1 className="font-heading text-3xl text-foreground">Sections du site</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modifiez le titre, le texte, les points clés et les photos de chaque section publique.
        </p>
      </header>

      {loading ? (
        <p className="text-muted-foreground">Chargement…</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([page, items]) => (
            <section key={page}>
              <h2 className="font-heading text-lg text-foreground mb-3">{PAGE_LABELS[page] || page}</h2>
              <div className="bg-card border rounded-xl divide-y">
                {items.map((s) => (
                  <Link
                    key={s.id}
                    to={`/admin/sections/${s.id}`}
                    className="flex items-center justify-between p-4 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-body font-medium text-foreground truncate">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {s.photo_count} photo{(s.photo_count || 0) > 1 ? "s" : ""}
                        </span>
                        <code className="text-[10px]">{s.slug}</code>
                      </p>
                    </div>
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionsList;
