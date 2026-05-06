import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const emailSchema = z.string().trim().email({ message: "Email invalide" }).max(255);

const EspaceClientReset = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/espace-client/update-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 pt-32">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            {sent ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Mail className="w-6 h-6 text-primary" />}
          </div>
          <h1 className="text-2xl font-heading text-foreground">
            {sent ? "Email envoyé" : "Mot de passe oublié ?"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sent
              ? "Si un compte existe pour cette adresse, vous recevrez un email avec un lien de réinitialisation."
              : "Saisissez votre email pour recevoir un lien de réinitialisation."}
          </p>
        </div>

        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Envoi…" : "Envoyer le lien"}
            </Button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/espace-client" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="w-3 h-3" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EspaceClientReset;
