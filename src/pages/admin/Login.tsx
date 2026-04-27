import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User as UserIcon } from "lucide-react";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Email invalide" }).max(255),
  password: z.string().min(6, { message: "6 caractères minimum" }).max(100),
  fullName: z.string().trim().max(100).optional(),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = authSchema.safeParse({ email, password, fullName: mode === "signup" ? fullName : undefined });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const result = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, fullName);

    if (result.error) {
      toast.error(result.error);
    } else {
      if (mode === "signup") {
        toast.success("Compte créé. Vérifiez votre email pour confirmer.");
      } else {
        toast.success("Connexion réussie");
        navigate("/admin");
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 pt-32">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-heading text-foreground">Espace administrateur</h1>
          <p className="text-sm text-muted-foreground mt-1">EQUATION — Gestion du contenu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" placeholder="Jean Dupont" required />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" placeholder="vous@equation.fr" required />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" placeholder="••••••••" required />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "..." : mode === "signin" ? "Se connecter" : "Créer un compte"}
          </Button>
        </form>

        <div className="text-center mt-6 text-sm">
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary hover:underline">
            {mode === "signin" ? "Créer un nouveau compte" : "J'ai déjà un compte"}
          </button>
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Retour au site</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
