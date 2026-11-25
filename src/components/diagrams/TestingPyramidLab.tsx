import React, { useState } from 'react';
import { TestTube2, ShieldAlert, Repeat, Users, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PyramidLayer {
  id: string;
  tier: string;
  name: string;
  speed: string;
  cost: string;
  when: string;
  color: string;
  desc: string;
  tools: string;
}

const LAYERS: PyramidLayer[] = [
  {
    id: 'canary',
    tier: 'L6 · Production',
    name: 'Shadow Traffic & Online Canary Evals',
    speed: 'Continuous',
    cost: 'Live Traffic',
    when: 'Post-deploy (5% → 25% → 100%)',
    color: 'from-rose-500 to-orange-500',
    desc: 'Mirror real production requests to a candidate agent version silently (shadow mode) and compare latency, cost, and LLM-Judge scores before exposing users.',
    tools: 'Vertex AI Eval, Langfuse, Arize Phoenix, Feature Flags',
  },
  {
    id: 'redteam',
    tier: 'L5 · Adversarial',
    name: 'Red-Teaming & Prompt Injection Suites',
    speed: 'Minutes',
    cost: 'Medium',
    when: 'Nightly & Pre-release',
    color: 'from-amber-500 to-yellow-500',
    desc: 'Automated adversarial probes testing direct/indirect prompt injection, jailbreaks, PII extraction, and confused-deputy tool abuse.',
    tools: 'Promptfoo, NVIDIA Garak, Microsoft PyRIT, Model Armor',
  },
  {
    id: 'persona',
    tier: 'L4 · End-to-End',
    name: 'Multi-Turn User Persona Simulations',
    speed: 'Minutes',
    cost: 'Medium',
    when: 'Pre-merge / Release',
    color: 'from-fuchsia-500 to-purple-500',
    desc: 'Pit your agent against simulated LLM users (impatient, ambiguous, non-English, changing mind mid-task) across 5–10 turns to catch conversational dead ends.',
    tools: 'ADK Eval, LangSmith Simulated Users, DeepEval',
  },
  {
    id: 'trajectory',
    tier: 'L3 · Agentic Core',
    name: 'Trajectory & Golden Dataset Evals (Pass^k)',
    speed: '30–90s',
    cost: 'Low-Med',
    when: 'Every PR (CI Gate)',
    color: 'from-indigo-500 to-blue-500',
    desc: 'Run 50–500 curated golden tasks, assert tool-call precision/recall, forbidden-tool invariants, token budgets, and multi-trial Pass^k consistency.',
    tools: 'pytest + Braintrust / Inspect AI / Vertex GenAI Eval',
  },
  {
    id: 'vcr',
    tier: 'L2 · Deterministic',
    name: 'Record-and-Replay (VCR) & Mocked LLM Tests',
    speed: '< 2s',
    cost: '$0 (Free)',
    when: 'Every Commit',
    color: 'from-cyan-500 to-teal-500',
    desc: 'Record real LLM + tool HTTP responses once into cassettes, then replay deterministically in CI to test orchestration logic, retries, and parsers with zero flake.',
    tools: 'VCR.py, Polly.js, FakeListChatModel, Mock MCP Server',
  },
  {
    id: 'unit',
    tier: 'L1 · Foundation',
    name: 'Tool Unit, Schema & Contract Tests',
    speed: '< 500ms',
    cost: '$0 (Free)',
    when: 'Every Save / Commit',
    color: 'from-emerald-500 to-green-500',
    desc: 'Standard software tests on every tool function, Pydantic/Zod schema, SQL parameter binding, timeout handler, and idempotency key — zero LLM involved!',
    tools: 'pytest, Vitest, Hypothesis (fuzzing), Pydantic',
  },
];

export function TestingPyramidLab() {
  const [selectedId, setSelectedId] = useState('trajectory');
  const [stepAccuracy, setStepAccuracy] = useState(95);
  const [numSteps, setNumSteps] = useState(8);
  const [trialsK, setTrialsK] = useState(5);

  const active = LAYERS.find((l) => l.id === selectedId) || LAYERS[3];

  const pSingle = stepAccuracy / 100;
  const workflowSuccess = Math.pow(pSingle, numSteps); // P(all N steps succeed)
  const passAtK = 1 - Math.pow(1 - workflowSuccess, trialsK); // At least 1 of k succeeds
  const passPowerK = Math.pow(workflowSuccess, trialsK); // ALL k consecutive trials succeed

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-cyan-400">
          <TestTube2 className="h-3.5 w-3.5" /> Interactive Testing &amp; Reliability Lab
        </span>
        <h3 className="font-display text-lg font-bold text-white">
          The 6-Layer Agent Testing Pyramid &amp; Pass@k vs. Pass^k Calculator
        </h3>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-12 sm:p-6">
        {/* Left: Interactive Pyramid */}
        <div className="space-y-2 lg:col-span-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Click any pyramid layer to inspect testing strategy
          </p>
          <div className="flex flex-col items-center gap-2">
            {LAYERS.map((layer, idx) => {
              const widthPct = 56 + idx * 8.8;
              const isSelected = layer.id === selectedId;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedId(layer.id)}
                  style={{ width: `${widthPct}%` }}
                  className={`rounded-xl bg-gradient-to-r ${layer.color} px-3 py-2.5 text-center transition-all ${
                    isSelected
                      ? 'scale-[1.03] ring-2 ring-white shadow-lg'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/90">
                    {layer.tier}
                  </div>
                  <div className="text-xs font-bold text-white">{layer.name}</div>
                </button>
              );
            })}
          </div>

          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-display text-sm font-bold text-white">{active.name}</h4>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                {active.speed} · {active.cost}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">{active.desc}</p>
            <div className="mt-2.5 flex flex-wrap justify-between gap-2 border-t border-slate-800 pt-2 text-[11px] text-slate-400">
              <span><strong className="text-slate-200">When:</strong> {active.when}</span>
              <span><strong className="text-slate-200">Tools:</strong> {active.tools}</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Pass@k vs Pass^k Reliability Simulator */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-500/30 bg-slate-900/70 p-5 lg:col-span-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Repeat className="h-4 w-4" /> Why Multi-Step Agents Fail in Prod (Compounding Math)
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Even a <strong className="text-white">95% accurate</strong> step compounds across an
              8-step loop! Compare <strong className="text-emerald-400">pass@k</strong> (works at
              least once in k tries — good for coding) vs.{' '}
              <strong className="text-amber-400">pass^k</strong> (works EVERY single time across k
              tries — required for enterprise reliability).
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Per-Step Accuracy</span>
                  <strong className="font-mono text-cyan-300">{stepAccuracy}%</strong>
                </div>
                <input
                  type="range"
                  min={80}
                  max={99}
                  value={stepAccuracy}
                  onChange={(e) => setStepAccuracy(Number(e.target.value))}
                  className="mt-1 w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Agent Workflow Steps (N)</span>
                  <strong className="font-mono text-cyan-300">{numSteps} steps</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={numSteps}
                  onChange={(e) => setNumSteps(Number(e.target.value))}
                  className="mt-1 w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Repeated Trials (k)</span>
                  <strong className="font-mono text-cyan-300">k = {trialsK}</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={trialsK}
                  onChange={(e) => setTrialsK(Number(e.target.value))}
                  className="mt-1 w-full accent-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
              <div className="text-[10px] font-semibold uppercase text-slate-400">Single Run</div>
              <div className="mt-1 font-mono text-lg font-bold text-white">
                {(workflowSuccess * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-500">p^{numSteps}</div>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
              <div className="text-[10px] font-semibold uppercase text-emerald-300">
                pass@{trialsK}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-emerald-300">
                {(passAtK * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-emerald-400/80">≥1 success</div>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
              <div className="text-[10px] font-semibold uppercase text-amber-300">
                pass^{trialsK}
              </div>
              <div className="mt-1 font-mono text-lg font-bold text-amber-300">
                {(passPowerK * 100).toFixed(1)}%
              </div>
              <div className="text-[10px] text-amber-400/80">All {trialsK} succeed</div>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-950/90 p-3 text-[11px] text-slate-300">
            {workflowSuccess < 0.7 ? (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            )}
            <span>
              {workflowSuccess < 0.7
                ? 'Compounding failure alert! Reduce step count with coarse tools, add deterministic validation & retries, or break into verified sub-workflows.'
                : 'Strong end-to-end reliability! Track pass^k in CI so regressions in consistency never slip into production.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
