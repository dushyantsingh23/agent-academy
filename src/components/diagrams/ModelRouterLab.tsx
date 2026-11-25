import React, { useState } from 'react';
import { Cpu, GitBranch, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface SampleQuery {
  id: string;
  label: string;
  prompt: string;
  complexity: 'Low' | 'Medium' | 'High';
  routedTier: 'slm' | 'open-moe' | 'frontier';
  reason: string;
  costFrontier: number;
  costRouted: number;
  latencyMs: number;
}

const QUERIES: SampleQuery[] = [
  {
    id: 'faq',
    label: 'Simple Classification / FAQ',
    prompt: 'Classify this ticket into [Billing, Bug, Feature] and extract the order_id.',
    complexity: 'Low',
    routedTier: 'slm',
    reason: 'Router classifier scores complexity 0.14 → routes to local/edge 7B–8B SLM (Qwen/Llama/Gemma) for sub-150ms latency & ~95% cost savings.',
    costFrontier: 0.012,
    costRouted: 0.0004,
    latencyMs: 140,
  },
  {
    id: 'tool',
    label: 'Multi-Tool SQL & Summarization',
    prompt: 'Query Q3 churn by plan in BigQuery and format a 4-bullet executive summary.',
    complexity: 'Medium',
    routedTier: 'open-moe',
    reason: 'Router scores complexity 0.52 → routes to self-hosted Open-Weight MoE (DeepSeek-V3 / Qwen-MoE on vLLM) or Gemini Flash for fast, accurate JSON tool use.',
    costFrontier: 0.038,
    costRouted: 0.0045,
    latencyMs: 620,
  },
  {
    id: 'arch',
    label: 'Complex Multi-File Security Refactor',
    prompt: 'Audit this distributed auth middleware for race conditions and patch 4 files with tests.',
    complexity: 'High',
    routedTier: 'frontier',
    reason: 'Router scores complexity 0.91 → escalates directly to Frontier Reasoning Model (Gemini Pro / Claude / o-series) for deep multi-hop verification.',
    costFrontier: 0.14,
    costRouted: 0.14,
    latencyMs: 3200,
  },
];

const VRAM_MODELS = [
  { name: 'Qwen2.5-7B / Llama-3.1-8B', paramsB: 8, type: 'Dense' },
  { name: 'Gemma-3-27B / Qwen-32B', paramsB: 32, type: 'Dense' },
  { name: 'Llama-3.3-70B / Qwen-72B', paramsB: 70, type: 'Dense' },
  { name: 'DeepSeek-V3 / R1 (671B MoE, 37B active)', paramsB: 671, type: 'MoE' },
];

export function ModelRouterLab() {
  const [queryId, setQueryId] = useState('tool');
  const [modelIdx, setModelIdx] = useState(2);
  const [quant, setQuant] = useState<'fp16' | 'fp8' | 'int4'>('int4');

  const active = QUERIES.find((q) => q.id === queryId) || QUERIES[0];
  const vramModel = VRAM_MODELS[modelIdx];

  const bytesPerParam = quant === 'fp16' ? 2.0 : quant === 'fp8' ? 1.0 : 0.55;
  const weightsGb = Math.round(vramModel.paramsB * bytesPerParam);
  const totalVramGb = Math.round(weightsGb * 1.22); // +22% KV cache & activations overhead
  const h100Count = Math.max(1, Math.ceil(totalVramGb / 80));

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-stone-300/80 bg-stone-950 text-stone-100 shadow-xl dark:border-stone-800">
      <div className="border-b border-stone-800 bg-stone-900/90 px-5 py-4">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-400">
          <GitBranch className="h-3.5 w-3.5" /> Interactive Router &amp; VRAM Lab
        </span>
        <h3 className="mt-1 font-display text-lg font-bold text-white">
          Intelligent Model Router &amp; Open-Weight GPU VRAM Calculator
        </h3>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-12 sm:p-6">
        {/* Left: Live Model Router */}
        <div className="space-y-4 lg:col-span-7">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            1. Pick an incoming agent task to simulate semantic routing
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {QUERIES.map((q) => (
              <button
                key={q.id}
                onClick={() => setQueryId(q.id)}
                className={`rounded-xl border p-2.5 text-left transition ${
                  queryId === q.id
                    ? 'border-amber-400 bg-amber-500/15 text-white'
                    : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="font-mono text-[10px] uppercase text-amber-400">
                  {q.complexity} Complexity
                </div>
                <div className="mt-0.5 text-xs font-bold">{q.label}</div>
              </button>
            ))}
          </div>

          {/* Animated SVG Router Flow */}
          <svg viewBox="0 0 520 155" className="w-full select-none">
            <rect x="8" y="52" width="115" height="50" rx="10" fill="#1c1917" stroke="#a8a29e" strokeWidth="1.4" />
            <text x="65" y="74" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700">Incoming Task</text>
            <text x="65" y="90" textAnchor="middle" fill="#a8a29e" fontSize="9">Complexity: {active.complexity}</text>

            <path d="M 125 77 L 176 77" stroke="#f59e0b" strokeWidth="2" className="animate-dash-flow" />

            <rect x="180" y="45" width="122" height="64" rx="12" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
            <text x="241" y="72" textAnchor="middle" fill="#fbbf24" fontSize="10.5" fontWeight="700">Model Router</text>
            <text x="241" y="88" textAnchor="middle" fill="#d6d3d1" fontSize="8.8">Classifier + Policy</text>
            <text x="241" y="100" textAnchor="middle" fill="#a8a29e" fontSize="8">&lt;15ms overhead</text>

            {/* 3 Target Paths */}
            <path
              d="M 304 62 C 335 62, 335 28, 368 28"
              fill="none"
              stroke={active.routedTier === 'slm' ? '#34d399' : '#44403c'}
              strokeWidth={active.routedTier === 'slm' ? 2.5 : 1.3}
              className={active.routedTier === 'slm' ? 'animate-dash-flow' : ''}
            />
            <path
              d="M 304 77 L 368 77"
              fill="none"
              stroke={active.routedTier === 'open-moe' ? '#38bdf8' : '#44403c'}
              strokeWidth={active.routedTier === 'open-moe' ? 2.5 : 1.3}
              className={active.routedTier === 'open-moe' ? 'animate-dash-flow' : ''}
            />
            <path
              d="M 304 92 C 335 92, 335 126, 368 126"
              fill="none"
              stroke={active.routedTier === 'frontier' ? '#c084fc' : '#44403c'}
              strokeWidth={active.routedTier === 'frontier' ? 2.5 : 1.3}
              className={active.routedTier === 'frontier' ? 'animate-dash-flow' : ''}
            />

            {/* Target Boxes */}
            <g transform="translate(372, 8)">
              <rect width="140" height="38" rx="8" fill={active.routedTier === 'slm' ? '#064e3b' : '#1c1917'} stroke={active.routedTier === 'slm' ? '#34d399' : '#44403c'} strokeWidth={active.routedTier === 'slm' ? 2 : 1} />
              <text x="70" y="20" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">SLM (7B–8B Edge)</text>
              <text x="70" y="32" textAnchor="middle" fill="#6ee7b7" fontSize="8.5">$0.05/M · 140ms</text>
            </g>

            <g transform="translate(372, 58)">
              <rect width="140" height="38" rx="8" fill={active.routedTier === 'open-moe' ? '#0c4a6e' : '#1c1917'} stroke={active.routedTier === 'open-moe' ? '#38bdf8' : '#44403c'} strokeWidth={active.routedTier === 'open-moe' ? 2 : 1} />
              <text x="70" y="20" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Open MoE / Flash</text>
              <text x="70" y="32" textAnchor="middle" fill="#7dd3fc" fontSize="8.5">$0.20/M · 620ms</text>
            </g>

            <g transform="translate(372, 108)">
              <rect width="140" height="38" rx="8" fill={active.routedTier === 'frontier' ? '#3b0764' : '#1c1917'} stroke={active.routedTier === 'frontier' ? '#c084fc' : '#44403c'} strokeWidth={active.routedTier === 'frontier' ? 2 : 1} />
              <text x="70" y="20" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Frontier Reasoning</text>
              <text x="70" y="32" textAnchor="middle" fill="#d8b4fe" fontSize="8.5">$1.25–$15/M · 3.2s</text>
            </g>
          </svg>

          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-stone-800 bg-stone-900/80 p-3.5 text-xs"
          >
            <div className="font-mono text-[11px] text-stone-400">Prompt: &ldquo;{active.prompt}&rdquo;</div>
            <p className="mt-1.5 leading-relaxed text-stone-200">{active.reason}</p>
            <div className="mt-2.5 flex flex-wrap gap-3 font-mono text-[11px]">
              <span className="text-emerald-400">Routed Cost: ${active.costRouted.toFixed(4)}</span>
              <span className="text-stone-500">All-Frontier Cost: ${active.costFrontier.toFixed(4)}</span>
              <span className="text-cyan-400">Est. Latency: {active.latencyMs}ms</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Open-Weight VRAM Estimator */}
        <div className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900/70 p-4 lg:col-span-5">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
              <Cpu className="h-3.5 w-3.5" /> 2. Open-Weight GPU VRAM Estimator
            </div>
            <p className="mt-1 text-xs text-stone-400">
              Estimate self-hosting GPU memory (weights + ~22% KV cache overhead).
            </p>

            <div className="mt-3 space-y-2">
              {VRAM_MODELS.map((m, idx) => (
                <button
                  key={m.name}
                  onClick={() => setModelIdx(idx)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition ${
                    modelIdx === idx
                      ? 'border-cyan-400 bg-cyan-500/15 text-white'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="font-semibold">{m.name}</span>
                  <span className="rounded bg-stone-800 px-1.5 py-0.5 font-mono text-[10px]">
                    {m.type}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-semibold text-stone-400">Precision / Quantization</div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ['fp16', 'BF16 / FP16'],
                    ['fp8', 'FP8 (H100)'],
                    ['int4', 'INT4 / AWQ'],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setQuant(k)}
                    className={`rounded-lg border py-1.5 font-mono text-[11px] font-semibold transition ${
                      quant === k
                        ? 'border-amber-400 bg-amber-500/15 text-amber-300'
                        : 'border-stone-800 bg-stone-950 text-stone-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-stone-800 pt-4">
            <div className="rounded-xl bg-stone-950 p-3">
              <div className="flex items-center gap-1 text-[10px] uppercase text-stone-400">
                <Layers className="h-3 w-3 text-cyan-400" /> Est. VRAM Needed
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-white">{totalVramGb} GB</div>
              <div className="text-[10px] text-stone-500">{weightsGb} GB weights + KV</div>
            </div>
            <div className="rounded-xl bg-stone-950 p-3">
              <div className="flex items-center gap-1 text-[10px] uppercase text-stone-400">
                <Zap className="h-3 w-3 text-amber-400" /> Min H100 (80GB)
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-amber-300">
                {h100Count}× GPU{h100Count > 1 ? 's' : ''}
              </div>
              <div className="text-[10px] text-stone-500">
                {totalVramGb <= 24 ? 'Fits 1× L4 / 4090!' : 'Tensor Parallelism'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
