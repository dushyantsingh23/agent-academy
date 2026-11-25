import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

const TOKENS = ['Call', 'get_weather', '(', 'city', '=', '"Tokyo"', ')'];

// Stylized self-attention weights showing how each query token attends to prior tokens
const ATTENTION_MATRIX: number[][] = [
  [1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.65, 0.35, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.15, 0.72, 0.13, 0.0, 0.0, 0.0, 0.0],
  [0.10, 0.62, 0.18, 0.10, 0.0, 0.0, 0.0],
  [0.05, 0.15, 0.12, 0.60, 0.08, 0.0, 0.0],
  [0.08, 0.32, 0.06, 0.42, 0.06, 0.06, 0.0],
  [0.12, 0.28, 0.34, 0.08, 0.04, 0.10, 0.04],
];

export function PapersExplorerLab() {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(5); // '"Tokyo"'
  const weights = ATTENTION_MATRIX[selectedTokenIdx];

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-stone-300/80 bg-stone-950 text-stone-100 shadow-xl dark:border-stone-800">
      <div className="border-b border-stone-800 bg-stone-900/90 px-5 py-4">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-400">
          <Sparkles className="h-3.5 w-3.5" /> Interactive Transformer Intuition
        </span>
        <h3 className="mt-1 font-display text-lg font-bold text-white">
          Causal Self-Attention Visualizer (How Models Generate Tool Calls)
        </h3>
        <p className="mt-0.5 text-xs text-stone-400">
          Click any generated token below to inspect which earlier tokens its Query vector attends to (Causal Mask blocks future tokens!).
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-stone-400">
          Select Query Token (q<sub>t</sub>)
        </div>
        <div className="flex flex-wrap gap-2">
          {TOKENS.map((tok, i) => (
            <button
              key={i}
              onClick={() => setSelectedTokenIdx(i)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ${
                i === selectedTokenIdx
                  ? 'border-cyan-400 bg-cyan-500/20 text-white ring-1 ring-cyan-400'
                  : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
              }`}
            >
              {tok}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-stone-400">
            <span>
              Attention Distribution for <strong className="text-cyan-300">{TOKENS[selectedTokenIdx]}</strong>
            </span>
            <span>Softmax(Q · Kᵀ / √dₖ)</span>
          </div>
          {TOKENS.map((tok, i) => {
            const w = weights[i];
            const isMasked = i > selectedTokenIdx;
            return (
              <div key={i} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-3 truncate font-mono text-xs text-stone-300 sm:col-span-2">
                  {tok}
                </div>
                <div className="col-span-7 h-5 overflow-hidden rounded-md bg-stone-900 sm:col-span-8">
                  {isMasked ? (
                    <div className="flex h-full items-center px-2 font-mono text-[10px] text-stone-600">
                      masked (-∞ future token)
                    </div>
                  ) : (
                    <div
                      className="h-full rounded-md bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${Math.max(3, Math.round(w * 100))}%` }}
                    />
                  )}
                </div>
                <div className="col-span-2 text-right font-mono text-xs text-stone-400">
                  {isMasked ? '—' : `${Math.round(w * 100)}%`}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-stone-800 bg-stone-900/70 p-3.5 text-xs leading-relaxed text-stone-300">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <span>
            Notice how generating <code className="text-cyan-300">&quot;Tokyo&quot;</code> strongly attends
            to <code className="text-amber-300">city</code> (42%) and{' '}
            <code className="text-amber-300">get_weather</code> (32%) — and because every new token
            attends to <em>all</em> prior keys/values, caching K &amp; V tensors (KV Cache) avoids
            recomputing them at every step!
          </span>
        </div>
      </div>
    </div>
  );
}
