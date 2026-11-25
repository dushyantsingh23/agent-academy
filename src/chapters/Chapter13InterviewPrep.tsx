import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, Compass, Layers, Shield, Zap } from 'lucide-react';
import { Callout, ConceptCard, SectionHeader } from '../components/UI';
import { InterviewDrillLab } from '../components/diagrams/InterviewDrillLab';
import { InterviewQuestionBank, StudyPlan } from '../components/InterviewQuestionBank';

const RAPID_FIRE_QA = [
  {
    q: 'Why did our 12-step agent\'s LLM bill jump 8× when user traffic only doubled?',
    category: 'Economics & Inference',
    a: 'Two classic culprits: (1) Someone injected a dynamic timestamp or request UUID at the top of the system prompt, invalidating the KV Prefix Cache on every turn (losing 75–90% discounts); and (2) raw tool outputs grew without compaction, causing quadratic O(N²) token growth across the 12 steps. Fix: pin static prompt + schemas at token 0, truncate/summarize tool outputs, and add a token-per-run alert in OpenTelemetry.',
  },
  {
    q: 'How do you handle an agent that needs access to 400 internal microservice APIs?',
    category: 'Tooling & MCP',
    a: 'Never stuff 400 tool JSON schemas into the context window — that burns 80k+ tokens and collapses tool-selection accuracy. Instead: (1) consolidate low-level CRUD endpoints into ~20–30 coarse-grained, intent-level MCP tools, and (2) use Dynamic Tool Retrieval (Tool RAG) where the agent calls a meta-tool `search_tools(intent)` to load only the top 5–8 schemas needed for the current task.',
  },
  {
    q: 'An agent reads external customer emails and can query our internal Postgres DB and send emails. How do you stop data exfiltration?',
    category: 'Security',
    a: 'This is the "Lethal Trifecta" (private data + untrusted input + external communication). Prompt instructions alone CANNOT stop indirect prompt injection. Defend in depth: (1) isolate untrusted email parsing in a zero-privilege reader subagent that outputs only structured JSON, (2) enforce deterministic outbound recipient allowlists in tool code, and (3) require Human-in-the-Loop (HITL) approval for any external email or mutation.',
  },
  {
    q: 'When should you NOT use an autonomous agent, and how do you justify that to leadership?',
    category: 'Architecture Judgment',
    a: 'If the workflow has deterministic steps, strict compliance rules, or tight P99 latency/cost budgets (e.g., invoice parsing or standard CRUD routing), a prescriptive workflow with constrained LLM extraction nodes is 10× cheaper, faster, and easier to audit. Staff engineers earn trust by choosing the simplest architecture that meets the product SLA — reserving open-ended loops for genuinely ambiguous tasks.',
  },
  {
    q: 'Your agent\'s accuracy dropped from 94% to 82% after a minor prompt tweak and model upgrade. How do you debug and prevent this?',
    category: 'Testing & Evals',
    a: 'First, isolate variables using pinned model snapshots and OpenTelemetry trace diffs between baseline and candidate runs on your Golden Dataset. Inspect whether the failure is retrieval recall, wrong tool selection, or synthesis hallucination. Prevent future regressions with a 3-stage pipeline: deterministic VCR replay tests on every commit, live pass^k trajectory eval gate in CI, and Shadow Traffic comparison before canary rollout.',
  },
  {
    q: 'How do you keep a 15-minute background coding agent resilient when Kubernetes evicts its pod at minute 11?',
    category: 'Distributed Systems',
    a: 'Make the agent loop stateless and backed by durable execution (Temporal, LangGraph Checkpointer, or Vertex AI Agent Engine Sessions). Persist conversation state and artifact pointers after every single step, handle SIGTERM with a 60s graceful drain, and enforce `idempotency_key` on every mutating tool (PR creation, billing, emails) so the replacement worker resumes from step 11 without duplicate side effects.',
  },
];

export function Chapter13InterviewPrep({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [openQa, setOpenQa] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Career & System Design"
        title="How AI Interviews Work"
        description="Most AI engineering interviews have three parts: concept questions (do you really understand LLMs, RAG and agents?), system design (can you build something reliable end to end?) and trade-off discussions (cost, latency, safety, quality). This chapter prepares you for all three — from junior to Staff level."
      />

      <SectionHeader
        eyebrow="Part 1 · Concepts"
        title="Core Concept Questions (With Simple Answers)"
        description="These come up in almost every AI interview. Practise answering each one out loud in under a minute, in plain language."
      />

      <InterviewQuestionBank />

      <SectionHeader
        eyebrow="Plan"
        title="A 4-Week Study Plan Using This Handbook"
        description="Read, then build something small every week. Interviewers can tell the difference between people who have read about agents and people who have shipped one."
      />

      <StudyPlan />

      <SectionHeader
        eyebrow="Calibration"
        title="What Separates Senior vs. Staff+ Answers?"
        description="Use this calibration matrix to elevate your system design interviews from implementation-level to Staff/Principal-level:"
      />

      <div className="overflow-x-auto rounded-2xl border border-stone-300/80 dark:border-stone-800">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F4ECDB] text-[11px] uppercase tracking-wider text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3">Dimension</th>
              <th className="px-4 py-3">Senior Engineer Answer</th>
              <th className="px-4 py-3">Staff / Principal Engineer Answer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-[#FFFDF7] dark:divide-stone-800 dark:bg-stone-950/60">
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Architecture</td>
              <td className="px-4 py-3 text-stone-600 dark:text-stone-400">&ldquo;I&apos;ll use LangGraph with 4 agents and a vector DB.&rdquo;</td>
              <td className="px-4 py-3 text-stone-800 dark:text-stone-200">Starts with Workflows vs. Agents trade-off, context isolation boundaries, sync vs. async worker split, and durable checkpointing.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Economics &amp; Latency</td>
              <td className="px-4 py-3 text-stone-600 dark:text-stone-400">&ldquo;We&apos;ll call the best frontier model for everything.&rdquo;</td>
              <td className="px-4 py-3 text-stone-800 dark:text-stone-200">Does back-of-the-envelope TPM/RPM &amp; $ per task math, uses Flash/Pro cascading, pins static prefixes for KV caching, and budgets P99 tail latency.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Safety &amp; Auth</td>
              <td className="px-4 py-3 text-stone-600 dark:text-stone-400">&ldquo;We&apos;ll tell the system prompt not to leak secrets.&rdquo;</td>
              <td className="px-4 py-3 text-stone-800 dark:text-stone-200">Enforces security in code: OAuth OBO user-scoped tokens, sandboxed microVMs, deterministic policy gates, HITL approvals, and Model Armor.</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">Quality &amp; Rollout</td>
              <td className="px-4 py-3 text-stone-600 dark:text-stone-400">&ldquo;We&apos;ll test 10 prompts manually before launching.&rdquo;</td>
              <td className="px-4 py-3 text-stone-800 dark:text-stone-200">Designs a 6-layer eval pyramid (VCR CI + pass^k golden trajectories + shadow traffic + canary rollback) tied to OpenTelemetry traces.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InterviewDrillLab />

      <SectionHeader
        eyebrow="Deep Technical Rounds"
        title="High-Signal Rapid-Fire Staff Interview Questions"
        description="Click any question below to reveal the Staff-level engineering breakdown."
      />

      <div className="space-y-3">
        {RAPID_FIRE_QA.map((item, idx) => {
          const isOpen = openQa === idx;
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-2xl border border-stone-300/80 bg-[#FFFDF7] transition dark:border-stone-800 dark:bg-stone-900/60"
            >
              <button
                onClick={() => setOpenQa(isOpen ? null : idx)}
                className="flex w-full items-start justify-between gap-4 p-4 text-left sm:p-5"
              >
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    Q{idx + 1} · {item.category}
                  </span>
                  <h4 className="mt-1 font-display text-sm font-bold text-stone-900 dark:text-stone-50 sm:text-base">
                    {item.q}
                  </h4>
                </div>
                {isOpen ? (
                  <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-stone-400" />
                ) : (
                  <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-stone-400" />
                )}
              </button>
              {isOpen && (
                <div className="border-t border-stone-200/80 bg-[#F5EFE1]/50 px-4 py-4 text-sm leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-300 sm:px-5">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SectionHeader
        eyebrow="45-Minute Playbook"
        title="How to Structure a Winning Staff AI System Design Interview"
        description="Follow this time-boxed framework so you never run out of time before showing Staff-level depth:"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ConceptCard icon={<Compass className="h-4 w-4" />} title="0–7 Min: Scope & Math" badge="Frame">
          Clarify sync vs. async, SLA/latency, safety boundaries, and do quick back-of-the-envelope
          QPS, TPM, and $/task unit-economics estimates.
        </ConceptCard>
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="7–20 Min: Core Loop & Data" badge="Architect">
          Draw the end-to-end architecture: Ingress → Guardrails → Orchestrator/Workers → MCP Tools
          → Durable State &amp; Hybrid RAG.
        </ConceptCard>
        <ConceptCard icon={<Zap className="h-4 w-4" />} title="20–35 Min: Deep Dives" badge="Differentiate">
          Proactively dive into the 2 hardest bottlenecks: KV caching &amp; context compaction,
          multi-region 429 resilience, or sandbox security isolation.
        </ConceptCard>
        <ConceptCard icon={<Shield className="h-4 w-4" />} title="35–45 Min: Evals & Ops" badge="Close Strong">
          Close with how you test (<code>pass^k</code>, VCR, red-teaming), trace (OTel), and safely ship
          (Shadow → Canary → Kill Switch).
        </ConceptCard>
      </div>

      <Callout type="tip" title="Staff Leadership / Behavioral Questions to Prepare">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Build vs. Buy:</strong> Tell me about a time you pushed back against adopting a heavy agent framework (or vice versa) and how you aligned multiple teams.</li>
          <li><strong>Navigating Ambiguity:</strong> How did you convince product &amp; legal stakeholders to ship a non-deterministic AI product safely?</li>
          <li><strong>Platform Leverage:</strong> How do you prevent 10 teams from rebuilding duplicate RAG, MCP auth, and eval harnesses?</li>
        </ul>
      </Callout>
    </div>
  );
}
