export type KeycloakTokenParsed = {
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  realm_access?: { roles?: string[] };
  [k: string]: unknown;
};
