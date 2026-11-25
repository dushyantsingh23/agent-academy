import React from 'react';
import { Cpu, Flame, Gauge, Layers, Server, Sliders } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { TokenEconomicsLab } from '../components/diagrams/TokenEconomicsLab';

export function Chapter4ModelsTokensTraining({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Models & Infrastructure"
        title="Models, Tokens, Post-Training & Inference Hosting"
        description="To ship fast, affordable agents at scale, you must understand what happens beneath the API: tokenization, KV cache memory, prefill vs. decode latency, how models are trained to be agentic, and how to host them."
      />

      <SectionHeader
        eyebrow="1. Tokens & Economics"
        title="Tokenization, KV Cache & Multi-Step Cost Compounding"
        description="LLMs don't read words — they read Byte-Pair Encoding (BPE) subword tokens (~4 English chars per token). Crucially, because LLMs are stateless, a 10-step agent loop re-sends the growing conversation history 10 times — making input tokens grow quadratically O(N²) unless you use Prompt Caching!"
      />

      <TokenEconomicsLab />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<Gauge className="h-4 w-4" />} title="Prefill vs. Decode" badge="Latency Anatomy">
          <strong>Prefill (TTFT):</strong> Processes all input tokens in parallel (compute-bound).{' '}
          <strong>Decode (TPS):</strong> Generates output tokens one-by-one autoregressively
          (memory-bandwidth-bound). Agents with huge tool logs suffer from slow TTFT unless cached!
        </ConceptCard>
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="KV Cache & Prompt Caching" badge="Up to 90% Off">
          Transformers cache Key &amp; Value attention tensors for prefixes. Keep your system prompt and
          tool schemas <strong>identical and static at the top</strong> of the prompt so providers hit
          prefix cache (75–90% cheaper &amp; 3–5× faster TTFT).
        </ConceptCard>
        <ConceptCard icon={<Sliders className="h-4 w-4" />} title="Model Routing / Cascading" badge="Cost Optimization">
          Don&apos;t use a $15/M reasoning giant to classify intent! Use fast/cheap models (Gemini Flash,
          Haiku, Qwen-7B) for routing, extraction, and simple tool calls; escalate to Pro/Frontier models
          only for complex planning or code synthesis.
        </ConceptCard>
      </div>
      <Callout type="insight" title="How models are trained lives in its own chapter">
        <p>
          Pre-training, fine-tuning (SFT, LoRA), preference tuning (DPO/RLHF) and reinforcement learning with
          verifiable rewards are covered step by step in <strong>Chapter 8 — Training, Post-Training &amp; MLOps</strong>.
          This chapter stays focused on what happens when a trained model serves your requests.
        </p>
      </Callout>


      <SectionHeader
        eyebrow="2. Running & Hosting Models"
        title="Managed APIs vs. Self-Hosting (vLLM, SGLang, Ollama)"
        description="Understand quantization (BF16 → FP8 → INT4/AWQ/GGUF) and inference engines when you need data sovereignty, custom fine-tunes, or predictable high-throughput unit economics."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Serving Engine</th>
              <th className="px-4 py-3">Key Superpower</th>
              <th className="px-4 py-3">Best Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/60">
            <tr>
              <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">Managed APIs (Vertex AI, Anthropic, OpenAI)</td>
              <td className="px-4 py-3">Zero GPU ops, frontier intelligence, global scale, built-in context caching</td>
              <td className="px-4 py-3">90% of production apps &amp; complex reasoning agents</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">vLLM</td>
              <td className="px-4 py-3">PagedAttention, Continuous Batching, Prefix Caching, OpenAI-compatible API</td>
              <td className="px-4 py-3">High-throughput self-hosting on GKE / Cloud Run GPUs</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">SGLang</td>
              <td className="px-4 py-3">RadixAttention (tree-structured KV reuse) + ultra-fast constrained JSON decoding</td>
              <td className="px-4 py-3">Multi-turn agents &amp; structured tool-calling workloads</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-cyan-600 dark:text-cyan-400">Ollama / llama.cpp</td>
              <td className="px-4 py-3">GGUF quantization on Apple Silicon / laptops / edge devices</td>
              <td className="px-4 py-3">Local offline dev, private desktop agents, zero API spend</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        title="Self-Hosting an Open-Weights Agent Model with vLLM (FP8 + Tool Calling)"
        tabs={[
          {
            label: 'Docker / CLI (vLLM)',
            language: 'bash',
            code: `# Serve Qwen2.5-72B-Instruct with Automatic Prefix Caching & Tool Call Parser
vllm serve Qwen/Qwen2.5-72B-Instruct-AWQ \\
  --tensor-parallel-size 2 \\
  --quantization awq \\
  --enable-prefix-caching \\
  --enable-auto-tool-choice \\
  --tool-call-parser hermes \\
  --max-model-len 65536 \\
  --port 8000`,
          },
          {
            label: 'Local Dev (Ollama)',
            language: 'bash',
            code: `# Run a fast local tool-capable model on Mac / Linux
ollama run qwen2.5-coder:14b

# OpenAI-compatible endpoint is live at http://localhost:11434/v1`,
          },
        ]}
      />
    </div>
  );
}
