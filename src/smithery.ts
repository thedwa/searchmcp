export interface SmitheryServer {
  qualifiedName: string;
  displayName: string;
  description?: string;
  homepage?: string;
  iconUrl?: string;
  useCount?: number;
  isDeployed: boolean;
  remote: string;
  createdAt: string;
}

export interface SmitheryQuery {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface SmitheryResponse {
  items: SmitheryServer[];
  page?: number;
  pageSize?: number;
  total?: number;
}

export async function fetchSmitheryServers(token: string, query: SmitheryQuery = {}): Promise<SmitheryResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set('page', String(query.page));
  if (query.pageSize) params.set('pageSize', String(query.pageSize));
  if (query.q) params.set('q', query.q);
  const url = `https://registry.smithery.ai/servers?${params.toString()}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Smithery registry: ${res.status}`);
  }
  return res.json();
}
