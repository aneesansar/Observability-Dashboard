import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

declare global {
  interface Window {
    __routeLoginTriggered?: boolean;
  }
}

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { initializing, authenticated, keycloak } = useAuth();

  useEffect(() => {
    if (initializing) return;
    if (!authenticated) {
      if (!window.__routeLoginTriggered) {
        window.__routeLoginTriggered = true;
        keycloak.login({ redirectUri: window.location.href }).catch(() => {
          setTimeout(() => {
            window.__routeLoginTriggered = false;
          }, 3000);
        });
      }
    }
  }, [initializing, authenticated, keycloak]);

  if (initializing) {
    return null;
  }
  if (!authenticated) {
    return null;
  }
  return <>{children}</>;
}
