import React, { useEffect, useState } from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Callout, ConceptCard, SectionHeader } from '../components/UI';

type RType = 'Newsletter' | 'Blog & Website' | 'GitHub' | 'YouTube' | 'Podcast' | 'Course' | 'People' | 'Community & Trackers';

interface Resource {
  name: string;
  by: string;
  type: RType;
  url: string;
  why: string;
  starter?: boolean;
}

const li = (name: string) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`;

const RESOURCES: Resource[] = [
  // Newsletters
  { type: 'Newsletter', name: 'The Batch', by: 'DeepLearning.AI · Andrew Ng', url: 'https://www.deeplearning.ai/the-batch/', why: 'Weekly, beginner-friendly round-up of the most important AI news with context.', starter: true },
  { type: 'Newsletter', name: 'AI News', by: 'smol.ai', url: 'https://news.smol.ai', why: 'Daily summary of what AI engineers are discussing across X, Reddit and Discord.' },
  { type: 'Newsletter', name: 'Latent Space', by: 'swyx & Alessio', url: 'https://www.latent.space', why: 'The "AI Engineer" newsletter and podcast: deep, practical interviews with builders.', starter: true },
  { type: 'Newsletter', name: 'Import AI', by: 'Jack Clark', url: 'https://jack-clark.net', why: 'Weekly research highlights with thoughtful commentary on where AI is heading.' },
  { type: 'Newsletter', name: 'Ahead of AI', by: 'Sebastian Raschka', url: 'https://magazine.sebastianraschka.com', why: 'Clear deep dives into LLM architectures, training and new research papers.' },
  { type: 'Newsletter', name: 'Interconnects', by: 'Nathan Lambert', url: 'https://www.interconnects.ai', why: 'Post-training, RLHF, open models and the industry behind them.' },
  { type: 'Newsletter', name: 'One Useful Thing', by: 'Ethan Mollick', url: 'https://www.oneusefulthing.org', why: 'How AI is actually changing work, with practical experiments.' },
  { type: 'Newsletter', name: 'TLDR AI', by: 'TLDR', url: 'https://tldr.tech/ai', why: 'Five-minute daily email of AI headlines, launches and papers.' },
  { type: 'Newsletter', name: "Ben's Bites", by: 'Ben Tossell', url: 'https://www.bensbites.com', why: 'Product-focused daily digest of new AI tools and launches.' },
  { type: 'Newsletter', name: 'The Pragmatic Engineer', by: 'Gergely Orosz', url: 'https://newsletter.pragmaticengineer.com', why: 'Software-engineering newsletter with excellent reporting on how teams build with AI.' },

  // Blogs & websites
  { type: 'Blog & Website', name: "Simon Willison's Weblog", by: 'Simon Willison', url: 'https://simonwillison.net', why: 'Near-daily, hands-on notes on new models, tools and LLM security. Probably the best single blog to follow.', starter: true },
  { type: 'Blog & Website', name: 'Anthropic Engineering', by: 'Anthropic', url: 'https://www.anthropic.com/engineering', why: 'Detailed write-ups on agents, tools, context engineering and evals.', starter: true },
  { type: 'Blog & Website', name: 'Google DeepMind Blog', by: 'Google DeepMind', url: 'https://deepmind.google/discover/blog/', why: 'Gemini releases and frontier research.' },
  { type: 'Blog & Website', name: 'Google Cloud AI & ML Blog', by: 'Google Cloud', url: 'https://cloud.google.com/blog/products/ai-machine-learning', why: 'Vertex AI, Agent Engine, ADK and customer case studies.' },
  { type: 'Blog & Website', name: 'Google Developers Blog', by: 'Google', url: 'https://developers.googleblog.com', why: 'Gemini API, ADK, A2A and developer tooling announcements.' },
  { type: 'Blog & Website', name: 'OpenAI News', by: 'OpenAI', url: 'https://openai.com/news/', why: 'Model launches, research and API updates.' },
  { type: 'Blog & Website', name: 'Hugging Face Blog', by: 'Hugging Face', url: 'https://huggingface.co/blog', why: 'Open models, fine-tuning tutorials and new libraries.' },
  { type: 'Blog & Website', name: 'Meta AI Blog', by: 'Meta', url: 'https://ai.meta.com/blog/', why: 'Llama releases and open research.' },
  { type: 'Blog & Website', name: "Lil'Log", by: 'Lilian Weng', url: 'https://lilianweng.github.io', why: 'Long, beautifully clear research surveys (agents, prompting, reasoning).' },
  { type: 'Blog & Website', name: 'Chip Huyen', by: 'Chip Huyen', url: 'https://huyenchip.com/blog/', why: 'Practical AI engineering essays from the author of "AI Engineering".' },
  { type: 'Blog & Website', name: 'Hamel Husain', by: 'Hamel Husain', url: 'https://hamel.dev', why: 'The go-to writing on evals and improving LLM products systematically.' },
  { type: 'Blog & Website', name: 'Eugene Yan', by: 'Eugene Yan', url: 'https://eugeneyan.com', why: 'Patterns for building real LLM systems, evals and recommendation systems.' },
  { type: 'Blog & Website', name: 'LangChain Blog', by: 'LangChain', url: 'https://blog.langchain.com', why: 'Agent architecture patterns, context engineering and customer stories.' },

  // GitHub
  { type: 'GitHub', name: 'google/adk-python', by: 'Google', url: 'https://github.com/google/adk-python', why: 'Agent Development Kit source, samples and release notes.' },
  { type: 'GitHub', name: 'google-gemini/cookbook', by: 'Google', url: 'https://github.com/google-gemini/cookbook', why: 'Runnable notebooks for every Gemini API feature.' },
  { type: 'GitHub', name: 'GoogleCloudPlatform/generative-ai', by: 'Google Cloud', url: 'https://github.com/GoogleCloudPlatform/generative-ai', why: 'Hundreds of Vertex AI examples: RAG, agents, tuning, evaluation.' },
  { type: 'GitHub', name: 'karpathy/nanochat', by: 'Andrej Karpathy', url: 'https://github.com/karpathy/nanochat', why: 'Train a small ChatGPT end to end — the best way to understand the full pipeline.', starter: true },
  { type: 'GitHub', name: 'rasbt/LLMs-from-scratch', by: 'Sebastian Raschka', url: 'https://github.com/rasbt/LLMs-from-scratch', why: 'Build a GPT-style LLM step by step in PyTorch.' },
  { type: 'GitHub', name: 'mlabonne/llm-course', by: 'Maxime Labonne', url: 'https://github.com/mlabonne/llm-course', why: 'A free roadmap and notebooks for LLM fundamentals, fine-tuning and deployment.' },
  { type: 'GitHub', name: 'modelcontextprotocol/servers', by: 'MCP', url: 'https://github.com/modelcontextprotocol/servers', why: 'Reference MCP servers — great examples of tool design.' },
  { type: 'GitHub', name: 'a2aproject/A2A', by: 'Linux Foundation', url: 'https://github.com/a2aproject/A2A', why: 'The A2A specification, SDKs and samples.' },
  { type: 'GitHub', name: 'vllm-project/vllm', by: 'vLLM', url: 'https://github.com/vllm-project/vllm', why: 'The most popular open LLM serving engine.' },
  { type: 'GitHub', name: 'unslothai/unsloth', by: 'Unsloth', url: 'https://github.com/unslothai/unsloth', why: 'Fast, memory-efficient fine-tuning with free Colab notebooks.' },
  { type: 'GitHub', name: 'ollama/ollama', by: 'Ollama', url: 'https://github.com/ollama/ollama', why: 'Run open models locally with one command.' },
  { type: 'GitHub', name: 'humanlayer/12-factor-agents', by: 'HumanLayer', url: 'https://github.com/humanlayer/12-factor-agents', why: 'Principles for building reliable production agents.' },
  { type: 'GitHub', name: 'punkpeye/awesome-mcp-servers', by: 'Community', url: 'https://github.com/punkpeye/awesome-mcp-servers', why: 'A large curated list of MCP servers.' },

  // YouTube
  { type: 'YouTube', name: 'Andrej Karpathy', by: 'YouTube', url: 'https://www.youtube.com/@AndrejKarpathy', why: 'The clearest explanations of how LLMs work, from tokenizers to training GPT from scratch.', starter: true },
  { type: 'YouTube', name: '3Blue1Brown', by: 'Grant Sanderson', url: 'https://www.youtube.com/@3blue1brown', why: 'Visual intuition for neural networks, transformers and attention.' },
  { type: 'YouTube', name: 'AI Explained', by: 'YouTube', url: 'https://www.youtube.com/@aiexplained-official', why: 'Careful analysis of new model releases and benchmarks — good hype filter.' },
  { type: 'YouTube', name: 'Yannic Kilcher', by: 'YouTube', url: 'https://www.youtube.com/@YannicKilcher', why: 'Paper walkthroughs and ML news.' },
  { type: 'YouTube', name: 'Umar Jamil', by: 'YouTube', url: 'https://www.youtube.com/@umarjamilai', why: 'Implements landmark papers (Transformer, LLaMA, RLHF) line by line.' },
  { type: 'YouTube', name: 'Google for Developers', by: 'Google', url: 'https://www.youtube.com/@GoogleDevelopers', why: 'Gemini API, ADK and Google AI developer tutorials.' },
  { type: 'YouTube', name: 'Google Cloud Tech', by: 'Google Cloud', url: 'https://www.youtube.com/@googlecloudtech', why: 'Vertex AI, agents and cloud deployment walkthroughs.' },
  { type: 'YouTube', name: 'DeepLearning.AI', by: 'Andrew Ng', url: 'https://www.youtube.com/@Deeplearningai', why: 'Talks and short-course previews on agents, RAG and evals.' },
  { type: 'YouTube', name: 'Two Minute Papers', by: 'Károly Zsolnai-Fehér', url: 'https://www.youtube.com/@TwoMinutePapers', why: 'Quick, enthusiastic tours of new research results.' },

  // Podcasts
  { type: 'Podcast', name: 'Latent Space Podcast', by: 'swyx & Alessio', url: 'https://www.latent.space/podcast', why: 'Long conversations with the engineers building agent products and models.' },
  { type: 'Podcast', name: 'Dwarkesh Podcast', by: 'Dwarkesh Patel', url: 'https://www.dwarkesh.com', why: 'In-depth interviews with leading AI researchers and founders.' },
  { type: 'Podcast', name: 'No Priors', by: 'Sarah Guo & Elad Gil', url: 'https://www.youtube.com/@NoPriorsPodcast', why: 'Founders and researchers on where AI products are going.' },
  { type: 'Podcast', name: 'Practical AI', by: 'Changelog', url: 'https://practicalai.fm', why: 'Approachable episodes on applying AI in real projects.' },

  // Courses
  { type: 'Course', name: 'Hugging Face Agents Course', by: 'Hugging Face', url: 'https://huggingface.co/learn/agents-course', why: 'Free, hands-on course on building agents with open tools.', starter: true },
  { type: 'Course', name: 'DeepLearning.AI Short Courses', by: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/', why: '1–2 hour courses on agents, MCP, evals, fine-tuning — many built with Google and others.' },
  { type: 'Course', name: 'Google Cloud Skills Boost', by: 'Google Cloud', url: 'https://www.cloudskillsboost.google', why: 'Hands-on labs for Vertex AI, Gemini and agents on GCP.' },
  { type: 'Course', name: 'Stanford CS336: Language Modeling from Scratch', by: 'Stanford', url: 'https://stanford-cs336.github.io', why: 'University course on building and training LLMs end to end.' },
  { type: 'Course', name: 'Hugging Face LLM Course', by: 'Hugging Face', url: 'https://huggingface.co/learn/llm-course', why: 'Transformers, tokenizers, fine-tuning and datasets with free notebooks.' },

  // People (LinkedIn)
  { type: 'People', name: 'Andrew Ng', by: 'DeepLearning.AI, AI Fund', url: 'https://www.linkedin.com/in/andrewyng/', why: 'Agentic design patterns and practical AI strategy; writes The Batch.', starter: true },
  { type: 'People', name: 'Andrej Karpathy', by: 'Eureka Labs; ex-OpenAI & Tesla', url: li('Andrej Karpathy'), why: 'The best LLM educator; coined "vibe coding". Most active on X.' },
  { type: 'People', name: 'Chip Huyen', by: 'Author, "AI Engineering"', url: li('Chip Huyen'), why: 'Big-picture and practical takes on building AI products.' },
  { type: 'People', name: 'Hamel Husain', by: 'Independent AI consultant', url: li('Hamel Husain'), why: 'Evals, error analysis and making LLM products actually work.' },
  { type: 'People', name: 'Shreya Shankar', by: 'Researcher, UC Berkeley', url: li('Shreya Shankar'), why: 'LLM pipelines, evaluation and data quality research.' },
  { type: 'People', name: 'Eugene Yan', by: 'Applied ML engineer & writer', url: li('Eugene Yan'), why: 'Patterns and practices for LLM systems in production.' },
  { type: 'People', name: 'Simon Willison', by: 'Creator of Datasette', url: li('Simon Willison'), why: 'Coined "prompt injection"; tests every new model and tool hands-on.' },
  { type: 'People', name: 'Sebastian Raschka', by: 'LLM researcher & author', url: li('Sebastian Raschka'), why: 'Explains LLM architectures and training clearly.' },
  { type: 'People', name: 'Philipp Schmid', by: 'Google DeepMind; ex-Hugging Face', url: li('Philipp Schmid'), why: 'Very practical posts on agents, Gemini, fine-tuning and open models.' },
  { type: 'People', name: 'Logan Kilpatrick', by: 'Google — Gemini API & AI Studio', url: li('Logan Kilpatrick'), why: 'First to share Gemini developer launches and tips.' },
  { type: 'People', name: 'Harrison Chase', by: 'Co-founder, LangChain', url: li('Harrison Chase'), why: 'Agent architectures, context engineering and LangGraph.' },
  { type: 'People', name: 'Jerry Liu', by: 'Co-founder, LlamaIndex', url: li('Jerry Liu LlamaIndex'), why: 'Document agents and enterprise RAG.' },
  { type: 'People', name: 'Maxime Labonne', by: 'Liquid AI; author of llm-course', url: li('Maxime Labonne'), why: 'Fine-tuning, model merging and small models.' },
  { type: 'People', name: 'Nathan Lambert', by: 'Ai2; Interconnects', url: li('Nathan Lambert'), why: 'Post-training, RLHF and the open-model ecosystem.' },
  { type: 'People', name: 'Ethan Mollick', by: 'Professor, Wharton', url: li('Ethan Mollick'), why: 'How organisations and people actually adopt AI.' },

  // Community & trackers
  { type: 'Community & Trackers', name: 'Hugging Face Papers', by: 'Hugging Face', url: 'https://huggingface.co/papers', why: 'Daily trending papers, voted by the community, with code links.', starter: true },
  { type: 'Community & Trackers', name: 'LMArena', by: 'LMArena', url: 'https://lmarena.ai', why: 'Crowd-sourced head-to-head model rankings.' },
  { type: 'Community & Trackers', name: 'Artificial Analysis', by: 'Artificial Analysis', url: 'https://artificialanalysis.ai', why: 'Independent benchmarks of model quality, speed and price.' },
  { type: 'Community & Trackers', name: 'SWE-bench Leaderboard', by: 'Princeton', url: 'https://www.swebench.com', why: 'How the best coding agents compare on real GitHub issues.' },
  { type: 'Community & Trackers', name: 'Epoch AI', by: 'Epoch AI', url: 'https://epoch.ai', why: 'Data on training compute, costs and AI trends.' },
  { type: 'Community & Trackers', name: 'r/LocalLLaMA', by: 'Reddit', url: 'https://www.reddit.com/r/LocalLLaMA/', why: 'The hub for running and fine-tuning open models yourself.' },
  { type: 'Community & Trackers', name: 'Hacker News', by: 'Y Combinator', url: 'https://news.ycombinator.com', why: 'Launches and sharp technical discussion (read the comments).' },
  { type: 'Community & Trackers', name: 'AI Engineer (conference talks)', by: 'ai.engineer', url: 'https://www.ai.engineer', why: 'Free recorded talks from teams shipping agents in production.' },
];

const TYPES: ('All' | RType)[] = ['All', 'Newsletter', 'Blog & Website', 'GitHub', 'YouTube', 'Podcast', 'Course', 'People', 'Community & Trackers'];
const FOLLOW_KEY = 'agentacademy_following_v1';

function ResourceDirectory() {
  const [type, setType] = useState<'All' | RType>('All');
  const [starterOnly, setStarterOnly] = useState(false);
  const [following, setFollowing] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FOLLOW_KEY) || '[]');
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(FOLLOW_KEY, JSON.stringify(following));
    } catch {
      /* ignore */
    }
  }, [following]);

  const visible = RESOURCES.filter((r) => (type === 'All' || r.type === type) && (!starterOnly || r.starter));
  const keyOf = (r: Resource) => `${r.type}:${r.name}`;
  const toggle = (k: string) => setFollowing((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));

  return (
    <div className="my-6">
      <div className="flex flex-wrap items-center gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${type === t ? 'border-[#D94436] bg-[#D94436] text-white' : 'border-[#E5DFD3] bg-[#FFFDF9] text-stone-700 hover:border-[#D94436] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-stone-700 dark:text-stone-300">
          <input type="checkbox" checked={starterOnly} onChange={(e) => setStarterOnly(e.target.checked)} className="h-4 w-4 accent-[#D94436]" />
          Show only the starter pack (if you only have 30 minutes a week)
        </label>
        <span className="font-mono text-stone-500">★ following {following.length} · showing {visible.length}</span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {visible.map((r) => {
          const k = keyOf(r);
          const isFollowing = following.includes(k);
          return (
            <div key={k} className="flex flex-col rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-4 dark:border-stone-800 dark:bg-stone-900/70">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#D94436]">
                    {r.type}
                    {r.starter && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">starter</span>}
                  </div>
                  <a href={r.url} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 font-display text-[15px] font-bold text-stone-950 hover:text-[#D94436] dark:text-white">
                    {r.name} <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <div className="text-xs text-stone-500 dark:text-stone-400">{r.by}</div>
                </div>
                <button
                  onClick={() => toggle(k)}
                  aria-label={isFollowing ? `Unfollow ${r.name}` : `Follow ${r.name}`}
                  className={`shrink-0 rounded-md border p-1.5 transition ${isFollowing ? 'border-amber-400 bg-amber-50 text-amber-500 dark:bg-amber-950/40' : 'border-stone-200 text-stone-300 hover:text-amber-500 dark:border-stone-700'}`}
                >
                  <Star className={`h-4 w-4 ${isFollowing ? 'fill-amber-400' : ''}`} />
                </button>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">{r.why}</p>
              {r.type === 'People' && (
                <p className="mt-auto pt-2 text-[11px] text-stone-400">Opens LinkedIn{r.url.includes('/search/') ? ' search' : ''} — many of these people also post on X and Bluesky.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChapterStayCurrent(_props: { isCompleted: boolean; onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Keep learning"
        title="AI Moves Fast — Here's How to Keep Up Without Drowning"
        description="New models, tools and papers ship every week. You don't need to read everything. A small, well-chosen set of sources plus a simple routine will keep you current — and the fundamentals from this handbook will help you judge what actually matters."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard title="Daily · 10 minutes" badge="Skim">
          One digest (AI News, TLDR AI or The Batch on the weekend). Skim headlines; save only what touches your work.
        </ConceptCard>
        <ConceptCard title="Weekly · 1 hour" badge="Read">
          One deep post (Simon Willison, Anthropic Engineering, Latent Space) or one paper from Hugging Face Papers.
        </ConceptCard>
        <ConceptCard title="Monthly · an afternoon" badge="Build">
          Try one new model or tool on a real task. Hands-on experience beats reading about it every time.
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="Directory"
        title="Newsletters, Blogs, GitHub, YouTube, Podcasts & People"
        description="A curated list of trustworthy sources. Filter by type, turn on the starter pack if you're short on time, and star the ones you follow — your list is saved in your browser."
      />

      <ResourceDirectory />

      <SectionHeader
        eyebrow="Signal vs. hype"
        title="How to Judge a New Launch in Five Minutes"
        description="Every week brings a 'game-changer'. These questions separate real progress from marketing."
      />

      <div className="grid gap-3 md:grid-cols-2">
        {[
          ['Is there an independent benchmark?', 'Check LMArena, Artificial Analysis or SWE-bench rather than only the launch blog chart.'],
          ['Can you try it today?', 'An API, open weights or a public demo beats a waitlist and a video.'],
          ['What does it cost and how fast is it?', 'A 2% better model at 5× the price may not help your product.'],
          ['Does it beat your current setup on YOUR evals?', 'Run your own eval set — that is the only benchmark that matters for your product.'],
          ['What do practitioners say after a week?', 'Read follow-ups from hands-on testers (Simon Willison, r/LocalLLaMA, Hacker News comments).'],
          ['Which fundamental changed?', 'Bigger context, cheaper tokens, better tool use, new modality? Map it back to a chapter in this handbook.'],
        ].map(([q, a]) => (
          <div key={q} className="rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-4 dark:border-stone-800 dark:bg-stone-900/70">
            <div className="text-sm font-bold text-stone-900 dark:text-white">{q}</div>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{a}</p>
          </div>
        ))}
      </div>

      <Callout type="insight" title="The fundamentals don't expire">
        Models will be replaced, frameworks will be renamed and protocols will get new versions. Tokens, attention, the agent
        loop, tools, context engineering, evals, guardrails and good distributed-systems engineering will still matter. When
        something new appears, ask which of those it changes — and you will understand it in minutes.
      </Callout>
    </div>
  );
}
