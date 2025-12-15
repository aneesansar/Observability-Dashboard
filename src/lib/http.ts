export type HttpOptions = RequestInit & { baseUrl?: string };

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
  const { baseUrl, headers, ...rest } = options;
  const fullUrl = baseUrl ? `${baseUrl}${url}` : url;

  const res = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    ...rest,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return (await res.json()) as T;
  const text = await res.text();
  return text as unknown as T;
}
