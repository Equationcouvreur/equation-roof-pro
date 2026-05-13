import { Component, ReactNode } from "react";
import { logFrontendError, maybeReloadOnChunkError, isChunkLoadError } from "@/lib/error-logger";

interface State {
  hasError: boolean;
  autoReloading: boolean;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, autoReloading: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, autoReloading: isChunkLoadError(error) };
  }

  componentDidCatch(error: unknown) {
    const reloading = maybeReloadOnChunkError(error);
    if (!reloading) {
      void logFrontendError(error, { source: "AppErrorBoundary" });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    const reloading = this.state.autoReloading;
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          background: "#f7f4f0",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#1a1a1a",
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            background: "#ffffff",
            borderRadius: 12,
            padding: "2.5rem 2rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#971C30",
              margin: "0 auto 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              margin: "0 0 0.75rem",
              fontFamily: "Montserrat, Inter, sans-serif",
              color: "#971C30",
            }}
          >
            Une erreur temporaire est survenue
          </h1>
          <p style={{ margin: "0 0 1.75rem", fontSize: "0.95rem", lineHeight: 1.6, color: "#4a4a4a" }}>
            {reloading
              ? "Mise à jour de la page en cours, merci de patienter quelques secondes…"
              : "Réessayez dans quelques instants. Si le problème persiste, rafraîchissez la page ou revenez à l'accueil."}
          </p>
          {!reloading && (
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  background: "#971C30",
                  color: "#fff",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: 6,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Rafraîchir la page
              </button>
              <a
                href="/"
                style={{
                  background: "transparent",
                  color: "#971C30",
                  border: "1.5px solid #971C30",
                  padding: "0.75rem 1.5rem",
                  borderRadius: 6,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Retour à l'accueil
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
