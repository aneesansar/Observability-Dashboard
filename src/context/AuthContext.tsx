import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import keycloak from "../auth/keycloak";
import type Keycloak from "keycloak-js";

interface TenantRole {
  tenant: string;
  role: string;
}

interface AuthContextType {
  keycloak: Keycloak;
  authenticated: boolean;
  initializing: boolean;
  token?: string;
  tenants: string[];
  tenantRoles: TenantRole[];
  activeTenant?: string;
  switchTenant: (tenant: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState<string>();
  const [tenantRoles, setTenantRoles] = useState<TenantRole[]>([]);
  const [activeTenant, setActiveTenant] = useState<string>();
  const [tenants, setTenants] = useState<string[]>([]);
  const initOnceRef = useRef(false);

  useEffect(() => {
    if (initOnceRef.current) return;
    initOnceRef.current = true;

    const initKeycloak = async () => {
      try {
        const isAuth = await keycloak.init({
          onLoad: "login-required",
          pkceMethod: "S256",
          checkLoginIframe: false,
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
        });

        if (isAuth) {
          setAuthenticated(true);
          setToken(keycloak.token);

          const allRoles = keycloak.realmAccess?.roles || [];
          const parsedRoles: TenantRole[] = allRoles
            .filter((r) => r.includes(":"))
            .map((r) => {
              const [tenant, role] = r.split(":");
              return { tenant, role };
            });
          
          const uniqueTenants = [...new Set(parsedRoles.map((r) => r.tenant))];          
          setTenantRoles(parsedRoles);
          setTenants(uniqueTenants);
          
          // Check if user has manually switched tenant (stored in sessionStorage)
          const storedTenant = sessionStorage.getItem('activeTenant');
          let selectedTenant: string | undefined;
          
          if (storedTenant && uniqueTenants.includes(storedTenant)) {
            // Use stored tenant if valid
            selectedTenant = storedTenant;
          } else {
            // Otherwise use first tenant from roles
            selectedTenant = uniqueTenants[0] || undefined;
          }
          
          setActiveTenant(selectedTenant);

          keycloak.onTokenExpired = () => {
            keycloak.updateToken(60).then((refreshed) => {
              if (refreshed && keycloak.token) setToken(keycloak.token);
            });
          };
        } else {
          keycloak.login();
        }
      } catch (err: any) {
        // In React 18 StrictMode, effects run twice in DEV which can cause Keycloak to be initialized already.
        if (typeof err?.message === "string" && err.message.includes("only be initialized once")) {
          const alreadyAuth = (keycloak as any).authenticated || !!keycloak.token;
          setAuthenticated(!!alreadyAuth);
          if (keycloak.token) setToken(keycloak.token);
          // still attach token refresh handler if possible
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(60).then((refreshed) => {
              if (refreshed && keycloak.token) setToken(keycloak.token);
            });
          };
        } else {
          console.error("Keycloak init error:", err);
        }
      } finally {
        setInitializing(false);
      }
    };

    void initKeycloak();
  }, []);

  const switchTenant = (tenant: string) => {
    if (tenants.includes(tenant)) {
      setActiveTenant(tenant);
      // Store in sessionStorage so API calls use the new tenant
      sessionStorage.setItem('activeTenant', tenant);
      // Reload the page to reinitialize API calls with new tenant
      window.location.reload();
    } else {
      console.warn("⚠️ Attempted to switch to invalid tenant:", tenant);
    }
  };

  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  if (initializing) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        authenticated,
        initializing,
        token,
        tenants,
        tenantRoles,
        activeTenant,
        switchTenant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
