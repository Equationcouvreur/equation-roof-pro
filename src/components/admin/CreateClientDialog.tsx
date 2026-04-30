import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RefreshCw, Copy, Check } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}

const generatePassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let p = "";
  for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
  return p;
};

const CreateClientDialog = ({ open, onOpenChange, onCreated }: Props) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState<"client" | "employee">("client");
  const [permanent, setPermanent] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setFullName("");
    setEmail("");
    setCompany("");
    setRole("client");
    setPermanent(true);
    setExpiresAt("");
    setPassword(generatePassword());
    setCreated(null);
    setCopied(false);
  };

  const handleCreate = async () => {
    if (!fullName || !email || !password) {
      toast.error("Remplissez tous les champs requis");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("admin-create-client", {
      body: {
        email,
        password,
        full_name: fullName,
        company: company || null,
        role,
        expires_at: permanent || !expiresAt ? null : new Date(expiresAt).toISOString(),
      },
    });
    setSubmitting(false);
    const errMsg = error?.message ?? (data as { error?: string })?.error;
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    setCreated({ email, password });
    onCreated();
  };

  const copyCreds = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(
      `Espace Client EQUATION\nLien : ${window.location.origin}/espace-client\nEmail : ${created.email}\nMot de passe : ${created.password}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="max-w-md">
        {!created ? (
          <>
            <DialogHeader>
              <DialogTitle>Créer un accès client</DialogTitle>
              <DialogDescription>Le compte sera créé avec un mot de passe à transmettre au client.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label>Nom complet *</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Entreprise</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={role} onValueChange={(v) => setRole(v as "client" | "employee")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <Label>Accès permanent</Label>
                  <p className="text-xs text-muted-foreground">Sinon, définissez une date d'expiration</p>
                </div>
                <Switch checked={permanent} onCheckedChange={setPermanent} />
              </div>
              {!permanent && (
                <div>
                  <Label>Date d'expiration</Label>
                  <Input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                </div>
              )}
              <div>
                <Label>Mot de passe *</Label>
                <div className="flex gap-2">
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Button type="button" variant="outline" size="icon" onClick={() => setPassword(generatePassword())} title="Générer">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? "Création..." : "Créer l'accès"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Accès créé ✓</DialogTitle>
              <DialogDescription>Transmettez ces identifiants au client. Le mot de passe ne sera plus affiché.</DialogDescription>
            </DialogHeader>
            <div className="bg-muted rounded-md p-4 space-y-2 font-mono text-sm">
              <div>
                <span className="text-muted-foreground">Lien :</span> {window.location.origin}/espace-client
              </div>
              <div>
                <span className="text-muted-foreground">Email :</span> {created.email}
              </div>
              <div>
                <span className="text-muted-foreground">Mot de passe :</span> {created.password}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={copyCreds}>
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copié" : "Copier"}
              </Button>
              <Button onClick={() => onOpenChange(false)}>Fermer</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
