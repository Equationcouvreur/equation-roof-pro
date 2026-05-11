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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyRound, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import TempPasswordDialog from "./TempPasswordDialog";

export interface PasswordTarget {
  name: string;
  user_id?: string;
  client_user_id?: string;
}

interface Props {
  target: PasswordTarget;
  // Where the reset email link should land. Use admin or client update-password page.
  redirectTo: string;
}

const PasswordResetActions = ({ target, redirectTo }: Props) => {
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const sendResetEmail = async () => {
    setSending(true);
    const { data, error } = await supabase.functions.invoke("admin-send-reset-email", {
      body: {
        ...(target.user_id ? { user_id: target.user_id } : {}),
        ...(target.client_user_id ? { client_user_id: target.client_user_id } : {}),
        redirect_to: redirectTo,
      },
    });
    setSending(false);
    const errMsg = error?.message || (data as { error?: string })?.error;
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    const email = (data as { email?: string })?.email;
    toast.success(
      email
        ? `Email envoyé à ${email}. La personne va recevoir un lien pour définir son nouveau mot de passe.`
        : "Email de réinitialisation envoyé.",
    );
    setConfirmEmailOpen(false);
  };

  return (
    <div className="inline-flex items-center gap-0.5">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setConfirmEmailOpen(true)}
        title="Envoyer un email de réinitialisation"
      >
        <KeyRound className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="px-1" title="Plus d'options">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setManualOpen(true)}>
            Définir manuellement un mot de passe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmEmailOpen} onOpenChange={setConfirmEmailOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Envoyer un email de réinitialisation de mot de passe à {target.name} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              La personne recevra un lien sécurisé par email pour définir un nouveau mot de passe.
              Le lien expire après quelques heures.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void sendResetEmail();
              }}
              disabled={sending}
            >
              {sending ? "Envoi…" : "Envoyer le mail"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TempPasswordDialog
        target={manualOpen ? target : null}
        onClose={() => setManualOpen(false)}
      />
    </div>
  );
};

export default PasswordResetActions;
