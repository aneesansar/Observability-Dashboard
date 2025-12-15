import Keycloak from 'keycloak-js';
import { API_CONFIG } from '../config/apiConfig';

const keycloak = new Keycloak({
  url: API_CONFIG.AUTH.KEYCLOAK_URL,
  realm: API_CONFIG.AUTH.KEYCLOAK_REALM,
  clientId: API_CONFIG.AUTH.KEYCLOAK_CLIENT_ID,
});

export default keycloak;
