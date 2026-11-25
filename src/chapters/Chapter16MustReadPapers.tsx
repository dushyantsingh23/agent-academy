import React, { useState, useEffect } from 'react';
import { BookOpen, CheckSquare, Square, ExternalLink, Sparkles } from 'lucide-react';
import { Callout, SectionHeader } from '../components/UI';
import { PapersExplorerLab } from '../components/diagrams/PapersExplorerLab';

interface Paper {
  id: string;
  era: 'Foundations' | 'Reasoning & Alignment' | 'Agents & Tool Use';
  year: number;
  title: string;
  authors: string;
  coreIdea: string;
  agentImpact: string;
  arxiv: string;
}

const PAPERS: Paper[] = [
  {
    id: 'attention',
    era: 'Foundations',
    year: 2017,
    title: 'Attention Is All You Need',
    authors: 'Vaswani et al. (Google Brain)',
    coreIdea: 'Replaced recurrent RNNs/LSTMs with the Transformer: Multi-Head Scaled Dot-Product Attention (Softmax(QKᵀ/√dₖ)V) + parallel sequence processing.',
    agentImpact: 'The bedrock of every modern LLM. Understanding Q/K/V attention directly explains why context windows are O(n²), why KV caching works, and why Context Rot occurs.',
    arxiv: 'https://arxiv.org/abs/1706.03762',
  },
  {
    id: 'scaling-laws',
    era: 'Foundations',
    year: 2020,
    title: 'Scaling Laws for Neural Language Models',
    authors: 'Kaplan et al. (OpenAI)',
    coreIdea: 'Model quality improves smoothly and predictably as you increase parameters, data and compute — following simple power laws.',
    agentImpact: 'Explains why labs invested in ever-larger models, and why capabilities that agents rely on kept arriving on schedule.',
    arxiv: 'https://arxiv.org/abs/2001.08361',
  },
  {
    id: 'gpt3',
    era: 'Foundations',
    year: 2020,
    title: 'Language Models are Few-Shot Learners (GPT-3)',
    authors: 'Brown et al. (OpenAI)',
    coreIdea: 'A 175B-parameter model can perform new tasks from just a few examples in the prompt, without any retraining.',
    agentImpact: 'Turned prompting into programming — the foundation of system prompts, few-shot examples and in-context tool descriptions.',
    arxiv: 'https://arxiv.org/abs/2005.14165',
  },
  {
    id: 'chinchilla',
    era: 'Foundations',
    year: 2022,
    title: 'Training Compute-Optimal Large Language Models (Chinchilla)',
    authors: 'Hoffmann et al. (DeepMind)',
    coreIdea: 'Showed models were massively undertrained: compute-optimal pre-training scales model parameters and training tokens roughly equally (~20 tokens/param).',
    agentImpact: 'Sparked the era of "over-trained" smaller models (Llama-8B, Qwen-7B, Gemma-9B) that are fast and cheap enough to power real-time agent loops.',
    arxiv: 'https://arxiv.org/abs/2203.15556',
  },
  {
    id: 'lora',
    era: 'Foundations',
    year: 2021,
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    authors: 'Hu et al. (Microsoft)',
    coreIdea: 'Injects trainable low-rank decomposition matrices into Transformer attention layers while freezing base weights, cutting trainable params by 10,000×.',
    agentImpact: 'Made domain-specific agent fine-tuning and multi-tenant adapter serving accessible on commodity GPUs.',
    arxiv: 'https://arxiv.org/abs/2106.09685',
  },
  {
    id: 'flash-paged',
    era: 'Foundations',
    year: 2022,
    title: 'FlashAttention (Dao et al.) & PagedAttention / vLLM (Kwon et al., 2023)',
    authors: 'Tri Dao et al. / Woosuk Kwon et al. (UC Berkeley)',
    coreIdea: 'FlashAttention tiles attention into fast GPU SRAM to avoid HBM bottlenecks; PagedAttention manages KV caches in non-contiguous OS-style virtual memory pages.',
    agentImpact: 'Enables 128K–1M long-context agents, continuous batching, and automatic prefix caching in vLLM/SGLang.',
    arxiv: 'https://arxiv.org/abs/2205.14135',
  },
  {
    id: 'rag',
    era: 'Reasoning & Alignment',
    year: 2020,
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: 'Lewis et al. (Meta AI)',
    coreIdea: 'Combines parametric memory (LLM weights) with non-parametric memory (dense vector retrieval index) at inference time.',
    agentImpact: 'Foundation of semantic agent memory, enterprise knowledge grounding, and citation verification.',
    arxiv: 'https://arxiv.org/abs/2005.11401',
  },
  {
    id: 'cot',
    era: 'Reasoning & Alignment',
    year: 2022,
    title: 'Chain-of-Thought Prompting Elicits Reasoning in LLMs',
    authors: 'Wei et al. (Google Research)',
    coreIdea: 'Generating intermediate natural-language reasoning steps before the final answer unlocks dramatic gains on multi-step arithmetic and symbolic logic.',
    agentImpact: 'Established test-time compute scaling — the direct precursor to Thinking/Reasoning models and ReAct.',
    arxiv: 'https://arxiv.org/abs/2201.11903',
  },
  {
    id: 'instruct-dpo',
    era: 'Reasoning & Alignment',
    year: 2023,
    title: 'InstructGPT (Ouyang et al., 2022) & Direct Preference Optimization (DPO)',
    authors: 'OpenAI / Rafailov et al. (Stanford)',
    coreIdea: 'InstructGPT formalized SFT → Reward Model → PPO RLHF; DPO proved you can optimize human preferences directly with a simple supervised classification loss.',
    agentImpact: 'Made LLMs reliable instruction-followers that respect system prompts, safety constraints, and user intent.',
    arxiv: 'https://arxiv.org/abs/2305.18290',
  },
  {
    id: 'deepseek-r1',
    era: 'Reasoning & Alignment',
    year: 2025,
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via RL (GRPO)',
    authors: 'DeepSeek-AI',
    coreIdea: 'Demonstrated that pure Reinforcement Learning with Verifiable Rewards (GRPO) causes models to spontaneously emerge self-verification, reflection, and backtracking.',
    agentImpact: 'Blueprint for training modern reasoning and coding agents via verifiable sandbox execution rewards.',
    arxiv: 'https://arxiv.org/abs/2501.12948',
  },
  {
    id: 'react',
    era: 'Agents & Tool Use',
    year: 2022,
    title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
    authors: 'Yao et al. (Princeton / Google)',
    coreIdea: 'Interleaves verbal reasoning traces (Thought) with environment actions (Action) and external feedback (Observation) in a closed loop.',
    agentImpact: 'The canonical control loop powering almost every modern AI agent framework today.',
    arxiv: 'https://arxiv.org/abs/2210.03629',
  },
  {
    id: 'toolformer',
    era: 'Agents & Tool Use',
    year: 2023,
    title: 'Toolformer: Language Models Can Teach Themselves to Use Tools',
    authors: 'Schick et al. (Meta AI)',
    coreIdea: 'Models learn self-supervised when to invoke calculators, search engines, and APIs by keeping only tool calls that reduce next-token perplexity.',
    agentImpact: 'Catalyzed native function calling and structured tool schemas across every frontier LLM.',
    arxiv: 'https://arxiv.org/abs/2302.04761',
  },
  {
    id: 'gen-agents',
    era: 'Agents & Tool Use',
    year: 2023,
    title: 'Generative Agents (Park et al.) & Reflexion (Shinn et al.)',
    authors: 'Stanford / Northeastern & MIT',
    coreIdea: 'Generative Agents introduced memory streams + periodic reflection + planning; Reflexion introduced verbal episodic self-critique across trials without weight updates.',
    agentImpact: 'Blueprints for long-term episodic memory banks and self-improving retry loops in production agents.',
    arxiv: 'https://arxiv.org/abs/2304.03442',
  },
  {
    id: 'tot',
    era: 'Agents & Tool Use',
    year: 2023,
    title: 'Tree of Thoughts: Deliberate Problem Solving with LLMs',
    authors: 'Yao et al. (Princeton / Google DeepMind)',
    coreIdea: 'Instead of one chain of reasoning, explore several branches, evaluate them, and backtrack from dead ends — like search in classic AI.',
    agentImpact: 'Blueprint for planning agents that try alternatives and self-evaluate before committing to an action.',
    arxiv: 'https://arxiv.org/abs/2305.10601',
  },
  {
    id: 'benchmarks',
    era: 'Agents & Tool Use',
    year: 2024,
    title: 'SWE-bench (Jimenez et al., 2023) & τ-bench (Yao et al., 2024)',
    authors: 'Princeton / Sierra',
    coreIdea: 'SWE-bench tests agents on real GitHub issues verified by unit tests; τ-bench tests tool-using customer-service agents and introduced pass^k to measure consistency.',
    agentImpact: 'How the industry measures agents. Their methodology is the template for your own internal eval suites.',
    arxiv: 'https://arxiv.org/abs/2406.12045',
  },
  {
    id: 'codeact-swe',
    era: 'Agents & Tool Use',
    year: 2024,
    title: 'Executable Code Actions (CodeAct) & SWE-agent (ACI)',
    authors: 'Wang et al. / Yang et al. (Princeton)',
    coreIdea: 'CodeAct unifies agent actions into executable Python; SWE-agent introduced Agent-Computer Interfaces (ACI) — designing ergonomic CLI/editor tools specifically for LLMs.',
    agentImpact: 'Explains why coding agents (Claude Code, Devin, Antigravity) outperform rigid JSON-only bots by orders of magnitude.',
    arxiv: 'https://arxiv.org/abs/2402.01030',
  },
];

const READ_KEY = 'agentcraft_papers_read_v1';

export function Chapter16MustReadPapers({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [filter, setFilter] = useState<'All' | Paper['era']>('All');
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(READ_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(readIds));
    } catch {
      // ignore
    }
  }, [readIds]);

  const toggleRead = (id: string) =>
    setReadIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const visible = filter === 'All' ? PAPERS : PAPERS.filter((p) => p.era === filter);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Canonical Research Library"
        title="Must-Read Papers: Transformers, Attention & Agentic Milestones"
        description="Frameworks come and go every 6 months — foundational papers stay relevant for a decade. Below is the essential reading list that explains how Transformers, attention, alignment, and autonomous agents actually work under the hood."
      />

      <PapersExplorerLab />

      <SectionHeader
        eyebrow="Interactive Reading Tracker"
        title="The Seminal Papers Every AI Agent Engineer Should Read"
        description={`Track your reading progress (${readIds.length}/${PAPERS.length} marked read — saved locally in your browser).`}
      />

      {/* Era Filter */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'Foundations', 'Reasoning & Alignment', 'Agents & Tool Use'] as const).map((era) => (
          <button
            key={era}
            onClick={() => setFilter(era)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              filter === era
                ? 'border-stone-900 bg-stone-900 text-stone-50 dark:border-amber-400 dark:bg-amber-400 dark:text-stone-950'
                : 'border-stone-300 bg-[#FFFDF7] text-stone-600 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300'
            }`}
          >
            {era}
          </button>
        ))}
      </div>

      {/* Papers List */}
      <div className="space-y-3">
        {visible.map((p) => {
          const isRead = readIds.includes(p.id);
          return (
            <div
              key={p.id}
              className={`rounded-2xl border p-5 transition ${
                isRead
                  ? 'border-emerald-500/40 bg-emerald-500/[0.04] dark:bg-emerald-950/20'
                  : 'border-stone-300/80 bg-[#FFFDF7] dark:border-stone-800 dark:bg-stone-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleRead(p.id)}
                    aria-label={`Mark ${p.title} as read`}
                    className="mt-0.5 shrink-0 text-stone-400 transition hover:text-emerald-600"
                  >
                    {isRead ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="font-semibold text-amber-700 dark:text-amber-400">
                        {p.year}
                      </span>
                      <span>·</span>
                      <span>{p.era}</span>
                      <span>·</span>
                      <span>{p.authors}</span>
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-stone-950 dark:text-stone-50 sm:text-lg">
                      {p.title}
                    </h3>
                  </div>
                </div>
                <a
                  href={p.arxiv}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-stone-300/80 px-2.5 py-1 font-mono text-[11px] font-medium text-stone-600 transition hover:border-stone-900 hover:text-stone-950 dark:border-stone-700 dark:text-stone-300 dark:hover:border-amber-400 dark:hover:text-amber-300"
                >
                  arXiv <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="mt-3 grid gap-3 pl-8 text-xs leading-relaxed sm:grid-cols-2 sm:text-[13px]">
                <div className="rounded-xl bg-[#F4ECDB]/60 p-3 text-stone-700 dark:bg-stone-950/60 dark:text-stone-300">
                  <strong className="block font-mono text-[10px] uppercase tracking-wider text-stone-500">
                    Core Breakthrough
                  </strong>
                  <span className="mt-1 block">{p.coreIdea}</span>
                </div>
                <div className="rounded-xl bg-[#F4ECDB]/60 p-3 text-stone-700 dark:bg-stone-950/60 dark:text-stone-300">
                  <strong className="block font-mono text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Why It Matters for Agents
                  </strong>
                  <span className="mt-1 block">{p.agentImpact}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Callout type="tip" title="How to Read ML Papers Fast (3-Pass Method)">
        <p>
          <strong>Pass 1 (5 min):</strong> Read Abstract, Figures, and Conclusion.{' '}
          <strong>Pass 2 (15 min):</strong> Study the method diagram, key equations, and ablation tables
          (ablations show what <em>actually</em> drove the gains!).{' '}
          <strong>Pass 3 (Optional):</strong> Re-implement the core loop or attention block in 40 lines
          of PyTorch to lock in intuition permanently.
        </p>
      </Callout>
    </div>
  );
}
