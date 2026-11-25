import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, HardDrive, Pause, Play, RotateCcw, Server, ShieldCheck, Zap } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';

/* ------------------------------------------------------------------ */
/* 1. What is inside an open-weight model                              */
/* ------------------------------------------------------------------ */
function ModelFolder() {
  const files = [
    { name: 'config.json', size: '1 KB', what: 'The blueprint: number of layers, hidden size, attention heads, context length.' },
    { name: 'tokenizer.json', size: '7 MB', what: 'The vocabulary and rules for turning text into tokens and back.' },
    { name: 'model-00001-of-00004.safetensors', size: '4.9 GB', what: 'The weights — billions of learned numbers, split into shards.' },
    { name: 'model-00002…00004.safetensors', size: '11 GB', what: 'More weight shards. An 8B model in 16-bit ≈ 16 GB in total.' },
    { name: 'generation_config.json', size: '1 KB', what: 'Default settings such as temperature and stop tokens.' },
    { name: 'LICENSE', size: '—', what: 'What you are allowed to do: commercial use, limits, attribution.' },
  ];
  const [sel, setSel] = useState(2);
  return (
    <div className="my-6 grid gap-4 rounded-2xl border border-stone-800 bg-stone-950 p-5 text-stone-100 md:grid-cols-12">
      <div className="md:col-span-7">
        <div className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-400">
          <HardDrive className="h-3.5 w-3.5" /> Click a file · what you download from Hugging Face
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-2 font-mono text-xs">
          <div className="px-2 py-1 text-stone-400">📁 Qwen2.5-7B-Instruct/</div>
          {files.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setSel(i)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-left ${i === sel ? 'bg-amber-500/15 text-amber-200' : 'text-stone-300 hover:bg-stone-800'}`}
            >
              <span>└ {f.name}</span>
              <span className="text-stone-500">{f.size}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={sel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col justify-center rounded-xl border border-stone-800 bg-stone-900/70 p-4 md:col-span-5">
        <div className="font-mono text-xs text-amber-300">{files[sel].name}</div>
        <p className="mt-2 text-sm leading-relaxed text-stone-200">{files[sel].what}</p>
        <p className="mt-3 text-[11px] text-stone-500">
          &ldquo;Open weights&rdquo; means these files are public. You can run them on your own hardware, fine-tune
          them and keep every request private — no API call ever leaves your network.
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Build-vs-use decision wizard                                     */
/* ------------------------------------------------------------------ */
type Answers = {
  gap: 'knowledge' | 'behaviour' | 'none';
  privacy: 'cloud-ok' | 'own-infra';
  volume: 'low' | 'medium' | 'high';
  task: 'broad' | 'narrow';
  latency: 'normal' | 'edge';
  data: 'none' | 'hundreds' | 'thousands';
};

function recommend(a: Answers) {
  const selfHostNeeded = a.privacy === 'own-infra' || a.latency === 'edge';
  if (a.gap === 'knowledge') {
    return selfHostNeeded
      ? { title: 'Self-host an open-weight model + RAG', why: 'Missing facts are a knowledge problem — retrieval fixes that without training. Your privacy or latency needs mean the model must run in your own environment.', cost: '$500–$5,000 / month in GPUs', time: '1–3 weeks', next: 'Serve Qwen, Gemma or Llama with vLLM inside your network and add retrieval over your documents.' }
      : { title: 'Generic frontier model + RAG (no training)', why: 'The model does not know your private or recent information. Fine-tuning is a poor way to add facts — it is expensive, goes stale and still hallucinates. Retrieval keeps answers fresh and citable.', cost: 'API usage only', time: 'Days', next: 'Chunk and index your documents, add a search tool, and measure retrieval quality (Chapter 4).' };
  }
  if (a.task === 'narrow' && a.volume === 'high' && a.data === 'thousands') {
    return { title: 'Fine-tune (distill) a small open-weight model', why: 'A narrow, repetitive task at high volume is exactly where a fine-tuned 1B–8B model can match a big model at a fraction of the cost and latency. You have enough examples to train it.', cost: '$10–$500 per training run + serving GPUs', time: '1–4 weeks including evals', next: 'Collect verified outputs (or have a frontier model label data), train a LoRA adapter, and compare against your prompted baseline on the same eval set.' };
  }
  if (selfHostNeeded) {
    return a.gap === 'behaviour' && a.data === 'thousands'
      ? { title: 'Self-host an open-weight model + LoRA fine-tune', why: 'You must run inside your own environment and you have enough examples to teach the model your format or style.', cost: '$50–$1,000 to train; GPU serving costs monthly', time: '2–6 weeks', next: 'Start from the strongest open model that fits your GPUs, fine-tune with QLoRA, then serve with vLLM or Ollama.' }
      : { title: 'Self-host an open-weight model as-is', why: 'Privacy, offline or latency requirements rule out external APIs. Modern open-weight models are strong enough for most agent tasks without any training.', cost: 'GPU serving costs (from ~$500 / month)', time: '1–2 weeks', next: 'Pick a model (Chapter 7), serve it with vLLM, and point your agent at its OpenAI-compatible endpoint.' };
  }
  if (a.gap === 'behaviour') {
    return a.data === 'thousands'
      ? { title: 'Try hosted fine-tuning (or LoRA) after prompt work', why: 'Consistent format or style problems that survive good prompting and examples can be fixed by tuning — and you have the data for it.', cost: '$10s–$1,000s per run', time: '1–3 weeks', next: 'First push prompting, few-shot examples and structured output as far as they go; then tune on Vertex AI or with LoRA and A/B test.' }
      : { title: 'Better prompts, examples and structured output first', why: 'With few examples, fine-tuning is unlikely to help and may hurt. Most behaviour problems are fixed with clearer instructions, 3–5 examples and a JSON schema.', cost: '≈ $0', time: 'Hours to days', next: 'Write an eval set from real failures and iterate on the prompt until it plateaus.' };
  }
  return { title: 'Generic frontier model + prompting + tools', why: 'Nothing here needs a custom model. This is how most successful agents start — and many stay here forever.', cost: 'API usage only', time: 'Days', next: 'Build the agent loop (Chapter 3), add tools (Chapter 5) and evals (Chapter 14). Revisit this decision when volume or requirements change.' };
}

function BuildOrUseWizard() {
  const [a, setA] = useState<Answers>({ gap: 'none', privacy: 'cloud-ok', volume: 'low', task: 'broad', latency: 'normal', data: 'none' });
  const rec = recommend(a);
  const Q = <K extends keyof Answers>({ k, label, options }: { k: K; label: string; options: [Answers[K], string][] }) => (
    <div>
      <div className="text-xs font-semibold text-stone-400">{label}</div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map(([v, l]) => (
          <button
            key={String(v)}
            onClick={() => setA((p) => ({ ...p, [k]: v }))}
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${a[k] === v ? 'border-amber-400 bg-amber-500/15 text-white' : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-400">Interactive · Do you need your own model?</div>
        <h3 className="font-display text-base font-bold text-white">Answer six questions and get a recommendation</h3>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-12">
        <div className="space-y-3.5 lg:col-span-6">
          <Q k="gap" label="1. What is going wrong with a generic model today?" options={[['none', 'Nothing yet'], ['knowledge', 'It lacks our facts/docs'], ['behaviour', 'Wrong format/style/skill']]} />
          <Q k="privacy" label="2. Where may your data be processed?" options={[['cloud-ok', 'Trusted cloud API is fine'], ['own-infra', 'Only on our own infra']]} />
          <Q k="volume" label="3. Monthly volume" options={[['low', '< 100M tokens'], ['medium', '100M–2B'], ['high', '> 2B tokens']]} />
          <Q k="task" label="4. What kind of task?" options={[['broad', 'Broad / open-ended'], ['narrow', 'Narrow & repetitive']]} />
          <Q k="latency" label="5. Latency / deployment" options={[['normal', 'Normal (1–3 s ok)'], ['edge', 'On-device, offline or < 100 ms']]} />
          <Q k="data" label="6. Good labelled examples you have" options={[['none', 'None'], ['hundreds', 'Hundreds'], ['thousands', 'Thousands+']]} />
        </div>
        <motion.div key={rec.title} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5 lg:col-span-6">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-emerald-400">Recommendation</div>
          <h4 className="mt-1 font-display text-lg font-bold text-white">{rec.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">{rec.why}</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-lg bg-stone-900 p-2.5"><div className="text-stone-500">Typical cost</div><div className="mt-0.5 font-semibold text-stone-100">{rec.cost}</div></div>
            <div className="rounded-lg bg-stone-900 p-2.5"><div className="text-stone-500">Typical time</div><div className="mt-0.5 font-semibold text-stone-100">{rec.time}</div></div>
          </div>
          <p className="mt-3 text-sm text-stone-200"><strong className="text-emerald-300">Next step: </strong>{rec.next}</p>
          <p className="mt-auto pt-4 text-[11px] text-stone-500">Pre-training from scratch is almost never the answer outside frontier labs — see the cost table below.</p>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Fine-tuning cost & time estimator                                 */
/* ------------------------------------------------------------------ */
const FT_MODELS = [
  { label: '1B', sub: 'Gemma 3 1B · Llama 3.2 1B', p: 1 },
  { label: '8B', sub: 'Llama 3.1 8B · Qwen2.5 7B', p: 8 },
  { label: '30B', sub: 'Gemma 3 27B · Qwen 32B', p: 30 },
  { label: '70B', sub: 'Llama 3.3 70B', p: 70 },
];
const GPUS = [
  { id: 'l4', label: 'NVIDIA L4', mem: 24, tflops: 121, price: 0.7 },
  { id: 'a100', label: 'NVIDIA A100 80GB', mem: 80, tflops: 312, price: 3 },
  { id: 'h100', label: 'NVIDIA H100 80GB', mem: 80, tflops: 989, price: 4 },
];
const METHODS = [
  { id: 'qlora', label: 'QLoRA (4-bit base + adapter)', bytesPerParam: 0.7, flopsPerParamToken: 4, slowdown: 1.3 },
  { id: 'lora', label: 'LoRA (16-bit base + adapter)', bytesPerParam: 2.2, flopsPerParamToken: 4, slowdown: 1 },
  { id: 'full', label: 'Full fine-tune (all weights)', bytesPerParam: 18, flopsPerParamToken: 6, slowdown: 1 },
];
const EXAMPLE_STEPS = [1000, 2000, 5000, 10000, 25000, 50000, 100000];

function formatDuration(hours: number) {
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 48) return `${hours.toFixed(1)} h`;
  return `${(hours / 24).toFixed(1)} days`;
}

function FineTuneEstimator() {
  const [modelIdx, setModelIdx] = useState(1);
  const [gpuId, setGpuId] = useState('l4');
  const [methodId, setMethodId] = useState('qlora');
  const [exIdx, setExIdx] = useState(3);
  const [epochs, setEpochs] = useState(2);
  const [price, setPrice] = useState(0.7);

  const model = FT_MODELS[modelIdx];
  const gpu = GPUS.find((g) => g.id === gpuId)!;
  const method = METHODS.find((m) => m.id === methodId)!;
  const examples = EXAMPLE_STEPS[exIdx];
  const tokens = examples * 800 * epochs;

  const r = useMemo(() => {
    const memGB = model.p * method.bytesPerParam * 1.2 + 4;
    const gpus = Math.max(1, Math.ceil(memGB / gpu.mem));
    const flops = method.flopsPerParamToken * model.p * 1e9 * tokens * method.slowdown;
    // ~35% utilisation on one GPU; communication overhead lowers efficiency as you add GPUs
    const scaling = gpus === 1 ? 1 : gpus <= 8 ? 0.85 : 0.6;
    const effective = gpus * gpu.tflops * 1e12 * 0.35 * scaling;
    const hours = flops / effective / 3600;
    return { memGB, gpus, hours, cost: hours * gpus * price };
  }, [model, method, gpu, tokens, price]);

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-emerald-400">Interactive · Fine-tuning estimator</div>
        <h3 className="font-display text-base font-bold text-white">How much GPU memory, time and money does fine-tuning take?</h3>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div>
            <div className="text-xs font-semibold text-stone-400">Base model size</div>
            <div className="mt-1.5 grid grid-cols-4 gap-1.5">
              {FT_MODELS.map((m, i) => (
                <button key={m.label} onClick={() => setModelIdx(i)} className={`rounded-lg border p-2 text-left ${i === modelIdx ? 'border-emerald-400 bg-emerald-500/15' : 'border-stone-800 bg-stone-900 hover:border-stone-700'}`}>
                  <div className="text-sm font-bold text-white">{m.label}</div>
                  <div className="text-[10px] leading-tight text-stone-400">{m.sub}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-400">Method</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {METHODS.map((m) => (
                <button key={m.id} onClick={() => setMethodId(m.id)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${m.id === methodId ? 'border-emerald-400 bg-emerald-500/15 text-white' : 'border-stone-800 bg-stone-900 text-stone-400'}`}>{m.label}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-400">GPU type</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {GPUS.map((g) => (
                <button key={g.id} onClick={() => { setGpuId(g.id); setPrice(g.price); }} className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${g.id === gpuId ? 'border-emerald-400 bg-emerald-500/15 text-white' : 'border-stone-800 bg-stone-900 text-stone-400'}`}>
                  {g.label} <span className="text-stone-500">· {g.mem} GB</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="rounded-lg border border-stone-800 bg-stone-900 p-2.5 text-xs">
              <div className="flex justify-between text-stone-400"><span>Training examples</span><strong className="font-mono text-emerald-300">{examples.toLocaleString()}</strong></div>
              <input type="range" min={0} max={EXAMPLE_STEPS.length - 1} value={exIdx} onChange={(e) => setExIdx(Number(e.target.value))} className="mt-2 w-full accent-emerald-400" />
            </label>
            <label className="rounded-lg border border-stone-800 bg-stone-900 p-2.5 text-xs">
              <div className="flex justify-between text-stone-400"><span>Epochs</span><strong className="font-mono text-emerald-300">{epochs}</strong></div>
              <input type="range" min={1} max={5} value={epochs} onChange={(e) => setEpochs(Number(e.target.value))} className="mt-2 w-full accent-emerald-400" />
            </label>
            <label className="rounded-lg border border-stone-800 bg-stone-900 p-2.5 text-xs">
              <div className="text-stone-400">$ per GPU-hour</div>
              <input type="number" min={0} step={0.1} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1.5 w-full rounded bg-stone-800 px-2 py-1 font-mono text-sm text-white outline-none" />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-5">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-3"><div className="text-[11px] text-stone-400">GPU memory needed</div><div className="mt-1 font-mono text-xl font-bold text-white">{Math.round(r.memGB)} GB</div></div>
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-3"><div className="text-[11px] text-stone-400">GPUs required</div><div className={`mt-1 font-mono text-xl font-bold ${r.gpus > 8 ? 'text-rose-400' : 'text-white'}`}>{r.gpus}× {gpu.label.replace('NVIDIA ', '')}</div></div>
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-3"><div className="text-[11px] text-stone-400">Training time</div><div className="mt-1 font-mono text-xl font-bold text-amber-300">{formatDuration(r.hours)}</div></div>
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-3"><div className="text-[11px] text-stone-400">Compute cost / run</div><div className="mt-1 font-mono text-xl font-bold text-emerald-300">${r.cost < 10 ? r.cost.toFixed(2) : Math.round(r.cost).toLocaleString()}</div></div>
          </div>
          {r.gpus > 8 && (
            <div className="rounded-xl border border-rose-500/50 bg-rose-500/10 p-3 text-xs leading-relaxed text-rose-200">
              <strong>Not practical on this setup.</strong> More than 8 GPUs means a multi-machine cluster with fast interconnects,
              which is a specialist job. Choose a bigger GPU (H100), switch to LoRA/QLoRA, or pick a smaller model.
            </div>
          )}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 text-[11px] leading-relaxed text-stone-400">
            {(tokens / 1e6).toFixed(1)}M training tokens (≈800 tokens per example × {epochs} epochs). Rule of thumb: training costs ~6 × parameters × tokens operations (≈4× for LoRA), at ~35% GPU utilisation.
            {r.gpus > 1 && r.gpus <= 8 && ' Multiple GPUs mean sharding the model (FSDP / DeepSpeed) — more engineering.'}
            <br />
            <strong className="text-stone-300">Reality check:</strong> real projects take 1.5–3× longer, you will run several experiments, and preparing good data usually costs more time than the training itself.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. CPU vs GPU animation                                              */
/* ------------------------------------------------------------------ */
const CELLS = 96;
function CpuVsGpu() {
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const cpuDone = Math.min(CELLS, tick * 4);
  const gpuDone = Math.min(CELLS, tick * 48);

  useEffect(() => {
    if (!running) return;
    if (cpuDone >= CELLS) { setRunning(false); return; }
    const t = setTimeout(() => setTick((v) => v + 1), 160);
    return () => clearTimeout(t);
  }, [running, tick, cpuDone]);

  const Grid = ({ done, color }: { done: number; color: string }) => (
    <div className="grid grid-cols-12 gap-1">
      {Array.from({ length: CELLS }, (_, i) => (
        <div key={i} className="aspect-square rounded-[3px] transition-colors duration-150" style={{ backgroundColor: i < done ? color : '#292524' }} />
      ))}
    </div>
  );

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div>
          <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-400">Animated · Why GPUs?</div>
          <h3 className="font-display text-base font-bold text-white">The same matrix multiplication on a CPU vs a GPU</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { if (cpuDone >= CELLS) setTick(0); setRunning((r) => !r); }} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500">
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {running ? 'Pause' : 'Run'}
          </button>
          <button onClick={() => { setRunning(false); setTick(0); }} className="rounded-lg bg-stone-800 p-1.5 text-stone-300 hover:bg-stone-700" aria-label="Reset"><RotateCcw className="h-3.5 w-3.5" /></button>
        </div>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-2">
        <div>
          <div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-white">CPU · a few powerful cores</span><span className="font-mono text-stone-400">step {Math.ceil(cpuDone / 4)}</span></div>
          <Grid done={cpuDone} color="#f59e0b" />
          <p className="mt-2 text-[11px] text-stone-400">Great at complicated, branching logic. Does a handful of multiply-adds at a time.</p>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-xs"><span className="font-semibold text-white">GPU · thousands of simple cores</span><span className="font-mono text-stone-400">step {Math.ceil(gpuDone / 48)}</span></div>
          <Grid done={gpuDone} color="#22d3ee" />
          <p className="mt-2 text-[11px] text-stone-400">Runs the same simple maths on huge blocks of numbers at once. Finished while the CPU is still starting.</p>
        </div>
      </div>
      <p className="border-t border-stone-800 px-5 py-3 text-[11px] text-stone-500">
        Each square is one multiply-add. Simplified: the real gap for large matrices is far bigger — a modern data-centre GPU performs hundreds of trillions of these operations per second.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Self-host vs API break-even                                       */
/* ------------------------------------------------------------------ */
const VOLUMES = [10e6, 100e6, 500e6, 1e9, 2e9, 5e9, 20e9];
const SETUPS = [
  { id: 'l4-8b', label: '8B model on 1× L4', perHour: 0.7, tps: 1200 },
  { id: 'h100-8b', label: '8B model on 1× H100', perHour: 4, tps: 6000 },
  { id: 'h100-70b', label: '70B model on 2× H100', perHour: 8, tps: 2000 },
];
function fmtTokens(t: number) {
  return t >= 1e9 ? `${t / 1e9}B` : `${t / 1e6}M`;
}
function BreakEven() {
  const [vIdx, setVIdx] = useState(3);
  const [apiPrice, setApiPrice] = useState(0.5);
  const [setupId, setSetupId] = useState('l4-8b');
  const [util, setUtil] = useState(50);
  const setup = SETUPS.find((s) => s.id === setupId)!;
  const volume = VOLUMES[vIdx];
  const capacity = setup.tps * 3600 * 730 * (util / 100);
  const replicas = Math.max(1, Math.ceil(volume / capacity));
  const selfCost = replicas * setup.perHour * 730;
  const apiCost = (volume / 1e6) * apiPrice;
  const cheaper = selfCost < apiCost ? 'self' : 'api';
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-400">Interactive · Running costs</div>
        <h3 className="font-display text-base font-bold text-white">When does running your own model beat paying per token?</h3>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-2">
        <div className="space-y-4 text-xs">
          <label className="block">
            <div className="flex justify-between text-stone-400"><span>Tokens per month</span><strong className="font-mono text-amber-300">{fmtTokens(volume)}</strong></div>
            <input type="range" min={0} max={VOLUMES.length - 1} value={vIdx} onChange={(e) => setVIdx(Number(e.target.value))} className="mt-2 w-full accent-amber-400" />
          </label>
          <label className="block">
            <div className="text-stone-400">API price you would pay ($ per 1M tokens, blended in+out)</div>
            <input type="number" step={0.1} min={0} value={apiPrice} onChange={(e) => setApiPrice(Number(e.target.value))} className="mt-1.5 w-28 rounded bg-stone-800 px-2 py-1 font-mono text-sm text-white outline-none" />
          </label>
          <div>
            <div className="text-stone-400">Self-hosted setup (always on)</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {SETUPS.map((s) => (
                <button key={s.id} onClick={() => setSetupId(s.id)} className={`rounded-lg border px-2.5 py-1.5 font-semibold ${s.id === setupId ? 'border-amber-400 bg-amber-500/15 text-white' : 'border-stone-800 bg-stone-900 text-stone-400'}`}>{s.label}</button>
              ))}
            </div>
          </div>
          <label className="block">
            <div className="flex justify-between text-stone-400"><span>Average GPU utilisation</span><strong className="font-mono text-amber-300">{util}%</strong></div>
            <input type="range" min={10} max={90} step={5} value={util} onChange={(e) => setUtil(Number(e.target.value))} className="mt-2 w-full accent-amber-400" />
          </label>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`rounded-xl border p-3 ${cheaper === 'api' ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-stone-800 bg-stone-900'}`}><div className="text-[11px] text-stone-400">API cost / month</div><div className="mt-1 font-mono text-xl font-bold text-white">${Math.round(apiCost).toLocaleString()}</div></div>
            <div className={`rounded-xl border p-3 ${cheaper === 'self' ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-stone-800 bg-stone-900'}`}><div className="text-[11px] text-stone-400">Self-host GPUs / month</div><div className="mt-1 font-mono text-xl font-bold text-white">${Math.round(selfCost).toLocaleString()}</div><div className="text-[10px] text-stone-500">{replicas} replica{replicas > 1 ? 's' : ''}</div></div>
          </div>
          <p className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 text-xs leading-relaxed text-stone-300">
            {cheaper === 'api'
              ? 'At this volume the API is cheaper — you would be paying for idle GPUs. Self-host only if privacy, latency or control require it.'
              : 'At this volume self-hosting is cheaper on GPU cost alone. Remember to add engineering time for serving, scaling, monitoring and upgrades.'}
          </p>
          <p className="text-[10px] text-stone-500">Throughput figures are rough aggregate numbers with request batching (vLLM). Benchmark your own model, prompt lengths and hardware before deciding.</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter                                                              */
/* ------------------------------------------------------------------ */
export function ChapterOwnModel(_props: { isCompleted: boolean; onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Open weights"
        title="What Is an Open-Weight Model?"
        description="A trained model is just files: a config describing the architecture, a tokenizer, and the weights. When a company publishes those files, anyone can download, run and modify the model. That's an open-weight model."
      />

      <ModelFolder />

      <div className="overflow-x-auto rounded-xl border border-[#E5DFD3] dark:border-stone-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F4ECDB] text-[11px] uppercase tracking-wider text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr><th className="px-4 py-3">Type</th><th className="px-4 py-3">What you get</th><th className="px-4 py-3">Examples</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-[#FFFDF9] dark:divide-stone-800 dark:bg-stone-950/60">
            {[
              ['Closed (API only)', 'Access through an API. You never see the weights; the provider runs and updates the model.', 'Gemini, GPT, Claude'],
              ['Open-weight', 'Downloadable weights under a licence. Training data and full training code are usually not published.', 'Llama (community licence), Gemma (Gemma terms), Qwen (mostly Apache 2.0), DeepSeek (MIT), Mistral (some Apache 2.0)'],
              ['Fully open source', 'Weights, training code and training data are all published, so the model can be reproduced.', 'Ai2 OLMo, and other research models'],
            ].map(([a, b, c]) => (
              <tr key={a}><td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">{a}</td><td className="px-4 py-3 text-stone-600 dark:text-stone-300">{b}</td><td className="px-4 py-3 text-stone-600 dark:text-stone-300">{c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="warning" title="Always read the licence">
        &ldquo;Open&rdquo; does not automatically mean &ldquo;do anything you like&rdquo;. Apache 2.0 and MIT are very permissive.
        Custom licences (e.g. Llama&apos;s community licence or Gemma&apos;s terms) add conditions such as acceptable-use
        rules, attribution or limits for very large companies. Check before you ship.
      </Callout>

      <SectionHeader
        eyebrow="The big decision"
        title="Generic Model + Agent, or Your Own Model?"
        description="Most successful agents use a generic frontier model with good prompts, tools and retrieval. Training or hosting your own model is a tool for specific problems — not a starting point."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <h3 className="font-display text-base font-bold text-stone-950 dark:text-white">Good reasons to run or train your own</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-stone-700 dark:text-stone-300">
            <li><strong>Data can&apos;t leave your environment</strong> — regulated, air-gapped or contractual limits.</li>
            <li><strong>Very high, steady volume</strong> on a narrow task, where a small tuned model is far cheaper per request.</li>
            <li><strong>Latency or offline needs</strong> — on-device, edge, or sub-100 ms responses.</li>
            <li><strong>Consistent specialised behaviour</strong> — a format, style or skill that prompting can&apos;t make reliable.</li>
            <li><strong>Control</strong> — a model version that never changes under you, and no vendor lock-in.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-[#F3D7D4] bg-[#FDF4F3] p-5 dark:border-[#4D2421] dark:bg-[#2A1615]">
          <h3 className="font-display text-base font-bold text-stone-950 dark:text-white">Bad reasons (common mistakes)</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-stone-700 dark:text-stone-300">
            <li><strong>&ldquo;To teach it our documents.&rdquo;</strong> Use RAG — fine-tuning is a poor, stale way to store facts.</li>
            <li><strong>&ldquo;It&apos;ll be cheaper.&rdquo;</strong> Not at low volume: idle GPUs cost money 24/7, plus engineering time.</li>
            <li><strong>&ldquo;It&apos;ll be smarter.&rdquo;</strong> A tuned small model won&apos;t gain the broad reasoning of a frontier model.</li>
            <li><strong>Skipping evals.</strong> Without a baseline comparison you can&apos;t tell whether training helped or hurt.</li>
          </ul>
        </div>
      </div>

      <BuildOrUseWizard />

      <SectionHeader
        eyebrow="Cost, time & accuracy"
        title="The Customisation Ladder"
        description="Each rung costs roughly 10× more than the one before. Climb only when the rung below has stopped improving your eval scores."
      />

      <div className="overflow-x-auto rounded-xl border border-[#E5DFD3] dark:border-stone-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F4ECDB] text-[11px] uppercase tracking-wider text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr><th className="px-4 py-3">Approach</th><th className="px-4 py-3">Typical cost</th><th className="px-4 py-3">Typical time</th><th className="px-4 py-3">What it improves</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-[#FFFDF9] dark:divide-stone-800 dark:bg-stone-950/60">
            {[
              ['Prompting + examples + RAG', '≈ $0 + API usage', 'Hours – days', 'Knowledge, grounding, most format issues'],
              ['Hosted fine-tuning (e.g. Vertex AI tuning)', '$10s – $1,000s', 'Hours – days', 'Format, tone, narrow task accuracy'],
              ['LoRA / QLoRA on an open model', '$5 – $500 per run (1 GPU)', 'Hours', 'Same, plus full control and private hosting'],
              ['Full fine-tune (7B–70B)', '$1,000 – $50,000+', 'Days', 'Deeper behaviour change; risk of forgetting'],
              ['Continued pre-training (new domain/language)', '$10,000 – $1M+', 'Weeks', 'New vocabulary and domain knowledge at scale'],
              ['Pre-training from scratch', '$ millions – $100M+', 'Months', 'A brand-new foundation model'],
            ].map(([a, b, c, d]) => (
              <tr key={a}><td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">{a}</td><td className="px-4 py-3 font-mono text-xs text-stone-700 dark:text-stone-300">{b}</td><td className="px-4 py-3 text-stone-600 dark:text-stone-300">{c}</td><td className="px-4 py-3 text-stone-600 dark:text-stone-300">{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<Server className="h-4 w-4" />} title="Llama 3.1 (Meta)" badge="Pre-training">
          Meta&apos;s model card reports about <strong>1.46M H100 GPU-hours</strong> to pre-train the 8B model and about{' '}
          <strong>30.8M</strong> for the 405B model.
        </ConceptCard>
        <ConceptCard icon={<Server className="h-4 w-4" />} title="DeepSeek-V3" badge="Pre-training">
          The technical report cites about <strong>2.79M H800 GPU-hours</strong> (≈ $5.6M at their assumed rental price) for the
          final training run alone — excluding research and failed experiments.
        </ConceptCard>
        <ConceptCard icon={<Zap className="h-4 w-4" />} title="nanochat (Karpathy)" badge="Learning project">
          An educational repo that trains a small ChatGPT-style model end to end in about <strong>4 hours on one 8×H100 node
          (~$100)</strong>. Brilliant for learning — but a toy next to frontier models.
        </ConceptCard>
      </div>

      <Callout type="insight" title="What accuracy should you expect?">
        <ul className="list-disc space-y-1 pl-5">
          <li>A small model fine-tuned on a few thousand <strong>high-quality</strong> examples can match or beat a much larger general model on a <strong>narrow</strong> task (classification, extraction, a fixed format).</li>
          <li>It will <strong>not</strong> gain broad reasoning or world knowledge, and can get worse at things outside its training data (&ldquo;catastrophic forgetting&rdquo;).</li>
          <li>Data quality beats quantity: 1,000 clean, verified examples usually beat 50,000 noisy ones.</li>
          <li>Always compare against a well-prompted frontier model on the <strong>same eval set</strong> before celebrating.</li>
        </ul>
      </Callout>

      <FineTuneEstimator />

      <SectionHeader
        eyebrow="Hardware"
        title="Why GPUs Are Required"
        description="Almost all the work inside an LLM is multiplying big grids of numbers (matrices). Each multiplication is simple, but there are trillions of them. CPUs are built for complex tasks one after another; GPUs are built to do huge amounts of simple maths at the same time."
      />

      <CpuVsGpu />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<Cpu className="h-4 w-4" />} title="Massive parallelism" badge="Cores">
          A CPU has a few to a few dozen powerful cores; a data-centre GPU has thousands of simpler cores plus special{' '}
          <strong>tensor cores</strong> built just for matrix maths.
        </ConceptCard>
        <ConceptCard icon={<Database className="h-4 w-4" />} title="Memory bandwidth" badge="HBM">
          Generating each token means reading every weight from memory. GPUs use high-bandwidth memory (an H100 moves ~3 TB/s,
          roughly 30× a typical desktop CPU&apos;s RAM), so tokens come out fast.
        </ConceptCard>
        <ConceptCard icon={<Zap className="h-4 w-4" />} title="Low-precision maths" badge="BF16 / FP8">
          GPUs run 16-bit and 8-bit number formats very fast. Models don&apos;t need 64-bit precision, so this is free speed.
        </ConceptCard>
      </div>

      <Callout type="architecture" title="How much compute are we talking about?">
        Rule of thumb: generating one token costs about <strong>2 × parameters</strong> operations, and training costs about{' '}
        <strong>6 × parameters × training tokens</strong>. Pre-training an 8B model on 15 trillion tokens is roughly{' '}
        6 × 8B × 15T ≈ <strong>7 × 10²³</strong> operations — impossible on CPUs in any reasonable time, and months even on thousands of GPUs.
      </Callout>

      <SectionHeader eyebrow="Hardware guide" title="Which GPU for What?" description="You don't need the biggest GPU. Match the GPU's memory to the model you want to run or train." />

      <div className="overflow-x-auto rounded-xl border border-[#E5DFD3] dark:border-stone-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F4ECDB] text-[11px] uppercase tracking-wider text-stone-600 dark:bg-stone-900 dark:text-stone-400">
            <tr><th className="px-4 py-3">Accelerator</th><th className="px-4 py-3">Memory</th><th className="px-4 py-3">Good for</th><th className="px-4 py-3">Where to get it</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-[#FFFDF9] dark:divide-stone-800 dark:bg-stone-950/60">
            {[
              ['NVIDIA T4', '16 GB', 'Learning, small models, QLoRA on ≤ 8B', 'Free in Google Colab and Kaggle notebooks'],
              ['NVIDIA L4', '24 GB', 'Serving 7–8B models, QLoRA fine-tuning', 'Google Cloud G2 VMs, Cloud Run GPUs'],
              ['NVIDIA A100', '40 / 80 GB', 'Fine-tuning up to ~30B, serving larger models', 'Google Cloud A2 VMs, most GPU clouds'],
              ['NVIDIA H100 / H200', '80 / 141 GB', 'Serious training and high-throughput serving', 'Google Cloud A3 VMs, GPU clouds'],
              ['NVIDIA B200 / GB200', '~180+ GB', 'Frontier-scale training and inference', 'Google Cloud A4 VMs, large clusters'],
              ['Google Cloud TPU', 'varies by generation', 'Large-scale training and serving (JAX, PyTorch/XLA, vLLM)', 'Google Cloud (v5e, v6e Trillium, Ironwood)'],
              ['Apple Silicon (M-series)', 'shared RAM', 'Running quantized models locally', 'Your Mac, with Ollama, LM Studio or MLX'],
            ].map(([a, b, c, d]) => (
              <tr key={a}><td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">{a}</td><td className="px-4 py-3 font-mono text-xs text-stone-700 dark:text-stone-300">{b}</td><td className="px-4 py-3 text-stone-600 dark:text-stone-300">{c}</td><td className="px-4 py-3 text-stone-600 dark:text-stone-300">{d}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 dark:border-stone-800 dark:bg-stone-900/70">
        <h3 className="font-display text-base font-bold text-stone-950 dark:text-white">GPU memory rules of thumb</h3>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Run in 16-bit', '2 bytes / parameter', '8B → ~16 GB'],
            ['Run in 4-bit', '~0.5–0.7 bytes / parameter', '8B → ~5 GB, 70B → ~40 GB'],
            ['QLoRA fine-tune', '~0.7 bytes / param + extras', '8B → fits a 16–24 GB GPU'],
            ['Full fine-tune (Adam)', '~16–18 bytes / parameter', '8B → ~140 GB → 2+ H100s'],
          ].map(([t, rule, ex]) => (
            <div key={t} className="rounded-lg bg-[#FAF7F0] p-3 dark:bg-stone-950">
              <div className="font-semibold text-stone-900 dark:text-stone-100">{t}</div>
              <div className="font-mono text-xs text-[#D94436]">{rule}</div>
              <div className="mt-1 text-xs text-stone-600 dark:text-stone-400">{ex}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">Add headroom for the KV cache when serving — longer contexts and more concurrent users need more memory.</p>
      </div>

      <SectionHeader eyebrow="Hands-on" title="How to Use GPUs in Practice" description="You never program GPU cores directly. Libraries like PyTorch, JAX, vLLM and Unsloth do that for you — your job is to get access to a GPU, move the model onto it and keep it busy." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          ['1. Start free', 'Open a Google Colab or Kaggle notebook and switch the runtime to a T4 GPU.'],
          ['2. Check the GPU', 'Run nvidia-smi to see memory, utilisation and temperature.'],
          ['3. Move work to it', 'In PyTorch, put the model and tensors on "cuda" and use bf16.'],
          ['4. Scale up', 'Rent cloud GPUs; shard across many with FSDP/DeepSpeed; use spot VMs with checkpoints to save 60–90%.'],
        ].map(([t, d]) => (
          <ConceptCard key={t} title={t}>{d}</ConceptCard>
        ))}
      </div>

      <CodeBlock
        title="Talking to a GPU"
        tabs={[
          { label: 'Check the GPU', language: 'bash', code: `nvidia-smi
# +-----------------------------------------------------------+
# | GPU  Name        Memory-Usage        GPU-Util              |
# |  0   NVIDIA L4   3120MiB / 23034MiB  97%                   |
# +-----------------------------------------------------------+
# Low GPU-Util while training? Your data loading is the bottleneck.` },
          { label: 'PyTorch basics', language: 'python', code: `import torch

print(torch.cuda.is_available(), torch.cuda.get_device_name(0))

device = "cuda"
x = torch.randn(8192, 8192, device=device, dtype=torch.bfloat16)
w = torch.randn(8192, 8192, device=device, dtype=torch.bfloat16)

y = x @ w   # ~1.1 trillion operations — milliseconds on a modern GPU
torch.cuda.synchronize()
print(torch.cuda.max_memory_allocated() / 1e9, "GB used")` },
          { label: 'Multi-GPU training', language: 'bash', code: `# Hugging Face Accelerate handles multi-GPU setup for you
pip install accelerate
accelerate config            # choose: multi-GPU, bf16, FSDP (shards the model across GPUs)
accelerate launch train.py   # same script now runs on every GPU in the machine

# Inference: split one big model across GPUs with tensor parallelism
vllm serve meta-llama/Llama-3.3-70B-Instruct --tensor-parallel-size 2` },
          { label: 'GPU VM on Google Cloud', language: 'bash', code: `# A spot VM with one L4 GPU (much cheaper; can be pre-empted, so checkpoint often)
gcloud compute instances create ft-box \\
  --zone=us-central1-a \\
  --machine-type=g2-standard-8 \\
  --accelerator=type=nvidia-l4,count=1 \\
  --provisioning-model=SPOT \\
  --image-family=common-cu124-debian-11 --image-project=deeplearning-platform-release \\
  --boot-disk-size=200GB \\
  --metadata=install-nvidia-driver=True` },
        ]}
      />

      <SectionHeader eyebrow="End to end" title="Train, Run and Deploy Your Own Model" description="Here is the complete path from a dataset to a fine-tuned model your agent can call — using open tools. It follows the same steps whether you fine-tune a 1B or a 70B model." />

      <div className="grid gap-3 md:grid-cols-6">
        {['1. Data', '2. Fine-tune', '3. Evaluate', '4. Package', '5. Deploy', '6. Connect agent'].map((s, i) => (
          <div key={s} className="relative rounded-lg border border-[#E5DFD3] bg-[#FFFDF9] p-3 text-center text-xs font-bold text-stone-900 dark:border-stone-800 dark:bg-stone-900/70 dark:text-stone-100">
            <span className="block font-mono text-[10px] text-[#D94436]">STEP {i + 1}</span>
            {s.slice(3)}
          </div>
        ))}
      </div>

      <CodeBlock
        title="Steps 1–3"
        tabs={[
          { label: '1 · train.jsonl', language: 'json', code: `{"messages": [
  {"role": "system", "content": "You classify support tickets. Reply with JSON only."},
  {"role": "user", "content": "My package is 9 days late and I want my money back."},
  {"role": "assistant", "content": "{\\"category\\": \\"shipping\\", \\"action\\": \\"refund_review\\", \\"urgency\\": 3}"}
]}
{"messages": [ ...one conversation per line, 1,000–10,000 lines... ]}

// Tips: use real (anonymised) examples, keep a separate held-out test file,
// and fix inconsistent labels — the model will copy your mistakes.` },
          { label: '2 · fine-tune (Unsloth)', language: 'python', code: `# Runs on a single 16–24 GB GPU (Colab T4 / L4) thanks to 4-bit QLoRA
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Qwen2.5-7B-Instruct",
    max_seq_length=4096,
    load_in_4bit=True,          # QLoRA: frozen 4-bit base
)
model = FastLanguageModel.get_peft_model(
    model, r=16, lora_alpha=16,  # small trainable adapter (<1% of weights)
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
)

dataset = load_dataset("json", data_files="train.jsonl", split="train")
trainer = SFTTrainer(
    model=model,
    processing_class=tokenizer,
    train_dataset=dataset,
    args=SFTConfig(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=8,
        num_train_epochs=2,
        learning_rate=2e-4,
        output_dir="checkpoints",
    ),
)
trainer.train()

# Merge the adapter into the base weights for easy serving
model.save_pretrained_merged("support-model", tokenizer, save_method="merged_16bit")` },
          { label: '3 · evaluate vs baseline', language: 'python', code: `import json

test = [json.loads(l) for l in open("test.jsonl")]   # never used in training

def accuracy(generate_fn):
    correct = 0
    for ex in test:
        prompt, expected = ex["messages"][:-1], json.loads(ex["messages"][-1]["content"])
        try:
            got = json.loads(generate_fn(prompt))
            correct += got["category"] == expected["category"]
        except json.JSONDecodeError:
            pass                                   # invalid JSON counts as wrong
    return correct / len(test)

print("frontier model + prompt:", accuracy(call_frontier_api))
print("fine-tuned 7B         :", accuracy(call_my_model))
# Ship only if the tuned model is as good (or better) AND cheaper/faster.` },
        ]}
      />

      <CodeBlock
        title="Steps 4–6"
        tabs={[
          { label: '4 · run locally', language: 'bash', code: `# Option A — Ollama (easiest; Mac, Linux, Windows)
ollama run gemma3:12b                       # try any open model in one command
# For your own model: export GGUF (e.g. Unsloth save_pretrained_gguf), then:
#   Modelfile:  FROM ./support-model.gguf
ollama create support-model -f Modelfile
ollama run support-model

# Option B — vLLM (production-grade, OpenAI-compatible API on :8000)
pip install vllm
vllm serve ./support-model --served-model-name support-v1 --max-model-len 8192` },
          { label: '5 · deploy on Cloud Run GPU', language: 'bash', code: `# 1. Upload the merged model to Cloud Storage
gcloud storage cp -r ./support-model gs://my-models-bucket/support-model

# 2. Serve it with the official vLLM image on a serverless L4 GPU
gcloud run deploy support-model \\
  --image=vllm/vllm-openai:latest \\
  --region=us-central1 \\
  --gpu=1 --gpu-type=nvidia-l4 \\
  --cpu=8 --memory=32Gi --no-cpu-throttling \\
  --max-instances=3 --port=8000 \\
  --add-volume=name=models,type=cloud-storage,bucket=my-models-bucket \\
  --add-volume-mount=volume=models,mount-path=/models \\
  --args="--model=/models/support-model,--served-model-name=support-v1,--max-model-len=8192" \\
  --no-allow-unauthenticated

# Other options: Vertex AI Model Garden (one-click deploy of open models to an endpoint)
# or GKE with vLLM for large, always-on fleets.` },
          { label: '6 · use it in an ADK agent', language: 'python', code: `# vLLM speaks the OpenAI API, so any framework can use your model.
from google.adk.agents import LlmAgent
from google.adk.models.lite_llm import LiteLlm

triage_agent = LlmAgent(
    name="ticket_triage",
    model=LiteLlm(
        model="openai/support-v1",                          # served-model-name
        api_base="https://support-model-xyz.a.run.app/v1",  # your Cloud Run URL
        api_key="unused",                                   # auth via IAM / ID token in practice
    ),
    instruction="Classify the ticket and choose the next action.",
    tools=[lookup_order, create_refund_review],
)

# Common pattern: your cheap tuned model handles triage,
# and a frontier model handles the hard cases (model routing, Chapter 7).` },
        ]}
      />

      <BreakEven />

      <Callout type="tip" title="A sensible path for most teams">
        <ol className="list-decimal space-y-1 pl-5">
          <li>Build the agent with a frontier API and collect real traffic plus an eval set.</li>
          <li>If cost, privacy or latency becomes a real problem, try an off-the-shelf open-weight model first.</li>
          <li>Only if that falls short on your evals, fine-tune it with LoRA using your best production examples.</li>
          <li>Route: tuned small model for the common case, frontier model for the hard tail.</li>
        </ol>
      </Callout>

      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        Self-hosting moves security and uptime onto you: patch serving images, lock down endpoints with IAM, and monitor GPU health.
      </div>
    </div>
  );
}
