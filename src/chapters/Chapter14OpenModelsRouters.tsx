import React from 'react';
import { Cpu, GitBranch, Layers, Scale, Shield, Zap } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { ModelRouterLab } from '../components/diagrams/ModelRouterLab';

export function Chapter14OpenModelsRouters({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Models & Routing"
        title="Open-Weight Models, Model Selection & Model Routers"
        description="Production agent systems rarely run on a single model. Knowing when to pick an open-weight Dense or Mixture-of-Experts (MoE) model vs. a frontier API — and how to place an intelligent Model Router in front of them — is one of the highest-leverage skills in AI engineering."
      />

      <ModelRouterLab />

      <SectionHeader
        eyebrow="Open-Weight Ecosystem"
        title="The Leading Open-Weight Model Families for Agents"
        description="Open-weight models give you full data sovereignty, predictable unit economics at high volume, custom LoRA fine-tuning, and zero vendor lock-in."
      />

      <div className="overflow-x-auto rounded-2xl border border-stone-300/80 dark:border-stone-800">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F4ECDB] text-[11px] uppercase tracking-wider text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3">Model Family</th>
              <th className="px-4 py-3">Architecture</th>
              <th className="px-4 py-3">License</th>
              <th className="px-4 py-3">Agentic Sweet Spot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-[#FFFDF7] dark:divide-stone-800 dark:bg-stone-950/60">
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">DeepSeek-V3 / R1</td>
              <td className="px-4 py-3">Sparse MoE (671B total / 37B active)</td>
              <td className="px-4 py-3 font-mono text-xs text-emerald-700 dark:text-emerald-400">MIT</td>
              <td className="px-4 py-3">Frontier-grade reasoning, math, coding, and distilled 7B–70B variants</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Qwen 2.5 / Qwen 3</td>
              <td className="px-4 py-3">Dense (0.5B–72B) &amp; MoE</td>
              <td className="px-4 py-3 font-mono text-xs text-emerald-700 dark:text-emerald-400">Apache 2.0</td>
              <td className="px-4 py-3">Best-in-class open tool calling, multilingual, Qwen-Coder for CodeAct</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Gemma 2 / Gemma 3</td>
              <td className="px-4 py-3">Dense (1B–27B) Multimodal</td>
              <td className="px-4 py-3 font-mono text-xs text-amber-700 dark:text-amber-400">Gemma Terms</td>
              <td className="px-4 py-3">Ultra-efficient single-GPU &amp; on-device edge routing, vision + text</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Llama 3.1 / 3.3 / 4</td>
              <td className="px-4 py-3">Dense (8B–70B) &amp; MoE</td>
              <td className="px-4 py-3 font-mono text-xs text-amber-700 dark:text-amber-400">Llama Community</td>
              <td className="px-4 py-3">Broadest serving/tooling support (vLLM, SGLang, Vertex Model Garden)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Mistral / Codestral / Phi</td>
              <td className="px-4 py-3">Compact Dense &amp; MoE</td>
              <td className="px-4 py-3 font-mono text-xs text-emerald-700 dark:text-emerald-400">Apache 2.0 / MIT</td>
              <td className="px-4 py-3">Low-latency European compliance, fast code autocomplete, tiny edge SLMs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="architecture" title="Dense vs. Mixture-of-Experts (MoE) — Crucial for Hosting!">
        <p>
          A <strong>Dense</strong> 70B model activates all 70B parameters on every token. A{' '}
          <strong>Sparse MoE</strong> model like DeepSeek-V3 has 671B total parameters (so you still need
          VRAM to hold all weights!), but routes each token through only ~37B active expert parameters —
          giving you massive knowledge capacity at <strong>37B-speed latency and FLOPs</strong>!
        </p>
      </Callout>

      <SectionHeader
        eyebrow="Selection Framework"
        title="How to Choose the Right Model for Each Agent Role"
        description="Don't ask 'What is the #1 model on benchmarks?' Ask which model hits your accuracy floor at the lowest latency and $/task on YOUR golden eval dataset:"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConceptCard icon={<Zap className="h-4 w-4" />} title="1. Triage, Routing & Extraction" badge="Fast / Cheap">
          Prioritize &lt;300ms TTFT and strict JSON schema adherence. Pick <strong>Gemini Flash</strong>,{' '}
          <strong>Gemma-27B</strong>, or a fine-tuned <strong>Qwen-7B/14B</strong>.
        </ConceptCard>
        <ConceptCard icon={<Cpu className="h-4 w-4" />} title="2. Planning, Coding & Synthesis" badge="High Reasoning">
          Prioritize multi-hop reasoning, long-context recall, and error recovery. Pick{' '}
          <strong>Gemini Pro</strong>, <strong>Claude Sonnet/Opus</strong>, or{' '}
          <strong>DeepSeek-R1</strong>.
        </ConceptCard>
        <ConceptCard icon={<Shield className="h-4 w-4" />} title="3. Regulated / Air-Gapped Data" badge="Self-Hosted">
          When PII/HIPAA/ITAR rules prohibit external APIs, host <strong>Apache 2.0 / MIT</strong>{' '}
          open-weight models on GKE GPUs or Vertex AI Dedicated Endpoints inside VPC-SC.
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="Model Routers & Gateways"
        title="4 Patterns for Intelligent Model Routing"
        description="A Model Router sits between your agent orchestrator and your model fleet, dynamically matching every step to the cheapest model that meets your quality bar."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ConceptCard icon={<GitBranch className="h-4 w-4" />} title="1. Rule / Role-Based Routing" badge="Zero Overhead">
          Map agent roles statically: <code>triage_agent → Flash</code>, <code>planner → Pro</code>,{' '}
          <code>guardrail → 8B SLM</code>. Simplest, most predictable, handles 80% of use cases.
        </ConceptCard>
        <ConceptCard icon={<Scale className="h-4 w-4" />} title="2. Learned Semantic Classifier Router" badge="RouteLLM / BERT">
          A tiny &lt;15ms encoder classifier predicts whether a prompt requires a frontier model or an
          open-weight model (trained on pairwise preference logs), cutting costs 50–70% automatically.
        </ConceptCard>
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="3. Speculative Cascade (Verify & Escalate)" badge="Quality-Guaranteed">
          Try the fast/cheap model first; run a fast deterministic verifier (JSON schema, unit tests,
          or logprob confidence). Escalate to the frontier model ONLY if verification fails!
        </ConceptCard>
        <ConceptCard icon={<Shield className="h-4 w-4" />} title="4. AI Gateway Failover & Load Balancing" badge="LiteLLM / Portkey">
          Centralize multi-provider failover (<code>Vertex us-central1 → europe-west4 → Open-Weight vLLM</code>),
          per-team spend caps, semantic caching, and unified OpenTelemetry telemetry.
        </ConceptCard>
      </div>

      <CodeBlock
        title="AI Gateway & Model Router Config (LiteLLM + Speculative Cascade)"
        tabs={[
          {
            label: 'litellm_config.yaml',
            language: 'yaml',
            code: `model_list:
  - model_name: fast-tier
    litellm_params:
      model: vertex_ai/gemini-2.5-flash
      vertex_location: us-central1
  - model_name: fast-tier
    litellm_params:
      model: hosted_vllm/Qwen/Qwen2.5-72B-Instruct-AWQ
      api_base: http://vllm-cluster.internal:8000/v1

  - model_name: reasoning-tier
    litellm_params:
      model: vertex_ai/gemini-2.5-pro
      vertex_location: us-central1

router_settings:
  routing_strategy: latency-based-routing
  num_retries: 3
  fallbacks:
    - {"reasoning-tier": ["fast-tier"]}`,
          },
          {
            label: 'Speculative Cascade (Python)',
            language: 'python',
            code: `async def generate_with_cascade(prompt: str, validator):
    # 1. Try fast/cheap model first (<400ms)
    draft = await gateway.complete(model="fast-tier", prompt=prompt)
    if validator(draft):
        return draft  # 75% of requests stop here!

    # 2. Escalate to frontier reasoning model only on failure
    return await gateway.complete(model="reasoning-tier", prompt=prompt)`,
          },
        ]}
      />
    </div>
  );
}
