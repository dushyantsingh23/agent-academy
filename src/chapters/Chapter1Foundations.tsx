import React from 'react';
import { Bot, Brain, Compass, Cpu, GitBranch, Layers, Zap, Eye, Terminal } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { AgentLoopSimulator } from '../components/diagrams/AgentLoopSimulator';

export function Chapter1Foundations({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Core Concepts"
        title="What Actually Makes an AI System an Agent?"
        description="A standard LLM call is stateless: one prompt in, one completion out. An AI Agent wraps one or more foundation models in a control loop with memory, tools, and autonomy to perceive an environment, plan actions, observe outcomes, and iterate until a goal is achieved."
      />

      <Callout type="insight" title="The Mental Model: Agent = Model + Tools + Memory + Control Loop">
        <p>
          Think of an LLM as a brilliant brain in a jar. By itself it can only predict text. Give it{' '}
          <strong>eyes</strong> (sensors, search, logs, APIs), <strong>hands</strong> (tool calling,
          CLIs, code execution, UI clicks), <strong>memory</strong> (working context + episodic/semantic
          stores), and a <strong>while-loop</strong> that checks whether the goal is done — and you have
          an autonomous AI Agent.
        </p>
      </Callout>

      <AgentLoopSimulator />

      <SectionHeader
        eyebrow="Taxonomy · Part 1"
        title="Classical AI Agent Types (Russell & Norvig)"
        description="Modern LLM agents stand on 40 years of computer science. Understanding the five classical agent architectures helps you design the right level of intelligence instead of over-engineering."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConceptCard icon={<Zap className="h-4 w-4" />} title="1. Simple Reflex Agent" badge="Stateless">
          Acts solely on the current percept via <code>if-condition → action</code> rules. Fast and
          deterministic, but fails whenever partial observability requires history. <em>Example:</em>{' '}
          Regex spam filter, thermostat, webhook router.
        </ConceptCard>
        <ConceptCard icon={<Eye className="h-4 w-4" />} title="2. Model-Based Reflex" badge="Internal State">
          Maintains an internal world model tracking aspects of the environment it cannot currently see.{' '}
          <em>Example:</em> A support bot tracking authentication state and conversation history across turns.
        </ConceptCard>
        <ConceptCard icon={<Compass className="h-4 w-4" />} title="3. Goal-Based Agent" badge="Planning">
          Evaluates sequences of actions against an explicit target state before acting. <em>Example:</em>{' '}
          A coding agent planning which files to edit and tests to run to make CI green.
        </ConceptCard>
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="4. Utility-Based Agent" badge="Optimization">
          Scores competing valid plans with a utility function (cost, latency, risk, user preference).{' '}
          <em>Example:</em> A travel agent trading off nonstop convenience vs. budget cap vs. arrival time.
        </ConceptCard>
        <ConceptCard icon={<Brain className="h-4 w-4" />} title="5. Learning Agent" badge="Self-Improving">
          Contains a Critic and Learning Element that updates prompts, episodic memory, or weights from
          feedback over time. <em>Example:</em> Agents using reflection memory or RLVR post-training.
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="Taxonomy · Part 2"
        title="Modern Forms of LLM-Powered AI Agents"
        description="In production today, engineers build several distinct species of agents depending on the interface and autonomy level:"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ConceptCard icon={<Bot className="h-4 w-4" />} title="Tool-Use / ReAct Agents" badge="Most Common">
          Interleave natural-language reasoning (<strong>Thought</strong>) with structured function calls
          (<strong>Action</strong>) and inspect returned outputs (<strong>Observation</strong>). Ideal for
          SaaS copilots, CRM automation, and data lookup.
        </ConceptCard>
        <ConceptCard icon={<Terminal className="h-4 w-4" />} title="CodeAct & Coding Agents" badge="High Power">
          Instead of calling narrow JSON APIs, the agent writes and executes Python/Bash code inside a
          sandbox to compose loops, filter data, and run tests. Powers SWE agents like Claude Code, Codex,
          and Antigravity.
        </ConceptCard>
        <ConceptCard icon={<Cpu className="h-4 w-4" />} title="Computer-Use & Browser Agents" badge="Vision + GUI">
          Perceive screenshots or DOM accessibility trees and emit mouse clicks, typing, and scrolling.
          Essential for legacy enterprise apps and websites that lack clean APIs.
        </ConceptCard>
        <ConceptCard icon={<GitBranch className="h-4 w-4" />} title="Ambient / Background & Deep Research" badge="Async">
          Event-driven agents triggered by webhooks, cron jobs, or tickets that run for minutes or hours
          — conducting multi-hop research, triaging alerts, or opening PRs while humans sleep.
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="Crucial Architecture Decision"
        title="Workflows vs. Autonomous Agents"
        description="The #1 mistake beginners make is using an open-ended autonomous agent when a deterministic workflow with LLM nodes would be 10x cheaper, faster, and more reliable."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Dimension</th>
              <th className="px-4 py-3">Agentic Workflow (Prescriptive)</th>
              <th className="px-4 py-3">Autonomous Agent (Dynamic)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/60">
            <tr>
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Control Flow</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Predefined code paths (chains, routers, parallel fan-out)</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">LLM dynamically chooses next tool, steps, and stop condition</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Predictability &amp; Cost</td>
              <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400">High predictability, bounded token budget</td>
              <td className="px-4 py-3 text-amber-600 dark:text-amber-400">Variable latency/cost; requires strict step &amp; budget caps</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Best Used For</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Invoice extraction, ticket triage, structured report pipelines</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">Open-ended debugging, deep research, novel problem solving</td>
            </tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        title="A Minimal Agent Loop From Scratch (Zero Frameworks)"
        tabs={[
          {
            label: 'Python (google-genai)',
            language: 'python',
            code: `from google import genai
from google.genai import types

client = genai.Client()

def get_weather(city: str) -> str:
    """Fetch current weather for a city."""
    return f"{city}: 18°C, partly cloudy"

def run_agent(goal: str, max_steps: int = 8) -> str:
    history = [types.Content(role="user", parts=[types.Part.from_text(text=goal)])]
    tools_map = {"get_weather": get_weather}

    for step in range(max_steps):
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=history,
            config=types.GenerateContentConfig(
                system_instruction="Think step by step. Use tools when needed.",
                tools=[get_weather],
                # Turn off auto-execution so OUR loop runs the tools
                automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
            ),
        )
        history.append(response.candidates[0].content)

        if not response.function_calls:
            return response.text  # Goal achieved!

        tool_parts = []
        for call in response.function_calls:
            result = tools_map[call.name](**call.args)
            tool_parts.append(
                types.Part.from_function_response(name=call.name, response={"result": result})
            )
        history.append(types.Content(role="user", parts=tool_parts))

    return "Stopped: max_steps budget reached."`,
          },
          {
            label: 'TypeScript (@google/genai)',
            language: 'typescript',
            code: `import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({});

async function runAgent(goal: string, maxSteps = 8) {
  const contents: any[] = [{ role: 'user', parts: [{ text: goal }] }];

  for (let step = 0; step < maxSteps; step++) {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: 'Reason carefully and invoke tools to accomplish the goal.',
        tools: [{
          functionDeclarations: [{
            name: 'getWeather',
            description: 'Get current weather for a city',
            parameters: {
              type: Type.OBJECT,
              properties: { city: { type: Type.STRING } },
              required: ['city'],
            },
          }],
        }],
      },
    });

    if (!res.functionCalls?.length) return res.text;

    contents.push(res.candidates![0].content);
    const responses = res.functionCalls.map((fc) => ({
      functionResponse: {
        name: fc.name,
        response: { result: \`\${fc.args.city}: 18°C, sunny\` },
      },
    }));
    contents.push({ role: 'user', parts: responses });
  }
  return 'Max step budget reached.';
}`,
          },
        ]}
      />
    </div>
  );
}
