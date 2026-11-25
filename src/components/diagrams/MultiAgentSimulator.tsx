import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Network } from 'lucide-react';

type Topology = 'supervisor' | 'sequential' | 'parallel' | 'swarm' | 'debate';

interface TopoConfig {
  name: string;
  tagline: string;
  pros: string;
  cons: string;
  nodes: { id: string; label: string; sub: string; x: number; y: number; color: string }[];
  edges: [string, string][];
  steps: { activeNodes: string[]; log: string }[];
}

const TOPOLOGIES: Record<Topology, TopoConfig> = {
  supervisor: {
    name: 'Orchestrator-Worker',
    tagline: 'A central Supervisor plans, delegates to specialists, and synthesizes.',
    pros: 'Clear control flow, easy observability, strong context isolation per specialist.',
    cons: 'Supervisor can become a latency bottleneck or single point of failure.',
    nodes: [
      { id: 'sup', label: 'Supervisor', sub: 'Planner & Router', x: 300, y: 55, color: '#818cf8' },
      { id: 'w1', label: 'SQL Agent', sub: 'BigQuery', x: 110, y: 185, color: '#34d399' },
      { id: 'w2', label: 'Web Agent', sub: 'Search & Scrape', x: 300, y: 185, color: '#38bdf8' },
      { id: 'w3', label: 'Coder Agent', sub: 'Charts & Python', x: 490, y: 185, color: '#f472b6' },
    ],
    edges: [
      ['sup', 'w1'],
      ['sup', 'w2'],
      ['sup', 'w3'],
    ],
    steps: [
      { activeNodes: ['sup'], log: 'Supervisor decomposes "Q3 Revenue vs Competitors" into 3 sub-tasks.' },
      { activeNodes: ['sup', 'w1', 'w2'], log: 'Supervisor dispatches SQL query to SQL Agent & news lookup to Web Agent.' },
      { activeNodes: ['sup', 'w3'], log: 'Supervisor passes merged data to Coder Agent to generate matplotlib chart.' },
      { activeNodes: ['sup'], log: 'Supervisor synthesizes final executive briefing with verified citations.' },
    ],
  },
  sequential: {
    name: 'Sequential Pipeline',
    tagline: 'Deterministic assembly line where Agent N passes structured output to Agent N+1.',
    pros: 'Predictable cost & latency, trivial to unit-test each stage independently.',
    cons: 'Rigid — cannot dynamically loop back unless wrapped in a LoopAgent.',
    nodes: [
      { id: 's1', label: '1. Ingest', sub: 'Extract PDF', x: 85, y: 120, color: '#38bdf8' },
      { id: 's2', label: '2. Analyze', sub: 'Risk Scoring', x: 230, y: 120, color: '#818cf8' },
      { id: 's3', label: '3. Draft', sub: 'Memo Writer', x: 375, y: 120, color: '#c084fc' },
      { id: 's4', label: '4. Audit', sub: 'Compliance', x: 520, y: 120, color: '#34d399' },
    ],
    edges: [
      ['s1', 's2'],
      ['s2', 's3'],
      ['s3', 's4'],
    ],
    steps: [
      { activeNodes: ['s1'], log: 'Ingest Agent parses 40-page contract into structured JSON clauses.' },
      { activeNodes: ['s2'], log: 'Analyze Agent flags 3 high-liability indemnification clauses.' },
      { activeNodes: ['s3'], log: 'Draft Agent writes redline counter-proposals in company tone.' },
      { activeNodes: ['s4'], log: 'Audit Agent verifies all legal policies are satisfied and approves.' },
    ],
  },
  parallel: {
    name: 'Parallel Fan-Out / Gather',
    tagline: 'Run independent specialists concurrently, then merge results in an Aggregator.',
    pros: 'Massive wall-clock latency reduction (runs at speed of slowest branch).',
    cons: 'Higher peak token throughput; requires conflict resolution on merge.',
    nodes: [
      { id: 'in', label: 'Dispatcher', sub: 'Fan-Out', x: 80, y: 120, color: '#fbbf24' },
      { id: 'p1', label: 'Security Scan', sub: 'OWASP Check', x: 300, y: 45, color: '#f43f5e' },
      { id: 'p2', label: 'Perf Review', sub: 'Big-O & SQL', x: 300, y: 120, color: '#38bdf8' },
      { id: 'p3', label: 'Test Gen', sub: 'Edge Cases', x: 300, y: 195, color: '#34d399' },
      { id: 'out', label: 'Aggregator', sub: 'Merge PR Review', x: 520, y: 120, color: '#818cf8' },
    ],
    edges: [
      ['in', 'p1'],
      ['in', 'p2'],
      ['in', 'p3'],
      ['p1', 'out'],
      ['p2', 'out'],
      ['p3', 'out'],
    ],
    steps: [
      { activeNodes: ['in'], log: 'Dispatcher receives PR #842 diff and fans out to 3 reviewers simultaneously.' },
      { activeNodes: ['p1', 'p2', 'p3'], log: 'Security, Perf, and Test agents analyze the diff in parallel (2.1s total!).' },
      { activeNodes: ['out'], log: 'Aggregator deduplicates findings and posts one cohesive GitHub PR review.' },
    ],
  },
  swarm: {
    name: 'Decentralized Swarm (Handoffs)',
    tagline: 'Peer agents transfer active conversation control directly to the best specialist.',
    pros: 'Ultra-low latency for customer support; no central router tax on every turn.',
    cons: 'Can ping-pong between peers if handoff instructions overlap.',
    nodes: [
      { id: 'triage', label: 'Triage Agent', sub: 'Front Desk', x: 110, y: 120, color: '#38bdf8' },
      { id: 'billing', label: 'Billing Agent', sub: 'Refunds & Plans', x: 320, y: 55, color: '#34d399' },
      { id: 'tech', label: 'Tech Support', sub: 'API & Bugs', x: 320, y: 190, color: '#f472b6' },
      { id: 'esc', label: 'Human Escalation', sub: 'Live Tier-3', x: 515, y: 120, color: '#fbbf24' },
    ],
    edges: [
      ['triage', 'billing'],
      ['triage', 'tech'],
      ['billing', 'tech'],
      ['billing', 'esc'],
      ['tech', 'esc'],
    ],
    steps: [
      { activeNodes: ['triage'], log: 'User says: "My webhook is failing AND I was double-charged."' },
      { activeNodes: ['billing'], log: 'Triage calls transfer_to_billing() — Billing Agent refunds duplicate charge.' },
      { activeNodes: ['tech'], log: 'Billing hands off directly to Tech Support to fix the 401 webhook secret.' },
      { activeNodes: ['esc'], log: 'Complex enterprise account detected — seamless handoff to Human Tier-3.' },
    ],
  },
  debate: {
    name: 'Generator-Critic / Debate',
    tagline: 'Adversarial agents critique and refine outputs until a quality bar is met.',
    pros: 'Dramatically reduces hallucinations and catches subtle logic/security bugs.',
    cons: 'Higher token cost; MUST have a max_iterations cap to prevent endless loops.',
    nodes: [
      { id: 'gen', label: 'Proposer', sub: 'Drafts Solution', x: 140, y: 120, color: '#818cf8' },
      { id: 'crit', label: 'Red-Team Critic', sub: 'Finds Flaws', x: 340, y: 55, color: '#f43f5e' },
      { id: 'judge', label: 'Judge / Verifier', sub: 'Score >= 9/10', x: 495, y: 165, color: '#34d399' },
    ],
    edges: [
      ['gen', 'crit'],
      ['crit', 'gen'],
      ['gen', 'judge'],
    ],
    steps: [
      { activeNodes: ['gen'], log: 'Proposer generates Firestore Security Rules for multi-tenant SaaS.' },
      { activeNodes: ['crit'], log: 'Red-Team Critic spots IDOR vulnerability: missing tenantId check on update!' },
      { activeNodes: ['gen'], log: 'Proposer patches update rule to enforce request.auth.token.tenantId == resource.data.tenantId.' },
      { activeNodes: ['judge'], log: 'Verifier runs emulator test suite — 100% pass. Approves final rules!' },
    ],
  },
};

export function MultiAgentSimulator() {
  const [topo, setTopo] = useState<Topology>('supervisor');
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const cfg = TOPOLOGIES[topo];
  const activeStep = cfg.steps[step] || cfg.steps[0];

  useEffect(() => {
    if (!running) return;
    if (step >= cfg.steps.length - 1) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 1600);
    return () => clearTimeout(t);
  }, [running, step, cfg.steps.length]);

  const switchTopo = (t: Topology) => {
    setTopo(t);
    setStep(0);
    setRunning(false);
  };

  const nodeMap = Object.fromEntries(cfg.nodes.map((n) => [n.id, n]));

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-rose-400">
            <Network className="h-3.5 w-3.5" /> Interactive Multi-Agent Topology Lab
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            Compare &amp; Simulate Multi-Agent Orchestration Patterns
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(TOPOLOGIES) as Topology[]).map((k) => (
            <button
              key={k}
              onClick={() => switchTopo(k)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                topo === k
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {TOPOLOGIES[k].name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="text-sm text-slate-300">{cfg.tagline}</p>

        <svg viewBox="0 0 600 245" className="mx-auto my-4 w-full max-w-3xl select-none">
          {cfg.edges.map(([a, b], idx) => {
            const nA = nodeMap[a];
            const nB = nodeMap[b];
            const isHot =
              activeStep.activeNodes.includes(a) || activeStep.activeNodes.includes(b);
            return (
              <line
                key={idx}
                x1={nA.x}
                y1={nA.y}
                x2={nB.x}
                y2={nB.y}
                stroke={isHot ? '#f43f5e' : '#334155'}
                strokeWidth={isHot ? 2.5 : 1.5}
                className={isHot ? 'animate-dash-flow' : ''}
              />
            );
          })}

          {cfg.nodes.map((n) => {
            const active = activeStep.activeNodes.includes(n.id);
            return (
              <g key={n.id} transform={`translate(${n.x - 64}, ${n.y - 26})`}>
                {active && (
                  <rect
                    x="-5"
                    y="-5"
                    width="138"
                    height="62"
                    rx="16"
                    fill={n.color}
                    fillOpacity="0.2"
                    className="animate-pulse-ring"
                  />
                )}
                <rect
                  width="128"
                  height="52"
                  rx="12"
                  fill={active ? '#0f172a' : '#0b1120'}
                  stroke={active ? n.color : '#334155'}
                  strokeWidth={active ? 2.4 : 1.2}
                />
                <text x="64" y="22" textAnchor="middle" fill="#fff" fontSize="11.5" fontWeight="700">
                  {n.label}
                </text>
                <text x="64" y="38" textAnchor="middle" fill={active ? n.color : '#64748b'} fontSize="9.5">
                  {n.sub}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-rose-300">
              TRACE STEP {step + 1} / {cfg.steps.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStep(0);
                  setRunning(true);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
              >
                <Play className="h-3.5 w-3.5" /> Simulate Task
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setStep((s) => (s + 1) % cfg.steps.length);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Step →
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setStep(0);
                }}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-2 font-mono text-xs text-slate-200 sm:text-sm">{activeStep.log}</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-slate-300">
            <strong className="text-emerald-400">Strengths: </strong>
            {cfg.pros}
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-slate-300">
            <strong className="text-amber-400">Trade-offs: </strong>
            {cfg.cons}
          </div>
        </div>
      </div>
    </div>
  );
}
