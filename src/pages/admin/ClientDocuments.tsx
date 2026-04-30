import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, ImageIcon, Video, File as FileIcon, Trash2, Download, Upload } from "lucide-react";
import { toast } from "sonner";

interface ClientUser {
  id: string;
  full_name: string;
  company: string | null;
  email: string;
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

const detectType = (file: File): ClientDoc["file_type"] => {
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "other";
};

const formatSize = (b: number | null) => {
  if (!b) return "—";
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} Ko`;
  return `${(b / (1024 * 1024)).toFixed(1)} Mo`;
};

const ClientDocuments = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [client, setClient] = useState<ClientUser | null>(null);
  const [docs, setDocs] = useState<ClientDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const [{ data: c }, { data: d }] = await Promise.all([
      supabase.from("client_users").select("id, full_name, company, email").eq("id", id).maybeSingle(),
      supabase.from("client_documents").select("*").eq("client_user_id", id).order("uploaded_at", { ascending: false }),
    ]);
    setClient(c as ClientUser | null);
    setDocs((d ?? []) as ClientDoc[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [id]);

  const uploadFiles = async (files: FileList) => {
    if (!id) return;
    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 50 Mo`);
        continue;
      }
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("client-documents")
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        toast.error(`${file.name}: ${upErr.message}`);
        continue;
      }
      const { error: insErr } = await supabase.from("client_documents").insert({
        client_user_id: id,
        title: file.name,
        file_url: path,
        storage_path: path,
        file_type: detectType(file),
        file_size_bytes: file.size,
        uploaded_by: user?.id,
      });
      if (insErr) toast.error(insErr.message);
    }
    setUploading(false);
    void load();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) void uploadFiles(e.dataTransfer.files);
  };

  const downloadDoc = async (d: ClientDoc) => {
    const { data, error } = await supabase.storage.from("client-documents").createSignedUrl(d.storage_path, 60);
    if (error || !data) {
      toast.error("Erreur de téléchargement");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const deleteDoc = async (d: ClientDoc) => {
    if (!confirm(`Supprimer "${d.title}" ?`)) return;
    await supabase.storage.from("client-documents").remove([d.storage_path]);
    const { error } = await supabase.from("client_documents").delete().eq("id", d.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Supprimé");
      void load();
    }
  };

  const renameDoc = async (d: ClientDoc, newTitle: string) => {
    if (newTitle === d.title) return;
    await supabase.from("client_documents").update({ title: newTitle }).eq("id", d.id);
    void load();
  };

  const updateDesc = async (d: ClientDoc, desc: string) => {
    await supabase.from("client_documents").update({ description: desc }).eq("id", d.id);
  };

  const totalBytes = docs.reduce((sum, d) => sum + (d.file_size_bytes ?? 0), 0);

  const iconFor = (t: string) => {
    if (t === "pdf") return <FileText className="w-5 h-5 text-red-600" />;
    if (t === "image") return <ImageIcon className="w-5 h-5 text-blue-600" />;
    if (t === "video") return <Video className="w-5 h-5 text-purple-600" />;
    return <FileIcon className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/clients")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
      </Button>

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : !client ? (
        <p className="text-destructive">Client introuvable</p>
      ) : (
        <>
          <h1 className="text-2xl font-heading text-foreground mb-1">
            Documents de {client.full_name}
            {client.company && <span className="text-muted-foreground"> — {client.company}</span>}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{client.email}</p>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6 hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {uploading ? "Upload en cours..." : "Glissez-déposez des fichiers ou cliquez pour parcourir"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, images, vidéos — 50 Mo max par fichier</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              accept=".pdf,.jpg,.jpeg,.png,.webp,.mp4,.mov"
            />
          </div>

          <div className="space-y-2">
            {docs.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Aucun document.</p>
            ) : (
              docs.map((d) => (
                <div key={d.id} className="bg-card border rounded-lg p-4 flex items-start gap-4">
                  <div className="mt-1">{iconFor(d.file_type)}</div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input
                      defaultValue={d.title}
                      onBlur={(e) => void renameDoc(d, e.target.value)}
                      className="font-medium"
                    />
                    <Textarea
                      defaultValue={d.description ?? ""}
                      placeholder="Description (optionnelle)"
                      onBlur={(e) => void updateDesc(d, e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <div className="text-xs text-muted-foreground">
                      {formatSize(d.file_size_bytes)} · Ajouté le {new Date(d.uploaded_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="ghost" onClick={() => downloadDoc(d)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteDoc(d)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 text-sm text-muted-foreground text-right">
            Stockage utilisé : <strong>{formatSize(totalBytes)}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientDocuments;
