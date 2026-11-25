import React, { useState } from 'react';
import { Rocket, CheckCircle2, AlertTriangle, Gauge } from 'lucide-react';

interface LayerOption {
  id: string;
  label: string;
  desc: string;
  score: number;
  latencyMs: number;
}

const LAYERS: { title: string; key: string; options: LayerOption[] }[] = [
  {
    title: 'Model Routing Strategy',
    key: 'routing',
    options: [
      { id: 'single-pro', label: 'Single Frontier Model', desc: 'Simple, highest accuracy, higher cost & latency', score: 14, latencyMs: 2400 },
      { id: 'cascade', label: 'Model Cascading (Flash + Pro)', desc: 'Fast model routes & calls tools; Pro handles hard plans', score: 20, latencyMs: 1100 },
    ],
  },
  {
    title: 'State & Durability',
    key: 'state',
    options: [
      { id: 'inmem', label: 'In-Memory Only', desc: 'Lost on container restart; fine for prototypes', score: 6, latencyMs: 50 },
      { id: 'durable', label: 'Durable Checkpoints (Agent Engine / Temporal / Postgres)', desc: 'Crash-resilient, pause/resume HITL workflows', score: 20, latencyMs: 140 },
    ],
  },
  {
    title: 'Tooling & Protocol',
    key: 'tools',
    options: [
      { id: 'adhoc', label: 'Hardcoded REST Wrappers', desc: 'Fast start, brittle across multiple agents', score: 10, latencyMs: 200 },
      { id: 'mcp-a2a', label: 'MCP Servers + A2A Discovery', desc: 'Standardized, reusable, OAuth-scoped tools & peer agents', score: 20, latencyMs: 220 },
    ],
  },
  {
    title: 'Safety & Reliability',
    key: 'safety',
    options: [
      { id: 'basic', label: 'System Prompt Rules Only', desc: 'Vulnerable to indirect injection & infinite loops', score: 5, latencyMs: 20 },
      { id: 'defense', label: 'Model Armor + HITL + Step/Budget Caps', desc: 'Defense-in-depth for enterprise production', score: 20, latencyMs: 180 },
    ],
  },
  {
    title: 'Observability & Evals',
    key: 'evals',
    options: [
      { id: 'logs', label: 'Console Logs Only', desc: 'Hard to debug multi-step tool regressions', score: 5, latencyMs: 10 },
      { id: 'otel', label: 'OTel Tracing + Trajectory CI Evals', desc: 'Full span visibility & automated regression gating', score: 20, latencyMs: 30 },
    ],
  },
];

export function ProductionArchitectCanvas() {
  const [selected, setSelected] = useState<Record<string, string>>({
    routing: 'cascade',
    state: 'durable',
    tools: 'mcp-a2a',
    safety: 'defense',
    evals: 'otel',
  });

  const chosen = LAYERS.map(
    (l) => l.options.find((o) => o.id === selected[l.key]) || l.options[0]
  );
  const readiness = chosen.reduce((s, o) => s + o.score, 0);
  const estLatency = chosen.reduce((s, o) => s + o.latencyMs, 0);

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-fuchsia-400">
            <Rocket className="h-3.5 w-3.5" /> Interactive Capstone Canvas
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            Production Agentic Architecture Builder
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs">
            <span className="text-slate-400">Readiness: </span>
            <strong className={readiness >= 85 ? 'text-emerald-400' : readiness >= 60 ? 'text-amber-400' : 'text-rose-400'}>
              {readiness}/100
            </strong>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs">
            <Gauge className="mr-1 inline h-3.5 w-3.5 text-cyan-400" />
            <strong className="font-mono text-cyan-300">~{(estLatency / 1000).toFixed(2)}s</strong>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {LAYERS.map((layer) => (
          <div key={layer.key} className="grid gap-2 sm:grid-cols-12 sm:items-center">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:col-span-3">
              {layer.title}
            </div>
            <div className="grid gap-2 sm:col-span-9 sm:grid-cols-2">
              {layer.options.map((opt) => {
                const active = selected[layer.key] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelected((p) => ({ ...p, [layer.key]: opt.id }))}
                    className={`rounded-xl border p-3 text-left transition ${
                      active
                        ? 'border-fuchsia-400 bg-fuchsia-500/15 text-white'
                        : 'border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{opt.label}</span>
                      <span className="font-mono text-[10px] text-fuchsia-300">+{opt.score}pt</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div
          className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 text-xs leading-relaxed ${
            readiness >= 85
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-200'
          }`}
        >
          {readiness >= 85 ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          )}
          <div>
            <strong>
              {readiness >= 85
                ? 'Enterprise Production-Ready Architecture!'
                : 'Prototype / Staging Grade — Upgrade highlighted layers before production.'}
            </strong>
            <p className="mt-1 text-slate-300">
              {readiness >= 85
                ? 'Your stack combines fast model cascading, durable crash-safe state, open MCP/A2A protocols, defense-in-depth guardrails, and full OpenTelemetry trajectory evals.'
                : 'Watch out for missing durable checkpoints, unguarded prompt injections, or lack of OpenTelemetry trajectory evals — these are the #1 causes of production agent failures.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
