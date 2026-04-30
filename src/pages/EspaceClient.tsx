import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, FileText, ImageIcon, Video, Download, Eye, LogOut } from "lucide-react";
import logoMain from "@/assets/logo-equation-main.png";
import { extractYouTubeId } from "@/lib/youtube";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ClientUser {
  id: string;
  full_name: string;
  is_active: boolean;
  expires_at: string | null;
}

interface ClientDoc {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  storage_path: string;
  file_type: "pdf" | "image" | "video" | "other";
  file_size_bytes: number | null;
  uploaded_at: string;
}

const EspaceClient = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"loading" | "login" | "ready">("loading");
  const [client, setClient] = useState<ClientUser | null>(null);
  const [docs, setDocs] = useState<ClientDoc[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "pdf" | "image" | "video">("all");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<{ type: "pdf" | "image" | "video" | "youtube"; url: string; title: string } | null>(null);

  const checkSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setPhase("login");
      return;
    }
    // Try to fetch own client_users row
    const { data: c } = await supabase
      .from("client_users")
      .select("id, full_name, is_active, expires_at")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!c) {
      // Not a client (might be admin) — just go login
      await supabase.auth.signOut();
      setPhase("login");
      return;
    }

    if (!c.is_active) {
      toast.error("Votre accès a été désactivé. Contactez EQUATION au 04 73 87 53 50");
      await supabase.auth.signOut();
      setPhase("login");
      return;
    }

    if (c.expires_at && new Date(c.expires_at) < new Date()) {
      toast.error("Votre accès a expiré. Contactez EQUATION au 04 73 87 53 50");
      await supabase.auth.signOut();
      setPhase("login");
      return;
    }

    setClient(c as ClientUser);
    await loadDocs(c.id);
    setPhase("ready");
  };

  const loadDocs = async (clientId: string) => {
    const { data } = await supabase
      .from("client_documents")
      .select("*")
      .eq("client_user_id", clientId)
      .order("uploaded_at", { ascending: false });
    const docsList = (data ?? []) as ClientDoc[];
    setDocs(docsList);

    // Generate signed URLs for images (thumbnails) and videos (player)
    const map: Record<string, string> = {};
    for (const d of docsList) {
      if (d.file_type === "image" || d.file_type === "video") {
        const { data: signed } = await supabase.storage
          .from("client-documents")
          .createSignedUrl(d.storage_path, 3600);
        if (signed) map[d.id] = signed.signedUrl;
      }
    }
    setSignedUrls(map);
  };

  useEffect(() => {
    void checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error("Email ou mot de passe incorrect");
      return;
    }
    void checkSession();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setClient(null);
    setDocs([]);
    setPhase("login");
  };

  const downloadDoc = async (d: ClientDoc) => {
    const { data, error } = await supabase.storage.from("client-documents").createSignedUrl(d.storage_path, 60, {
      download: d.title,
    });
    if (error || !data) {
      toast.error("Erreur de téléchargement");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const viewPdf = async (d: ClientDoc) => {
    const { data } = await supabase.storage.from("client-documents").createSignedUrl(d.storage_path, 600);
    if (data) setPreview({ type: "pdf", url: data.signedUrl, title: d.title });
  };

  if (phase === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (phase === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 pt-32">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border">
          <div className="text-center mb-6">
            <img src={logoMain} alt="EQUATION" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-heading text-foreground">Espace Client</h1>
            <p className="text-sm text-muted-foreground mt-1">Accédez à vos documents de projet</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>Mot de passe</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "..." : "Se connecter"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-6">
            Besoin d'un accès ? Contactez EQUATION au 04 73 87 53 50
          </p>
        </div>
      </div>
    );
  }

  const filtered = docs.filter((d) => filter === "all" || d.file_type === filter);

  return (
    <div className="min-h-screen bg-secondary/20 pt-32 pb-16">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading text-foreground">Bienvenue {client?.full_name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{docs.length} document(s) disponible(s)</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
          </Button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { v: "all", l: "Tous" },
            { v: "pdf", l: "PDF" },
            { v: "image", l: "Images" },
            { v: "video", l: "Vidéos" },
          ].map((f) => (
            <Button
              key={f.v}
              size="sm"
              variant={filter === f.v ? "default" : "outline"}
              onClick={() => setFilter(f.v as typeof filter)}
            >
              {f.l}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">
              Aucun document pour le moment. Votre interlocuteur EQUATION vous ajoutera vos documents de projet ici.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d) => {
              const ytId = d.file_type === "video" ? extractYouTubeId(d.file_url) : null;
              return (
                <div key={d.id} className="bg-card border rounded-lg overflow-hidden flex flex-col">
                  {d.file_type === "image" && signedUrls[d.id] && (
                    <button
                      onClick={() => setPreview({ type: "image", url: signedUrls[d.id], title: d.title })}
                      className="aspect-video bg-muted overflow-hidden"
                    >
                      <img src={signedUrls[d.id]} alt={d.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    </button>
                  )}
                  {d.file_type === "video" && (
                    <div className="aspect-video bg-noir">
                      {ytId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : signedUrls[d.id] ? (
                        <video src={signedUrls[d.id]} controls className="w-full h-full" />
                      ) : null}
                    </div>
                  )}
                  {d.file_type === "pdf" && (
                    <div className="aspect-video bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-red-600" />
                    </div>
                  )}
                  {d.file_type === "other" && (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <FileText className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium text-foreground line-clamp-1">{d.title}</h3>
                    {d.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{d.description}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(d.uploaded_at).toLocaleDateString("fr-FR")}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {d.file_type === "pdf" && (
                        <Button size="sm" variant="outline" onClick={() => viewPdf(d)} className="flex-1">
                          <Eye className="w-4 h-4 mr-1" /> Voir
                        </Button>
                      )}
                      <Button size="sm" onClick={() => downloadDoc(d)} className="flex-1">
                        <Download className="w-4 h-4 mr-1" /> Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
          <DialogContent className="max-w-5xl h-[85vh] p-0">
            {preview?.type === "pdf" && (
              <iframe src={preview.url} className="w-full h-full rounded-lg" title={preview.title} />
            )}
            {preview?.type === "image" && (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <img src={preview.url} alt={preview.title} className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EspaceClient;
