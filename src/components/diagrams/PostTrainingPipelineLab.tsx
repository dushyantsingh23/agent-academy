import React, { useState } from 'react';
import { Flame, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const STAGES = [
  {
    id: 'pretrain',
    num: '01',
    name: 'Pre-Training',
    data: '10T–30T+ tokens (web, code, books, math)',
    compute: '1,000–16,000+ GPUs / TPUs (Weeks–Months)',
    objective: 'Next-Token Prediction (Cross-Entropy Loss)',
    agentImpact: 'Builds world knowledge, coding fluency, and latent reasoning capacity. Produces a raw Base Model that completes text but does not yet follow instructions or emit tool JSON.',
  },
  {
    id: 'cpt',
    num: '02',
    name: 'Mid-Training / CPT',
    data: '100B–1T high-quality code, long docs, STEM',
    compute: 'Hundreds of GPUs (Days)',
    objective: 'Context Extension (RoPE / YaRN) + Domain Density',
    agentImpact: 'Extends context window from 8K → 128K–1M tokens so agents can ingest entire codebases, MCP schemas, and long trajectories without positional collapse.',
  },
  {
    id: 'sft',
    num: '03',
    name: 'SFT (Supervised)',
    data: '50K–1M curated multi-turn & tool trajectories',
    compute: '8–64 GPUs (Hours)',
    objective: 'Supervised Cross-Entropy on Assistant & Tool Turns',
    agentImpact: 'Teaches chat formatting, strict JSON Schema function calling, refusal boundaries, and multi-step ReAct patterns. (LoRA / QLoRA lives here for enterprise teams!)',
  },
  {
    id: 'dpo',
    num: '04',
    name: 'Preference (DPO / RLHF)',
    data: '50K–500K (prompt, chosen, rejected) pairs',
    compute: '8–64 GPUs (Hours)',
    objective: 'Direct Preference Optimization / PPO Reward Max',
    agentImpact: 'Reduces verbosity, hallucination, and sycophancy; aligns tone and teaches the model to ask clarifying questions instead of guessing destructive tool arguments.',
  },
  {
    id: 'rlvr',
    num: '05',
    name: 'RLVR / GRPO',
    data: 'Verifiable tasks (unit tests, math, SQL, sandboxes)',
    compute: '64–1,000 GPUs + Sandbox Fleet (Days)',
    objective: 'Group Relative Policy Optimization (Objective Verifier)',
    agentImpact: 'The breakthrough behind modern reasoning & coding agents! Models learn to self-critique, backtrack on compiler errors, and plan multi-step tool recovery autonomously.',
  },
  {
    id: 'mlops',
    num: '06',
    name: 'MLOps Flywheel',
    data: 'Production OTel traces → filtered golden evals & SFT',
    compute: 'Continuous CI/CD + Serving (vLLM / Vertex AI)',
    objective: 'Continuous Regression Gating & Distillation',
    agentImpact: 'Turns live production failures into golden regression tests and synthetic distillation datasets to train faster, cheaper 7B–14B specialist models over time.',
  },
];

export function PostTrainingPipelineLab() {
  const [activeId, setActiveId] = useState('rlvr');
  const stage = STAGES.find((s) => s.id === activeId) || STAGES[0];

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-stone-300/80 bg-stone-950 text-stone-100 shadow-xl dark:border-stone-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 bg-stone-900/90 px-5 py-4">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
            <Flame className="h-3.5 w-3.5" /> Interactive Training &amp; MLOps Lifecycle
          </span>
          <h3 className="mt-1 font-display text-lg font-bold text-white">
            From Raw Tokens to Self-Correcting Agentic Models
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-400">
          <RefreshCw className="h-3 w-3 text-emerald-400" /> Click any stage
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {STAGES.map((s) => {
            const selected = s.id === activeId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  selected
                    ? 'border-emerald-400 bg-emerald-500/15 text-white shadow'
                    : 'border-stone-800 bg-stone-900/70 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                }`}
              >
                <div className="font-mono text-[10px] font-bold text-emerald-400">
                  STAGE {s.num}
                </div>
                <div className="mt-1 text-xs font-bold leading-snug">{s.name}</div>
              </button>
            );
          })}
        </div>

        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-2xl border border-emerald-500/30 bg-stone-900/90 p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-display text-base font-bold text-white">
              Stage {stage.num}: {stage.name}
            </h4>
            <span className="rounded-md bg-stone-800 px-2.5 py-1 font-mono text-[11px] text-amber-300">
              {stage.objective}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
              <div className="font-mono text-[10px] uppercase text-stone-400">Dataset Scale</div>
              <div className="mt-1 text-xs font-medium text-stone-200">{stage.data}</div>
            </div>
            <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
              <div className="font-mono text-[10px] uppercase text-stone-400">Typical Compute</div>
              <div className="mt-1 text-xs font-medium text-stone-200">{stage.compute}</div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-stone-300 sm:text-sm">
            <strong className="text-emerald-400">Why it matters for AI Agents: </strong>
            {stage.agentImpact}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
