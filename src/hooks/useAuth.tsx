import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role =
  | "admin"
  | "editor"
  | "blog_editor"
  | "realisations_editor"
  | "sections_editor"
  | "recrutement_editor"
  | "commercial"
  | "user";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  roles: Role[];
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  can: (section: "blog" | "realisations" | "sections" | "recrutement" | "clients") => boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (uid: string) => {
    const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid);

    if (error) {
      console.error("Impossible de récupérer les rôles utilisateur", error);
      setRoles([]);
      return;
    }

    setRoles((data?.map((r) => r.role) as Role[]) || []);
  };

  useEffect(() => {
    let mounted = true;

    const applySession = async (sess: Session | null) => {
      if (!mounted) return;
      setLoading(true);
      setSession(sess);
      setUser(sess?.user ?? null);

      if (sess?.user) {
        await fetchRoles(sess.user.id);
      } else {
        setRoles([]);
      }

      if (mounted) setLoading(false);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      void applySession(sess);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      void applySession(sess);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: fullName },
      },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        loading,
        isAdmin: roles.includes("admin"),
        isEditor: roles.includes("admin") || roles.includes("editor"),
        can: (section) => {
          if (roles.includes("admin") || roles.includes("editor")) return true;
          switch (section) {
            case "blog": return roles.includes("blog_editor");
            case "realisations": return roles.includes("realisations_editor");
            case "sections": return roles.includes("sections_editor");
            case "recrutement": return roles.includes("recrutement_editor");
            case "clients": return roles.includes("commercial");
            default: return false;
          }
        },
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
