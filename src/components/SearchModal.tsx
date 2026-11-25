import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { ChapterId } from '../types';

export function SearchModal({
  isOpen,
  onClose,
  onSelectChapter,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (id: ChapterId) => void;
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const sorted = [...CHAPTERS].sort((a, b) => a.number - b.number);
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        ch.subtitle.toLowerCase().includes(q) ||
        ch.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-stone-950/40 p-4 pt-20 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] shadow-2xl dark:border-stone-700 dark:bg-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[#E5DFD3] px-4 py-3.5 dark:border-stone-800">
          <Search className="h-5 w-5 text-[#D94436]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: tokens, RAG, MCP, A2A, GCP, testing, Cursor, interview…"
            className="flex-1 bg-transparent text-sm text-stone-900 placeholder-stone-400 outline-none dark:text-white"
          />
          <button onClick={onClose} className="rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white" aria-label="Close search">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-500">No chapters match &ldquo;{query}&rdquo;.</div>
          ) : (
            results.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  onSelectChapter(ch.id);
                  onClose();
                  setQuery('');
                }}
                className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-[#FDF2F0] dark:hover:bg-stone-800"
              >
                <span className="mt-0.5 w-7 shrink-0 font-mono text-xs font-bold text-[#D94436]">{String(ch.number).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-stone-900 dark:text-white">{ch.title}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-stone-400" />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-stone-500 dark:text-stone-400">{ch.subtitle}</p>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t border-[#E5DFD3] bg-[#FAF7F0] px-4 py-2 text-[11px] text-stone-500 dark:border-stone-800 dark:bg-stone-950/60">
          <span>{CHAPTERS.length} chapters</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
