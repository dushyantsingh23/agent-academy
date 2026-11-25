import React, { useState } from 'react';
import {
  Check,
  Copy,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Hash,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeTab, QuizQuestion } from '../types';

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 mt-12 border-b border-stone-200 pb-3 first:mt-0 dark:border-stone-800">
      {eyebrow && (
        <div className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94436] dark:text-[#F06457]">
          {eyebrow}
        </div>
      )}
      <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 sm:text-[1.7rem]">
        <Hash className="h-5 w-5 shrink-0 text-[#D94436]/75 dark:text-[#F06457]/80" />
        <span>{title}</span>
      </h2>
      {description && (
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">
          {description}
        </p>
      )}
    </div>
  );
}

export function Callout({
  type = 'insight',
  title,
  children,
}: {
  type?: 'insight' | 'tip' | 'warning' | 'architecture';
  title: string;
  children: React.ReactNode;
}) {
  const styles = {
    insight: {
      border: 'border-l-[#D94436]',
      bg: 'bg-[#FDF4F3] border-[#F3D7D4] dark:bg-[#2A1615] dark:border-[#4D2421]',
      icon: <Sparkles className="h-4 w-4 text-[#D94436] dark:text-[#F06457]" />,
      titleColor: 'text-[#B83226] dark:text-[#F88B80]',
    },
    tip: {
      border: 'border-l-emerald-600',
      bg: 'bg-emerald-50/70 border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-900/60',
      icon: <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      titleColor: 'text-emerald-800 dark:text-emerald-300',
    },
    warning: {
      border: 'border-l-amber-600',
      bg: 'bg-amber-50/80 border-amber-200/80 dark:bg-amber-950/30 dark:border-amber-900/60',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      titleColor: 'text-amber-900 dark:text-amber-300',
    },
    architecture: {
      border: 'border-l-teal-600',
      bg: 'bg-teal-50/70 border-teal-200/80 dark:bg-teal-950/30 dark:border-teal-900/60',
      icon: <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" />,
      titleColor: 'text-teal-900 dark:text-teal-300',
    },
  }[type];

  return (
    <div className={`my-6 rounded-r-xl border border-l-4 ${styles.border} ${styles.bg} p-5`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{styles.icon}</div>
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-bold tracking-tight ${styles.titleColor}`}>
            {title}
          </h4>
          <div className="mt-1.5 text-[14.5px] leading-relaxed text-stone-700 dark:text-stone-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CodeBlock({
  tabs,
  title,
}: {
  tabs: CodeTab[];
  title?: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = tabs[activeTab] || tabs[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="my-7 overflow-hidden rounded-xl border border-stone-300 bg-[#1E1E1E] shadow-sm dark:border-stone-800">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 bg-[#262626] px-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {title && (
            <span className="py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              {title}
            </span>
          )}
          <div className="flex items-center">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className={`border-b-2 px-3 py-2.5 text-xs font-semibold transition-colors ${
                  idx === activeTab
                    ? 'border-[#D94436] text-white'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="my-1.5 inline-flex items-center gap-1.5 rounded-md border border-stone-700 bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-stone-300 transition hover:border-stone-500 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[13px] leading-relaxed text-stone-200">
          <code>{current.code}</code>
        </pre>
      </div>
    </div>
  );
}

export function ConceptCard({
  icon,
  title,
  badge,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 transition-all hover:border-[#D94436]/55 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FDF2F0] text-[#D94436] dark:bg-[#D94436]/15 dark:text-[#F06457]">
              {icon}
            </div>
          )}
          <h3 className="font-display text-[15px] font-bold text-stone-900 dark:text-stone-50">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="shrink-0 rounded border border-stone-200 bg-stone-100/80 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
            {badge}
          </span>
        )}
      </div>
      <div className="text-[14px] leading-relaxed text-stone-600 dark:text-stone-300">
        {children}
      </div>
    </div>
  );
}

export function ChapterQuiz({
  chapterId,
  questions,
  xpReward,
  badgeName,
  isCompleted,
  onComplete,
}: {
  chapterId: string;
  questions: QuizQuestion[];
  xpReward: number;
  badgeName: string;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
  const passed = submitted && correctCount >= Math.ceil(questions.length * 0.66);

  const handleSubmit = () => {
    setSubmitted(true);
    if (correctCount >= Math.ceil(questions.length * 0.66)) {
      onComplete();
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="my-12 rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] p-6 dark:border-stone-800 dark:bg-stone-900/80 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#D94436]">
            <Award className="h-3.5 w-3.5" />
            Knowledge Check &bull; +{xpReward} XP
          </div>
          <h3 className="mt-1 font-display text-xl font-bold text-stone-900 dark:text-white">
            Verify Your Mastery
          </h3>
        </div>
        {isCompleted && (
          <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Completed
          </div>
        )}
      </div>

      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const selected = answers[q.id];
          return (
            <div
              key={`${chapterId}-${q.id}`}
              className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-950"
            >
              <p className="font-semibold text-stone-900 dark:text-white">
                <span className="mr-2 font-mono text-xs font-bold text-[#D94436]">
                  Q{qIdx + 1}
                </span>
                {q.question}
              </p>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selected === oIdx;
                  const isCorrect = oIdx === q.correctIndex;
                  let optStyle =
                    'border-stone-200 hover:border-[#D94436]/60 dark:border-stone-800';
                  if (submitted) {
                    if (isCorrect) optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200';
                    else if (isSelected && !isCorrect) optStyle = 'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200';
                  } else if (isSelected) {
                    optStyle = 'border-[#D94436] bg-[#FDF2F0] text-stone-950 dark:bg-[#D94436]/15 dark:text-white';
                  }
                  return (
                    <button
                      key={oIdx}
                      disabled={submitted}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                      className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm transition ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                      {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-rose-500" />}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 rounded-lg bg-stone-100 p-3 text-xs leading-relaxed text-stone-700 dark:bg-stone-900 dark:text-stone-300"
                  >
                    <strong className="text-[#D94436]">Explanation: </strong>
                    {q.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        {!submitted ? (
          <button
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="rounded-lg bg-[#D94436] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C0392B] disabled:opacity-40"
          >
            Check Answers
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-stone-900 dark:text-white">
              Score: {correctCount}/{questions.length}{' '}
              {passed ? `— Unlocked "${badgeName}"!` : '— Review & retry'}
            </span>
            {!passed && (
              <button
                onClick={handleReset}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:border-stone-700 dark:text-stone-300"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChapterNavFooter({
  prevTitle,
  nextTitle,
  onPrev,
  onNext,
  isCompleted,
  onMarkComplete,
}: {
  prevTitle?: string;
  nextTitle?: string;
  onPrev?: () => void;
  onNext?: () => void;
  isCompleted: boolean;
  onMarkComplete: () => void;
}) {
  return (
    <div className="mt-14 border-t border-[#E5DFD3] pt-8 dark:border-stone-800">
      <div className="mb-6 flex items-center justify-between">
        <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
          Finished reading this chapter?
        </span>
        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Marked as Read
          </span>
        ) : (
          <button
            onClick={onMarkComplete}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-[#FFFDF9] px-3.5 py-1.5 text-xs font-semibold text-stone-800 transition hover:border-[#D94436] hover:text-[#D94436] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Chapter Read
          </button>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          {onPrev && prevTitle && (
            <button
              onClick={onPrev}
              className="group flex w-full items-center gap-3 rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] px-5 py-4 text-left transition hover:border-[#D94436] dark:border-stone-800 dark:bg-stone-900/70"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-stone-400 transition group-hover:-translate-x-0.5 group-hover:text-[#D94436]" />
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  Previous
                </div>
                <div className="truncate font-display text-sm font-bold text-stone-900 group-hover:text-[#D94436] dark:text-stone-100">
                  {prevTitle}
                </div>
              </div>
            </button>
          )}
        </div>

        <div>
          {onNext && nextTitle && (
            <button
              onClick={onNext}
              className="group flex w-full items-center justify-end gap-3 rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] px-5 py-4 text-right transition hover:border-[#D94436] dark:border-stone-800 dark:bg-stone-900/70"
            >
              <div className="min-w-0">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  Next
                </div>
                <div className="truncate font-display text-sm font-bold text-stone-900 group-hover:text-[#D94436] dark:text-stone-100">
                  {nextTitle}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-[#D94436]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
