/**
 * Query Builder Helper
 * 
 * Utility function for building URL query parameters.
 */

/**
 * Build query parameters from an object
 * @param params - Object containing query parameters
 * @returns URL-encoded query string
 */
export const buildQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};
