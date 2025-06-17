# MCP Discovery Service

This project provides a lightweight registry for [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) servers. MCP servers can register themselves so that routers or other clients can discover available tools.

## Features

- **Register MCP servers** via `POST /register` with JSON information about the server
- **List servers** with `GET /servers`
- **Query a server** with `GET /servers/:name`
- **Remove a server** with `DELETE /servers/:name`

The service is implemented in TypeScript using Express and stores data in memory.

## Development

```bash
npm install
npm run dev
```

The registry will start on port `4000` by default. Use `npm run build` to compile TypeScript to `dist/` and `npm start` to run the compiled code.
