import React, { useState } from 'react';
import { Cloud, Shield, Database, Cpu, Activity, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface GcpNode {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  color: string;
  role: string;
  iam: string;
  snippet: string;
}

const GCP_NODES: GcpNode[] = [
  {
    id: 'armor',
    title: 'Model Armor',
    category: 'Security Edge',
    x: 90,
    y: 55,
    color: '#f43f5e',
    role: 'Screens incoming user prompts and outgoing LLM responses for prompt injection, jailbreaks, PII/SDP leakage, and malicious URLs before hitting your agent.',
    iam: 'roles/modelarmor.user',
    snippet: `gcloud model-armor templates create prod-agent-guard \\
  --location=us-central1 \\
  --pi-and-jailbreak-filter-settings-enforcement=ENABLED`,
  },
  {
    id: 'adk',
    title: 'Vertex AI Agent Engine',
    category: 'Managed Agent Runtime',
    x: 295,
    y: 55,
    color: '#3b82f6',
    role: 'Fully managed, auto-scaling runtime for Google ADK, LangGraph, or CrewAI agents with built-in Session service, Memory Bank, and OpenTelemetry tracing.',
    iam: 'roles/aiplatform.user',
    snippet: `from vertexai import agent_engines
from vertexai.preview import reasoning_engines

app = reasoning_engines.AdkApp(agent=root_agent)
remote_app = agent_engines.create(
    agent_engine=app,
    requirements=["google-adk>=1.0.0"],
    display_name="enterprise-ops-agent"
)`,
  },
  {
    id: 'gemini',
    title: 'Vertex AI Gemini',
    category: 'Foundation Models',
    x: 505,
    y: 55,
    color: '#8b5cf6',
    role: 'Enterprise Gemini models (Flash for fast routing/tool calls, Pro for deep reasoning) with 1M+ context, Context Caching, Grounding with Google Search, and VPC-SC.',
    iam: 'roles/aiplatform.user',
    snippet: `from google import genai
client = genai.Client(vertexai=True, project="my-proj", location="us-central1")
resp = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="Analyze Q3 cohort churn"
)`,
  },
  {
    id: 'memory',
    title: 'Memory Bank & AlloyDB',
    category: 'State & Vector RAG',
    x: 155,
    y: 185,
    color: '#10b981',
    role: 'Vertex AI Memory Bank extracts long-term episodic facts per user across sessions; AlloyDB / Cloud SQL with pgvector + ScaNN serves low-latency hybrid RAG.',
    iam: 'roles/alloydb.client',
    snippet: `-- AlloyDB ScaNN vector index for agent semantic memory
CREATE INDEX idx_docs_embedding ON knowledge_chunks
USING scann (embedding cosine) WITH (num_leaves=100);`,
  },
  {
    id: 'tools',
    title: 'Cloud Run MCP & BigQuery',
    category: 'Tools & Enterprise Data',
    x: 375,
    y: 185,
    color: '#06b6d4',
    role: 'Host stateless MCP servers on Cloud Run (scale-to-zero + IAM auth) and connect agents natively to BigQuery, Pub/Sub, Cloud Workflows, and Apigee API Hub.',
    iam: 'roles/run.invoker + roles/bigquery.dataViewer',
    snippet: `gcloud run deploy mcp-bigquery-server \\
  --source=. --region=us-central1 \\
  --no-allow-unauthenticated \\
  --service-account=agent-tools@my-proj.iam.gserviceaccount.com`,
  },
  {
    id: 'trace',
    title: 'Cloud Trace & Eval',
    category: 'Observability & Evals',
    x: 545,
    y: 185,
    color: '#f59e0b',
    role: 'Capture full OpenTelemetry GenAI spans (prompts, tool latencies, token counts) in Cloud Trace & Cloud Logging, and run Vertex AI GenAI Evaluation pipelines.',
    iam: 'roles/cloudtrace.agent',
    snippet: `# Enable OpenTelemetry export in ADK / Agent Engine
export OTEL_EXPORTER_OTLP_ENDPOINT="https://telemetry.googleapis.com"
export GOOGLE_CLOUD_PROJECT="my-proj"`,
  },
];

export function GcpArchitectureExplorer() {
  const [selectedId, setSelectedId] = useState<string>('adk');
  const active = GCP_NODES.find((n) => n.id === selectedId) || GCP_NODES[1];

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-blue-400">
            <Cloud className="h-3.5 w-3.5" /> Interactive GCP Cloud Blueprint
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            Click Any GCP Service to Inspect Role, IAM &amp; Deployment Code
          </h3>
        </div>
        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
          VPC-SC &amp; Least-Privilege Ready
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <svg viewBox="0 0 640 245" className="mx-auto w-full max-w-3xl select-none">
          {/* Connections */}
          <path d="M 162 55 L 220 55" stroke="#475569" strokeWidth="2" className="animate-dash-flow" />
          <path d="M 370 55 L 430 55" stroke="#60a5fa" strokeWidth="2" className="animate-dash-flow" />
          <path d="M 270 85 L 180 155" stroke="#10b981" strokeWidth="2" className="animate-dash-flow" />
          <path d="M 315 85 L 365 155" stroke="#06b6d4" strokeWidth="2" className="animate-dash-flow" />
          <path d="M 355 82 L 510 155" stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="4 4" />

          {GCP_NODES.map((n) => {
            const isSelected = n.id === selectedId;
            return (
              <g
                key={n.id}
                transform={`translate(${n.x - 74}, ${n.y - 28})`}
                onClick={() => setSelectedId(n.id)}
                className="cursor-pointer"
              >
                {isSelected && (
                  <rect
                    x="-5"
                    y="-5"
                    width="158"
                    height="66"
                    rx="16"
                    fill={n.color}
                    fillOpacity="0.22"
                    className="animate-pulse-ring"
                  />
                )}
                <rect
                  width="148"
                  height="56"
                  rx="12"
                  fill={isSelected ? '#0f172a' : '#0b1120'}
                  stroke={isSelected ? n.color : '#334155'}
                  strokeWidth={isSelected ? 2.5 : 1.3}
                />
                <text x="74" y="23" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">
                  {n.title}
                </text>
                <text x="74" y="40" textAnchor="middle" fill={n.color} fontSize="9.2" fontWeight="600">
                  {n.category}
                </text>
              </g>
            );
          })}
        </svg>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-blue-500/30 bg-slate-900/90 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {active.id === 'armor' && <Shield className="h-4 w-4 text-rose-400" />}
              {active.id === 'adk' && <Layers className="h-4 w-4 text-blue-400" />}
              {active.id === 'gemini' && <Cpu className="h-4 w-4 text-violet-400" />}
              {active.id === 'memory' && <Database className="h-4 w-4 text-emerald-400" />}
              {active.id === 'tools' && <Cloud className="h-4 w-4 text-cyan-400" />}
              {active.id === 'trace' && <Activity className="h-4 w-4 text-amber-400" />}
              <h4 className="font-display text-base font-bold text-white">{active.title}</h4>
            </div>
            <span className="rounded-lg bg-slate-800 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
              IAM: {active.iam}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">{active.role}</p>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11.5px] leading-relaxed text-slate-200">
            <code>{active.snippet}</code>
          </pre>
        </motion.div>
      </div>
    </div>
  );
}
