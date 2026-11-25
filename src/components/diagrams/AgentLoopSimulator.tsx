import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, StepForward, Cpu, Wrench, Eye, Database, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoopStep {
  node: 'user' | 'llm' | 'tool' | 'obs' | 'memory' | 'answer';
  label: string;
  phase: string;
  content: string;
  tokens: number;
}

const SCENARIOS: Record<string, { title: string; prompt: string; steps: LoopStep[] }> = {
  flight: {
    title: 'Travel Agent (Multi-Tool)',
    prompt: 'Book the cheapest nonstop flight from SFO to Tokyo next Friday under $900.',
    steps: [
      {
        node: 'user',
        label: 'Goal Received',
        phase: 'PERCEPTION',
        content: 'User asks: "Book the cheapest nonstop flight from SFO to Tokyo next Friday under $900."',
        tokens: 24,
      },
      {
        node: 'llm',
        label: 'Thought #1',
        phase: 'REASONING',
        content: 'I need next Friday\'s exact date first, then search nonstop flights SFO -> HND/NRT and check prices against the $900 constraint.',
        tokens: 68,
      },
      {
        node: 'tool',
        label: 'Action: search_flights()',
        phase: 'ACT',
        content: 'call search_flights(origin="SFO", dest="TYO", date="2026-12-04", nonstop=true)',
        tokens: 42,
      },
      {
        node: 'obs',
        label: 'Observation #1',
        phase: 'OBSERVE',
        content: 'Found 2 flights: [ANA NH7: $842 nonstop, 11h15m] and [JAL JL57: $965 nonstop, 11h05m].',
        tokens: 55,
      },
      {
        node: 'memory',
        label: 'Update Working State',
        phase: 'MEMORY',
        content: 'Stored candidate ANA NH7 ($842 <= $900 budget). Checking user preferences from episodic memory: "prefers aisle seat".',
        tokens: 48,
      },
      {
        node: 'llm',
        label: 'Thought #2',
        phase: 'REASONING',
        content: 'ANA NH7 is $842 (under budget). Booking a paid flight is a high-impact action — I should hold the fare and ask for confirmation or execute booking.',
        tokens: 72,
      },
      {
        node: 'tool',
        label: 'Action: hold_flight()',
        phase: 'ACT',
        content: 'call hold_flight(flight_id="NH7-20261204", seat_pref="aisle", hold_minutes=30)',
        tokens: 39,
      },
      {
        node: 'answer',
        label: 'Final Response',
        phase: 'COMPLETE',
        content: 'Held ANA NH7 nonstop SFO->NRT on Dec 4 for $842 (aisle seat). Reply "Confirm" within 30 min to ticket!',
        tokens: 44,
      },
    ],
  },
  debug: {
    title: 'SWE Debugging Agent',
    prompt: 'Fix the 500 error on POST /api/checkout in production logs.',
    steps: [
      {
        node: 'user',
        label: 'Incident Trigger',
        phase: 'PERCEPTION',
        content: 'Alert: POST /api/checkout returning HTTP 500 (spike of 42 errors/min).',
        tokens: 22,
      },
      {
        node: 'llm',
        label: 'Thought #1',
        phase: 'REASONING',
        content: 'Let me inspect the latest stack traces from Cloud Logging to pinpoint the exact file and line.',
        tokens: 54,
      },
      {
        node: 'tool',
        label: 'Action: query_logs()',
        phase: 'ACT',
        content: 'call query_logs(service="checkout-api", severity="ERROR", limit=5)',
        tokens: 34,
      },
      {
        node: 'obs',
        label: 'Observation #1',
        phase: 'OBSERVE',
        content: 'TypeError: Cannot read properties of undefined (reading "currency") at billing.ts:142',
        tokens: 46,
      },
      {
        node: 'tool',
        label: 'Action: read_file() + run_tests()',
        phase: 'ACT',
        content: 'Read billing.ts:130-155, patch null-guard for guest carts, run `npm test -- billing.spec.ts`.',
        tokens: 61,
      },
      {
        node: 'obs',
        label: 'Observation #2',
        phase: 'OBSERVE',
        content: '14/14 tests passed (including new regression test for guest cart currency fallback).',
        tokens: 38,
      },
      {
        node: 'memory',
        label: 'Store Postmortem Pattern',
        phase: 'MEMORY',
        content: 'Saved episodic fix: guest checkout payloads omit cart.currency; default to merchant.currency.',
        tokens: 41,
      },
      {
        node: 'answer',
        label: 'PR Opened',
        phase: 'COMPLETE',
        content: 'Opened PR #418 fixing null currency on guest checkout in billing.ts:142 with regression test. Ready for review.',
        tokens: 49,
      },
    ],
  },
};

export function AgentLoopSimulator() {
  const [scenarioKey, setScenarioKey] = useState<'flight' | 'debug'>('flight');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = SCENARIOS[scenarioKey];
  const current = scenario.steps[stepIdx];

  useEffect(() => {
    if (!playing) return;
    if (stepIdx >= scenario.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setStepIdx((prev) => prev + 1);
    }, 1700);
    return () => clearTimeout(timer);
  }, [playing, stepIdx, scenario.steps.length]);

  const handleScenarioChange = (key: 'flight' | 'debug') => {
    setScenarioKey(key);
    setStepIdx(0);
    setPlaying(false);
  };

  const nodes: {
    id: LoopStep['node'];
    title: string;
    subtitle: string;
    x: number;
    y: number;
    icon: React.ReactNode;
    color: string;
  }[] = [
    { id: 'user', title: 'User / Env', subtitle: 'Goal & Input', x: 75, y: 120, icon: <MessageSquare className="h-4 w-4" />, color: '#38bdf8' },
    { id: 'llm', title: 'LLM Brain', subtitle: 'Reason & Plan', x: 265, y: 60, icon: <Cpu className="h-4 w-4" />, color: '#818cf8' },
    { id: 'tool', title: 'Tool Executor', subtitle: 'APIs / CLI / MCP', x: 470, y: 60, icon: <Wrench className="h-4 w-4" />, color: '#34d399' },
    { id: 'obs', title: 'Observation', subtitle: 'Tool Output', x: 470, y: 185, icon: <Eye className="h-4 w-4" />, color: '#fbbf24' },
    { id: 'memory', title: 'Memory Store', subtitle: 'State & Context', x: 265, y: 185, icon: <Database className="h-4 w-4" />, color: '#c084fc' },
    { id: 'answer', title: 'Final Output', subtitle: 'Goal Achieved', x: 75, y: 215, icon: <MessageSquare className="h-4 w-4" />, color: '#2dd4bf' },
  ];

  const totalTokens = scenario.steps
    .slice(0, stepIdx + 1)
    .reduce((acc, s) => acc + s.tokens, 0);

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">
            Interactive Simulator
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            The Core ReAct Agentic Loop
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['flight', 'debug'] as const).map((k) => (
            <button
              key={k}
              onClick={() => handleScenarioChange(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                scenarioKey === k
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {SCENARIOS[k].title}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="relative bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_60%)] p-4 sm:p-6">
        <svg viewBox="0 0 600 265" className="mx-auto w-full max-w-3xl select-none">
          <defs>
            <marker id="arrow-loop" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1" />
            </marker>
            <marker id="arrow-dim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
            </marker>
          </defs>

          {/* Connecting Paths */}
          {/* User -> LLM */}
          <path
            d="M 135 110 C 175 110, 175 60, 200 60"
            fill="none"
            stroke={current.node === 'llm' ? '#818cf8' : '#334155'}
            strokeWidth={current.node === 'llm' ? 2.5 : 1.5}
            className={current.node === 'llm' ? 'animate-dash-flow' : ''}
            markerEnd={current.node === 'llm' ? 'url(#arrow-loop)' : 'url(#arrow-dim)'}
          />
          {/* LLM -> Tool */}
          <path
            d="M 330 60 L 402 60"
            fill="none"
            stroke={current.node === 'tool' ? '#34d399' : '#334155'}
            strokeWidth={current.node === 'tool' ? 2.5 : 1.5}
            className={current.node === 'tool' ? 'animate-dash-flow' : ''}
            markerEnd={current.node === 'tool' ? 'url(#arrow-loop)' : 'url(#arrow-dim)'}
          />
          {/* Tool -> Obs */}
          <path
            d="M 470 92 L 470 150"
            fill="none"
            stroke={current.node === 'obs' ? '#fbbf24' : '#334155'}
            strokeWidth={current.node === 'obs' ? 2.5 : 1.5}
            className={current.node === 'obs' ? 'animate-dash-flow' : ''}
            markerEnd={current.node === 'obs' ? 'url(#arrow-loop)' : 'url(#arrow-dim)'}
          />
          {/* Obs -> Memory */}
          <path
            d="M 405 185 L 333 185"
            fill="none"
            stroke={current.node === 'memory' ? '#c084fc' : '#334155'}
            strokeWidth={current.node === 'memory' ? 2.5 : 1.5}
            className={current.node === 'memory' ? 'animate-dash-flow' : ''}
            markerEnd={current.node === 'memory' ? 'url(#arrow-loop)' : 'url(#arrow-dim)'}
          />
          {/* Memory -> LLM (feedback loop) */}
          <path
            d="M 265 153 L 265 95"
            fill="none"
            stroke={current.node === 'llm' && stepIdx > 1 ? '#818cf8' : '#334155'}
            strokeWidth={current.node === 'llm' && stepIdx > 1 ? 2.5 : 1.5}
            className={current.node === 'llm' && stepIdx > 1 ? 'animate-dash-flow' : ''}
            markerEnd="url(#arrow-dim)"
          />
          {/* LLM -> Answer */}
          <path
            d="M 215 88 C 175 150, 170 215, 138 215"
            fill="none"
            stroke={current.node === 'answer' ? '#2dd4bf' : '#334155'}
            strokeWidth={current.node === 'answer' ? 2.5 : 1.5}
            className={current.node === 'answer' ? 'animate-dash-flow' : ''}
            markerEnd={current.node === 'answer' ? 'url(#arrow-loop)' : 'url(#arrow-dim)'}
          />

          {/* Nodes */}
          {nodes.map((n) => {
            const active = current.node === n.id;
            return (
              <g key={n.id} transform={`translate(${n.x - 62}, ${n.y - 28})`}>
                {active && (
                  <rect
                    x="-5"
                    y="-5"
                    width="134"
                    height="66"
                    rx="16"
                    fill={n.color}
                    fillOpacity="0.18"
                    className="animate-pulse-ring"
                  />
                )}
                <rect
                  width="124"
                  height="56"
                  rx="12"
                  fill={active ? '#0f172a' : '#0b1120'}
                  stroke={active ? n.color : '#334155'}
                  strokeWidth={active ? 2.5 : 1.2}
                />
                <text
                  x="62"
                  y="24"
                  textAnchor="middle"
                  fill={active ? '#ffffff' : '#cbd5e1'}
                  fontSize="11.5"
                  fontWeight="700"
                >
                  {n.title}
                </text>
                <text
                  x="62"
                  y="41"
                  textAnchor="middle"
                  fill={active ? n.color : '#64748b'}
                  fontSize="9.5"
                  fontWeight="500"
                >
                  {n.subtitle}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Step Card */}
        <motion.div
          key={`${scenarioKey}-${stepIdx}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-4 max-w-3xl rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 font-mono text-[11px] font-bold text-indigo-300">
                STEP {stepIdx + 1}/{scenario.steps.length}
              </span>
              <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[11px] font-semibold text-cyan-300">
                {current.phase}
              </span>
              <span className="text-sm font-bold text-white">{current.label}</span>
            </div>
            <span className="font-mono text-xs text-slate-400">
              Context used: <strong className="text-amber-300">{totalTokens} tokens</strong>
            </span>
          </div>
          <p className="mt-2 font-mono text-xs leading-relaxed text-slate-300 sm:text-sm">
            {current.content}
          </p>
        </motion.div>

        {/* Controls */}
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (stepIdx >= scenario.steps.length - 1) setStepIdx(0);
                setPlaying((p) => !p);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? 'Pause' : stepIdx === scenario.steps.length - 1 ? 'Replay' : 'Play Loop'}
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setStepIdx((prev) => Math.min(prev + 1, scenario.steps.length - 1));
              }}
              disabled={stepIdx >= scenario.steps.length - 1}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-40"
            >
              <StepForward className="h-3.5 w-3.5" />
              Next Step
            </button>
            <button
              onClick={() => {
                setPlaying(false);
                setStepIdx(0);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
          <div className="flex items-center gap-1">
            {scenario.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPlaying(false);
                  setStepIdx(i);
                }}
                aria-label={`Jump to step ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === stepIdx
                    ? 'w-6 bg-indigo-400'
                    : i < stepIdx
                      ? 'w-2 bg-indigo-500/50'
                      : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
