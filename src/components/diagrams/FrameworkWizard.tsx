import React, { useState } from 'react';
import { Compass, Sparkles, CheckCircle2 } from 'lucide-react';

interface Recommendation {
  name: string;
  score: number;
  why: string;
  bestFor: string;
}

export function FrameworkWizard() {
  const [lang, setLang] = useState<'python' | 'typescript' | 'java-go'>('python');
  const [control, setControl] = useState<'high' | 'balanced' | 'fast'>('balanced');
  const [cloud, setCloud] = useState<'gcp' | 'aws' | 'agnostic'>('gcp');
  const [pattern, setPattern] = useState<'multi' | 'single' | 'rag' | 'code'>('multi');

  const getRecommendations = (): Recommendation[] => {
    const scores: Record<string, { score: number; why: string; bestFor: string }> = {
      'Google ADK': {
        score: 70,
        why: 'Native multi-agent primitives (Sequential, Parallel, Loop), built-in MCP & A2A, seamless deploy to Vertex AI Agent Engine or Cloud Run.',
        bestFor: 'Production multi-agent apps, GCP deployments, Python/Java/Go teams.',
      },
      LangGraph: {
        score: 72,
        why: 'Explicit cyclic state graphs with built-in checkpointing, time-travel debugging, and fine-grained human-in-the-loop interrupts.',
        bestFor: 'Complex stateful workflows requiring deterministic graph control.',
      },
      CrewAI: {
        score: 64,
        why: 'Intuitive role-based agents ("Researcher", "Writer") + deterministic Flows for rapid prototyping and business automation.',
        bestFor: 'Fast role-based multi-agent MVPs and content/ops pipelines.',
      },
      'OpenAI Agents SDK': {
        score: 66,
        why: 'Ultra-lightweight Python/TS primitives: Agents, Handoffs, Guardrails, and built-in tracing with minimal abstraction overhead.',
        bestFor: 'Clean handoff swarms and rapid production single/multi-agent apps.',
      },
      PydanticAI: {
        score: 65,
        why: 'FastAPI-style ergonomics with strict Pydantic structured outputs, dependency injection, and model-agnostic provider support.',
        bestFor: 'Type-safe Python backend engineers who want zero magic.',
      },
      'Vercel AI SDK / Mastra': {
        score: 60,
        why: 'First-class TypeScript streaming, Generative UI hooks, tool calling, and workflow graphs built for modern web apps.',
        bestFor: 'Full-stack TypeScript/Next.js teams building interactive agent UIs.',
      },
      'LlamaIndex Workflows': {
        score: 62,
        why: 'Event-driven async workflows paired with the richest document ingestion, hybrid indexing, and enterprise RAG ecosystem.',
        bestFor: 'Document-heavy knowledge agents and complex RAG pipelines.',
      },
      Smolagents: {
        score: 58,
        why: 'Minimalist Hugging Face library centered on CodeAgent — agents write and execute Python directly instead of verbose JSON tool calls.',
        bestFor: 'Data analysis, math, and CodeAct-first research prototypes.',
      },
      'AWS Strands Agents': {
        score: 56,
        why: 'Model-driven SDK with native Amazon Bedrock integration, MCP support, and lightweight agent loop.',
        bestFor: 'AWS Bedrock-native enterprise workloads.',
      },
    };

    if (lang === 'typescript') {
      scores['Vercel AI SDK / Mastra'].score += 32;
      scores['LangGraph'].score += 14;
      scores['OpenAI Agents SDK'].score += 12;
      scores['Google ADK'].score -= 10;
    } else if (lang === 'java-go') {
      scores['Google ADK'].score += 28;
      scores['LangGraph'].score -= 18;
      scores['CrewAI'].score -= 20;
    } else {
      scores['PydanticAI'].score += 10;
      scores['Google ADK'].score += 10;
      scores['LangGraph'].score += 10;
    }

    if (control === 'high') {
      scores['LangGraph'].score += 20;
      scores['PydanticAI'].score += 14;
      scores['Google ADK'].score += 12;
    } else if (control === 'fast') {
      scores['CrewAI'].score += 20;
      scores['OpenAI Agents SDK'].score += 16;
      scores['Smolagents'].score += 14;
    } else {
      scores['Google ADK'].score += 14;
      scores['OpenAI Agents SDK'].score += 12;
    }

    if (cloud === 'gcp') {
      scores['Google ADK'].score += 22;
    } else if (cloud === 'aws') {
      scores['AWS Strands Agents'].score += 28;
    } else {
      scores['LangGraph'].score += 10;
      scores['PydanticAI'].score += 10;
    }

    if (pattern === 'multi') {
      scores['Google ADK'].score += 12;
      scores['LangGraph'].score += 12;
      scores['CrewAI'].score += 10;
    } else if (pattern === 'rag') {
      scores['LlamaIndex Workflows'].score += 28;
    } else if (pattern === 'code') {
      scores['Smolagents'].score += 28;
    } else {
      scores['PydanticAI'].score += 14;
      scores['OpenAI Agents SDK'].score += 14;
    }

    return Object.entries(scores)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const top3 = getRecommendations();

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-sky-400">
          <Compass className="h-3.5 w-3.5" /> Interactive Decision Wizard
        </span>
        <h3 className="font-display text-lg font-bold text-white">
          Which Agent Framework Should You Pick?
        </h3>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-12 sm:p-6">
        <div className="space-y-4 lg:col-span-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              1. Primary Language
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ['python', 'Python'],
                  ['typescript', 'TypeScript / JS'],
                  ['java-go', 'Java / Go'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setLang(k)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    lang === k
                      ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Control vs. Speed
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ['high', 'Strict Graph Control'],
                  ['balanced', 'Balanced Prod'],
                  ['fast', 'Rapid Prototype'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setControl(k)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    control === k
                      ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              3. Deployment Target
            </label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ['gcp', 'Google Cloud'],
                  ['aws', 'AWS Bedrock'],
                  ['agnostic', 'Cloud Agnostic'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setCloud(k)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    cloud === k
                      ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              4. Primary Workload
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  ['multi', 'Multi-Agent Orchestration'],
                  ['single', 'Single Tool-Using Agent'],
                  ['rag', 'Heavy Document RAG'],
                  ['code', 'CodeAct / Data Analysis'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setPattern(k)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    pattern === k
                      ? 'border-sky-400 bg-sky-500/15 text-sky-200'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3 lg:col-span-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Sparkles className="h-4 w-4" /> Top Tailored Matches
          </div>
          {top3.map((rec, i) => (
            <div
              key={rec.name}
              className={`rounded-2xl border p-4 transition ${
                i === 0
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold ${
                      i === 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <h4 className="font-display text-base font-bold text-white">{rec.name}</h4>
                </div>
                {i === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Best Fit
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{rec.why}</p>
              <p className="mt-1.5 text-[11px] text-slate-400">
                <strong className="text-slate-200">Ideal for:</strong> {rec.bestFor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
