import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { CURRICULUM_PARTS } from '../App';
import { ChapterId } from '../types';

export function HomePage({
  completedIds,
  onSelectChapter,
}: {
  completedIds: string[];
  earnedXp: number;
  onSelectChapter: (id: ChapterId) => void;
}) {
  const ordered = [...CHAPTERS].sort((a, b) => a.number - b.number);
  const nextChapter = ordered.find((c) => !completedIds.includes(c.id)) || ordered[0];

  const paths: { who: string; start: string; id: ChapterId; detail: string }[] = [
    { who: 'New to AI?', start: 'Start at Chapter 1', id: 'ch0-llm-basics', detail: 'Learn what an LLM, a token and training really are — no maths required.' },
    { who: 'Already call LLM APIs?', start: 'Jump to Chapter 3', id: 'ch1-foundations', detail: 'Build an agent loop from scratch, then add memory, tools and MCP.' },
    { who: 'Shipping to production?', start: 'Go to Chapter 14', id: 'ch9-evals-safety', detail: 'Evals, security, testing, scaling and deployment playbooks.' },
    { who: 'Preparing for interviews?', start: 'Go to Chapter 20', id: 'ch13-interview-prep', detail: 'Concept questions, system design drills and real case studies.' },
  ];

  return (
    <div className="space-y-12 pb-12">
      <section className="rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] p-7 dark:border-stone-800 dark:bg-stone-900/70 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#D94436]">The illustrated AI agent handbook</div>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-stone-950 dark:text-white sm:text-[2.6rem]">
              Learn AI Agents End to End — From Tokens to Production
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-300">
              A free, interactive handbook for software engineers. Start with how LLMs actually work, build an agent
              step by step, then learn to deploy, test and scale it — with real company case studies, the key
              research papers and interview preparation along the way.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectChapter(nextChapter.id)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D94436] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#C0392B]"
              >
                {completedIds.length > 0 ? `Continue: ${nextChapter.shortTitle}` : 'Start Chapter 1'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onSelectChapter('ch-companies-case-studies')}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E5DFD3] bg-[#FAF7F0] px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-[#D94436] hover:text-[#D94436] dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200"
              >
                Case Studies
              </button>
              <button
                onClick={() => onSelectChapter('ch13-interview-prep')}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E5DFD3] bg-[#FAF7F0] px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-[#D94436] hover:text-[#D94436] dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200"
              >
                Interview Prep
              </button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-stone-500 dark:text-stone-400">
              <span>{CHAPTERS.length} chapters</span>
              <span>20+ interactive labs</span>
              <span>Real case studies</span>
              <span>100+ curated links</span>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <svg viewBox="0 0 320 240" fill="none" className="w-full max-w-[320px] select-none" aria-label="Learning path">
              <rect x="8" y="8" width="304" height="224" rx="14" fill="#FAF7F0" stroke="#E5DFD3" strokeWidth="1.5" />
              {[
                ['LLM BASICS', 22, '#FFFDF9', '#1F2937'],
                ['ONE AGENT', 56, '#FFFDF9', '#1F2937'],
                ['MODELS & TRAINING', 90, '#FFFDF9', '#0D9488'],
                ['MULTI-AGENT & CLOUD', 124, '#FFFDF9', '#0D9488'],
                ['PRODUCTION', 158, '#1F2937', '#1F2937'],
                ['REAL WORLD & INTERVIEWS', 192, '#D94436', '#D94436'],
              ].map(([label, y, fill, stroke], i) => (
                <g key={label as string}>
                  <rect x={30 + i * 12} y={y as number} width={260 - i * 24} height="26" rx="6" fill={fill as string} stroke={stroke as string} strokeWidth="1.6" />
                  <text
                    x="160"
                    y={(y as number) + 17}
                    textAnchor="middle"
                    fill={i >= 4 ? '#FFFDF9' : (stroke as string)}
                    fontSize="9.5"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {label as string}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-[#E5DFD3] pb-2.5 font-display text-lg font-extrabold text-stone-900 dark:border-stone-800 dark:text-white">
          Where should you start?
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map((p) => (
            <button
              key={p.who}
              onClick={() => onSelectChapter(p.id)}
              className="group rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-4 text-left transition hover:border-[#D94436] dark:border-stone-800 dark:bg-stone-900/70"
            >
              <div className="text-sm font-bold text-stone-900 dark:text-white">{p.who}</div>
              <div className="mt-0.5 font-mono text-xs font-semibold text-[#D94436]">{p.start} →</div>
              <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-400">{p.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-10">
        {CURRICULUM_PARTS.map((part) => {
          const partChapters = part.chapterNumbers.map((num) => CHAPTERS.find((c) => c.number === num)!).filter(Boolean);
          return (
            <section key={part.label}>
              <div className="mb-4 flex items-center justify-between border-b border-[#E5DFD3] pb-2.5 dark:border-stone-800">
                <h2 className="font-display text-lg font-extrabold tracking-tight text-stone-900 dark:text-white">{part.label}</h2>
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-400">
                  <BookOpen className="h-3.5 w-3.5" /> {partChapters.length} chapters
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {partChapters.map((ch) => {
                  const done = completedIds.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => onSelectChapter(ch.id)}
                      className="group flex flex-col justify-between rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 text-left transition-all hover:border-[#D94436] hover:shadow-sm dark:border-stone-800 dark:bg-stone-900/70"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold text-[#D94436]">CHAPTER {String(ch.number).padStart(2, '0')}</span>
                          <div className="flex items-center gap-2 font-mono text-[11px] text-stone-400">
                            <span>{ch.duration}</span>
                            {done && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                          </div>
                        </div>
                        <h3 className="mt-2 font-display text-[17px] font-bold text-stone-900 transition group-hover:text-[#D94436] dark:text-stone-50">{ch.title}</h3>
                        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-stone-600 dark:text-stone-400">{ch.subtitle}</p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-stone-200/70 pt-3 font-mono text-[11px] text-stone-500 dark:border-stone-800">
                        <span>{ch.difficulty}</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-[#D94436] opacity-80 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                          Read <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
