import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plug, Server, Terminal, FileText, Wrench, MessageSquareCode } from 'lucide-react';

type McpFlowKey = 'discover' | 'tool' | 'resource' | 'prompt';

const MCP_FLOWS: Record<
  McpFlowKey,
  {
    title: string;
    primitive: string;
    transport: string;
    request: string;
    response: string;
    explanation: string;
  }
> = {
  discover: {
    title: '1. Handshake & Tool Discovery',
    primitive: 'tools/list',
    transport: 'JSON-RPC 2.0 over stdio / Streamable HTTP',
    request: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "query_postgres",
        "description": "Run a read-only SQL query against analytics DB",
        "inputSchema": {
          "type": "object",
          "properties": { "sql": { "type": "string" } },
          "required": ["sql"]
        }
      }
    ]
  }
}`,
    explanation:
      'When an MCP Client connects to a Server, it dynamically discovers available tools and their JSON Schemas — zero hardcoded glue code needed!',
  },
  tool: {
    title: '2. Model-Controlled Tool Call',
    primitive: 'tools/call',
    transport: 'JSON-RPC 2.0 (Model decides when to invoke)',
    request: `{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "query_postgres",
    "arguments": {
      "sql": "SELECT plan, COUNT(*) FROM users GROUP BY plan;"
    }
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "[{\\"plan\\": \\"pro\\", \\"count\\": 4120}, {\\"plan\\": \\"free\\", \\"count\\": 18940}]"
      }
    ],
    "isError": false
  }
}`,
    explanation:
      'The LLM emits a tool call; the MCP Host routes it through the Client to the exact Server owning that tool, then feeds the structured result back into the LLM context.',
  },
  resource: {
    title: '3. Application-Controlled Resource Read',
    primitive: 'resources/read',
    transport: 'URI-addressed read-only context',
    request: `{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/read",
  "params": {
    "uri": "postgres://analytics/schema/users"
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "contents": [
      {
        "uri": "postgres://analytics/schema/users",
        "mimeType": "text/plain",
        "text": "TABLE users (id UUID, email TEXT, plan TEXT, created_at TIMESTAMPTZ);"
      }
    ]
  }
}`,
    explanation:
      'Resources expose read-only data (schemas, files, git diffs, metrics) via URIs so the Host app can attach fresh context without risking side effects.',
  },
  prompt: {
    title: '4. User-Controlled Prompt Template',
    primitive: 'prompts/get',
    transport: 'Reusable slash-command workflows',
    request: `{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "prompts/get",
  "params": {
    "name": "weekly_churn_report",
    "arguments": { "days": "7" }
  }
}`,
    response: `{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Analyze user churn over the last 7 days using query_postgres and highlight top 3 drivers."
        }
      }
    ]
  }
}`,
    explanation:
      'Prompts let MCP Servers ship domain-expert workflow templates (often surfaced as /slash commands in IDEs and chat UIs).',
  },
};

export function McpProtocolExplorer() {
  const [flow, setFlow] = useState<McpFlowKey>('discover');
  const current = MCP_FLOWS[flow];

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Interactive Protocol Explorer
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            Model Context Protocol (MCP) — The &ldquo;USB-C&rdquo; for AI Agents
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['discover', 'tools/list', <Plug className="h-3.5 w-3.5" />],
              ['tool', 'tools/call', <Wrench className="h-3.5 w-3.5" />],
              ['resource', 'resources/read', <FileText className="h-3.5 w-3.5" />],
              ['prompt', 'prompts/get', <MessageSquareCode className="h-3.5 w-3.5" />],
            ] as const
          ).map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setFlow(key)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition ${
                flow === key
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Animated Architecture Diagram */}
        <svg viewBox="0 0 640 140" className="mx-auto w-full max-w-3xl select-none">
          <defs>
            <marker id="mcp-arrow-fwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
            </marker>
            <marker id="mcp-arrow-rev" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Host Box */}
          <rect x="10" y="20" width="165" height="96" rx="14" fill="#0f172a" stroke="#6366f1" strokeWidth="1.8" />
          <text x="92" y="48" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontWeight="700">
            MCP HOST (APP / IDE)
          </text>
          <text x="92" y="68" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
            Agent + LLM Runtime
          </text>
          <rect x="28" y="80" width="128" height="24" rx="6" fill="#1e293b" stroke="#475569" />
          <text x="92" y="96" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="600">
            MCP Client (1:1)
          </text>

          {/* Animated Forward Arrow (Request) */}
          <path
            d="M 180 54 L 395 54"
            stroke="#34d399"
            strokeWidth="2.2"
            className="animate-dash-flow"
            markerEnd="url(#mcp-arrow-fwd)"
          />
          <rect x="225" y="34" width="126" height="18" rx="4" fill="#064e3b" />
          <text x="288" y="46" textAnchor="middle" fill="#6ee7b7" fontSize="9.5" fontFamily="monospace" fontWeight="700">
            REQ: {current.primitive}
          </text>

          {/* Animated Reverse Arrow (Response) */}
          <path
            d="M 398 88 L 183 88"
            stroke="#38bdf8"
            strokeWidth="2.2"
            className="animate-dash-flow"
            markerEnd="url(#mcp-arrow-rev)"
          />
          <rect x="222" y="94" width="132" height="18" rx="4" fill="#0c4a6e" />
          <text x="288" y="106" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontFamily="monospace" fontWeight="700">
            RES: JSON-RPC 2.0
          </text>

          {/* Server Box */}
          <rect x="405" y="20" width="225" height="96" rx="14" fill="#0f172a" stroke="#10b981" strokeWidth="1.8" />
          <text x="517" y="44" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontWeight="700">
            MCP SERVER (LOCAL / REMOTE)
          </text>
          <text x="517" y="63" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">
            Postgres / GitHub / Slack
          </text>
          <g transform="translate(420, 76)">
            <rect
              width="60"
              height="26"
              rx="6"
              fill={flow === 'tool' || flow === 'discover' ? '#059669' : '#1e293b'}
            />
            <text x="30" y="16" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="600">
              Tools
            </text>
            <rect
              x="68"
              width="64"
              height="26"
              rx="6"
              fill={flow === 'resource' ? '#059669' : '#1e293b'}
            />
            <text x="100" y="16" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="600">
              Resources
            </text>
            <rect
              x="140"
              width="58"
              height="26"
              rx="6"
              fill={flow === 'prompt' ? '#059669' : '#1e293b'}
            />
            <text x="169" y="16" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="600">
              Prompts
            </text>
          </g>
        </svg>

        <motion.div
          key={flow}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-display text-sm font-bold text-white">{current.title}</h4>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-0.5 text-[11px] font-medium text-slate-300">
              <Server className="h-3 w-3 text-emerald-400" />
              {current.transport}
            </span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-slate-300">{current.explanation}</p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-900">
              <div className="flex items-center gap-1.5 border-b border-slate-800 bg-emerald-950/40 px-3 py-1.5 font-mono text-[11px] font-bold text-emerald-300">
                <Terminal className="h-3.5 w-3.5" /> Client → Server Request
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-[11.5px] leading-relaxed text-slate-200">
                <code>{current.request}</code>
              </pre>
            </div>
            <div className="overflow-hidden rounded-xl border border-sky-500/30 bg-slate-900">
              <div className="flex items-center gap-1.5 border-b border-slate-800 bg-sky-950/40 px-3 py-1.5 font-mono text-[11px] font-bold text-sky-300">
                <Terminal className="h-3.5 w-3.5" /> Server → Client Response
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-[11.5px] leading-relaxed text-slate-200">
                <code>{current.response}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
