import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Search, Trash2, Mail, Phone, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Application = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string;
  position: string | null;
  message: string;
  cv_url: string | null;
  cv_filename: string | null;
  cv_size_bytes: number | null;
  status: string;
  admin_notes: string | null;
  reviewed_at: string | null;
};

const STATUSES = [
  { value: "new", label: "Nouveau", color: "bg-blue-100 text-blue-800" },
  { value: "in_review", label: "En cours d'examen", color: "bg-yellow-100 text-yellow-800" },
  { value: "interview", label: "Entretien planifié", color: "bg-purple-100 text-purple-800" },
  { value: "hired", label: "Embauché", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Refusé", color: "bg-red-100 text-red-800" },
  { value: "archived", label: "Archivé", color: "bg-gray-100 text-gray-800" },
];

const statusMeta = (s: string) => STATUSES.find((x) => x.value === s) || STATUSES[0];

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

const ApplicationsList = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [savingNotes, setSavingNotes] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setApps(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!a.full_name.toLowerCase().includes(s) && !a.email.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [apps, filter, search]);

  const newCount = apps.filter((a) => a.status === "new").length;

  const downloadCv = async (a: Application) => {
    if (!a.cv_url) return toast.error("Aucun CV");
    setDownloadingId(a.id);
    const { data, error } = await supabase.storage.from("cv-candidats").createSignedUrl(a.cv_url, 60);
    setDownloadingId(null);
    if (error || !data) return toast.error(error?.message || "Erreur");
    window.open(data.signedUrl, "_blank");
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("job_applications")
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Statut mis à jour");
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status, reviewed_at: new Date().toISOString() } : a)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const saveNotes = async (id: string, notes: string) => {
    setSavingNotes(true);
    const { error } = await supabase.from("job_applications").update({ admin_notes: notes }).eq("id", id);
    setSavingNotes(false);
    if (error) return toast.error(error.message);
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, admin_notes: notes } : a)));
  };

  const deleteApp = async (a: Application) => {
    if (!confirm(`Supprimer la candidature de ${a.full_name} ?`)) return;
    if (a.cv_url) {
      await supabase.storage.from("cv-candidats").remove([a.cv_url]);
    }
    const { error } = await supabase.from("job_applications").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success("Candidature supprimée");
    setSelected(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl text-foreground flex items-center gap-3">
            Candidatures
            {newCount > 0 && (
              <span className="text-xs font-subtitle font-semibold uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded-full">
                {newCount} nouvelle{newCount > 1 ? "s" : ""}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Toutes les candidatures reçues via le site.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-border rounded-lg pl-9 pr-4 py-2 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="all">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground font-body">Aucune candidature.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50 text-left text-xs uppercase font-subtitle text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Candidat</th>
                <th className="px-4 py-3">Poste</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((a) => {
                const meta = statusMeta(a.status);
                return (
                  <tr key={a.id} className="text-sm font-body hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                          {initials(a.full_name)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{a.full_name}</div>
                          <div className="text-xs text-muted-foreground">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.position || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(a.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-subtitle font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {a.cv_url && (
                          <Button size="sm" variant="ghost" onClick={() => downloadCv(a)} disabled={downloadingId === a.id} title="Télécharger CV">
                            {downloadingId === a.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setSelected(a)}>
                          Voir détails
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">{selected.full_name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm font-body">
                  <div>
                    <p className="text-xs uppercase font-subtitle text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${selected.email}`} className="text-primary hover:underline flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {selected.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-subtitle text-muted-foreground mb-1">Téléphone</p>
                    <a href={`tel:${selected.phone}`} className="text-primary hover:underline flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {selected.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-subtitle text-muted-foreground mb-1">Poste</p>
                    <p className="text-foreground">{selected.position || "Candidature spontanée"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase font-subtitle text-muted-foreground mb-1">Reçue le</p>
                    <p className="text-foreground">{formatDate(selected.created_at)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase font-subtitle text-muted-foreground mb-2">Message</p>
                  <div className="bg-secondary/30 border border-border rounded-lg p-4 text-sm font-body text-foreground whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                {selected.cv_url && (
                  <div>
                    <p className="text-xs uppercase font-subtitle text-muted-foreground mb-2">CV</p>
                    <Button onClick={() => downloadCv(selected)} disabled={downloadingId === selected.id} className="gap-2">
                      {downloadingId === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Télécharger {selected.cv_filename || "CV"}
                    </Button>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase font-subtitle text-muted-foreground mb-2">Statut</p>
                  <select
                    value={selected.status}
                    onChange={(e) => updateStatus(selected.id, e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>

                <div>
                  <p className="text-xs uppercase font-subtitle text-muted-foreground mb-2">Notes internes</p>
                  <textarea
                    rows={4}
                    defaultValue={selected.admin_notes || ""}
                    onBlur={(e) => saveNotes(selected.id, e.target.value)}
                    placeholder="Vos observations sur cette candidature…"
                    className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  />
                  {savingNotes && <p className="text-xs text-muted-foreground mt-1">Enregistrement…</p>}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <Button variant="ghost" onClick={() => deleteApp(selected)} className="text-destructive hover:text-destructive gap-2">
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </Button>
                  <Button variant="outline" onClick={() => setSelected(null)}>Fermer</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsList;
