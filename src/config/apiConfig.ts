// src/config/apiConfig.ts

export const API_CONFIG = {
  BASE_URL: "http://localhost:8001",
  ENDPOINTS: {},
  AUTH: {
    KEYCLOAK_URL: "http://localhost:90/",
    KEYCLOAK_REALM: "Opentelemetry_Frontend",
    KEYCLOAK_CLIENT_ID: "Opentelemetry_frontend",
  },

  // Default request settings (optional)
  HEADERS: {
    "Content-Type": "application/json",
  },
};
