import React, { useState } from 'react';
import { Radio, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const A2A_STEPS = [
  {
    phase: '1. Discovery',
    state: 'discover',
    direction: 'client-to-remote' as const,
    endpoint: 'GET https://travel-agent.acme.com/.well-known/agent-card.json',
    summary: "The Client Agent downloads the Remote Agent's public Agent Card to learn what it can do (skills), where to send requests, whether it streams, and how to authenticate.",
    payload: `{
  "protocolVersion": "0.3.0",
  "name": "Acme Enterprise Travel Agent",
  "description": "Books corporate flights within travel policy.",
  "url": "https://travel-agent.acme.com/a2a",
  "version": "1.2.0",
  "capabilities": { "streaming": true, "pushNotifications": true },
  "securitySchemes": { "bearer": { "type": "http", "scheme": "bearer" } },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain", "application/json"],
  "skills": [
    { "id": "book_flight", "name": "Corporate Flight Booking", "tags": ["travel", "expense"] }
  ]
}`,
  },
  {
    phase: '2. Send Message',
    state: 'submitted',
    direction: 'client-to-remote' as const,
    endpoint: 'POST /a2a  (JSON-RPC method: message/stream)',
    summary: 'The Client Agent sends a message and keeps a Server-Sent Events (SSE) stream open. The Remote Agent creates a Task with a unique id to track the work.',
    payload: `{
  "jsonrpc": "2.0",
  "id": "req-901",
  "method": "message/stream",
  "params": {
    "message": {
      "messageId": "msg-001",
      "role": "user",
      "parts": [{ "kind": "text", "text": "Book round-trip SFO->LON Oct 12-16, policy tier B." }]
    }
  }
}`,
  },
  {
    phase: '3. Input Required',
    state: 'input-required',
    direction: 'remote-to-client' as const,
    endpoint: 'SSE event: status-update',
    summary: 'The Remote Agent streams progress, then pauses in the input-required state: the best fare is $120 over the policy cap, so it needs manager approval before booking.',
    payload: `{
  "kind": "status-update",
  "taskId": "task-44f9",
  "contextId": "ctx-7a1",
  "status": {
    "state": "input-required",
    "message": {
      "role": "agent",
      "parts": [{ "kind": "text", "text": "BA284 costs $1,420 ($120 above Tier B cap). Provide manager approval?" }]
    }
  },
  "final": false
}`,
  },
  {
    phase: '4. Resume & Artifact',
    state: 'completed',
    direction: 'remote-to-client' as const,
    endpoint: 'SSE events: artifact-update → status-update (completed)',
    summary: 'The Client Agent replies with the approval on the same task. The Remote Agent books the flight and returns a typed Artifact with the booking data.',
    payload: `{
  "kind": "task",
  "id": "task-44f9",
  "contextId": "ctx-7a1",
  "status": { "state": "completed" },
  "artifacts": [
    {
      "artifactId": "art-1",
      "name": "flight_itinerary",
      "parts": [
        { "kind": "data", "data": { "pnr": "X9K4LP", "carrier": "BA284", "totalUsd": 1420 } }
      ]
    }
  ]
}`,
  },
];

export function A2AProtocolSimulator() {
  const [idx, setIdx] = useState(0);
  const current = A2A_STEPS[idx];

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-cyan-400">
            <Radio className="h-3.5 w-3.5" /> Interactive A2A Sequence Animator
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            Agent-to-Agent (A2A) Protocol Task Lifecycle
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {A2A_STEPS.map((s, i) => (
            <button
              key={s.phase}
              onClick={() => setIdx(i)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                idx === i
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {s.phase}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <svg viewBox="0 0 640 120" className="mx-auto w-full max-w-3xl select-none">
          <defs>
            <marker id="a2a-fwd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#22d3ee" />
            </marker>
            <marker id="a2a-rev" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#a78bfa" />
            </marker>
          </defs>

          <rect x="12" y="18" width="175" height="84" rx="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="99" y="47" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="700">
            CLIENT AGENT
          </text>
          <text x="99" y="67" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">
            Executive Assistant
          </text>
          <text x="99" y="84" textAnchor="middle" fill="#94a3b8" fontSize="9.5">
            (Google ADK / LangGraph)
          </text>

          {current.direction === 'client-to-remote' ? (
            <path
              d="M 192 60 L 444 60"
              stroke="#22d3ee"
              strokeWidth="2.5"
              className="animate-dash-flow"
              markerEnd="url(#a2a-fwd)"
            />
          ) : (
            <path
              d="M 448 60 L 196 60"
              stroke="#a78bfa"
              strokeWidth="2.5"
              className="animate-dash-flow"
              markerEnd="url(#a2a-rev)"
            />
          )}

          <rect x="245" y="34" width="150" height="20" rx="5" fill="#1e293b" stroke="#334155" />
          <text x="320" y="47" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="monospace" fontWeight="700">
            state: {current.state}
          </text>

          <rect x="453" y="18" width="175" height="84" rx="14" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1.8" />
          <text x="540" y="47" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontWeight="700">
            REMOTE AGENT
          </text>
          <text x="540" y="67" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">
            Acme Travel Agent
          </text>
          <text x="540" y="84" textAnchor="middle" fill="#94a3b8" fontSize="9.5">
            (Any Vendor / Cloud)
          </text>
        </svg>

        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              {current.endpoint}
            </span>
            <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-300">
              {current.state}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">{current.summary}</p>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11.5px] leading-relaxed text-slate-200">
            <code>{current.payload}</code>
          </pre>
        </motion.div>
      </div>
    </div>
  );
}
