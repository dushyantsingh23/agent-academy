import React from 'react';
import { Cloud, Cpu, Database, Lock, Server, Sparkles } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { GcpArchitectureExplorer } from '../components/diagrams/GcpArchitectureExplorer';

export function Chapter8GcpAgents({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Google Cloud Platform"
        title="Building, Scaling & Securing AI Agents on GCP"
        description="Google Cloud provides an end-to-end, enterprise-hardened stack for every layer of an agentic product — from Gemini models and Google ADK to managed Vertex AI Agent Engine, Memory Bank, Cloud Run MCP servers, AlloyDB vector RAG, and Model Armor."
      />

      <GcpArchitectureExplorer />

      <SectionHeader
        eyebrow="GCP Compute Choices"
        title="Where Should Your Agent Runtime Live on GCP?"
        description="Choose the right hosting target based on how much operational control and customization you need:"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<Sparkles className="h-4 w-4" />} title="Vertex AI Agent Engine" badge="Fastest to Prod">
          Fully managed runtime purpose-built for agents (ADK, LangGraph, CrewAI). Gives you managed
          Sessions, <strong>Memory Bank</strong>, automatic scaling, OTel tracing, and zero Dockerfile
          maintenance.
        </ConceptCard>
        <ConceptCard icon={<Cloud className="h-4 w-4" />} title="Cloud Run (+ GPU)" badge="Serverless Containers">
          Ideal for custom FastAPI/Next.js agent backends, <strong>stateless MCP Servers</strong>, A2A
          microservices, and scale-to-zero workloads with native IAM authentication and VPC connectors.
        </ConceptCard>
        <ConceptCard icon={<Server className="h-4 w-4" />} title="GKE (Kubernetes)" badge="Full Control + Open Models">
          Best when self-hosting open-weights models (Qwen, Llama, Gemma) with <strong>vLLM / SGLang</strong>{' '}
          on H100/L4 GPUs or Cloud TPUs, or running strict multi-tenant sandboxed code-execution pods with
          gVisor!
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="Hands-On Walkthrough"
        title="End-to-End GCP Agent: ADK + MCP + BigQuery + Agent Engine"
        description="Here is a complete production pattern combining Google ADK, Gemini 2.5, Vertex AI Search/BigQuery, and one-command deployment to Vertex AI Agent Engine or Cloud Run."
      />

      <CodeBlock
        title="Production GCP Agent with Google ADK & Vertex AI"
        tabs={[
          {
            label: 'agent.py (ADK + MCP + BigQuery)',
            language: 'python',
            code: `import os
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StreamableHTTPConnectionParams
from google.cloud import bigquery

bq_client = bigquery.Client()

def query_revenue_kpis(quarter: str) -> list[dict]:
    """Query verified quarterly revenue KPIs from BigQuery."""
    sql = """
      SELECT region, SUM(revenue_usd) AS revenue, COUNT(DISTINCT account_id) AS accounts
      FROM \`prod_analytics.revenue_mart\`
      WHERE fiscal_quarter = @quarter
      GROUP BY region
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("quarter", "STRING", quarter)]
    )
    return [dict(row) for row in bq_client.query(sql, job_config=job_config).result()]

# Connect to a remote MCP Server hosted securely on Cloud Run
crm_mcp = MCPToolset(
    connection_params=StreamableHTTPConnectionParams(
        url=os.environ["CLOUD_RUN_MCP_URL"],
        headers={"Authorization": f"Bearer {os.environ['ID_TOKEN']}"},
    )
)

root_agent = LlmAgent(
    name="gcp_revenue_analyst",
    model="gemini-2.5-pro",
    instruction=(
        "You are an enterprise revenue analyst on GCP. Always verify numbers via "
        "query_revenue_kpis and enrich account context with CRM MCP tools."
    ),
    tools=[query_revenue_kpis, crm_mcp],
)`,
          },
          {
            label: 'deploy.py (Vertex AI Agent Engine)',
            language: 'python',
            code: `import vertexai
from vertexai import agent_engines
from vertexai.preview import reasoning_engines
from agent import root_agent

vertexai.init(
    project="my-gcp-project",
    location="us-central1",
    staging_bucket="gs://my-agent-staging-bucket",
)

# Deploy directly to managed Vertex AI Agent Engine!
# Wrap the ADK agent so Agent Engine can host it (sessions, tracing)
app = reasoning_engines.AdkApp(agent=root_agent, enable_tracing=True)

remote_agent = agent_engines.create(
    agent_engine=app,
    requirements=[
        "google-adk>=1.0.0",
        "google-cloud-bigquery>=3.25.0",
    ],
    display_name="gcp-revenue-analyst-prod",
)

print("Deployed resource:", remote_agent.resource_name)`,
          },
          {
            label: 'gcloud CLI (Cloud Run + IAM)',
            language: 'bash',
            code: `# 1. Create a dedicated least-privilege Service Account for your agent
gcloud iam service-accounts create revenue-agent-sa \\
  --display-name="Revenue Agent Runtime SA"

# 2. Grant ONLY Vertex AI + BigQuery read access (never roles/owner!)
gcloud projects add-iam-policy-binding my-gcp-project \\
  --member="serviceAccount:revenue-agent-sa@my-gcp-project.iam.gserviceaccount.com" \\
  --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding my-gcp-project \\
  --member="serviceAccount:revenue-agent-sa@my-gcp-project.iam.gserviceaccount.com" \\
  --role="roles/bigquery.dataViewer"

# 3. Deploy ADK API server to Cloud Run with IAM auth
adk deploy cloud_run \\
  --project=my-gcp-project \\
  --region=us-central1 \\
  --service_name=revenue-agent-api \\
  --with_ui ./my_agent`,
          },
        ]}
      />

      <Callout type="warning" title="GCP Enterprise Security Checklist for Agents">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Least-Privilege Service Accounts:</strong> Never share a single admin SA across agents. Bind narrow roles (e.g., <code>roles/bigquery.dataViewer</code>, not <code>roles/bigquery.admin</code>).</li>
          <li><strong>Secret Manager:</strong> Store third-party API keys (Slack, Stripe, GitHub) in Secret Manager — never bake them into container images or prompts.</li>
          <li><strong>VPC Service Controls &amp; Model Armor:</strong> Enforce data exfiltration perimeters with VPC-SC and screen prompts/responses with Model Armor.</li>
          <li><strong>GKE Sandbox (gVisor):</strong> If your agent executes untrusted Python/Bash code, enable <code>runtimeClassName: gvisor</code> on GKE Autopilot pods!</li>
        </ul>
      </Callout>
    </div>
  );
}
