import React from 'react';
import { GitFork, Layers, Network, Shield, Users, Zap } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { MultiAgentSimulator } from '../components/diagrams/MultiAgentSimulator';

export function Chapter6MultiAgent({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Distributed Intelligence"
        title="Multi-Agent Systems (MAS) & Orchestration Topologies"
        description="When a single agent is overloaded with 40 tools, conflicting instructions, and massive logs, accuracy collapses. Multi-agent systems split work across specialized agents with isolated contexts, distinct permissions, and tailored models."
      />

      <Callout type="architecture" title="The 4 Valid Reasons to Go Multi-Agent">
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Context Isolation:</strong> Keep noisy research or file-scanning logs trapped inside a worker subagent so the coordinator&apos;s context stays razor-sharp.</li>
          <li><strong>Parallelization:</strong> Run 5 specialist reviewers (Security, Perf, Tests, Docs, Style) at once to cut wall-clock latency by 5×.</li>
          <li><strong>Security &amp; Blast-Radius Boundaries:</strong> Give the Read-Only Analyst access to public web search, and isolate write credentials inside a strictly audited Billing Agent.</li>
          <li><strong>Heterogeneous Models:</strong> Pair a fast Flash model for triage with a deep Pro reasoning model for architecture and a fine-tuned SLM for SQL generation.</li>
        </ul>
      </Callout>

      <MultiAgentSimulator />

      <SectionHeader
        eyebrow="State & Coordination"
        title="How Agents Share State Without Chaos"
        description="Multi-agent failures are rarely model failures — they are distributed systems bugs: stale state, infinite ping-pong loops, and conflicting edits."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="Shared Blackboard State" badge="Session Dict">
          All agents read/write typed keys (e.g., <code>state["research_notes"]</code>,{' '}
          <code>state["draft_report"]</code>) in a shared session store rather than forwarding massive
          unstructured chat histories.
        </ConceptCard>
        <ConceptCard icon={<GitFork className="h-4 w-4" />} title="Scoped Subagent Handoffs" badge="Clean Context">
          When delegating, pass only a crisp task brief + required artifact pointers. Never dump the
          entire parent conversation unless continuity is essential.
        </ConceptCard>
        <ConceptCard icon={<Shield className="h-4 w-4" />} title="Termination & Loop Budgets" badge="Safety">
          Every cyclic multi-agent system (Debate, Swarm, LoopAgent) MUST enforce{' '}
          <code>max_iterations</code>, <code>max_handoffs</code>, and a global token/dollar budget cap.
        </ConceptCard>
      </div>

      <CodeBlock
        title="Multi-Agent Composition in Google ADK (Parallel + Sequential + Loop)"
        tabs={[
          {
            label: 'Google ADK (Python)',
            language: 'python',
            code: `from google.adk.agents import LlmAgent, ParallelAgent, SequentialAgent, LoopAgent

security_agent = LlmAgent(
    name="security_reviewer",
    model="gemini-2.5-flash",
    instruction="Audit the PR diff for OWASP vulnerabilities. Save findings to state['sec'].",
    output_key="sec",
)

perf_agent = LlmAgent(
    name="perf_reviewer",
    model="gemini-2.5-flash",
    instruction="Check for N+1 queries and O(n^2) loops. Save findings to state['perf'].",
    output_key="perf",
)

# 1. Run both specialists concurrently!
parallel_review = ParallelAgent(
    name="parallel_review",
    sub_agents=[security_agent, perf_agent],
)

# 2. Synthesize into one unified PR review
synthesizer = LlmAgent(
    name="pr_synthesizer",
    model="gemini-2.5-pro",
    instruction="Merge {sec} and {perf} into a prioritized GitHub PR review.",
)

# Full pipeline: Parallel Fan-Out -> Aggregator
root_agent = SequentialAgent(
    name="code_review_pipeline",
    sub_agents=[parallel_review, synthesizer],
)`,
          },
          {
            label: 'LangGraph Supervisor (Python)',
            language: 'python',
            code: `from typing import TypedDict, Literal
from langgraph.graph import StateGraph, END

class TeamState(TypedDict):
    task: str
    research: str
    draft: str
    next_agent: Literal["researcher", "writer", "FINISH"]

def supervisor_node(state: TeamState):
    if not state.get("research"):
        return {"next_agent": "researcher"}
    if not state.get("draft"):
        return {"next_agent": "writer"}
    return {"next_agent": "FINISH"}

builder = StateGraph(TeamState)
builder.add_node("supervisor", supervisor_node)
builder.add_node("researcher", researcher_node)
builder.add_node("writer", writer_node)
builder.set_entry_point("supervisor")
builder.add_conditional_edges(
    "supervisor",
    lambda s: s["next_agent"],
    {"researcher": "researcher", "writer": "writer", "FINISH": END},
)
builder.add_edge("researcher", "supervisor")
builder.add_edge("writer", "supervisor")
graph = builder.compile()`,
          },
        ]}
      />
    </div>
  );
}
