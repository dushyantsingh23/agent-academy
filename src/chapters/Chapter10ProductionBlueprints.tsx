import React from 'react';
import {
  CheckCircle2,
  Cpu,
  GitBranch,
  GitPullRequest,
  Headphones,
  Layers,
  LineChart,
  Rocket,
  Server,
  Shield,
} from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { ProductionArchitectCanvas } from '../components/diagrams/ProductionArchitectCanvas';

export function Chapter10ProductionBlueprints({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Capstone & Production Delivery"
        title="How to Run, Deploy & Operate AI Agents in Production"
        description="You now understand agent types, memory, MCP, tokens, frameworks, multi-agent systems, A2A, GCP, testing, and scaling. This final chapter walks through packaging, CI/CD eval gates, shadow/canary rollouts, graceful shutdowns, and 3 complete end-to-end production blueprints."
      />

      <SectionHeader
        eyebrow="Step-by-Step Deployment Playbook"
        title="Running & Deploying Agents to Production Safely"
        description="Treating an AI agent like a fragile script leads to midnight outages. Ship agents with the exact same rigor as mission-critical microservices — plus prompt/model versioning and eval gates:"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConceptCard icon={<Server className="h-4 w-4" />} title="1. Sync vs. Async Execution Split" badge="Runtime Design">
          Serve interactive &lt;10s agents over <strong>HTTP + SSE Streaming</strong> (Cloud Run /
          Agent Engine). Offload 1–30 min deep-research or coding agents to{' '}
          <strong>Async Worker Pools</strong> (Pub/Sub + Cloud Run Jobs / Temporal) with webhook or
          WebSocket completion notifications.
        </ConceptCard>
        <ConceptCard icon={<GitBranch className="h-4 w-4" />} title="2. Version Prompts, Tools & Models" badge="Immutable Artifacts">
          Never edit prompts in a live database without version control! Pin exact model snapshots
          (e.g., <code>gemini-2.5-flash-001</code>), keep prompts + tool schemas in Git, and tag every
          trace with <code>agent_version</code> for instant 1-click rollback.
        </ConceptCard>
        <ConceptCard icon={<Shield className="h-4 w-4" />} title="3. Graceful SIGTERM Draining" badge="Zero Dropped Runs">
          Agent runs last seconds to minutes. Configure container <code>terminationGracePeriodSeconds</code>{' '}
          (60–300s) and persist state checkpoints after every step so autoscaler scale-downs resume
          seamlessly on another pod!
        </ConceptCard>
        <ConceptCard icon={<Rocket className="h-4 w-4" />} title="4. Progressive Rollout (Shadow → Canary)" badge="Zero-Risk Launch">
          <strong>Stage 1:</strong> CI Golden Eval Gate (block PR if pass^k drops).{' '}
          <strong>Stage 2:</strong> Shadow traffic (0% user impact).{' '}
          <strong>Stage 3:</strong> Canary 5% → 25% → 100% with automated latency, cost &amp; judge alerts.
        </ConceptCard>
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="5. Streaming UX & HITL Cards" badge="Product Craft">
          Stream tool-call status pills (&ldquo;Querying BigQuery...&rdquo;, &ldquo;Checking PR #412...&rdquo;)
          so perceived latency drops by 70%, and render interactive Approve / Edit / Reject cards for
          mutating actions.
        </ConceptCard>
        <ConceptCard icon={<Cpu className="h-4 w-4" />} title="6. Kill Switches & Budget Caps" badge="Day-2 Ops">
          Ship feature-flag kill switches per tool and per agent, hard per-run token/step caps,
          per-tenant daily dollar budgets, and Dead-Letter Queues (DLQ) for inspecting failed async runs.
        </ConceptCard>
      </div>

      <CodeBlock
        title="Production Deployment Kit: Dockerfile + GitHub Actions CI Eval Gate + Cloud Run Canary"
        tabs={[
          {
            label: 'Dockerfile (Prod Agent)',
            language: 'dockerfile',
            code: `FROM python:3.12-slim AS runtime
WORKDIR /app

# Non-root security hardening
RUN useradd -m agentuser
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
USER agentuser

ENV PORT=8080 PYTHONUNBUFFERED=1
EXPOSE 8080

# Graceful shutdown (--timeout-graceful-shutdown 60) lets in-flight agent steps checkpoint!
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8080", "--timeout-graceful-shutdown", "60"]`,
          },
          {
            label: 'GitHub Actions CI Eval Gate',
            language: 'yaml',
            code: `name: Agent CI/CD Pipeline
on: [pull_request]

jobs:
  verify-agent:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt

      # Layer 1 & 2: Fast free unit + VCR replay tests
      - name: Unit & VCR Deterministic Tests
        run: pytest tests/unit tests/vcr -v

      # Layer 3: Live Golden Trajectory Eval Gate (blocks merge on regression!)
      - name: Golden Trajectory & Safety Eval Gate
        env:
          GOOGLE_API_KEY: \${{ secrets.STAGING_GEMINI_KEY }}
        run: pytest tests/evals --min-pass-rate=0.92 --max-avg-cost=0.04`,
          },
          {
            label: 'Cloud Run Canary Deploy',
            language: 'bash',
            code: `# 1. Deploy new revision with 0% traffic (tagged "canary") for smoke & shadow tests
gcloud run deploy prod-agent-api \\
  --image=us-central1-docker.pkg.dev/my-proj/agents/api:v2.4.0 \\
  --region=us-central1 \\
  --no-traffic --tag=canary \\
  --min-instances=2 --max-instances=50 \\
  --timeout=300 --concurrency=40 \\
  --service-account=agent-runtime@my-proj.iam.gserviceaccount.com

# 2. Shift 10% live traffic to canary and monitor Cloud Trace + LLM Judge metrics
gcloud run services update-traffic prod-agent-api \\
  --region=us-central1 --to-tags=canary=10

# 3. Promote to 100% (or instant rollback: --to-revisions=PREVIOUS=100)
gcloud run services update-traffic prod-agent-api \\
  --region=us-central1 --to-latest`,
          },
        ]}
      />

      <ProductionArchitectCanvas />

      <SectionHeader
        eyebrow="3 End-to-End Blueprints"
        title="Real-World Complex Agentic Product Architectures"
        description="Use these three battle-tested blueprints as starting templates for your own products:"
      />

      <div className="space-y-4">
        <div className="rounded-2xl border border-indigo-500/30 bg-[#FFFDF7] p-6 shadow-sm dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Blueprint 1: Autonomous Software Engineering &amp; PR Agent
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pattern: Plan-and-Execute + CodeAct + Parallel Review + Sandboxed Verification
                </p>
              </div>
            </div>
            <span className="rounded-full bg-indigo-500/15 px-3 py-1 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300">
              Coding / DevOps
            </span>
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <li>• <strong>Trigger:</strong> GitHub Issue labeled <code>agent-fix</code> or PagerDuty alert webhook.</li>
            <li>• <strong>Sandbox:</strong> Ephemeral Firecracker / GKE gVisor container with repo checkout + test runner.</li>
            <li>• <strong>Loop:</strong> Planner (Gemini Pro) locates files → Coder writes patch → Runs <code>pytest</code> → Reflects on failures (max 6 loops).</li>
            <li>• <strong>Verification:</strong> Parallel Security + Perf reviewer agents audit diff → Opens PR with test evidence for human merge.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-[#FFFDF7] p-6 shadow-sm dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Blueprint 2: Enterprise Multi-Agent Customer Ops (GCP + MCP + A2A)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pattern: Triage Swarm + MCP Enterprise Tools + A2A Partner Handoff + HITL Refunds
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-300">
              Enterprise SaaS
            </span>
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <li>• <strong>Edge:</strong> Model Armor screens PII/injections → Gemini Flash Triage Agent routes in &lt;400ms.</li>
            <li>• <strong>Tools:</strong> Cloud Run MCP servers for Stripe, Zendesk, and AlloyDB KB RAG with OAuth user scoping.</li>
            <li>• <strong>A2A:</strong> Delegates shipping carrier claims to external Logistics Partner Agent over A2A.</li>
            <li>• <strong>Governance:</strong> Refunds &gt;$100 pause in <code>input-required</code> for supervisor click; 100% traced in Cloud Trace.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-[#FFFDF7] p-6 shadow-sm dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <LineChart className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Blueprint 3: Deep Research &amp; Financial Due-Diligence Pipeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pattern: Orchestrator-Workers + Parallel Map-Reduce + Citation Verifier Critic
                </p>
              </div>
            </div>
            <span className="rounded-full bg-amber-500/15 px-3 py-1 font-mono text-xs font-bold text-amber-600 dark:text-amber-300">
              Research / FinTech
            </span>
          </div>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <li>• <strong>Plan:</strong> Lead Analyst decomposes investment thesis into 8 parallel research questions.</li>
            <li>• <strong>Fan-Out:</strong> 8 Flash workers query SEC filings (BigQuery), earnings transcripts (RAG), and live market news concurrently.</li>
            <li>• <strong>Context:</strong> Workers write structured JSON findings to Cloud Storage artifacts, returning crisp 300-token summaries.</li>
            <li>• <strong>Critic Loop:</strong> Fact-Checker Critic verifies every single number against primary sources before rendering final interactive memo.</li>
          </ul>
        </div>
      </div>

      <Callout type="insight" title="Your Next Step: Build, Test, Scale & Ship!">
        <p>
          You now have the complete blueprint of modern AI Agent Engineering. Pick a real workflow you
          do every week, start with a clean 1-agent loop + 3 well-designed tools + 10 golden eval cases,
          and iterate from prototype to globally scaled production!
        </p>
      </Callout>
    </div>
  );
}
