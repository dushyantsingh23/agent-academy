import React from 'react';
import { Brain, Database, GitMerge, History, RefreshCw, Sparkles } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { MemoryContextLab } from '../components/diagrams/MemoryContextLab';

export function Chapter2ReasoningMemory({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Cognition & Context"
        title="Reasoning & Planning Architectures"
        description="Raw next-token prediction struggles with multi-hop problems unless given test-time compute and structured cognitive patterns. Here are the 6 reasoning engines every agent builder must know."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConceptCard icon={<Brain className="h-4 w-4" />} title="Chain-of-Thought (CoT)" badge="Test-Time Compute">
          Allocates intermediate reasoning tokens before emitting an answer or tool call. Modern reasoning
          models (Gemini Thinking, Claude Extended Thinking, OpenAI o-series) internalize CoT via RL.
        </ConceptCard>
        <ConceptCard icon={<RefreshCw className="h-4 w-4" />} title="ReAct (Reason + Act)" badge="Interleaved">
          Alternates <code>Thought → Action → Observation</code>. Grounds reasoning in real external data
          at every hop, dramatically reducing hallucination vs. pure CoT.
        </ConceptCard>
        <ConceptCard icon={<GitMerge className="h-4 w-4" />} title="Plan-and-Execute" badge="Two-Stage">
          A strong planner model writes a multi-step DAG or checklist upfront; faster worker models execute
          each step and a replanner adjusts when observations fail.
        </ConceptCard>
        <ConceptCard icon={<Sparkles className="h-4 w-4" />} title="Reflection / Reflexion" badge="Self-Critique">
          After generating a draft or failing a test, the agent critiques its own output and writes a
          verbal lesson into episodic memory before retrying.
        </ConceptCard>
        <ConceptCard icon={<Database className="h-4 w-4" />} title="Tree of Thoughts (ToT) / LATS" badge="Search">
          Explores multiple candidate branches in parallel, scores each branch with a verifier/value
          function, and backtracks from dead ends (like Monte Carlo Tree Search for LLMs).
        </ConceptCard>
        <ConceptCard icon={<History className="h-4 w-4" />} title="CodeAct" badge="Executable Thought">
          Unifies reasoning and action by letting the agent emit executable Python code. A single 15-line
          script can replace 20 sequential JSON tool calls!
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="Memory Systems"
        title="The 4 Types of Agent Memory"
        description="Inspired by human cognitive architecture (CoALA framework), production agents separate ephemeral context from durable long-term stores."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Memory Type</th>
              <th className="px-4 py-3">What It Stores</th>
              <th className="px-4 py-3">Typical Implementation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/60">
            <tr>
              <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">1. Working (Short-Term)</td>
              <td className="px-4 py-3">Current conversation turns, scratchpad, active tool outputs</td>
              <td className="px-4 py-3 font-mono text-xs">LLM Context Window + Session State (Redis / Postgres)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-fuchsia-600 dark:text-fuchsia-400">2. Episodic</td>
              <td className="px-4 py-3">Past user interactions, preferences, previous bug fixes &amp; trajectories</td>
              <td className="px-4 py-3 font-mono text-xs">Vertex AI Memory Bank, Mem0, Zep, LangMem</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">3. Semantic</td>
              <td className="px-4 py-3">World knowledge, company docs, codebase index, structured facts</td>
              <td className="px-4 py-3 font-mono text-xs">Hybrid RAG (Vector DB + BM25 + Reranker + Knowledge Graph)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">4. Procedural</td>
              <td className="px-4 py-3">How to do tasks: system instructions, skills, tool schemas, few-shot rules</td>
              <td className="px-4 py-3 font-mono text-xs">System Prompt, SKILL.md modules, Fine-tuned LoRA weights</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader
        eyebrow="Context Engineering"
        title="Fighting Context Rot with Compaction & Hybrid RAG"
        description="Even with 1M-token context windows, dumping raw JSON logs into every turn degrades reasoning accuracy ('Context Rot') and explodes latency & cost. Try the interactive lab below!"
      />

      <MemoryContextLab />

      <Callout type="tip" title="Production Rule: Write, Select, Compress, Isolate">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Write:</strong> Persist large tool outputs (e.g., 50KB HTML or SQL dumps) to scratch files/artifacts and pass only a summary + pointer into context.</li>
          <li><strong>Select:</strong> Use hybrid search (dense embeddings + BM25 lexical search + cross-encoder reranking) instead of naive top-k vector lookup.</li>
          <li><strong>Compress:</strong> Trigger automatic summarization/compaction once working context passes 60–70% of your target budget.</li>
          <li><strong>Isolate:</strong> Delegate noisy sub-tasks (like searching 30 files) to a subagent that returns only a crisp 200-token answer.</li>
        </ul>
      </Callout>

      <CodeBlock
        title="Context Compaction & Episodic Memory Extraction Pattern"
        tabs={[
          {
            label: 'Python',
            language: 'python',
            code: `def maybe_compact_history(messages: list[dict], token_count: int, budget: int = 32_000):
    if token_count < budget * 0.7:
        return messages

    # Keep system prompt + last 4 fresh turns; summarize the middle!
    system = messages[:1]
    middle = messages[1:-4]
    recent = messages[-4:]

    summary = llm_fast.generate(
        "Compress these past agent turns into bullet points preserving: "
        "1) key facts discovered, 2) decisions made, 3) open TODOs. Drop raw logs.\\n"
        f"{middle}"
    )
    return system + [{"role": "system", "content": f"COMPACTED MEMORY:\\n{summary}"}] + recent`,
          },
        ]}
      />
    </div>
  );
}
