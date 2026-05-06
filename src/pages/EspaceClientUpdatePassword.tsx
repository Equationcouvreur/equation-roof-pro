import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, CheckCircle2 } from "lucide-react";

const passwordSchema = z
  .string()
  .min(8, { message: "8 caractères minimum" })
  .max(100)
  .regex(/[A-Z]/, { message: "Au moins une majuscule" })
  .regex(/[0-9]/, { message: "Au moins un chiffre" });

const EspaceClientUpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Mot de passe mis à jour, connectez-vous");
    await supabase.auth.signOut();
    navigate("/espace-client");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 pt-32">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-heading text-foreground">Nouveau mot de passe</h1>
          <p className="text-sm text-muted-foreground mt-1">Choisissez un mot de passe sécurisé.</p>
        </div>

        {!ready ? (
          <p className="text-center text-sm text-muted-foreground">
            Lien invalide ou expiré. Demandez un nouveau lien depuis « Mot de passe oublié ».
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pw">Nouveau mot de passe</Label>
              <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <p className="text-xs text-muted-foreground mt-1">8 caractères min., 1 majuscule, 1 chiffre.</p>
            </div>
            <div>
              <Label htmlFor="cpw">Confirmer le mot de passe</Label>
              <Input id="cpw" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                "Mise à jour…"
              ) : (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Mettre à jour
                </span>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EspaceClientUpdatePassword;
