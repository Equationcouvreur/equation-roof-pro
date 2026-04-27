import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, ShieldCheck, User as UserIcon } from "lucide-react";

interface UserRow {
  id: string;
  full_name: string | null;
  roles: string[];
}

const Users = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("id, full_name");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const merged = (profiles || []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      roles: (roles || []).filter((r) => r.user_id === p.id).map((r) => r.role),
    }));
    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (userId: string, role: "admin" | "editor", has: boolean) => {
    if (has) {
      await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      toast.success(`Rôle ${role} retiré`);
    } else {
      await supabase.from("user_roles").insert({ user_id: userId, role });
      toast.success(`Rôle ${role} attribué`);
    }
    load();
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-3xl font-heading text-foreground">Utilisateurs</h1>
        <p className="text-muted-foreground font-body mt-1">Gérez les rôles d'accès à l'admin</p>
      </header>

      {loading ? <p>Chargement…</p> : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Utilisateur</th>
                <th className="px-4 py-3 text-left">Rôles actuels</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const isAdmin = u.roles.includes("admin");
                const isEditor = u.roles.includes("editor");
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
                      <div className="flex gap-1">
                        {isAdmin && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Admin</span>}
                        {isEditor && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1"><Shield className="w-3 h-3" /> Éditeur</span>}
                        {!isAdmin && !isEditor && <span className="text-xs text-muted-foreground">Aucun</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <Button size="sm" variant={isEditor ? "secondary" : "outline"} onClick={() => toggleRole(u.id, "editor", isEditor)}>
                          {isEditor ? "Retirer éditeur" : "Faire éditeur"}
                        </Button>
                        <Button size="sm" variant={isAdmin ? "secondary" : "outline"} onClick={() => toggleRole(u.id, "admin", isAdmin)}>
                          {isAdmin ? "Retirer admin" : "Faire admin"}
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
