import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, Hammer, Users, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Tableau de bord", end: true },
  { to: "/admin/articles", icon: FileText, label: "Articles" },
  { to: "/admin/realisations", icon: Hammer, label: "Réalisations" },
];

const AdminLayout = () => {
  const { signOut, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-secondary/20 pt-24">
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-[calc(100vh-6rem)] top-24 left-0">
        <div className="p-6 border-b">
          <h2 className="font-heading text-xl text-foreground">Admin</h2>
          <p className="text-xs text-muted-foreground truncate mt-1">{user?.email}</p>
          {isAdmin && <span className="inline-block mt-1 text-[10px] uppercase font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded">Admin</span>}
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )
              }
            >
              <Users className="w-4 h-4" />
              Utilisateurs
            </NavLink>
          )}
        </nav>

        <div className="p-3 border-t space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-body text-muted-foreground hover:bg-secondary">
            <ExternalLink className="w-4 h-4" /> Voir le site
          </a>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start gap-3 text-muted-foreground">
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
