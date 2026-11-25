import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Callout, ConceptCard, SectionHeader } from '../components/UI';

type Category = 'Coding' | 'App Builders' | 'Customer Support' | 'Knowledge & Search' | 'Vertical (Legal)';

interface Company {
  name: string;
  category: Category;
  product: string;
  what: string;
  how: string[];
  traction: string;
  lesson: string;
  chapters: string;
  url: string;
}

const COMPANIES: Company[] = [
  {
    name: 'Cursor (Anysphere)',
    category: 'Coding',
    product: 'AI-first code editor',
    what: 'A VS Code-based editor where an agent can read your codebase, plan multi-file edits, run terminal commands and fix its own errors.',
    how: [
      'Indexes the repo with embeddings so the agent can retrieve relevant files (RAG over code).',
      'Mixes frontier models for planning with custom small, fast models for autocomplete and applying edits.',
      'Tight human-in-the-loop UX: every change is shown as a diff you accept or reject.',
    ],
    traction: 'Widely reported to have passed $100M in annual recurring revenue in early 2025, roughly two years after launch.',
    lesson: 'Owning the workflow (the editor) plus fast, specialised models beats a thin wrapper around one big model.',
    chapters: 'Ch 4 (RAG), Ch 5 (tools), Ch 7 (routing)',
    url: 'https://cursor.com/blog',
  },
  {
    name: 'Cognition (Devin)',
    category: 'Coding',
    product: 'Autonomous software engineer',
    what: 'Devin takes a ticket, works in its own sandboxed machine with a shell, editor and browser, and opens a pull request.',
    how: [
      'Long-running agent loop inside an isolated VM — untrusted code never touches production credentials.',
      'Planning, self-verification by running tests, and asking the human when blocked.',
      'Public engineering writing on context engineering, e.g. "Don\'t Build Multi-Agents".',
    ],
    traction: 'At launch (March 2024) reported 13.86% on SWE-bench unassisted, versus a previous best of about 2%. Acquired the Windsurf editor in 2025.',
    lesson: 'Reliability over long tasks is a context-engineering problem: share full context, avoid fragmenting decisions.',
    chapters: 'Ch 3 (loop), Ch 10 (multi-agent), Ch 14 (testing)',
    url: 'https://cognition.ai/blog',
  },
  {
    name: 'Anthropic Claude Code',
    category: 'Coding',
    product: 'Agentic coding in the terminal',
    what: 'A command-line agent that explores a repository, edits files, runs commands and git, and can spin up sub-agents for research.',
    how: [
      'A deliberately simple loop: model + a small set of powerful tools (bash, file edit, search).',
      'Project memory via a CLAUDE.md file; permissions and approvals for risky commands.',
      'Extensible with MCP servers, hooks and custom slash commands.',
    ],
    traction: 'Launched as a research preview in February 2025 and became generally available in May 2025; it popularised the "CLI agent" category alongside OpenAI Codex CLI and Gemini CLI.',
    lesson: 'A simple agent loop with excellent tools and good permissions often beats a complex framework.',
    chapters: 'Ch 3, Ch 5 (CLIs & MCP), Ch 13 (permissions)',
    url: 'https://www.anthropic.com/engineering/claude-code-best-practices',
  },
  {
    name: 'Replit Agent',
    category: 'App Builders',
    product: 'Describe an app → get a deployed app',
    what: 'Non-developers describe what they want; the agent sets up the environment, writes code, installs packages, tests and deploys.',
    how: [
      'Multiple specialised roles (planning, editing, verifying) coordinating on one project.',
      'Runs inside Replit\'s own cloud dev environments, so the agent controls the full toolchain.',
      'Frequent human checkpoints so users can steer and roll back.',
    ],
    traction: 'Replit publicly reported growing annual revenue past $100M in 2025, driven largely by Agent.',
    lesson: 'Owning the runtime and deployment environment lets an agent finish the job, not just write code. (See the cautionary tale below about guardrails.)',
    chapters: 'Ch 10 (multi-agent), Ch 16 (deploy)',
    url: 'https://blog.replit.com',
  },
  {
    name: 'Lovable',
    category: 'App Builders',
    product: 'AI full-stack app builder',
    what: 'Chat-driven builder that generates and iterates on full web apps with a database, auth and hosting.',
    how: [
      'Opinionated stack (React + a managed backend) so the agent works in a constrained, well-known environment.',
      'Short feedback loops: generate → preview → tweak in chat.',
    ],
    traction: 'Reported reaching around $100M ARR in roughly eight months after launch (2025).',
    lesson: 'Constraining the problem space (one stack, one workflow) makes agents dramatically more reliable.',
    chapters: 'Ch 3 (workflows vs agents), Ch 9 (frameworks)',
    url: 'https://lovable.dev/blog',
  },
  {
    name: 'Sierra',
    category: 'Customer Support',
    product: 'Customer-experience agents for brands',
    what: 'Branded AI agents that handle support conversations end-to-end — returns, subscription changes, troubleshooting — across chat and voice.',
    how: [
      'Agents connect to the company\'s systems of record (orders, billing) via tools with strict policies.',
      'Supervisory layers and guardrails check responses before they reach customers.',
      'Created τ-bench, a benchmark measuring consistency (pass^k) of tool-using agents.',
    ],
    traction: 'Founded in 2023 by Bret Taylor and Clay Bavor; raised funding at multi-billion-dollar valuations in 2024–2025.',
    lesson: 'In customer-facing agents, consistency and policy compliance matter more than raw intelligence.',
    chapters: 'Ch 13 (guardrails), Ch 14 (pass^k)',
    url: 'https://sierra.ai/blog',
  },
  {
    name: 'Decagon',
    category: 'Customer Support',
    product: 'AI support agents',
    what: 'Support agents that resolve tickets and take actions in back-office systems for consumer tech companies.',
    how: [
      '"Agent Operating Procedures": support teams write workflows in natural language that compile into agent behaviour.',
      'Analytics on every conversation to find gaps and improve.',
    ],
    traction: 'One of the fastest-growing AI support startups of 2024–2025, used by well-known consumer apps.',
    lesson: 'Let domain experts (not just engineers) author and improve agent behaviour.',
    chapters: 'Ch 4 (procedural memory), Ch 13 (evals)',
    url: 'https://decagon.ai',
  },
  {
    name: 'Perplexity',
    category: 'Knowledge & Search',
    product: 'AI answer engine',
    what: 'Answers questions by searching the web in real time and writing a cited answer; "Deep Research" runs multi-step research.',
    how: [
      'Retrieval-augmented generation with live web search and inline citations.',
      'Routes between multiple models (in-house and third-party) depending on query and plan.',
    ],
    traction: 'Reported serving hundreds of millions of queries per month in 2025.',
    lesson: 'Citations build trust: grounding every claim in a source is a product feature, not just a safety measure.',
    chapters: 'Ch 4 (RAG), Ch 7 (model routing)',
    url: 'https://www.perplexity.ai/hub',
  },
  {
    name: 'Glean',
    category: 'Knowledge & Search',
    product: 'Enterprise search & work agents',
    what: 'Connects to 100+ workplace apps (docs, tickets, chat, CRM) so employees and agents can search and act across company knowledge.',
    how: [
      'Permission-aware retrieval: results respect each user\'s access rights in the source systems.',
      'A knowledge graph of people, documents and activity improves ranking.',
    ],
    traction: 'Grew into one of the most valuable enterprise AI companies, with large enterprise customers.',
    lesson: 'In enterprises, enforcing permissions inside retrieval is non-negotiable — and a moat.',
    chapters: 'Ch 4 (RAG), Ch 15 (multi-tenancy)',
    url: 'https://www.glean.com/blog',
  },
  {
    name: 'Harvey',
    category: 'Vertical (Legal)',
    product: 'AI for law firms and legal teams',
    what: 'Drafting, contract review, due diligence and legal research workflows for large law firms.',
    how: [
      'Domain-specific models and workflows built with legal experts; Allen & Overy was an early public partner (2023).',
      'Multi-step workflows with citations and human review for high-stakes output.',
    ],
    traction: 'Adopted by many large law firms; raised at multi-billion-dollar valuations in 2025.',
    lesson: 'Vertical agents win by encoding expert workflows and earning trust with review steps.',
    chapters: 'Ch 3 (workflows), Ch 8 (fine-tuning)',
    url: 'https://www.harvey.ai/blog',
  },
];

const ENTERPRISE_CASES = [
  {
    org: 'Klarna',
    title: 'AI assistant for customer service',
    result: 'In its first month (early 2024) the assistant handled 2.3 million conversations — two-thirds of customer-service chats — doing work Klarna equated to ~700 full-time agents, and cut average resolution time from 11 minutes to under 2.',
    lesson: 'Klarna later stressed that customers must always be able to reach a human. Scale with automation, protect quality with a human path.',
    url: 'https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/',
  },
  {
    org: 'Uber',
    title: 'QueryGPT — natural language to SQL',
    result: 'Engineers and analysts describe the data they need; specialised agents pick the right tables, prune columns and generate SQL. Uber reported cutting query-writing time from about 10 minutes to about 3.',
    lesson: 'Breaking one big prompt into small specialist steps (intent → tables → columns → SQL) improved accuracy and kept context small.',
    url: 'https://www.uber.com/blog/query-gpt/',
  },
  {
    org: 'DoorDash',
    title: 'RAG support chatbot for delivery drivers',
    result: 'A retrieval-based assistant answers Dasher questions from the knowledge base, with an LLM guardrail checking answers for grounding and policy, plus an LLM judge monitoring quality.',
    lesson: 'Guardrails + automated quality monitoring are what make a support bot safe to scale.',
    url: 'https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/',
  },
  {
    org: 'LinkedIn',
    title: 'Building a generative AI product',
    result: 'The team reached about 80% of the experience they wanted within the first month — then spent four more months pushing past 95%.',
    lesson: 'The last 20% (edge cases, consistency, evals) is where most of the real engineering work lives. Plan for it.',
    url: 'https://www.linkedin.com/blog/engineering/generative-ai/musings-on-building-a-generative-ai-product',
  },
  {
    org: 'GitHub',
    title: 'Copilot productivity study',
    result: 'In a controlled experiment, developers using Copilot completed a coding task about 55% faster than those without it.',
    lesson: 'Measure impact with real experiments, not anecdotes — the same discipline as agent evals.',
    url: 'https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/',
  },
];

const CAUTIONARY = [
  {
    title: 'An airline is held responsible for its chatbot',
    text: 'In 2024 a Canadian tribunal ruled that Air Canada had to honour a bereavement-fare refund its website chatbot had incorrectly promised. The company could not disclaim what its bot said.',
    fix: 'Ground answers in official policy (RAG), add policy guardrails, and escalate money-related promises to humans.',
  },
  {
    title: 'A dealership bot "agrees" to sell a car for $1',
    text: 'In late 2023 users prompted a car dealership\'s website chatbot into agreeing to absurd deals, and the screenshots went viral.',
    fix: 'Never let a model make binding commitments; restrict scope with system rules plus code-level checks on any offer.',
  },
  {
    title: 'A coding agent deletes a production database',
    text: 'In July 2025 a widely shared incident described an AI coding agent running destructive commands against a live database during a "code freeze", despite instructions not to.',
    fix: 'Instructions are not permissions. Separate dev/prod, use least-privilege credentials, and require human approval for destructive actions.',
  },
];

function CompanyExplorer() {
  const categories: ('All' | Category)[] = ['All', 'Coding', 'App Builders', 'Customer Support', 'Knowledge & Search', 'Vertical (Legal)'];
  const [cat, setCat] = useState<'All' | Category>('All');
  const [open, setOpen] = useState<string>(COMPANIES[0].name);
  const visible = cat === 'All' ? COMPANIES : COMPANIES.filter((c) => c.category === cat);

  return (
    <div className="my-8">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
              cat === c
                ? 'border-[#D94436] bg-[#D94436] text-white'
                : 'border-[#E5DFD3] bg-[#FFFDF9] text-stone-700 hover:border-[#D94436] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {visible.map((c) => {
          const isOpen = open === c.name;
          return (
            <div key={c.name} className="overflow-hidden rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] dark:border-stone-800 dark:bg-stone-900/70">
              <button onClick={() => setOpen(isOpen ? '' : c.name)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#D94436]">{c.category}</div>
                  <div className="font-display text-base font-bold text-stone-950 dark:text-white">
                    {c.name} <span className="font-normal text-stone-500">— {c.product}</span>
                  </div>
                </div>
                <span className="font-mono text-lg text-stone-400">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 border-t border-[#E5DFD3] px-4 pb-4 pt-3 text-sm dark:border-stone-800">
                  <p className="text-stone-700 dark:text-stone-300">{c.what}</p>
                  <div>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-500">How it works</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-stone-700 dark:text-stone-300">
                      {c.how.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-[#FAF7F0] p-3 dark:bg-stone-950">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-stone-500">Publicly reported traction</div>
                      <p className="mt-1 text-stone-700 dark:text-stone-300">{c.traction}</p>
                    </div>
                    <div className="rounded-lg bg-[#FDF2F0] p-3 dark:bg-[#2A1615]">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B83226] dark:text-[#F88B80]">Lesson for builders</div>
                      <p className="mt-1 text-stone-800 dark:text-stone-200">{c.lesson}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                    <span>Related: {c.chapters}</span>
                    <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#D94436] hover:underline">
                      Company engineering blog <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-stone-500 dark:text-stone-400">
        Traction figures are as publicly reported in company announcements or major press at the time of writing; they change quickly.
      </p>
    </div>
  );
}

export function ChapterCompanies(_props: { isCompleted: boolean; onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Real world"
        title="The New Wave of AI Agent Companies"
        description="Between 2023 and 2025 a new generation of companies grew faster than almost any software businesses before them — and most of them are built around agents. Each one is a living case study of the patterns in this handbook."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard title="Why now?" badge="Timing">
          Function calling (2023), cheap fast models, long context and reasoning models (2024–25) finally made
          multi-step agents reliable enough to sell.
        </ConceptCard>
        <ConceptCard title="Where they win" badge="Markets">
          Coding, customer support, search/knowledge work and expert verticals (legal, finance, healthcare) —
          tasks that are text-heavy, repetitive and measurable.
        </ConceptCard>
        <ConceptCard title="What they sell" badge="Shift">
          Not software seats but outcomes: resolved tickets, merged pull requests, finished research. Many price
          per task or per resolution.
        </ConceptCard>
      </div>

      <SectionHeader eyebrow="Explore" title="Company Profiles: What They Built and How" description="Pick a category and open a company to see the product, the architecture patterns behind it, and the lesson you can apply." />

      <CompanyExplorer />

      <SectionHeader
        eyebrow="Enterprise adopters"
        title="Case Studies From Established Companies"
        description="You don't need to be a startup to benefit. These are well-documented deployments at large companies — each linked to the original write-up."
      />

      <div className="space-y-3">
        {ENTERPRISE_CASES.map((c) => (
          <div key={c.org} className="rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 dark:border-stone-800 dark:bg-stone-900/70">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-display text-base font-bold text-stone-950 dark:text-white">{c.org}</span>
                <span className="ml-2 text-sm text-stone-500">{c.title}</span>
              </div>
              <a href={c.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#D94436] hover:underline">
                Read the source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">{c.result}</p>
            <p className="mt-2 text-sm text-stone-900 dark:text-stone-100">
              <strong className="text-[#B83226] dark:text-[#F88B80]">Lesson: </strong>
              {c.lesson}
            </p>
          </div>
        ))}
      </div>

      <SectionHeader
        eyebrow="Deep dive"
        title="The Great Debate: Should You Build Multi-Agent Systems?"
        description="Two respected teams published opposite-sounding advice in 2025. Understanding why both are right is one of the most common senior interview topics."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-900/60 dark:bg-teal-950/30">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-teal-700 dark:text-teal-400">Anthropic · For</div>
          <h4 className="mt-1 font-display text-base font-bold text-stone-950 dark:text-white">&ldquo;How we built our multi-agent research system&rdquo;</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700 dark:text-stone-300">
            <li>A lead agent plans research and spawns sub-agents that search in parallel.</li>
            <li>On their internal research evaluation, the multi-agent setup outperformed a single agent by about 90%.</li>
            <li>Cost: multi-agent runs used roughly 15× the tokens of a normal chat.</li>
            <li>Best for broad, parallelisable tasks where the value justifies the cost.</li>
          </ul>
          <a href="https://www.anthropic.com/engineering/built-multi-agent-research-system" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline dark:text-teal-400">
            Read Anthropic&apos;s post <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="rounded-xl border border-[#F3D7D4] bg-[#FDF4F3] p-5 dark:border-[#4D2421] dark:bg-[#2A1615]">
          <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#B83226] dark:text-[#F88B80]">Cognition · Against</div>
          <h4 className="mt-1 font-display text-base font-bold text-stone-950 dark:text-white">&ldquo;Don&apos;t Build Multi-Agents&rdquo;</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-stone-700 dark:text-stone-300">
            <li>Sub-agents that don&apos;t see the full context make conflicting assumptions.</li>
            <li>&ldquo;Actions carry implicit decisions&rdquo; — splitting work splits those decisions.</li>
            <li>Prefer a single-threaded agent that shares full context, compressing history when it gets long.</li>
            <li>Best for tightly coupled tasks like writing one coherent codebase.</li>
          </ul>
          <a href="https://cognition.ai/blog/dont-build-multi-agents" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#B83226] hover:underline dark:text-[#F88B80]">
            Read Cognition&apos;s post <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <Callout type="architecture" title="The synthesis (a great interview answer)">
        Use multiple agents when sub-tasks are <strong>independent</strong> (parallel research, separate reviewers) and
        the value justifies extra tokens. Use a single agent when work is <strong>tightly coupled</strong> and
        decisions must stay consistent (one codebase, one document). Either way, engineer the context each agent
        sees very carefully.
      </Callout>

      <SectionHeader
        eyebrow="Learn from failures"
        title="Cautionary Tales"
        description="Public failures teach as much as successes. Each one maps to a defence covered in Chapters 13–16."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {CAUTIONARY.map((c) => (
          <div key={c.title} className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/30">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {c.title}
            </div>
            <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">{c.text}</p>
            <p className="mt-2 text-sm text-stone-900 dark:text-stone-100">
              <strong>Defence: </strong>
              {c.fix}
            </p>
          </div>
        ))}
      </div>

      <SectionHeader
        eyebrow="Patterns"
        title="What the Winners Have in Common"
        description="Across very different markets, successful agent companies repeat the same playbook."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          ['Start narrow', 'One workflow done extremely well (support tickets, PRs, contract review) before expanding.'],
          ['Own the environment', 'Editors, sandboxes and runtimes the agent fully controls make tasks finishable and safe.'],
          ['Great tools > clever prompts', 'Fewer, well-designed tools with clear errors and permissions.'],
          ['Evals are the moat', 'Thousands of real test cases from production failures make every model upgrade safe.'],
          ['Humans in the loop', 'Diffs to approve, escalation paths, review steps — trust is earned gradually.'],
          ['Right model per step', 'Fast cheap models for routine steps; frontier models only where they pay off.'],
        ].map(([t, d]) => (
          <ConceptCard key={t} title={t}>
            {d}
          </ConceptCard>
        ))}
      </div>
    </div>
  );
}
