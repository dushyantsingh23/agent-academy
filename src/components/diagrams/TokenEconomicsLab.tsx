import React, { useState, useMemo } from 'react';
import { Cpu, Zap, DollarSign, Layers } from 'lucide-react';

interface ModelSpec {
  id: string;
  name: string;
  provider: string;
  inputPerM: number;
  cachedInputPerM: number;
  outputPerM: number;
  tps: number;
  ttftMs: number;
  contextMax: string;
}

const MODELS: ModelSpec[] = [
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    inputPerM: 0.3,
    cachedInputPerM: 0.075,
    outputPerM: 2.5,
    tps: 195,
    ttftMs: 280,
    contextMax: '1M',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    inputPerM: 1.25,
    cachedInputPerM: 0.31,
    outputPerM: 10.0,
    tps: 95,
    ttftMs: 750,
    contextMax: '1M–2M',
  },
  {
    id: 'claude-sonnet',
    name: 'Claude Sonnet (Frontier)',
    provider: 'Anthropic',
    inputPerM: 3.0,
    cachedInputPerM: 0.3,
    outputPerM: 15.0,
    tps: 80,
    ttftMs: 820,
    contextMax: '200K–1M',
  },
  {
    id: 'self-hosted',
    name: 'Qwen / Llama 70B (vLLM FP8)',
    provider: 'Self-Hosted H100',
    inputPerM: 0.25,
    cachedInputPerM: 0.08,
    outputPerM: 0.45,
    tps: 110,
    ttftMs: 220,
    contextMax: '128K',
  },
];

const SAMPLE_TEXT =
  'You are a production SRE agent. Inspect Cloud Logging traces, identify the root cause of the 502 Bad Gateway, and propose a minimal Terraform patch.';

export function TokenEconomicsLab() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [modelId, setModelId] = useState('gemini-flash');
  const [agentSteps, setAgentSteps] = useState(6);
  const [systemTokens, setSystemTokens] = useState(4000);
  const [promptCaching, setPromptCaching] = useState(true);
  const [runsPerDay, setRunsPerDay] = useState(1000);

  const model = MODELS.find((m) => m.id === modelId) || MODELS[0];

  // Approximate BPE subword chunks for interactive visual demo
  const chunks = useMemo(() => {
    const raw = text.match(/(\s+|\w+|[^\w\s]+)/g) || [];
    const out: string[] = [];
    for (const piece of raw) {
      if (piece.length > 7 && /^\w+$/.test(piece)) {
        out.push(piece.slice(0, 4), piece.slice(4));
      } else {
        out.push(piece);
      }
    }
    return out;
  }, [text]);

  const userTokens = chunks.length;

  // Multi-turn agentic token math: each step re-sends growing history!
  const metrics = useMemo(() => {
    let totalInput = 0;
    let totalCached = 0;
    let totalOutput = 0;
    const outputPerStep = 280;
    const toolObsPerStep = 450;

    for (let step = 0; step < agentSteps; step++) {
      const growingHistory = userTokens + step * (outputPerStep + toolObsPerStep);
      if (promptCaching && step > 0) {
        totalCached += systemTokens + Math.round(growingHistory * 0.75);
        totalInput += Math.round(growingHistory * 0.25);
      } else {
        totalInput += systemTokens + growingHistory;
      }
      totalOutput += outputPerStep;
    }

    const costPerRun =
      (totalInput / 1_000_000) * model.inputPerM +
      (totalCached / 1_000_000) * model.cachedInputPerM +
      (totalOutput / 1_000_000) * model.outputPerM;

    const noCacheInput = totalInput + totalCached;
    const noCacheCostPerRun =
      (noCacheInput / 1_000_000) * model.inputPerM +
      (totalOutput / 1_000_000) * model.outputPerM;

    const monthlyCost = costPerRun * runsPerDay * 30;
    const savingsPct =
      noCacheCostPerRun > 0
        ? Math.round(((noCacheCostPerRun - costPerRun) / noCacheCostPerRun) * 100)
        : 0;

    const estLatencySec = (agentSteps * model.ttftMs) / 1000 + totalOutput / model.tps;

    return {
      totalInput,
      totalCached,
      totalOutput,
      costPerRun,
      monthlyCost,
      savingsPct,
      estLatencySec,
    };
  }, [agentSteps, systemTokens, userTokens, promptCaching, model, runsPerDay]);

  const palette = [
    'bg-indigo-500/25 text-indigo-200 border-indigo-500/30',
    'bg-emerald-500/25 text-emerald-200 border-emerald-500/30',
    'bg-amber-500/25 text-amber-200 border-amber-500/30',
    'bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-500/30',
    'bg-cyan-500/25 text-cyan-200 border-cyan-500/30',
  ];

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
          Interactive Tokenizer &amp; Economics Lab
        </span>
        <h3 className="font-display text-lg font-bold text-white">
          Live Token Visualizer &amp; Multi-Step Agent Cost Calculator
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-400">Prices are illustrative list prices at the time of writing and change often — always check the provider\'s pricing page.</p>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-2 sm:p-6">
        {/* Left: Tokenizer */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            1. Type a prompt to inspect subword tokenization
          </label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 font-mono text-xs text-slate-100 outline-none focus:border-amber-400"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Approx. BPE Tokens: <strong className="text-amber-300">{userTokens}</strong></span>
            <span>Characters: <strong className="text-slate-200">{text.length}</strong> ({(text.length / Math.max(1, userTokens)).toFixed(1)} chars/tok)</span>
          </div>
          <div className="mt-2 flex max-h-36 flex-wrap gap-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900/70 p-3 font-mono text-xs">
            {chunks.map((c, idx) => (
              <span
                key={idx}
                className={`rounded border px-1 py-0.5 ${palette[idx % palette.length]}`}
              >
                {c === ' ' ? '·' : c}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Agentic Loop Economics */}
        <div className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            2. Simulate Multi-Step Agent Run Economics
          </label>

          <div className="grid grid-cols-2 gap-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModelId(m.id)}
                className={`rounded-xl border p-2.5 text-left transition ${
                  modelId === m.id
                    ? 'border-amber-400 bg-amber-500/10 text-white'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{m.name}</div>
                <div className="text-[10px] text-slate-400">
                  ${m.inputPerM}/M in · ${m.outputPerM}/M out · {m.contextMax}
                </div>
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Agent Loop Steps</span>
                <strong className="font-mono text-amber-300">{agentSteps} steps</strong>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={agentSteps}
                onChange={(e) => setAgentSteps(Number(e.target.value))}
                className="mt-2 w-full accent-amber-400"
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">System + Tool Schemas</span>
                <strong className="font-mono text-amber-300">{systemTokens.toLocaleString()}t</strong>
              </div>
              <input
                type="range"
                min={500}
                max={16000}
                step={500}
                value={systemTokens}
                onChange={(e) => setSystemTokens(Number(e.target.value))}
                className="mt-2 w-full accent-amber-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={promptCaching}
                onChange={(e) => setPromptCaching(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500"
              />
              Enable Prompt / Context Caching
            </label>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Daily Runs:</span>
              <select
                value={runsPerDay}
                onChange={(e) => setRunsPerDay(Number(e.target.value))}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 font-mono text-xs text-white"
              >
                <option value={100}>100 / day</option>
                <option value={1000}>1,000 / day</option>
                <option value={10000}>10,000 / day</option>
                <option value={100000}>100,000 / day</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Live Output Metrics Strip */}
      <div className="grid grid-cols-2 gap-3 border-t border-slate-800 bg-slate-900/60 p-5 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Layers className="h-3.5 w-3.5 text-indigo-400" /> Total Tokens / Run
          </div>
          <div className="mt-1 font-mono text-base font-bold text-white">
            {(metrics.totalInput + metrics.totalCached + metrics.totalOutput).toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400">
            {metrics.totalCached.toLocaleString()} cached reads
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Cost / Agent Run
          </div>
          <div className="mt-1 font-mono text-base font-bold text-emerald-300">
            ${metrics.costPerRun.toFixed(4)}
          </div>
          <div className="text-[10px] text-slate-400">
            {promptCaching && metrics.savingsPct > 0
              ? `Saves ${metrics.savingsPct}% via caching`
              : 'Caching disabled'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-amber-400" /> Est. Monthly Bill
          </div>
          <div className="mt-1 font-mono text-base font-bold text-amber-300">
            ${metrics.monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[10px] text-slate-400">
            at {runsPerDay.toLocaleString()} runs/day
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Zap className="h-3.5 w-3.5 text-cyan-400" /> Est. End-to-End Time
          </div>
          <div className="mt-1 font-mono text-base font-bold text-cyan-300">
            {metrics.estLatencySec.toFixed(1)}s
          </div>
          <div className="text-[10px] text-slate-400">
            {model.tps} tok/s · {model.ttftMs}ms TTFT
          </div>
        </div>
      </div>
    </div>
  );
}
