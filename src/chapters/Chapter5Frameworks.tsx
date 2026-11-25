import React from 'react';
import { Blocks, Code2, Cpu, GitBranch, Layers, Sparkles } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { FrameworkWizard } from '../components/diagrams/FrameworkWizard';

export function Chapter5Frameworks({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Ecosystem Mastery"
        title="Every Major AI Agent Framework & Library Explained"
        description="The agent ecosystem moves fast — from low-level SDKs to stateful graph engines and role-based multi-agent platforms. Below is an honest, engineering-grade breakdown of all major frameworks, an interactive decision wizard, and side-by-side code."
      />

      <FrameworkWizard />

      <SectionHeader
        eyebrow="Complete Landscape"
        title="Framework Comparison Matrix"
        description="How the leading open-source and cloud-native agent libraries compare across language, orchestration paradigm, MCP/A2A support, and sweet spot."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 text-[11px] uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Framework</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3">Paradigm</th>
              <th className="px-4 py-3">MCP / A2A</th>
              <th className="px-4 py-3">Best Sweet Spot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/60">
            <tr>
              <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">Google ADK</td>
              <td className="px-4 py-3">Python, Java, Go</td>
              <td className="px-4 py-3">Composable Llm/Sequential/Parallel/Loop Agents</td>
              <td className="px-4 py-3 text-emerald-500 font-semibold">Native MCP + A2A</td>
              <td className="px-4 py-3">Multi-agent prod systems, GCP Agent Engine &amp; Cloud Run</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">LangGraph</td>
              <td className="px-4 py-3">Python, TypeScript</td>
              <td className="px-4 py-3">Explicit Cyclic State Machine / Graph</td>
              <td className="px-4 py-3">Via adapters</td>
              <td className="px-4 py-3">Deterministic state control, time-travel, HITL interrupts</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-rose-600 dark:text-rose-400">CrewAI</td>
              <td className="px-4 py-3">Python</td>
              <td className="px-4 py-3">Role-Based Crews + Deterministic Flows</td>
              <td className="px-4 py-3">MCP support</td>
              <td className="px-4 py-3">Fast multi-agent prototyping &amp; business process teams</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">OpenAI Agents SDK</td>
              <td className="px-4 py-3">Python, TypeScript</td>
              <td className="px-4 py-3">Lightweight Agents + Handoffs + Guardrails</td>
              <td className="px-4 py-3">Native MCP</td>
              <td className="px-4 py-3">Minimalist swarm handoffs with built-in tracing</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-amber-600 dark:text-amber-400">Claude Agent SDK</td>
              <td className="px-4 py-3">Python, TypeScript</td>
              <td className="px-4 py-3">CLI/File-First Loop + Subagents + Skills</td>
              <td className="px-4 py-3">Native MCP</td>
              <td className="px-4 py-3">Coding, filesystem, terminal &amp; computer-use agents</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-fuchsia-600 dark:text-fuchsia-400">PydanticAI</td>
              <td className="px-4 py-3">Python</td>
              <td className="px-4 py-3">Type-Safe Dependency Injection + Validated Outputs</td>
              <td className="px-4 py-3">Native MCP</td>
              <td className="px-4 py-3">Clean Python backends with strict schema contracts</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-cyan-600 dark:text-cyan-400">AutoGen / AG2 / MS Agent</td>
              <td className="px-4 py-3">Python, .NET</td>
              <td className="px-4 py-3">Event-Driven Actor / Multi-Agent Chat</td>
              <td className="px-4 py-3">MCP support</td>
              <td className="px-4 py-3">Enterprise .NET/Azure &amp; collaborative code-exec groups</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-violet-600 dark:text-violet-400">LlamaIndex Workflows</td>
              <td className="px-4 py-3">Python, TypeScript</td>
              <td className="px-4 py-3">Async Event-Driven Workflows</td>
              <td className="px-4 py-3">MCP support</td>
              <td className="px-4 py-3">Document-heavy enterprise RAG &amp; knowledge agents</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-sky-600 dark:text-sky-400">Vercel AI SDK / Mastra</td>
              <td className="px-4 py-3">TypeScript / JS</td>
              <td className="px-4 py-3">Streaming UI + Tool Loops + Workflows</td>
              <td className="px-4 py-3">Native MCP</td>
              <td className="px-4 py-3">Full-stack Next.js/React web apps with Generative UI</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">Smolagents / DSPy / Strands / Agno</td>
              <td className="px-4 py-3">Python</td>
              <td className="px-4 py-3">CodeAct (Smolagents), Prompt Compilation (DSPy), Bedrock (Strands)</td>
              <td className="px-4 py-3">MCP support</td>
              <td className="px-4 py-3">Specialized needs: CodeAct, prompt optimization, AWS</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SectionHeader
        eyebrow="Side-by-Side Code"
        title="The Exact Same Agent Across 6 Frameworks"
        description="Switch tabs below to compare how Google ADK, LangGraph, CrewAI, PydanticAI, OpenAI Agents SDK, and Vercel AI SDK express the same tool-using agent."
      />

      <CodeBlock
        title="Side-by-Side Framework Comparison"
        tabs={[
          {
            label: 'Google ADK',
            language: 'python',
            code: `from google.adk.agents import Agent

def lookup_stock(ticker: str) -> dict:
    """Fetch real-time stock price and P/E ratio."""
    return {"ticker": ticker, "price": 192.40, "pe": 26.4}

root_agent = Agent(
    name="equity_analyst",
    model="gemini-2.5-flash",
    description="Answers financial questions using verified market data.",
    instruction="Always call lookup_stock before quoting any price.",
    tools=[lookup_stock],
)
# Run interactive dev UI: $ adk web`,
          },
          {
            label: 'LangGraph',
            language: 'python',
            code: `from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI

def lookup_stock(ticker: str) -> dict:
    """Fetch real-time stock price and P/E ratio."""
    return {"ticker": ticker, "price": 192.40, "pe": 26.4}

model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")
graph = create_react_agent(model, tools=[lookup_stock])
result = graph.invoke({"messages": [("user", "Check GOOG stock")]})`,
          },
          {
            label: 'PydanticAI',
            language: 'python',
            code: `from pydantic import BaseModel
from pydantic_ai import Agent

class StockBrief(BaseModel):
    ticker: str
    price: float
    summary: str

agent = Agent("google-gla:gemini-2.5-flash", output_type=StockBrief)

@agent.tool_plain
def lookup_stock(ticker: str) -> dict:
    return {"ticker": ticker, "price": 192.40, "pe": 26.4}

res = agent.run_sync("Check GOOG stock")
print(res.output)  # Guaranteed valid StockBrief!`,
          },
          {
            label: 'CrewAI',
            language: 'python',
            code: `from crewai import Agent, Task, Crew
from crewai.tools import tool

@tool("lookup_stock")
def lookup_stock(ticker: str) -> str:
    """Fetch real-time stock price."""
    return f"{ticker}: $192.40 (P/E 26.4)"

analyst = Agent(
    role="Equity Analyst",
    goal="Deliver accurate stock summaries",
    backstory="10 years covering tech equities.",
    tools=[lookup_stock],
)
task = Task(description="Summarize GOOG", expected_output="3 bullet points", agent=analyst)
crew = Crew(agents=[analyst], tasks=[task])
crew.kickoff()`,
          },
          {
            label: 'OpenAI Agents SDK',
            language: 'python',
            code: `from agents import Agent, Runner, function_tool

@function_tool
def lookup_stock(ticker: str) -> str:
    return f"{ticker}: $192.40 (P/E 26.4)"

analyst = Agent(
    name="Equity Analyst",
    instructions="Always call lookup_stock before quoting prices.",
    tools=[lookup_stock],
)
result = Runner.run_sync(analyst, "Check GOOG stock")
print(result.final_output)`,
          },
          {
            label: 'Vercel AI SDK (TS)',
            language: 'typescript',
            code: `import { generateText, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const { text } = await generateText({
  model: google('gemini-2.5-flash'),
  stopWhen: stepCountIs(5), // let the agent loop up to 5 steps
  prompt: 'Check GOOG stock',
  tools: {
    lookupStock: tool({
      description: 'Fetch real-time stock price',
      inputSchema: z.object({ ticker: z.string() }),
      execute: async ({ ticker }) => ({ ticker, price: 192.4, pe: 26.4 }),
    }),
  },
});`,
          },
        ]}
      />

      <Callout type="insight" title="Pro Engineering Advice: Don't Over-Abstract Too Early">
        <p>
          Many top engineering teams start with the raw model SDK (<code>google-genai</code>,{' '}
          <code>@anthropic-ai/sdk</code>, <code>openai</code>) for simple single-agent loops so they own
          every token and retry. Reach for a framework like <strong>Google ADK</strong> or{' '}
          <strong>LangGraph</strong> once you need multi-agent orchestration, durable session
          checkpointing, streaming UIs, MCP/A2A interoperability, and built-in observability!
        </p>
      </Callout>
    </div>
  );
}
