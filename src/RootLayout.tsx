import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import {
  logFrontendError,
  maybeReloadOnChunkError,
  clearChunkReloadFlag,
} from "@/lib/error-logger";

// NOTE: HelmetProvider is intentionally NOT used here.
// vite-react-ssg wraps the whole app in its own HelmetProvider on both client
// and server, so any nested provider would create an isolated context that
// vite-react-ssg cannot read when serializing meta tags into the static HTML.

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Survive transient backend hiccups instead of crashing the UI
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false;
        const msg = error instanceof Error ? error.message : String(error);
        // Don't retry auth/permission errors
        if (/40[0-3]/.test(msg)) return false;
        return true;
      },
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const GlobalErrorHandlers = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Successfully mounted — clear any pending "we already auto-reloaded" flag
    clearChunkReloadFlag();

    const onError = (event: ErrorEvent) => {
      if (maybeReloadOnChunkError(event.error || event.message)) return;
      void logFrontendError(event.error || event.message, { source: "window.error" });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      if (maybeReloadOnChunkError(event.reason)) return;
      void logFrontendError(event.reason, { source: "unhandledrejection" });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return null;
};

const RootLayout = () => (
  <AppErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <GlobalErrorHandlers />
          <ScrollToTop />
          <Outlet />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </AppErrorBoundary>
);

export default RootLayout;
