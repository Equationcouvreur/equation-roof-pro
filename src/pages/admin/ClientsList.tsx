import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FolderOpen, Trash2, Power, KeyRound } from "lucide-react";
import { toast } from "sonner";
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
import CreateClientDialog from "@/components/admin/CreateClientDialog";

interface ClientUser {
  id: string;
  email: string;
  full_name: string;
  company: string | null;
  role: "client" | "employee";
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  doc_count?: number;
}

const ClientsList = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ClientUser | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("client_users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    // Fetch doc counts
    const ids = (data ?? []).map((c) => c.id);
    let counts: Record<string, number> = {};
    if (ids.length > 0) {
      const { data: docs } = await supabase
        .from("client_documents")
        .select("client_user_id")
        .in("client_user_id", ids);
      counts = (docs ?? []).reduce<Record<string, number>>((acc, d) => {
        acc[d.client_user_id] = (acc[d.client_user_id] ?? 0) + 1;
        return acc;
      }, {});
    }
    setClients((data ?? []).map((c) => ({ ...c, doc_count: counts[c.id] ?? 0 })) as ClientUser[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const isExpired = (c: ClientUser) =>
    c.expires_at !== null && new Date(c.expires_at) < new Date();

  const toggleActive = async (c: ClientUser) => {
    const { error } = await supabase
      .from("client_users")
      .update({ is_active: !c.is_active })
      .eq("id", c.id);
    if (error) toast.error(error.message);
    else {
      toast.success(c.is_active ? "Accès désactivé" : "Accès activé");
      void load();
    }
  };

  const sendReset = async (c: ClientUser) => {
    const { error } = await supabase.auth.resetPasswordForEmail(c.email, {
      redirectTo: `${window.location.origin}/espace-client/update-password`,
    });
    if (error) toast.error(error.message);
    else toast.success(`Mail de reset envoyé à ${c.email}`);
  };

  const deleteClient = async (c: ClientUser) => {
    const { data, error } = await supabase.functions.invoke("admin-delete-client", {
      body: { client_user_id: c.id },
    });
    if (error || (data as { error?: string })?.error) {
      toast.error(error?.message ?? (data as { error?: string }).error ?? "Erreur");
    } else {
      toast.success("Client supprimé");
      void load();
    }
    setToDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading text-foreground">Espace Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez les accès clients et employés</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau client
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Entreprise</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Aucun client. Créez le premier accès.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((c) => {
                const expired = isExpired(c);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.full_name}</TableCell>
                    <TableCell className="text-sm">{c.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.company ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{c.role === "client" ? "Client" : "Employé"}</Badge>
                    </TableCell>
                    <TableCell>
                      {!c.is_active ? (
                        <Badge variant="secondary">Désactivé</Badge>
                      ) : expired ? (
                        <Badge variant="destructive">Expiré</Badge>
                      ) : (
                        <Badge className="bg-green-600 hover:bg-green-700">Actif</Badge>
                      )}
                    </TableCell>
                    <TableCell>{c.doc_count ?? 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/clients/${c.id}`)}
                          title="Voir documents"
                        >
                          <FolderOpen className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleActive(c)} title={c.is_active ? "Désactiver" : "Activer"}>
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => sendReset(c)} title="Envoyer reset mdp">
                          <KeyRound className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setToDelete(c)} title="Supprimer">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={() => void load()} />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce client ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera l'accès, tous ses documents et son compte de connexion. Action irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => toDelete && deleteClient(toDelete)} className="bg-destructive">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsList;
