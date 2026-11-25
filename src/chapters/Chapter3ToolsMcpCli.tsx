import React from 'react';
import { Terminal, Shield, Plug, Wrench, Box } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { McpProtocolExplorer } from '../components/diagrams/McpProtocolExplorer';

export function Chapter3ToolsMcpCli({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Action Layer"
        title="Function Calling, MCP & Agentic CLIs"
        description="Tools turn a text generator into an actor in the real world. In this chapter you'll learn how constrained JSON tool calling works, how the Model Context Protocol (MCP) standardizes integrations, and why CLIs + sandboxes are an agent's sharpest tools."
      />

      <SectionHeader
        eyebrow="1. Under the Hood"
        title="How LLM Function Calling Actually Works"
        description="Models do NOT execute your functions. Instead, your app injects JSON Schema tool declarations into the prompt; the model uses constrained decoding / fine-tuned special tokens to emit a structured call request; your runtime executes the function and feeds the output back."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<Wrench className="h-4 w-4" />} title="Crystal-Clear Schemas" badge="Prompt Engineering">
          Tool descriptions ARE prompts. Document edge cases, units, and formats directly in parameter
          descriptions. Prefer enums over free-form strings whenever possible.
        </ConceptCard>
        <ConceptCard icon={<Plug className="h-4 w-4" />} title="Parallel Tool Calling" badge="Latency Win">
          Modern models emit multiple independent tool calls in one turn (e.g., fetching weather +
          calendar + flights simultaneously). Execute them with <code>asyncio.gather()</code> or{' '}
          <code>Promise.all()</code>!
        </ConceptCard>
        <ConceptCard icon={<Shield className="h-4 w-4" />} title="Graceful Tool Errors" badge="Self-Healing">
          Never crash the agent loop when a tool fails! Return an actionable error string like{' '}
          <code>"Error: date must be YYYY-MM-DD, got 12/04"</code> so the agent self-corrects on the next step.
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="2. Open Standard"
        title="Model Context Protocol (MCP)"
        description="Before MCP, connecting M agents to N tools required M × N brittle custom integrations. MCP turns it into M + N: build one MCP Server for Postgres, GitHub, Jira, or Slack, and every MCP-compatible agent (ADK, Claude, Cursor, LangGraph, Antigravity) can plug right in."
      />

      <McpProtocolExplorer />

      <div className="grid gap-4 md:grid-cols-2">
        <ConceptCard icon={<Plug className="h-4 w-4" />} title="MCP Transports" badge="Local & Remote">
          <ul className="list-disc space-y-1 pl-4">
            <li><strong>stdio:</strong> Local subprocess over stdin/stdout. Zero network latency; ideal for local CLIs, IDEs, and desktop apps.</li>
            <li><strong>Streamable HTTP (replaced legacy SSE):</strong> Stateless or stateful HTTP endpoint with optional SSE streaming and OAuth 2.1 auth. Ideal for Cloud Run / enterprise SaaS.</li>
          </ul>
        </ConceptCard>
        <ConceptCard icon={<Box className="h-4 w-4" />} title="MCP vs. Traditional REST APIs" badge="Design Tip">
          Don&apos;t blindly wrap 200 low-level CRUD REST endpoints as 200 MCP tools! That bloats the context
          window and confuses tool selection. Design <strong>5–15 coarse-grained, intent-level tools</strong>{' '}
          (e.g., <code>investigate_order_issue</code> instead of 8 separate table getters).
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="3. The Unix Superpower"
        title="Agentic CLIs & Sandboxed Execution"
        description="LLMs have seen billions of tokens of bash, git, grep, jq, curl, gcloud, and python during pre-training. Giving an agent a scoped CLI inside an isolated sandbox often beats dozens of bespoke API wrappers."
      />

      <Callout type="warning" title="Never Run Agent-Generated Code on Your Host Machine!">
        <p>
          Always isolate shell/code execution inside ephemeral sandboxes: <strong>Docker + gVisor</strong>,{' '}
          <strong>Firecracker MicroVMs</strong> (E2B, Modal, Fly Machines), or{' '}
          <strong>Vertex AI Code Execution</strong>. Enforce read-only mounts, egress firewall allowlists,
          CPU/RAM cgroups, and short execution timeouts (15–60s).
        </p>
      </Callout>

      <CodeBlock
        title="Build a Production MCP Server in 20 Lines (FastMCP Python & TypeScript)"
        tabs={[
          {
            label: 'Python (FastMCP)',
            language: 'python',
            code: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("analytics-tools")

@mcp.tool()
def get_daily_signups(days: int = 7) -> dict:
    """Return daily user signup counts for the past N days (1-90)."""
    if not 1 <= days <= 90:
        return {"error": "days must be between 1 and 90"}
    return {"days": days, "total": 4280, "trend": "+14.2%"}

@mcp.resource("schema://users")
def users_schema() -> str:
    """Read-only SQL schema for the users table."""
    return "CREATE TABLE users (id UUID PRIMARY KEY, plan TEXT, created_at TIMESTAMPTZ);"

if __name__ == "__main__":
    # Supports stdio locally or streamable-http on Cloud Run
    mcp.run(transport="streamable-http")`,
          },
          {
            label: 'TypeScript (@modelcontextprotocol/sdk)',
            language: 'typescript',
            code: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "analytics-tools", version: "1.0.0" });

server.tool(
  "get_daily_signups",
  "Return daily user signup counts for the past N days",
  { days: z.number().min(1).max(90).default(7) },
  async ({ days }) => ({
    content: [{ type: "text", text: JSON.stringify({ days, total: 4280, trend: "+14.2%" }) }],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);`,
          },
        ]}
      />
    </div>
  );
}
