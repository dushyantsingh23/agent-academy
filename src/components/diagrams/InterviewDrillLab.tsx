import React, { useState } from 'react';
import { Briefcase, CheckSquare, Square, ChevronDown, ChevronUp, Layers, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface DesignCase {
  id: string;
  companyStyle: string;
  title: string;
  difficulty: string;
  prompt: string;
  clarifyingQuestions: string[];
  architecture: string[];
  tradeoffs: string[];
  failureModes: string[];
  staffSignals: string[];
}

const DESIGN_CASES: DesignCase[] = [
  {
    id: 'swe-platform',
    companyStyle: 'Frontier Lab / DevTools',
    title: 'Autonomous Coding Agent Platform for 50,000 Enterprise Developers',
    difficulty: 'Staff / L6+',
    prompt:
      'Design a cloud-hosted autonomous SWE agent (like Devin / Claude Code / Antigravity) that takes GitHub issues, edits multi-repo codebases, runs tests, and opens verified PRs for 50k enterprise engineers.',
    clarifyingQuestions: [
      'Are runs interactive (IDE copilot, <3s TTFT) or async background (issue-to-PR, 5–20 min)?',
      'What are the data-residency & security boundaries? Can untrusted repo code run arbitrary `npm install` or curl internal VPC endpoints?',
      'What is the target cost-per-resolved-PR budget and acceptable pass@1 / merge rate?',
    ],
    architecture: [
      'Control Plane (Cloud Run / GKE) receives GitHub webhooks → enqueues durable jobs in Temporal / Pub/Sub.',
      'Ephemeral MicroVM Sandboxes (Firecracker / GKE gVisor) pre-warmed with repo snapshots + read-only credentials and strict egress allowlist.',
      'CodeAct Loop: Frontier Planner (Gemini Pro / Claude) creates edit plan → Worker runs ripgrep, edits files, executes unit tests, reflects on stderr (capped at 12 iterations).',
      'Context Engineering: Static system/tool prefix pinned for 90% KV cache hits; large test logs written to scratch files with summary pointers; subagent isolation for repo search.',
    ],
    tradeoffs: [
      'Pre-warmed sandbox pool (higher idle compute cost, <2s startup) vs. cold container spin-up (cheaper, 30–60s lag).',
      'CodeAct (bash/python scripts — fewer LLM turns, requires hard VM isolation) vs. strict typed JSON file tools (safer, more turns).',
    ],
    failureModes: [
      'Infinite edit-test-fail loops burning $15/issue → enforce max_steps, diff-oscillation detector, and per-PR dollar cap.',
      'Supply-chain / prompt injection inside a malicious PR diff trying to steal CI secrets → zero secrets inside sandbox; PR creation happens in a separate privileged outer service.',
    ],
    staffSignals: [
      'Separates untrusted code execution sandbox from privileged GitHub token service.',
      'Quantifies KV prompt caching & quadratic O(N²) context growth across 15+ turns.',
      'Proposes SWE-bench-style internal golden repo eval suite gating every prompt/model release.',
    ],
  },
  {
    id: 'enterprise-ops',
    companyStyle: 'FinTech / Enterprise SaaS',
    title: 'Multi-Tenant Support Agent Executing Real-Money Refunds at 10,000 QPS',
    difficulty: 'Staff / Principal',
    prompt:
      'Design a multi-tenant AI customer operations platform where agents resolve billing, subscription, and refund tickets across 500 enterprise tenants, with strict compliance and <2s P95 latency.',
    clarifyingQuestions: [
      'What refund threshold requires Human-in-the-Loop (HITL) manager approval vs. autonomous execution?',
      'What are the SLA requirements for tenant isolation (shared vector index with metadata filter vs. dedicated namespaces)?',
      'How do we handle downstream Stripe / ERP API outages without duplicate refunds?',
    ],
    architecture: [
      'Edge Security: Model Armor screens incoming messages for PII/injection before routing.',
      'Model Cascading: Ultra-fast Flash Triage Agent classifies intent & handles simple FAQ/RAG in <400ms; escalates complex disputes to Pro Reasoning Agent.',
      'MCP Tool Layer on Cloud Run: Scoped per-tenant OAuth tokens; every mutating tool (issue_refund) requires deterministic `idempotency_key` + policy engine check.',
      'Durable HITL Pause/Resume: Refunds >$100 transition task to `input-required` (persisted in Postgres/Agent Engine), notify supervisor UI, and resume cleanly upon approval.',
    ],
    tradeoffs: [
      'Deterministic policy engine in code (zero hallucination risk on refund caps) vs. prompt-only policy rules (fast to change, unsafe for money).',
      'Multi-region Vertex AI quota pool + Provisioned Throughput (guaranteed TPM, higher fixed cost) vs. pay-as-you-go (429 risk at peak).',
    ],
    failureModes: [
      'Indirect prompt injection in a customer ticket tricking the agent into refunding $10,000 → code-level policy gate & HITL blocks it regardless of LLM output.',
      'Noisy neighbor tenant saturating global TPM → per-tenant Redis token bucket + queue backpressure.',
    ],
    staffSignals: [
      'Enforces `tenant_id` filtering in database/vector code — never trusts the LLM to filter tenant data.',
      'Designs idempotent mutating tools and calculates pass^5 consistency rather than pass@5.',
      'Includes Shadow Mode + 5% Canary rollout with automated refund-anomaly kill switch.',
    ],
  },
  {
    id: 'deep-research',
    companyStyle: 'AI Search / Knowledge Lab',
    title: 'Deep Research Agent with Verified Citations & Streaming UX',
    difficulty: 'Staff / L6',
    prompt:
      'Design a Deep Research agent (like Gemini Deep Research / Perplexity) that answers complex multi-hop financial or scientific queries across web + internal PDFs with 100% grounded citations.',
    clarifyingQuestions: [
      'What is the user expectation: instant partial streaming or a 2–5 minute comprehensive report?',
      'How strict is citation verification — must every quantitative claim map to an exact source span?',
      'How do we prevent context overflow when crawling 40 web pages and 10 PDFs?',
    ],
    architecture: [
      'Stage 1 (Plan): Orchestrator decomposes query into a DAG of 6–10 sub-questions and streams the research plan to the user for optional steering.',
      'Stage 2 (Parallel Map): Concurrent Flash Worker agents search web + hybrid RAG (BM25 + Dense + Reranker), extract structured claims with exact URL/page offsets, and write raw docs to Cloud Storage.',
      'Stage 3 (Reduce & Critique): Synthesizer drafts report from compact structured evidence cards; Fact-Checker Critic verifies every citation against raw spans and flags unsupported claims.',
    ],
    tradeoffs: [
      'Broad parallel fan-out (faster wall-clock, higher peak token cost & duplicate fetches) vs. sequential adaptive search (cheaper, slower).',
      'Semantic caching of sub-query evidence across users (saves 40% crawl/token spend) vs. strict real-time freshness.',
    ],
    failureModes: [
      'Context rot from dumping 200KB of HTML into the orchestrator → workers return crisp 300-token structured JSON evidence + artifact URIs.',
      'Fabricated or drifted citations → deterministic URL-existence check + span-level entailment judge.',
    ],
    staffSignals: [
      'Uses artifact-pointer / scratchpad pattern to keep orchestrator context lean.',
      'Balances perceived latency (SSE progress pills + partial streaming) with deep background accuracy.',
      'Defines offline groundedness, citation precision, and claim recall metrics.',
    ],
  },
  {
    id: 'mcp-a2a-gateway',
    companyStyle: 'Big Tech / Platform Infra',
    title: 'Enterprise MCP & A2A Governance Gateway for 400+ Internal Tools',
    difficulty: 'Staff / Principal',
    prompt:
      'Your company has 400 internal microservices and 50 teams building agents in ADK, LangGraph, and CrewAI. Design a unified MCP + A2A platform so agents safely discover and invoke tools and peer agents.',
    clarifyingQuestions: [
      'How do we avoid stuffing 400 tool JSON schemas (80,000+ tokens) into every agent\'s system prompt?',
      'How does user identity propagate from the end user → Orchestrator Agent → Remote A2A Agent → MCP Server (avoiding Confused Deputy)?',
      'How do security teams audit and instantly revoke a misbehaving tool across all 50 agents?',
    ],
    architecture: [
      'Central Tool & Agent Registry: Hosts MCP server manifests and A2A Agent Cards (`/.well-known/agent-card.json`) with owner metadata & risk tier.',
      'Dynamic Tool Retrieval (Tool RAG): Agents query a meta-tool `discover_tools(intent)` that retrieves only the top 5–8 relevant coarse-grained MCP tools per task.',
      'Zero-Trust Identity Propagation: OAuth 2.1 On-Behalf-Of (OBO) token exchange scopes every downstream MCP/A2A call to the intersection of User Permissions ∩ Agent Permissions.',
      'Unified Telemetry & Kill Switch: Gateway emits OpenTelemetry GenAI spans to Cloud Trace and enforces per-tool rate limits, DLP redaction, and instant circuit-breaker revocation.',
    ],
    tradeoffs: [
      'Centralized API Gateway (single choke point for auth/audit, slight latency hop) vs. sidecar/direct mesh (lower latency, harder governance).',
      'Coarse-grained intent MCP tools (higher LLM accuracy, requires curation) vs. auto-generated OpenAPI-to-MCP wrappers (fast onboarding, noisy schemas).',
    ],
    failureModes: [
      'Confused Deputy privilege escalation where an agent uses a shared service account to read HR data for an intern → OBO user-scoped tokens prevent this.',
      'Schema drift breaking 20 downstream agents → versioned MCP tool contracts + automated contract tests in CI.',
    ],
    staffSignals: [
      'Solves the "400 tools context bloat" problem via dynamic tool retrieval + coarse tool design.',
      'Articulates OAuth OBO delegation (User ∩ Agent least privilege) clearly.',
      'Distinguishes vertical MCP (Agent↔Tools) from horizontal A2A (Agent↔Agent) cleanly.',
    ],
  },
  {
    id: 'realtime-voice',
    companyStyle: 'Consumer AI / Frontier Lab',
    title: 'Low-Latency Realtime Voice & Multimodal Agent (<400ms Turn-Taking)',
    difficulty: 'Staff / L6',
    prompt:
      'Design a realtime voice & screen-sharing AI agent that helps users troubleshoot devices live, supporting natural human barge-in interruptions and async backend tool calls without awkward silences.',
    clarifyingQuestions: [
      'What is the end-to-end mouth-to-ear latency budget (<400ms vs <1s)?',
      'Should we use native speech-to-speech multimodal models (Gemini Live / Realtime API) or a cascaded STT → LLM → TTS pipeline?',
      'How should the agent behave when a backend diagnostic tool takes 4 seconds to return?',
    ],
    architecture: [
      'Transport: WebRTC edge connections (UDP) for ultra-low jitter audio + 1 fps video frame sampling, authenticated via short-lived ephemeral tokens.',
      'Native Multimodal Live Session: Bidirectional WebSocket/WebRTC to Gemini Live API with server-side Voice Activity Detection (VAD) and instant barge-in cancellation.',
      'Non-Blocking Async Tool Calling: When the model triggers `run_line_diagnostics()`, the voice stream stays conversational ("Let me check your router signal — one moment...") while the tool executes asynchronously and injects its result back into the live session.',
    ],
    tradeoffs: [
      'Native Speech-to-Speech (lowest latency, preserves emotion/prosody, harder to inspect/filter text mid-stream) vs. Cascaded STT→LLM→TTS (easier guardrails & logging, 800ms–1.5s latency).',
      'Continuous high-res video streaming (huge token cost) vs. event-driven keyframes (send frame only on scene change or user question).',
    ],
    failureModes: [
      'Echo / background noise triggering false barge-in interruptions → acoustic echo cancellation (AEC) + tuned VAD sensitivity.',
      'Long session context drift & 15-min WebSocket limits → session resumption tokens + periodic background context summarization.',
    ],
    staffSignals: [
      'Explicitly budgets every millisecond (network + VAD + model TTFT + audio chunking).',
      'Explains non-blocking async function calling during live audio streams.',
      'Uses ephemeral tokens so browser clients never hold permanent API keys.',
    ],
  },
];

export function InterviewDrillLab() {
  const [selectedId, setSelectedId] = useState(DESIGN_CASES[0].id);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    clarify: true,
    arch: true,
    tradeoffs: false,
    failures: false,
    rubric: false,
  });
  const [checkedSignals, setCheckedSignals] = useState<Record<string, boolean>>({});

  const active = DESIGN_CASES.find((c) => c.id === selectedId) || DESIGN_CASES[0];

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSignal = (sigKey: string) =>
    setCheckedSignals((prev) => ({ ...prev, [sigKey]: !prev[sigKey] }));

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-stone-300/80 bg-stone-950 text-stone-100 shadow-xl dark:border-stone-800">
      <div className="border-b border-stone-800 bg-stone-900/90 px-5 py-4">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-400">
          <Briefcase className="h-3.5 w-3.5" /> Interactive Staff System Design Drill
        </span>
        <h3 className="mt-1 font-display text-lg font-bold text-white">
          Practice Real Staff+ AI Agent Design Prompts
        </h3>
        <p className="mt-0.5 text-xs text-stone-400">
          Pick a prompt, think through your architecture first, then reveal each Staff-level breakdown section.
        </p>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-stone-800 bg-stone-950 px-5 py-3">
        {DESIGN_CASES.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-left transition ${
              c.id === selectedId
                ? 'border-amber-500/70 bg-amber-500/15 text-white'
                : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
            }`}
          >
            <div className="font-mono text-[10px] uppercase text-amber-400">
              Case 0{idx + 1} · {c.companyStyle}
            </div>
            <div className="mt-0.5 max-w-[200px] truncate text-xs font-semibold">{c.title}</div>
          </button>
        ))}
      </div>

      {/* Active Case Content */}
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 p-5 sm:p-6"
      >
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Interview Prompt · {active.difficulty}
            </span>
            <span className="rounded bg-stone-800 px-2 py-0.5 font-mono text-[10px] text-stone-300">
              45–60 Min System Design
            </span>
          </div>
          <h4 className="mt-1.5 font-display text-base font-bold text-white sm:text-lg">
            {active.title}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">{active.prompt}</p>
        </div>

        {/* Collapsible Deep-Dive Sections */}
        {(
          [
            {
              key: 'clarify',
              title: '1. Clarifying Questions to Ask in the First 5 Minutes',
              icon: <Cpu className="h-4 w-4 text-cyan-400" />,
              items: active.clarifyingQuestions,
            },
            {
              key: 'arch',
              title: '2. High-Level Architecture & Data Flow',
              icon: <Layers className="h-4 w-4 text-emerald-400" />,
              items: active.architecture,
            },
            {
              key: 'tradeoffs',
              title: '3. Key Engineering Trade-Offs (Staff Signal)',
              icon: <Briefcase className="h-4 w-4 text-amber-400" />,
              items: active.tradeoffs,
            },
            {
              key: 'failures',
              title: '4. Failure Modes, Security & Bottlenecks',
              icon: <ShieldAlert className="h-4 w-4 text-rose-400" />,
              items: active.failureModes,
            },
          ] as const
        ).map((sec) => (
          <div
            key={sec.key}
            className="overflow-hidden rounded-xl border border-stone-800 bg-stone-900/60"
          >
            <button
              onClick={() => toggleSection(sec.key)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-bold text-stone-100 transition hover:bg-stone-800/70 sm:text-sm"
            >
              <span className="flex items-center gap-2">
                {sec.icon}
                {sec.title}
              </span>
              {openSections[sec.key] ? (
                <ChevronUp className="h-4 w-4 text-stone-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-stone-400" />
              )}
            </button>
            {openSections[sec.key] && (
              <ul className="space-y-2 border-t border-stone-800 px-4 py-3.5 text-xs leading-relaxed text-stone-300 sm:text-[13px]">
                {sec.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 font-mono text-[10px] text-amber-400">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Self-Evaluation Rubric Checklist */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            5. Staff+ Bar Self-Check Rubric (Check off what you covered)
          </div>
          <div className="space-y-2">
            {active.staffSignals.map((sig, i) => {
              const k = `${active.id}-${i}`;
              const checked = !!checkedSignals[k];
              return (
                <button
                  key={k}
                  onClick={() => toggleSignal(k)}
                  className="flex w-full items-start gap-2.5 text-left text-xs text-stone-200 transition hover:text-white"
                >
                  {checked ? (
                    <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Square className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                  )}
                  <span className={checked ? 'line-through opacity-75' : ''}>{sig}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
