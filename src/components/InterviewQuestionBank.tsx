import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type QCategory = 'LLM Fundamentals' | 'RAG & Memory' | 'Agents & Tools' | 'Production & Safety';

const QUESTIONS: { cat: QCategory; level: 'Junior+' | 'Mid+' | 'Senior+'; q: string; a: string }[] = [
  { cat: 'LLM Fundamentals', level: 'Junior+', q: 'What is a token, and why should an engineer care?', a: 'A token is a chunk of text — a whole common word or a piece of a rarer one (roughly ¾ of an English word on average). Models read and write tokens, and providers bill per token, so token counts decide cost, latency and whether your prompt fits in the context window.' },
  { cat: 'LLM Fundamentals', level: 'Junior+', q: 'What does temperature do?', a: 'At each step the model produces a probability for every possible next token. Temperature reshapes that distribution: 0 always picks the most likely token (predictable), higher values flatten it so less likely tokens get picked (more creative, more risk of nonsense). Agents and code generation usually run at 0–0.3.' },
  { cat: 'LLM Fundamentals', level: 'Junior+', q: 'Why do LLMs hallucinate, and how do you reduce it?', a: 'The model is trained to produce plausible text, not verified facts, and it has no built-in way to check a source. Reduce it by grounding answers in retrieved documents (RAG), letting it call tools for facts and maths, asking it to cite sources, allowing "I don\'t know", and verifying outputs with checks or a second model.' },
  { cat: 'LLM Fundamentals', level: 'Mid+', q: 'Explain attention / the Transformer to a non-expert.', a: 'When the model processes a word, attention lets it look at every other word in the text and decide which ones matter most for understanding it — "bank" looks at "river" or "cash" to know which meaning applies. Stacking many attention layers lets the model build rich understanding, and because it processes all words in parallel it trains efficiently on GPUs.' },
  { cat: 'LLM Fundamentals', level: 'Mid+', q: 'What are pre-training, fine-tuning and RLHF?', a: 'Pre-training teaches general knowledge by predicting the next token over trillions of tokens. Supervised fine-tuning teaches the format and behaviour you want from curated examples. RLHF/DPO (and RL with verifiable rewards) nudges the model toward answers people — or tests — prefer, improving helpfulness, safety and reasoning.' },
  { cat: 'LLM Fundamentals', level: 'Senior+', q: 'Why do long agent conversations get slower and more expensive?', a: 'Models are stateless, so every step re-sends the whole history. Input tokens grow with each step (roughly quadratic total cost over a run), and prefill time grows with prompt length. Fixes: prompt caching with a stable prefix, truncating or summarising tool output, compaction, and isolating noisy work in sub-agents.' },

  { cat: 'RAG & Memory', level: 'Junior+', q: 'What is RAG and when would you use it?', a: 'Retrieval-Augmented Generation: before answering, search a knowledge source (vector DB, search engine, SQL) and put the relevant snippets in the prompt. Use it when answers must reflect private, fresh or citable information — docs, policies, tickets — without retraining the model.' },
  { cat: 'RAG & Memory', level: 'Mid+', q: 'RAG or fine-tuning — how do you choose?', a: 'Use RAG for knowledge (facts that change or must be cited). Use fine-tuning for behaviour (a format, style or narrow skill the model keeps getting wrong) or to distil a big model into a cheaper one. They combine well. Most teams should exhaust prompting + RAG before fine-tuning.' },
  { cat: 'RAG & Memory', level: 'Senior+', q: 'Your RAG system retrieves the wrong documents. How do you fix it?', a: 'Measure first: build a small set of questions with known correct documents and track recall@k. Then improve chunking (semantic chunks, keep headings), use hybrid search (keywords + embeddings), add a reranker, rewrite or expand queries, add metadata filters (product, date, tenant) and contextual chunk summaries. Re-measure after each change.' },
  { cat: 'RAG & Memory', level: 'Mid+', q: 'How do you give an agent long-term memory?', a: 'Separate memory types: working memory in the context window, episodic memory (past interactions and preferences) and semantic memory (facts and documents) in external stores. Write important facts out during or after a session, and retrieve only what is relevant at the start of the next one — e.g. with Vertex AI Memory Bank, Mem0 or a database plus embeddings.' },

  { cat: 'Agents & Tools', level: 'Junior+', q: 'What is the difference between a chatbot, a workflow and an agent?', a: 'A chatbot answers in a single turn. A workflow runs steps you defined in code, using an LLM at some of them — predictable and cheap. An agent lets the LLM decide the next step in a loop (think → act → observe) until the goal is met — flexible but harder to test. Use the least autonomy that solves the problem.' },
  { cat: 'Agents & Tools', level: 'Junior+', q: 'How does function calling actually work?', a: 'You describe tools (name, description, JSON schema) in the request. The model, trained for this format, returns a structured "call this tool with these arguments" instead of text. Your code validates and executes it, then sends the result back as a new message so the model can continue. The model never executes anything itself.' },
  { cat: 'Agents & Tools', level: 'Mid+', q: 'What are MCP and A2A, and how do they differ?', a: 'MCP (Model Context Protocol) standardises how an agent connects to tools, data and prompt templates — agent ↔ tools. A2A (Agent2Agent) standardises how independent agents discover each other (Agent Cards) and collaborate on tasks — agent ↔ agent, even across companies and frameworks. Real systems often use both.' },
  { cat: 'Agents & Tools', level: 'Senior+', q: 'When would you choose a multi-agent design over a single agent?', a: 'When sub-tasks are independent and benefit from parallelism (broad research, separate reviewers), when contexts must be isolated (noisy search), or when different permissions or models are needed. Avoid it for tightly coupled work where decisions must stay consistent. Cite the trade-off: Anthropic saw large quality gains with ~15× tokens; Cognition warns about fragmented context.' },

  { cat: 'Production & Safety', level: 'Mid+', q: 'How do you evaluate an agent?', a: 'Build a golden dataset of realistic tasks. Check deterministic things in code (valid JSON, required tools called, forbidden tools not called, step and cost budgets), grade open-ended quality with an LLM judge using a rubric calibrated against humans, run each case several times to measure consistency (pass^k), and run the suite in CI on every prompt or model change.' },
  { cat: 'Production & Safety', level: 'Mid+', q: 'How do you cut an agent\'s latency and cost?', a: 'Use fewer steps (better tools, parallel tool calls), smaller models for routine steps (routing/cascades), prompt caching with a stable prefix, shorter tool outputs, semantic caching of repeated answers, streaming so users see progress, and async processing for long tasks.' },
  { cat: 'Production & Safety', level: 'Senior+', q: 'How do you protect an agent from prompt injection?', a: 'Assume the model can be tricked by any text it reads. Enforce safety outside the model: least-privilege credentials, allowlists for actions and recipients, sandboxes for code, separating untrusted-content readers from privileged actors, human approval for irreversible actions, and input/output screening (e.g. Model Armor). Avoid the "lethal trifecta" of private data + untrusted input + external actions in one agent.' },
  { cat: 'Production & Safety', level: 'Senior+', q: 'A tool your agent depends on is flaky. What do you do?', a: 'Return clear, actionable error messages so the model can adapt; add timeouts, retries with exponential backoff and jitter, and circuit breakers; make mutating tools idempotent so retries are safe; cap total steps; and fall back gracefully (partial answer or human handoff). Trace every failure and add it to your test suite.' },
];

const CATS: ('All' | QCategory)[] = ['All', 'LLM Fundamentals', 'RAG & Memory', 'Agents & Tools', 'Production & Safety'];

export function InterviewQuestionBank() {
  const [cat, setCat] = useState<'All' | QCategory>('All');
  const [open, setOpen] = useState<number | null>(0);
  const visible = QUESTIONS.map((q, i) => ({ ...q, i })).filter((q) => cat === 'All' || q.cat === cat);

  return (
    <div className="my-6">
      <div className="flex flex-wrap gap-1.5">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
              cat === c
                ? 'border-[#D94436] bg-[#D94436] text-white'
                : 'border-[#E5DFD3] bg-[#FFFDF9] text-stone-700 hover:border-[#D94436] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300'
            }`}
          >
            {c} {c !== 'All' && <span className="opacity-60">({QUESTIONS.filter((q) => q.cat === c).length})</span>}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-2.5">
        {visible.map((q) => {
          const isOpen = open === q.i;
          return (
            <div key={q.i} className="overflow-hidden rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] dark:border-stone-800 dark:bg-stone-900/60">
              <button onClick={() => setOpen(isOpen ? null : q.i)} className="flex w-full items-start justify-between gap-4 p-4 text-left">
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94436]">
                    {q.cat} · {q.level}
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-stone-900 dark:text-stone-50 sm:text-[15px]">{q.q}</div>
                </div>
                {isOpen ? <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-stone-400" /> : <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-stone-400" />}
              </button>
              {isOpen && (
                <div className="border-t border-[#E5DFD3] bg-[#FAF7F0] px-4 py-3.5 text-sm leading-relaxed text-stone-700 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-300">
                  {q.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StudyPlan() {
  const weeks = [
    { w: 'Week 1', chapters: 'Ch 1–5', focus: 'LLM fundamentals, prompting & APIs, the agent loop, memory and tools.', build: 'Build a raw agent loop (no framework) with two tools and structured output.' },
    { w: 'Week 2', chapters: 'Ch 6–9', focus: 'Tokens & serving, model selection & routers, training & MLOps, frameworks.', build: 'Rebuild the agent in ADK or LangGraph and expose one tool as an MCP server.' },
    { w: 'Week 3', chapters: 'Ch 10–16', focus: 'Multi-agent, A2A, GCP, evals & safety, testing, scaling and deployment.', build: 'Deploy to Cloud Run or Agent Engine with a 20-case eval suite gating releases.' },
    { w: 'Week 4', chapters: 'Ch 17–20', focus: 'Company case studies, papers, interview drills and the final quiz.', build: 'Talk through two system designs out loud every day; aim for 80%+ on the final quiz.' },
  ];
  return (
    <div className="my-6 grid gap-3 md:grid-cols-2">
      {weeks.map((w) => (
        <div key={w.w} className="rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-4 dark:border-stone-800 dark:bg-stone-900/70">
          <div className="flex items-center justify-between">
            <span className="font-display text-base font-bold text-stone-950 dark:text-white">{w.w}</span>
            <span className="font-mono text-xs font-semibold text-[#D94436]">{w.chapters}</span>
          </div>
          <p className="mt-1.5 text-sm text-stone-700 dark:text-stone-300">{w.focus}</p>
          <p className="mt-2 text-sm text-stone-900 dark:text-stone-100">
            <strong>Build: </strong>
            {w.build}
          </p>
        </div>
      ))}
    </div>
  );
}
