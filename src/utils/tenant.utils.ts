/**
 * Tenant Utilities
 * 
 * Helper functions for extracting and managing tenant information from Keycloak roles
 */

import keycloak from '@/auth/keycloak';

/**
 * Extract tenant from Keycloak roles
 * Roles are expected to be in format "tenant:role" (e.g., "glomas:admin")
 * 
 * Note: If user has manually switched tenant via AuthContext.switchTenant(),
 * that value should be used instead. This function provides the default/first tenant.
 * 
 * @returns The first tenant found in roles, or 'test_tenant' as fallback
 */
export const getCurrentTenant = (): string => {
  // Check if activeTenant is stored in sessionStorage (set by switchTenant)
  const storedTenant = sessionStorage.getItem('activeTenant');
  if (storedTenant) {
    return storedTenant;
  }

  const roles = keycloak.realmAccess?.roles || [];
  const tenantRoles = roles.filter((r) => r.includes(':'));
  
  if (tenantRoles.length > 0) {
    const [tenant] = tenantRoles[0].split(':');
    return tenant;
  }
  
  // Fallback to default tenant
  return 'test_tenant';
};

/**
 * Get all tenants from Keycloak roles
 * 
 * @returns Array of unique tenant names
 */
export const getAllTenants = (): string[] => {
  const roles = keycloak.realmAccess?.roles || [];
  const tenantRoles = roles
    .filter((r) => r.includes(':'))
    .map((r) => r.split(':')[0]);
  
  return [...new Set(tenantRoles)];
};

/**
 * Get all roles for a specific tenant
 * 
 * @param tenant - The tenant name to filter roles for
 * @returns Array of role names for the specified tenant
 */
export const getTenantRoles = (tenant: string): string[] => {
  const roles = keycloak.realmAccess?.roles || [];
  return roles
    .filter((r) => r.startsWith(`${tenant}:`))
    .map((r) => r.split(':')[1]);
};

/**
 * Check if user has a specific role for a tenant
 * 
 * @param tenant - The tenant name
 * @param role - The role name to check
 * @returns True if user has the role for the tenant
 */
export const hasRole = (tenant: string, role: string): boolean => {
  const roles = keycloak.realmAccess?.roles || [];
  return roles.includes(`${tenant}:${role}`);
};
