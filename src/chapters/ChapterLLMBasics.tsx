import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Dices, Pause, Play, RotateCcw } from 'lucide-react';
import { Callout, ConceptCard, SectionHeader } from '../components/UI';

/* ------------------------------------------------------------------ */
/* 1. The AI family tree                                               */
/* ------------------------------------------------------------------ */
function AIFamilyTree() {
  const rings = [
    { r: 140, label: 'Artificial Intelligence', fill: '#FFFDF9', stroke: '#1F2937', text: '#1F2937' },
    { r: 112, label: 'Machine Learning', fill: '#F4FBF9', stroke: '#0D9488', text: '#0F766E' },
    { r: 84, label: 'Deep Learning', fill: '#FDF7EE', stroke: '#D97706', text: '#B45309' },
    { r: 57, label: 'Generative AI', fill: '#FDF2F0', stroke: '#D94436', text: '#B83226' },
  ];
  return (
    <svg viewBox="0 0 320 300" className="w-full max-w-[320px] select-none" aria-label="AI family tree">
      {rings.map((ring) => (
        <g key={ring.label}>
          <circle cx="160" cy="152" r={ring.r} fill={ring.fill} stroke={ring.stroke} strokeWidth="1.8" />
          <text x="160" y={152 - ring.r + 17} textAnchor="middle" fill={ring.text} fontSize="11" fontWeight="700">
            {ring.label}
          </text>
        </g>
      ))}
      <circle cx="160" cy="160" r="30" fill="#D94436" />
      <text x="160" y="164" textAnchor="middle" fill="#FFFDF9" fontSize="12" fontWeight="800">
        LLMs
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Training loop visualizer                                         */
/* ------------------------------------------------------------------ */
const TRAIN_STEPS = [
  { title: '1. Guess', text: 'The model reads "The cat sat on the" and guesses the next word. Early on it guesses badly: "car".' },
  { title: '2. Compare', text: 'The real text says "mat". The training data is the answer key.' },
  { title: '3. Measure the error', text: 'A single number called the loss scores how wrong the guess was. Big mistake → big loss.' },
  { title: '4. Nudge the weights', text: 'Backpropagation slightly adjusts billions of internal numbers (weights) so "mat" becomes a bit more likely next time.' },
];
const MAX_EPOCHS = 30;

function TrainingLoopViz() {
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const step = tick % 4;
  const epoch = Math.min(Math.floor(tick / 4), MAX_EPOCHS);

  useEffect(() => {
    if (!playing) return;
    if (epoch >= MAX_EPOCHS) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setTick((v) => v + 1), 380);
    return () => clearTimeout(t);
  }, [playing, tick, epoch]);

  const loss = (e: number) => 0.15 + 2.6 * Math.exp(-e / 5);
  const points = Array.from({ length: epoch + 1 }, (_, e) => {
    const x = 12 + e * (276 / MAX_EPOCHS);
    const y = 112 - (loss(e) / 2.8) * 96;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const pMat = Math.round((1 - (loss(epoch) - 0.15) / 2.6) * 92 + 3);

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div>
          <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
            Interactive · How a Model Learns
          </div>
          <h3 className="font-display text-base font-bold text-white">Watch the training loop make the model less wrong</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (epoch >= MAX_EPOCHS) setTick(0);
              setPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Pause' : 'Train'}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setTick(0);
            }}
            className="rounded-lg bg-stone-800 p-1.5 text-stone-300 hover:bg-stone-700"
            aria-label="Reset training"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div className="space-y-2">
          {TRAIN_STEPS.map((s, i) => (
            <div
              key={s.title}
              className={`rounded-xl border p-3 transition ${
                i === step ? 'border-emerald-400 bg-emerald-500/10' : 'border-stone-800 bg-stone-900/60 opacity-60'
              }`}
            >
              <div className="text-xs font-bold text-white">{s.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-stone-300">{s.text}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <div className="flex justify-between font-mono text-[11px] text-stone-400">
            <span>Training rounds: {epoch}/{MAX_EPOCHS}</span>
            <span>Loss: {loss(epoch).toFixed(2)}</span>
          </div>
          <svg viewBox="0 0 300 120" className="my-3 w-full">
            <line x1="12" y1="112" x2="290" y2="112" stroke="#44403c" />
            <line x1="12" y1="10" x2="12" y2="112" stroke="#44403c" />
            <text x="16" y="20" fill="#78716c" fontSize="8">loss (how wrong)</text>
            <text x="230" y="108" fill="#78716c" fontSize="8">training →</text>
            <polyline points={points} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">Probability the model predicts &quot;mat&quot;</span>
              <strong className="font-mono text-emerald-300">{pMat}%</strong>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-800">
              <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${pMat}%` }} />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-stone-400">
              Real LLMs repeat this loop over trillions of words on thousands of GPUs for weeks. Nobody writes
              the rules by hand — the patterns are learned from the data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Next-token prediction & temperature                              */
/* ------------------------------------------------------------------ */
interface TokenOption {
  token: string;
  logit: number;
}
const NEXT_TOKEN_PROMPTS: { text: string; options: TokenOption[] }[] = [
  {
    text: 'The capital of France is',
    options: [
      { token: ' Paris', logit: 9.0 },
      { token: ' a', logit: 5.6 },
      { token: ' the', logit: 5.2 },
      { token: ' located', logit: 4.6 },
      { token: ' known', logit: 4.0 },
    ],
  },
  {
    text: 'My favorite programming language is',
    options: [
      { token: ' Python', logit: 6.0 },
      { token: ' JavaScript', logit: 5.6 },
      { token: ' Rust', logit: 5.0 },
      { token: ' Go', logit: 4.6 },
      { token: ' C', logit: 4.3 },
    ],
  },
  {
    text: 'Once upon a time, there was a',
    options: [
      { token: ' little', logit: 6.2 },
      { token: ' young', logit: 5.8 },
      { token: ' king', logit: 5.2 },
      { token: ' girl', logit: 5.0 },
      { token: ' dragon', logit: 4.9 },
    ],
  },
];

function softmax(logits: number[], temperature: number) {
  if (temperature <= 0.01) {
    const max = Math.max(...logits);
    return logits.map((l) => (l === max ? 1 : 0));
  }
  const scaled = logits.map((l) => l / temperature);
  const m = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function NextTokenLab() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [temperature, setTemperature] = useState(1);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [last, setLast] = useState<number | null>(null);

  const prompt = NEXT_TOKEN_PROMPTS[promptIdx];
  const probs = useMemo(
    () => softmax(prompt.options.map((o) => o.logit), temperature),
    [prompt, temperature]
  );

  const sampleOnce = () => {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < probs.length; i++) {
      acc += probs[i];
      if (r <= acc) return i;
    }
    return probs.length - 1;
  };

  const sample = (n: number) => {
    const next = [...counts];
    let lastIdx = 0;
    for (let k = 0; k < n; k++) {
      lastIdx = sampleOnce();
      next[lastIdx] += 1;
    }
    setCounts(next);
    setLast(lastIdx);
  };

  const reset = (idx = promptIdx) => {
    setPromptIdx(idx);
    setCounts([0, 0, 0, 0, 0]);
    setLast(null);
  };

  const totalSamples = counts.reduce((a, b) => a + b, 0);

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-400">
          Interactive · Next-Token Prediction
        </div>
        <h3 className="font-display text-base font-bold text-white">
          An LLM picks the next token from a probability list — temperature controls how adventurous it is
        </h3>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex flex-wrap gap-2">
          {NEXT_TOKEN_PROMPTS.map((p, i) => (
            <button
              key={p.text}
              onClick={() => reset(i)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                i === promptIdx
                  ? 'border-amber-400 bg-amber-500/15 text-white'
                  : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
              }`}
            >
              &ldquo;{p.text}…&rdquo;
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-4 font-mono text-sm">
          <span className="text-stone-300">{prompt.text}</span>
          {last !== null ? (
            <motion.span
              key={`${last}-${totalSamples}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded bg-amber-500/25 px-1 text-amber-200"
            >
              {prompt.options[last].token}
            </motion.span>
          ) : (
            <span className="animate-pulse text-stone-500"> ▍</span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-stone-400">Temperature</span>
              <strong className="font-mono text-amber-300">{temperature.toFixed(1)}</strong>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-amber-400"
              aria-label="Temperature"
            />
            <p className="text-[11px] leading-relaxed text-stone-400">
              {temperature <= 0.01
                ? 'Temperature 0 = always pick the single most likely token (deterministic). Great for code, extraction and agents.'
                : temperature < 0.8
                  ? 'Low temperature = focused and predictable. Good default for tool-calling agents.'
                  : temperature <= 1.2
                    ? 'Medium temperature = balanced. Common default for chat.'
                    : 'High temperature = creative but risky. Unlikely tokens get picked more often (more hallucination risk).'}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => sample(1)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-stone-950 hover:bg-amber-400"
              >
                <Dices className="h-3.5 w-3.5" /> Generate 1 token
              </button>
              <button
                onClick={() => sample(20)}
                className="rounded-lg bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-stone-700"
              >
                Sample 20×
              </button>
              <button
                onClick={() => reset()}
                className="rounded-lg bg-stone-800 p-1.5 text-stone-400 hover:bg-stone-700"
                aria-label="Reset samples"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {prompt.options.map((o, i) => (
              <div key={o.token} className="grid grid-cols-12 items-center gap-2 text-xs">
                <span className="col-span-3 truncate font-mono text-stone-200">{o.token.trim()}</span>
                <div className="col-span-6 h-4 overflow-hidden rounded bg-stone-800">
                  <div
                    className="h-full rounded bg-gradient-to-r from-amber-500 to-[#D94436] transition-all duration-300"
                    style={{ width: `${Math.max(1, probs[i] * 100)}%` }}
                  />
                </div>
                <span className="col-span-1 text-right font-mono text-stone-400">{Math.round(probs[i] * 100)}%</span>
                <span className="col-span-2 text-right font-mono text-[10px] text-stone-500">
                  {totalSamples ? `picked ${counts[i]}×` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-stone-500">
          Simplified for learning: real models score ~100,000+ possible tokens at every step and repeat this
          once per generated token.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Embedding map                                                     */
/* ------------------------------------------------------------------ */
const WORDS = [
  { w: 'king', x: 18, y: 22, g: 'People' },
  { w: 'queen', x: 27, y: 16, g: 'People' },
  { w: 'prince', x: 13, y: 31, g: 'People' },
  { w: 'princess', x: 24, y: 28, g: 'People' },
  { w: 'apple', x: 72, y: 20, g: 'Fruit' },
  { w: 'banana', x: 81, y: 28, g: 'Fruit' },
  { w: 'mango', x: 77, y: 13, g: 'Fruit' },
  { w: 'javascript', x: 80, y: 78, g: 'Code' },
  { w: 'rust', x: 72, y: 86, g: 'Code' },
  { w: 'python', x: 62, y: 72, g: 'Code' },
  { w: 'dog', x: 22, y: 74, g: 'Animals' },
  { w: 'cat', x: 31, y: 81, g: 'Animals' },
  { w: 'puppy', x: 15, y: 83, g: 'Animals' },
  { w: 'snake', x: 40, y: 70, g: 'Animals' },
];
const GROUP_COLORS: Record<string, string> = {
  People: '#D94436',
  Fruit: '#D97706',
  Code: '#0D9488',
  Animals: '#6366F1',
};

function EmbeddingMap() {
  const [selected, setSelected] = useState('python');
  const sel = WORDS.find((w) => w.w === selected)!;
  const neighbors = WORDS.filter((w) => w.w !== selected)
    .map((w) => ({ ...w, d: Math.hypot(w.x - sel.x, w.y - sel.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
  const sx = (x: number) => x * 4;
  const sy = (y: number) => y * 2.6;

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-400">
          Interactive · Embeddings
        </div>
        <h3 className="font-display text-base font-bold text-white">
          Click a word: things with similar meaning live close together
        </h3>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-12">
        <svg viewBox="0 0 400 260" className="w-full rounded-xl bg-stone-900/60 md:col-span-8">
          {neighbors.map((n) => (
            <line
              key={n.w}
              x1={sx(sel.x)}
              y1={sy(sel.y)}
              x2={sx(n.x)}
              y2={sy(n.y)}
              stroke="#22d3ee"
              strokeWidth="1.5"
              className="animate-dash-flow"
            />
          ))}
          {WORDS.map((w) => {
            const isSel = w.w === selected;
            const isNb = neighbors.some((n) => n.w === w.w);
            return (
              <g key={w.w} onClick={() => setSelected(w.w)} className="cursor-pointer">
                <circle
                  cx={sx(w.x)}
                  cy={sy(w.y)}
                  r={isSel ? 7 : 5}
                  fill={GROUP_COLORS[w.g]}
                  stroke={isSel ? '#fff' : isNb ? '#22d3ee' : 'none'}
                  strokeWidth="2"
                />
                <text
                  x={sx(w.x) + (isSel ? 12 : 9)}
                  y={sy(w.y) + 4}
                  fill={isSel ? '#fff' : '#d6d3d1'}
                  fontSize="11"
                  fontWeight={isSel ? 700 : 500}
                >
                  {w.w}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="space-y-3 text-xs md:col-span-4">
          <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-3">
            <div className="font-mono text-[10px] uppercase text-stone-400">Selected</div>
            <div className="mt-0.5 font-display text-lg font-bold text-white">{selected}</div>
            <div className="mt-1 font-mono text-[10px] text-stone-500">
              vector ≈ [{(sel.x / 100).toFixed(2)}, {(sel.y / 100).toFixed(2)}, …768 more numbers]
            </div>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-3">
            <div className="font-mono text-[10px] uppercase text-stone-400">Nearest neighbours</div>
            {neighbors.map((n) => (
              <div key={n.w} className="mt-1.5 flex justify-between">
                <span className="text-stone-200">{n.w}</span>
                <span className="font-mono text-cyan-300">{Math.max(0, 1 - n.d / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <p className="leading-relaxed text-stone-400">
            Notice how <strong className="text-stone-200">python</strong> sits between code and animals — real
            embeddings capture ambiguity too. This is how semantic search and RAG find relevant documents.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Attention: the "bank" example                                     */
/* ------------------------------------------------------------------ */
const ATTENTION_EXAMPLES = [
  {
    label: 'River bank',
    tokens: ['I', 'sat', 'by', 'the', 'river', 'bank'],
    weights: [0.03, 0.12, 0.08, 0.04, 0.68, 0.05],
    meaning: '"bank" pays most attention to "river" → it means the side of a river.',
  },
  {
    label: 'Money bank',
    tokens: ['I', 'deposited', 'cash', 'at', 'the', 'bank'],
    weights: [0.03, 0.38, 0.45, 0.04, 0.03, 0.07],
    meaning: '"bank" pays most attention to "deposited" and "cash" → it means a financial institution.',
  },
];

function AttentionExample() {
  const [idx, setIdx] = useState(0);
  const ex = ATTENTION_EXAMPLES[idx];
  return (
    <div className="my-6 rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 dark:border-stone-800 dark:bg-stone-900/70">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#D94436]">
          Try it · What attention does
        </div>
        <div className="flex gap-1.5">
          {ATTENTION_EXAMPLES.map((e, i) => (
            <button
              key={e.label}
              onClick={() => setIdx(i)}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                i === idx
                  ? 'border-[#D94436] bg-[#FDF2F0] text-[#B83226] dark:bg-[#D94436]/15 dark:text-[#F88B80]'
                  : 'border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-300'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {ex.tokens.map((t, i) => {
          const isTarget = i === ex.tokens.length - 1;
          return (
            <motion.span
              key={`${idx}-${t}`}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg border px-3 py-1.5 font-mono text-sm ${
                isTarget ? 'border-[#D94436] font-bold text-[#B83226] dark:text-[#F88B80]' : 'border-transparent text-stone-900 dark:text-stone-100'
              }`}
              style={{ backgroundColor: isTarget ? undefined : `rgba(217, 68, 54, ${ex.weights[i] * 0.85})` }}
            >
              {t}
              {!isTarget && (
                <span className="ml-1.5 text-[10px] text-stone-600 dark:text-stone-300">
                  {Math.round(ex.weights[i] * 100)}%
                </span>
              )}
            </motion.span>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-stone-700 dark:text-stone-300">{ex.meaning}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter                                                              */
/* ------------------------------------------------------------------ */
export function ChapterLLMBasics(_props: { isCompleted: boolean; onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Start here"
        title="The AI Family Tree"
        description="People use 'AI', 'machine learning' and 'LLM' interchangeably. They are actually nested ideas — each one is a more specific version of the one around it."
      />

      <div className="grid items-center gap-6 md:grid-cols-12">
        <div className="flex justify-center md:col-span-5">
          <AIFamilyTree />
        </div>
        <div className="space-y-3 md:col-span-7">
          {[
            ['Artificial Intelligence', 'Any computer system that does something we would call "smart". Includes old-school hand-written rules, like a chess engine or a tax calculator.'],
            ['Machine Learning', 'Instead of writing rules, you show the computer lots of examples and it learns the pattern. Example: a spam filter trained on millions of labelled emails.'],
            ['Deep Learning', 'Machine learning using neural networks with many layers. Powers face recognition, speech-to-text and translation.'],
            ['Generative AI', 'Deep learning models that create new content — text, images, audio, video, code — rather than just classifying it.'],
            ['Large Language Models (LLMs)', 'Generative models trained on enormous amounts of text to predict the next word. Gemini, GPT, Claude, Llama, Qwen and DeepSeek are all LLMs.'],
          ].map(([t, d]) => (
            <div key={t} className="border-l-2 border-[#E5DFD3] pl-3 dark:border-stone-700">
              <div className="text-sm font-bold text-stone-900 dark:text-stone-50">{t}</div>
              <div className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">{d}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader
        eyebrow="Neural networks"
        title="How a Neural Network Learns (No Math Required)"
        description="A neural network is a huge function with billions of adjustable knobs called weights (or parameters). Training is just the process of turning those knobs until the network's predictions stop being wrong."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<Brain className="h-4 w-4" />} title="Weights = knowledge" badge="Parameters">
          A &ldquo;70B model&rdquo; has 70 billion weights. Everything it knows — grammar, facts, coding style —
          is stored as patterns in these numbers. There is no database inside.
        </ConceptCard>
        <ConceptCard title="Loss = how wrong" badge="Score">
          After every guess, a loss function measures the mistake. Training&apos;s only goal is to make the
          average loss smaller.
        </ConceptCard>
        <ConceptCard title="Gradient descent = walking downhill" badge="Optimizer">
          Imagine standing on a foggy hill trying to reach the valley. You feel which way is down and take a
          small step. Repeat billions of times. That&apos;s how weights get updated.
        </ConceptCard>
      </div>

      <TrainingLoopViz />

      <SectionHeader
        eyebrow="Large language models"
        title="An LLM Is Autocomplete at Massive Scale"
        description="An LLM has exactly one core skill: given some text, predict what comes next. To answer your question it predicts one token, appends it, and predicts again — hundreds of times. Chat, coding and tool calling all emerge from this single loop."
      />

      <NextTokenLab />

      <Callout type="insight" title="Why this matters for agents">
        <p>
          Because an LLM only predicts text, it can&apos;t <em>do</em> anything by itself. When an agent
          &ldquo;calls a tool&rdquo;, the model is really just predicting text that looks like{' '}
          <code>{'{"tool": "get_weather", "city": "Tokyo"}'}</code> — and your code runs it. You&apos;ll build
          exactly this in Chapters 3–5.
        </p>
      </Callout>

      <SectionHeader
        eyebrow="Tokens"
        title="Tokens: How LLMs Read Text"
        description="LLMs don't see letters or words. Text is chopped into tokens — common words become one token, rare words are split into pieces. Everything (cost, speed, memory limits) is measured in tokens."
      />

      <div className="rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 dark:border-stone-800 dark:bg-stone-900/70">
        <div className="flex flex-wrap gap-1.5 font-mono text-sm">
          {['Agent', 'ic', ' work', 'flows', ' are', ' un', 'believ', 'ably', ' powerful', '!'].map((t, i) => (
            <span
              key={i}
              className={`rounded border px-1.5 py-0.5 ${
                ['bg-[#FDF2F0] border-[#F3D7D4]', 'bg-teal-50 border-teal-200', 'bg-amber-50 border-amber-200'][i % 3]
              } text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100`}
            >
              {t.replace(' ', '·')}
            </span>
          ))}
        </div>
        <ul className="mt-4 grid gap-2 text-sm text-stone-700 dark:text-stone-300 sm:grid-cols-3">
          <li><strong>Rule of thumb:</strong> 1 token ≈ 4 English characters ≈ ¾ of a word.</li>
          <li><strong>1,000 tokens</strong> ≈ 750 words ≈ 1.5 pages of text.</li>
          <li><strong>Code and non-English</strong> text usually need more tokens per word.</li>
        </ul>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
          You&apos;ll use a live tokenizer and cost calculator in Chapter 6.
        </p>
      </div>

      <SectionHeader
        eyebrow="Embeddings"
        title="Embeddings: Turning Meaning Into Numbers"
        description="Before processing a token, the model converts it into a long list of numbers called an embedding (often 768–4,096 numbers). Words with similar meaning get similar numbers, so 'similar' becomes 'close together' — which computers can measure."
      />

      <EmbeddingMap />

      <SectionHeader
        eyebrow="Transformers"
        title="Transformers & Attention in One Idea"
        description="The Transformer (Google, 2017) is the architecture inside every modern LLM. Its key trick is attention: when processing a word, the model looks at every other word in the text and decides which ones matter most for understanding it."
      />

      <AttentionExample />

      <Callout type="tip" title="Want to go deeper?">
        Chapter 18 has an interactive self-attention visualizer and the original &ldquo;Attention Is All You
        Need&rdquo; paper. For a visual walk-through, try the Transformer Explainer and LLM Visualization links at
        the end of this chapter.
      </Callout>

      <SectionHeader
        eyebrow="How LLMs are made"
        title="From Raw Internet Text to a Helpful Assistant"
        description="Modern assistants are built in stages. Each stage teaches a different skill."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard title="1. Pre-training" badge="Months · $$$$">
          Read trillions of tokens from the web, books and code, predicting the next token. Result: a{' '}
          <strong>base model</strong> that knows a lot but just continues text — ask it a question and it may
          reply with more questions.
        </ConceptCard>
        <ConceptCard title="2. Instruction tuning (SFT)" badge="Days · $$">
          Train on curated examples of good conversations: question → helpful answer, request → tool call.
          The model learns to follow instructions and use a chat format.
        </ConceptCard>
        <ConceptCard title="3. Preference & RL tuning" badge="Days · $$">
          Humans (or verifiers like unit tests) score answers; the model is nudged toward better ones (RLHF,
          DPO, RLVR). This is where helpfulness, safety and step-by-step reasoning are sharpened.
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="The knobs"
        title="Settings You'll Use Every Day"
        description="Every LLM API exposes the same handful of settings. Knowing them explains most 'why did the model do that?' moments."
      />

      <div className="overflow-x-auto rounded-xl border border-[#E5DFD3] dark:border-stone-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F4ECDB] text-[11px] uppercase tracking-wider text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3">Setting</th>
              <th className="px-4 py-3">What it means</th>
              <th className="px-4 py-3">Typical value for agents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-[#FFFDF9] dark:divide-stone-800 dark:bg-stone-950/60">
            {[
              ['Context window', 'Max tokens the model can see at once (prompt + history + answer). Think "short-term memory size".', '128K – 1M+ tokens, but quality drops when it is stuffed'],
              ['Temperature', 'Randomness when picking the next token.', '0 – 0.3 for tools and code; 0.7+ for creative writing'],
              ['Top-p', 'Only sample from the most likely tokens whose probabilities add up to p.', 'Leave at default; tune temperature instead'],
              ['Max output tokens', 'Hard cap on the length of the answer.', 'Set it — it bounds cost and latency'],
              ['System instruction', 'Persistent rules: role, tone, constraints, output format.', 'Always use one for agents'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">{a}</td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-300">{b}</td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-300">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SectionHeader
        eyebrow="Limits"
        title="What LLMs Can't Do Alone — and Why Agents Exist"
        description="Every major limitation of a plain LLM maps directly to a piece of agent architecture. This table is the whole reason the rest of this handbook exists."
      />

      <div className="overflow-x-auto rounded-xl border border-[#E5DFD3] dark:border-stone-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F4ECDB] text-[11px] uppercase tracking-wider text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3">LLM limitation</th>
              <th className="px-4 py-3">What it looks like</th>
              <th className="px-4 py-3">Agent solution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-[#FFFDF9] dark:divide-stone-800 dark:bg-stone-950/60">
            {[
              ['Hallucination', 'Confidently invents a citation, API or number', 'Retrieval (RAG), tools, verification steps — Ch 4, 5, 13'],
              ['Knowledge cutoff', "Doesn't know yesterday's news or your private data", 'Search & database tools, RAG — Ch 4, 5'],
              ['Stateless', 'Forgets everything between API calls', 'Memory systems & session state — Ch 4'],
              ["Can't take actions", 'Can describe how to book a flight, but not book it', 'Function calling, MCP, CLIs — Ch 5'],
              ['Weak at long multi-step tasks', 'Loses track halfway through a 20-step job', 'Planning loops, sub-agents, multi-agent — Ch 3, 10'],
              ['Unreliable maths & exact logic', 'Gets 37 × 491 wrong', 'Code execution tools (CodeAct) — Ch 4, 5'],
            ].map(([a, b, c]) => (
              <tr key={a}>
                <td className="px-4 py-3 font-semibold text-[#B83226] dark:text-[#F88B80]">{a}</td>
                <td className="px-4 py-3 text-stone-600 dark:text-stone-300">{b}</td>
                <td className="px-4 py-3 text-stone-800 dark:text-stone-200">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
