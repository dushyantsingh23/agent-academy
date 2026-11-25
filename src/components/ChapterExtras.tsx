import React from 'react';
import { BookOpen, CheckCircle2, ExternalLink, Lightbulb, Building2 } from 'lucide-react';
import { CHAPTER_EXTRAS, ReadingType } from '../data/chapterExtras';

const TYPE_STYLES: Record<ReadingType, string> = {
  Blog: 'bg-[#FDF2F0] text-[#B83226] dark:bg-[#D94436]/15 dark:text-[#F88B80]',
  Docs: 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300',
  Paper: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300',
  Video: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  Interactive: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
  Book: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  Guide: 'bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
};

export function ChapterTldr({ id }: { id: string }) {
  const extras = CHAPTER_EXTRAS[id];
  if (!extras) return null;
  return (
    <div className="mb-10 rounded-r-xl border border-l-4 border-[#F3D7D4] border-l-[#D94436] bg-[#FDF4F3] p-5 dark:border-[#4D2421] dark:border-l-[#F06457] dark:bg-[#2A1615]">
      <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-widest text-[#B83226] dark:text-[#F88B80]">
        <Lightbulb className="h-4 w-4" /> In plain English
      </div>
      <p className="mt-2 text-[15.5px] leading-relaxed text-stone-800 dark:text-stone-200">{extras.tldr}</p>
    </div>
  );
}

export function ChapterExtrasBottom({ id }: { id: string }) {
  const extras = CHAPTER_EXTRAS[id];
  if (!extras) return null;
  const { caseStudies = [], takeaways, reading = [] } = extras;
  if (!caseStudies.length && !takeaways.length && !reading.length) return null;

  return (
    <div className="mt-14 space-y-10">
      {caseStudies.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 border-b border-stone-200 pb-3 font-display text-xl font-extrabold text-stone-900 dark:border-stone-800 dark:text-stone-50">
            <Building2 className="h-5 w-5 text-[#D94436]" /> Real-world case {caseStudies.length > 1 ? 'studies' : 'study'}
          </h2>
          <div className="mt-4 space-y-4">
            {caseStudies.map((c) => (
              <article key={c.title} className="rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 dark:border-stone-800 dark:bg-stone-900/70">
                <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#D94436]">{c.org}</div>
                <h3 className="mt-1 font-display text-base font-bold text-stone-950 dark:text-white">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">{c.summary}</p>
                <p className="mt-2 text-sm text-stone-900 dark:text-stone-100">
                  <strong className="text-[#B83226] dark:text-[#F88B80]">Lesson for builders: </strong>
                  {c.lesson}
                </p>
                {c.url && (
                  <a href={c.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#D94436] hover:underline">
                    Read the original <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {takeaways.length > 0 && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-stone-900 dark:text-stone-50">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> Key takeaways
          </h2>
          <ul className="mt-3 space-y-2">
            {takeaways.map((t) => (
              <li key={t} className="flex gap-2 text-sm leading-relaxed text-stone-800 dark:text-stone-200">
                <span className="mt-0.5 font-mono text-emerald-600 dark:text-emerald-400">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {reading.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 border-b border-stone-200 pb-3 font-display text-xl font-extrabold text-stone-900 dark:border-stone-800 dark:text-stone-50">
            <BookOpen className="h-5 w-5 text-[#D94436]" /> Further reading
          </h2>
          <ul className="mt-3 divide-y divide-[#E5DFD3] dark:divide-stone-800">
            {reading.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`w-[78px] shrink-0 rounded px-2 py-0.5 text-center font-mono text-[10px] font-bold uppercase ${TYPE_STYLES[r.type]}`}>{r.type}</span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-stone-900 group-hover:text-[#D94436] dark:text-stone-100">{r.title}</div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">{r.source}</div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-stone-400 group-hover:text-[#D94436]" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
