import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShieldCheck, User as UserIcon, UserPlus, Trash2 } from "lucide-react";
import { z } from "zod";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin (accès total)" },
  { value: "editor", label: "Éditeur (toutes sections)" },
  { value: "blog_editor", label: "Éditeur Blog" },
  { value: "realisations_editor", label: "Éditeur Réalisations" },
  { value: "sections_editor", label: "Éditeur Sections" },
  { value: "recrutement_editor", label: "Éditeur Recrutement" },
  { value: "commercial", label: "Commercial (lecture espace client)" },
];

const inviteSchema = z.object({
  email: z.string().trim().email({ message: "Email invalide" }).max(255),
  full_name: z.string().trim().min(2, "Nom trop court").max(100),
  role: z.string().min(1),
});

interface UserRow {
  id: string;
  full_name: string | null;
  roles: string[];
}

const Users = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("blog_editor");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("id, full_name");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const merged = (profiles || []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      roles: (roles || []).filter((r) => r.user_id === p.id).map((r) => r.role as string),
    }));
    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = inviteSchema.safeParse({ email, full_name: fullName, role });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("admin-invite-user", {
      body: parsed.data,
    });
    setSubmitting(false);
    if (error || (data as { error?: string })?.error) {
      toast.error((data as { error?: string })?.error || error?.message || "Erreur");
      return;
    }
    toast.success("Invitation envoyée");
    setEmail(""); setFullName(""); setRole("blog_editor");
    setOpen(false);
    load();
  };

  const changeRole = async (userId: string, _currentRoles: string[], newRole: string) => {
    type Role = "admin" | "editor" | "blog_editor" | "realisations_editor" | "sections_editor" | "recrutement_editor" | "commercial" | "user";
    const adminRoles = ROLE_OPTIONS.map((r) => r.value) as Role[];
    await supabase.from("user_roles").delete().eq("user_id", userId).in("role", adminRoles);
    if (newRole) {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole as Role });
      if (error) { toast.error(error.message); return; }
    }
    toast.success("Rôle mis à jour");
    load();
  };

  const revoke = async (userId: string) => {
    if (!confirm("Révoquer tous les rôles de cet utilisateur ?")) return;
    await supabase.from("user_roles").delete().eq("user_id", userId);
    toast.success("Accès révoqué");
    load();
  };

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Utilisateurs</h1>
          <p className="text-muted-foreground font-body mt-1">Gérez les rôles d'accès à l'admin</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="w-4 h-4 mr-1" /> Inviter un utilisateur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Inviter un utilisateur</DialogTitle></DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Label htmlFor="iemail">Email</Label>
                <Input id="iemail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="iname">Nom complet</Label>
                <Input id="iname" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="irole">Rôle</Label>
                <select
                  id="irole"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Envoi…" : "Envoyer l'invitation"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {loading ? <p>Chargement…</p> : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Utilisateur</th>
                <th className="px-4 py-3 text-left">Rôles</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const currentRole = u.roles.find((r) => ROLE_OPTIONS.some((o) => o.value === r)) || "";
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><UserIcon className="w-4 h-4 text-primary" /></div>
                        <div>
                          <div className="font-medium text-foreground">{u.full_name || "Sans nom"}</div>
                          <div className="text-xs text-muted-foreground font-mono">{u.id.slice(0, 8)}…</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {u.roles.length === 0
                        ? <span className="text-xs text-muted-foreground">Aucun</span>
                        : <div className="flex flex-wrap gap-1">
                            {u.roles.map((r) => (
                              <span key={r} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> {ROLE_OPTIONS.find((o) => o.value === r)?.label || r}
                              </span>
                            ))}
                          </div>
                      }
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2 items-center">
                        <select
                          value={currentRole}
                          onChange={(e) => changeRole(u.id, u.roles, e.target.value)}
                          className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                        >
                          <option value="">— Aucun rôle admin —</option>
                          {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        <Button size="sm" variant="ghost" onClick={() => revoke(u.id)} title="Révoquer tout">
                          <Trash2 className="w-4 h-4 text-destructive" />
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
    </div>
  );
};

export default Users;
