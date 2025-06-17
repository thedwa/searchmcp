import express, { Request, Response } from 'express';
import { fetchSmitheryServers } from './smithery.js';


export interface MCPServerInfo {
  name: string;
  url: string;
  description?: string;
  tools?: string[];
  lastHeartbeat?: number;
}

const registry: Record<string, MCPServerInfo> = {};

const app = express();
app.use(express.json());

app.post('/register', (req: Request, res: Response) => {
  const info: MCPServerInfo = req.body;
  if (!info.name || !info.url) {
    return res.status(400).json({ error: 'Missing required fields: name, url' });
  }
  registry[info.name] = { ...info, lastHeartbeat: Date.now() };
  console.log(`Registered MCP server: ${info.name} -> ${info.url}`);
  return res.status(200).json({ message: 'Registered successfully', server: info.name });
});

app.get('/servers', (_req: Request, res: Response) => {
  return res.json(Object.values(registry));
});

app.get('/servers/:name', (req: Request, res: Response) => {
  const entry = registry[req.params.name];
  if (!entry) {
    return res.status(404).json({ error: 'Server not found' });
  }
  return res.json(entry);
});

app.delete('/servers/:name', (req: Request, res: Response) => {
  const name = req.params.name;
  if (registry[name]) {
    delete registry[name];
    console.log(`Deregistered MCP server: ${name}`);
    return res.json({ message: `Server ${name} removed from registry.` });
  }
  return res.status(404).json({ error: 'Server not found in registry' });
});

app.get('/smithery', async (req: Request, res: Response) => {
  const token = process.env.SMITHERY_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'SMITHERY_TOKEN not set' });
  }
  try {
    const { q, page, pageSize } = req.query;
    const data = await fetchSmitheryServers(token, {
      q: typeof q === 'string' ? q : undefined,
      page: typeof page === 'string' ? parseInt(page, 10) : undefined,
      pageSize: typeof pageSize === 'string' ? parseInt(pageSize, 10) : undefined,
    });
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Failed to contact Smithery registry' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔍 MCP Registry running on port ${PORT}`);
});
