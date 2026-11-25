import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Callout, CodeBlock, SectionHeader } from '../components/UI';

/* ------------------------------------------------------------------ */
/* API call flow                                                        */
/* ------------------------------------------------------------------ */
function ApiCallFlow() {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 p-5 text-stone-100">
      <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan-400">
        Animated · Life of an API request
      </div>
      <svg viewBox="0 0 640 170" className="mt-3 w-full select-none">
        <rect x="10" y="50" width="130" height="70" rx="12" fill="#1c1917" stroke="#a8a29e" strokeWidth="1.5" />
        <text x="75" y="80" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">Your App</text>
        <text x="75" y="98" textAnchor="middle" fill="#a8a29e" fontSize="9.5">messages + settings</text>

        <path d="M 142 72 L 238 72" stroke="#22d3ee" strokeWidth="2.2" className="animate-dash-flow" />
        <text x="190" y="64" textAnchor="middle" fill="#67e8f9" fontSize="9">HTTPS request</text>

        <rect x="242" y="40" width="150" height="90" rx="12" fill="#1c1917" stroke="#22d3ee" strokeWidth="1.5" />
        <text x="317" y="66" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">API Gateway</text>
        <text x="317" y="84" textAnchor="middle" fill="#a8a29e" fontSize="9">auth · rate limits</text>
        <text x="317" y="99" textAnchor="middle" fill="#a8a29e" fontSize="9">safety filters</text>
        <text x="317" y="114" textAnchor="middle" fill="#a8a29e" fontSize="9">billing per token</text>

        <path d="M 394 72 L 488 72" stroke="#22d3ee" strokeWidth="2.2" className="animate-dash-flow" />

        <rect x="492" y="30" width="138" height="110" rx="12" fill="#292524" stroke="#D94436" strokeWidth="2" />
        <text x="561" y="56" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">LLM on GPUs/TPUs</text>
        <text x="561" y="78" textAnchor="middle" fill="#fca5a5" fontSize="9.5">1. Prefill: read prompt</text>
        <text x="561" y="96" textAnchor="middle" fill="#fca5a5" fontSize="9.5">2. Decode: token by token</text>
        <text x="561" y="118" textAnchor="middle" fill="#a8a29e" fontSize="9">stateless — no memory</text>

        <path d="M 490 112 L 142 112" stroke="#fbbf24" strokeWidth="2.2" className="animate-dash-flow" />
        <text x="316" y="152" textAnchor="middle" fill="#fcd34d" fontSize="9.5">
          streamed tokens back (Server-Sent Events) + usage: input/output token counts
        </text>
      </svg>
      <p className="mt-2 text-xs leading-relaxed text-stone-400">
        Key insight: the model keeps <strong className="text-stone-200">no memory between requests</strong>. To have a
        conversation, your app re-sends the entire message history every time — which is why long chats and
        agent loops get slower and more expensive.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Prompt builder                                                       */
/* ------------------------------------------------------------------ */
const PROMPT_PARTS = [
  { key: 'role', label: 'Role', text: 'You are a senior customer-support analyst for an online store.' },
  { key: 'context', label: 'Context', text: 'Our refund policy: full refund within 30 days; shipping delays over 7 days get a $10 credit.' },
  { key: 'examples', label: 'Example', text: 'Example → Email: "Package is 9 days late" → {"category": "shipping", "action": "issue_credit"}' },
  { key: 'format', label: 'Output format', text: 'Respond ONLY with JSON: {"category", "sentiment", "action", "reply"}.' },
  { key: 'constraints', label: 'Constraints', text: 'Never promise a refund the policy does not allow. Keep the reply under 60 words.' },
] as const;

const OUTPUTS = [
  'The customer seems upset about their order. They might want a refund or some kind of compensation. You should probably reply to them and apologize.',
  'As a support analyst: the customer is upset about a late order and wants a refund. Recommend apologising and processing a refund.',
  'Category: shipping delay (12 days). Per policy, delays over 7 days get a $10 credit; the order is within 30 days so a refund is also allowed. Suggest offering both options.',
  'Category: shipping. Sentiment: negative. Action: issue_credit. Reply: "Sorry for the 12-day delay — we\'ve added a $10 credit."',
  '{"category": "shipping", "sentiment": "negative", "action": "issue_credit", "reply": "Sorry your order is 12 days late. We\'ve added a $10 credit."}',
  '{"category": "shipping", "sentiment": "negative", "action": "issue_credit", "reply": "We\'re sorry your order is 12 days late. We\'ve added a $10 credit to your account, and you can still request a full refund within 30 days."}',
];

function PromptBuilder() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ role: false, context: false, examples: false, format: false, constraints: false });
  const count = Object.values(enabled).filter(Boolean).length;
  const assembled = [
    ...PROMPT_PARTS.filter((p) => enabled[p.key]).map((p) => p.text),
    'Task: Analyse this email → "My order is 12 days late. This is ridiculous."',
  ].join('\n\n');

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 text-stone-100">
      <div className="border-b border-stone-800 bg-stone-900 px-5 py-3.5">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-400">
          Interactive · Prompt builder
        </div>
        <h3 className="font-display text-base font-bold text-white">
          Toggle prompt ingredients and watch the (simulated) answer improve
        </h3>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_PARTS.map((p) => (
              <button
                key={p.key}
                onClick={() => setEnabled((e) => ({ ...e, [p.key]: !e[p.key] }))}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                  enabled[p.key]
                    ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                    : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                }`}
              >
                {enabled[p.key] ? '✓ ' : '+ '}
                {p.label}
              </button>
            ))}
          </div>
          <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-stone-800 bg-stone-900 p-3 font-mono text-[11.5px] leading-relaxed text-stone-200">
            {assembled}
          </pre>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Answer quality</span>
            <span className="font-mono text-amber-300">{count}/5 ingredients</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-800">
            <div className="h-full rounded-full bg-gradient-to-r from-[#D94436] to-emerald-400 transition-all" style={{ width: `${(count / 5) * 100}%` }} />
          </div>
          <motion.div
            key={count}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex-1 rounded-xl border border-stone-800 bg-stone-900 p-3 font-mono text-[12px] leading-relaxed text-stone-200"
          >
            {OUTPUTS[count]}
          </motion.div>
          <p className="mt-2 text-[11px] text-stone-500">
            {count < 3
              ? 'Vague prompt → vague answer. The model has to guess your policy and format.'
              : count < 5
                ? 'Getting there: grounded in policy and closer to a usable format.'
                : 'Production-grade: grounded, consistent, machine-readable and safe to automate.'}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                             */
/* ------------------------------------------------------------------ */
const TIMELINE = [
  { when: '2017', title: 'The Transformer', detail: 'Google researchers publish "Attention Is All You Need", introducing the Transformer architecture.', why: 'Every modern LLM is a Transformer. It made training on huge datasets in parallel practical.' },
  { when: '2018–19', title: 'Pre-training works', detail: 'BERT and GPT-2 show that models pre-trained on huge amounts of text learn grammar and facts without labels.', why: 'Established the "pre-train once, adapt everywhere" recipe.' },
  { when: '2020', title: 'GPT-3 & few-shot prompting', detail: 'A 175B-parameter model learns new tasks just from examples placed in the prompt.', why: 'Prompting became a new kind of programming.' },
  { when: '2022', title: 'Chain-of-Thought & ReAct', detail: 'Research shows models reason better step by step, and can interleave reasoning with actions and observations.', why: 'ReAct is the blueprint loop that almost every agent still uses.' },
  { when: 'Nov 2022', title: 'ChatGPT', detail: 'An instruction-tuned, RLHF-aligned chat model reaches a mass audience within weeks.', why: 'LLMs go mainstream; every company starts experimenting.' },
  { when: 'Spring 2023', title: 'AutoGPT & BabyAGI', detail: 'Open-source projects loop GPT-4 autonomously toward goals. Hugely popular — and famously unreliable.', why: 'Proved the idea, and exposed the real problems: loops, cost, drift and no evals.' },
  { when: 'Jun 2023', title: 'Native function calling', detail: 'OpenAI adds structured function calling to its API; Google, Anthropic and others follow.', why: 'Reliable, schema-validated tool use turned demos into products.' },
  { when: 'Mar 2024', title: 'Devin & SWE-bench', detail: 'Cognition demos an autonomous software-engineering agent; SWE-bench becomes the go-to agent benchmark.', why: 'Agents moved from chat to doing real multi-hour work.' },
  { when: 'Sep 2024', title: 'Reasoning models', detail: 'OpenAI o1 is trained to think longer before answering; Gemini thinking models and DeepSeek-R1 (Jan 2025) follow.', why: 'Planning and self-correction improved dramatically — a huge win for agents.' },
  { when: 'Oct 2024', title: 'Computer use', detail: 'Anthropic lets Claude operate a computer through screenshots, mouse and keyboard.', why: 'Agents can work with apps that have no API.' },
  { when: 'Nov 2024', title: 'Model Context Protocol (MCP)', detail: 'Anthropic open-sources MCP, a standard way to connect models to tools and data. Broad industry adoption follows in 2025.', why: 'Write a tool integration once, use it from any agent.' },
  { when: '2025', title: 'CLI agents & A2A', detail: 'Claude Code, OpenAI Codex CLI and Gemini CLI bring agents to the terminal; Google launches the Agent2Agent (A2A) protocol.', why: 'Agents become everyday developer tools and start talking to each other.' },
];

function AgentTimeline() {
  const [idx, setIdx] = useState(6);
  const ev = TIMELINE[idx];
  return (
    <div className="my-8 rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 dark:border-stone-800 dark:bg-stone-900/70">
      <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#D94436]">
        Interactive · How AI agents came into existence
      </div>
      <div className="relative mt-6 overflow-x-auto pb-2">
        <div className="relative flex min-w-[720px] items-start justify-between">
          <div className="absolute left-0 right-0 top-[9px] h-0.5 bg-[#E5DFD3] dark:bg-stone-700" />
          {TIMELINE.map((t, i) => (
            <button key={t.title} onClick={() => setIdx(i)} className="relative z-10 flex w-[60px] flex-col items-center text-center">
              <span
                className={`h-[18px] w-[18px] rounded-full border-2 transition ${
                  i === idx
                    ? 'scale-125 border-[#D94436] bg-[#D94436]'
                    : i < idx
                      ? 'border-[#D94436] bg-[#FDF2F0] dark:bg-stone-900'
                      : 'border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-900'
                }`}
              />
              <span className={`mt-2 font-mono text-[10px] ${i === idx ? 'font-bold text-[#D94436]' : 'text-stone-500'}`}>{t.when}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-[#E5DFD3] bg-[#FAF7F0] p-4 dark:border-stone-800 dark:bg-stone-950">
        <div className="font-mono text-xs text-[#D94436]">{ev.when}</div>
        <h4 className="mt-0.5 font-display text-lg font-bold text-stone-950 dark:text-white">{ev.title}</h4>
        <p className="mt-1.5 text-sm text-stone-700 dark:text-stone-300">{ev.detail}</p>
        <p className="mt-2 text-sm text-stone-900 dark:text-stone-100">
          <strong className="text-[#B83226] dark:text-[#F88B80]">Why it matters: </strong>
          {ev.why}
        </p>
        <div className="mt-3 flex gap-2">
          <button disabled={idx === 0} onClick={() => setIdx((i) => i - 1)} className="rounded-md border border-stone-300 px-2.5 py-1 text-xs font-semibold text-stone-700 disabled:opacity-30 dark:border-stone-700 dark:text-stone-300">← Earlier</button>
          <button disabled={idx === TIMELINE.length - 1} onClick={() => setIdx((i) => i + 1)} className="rounded-md bg-[#D94436] px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-30">Later →</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Autonomy ladder                                                      */
/* ------------------------------------------------------------------ */
const LADDER = [
  { level: 'L0', name: 'Single prompt', example: '"Summarise this email."', when: 'One-shot text transforms: summarise, translate, classify.', who: 'You control everything.' },
  { level: 'L1', name: 'Chat + RAG', example: 'Support bot answering from your help-center articles.', when: 'Answering questions grounded in your documents.', who: 'Model answers; retrieval is fixed code.' },
  { level: 'L2', name: 'Tool-calling assistant', example: '"Where is my order?" → calls get_order_status().', when: 'One or two actions per request.', who: 'Model picks the tool; you run it.' },
  { level: 'L3', name: 'Workflow', example: 'Extract invoice → validate → route for approval.', when: 'Known steps, strict compliance, predictable cost.', who: 'Your code controls the steps; LLM fills in some.' },
  { level: 'L4', name: 'Autonomous agent', example: 'Coding agent that reads files, edits, runs tests until green.', when: 'Open-ended tasks where the steps are not known upfront.', who: 'The model decides the next step in a loop.' },
  { level: 'L5', name: 'Multi-agent system', example: 'Research lead + parallel researcher agents + fact-checker.', when: 'Large tasks that benefit from parallelism or isolation.', who: 'Several agents coordinate; humans supervise.' },
];

function AutonomyLadder() {
  const [idx, setIdx] = useState(3);
  const step = LADDER[idx];
  return (
    <div className="my-8 grid gap-5 rounded-2xl border border-[#E5DFD3] bg-[#FFFDF9] p-5 dark:border-stone-800 dark:bg-stone-900/70 md:grid-cols-12">
      <div className="flex items-end gap-1.5 md:col-span-7">
        {LADDER.map((l, i) => (
          <button
            key={l.level}
            onClick={() => setIdx(i)}
            className={`flex flex-1 flex-col items-center justify-end rounded-t-lg px-1 pb-2 pt-2 transition ${
              i === idx ? 'bg-[#D94436] text-white' : 'bg-[#F4ECDB] text-stone-700 hover:bg-[#F3D7D4] dark:bg-stone-800 dark:text-stone-300'
            }`}
            style={{ height: `${70 + i * 30}px` }}
          >
            <span className="font-mono text-xs font-bold">{l.level}</span>
            <span className="mt-0.5 text-center text-[10px] leading-tight">{l.name}</span>
          </button>
        ))}
      </div>
      <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:col-span-5">
        <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#D94436]">Autonomy level {step.level}</div>
        <h4 className="font-display text-lg font-bold text-stone-950 dark:text-white">{step.name}</h4>
        <dl className="mt-2 space-y-1.5 text-sm">
          <div><dt className="inline font-semibold text-stone-900 dark:text-stone-100">Example: </dt><dd className="inline text-stone-600 dark:text-stone-300">{step.example}</dd></div>
          <div><dt className="inline font-semibold text-stone-900 dark:text-stone-100">Use when: </dt><dd className="inline text-stone-600 dark:text-stone-300">{step.when}</dd></div>
          <div><dt className="inline font-semibold text-stone-900 dark:text-stone-100">Who is in control: </dt><dd className="inline text-stone-600 dark:text-stone-300">{step.who}</dd></div>
        </dl>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter                                                              */
/* ------------------------------------------------------------------ */
export function ChapterPromptingApis(_props: { isCompleted: boolean; onComplete: () => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Using LLMs from code"
        title="Anatomy of an LLM API Call"
        description="Every LLM provider (Google, OpenAI, Anthropic, open-weight servers) works the same way: you send a list of messages plus a few settings, and get generated text back. Once you understand this, every SDK and framework looks familiar."
      />

      <ApiCallFlow />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['system', 'Standing instructions: who the model is, the rules, the output format. Sent with every request.'],
          ['user', 'What the human (or your program) is asking right now.'],
          ['assistant / model', "The model's previous replies. You send them back so it remembers the conversation."],
        ].map(([role, desc]) => (
          <div key={role} className="rounded-xl border border-[#E5DFD3] bg-[#FFFDF9] p-4 dark:border-stone-800 dark:bg-stone-900/70">
            <code className="text-sm font-bold text-[#D94436]">{role}</code>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{desc}</p>
          </div>
        ))}
      </div>

      <CodeBlock
        title="Your first LLM call"
        tabs={[
          {
            label: 'Python',
            language: 'python',
            code: `# pip install google-genai   (set GEMINI_API_KEY in your environment)
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain what an API rate limit is in two sentences.",
    config=types.GenerateContentConfig(
        system_instruction="You are a patient senior engineer. Use simple words.",
        temperature=0.2,
        max_output_tokens=200,
    ),
)

print(response.text)
print(response.usage_metadata)  # prompt + output token counts → what you pay for`,
          },
          {
            label: 'TypeScript',
            language: 'typescript',
            code: `// npm install @google/genai
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({}); // reads GEMINI_API_KEY

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Explain what an API rate limit is in two sentences.',
  config: {
    systemInstruction: 'You are a patient senior engineer. Use simple words.',
    temperature: 0.2,
    maxOutputTokens: 200,
  },
});

console.log(response.text);`,
          },
          {
            label: 'Raw HTTP (curl)',
            language: 'bash',
            code: `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" \\
  -H "x-goog-api-key: $GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -X POST \\
  -d '{
    "system_instruction": {"parts": [{"text": "Use simple words."}]},
    "contents": [{"role": "user", "parts": [{"text": "What is a rate limit?"}]}],
    "generationConfig": {"temperature": 0.2, "maxOutputTokens": 200}
  }'`,
          },
        ]}
      />

      <Callout type="warning" title="Model names change often">
        This handbook uses <code>gemini-2.5-flash</code> and <code>gemini-2.5-pro</code> in examples. Providers
        release new versions every few months — always check the provider&apos;s models page and pin an exact
        version in production so behaviour doesn&apos;t change under you.
      </Callout>

      <SectionHeader
        eyebrow="Prompt engineering"
        title="The Six Ingredients of a Good Prompt"
        description="A prompt is a brief for a very capable contractor who knows nothing about your business. Role, context, task, examples, output format and constraints turn a vague request into a reliable result."
      />

      <PromptBuilder />

      <SectionHeader
        eyebrow="Structured output"
        title="Make the Model Return Data, Not Prose"
        description="When code consumes the answer, ask for JSON that matches a schema. Modern APIs constrain generation so the output always parses — no regex hacks needed. This is the same mechanism that powers tool calling."
      />

      <CodeBlock
        title="Structured output with a schema"
        tabs={[
          {
            label: 'Python (Pydantic)',
            language: 'python',
            code: `from pydantic import BaseModel
from google import genai

class Ticket(BaseModel):
    category: str      # "billing" | "shipping" | "bug"
    urgency: int       # 1 (low) to 5 (critical)
    summary: str

client = genai.Client()
resp = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Classify: 'My card was charged twice, please fix ASAP!'",
    config={"response_mime_type": "application/json", "response_schema": Ticket},
)

ticket: Ticket = resp.parsed
print(ticket.category, ticket.urgency)  # billing 5`,
          },
          {
            label: 'TypeScript',
            language: 'typescript',
            code: `import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({});
const resp = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: "Classify: 'My card was charged twice, please fix ASAP!'",
  config: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING },
        urgency: { type: Type.INTEGER },
        summary: { type: Type.STRING },
      },
      required: ['category', 'urgency', 'summary'],
    },
  },
});

const ticket = JSON.parse(resp.text ?? '{}');`,
          },
        ]}
      />

      <Callout type="tip" title="Prompting habits that save hours">
        <ul className="list-disc space-y-1 pl-5">
          <li>Put stable instructions in the <strong>system</strong> message and changing data at the end (this also makes caching work — Chapter 6).</li>
          <li>Show 1–3 <strong>examples</strong> of exactly the output you want; models copy patterns very well.</li>
          <li>Tell the model what to do when it doesn&apos;t know: <em>&ldquo;If the answer isn&apos;t in the context, say so.&rdquo;</em></li>
          <li>Keep a small set of test inputs and re-run them after every prompt change. That is the seed of evals (Chapter 14).</li>
        </ul>
      </Callout>

      <SectionHeader
        eyebrow="History"
        title="How AI Agents Came Into Existence"
        description="Agents didn't appear overnight. Each breakthrough below solved one missing piece — click through the timeline to see how we got from a research paper to agents that write code and book flights."
      />

      <AgentTimeline />

      <SectionHeader
        eyebrow="The big picture"
        title="From Chatbot to Agent: The Autonomy Ladder"
        description="'Agent' is not on/off — it is a ladder of how much control you hand to the model. Higher levels are more powerful but harder to test and more expensive. Climb only as high as your problem needs."
      />

      <AutonomyLadder />

      <Callout type="insight" title="You are now ready for agents">
        You know what an LLM is, how to call one, how to write a good prompt and how to get structured output.
        An agent is simply these pieces running in a loop with tools and memory. Chapter 3 builds that loop from
        scratch in about 30 lines of code.
      </Callout>
    </div>
  );
}
