import React, { useState, useMemo } from 'react';
import { Award, CheckCircle2, RotateCcw, Shuffle, XCircle } from 'lucide-react';
import { QUIZ_TOPICS } from '../data/quizBank';
import { QuizQuestion } from '../types';

interface FlatQuestion extends QuizQuestion {
  key: string;
  chapterNum: number;
  topic: string;
}

export function Chapter17MasteryQuiz({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [mode, setMode] = useState<'quick10' | 'all' | string>('quick10');
  const [shuffleSeed, setShuffleSeed] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const allFlat: FlatQuestion[] = useMemo(
    () =>
      QUIZ_TOPICS.flatMap((t) =>
        t.questions.map((q) => ({
          ...q,
          key: `${t.id}-${q.id}`,
          chapterNum: t.chapterNum,
          topic: t.topic,
        }))
      ),
    []
  );

  const activeQuestions: FlatQuestion[] = useMemo(() => {
    if (mode === 'all') return allFlat;
    if (mode === 'quick10') {
      // Deterministic pseudo-shuffle based on shuffleSeed
      const copy = [...allFlat];
      let seed = shuffleSeed * 9301 + 49297;
      for (let i = copy.length - 1; i > 0; i--) {
        seed = (seed * 9301 + 49297) % 233280;
        const j = seed % (i + 1);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, 10);
    }
    return allFlat.filter((q) => q.key.startsWith(`${mode}-`));
  }, [mode, allFlat, shuffleSeed]);

  const answeredCount = activeQuestions.filter(
    (q) => selectedAnswers[q.key] !== undefined
  ).length;
  const correctCount = activeQuestions.filter(
    (q) => selectedAnswers[q.key] === q.correctIndex
  ).length;
  const pct =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const handleSelect = (qKey: string, optionIdx: number) => {
    if (selectedAnswers[qKey] !== undefined) return;
    const next = { ...selectedAnswers, [qKey]: optionIdx };
    setSelectedAnswers(next);

    // Check if user just completed the active set with >= 70% accuracy
    const nowAnswered = activeQuestions.filter((q) => next[q.key] !== undefined).length;
    const nowCorrect = activeQuestions.filter((q) => next[q.key] === q.correctIndex).length;
    if (
      nowAnswered === activeQuestions.length &&
      nowAnswered >= 3 &&
      nowCorrect / nowAnswered >= 0.7 &&
      !isCompleted
    ) {
      onComplete();
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
  };

  const handleNewRandom10 = () => {
    setMode('quick10');
    setSelectedAnswers({});
    setShuffleSeed((s) => s + 1);
  };

  return (
    <div className="space-y-8">
      {/* Sticky Score & Filter Controls */}
      <div className="rounded-2xl border border-stone-300/80 bg-[#FFFDF7] p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              {allFlat.length} Questions Across {QUIZ_TOPICS.length} Chapters
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-stone-950 dark:text-stone-50">
              Test Your AI Agent Mastery
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-lg border border-stone-300/80 bg-[#F4ECDB]/70 px-3 py-1.5 font-mono text-xs text-stone-800 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200">
              Score:{' '}
              <strong>
                {correctCount}/{answeredCount}
              </strong>{' '}
              {answeredCount > 0 && <span className="text-amber-700 dark:text-amber-400">({pct}%)</span>}
            </div>
            <button
              onClick={handleNewRandom10}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              <Shuffle className="h-3.5 w-3.5" /> New 10-Q Mix
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Mode & Chapter Filter Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-stone-200/80 pt-4 dark:border-stone-800">
          <button
            onClick={() => {
              setMode('quick10');
              setSelectedAnswers({});
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              mode === 'quick10'
                ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-amber-400 dark:bg-amber-400 dark:text-stone-950'
                : 'border-stone-300/80 bg-white text-stone-600 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300'
            }`}
          >
            Quick 10-Question Exam
          </button>
          <button
            onClick={() => {
              setMode('all');
              setSelectedAnswers({});
            }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              mode === 'all'
                ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-amber-400 dark:bg-amber-400 dark:text-stone-950'
                : 'border-stone-300/80 bg-white text-stone-600 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300'
            }`}
          >
            All {allFlat.length} Questions
          </button>
          {QUIZ_TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setMode(t.id);
                setSelectedAnswers({});
              }}
              className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-medium transition ${
                mode === t.id
                  ? 'border-amber-600 bg-amber-600/15 text-amber-900 dark:border-amber-400 dark:text-amber-300'
                  : 'border-stone-200 bg-[#FAF5E8]/60 text-stone-600 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-400'
              }`}
            >
              {String(t.chapterNum).padStart(2, '0')} · {t.topic.split('&')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {activeQuestions.map((q, idx) => {
          const picked = selectedAnswers[q.key];
          const isAnswered = picked !== undefined;
          return (
            <div
              key={q.key}
              className="rounded-2xl border border-stone-300/80 bg-[#FFFDF7] p-5 dark:border-stone-800 dark:bg-stone-900/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  Question {idx + 1} of {activeQuestions.length}
                </span>
                <span>
                  Ch {String(q.chapterNum).padStart(2, '0')} · {q.topic}
                </span>
              </div>

              <p className="mt-2 text-[15px] font-semibold leading-snug text-stone-950 dark:text-stone-50">
                {q.question}
              </p>

              <div className="mt-3.5 grid gap-2">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctIndex;
                  const isPicked = picked === oIdx;

                  let style =
                    'border-stone-200 bg-white text-stone-800 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-200 dark:hover:border-stone-600';
                  if (isAnswered) {
                    if (isCorrect) {
                      style =
                        'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200';
                    } else if (isPicked && !isCorrect) {
                      style =
                        'border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200';
                    } else {
                      style =
                        'border-stone-200/70 bg-white/50 text-stone-400 dark:border-stone-800/60 dark:bg-stone-950/40 dark:text-stone-500';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelect(q.key, oIdx)}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${style}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {isAnswered && isPicked && !isCorrect && (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-3 rounded-xl border border-stone-200/80 bg-[#F4ECDB]/60 p-3 text-xs leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-950/70 dark:text-stone-300">
                  <strong className="text-amber-800 dark:text-amber-400">Explanation: </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {answeredCount === activeQuestions.length && activeQuestions.length > 0 && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
          <Award className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          <h3 className="mt-2 font-display text-xl font-bold text-stone-950 dark:text-white">
            Quiz Complete — {correctCount} / {activeQuestions.length} ({pct}%)
          </h3>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            {pct >= 70
              ? 'Outstanding! You have verified your mastery of AI Agent Engineering.'
              : 'Review the explanations above and try another 10-question mix to lock in the concepts.'}
          </p>
        </div>
      )}
    </div>
  );
}
