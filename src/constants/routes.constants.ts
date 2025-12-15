/**
 * Application Route Constants
 * 
 * Centralized route paths for the application.
 */

export const ROUTES = {
  HOME: '/',
  FEEDBACK: '/feedback',
  REALTIME_SEARCH: '/realtime-search',
  SEMANTIC_SEARCH: '/semantic-search',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
