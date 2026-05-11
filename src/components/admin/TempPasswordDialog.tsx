import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Copy, Check, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface Target {
  name: string;
  user_id?: string;
  client_user_id?: string;
}

interface Props {
  target: Target | null;
  onClose: () => void;
}

const TempPasswordDialog = ({ target, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!target) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-generate-temp-password", {
      body: target.user_id
        ? { user_id: target.user_id }
        : { client_user_id: target.client_user_id },
    });
    setLoading(false);
    const errMsg = error?.message || (data as { error?: string })?.error;
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    setPassword((data as { password: string }).password);
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Mot de passe copié");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setPassword(null);
    setCopied(false);
    onClose();
  };

  if (!target) return null;

  // Step 1: confirmation
  if (!password) {
    return (
      <AlertDialog open onOpenChange={(o) => !o && handleClose()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser le mot de passe de {target.name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Un nouveau mot de passe va être généré pour cet utilisateur. Vous pourrez le copier
              et le lui transmettre par téléphone, SMS ou WhatsApp. L'utilisateur pourra ensuite
              le modifier depuis son profil s'il le souhaite.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); void handleGenerate(); }} disabled={loading}>
              {loading ? "Réinitialisation…" : "Réinitialiser"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Step 2: show password
  return (
    <Dialog open onOpenChange={(o) => !o && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" /> Nouveau mot de passe
          </DialogTitle>
          <DialogDescription>
            Transmettez ce nouveau mot de passe à <strong>{target.name}</strong> par le moyen de
            votre choix (téléphone, SMS, WhatsApp). Ce mot de passe est désormais le mot de passe
            officiel du compte. L'utilisateur peut le modifier à tout moment depuis son profil.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-4 rounded-lg bg-muted border-2 border-dashed border-primary/30">
          <p className="font-mono text-2xl text-center text-foreground tracking-wider select-all break-all">
            {password}
          </p>
        </div>

        <p className="text-xs text-destructive font-medium">
          ⚠️ Pour des raisons de sécurité, il ne sera plus affiché après fermeture de cette fenêtre.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Fermer</Button>
          <Button onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copié" : "Copier le mot de passe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TempPasswordDialog;
