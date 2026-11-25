import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CHAPTERS } from './data/chapters';
import { ChapterId, ChapterMeta } from './types';
import { HomePage } from './components/HomePage';
import { SearchModal } from './components/SearchModal';
import { ChapterNavFooter } from './components/UI';
import { ChapterIllustration } from './components/ChapterIllustration';
import { Chapter1Foundations } from './chapters/Chapter1Foundations';
import { Chapter2ReasoningMemory } from './chapters/Chapter2ReasoningMemory';
import { Chapter3ToolsMcpCli } from './chapters/Chapter3ToolsMcpCli';
import { Chapter4ModelsTokensTraining } from './chapters/Chapter4ModelsTokensTraining';
import { Chapter5Frameworks } from './chapters/Chapter5Frameworks';
import { Chapter6MultiAgent } from './chapters/Chapter6MultiAgent';
import { Chapter7A2AProtocols } from './chapters/Chapter7A2AProtocols';
import { Chapter8GcpAgents } from './chapters/Chapter8GcpAgents';
import { Chapter9EvalsSafety } from './chapters/Chapter9EvalsSafety';
import { Chapter10TestingAgents } from './chapters/Chapter10TestingAgents';
import { Chapter11ScalingAgents } from './chapters/Chapter11ScalingAgents';
import { Chapter10ProductionBlueprints } from './chapters/Chapter10ProductionBlueprints';
import { Chapter13InterviewPrep } from './chapters/Chapter13InterviewPrep';
import { Chapter14OpenModelsRouters } from './chapters/Chapter14OpenModelsRouters';
import { Chapter15TrainingMlops } from './chapters/Chapter15TrainingMlops';
import { Chapter16MustReadPapers } from './chapters/Chapter16MustReadPapers';
import { Chapter17MasteryQuiz } from './chapters/Chapter17MasteryQuiz';
import { ChapterLLMBasics } from './chapters/ChapterLLMBasics';
import { ChapterPromptingApis } from './chapters/ChapterPromptingApis';
import { ChapterCompanies } from './chapters/ChapterCompanies';
import { ChapterOwnModel } from './chapters/ChapterOwnModel';
import { ChapterStayCurrent } from './chapters/ChapterStayCurrent';
import { ChapterTldr, ChapterExtrasBottom } from './components/ChapterExtras';

const STORAGE_KEY = 'agentcraft_completed_chapters_v1';

export const CURRICULUM_PARTS: {
  label: string;
  chapterNumbers: number[];
}[] = [
  { label: 'I. AI Fundamentals', chapterNumbers: [1, 2] },
  { label: 'II. Agent Foundations', chapterNumbers: [3, 4, 5] },
  { label: 'III. Models, Training & Frameworks', chapterNumbers: [6, 7, 8, 9, 10] },
  { label: 'IV. Multi-Agent, A2A & Cloud', chapterNumbers: [11, 12, 13] },
  { label: 'V. Production: Safety, Testing, Scale', chapterNumbers: [14, 15, 16, 17] },
  { label: 'VI. Real World, Research & Interviews', chapterNumbers: [18, 19, 20, 21, 22] },
];

function BrandEmblem() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7 shrink-0" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#D94436" />
      <path
        d="M9.5 22.5L16 7.5L22.5 22.5"
        stroke="#FFFDF9"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17.5H20" stroke="#FFFDF9" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="16" cy="7.5" r="1.8" fill="#1F2937" />
    </svg>
  );
}

function ComplexityDots({ level }: { level: ChapterMeta['difficulty'] }) {
  const filled =
    level === 'Beginner' ? 1 : level === 'Intermediate' ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1" title={`Complexity: ${level}`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`h-2 w-2 rounded-full ${
            n <= filled
              ? 'bg-[#D94436]'
              : 'bg-stone-300 dark:bg-stone-700'
          }`}
        />
      ))}
    </span>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState<ChapterId>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
    } catch {
      // ignore
    }
  }, [completedIds]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setReadProgress(0);
        return;
      }
      setReadProgress(Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const selectChapter = (id: ChapterId) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markComplete = (id: string) => {
    setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const earnedXp = useMemo(
    () =>
      CHAPTERS.filter((c) => completedIds.includes(c.id)).reduce(
        (sum, c) => sum + c.xp,
        0
      ),
    [completedIds]
  );

  // Ordered sequence matching the 5-Part Catalog
  const orderedChapters = useMemo(() => {
    const byNum = new Map(CHAPTERS.map((c) => [c.number, c]));
    return CURRICULUM_PARTS.flatMap((p) =>
      p.chapterNumbers.map((n) => byNum.get(n)!).filter(Boolean)
    );
  }, []);

  const currentIdx = orderedChapters.findIndex((c) => c.id === activeId);
  const currentChapter = currentIdx >= 0 ? orderedChapters[currentIdx] : null;
  const currentPart = currentChapter
    ? CURRICULUM_PARTS.find((p) => p.chapterNumbers.includes(currentChapter.number))
    : null;
  const prevChapter = currentIdx > 0 ? orderedChapters[currentIdx - 1] : null;
  const nextChapter =
    currentIdx >= 0 && currentIdx < orderedChapters.length - 1
      ? orderedChapters[currentIdx + 1]
      : null;

  const renderChapter = () => {
    const isCompleted = currentChapter
      ? completedIds.includes(currentChapter.id)
      : false;
    const onComplete = () => currentChapter && markComplete(currentChapter.id);

    switch (activeId) {
      case 'ch1-foundations':
        return <Chapter1Foundations isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch2-reasoning-memory':
        return <Chapter2ReasoningMemory isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch3-tools-mcp-cli':
        return <Chapter3ToolsMcpCli isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch4-models-tokens-training':
        return <Chapter4ModelsTokensTraining isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch5-frameworks':
        return <Chapter5Frameworks isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch6-multi-agent':
        return <Chapter6MultiAgent isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch7-a2a-protocols':
        return <Chapter7A2AProtocols isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch8-gcp-agents':
        return <Chapter8GcpAgents isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch9-evals-safety':
        return <Chapter9EvalsSafety isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch10-testing-agents':
        return <Chapter10TestingAgents isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch11-scaling-agents':
        return <Chapter11ScalingAgents isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch10-production-blueprints':
        return <Chapter10ProductionBlueprints isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch13-interview-prep':
        return <Chapter13InterviewPrep isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch14-open-models-routers':
        return <Chapter14OpenModelsRouters isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch15-training-mlops':
        return <Chapter15TrainingMlops isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch16-must-read-papers':
        return <Chapter16MustReadPapers isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch17-mastery-quiz':
        return <Chapter17MasteryQuiz isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch0-llm-basics':
        return <ChapterLLMBasics isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch0-prompting-apis':
        return <ChapterPromptingApis isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch-own-model-gpus':
        return <ChapterOwnModel isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch-stay-current':
        return <ChapterStayCurrent isCompleted={isCompleted} onComplete={onComplete} />;
      case 'ch-companies-case-studies':
        return <ChapterCompanies isCompleted={isCompleted} onComplete={onComplete} />;
      default:
        return (
          <HomePage
            completedIds={completedIds}
            earnedXp={earnedXp}
            onSelectChapter={selectChapter}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-stone-900 transition-colors dark:bg-[#141413] dark:text-stone-100">
      {/* Refactoring.Guru-Inspired Flat Editorial Header */}
      <header className="sticky top-0 z-30 border-b border-[#E5DFD3] bg-[#FFFDF9]/95 backdrop-blur-sm dark:border-stone-800 dark:bg-[#1A1A19]/95">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="-ml-1.5 rounded-md p-1.5 text-stone-600 transition hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
                aria-label="Toggle catalog"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <button
                onClick={() => selectChapter('home')}
                className="flex items-center gap-2.5 text-left"
              >
                <BrandEmblem />
                <span className="font-display text-[16px] font-extrabold tracking-tight text-stone-900 dark:text-white">
                  Agent<span className="text-[#D94436]">Academy</span>
                </span>
              </button>
            </div>

            {/* Clean Top Navigation Links */}
            <nav className="hidden items-center gap-1 md:flex">
              {(
                [
                  ['home', 'Catalog'],
                  ['ch0-llm-basics', 'Start Here'],
                  ['ch-companies-case-studies', 'Case Studies'],
                  ['ch13-interview-prep', 'Interview Prep'],
                  ['ch-stay-current', 'Stay Current'],
                  ['ch17-mastery-quiz', 'Final Quiz'],
                ] as [ChapterId, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => selectChapter(id)}
                  className={`rounded-md px-2.5 py-1.5 text-[13px] font-semibold transition ${
                    activeId === id
                      ? 'text-[#D94436]'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {currentChapter && (
              <div className="hidden items-center rounded-md border border-[#E5DFD3] bg-[#FAF7F0] p-0.5 dark:border-stone-800 dark:bg-stone-900 sm:flex">
                <button
                  disabled={!prevChapter}
                  onClick={() => prevChapter && selectChapter(prevChapter.id)}
                  title={prevChapter ? `Previous: ${prevChapter.shortTitle}` : 'Start'}
                  className="rounded p-1 text-stone-600 hover:bg-white hover:text-[#D94436] disabled:opacity-30 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  disabled={!nextChapter}
                  onClick={() => nextChapter && selectChapter(nextChapter.id)}
                  title={nextChapter ? `Next: ${nextChapter.shortTitle}` : 'End'}
                  className="rounded p-1 text-stone-600 hover:bg-white hover:text-[#D94436] disabled:opacity-30 dark:text-stone-400 dark:hover:bg-stone-800"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-[#E5DFD3] bg-[#FAF7F0] px-2.5 py-1.5 text-xs text-stone-500 transition hover:border-[#D94436]/60 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded bg-white px-1 py-0.5 font-mono text-[10px] text-stone-400 shadow-2xs dark:bg-stone-800 sm:inline">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setDarkMode((d) => !d)}
              className="rounded-md p-1.5 text-stone-600 transition hover:bg-stone-100 hover:text-[#D94436] dark:text-stone-400 dark:hover:bg-stone-800"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Coral Reading Progress Hairline */}
        {currentChapter && (
          <div className="h-[2px] w-full bg-transparent">
            <div
              className="h-full bg-[#D94436] transition-[width] duration-150 ease-out"
              style={{ width: `${readProgress}%` }}
            />
          </div>
        )}
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {/* Grouped Book-Catalog Sidebar (Refactoring.Guru Style) */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-[#E5DFD3] bg-[#FFFDF9] px-4 py-6 dark:border-stone-800 dark:bg-[#181817] lg:block">
          <div className="space-y-6">
            {CURRICULUM_PARTS.map((part) => {
              const partChapters = part.chapterNumbers
                .map((num) => CHAPTERS.find((c) => c.number === num)!)
                .filter(Boolean);
              return (
                <div key={part.label}>
                  <div className="mb-2 px-2.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    {part.label}
                  </div>
                  <nav className="space-y-0.5">
                    {partChapters.map((ch) => {
                      const active = activeId === ch.id;
                      const done = completedIds.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          onClick={() => selectChapter(ch.id)}
                          className={`flex w-full items-center gap-2 border-l-2 py-1.5 pl-2.5 pr-2 text-left text-[13px] transition ${
                            active
                              ? 'border-[#D94436] bg-[#FDF2F0] font-bold text-[#B83226] dark:bg-[#D94436]/15 dark:text-[#F88B80]'
                              : 'border-transparent font-medium text-stone-700 hover:border-stone-300 hover:text-[#D94436] dark:text-stone-300 dark:hover:border-stone-700 dark:hover:text-[#F06457]'
                          }`}
                        >
                          <span className="line-clamp-1 flex-1">{ch.shortTitle}</span>
                          {done && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-[#E5DFD3] pt-4 dark:border-stone-800">
            <div className="flex items-center justify-between font-mono text-[11px] text-stone-500 dark:text-stone-400">
              <span>Reading Progress</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">
                {completedIds.length}/{CHAPTERS.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
              <div
                className="h-full rounded-full bg-[#D94436] transition-all duration-500"
                style={{ width: `${Math.round((completedIds.length / CHAPTERS.length) * 100)}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="fixed inset-y-14 left-0 z-40 w-72 overflow-y-auto border-r border-[#E5DFD3] bg-[#FFFDF9] p-4 shadow-2xl dark:border-stone-800 dark:bg-[#181817] lg:hidden"
            >
              <button
                onClick={() => selectChapter('home')}
                className="mb-4 block w-full rounded-md bg-[#FDF2F0] px-3 py-2 text-left text-xs font-bold text-[#D94436] dark:bg-[#D94436]/15"
              >
                ← Full Catalog
              </button>
              <div className="space-y-5">
                {CURRICULUM_PARTS.map((part) => (
                  <div key={part.label}>
                    <div className="mb-1.5 px-2 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {part.label}
                    </div>
                    {part.chapterNumbers
                      .map((num) => CHAPTERS.find((c) => c.number === num)!)
                      .filter(Boolean)
                      .map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() => selectChapter(ch.id)}
                          className={`block w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium ${
                            activeId === ch.id
                              ? 'bg-[#D94436] text-white'
                              : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                          }`}
                        >
                          {ch.shortTitle}
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Editorial Article Canvas */}
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                {/* Refactoring.Guru-Style Article Masthead */}
                {currentChapter && (
                  <header className="mb-10">
                    {/* Breadcrumbs */}
                    <nav className="mb-4 flex flex-wrap items-center gap-1.5 font-mono text-xs text-stone-500 dark:text-stone-400">
                      <button
                        onClick={() => selectChapter('home')}
                        className="hover:text-[#D94436] hover:underline"
                      >
                        Home
                      </button>
                      <span>/</span>
                      <span>{currentPart?.label || 'Handbook'}</span>
                      <span>/</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">
                        Chapter {String(currentChapter.number).padStart(2, '0')}
                      </span>
                    </nav>

                    <h1 className="font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-stone-950 dark:text-white sm:text-[2.55rem]">
                      {currentChapter.title}
                    </h1>

                    {/* Iconic Two-Column Intent Box + Flat Vector Illustration */}
                    <div className="mt-6 grid gap-6 rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] p-6 dark:border-stone-800 dark:bg-stone-900/70 sm:grid-cols-12 sm:items-center">
                      <div className="sm:col-span-8">
                        <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#D94436]">
                          Intent &amp; Summary
                        </div>
                        <p className="mt-2 text-[15.5px] leading-relaxed text-stone-700 dark:text-stone-300">
                          {currentChapter.subtitle}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-stone-200/80 pt-3.5 text-xs text-stone-600 dark:border-stone-800 dark:text-stone-400">
                          <span className="inline-flex items-center gap-2 font-medium">
                            Complexity: <ComplexityDots level={currentChapter.difficulty} />{' '}
                            <span className="font-mono text-[11px]">{currentChapter.difficulty}</span>
                          </span>
                          <span className="font-mono text-[11px]">
                            Read time: <strong className="text-stone-800 dark:text-stone-200">{currentChapter.duration}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center sm:col-span-4">
                        <ChapterIllustration chapterNumber={currentChapter.number} />
                      </div>
                    </div>
                  </header>
                )}

                {currentChapter && <ChapterTldr id={currentChapter.id} />}

                {renderChapter()}

                {currentChapter && <ChapterExtrasBottom id={currentChapter.id} />}

                {currentChapter && (
                  <ChapterNavFooter
                    prevTitle={prevChapter?.shortTitle}
                    nextTitle={nextChapter?.shortTitle}
                    onPrev={prevChapter ? () => selectChapter(prevChapter.id) : undefined}
                    onNext={nextChapter ? () => selectChapter(nextChapter.id) : undefined}
                    isCompleted={completedIds.includes(currentChapter.id)}
                    onMarkComplete={() => markComplete(currentChapter.id)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectChapter={selectChapter}
      />
    </div>
  );
}
