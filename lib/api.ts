const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function apiBase(): string {
  return raw.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase()}${p}`;
}

export type ApiEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

export async function parseApi<T>(res: Response): Promise<T> {
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    if (!res.ok) throw new Error(res.statusText || "Request failed");
    throw new Error("Unexpected API response");
  }
  const obj = json as ApiEnvelope<T> | { message?: string };
  if (!res.ok) {
    const msg =
      typeof obj === "object" && obj && "message" in obj && typeof obj.message === "string"
        ? obj.message
        : res.statusText;
    throw new Error(msg);
  }
  if (typeof obj === "object" && obj && "data" in obj) {
    return obj.data as T;
  }
  throw new Error("Unexpected API response");
}
