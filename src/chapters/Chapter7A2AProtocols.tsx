import React from 'react';
import { ArrowRightLeft, Globe, Lock, Radio, Server, Webhook } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { A2AProtocolSimulator } from '../components/diagrams/A2AProtocolSimulator';

export function Chapter7A2AProtocols({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Interoperability"
        title="Agent-to-Agent (A2A) Communication & Open Protocols"
        description="Inside a single codebase, agents call each other via in-process function calls. Across teams, microservices, clouds, and vendors, agents need an open network protocol — enter the Agent2Agent (A2A) Protocol."
      />

      <Callout type="architecture" title="MCP + A2A: Complementary Layers, Not Competitors!">
        <p>
          Think of it like building a restaurant: <strong>MCP (Model Context Protocol)</strong> connects
          a chef (Agent) to their kitchen tools, knives, and pantry (Databases, APIs, CLIs).{' '}
          <strong>A2A (Agent-to-Agent Protocol)</strong> lets the Front-of-House Waiter Agent coordinate
          with the Kitchen Agent and the Delivery Driver Agent — even if each was built by a different
          company using different frameworks (ADK, LangGraph, CrewAI, Bedrock)!
        </p>
      </Callout>

      <A2AProtocolSimulator />

      <SectionHeader
        eyebrow="A2A Architecture"
        title="The 5 Core Pillars of the A2A Protocol"
        description="Originally introduced by Google with 50+ industry partners and donated to the Linux Foundation, A2A treats remote agents as opaque collaborators — no need to leak internal prompts, memory, or proprietary tools."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ConceptCard icon={<Globe className="h-4 w-4" />} title="1. Agent Card Discovery" badge="/.well-known/agent-card.json">
          A standardized JSON manifest served over HTTPS advertising the agent&apos;s identity, endpoint
          URL, skills, input/output modalities, streaming capability, and authentication requirements.
        </ConceptCard>
        <ConceptCard icon={<ArrowRightLeft className="h-4 w-4" />} title="2. Task Lifecycle State Machine" badge="Stateful">
          Every collaboration is a tracked <code>Task</code> with states:{' '}
          <code>submitted → working → input-required → completed | failed | canceled</code>. Supports
          instant tasks and 4-hour async jobs alike!
        </ConceptCard>
        <ConceptCard icon={<Radio className="h-4 w-4" />} title="3. Multimodal Parts & Artifacts" badge="Rich Payloads">
          Messages and final Artifacts carry typed <code>Parts</code>: <code>TextPart</code>,{' '}
          <code>FilePart</code> (PDFs, images, audio), and <code>DataPart</code> (structured JSON forms).
        </ConceptCard>
        <ConceptCard icon={<Webhook className="h-4 w-4" />} title="4. SSE Streaming & Push Webhooks" badge="Real-Time & Async">
          Use Server-Sent Events (SSE) for real-time token/status streaming, or register a Push
          Notification webhook for long-running background tasks that complete hours later.
        </ConceptCard>
        <ConceptCard icon={<Lock className="h-4 w-4" />} title="5. Enterprise Auth & Opacity" badge="Zero Trust">
          Standard HTTP auth (OAuth 2.0, OIDC, mTLS, API Keys). Remote agents never expose internal
          chain-of-thought or private tool credentials to callers.
        </ConceptCard>
        <ConceptCard icon={<Server className="h-4 w-4" />} title="6. Event-Driven Brokers" badge="Pub/Sub & Temporal">
          For massive async fleets, pair A2A with <strong>Cloud Pub/Sub / Kafka</strong> (event
          choreography) and <strong>Temporal / Cloud Workflows</strong> (durable execution &amp; retries).
        </ConceptCard>
      </div>

      <CodeBlock
        title="Expose & Consume an A2A Agent in Google ADK"
        tabs={[
          {
            label: 'Expose A2A Server (Python)',
            language: 'python',
            code: `from google.adk.agents import Agent
from google.adk.a2a.utils.agent_to_a2a import to_a2a

travel_agent = Agent(
    name="acme_travel_agent",
    model="gemini-2.5-flash",
    description="Books corporate flights and validates travel expense policy.",
    instruction="Check corporate policy before confirming any itinerary.",
    tools=[search_flights, book_flight],
)

# Auto-generates /.well-known/agent-card.json + JSON-RPC/SSE A2A ASGI app!
a2a_app = to_a2a(travel_agent, port=8001)
# Run with: uvicorn server:a2a_app --host 0.0.0.0 --port 8001`,
          },
          {
            label: 'Consume Remote A2A Agent (Python)',
            language: 'python',
            code: `from google.adk.agents import Agent
from google.adk.agents.remote_a2a_agent import RemoteA2aAgent

# Discover remote agent dynamically via its Agent Card!
remote_travel = RemoteA2aAgent(
    name="travel_partner",
    description="Handles corporate flight bookings via A2A.",
    agent_card="https://travel-agent.acme.com/.well-known/agent-card.json",
)

# Your local orchestrator delegates seamlessly to the remote A2A agent
executive_assistant = Agent(
    name="exec_assistant",
    model="gemini-2.5-pro",
    instruction="Coordinate meetings and delegate travel bookings to travel_partner.",
    sub_agents=[remote_travel],
)`,
          },
        ]}
      />
    </div>
  );
}
