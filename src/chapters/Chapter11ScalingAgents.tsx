import React from 'react';
import {
  AlertTriangle,
  Cpu,
  Database,
  Gauge,
  Layers,
  Network,
  Server,
  Shield,
  Zap,
} from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { ScalingSimulator } from '../components/diagrams/ScalingSimulator';

export function Chapter11ScalingAgents({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="High-Scale Architecture"
        title="Scaling AI Agents & Problems Faced at Scale"
        description="Building an agent that works for 1 developer on localhost is easy. Running that same agent for 50,000 concurrent users exposes brutal distributed-systems failure modes: 429 rate-limit storms, quadratic token bills, P99 tail latency, and downstream API meltdowns."
      />

      <ScalingSimulator />

      <SectionHeader
        eyebrow="Failure Modes"
        title="The 7 Real-World Problems Faced When Scaling AI Agents"
        description="Know every single bottleneck that hits teams when moving from 10 beta users to 100,000+ daily active users:"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ConceptCard icon={<AlertTriangle className="h-4 w-4" />} title="1. TPM / RPM 429 Storms & Thundering Herds" badge="Quota Exhaustion">
          A single user click triggers 6–12 LLM calls! At 500 concurrent users, you instantly smash
          Tokens-Per-Minute (TPM) limits. Naive retries without jitter amplify the outage into a
          self-inflicted thundering herd.
        </ConceptCard>
        <ConceptCard icon={<Zap className="h-4 w-4" />} title="2. Quadratic Token Cost Explosion O(N²)" badge="Unit Economics">
          Because each step re-sends the full growing history + tool outputs, a 15-step agent costs
          ~10× more than a 5-step agent. Unbounded loops or huge raw tool payloads can turn a $0.02
          query into a $4.00 margin killer!
        </ConceptCard>
        <ConceptCard icon={<Gauge className="h-4 w-4" />} title="3. Compounding P99 Tail Latency" badge="UX Killer">
          If one LLM call has a 10% chance of taking 5 seconds, a sequential 8-step agent has a{' '}
          <strong>57% chance</strong> of hitting at least one slow stall! Sequential multi-agent chains
          quickly balloon to 25–45s P99 latency.
        </ConceptCard>
        <ConceptCard icon={<Database className="h-4 w-4" />} title="4. Agents DDoS-ing Your Own Downstream APIs" badge="Blast Radius">
          An enthusiastic parallel agent fleet calling your internal Postgres, Jira, or Stripe APIs
          with retries can exhaust database connection pools and take down core non-AI services.
        </ConceptCard>
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="5. State Contention & Duplicate Side Effects" badge="Distributed Bugs">
          When users double-click, containers scale down mid-run, or workers retry a timed-out step,
          stateless agents lose progress or execute duplicate refunds/emails unless backed by durable
          checkpoints and idempotency keys.
        </ConceptCard>
        <ConceptCard icon={<Shield className="h-4 w-4" />} title="6. Multi-Tenant Leakage & Noisy Neighbors" badge="Isolation">
          One enterprise tenant running a 10,000-document batch job can starve global LLM quotas for
          everyone else — and sloppy RAG filters or shared caches can leak Tenant A&apos;s data to Tenant B.
        </ConceptCard>
        <ConceptCard icon={<Cpu className="h-4 w-4" />} title="7. Silent Model Drift & Deprecations" badge="Ops Risk">
          Hosted frontier models receive silent updates or retirements. Without pinned model snapshots
          and automated nightly evals, your carefully tuned tool-calling accuracy can degrade overnight.
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="Battle-Tested Solutions"
        title="How to Architect Agents for Massive Scale"
        description="Solve all 7 scaling problems systematically with these production patterns:"
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 text-[11px] uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Scaling Bottleneck</th>
              <th className="px-4 py-3">Production Solution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/60">
            <tr>
              <td className="px-4 py-3 font-bold text-rose-600 dark:text-rose-400">TPM / RPM 429 Limits</td>
              <td className="px-4 py-3">Multi-region Vertex AI / LiteLLM / AI Gateway load balancing + Provisioned Throughput + exponential backoff with full jitter</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">Quadratic Token Cost</td>
              <td className="px-4 py-3">Static prefix Prompt Caching (75–90% off) + Semantic Cache (Redis/Vector) + aggressive tool-output truncation &amp; context compaction</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">High P99 Latency</td>
              <td className="px-4 py-3">Model Cascading (Flash for triage/tools, Pro for planning) + Parallel tool execution + Streaming SSE UX + Async Queue for &gt;15s jobs</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">Long-Running Reliability</td>
              <td className="px-4 py-3">Decouple HTTP intake from worker pools via Cloud Pub/Sub / Temporal / Cloud Tasks + Dead-Letter Queues (DLQ) + Durable Checkpoints</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-cyan-600 dark:text-cyan-400">Multi-Tenant Isolation</td>
              <td className="px-4 py-3">Mandatory <code>tenant_id</code> metadata filters enforced in code (never by LLM), per-tenant token bucket rate limits, and isolated cache keys</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        title="Multi-Region LLM Router with Backoff, Jitter & Per-Tenant Quota Guard"
        tabs={[
          {
            label: 'Python (Async Resilience)',
            language: 'python',
            code: `import asyncio, random
from google import genai

REGIONS = ["us-central1", "us-east4", "europe-west4"]

async def call_model_resilient(tenant_id: str, contents, model="gemini-2.5-flash"):
    # 1. Enforce per-tenant token bucket BEFORE calling LLM
    if not await redis_rate_limiter.allow(tenant_id, cost=1):
        raise TenantQuotaExceeded("Tenant rate limit reached; queued for retry.")

    # 2. Multi-region failover with exponential backoff + full jitter
    for attempt in range(4):
        region = REGIONS[attempt % len(REGIONS)]
        client = genai.Client(vertexai=True, project="my-proj", location=region)
        try:
            return await client.aio.models.generate_content(model=model, contents=contents)
        except RateLimitError:
            sleep_s = random.uniform(0, min(8.0, 0.5 * (2 ** attempt)))
            await asyncio.sleep(sleep_s)

    raise RuntimeError("All regions saturated — route task to Pub/Sub Dead-Letter Queue")`,
          },
        ]}
      />
    </div>
  );
}
