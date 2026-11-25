import React, { useState } from 'react';
import { Layers, Sparkles, Trash2, Plus, Database, Brain } from 'lucide-react';

interface ContextBlock {
  id: string;
  type: 'system' | 'semantic' | 'episodic' | 'short-term' | 'summary';
  label: string;
  tokens: number;
}

const INITIAL_BLOCKS: ContextBlock[] = [
  { id: 'sys', type: 'system', label: 'System Prompt + Tool Schemas (12 tools)', tokens: 3200 },
  { id: 'ep1', type: 'episodic', label: 'Episodic: User prefers Python & concise PRs', tokens: 450 },
  { id: 'st1', type: 'short-term', label: 'Turn 1: User request + Repo tree scan', tokens: 2400 },
  { id: 'st2', type: 'short-term', label: 'Turn 2: Read auth.py + 180 lines of logs', tokens: 4100 },
];

const MAX_CONTEXT = 16000;

export function MemoryContextLab() {
  const [blocks, setBlocks] = useState<ContextBlock[]>(INITIAL_BLOCKS);
  const [turnCounter, setTurnCounter] = useState(3);

  const usedTokens = blocks.reduce((sum, b) => sum + b.tokens, 0);
  const pct = Math.min(100, Math.round((usedTokens / MAX_CONTEXT) * 100));

  const addToolTurn = () => {
    const newTokens = 2600 + ((turnCounter * 430) % 1800);
    setBlocks((prev) => [
      ...prev,
      {
        id: `st-${turnCounter}`,
        type: 'short-term',
        label: `Turn ${turnCounter}: Tool Call + Raw JSON Output`,
        tokens: newTokens,
      },
    ]);
    setTurnCounter((c) => c + 1);
  };

  const injectRag = () => {
    setBlocks((prev) => [
      ...prev,
      {
        id: `rag-${Date.now()}`,
        type: 'semantic',
        label: 'Semantic RAG: Top-3 Vector Chunks (Docs)',
        tokens: 1850,
      },
    ]);
  };

  const compactContext = () => {
    const shortTerm = blocks.filter((b) => b.type === 'short-term');
    if (shortTerm.length === 0) return;
    const oldTokens = shortTerm.reduce((s, b) => s + b.tokens, 0);
    const compressedTokens = Math.max(450, Math.round(oldTokens * 0.18));
    const kept = blocks.filter((b) => b.type !== 'short-term');
    setBlocks([
      ...kept,
      {
        id: `sum-${Date.now()}`,
        type: 'summary',
        label: `Compacted Summary (${shortTerm.length} turns → key facts & decisions)`,
        tokens: compressedTokens,
      },
    ]);
  };

  const reset = () => {
    setBlocks(INITIAL_BLOCKS);
    setTurnCounter(3);
  };

  const colorMap: Record<ContextBlock['type'], { bar: string; badge: string; text: string }> = {
    system: { bar: 'bg-indigo-500', badge: 'bg-indigo-500/20 text-indigo-300', text: 'Procedural / System' },
    episodic: { bar: 'bg-fuchsia-500', badge: 'bg-fuchsia-500/20 text-fuchsia-300', text: 'Episodic' },
    semantic: { bar: 'bg-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300', text: 'Semantic RAG' },
    'short-term': { bar: 'bg-amber-500', badge: 'bg-amber-500/20 text-amber-300', text: 'Working / Short-Term' },
    summary: { bar: 'bg-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300', text: 'Compacted Summary' },
  };

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-400">
            Interactive Context Engineering Lab
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            Context Window &amp; Memory Compaction Simulator
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addToolTurn}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30 transition hover:bg-amber-500/30"
          >
            <Plus className="h-3.5 w-3.5" /> Add Tool Turn
          </button>
          <button
            onClick={injectRag}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30 transition hover:bg-emerald-500/30"
          >
            <Database className="h-3.5 w-3.5" /> Inject RAG
          </button>
          <button
            onClick={compactContext}
            className="inline-flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-500"
          >
            <Sparkles className="h-3.5 w-3.5" /> Compact History
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Progress bar */}
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Brain className="h-4 w-4 text-indigo-400" />
            Active Context Window Budget ({MAX_CONTEXT.toLocaleString()} demo cap)
          </span>
          <span
            className={`font-mono font-bold ${
              usedTokens > MAX_CONTEXT
                ? 'text-rose-400'
                : usedTokens > MAX_CONTEXT * 0.75
                  ? 'text-amber-400'
                  : 'text-emerald-400'
            }`}
          >
            {usedTokens.toLocaleString()} / {MAX_CONTEXT.toLocaleString()} tokens ({pct}%)
          </span>
        </div>

        <div className="flex h-5 w-full overflow-hidden rounded-full bg-slate-800 p-0.5">
          {blocks.map((b) => {
            const widthPct = Math.max(2, (b.tokens / Math.max(usedTokens, MAX_CONTEXT)) * 100);
            return (
              <div
                key={b.id}
                style={{ width: `${widthPct}%` }}
                title={`${b.label} (${b.tokens} tokens)`}
                className={`h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full ${colorMap[b.type].bar} border-r border-slate-950/60`}
              />
            );
          })}
        </div>

        {usedTokens > MAX_CONTEXT && (
          <div className="mt-3 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
            <strong>Context Overflow / Context Rot Zone!</strong> Quality degrades and latency spikes when raw tool outputs pile up. Click <strong>Compact History</strong> to summarize old turns into dense memory!
          </div>
        )}

        {/* Block list */}
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {blocks.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${colorMap[b.type].badge}`}>
                  {colorMap[b.type].text}
                </span>
                <p className="mt-1 truncate text-xs font-medium text-slate-200">{b.label}</p>
              </div>
              <span className="shrink-0 font-mono text-xs font-semibold text-slate-400">
                {b.tokens.toLocaleString()}t
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Layers className="h-4 w-4 text-indigo-400" />
          Notice how <strong className="text-slate-200">System + Episodic</strong> stays pinned while noisy raw tool turns get compacted by ~82%.
        </div>
      </div>
    </div>
  );
}
