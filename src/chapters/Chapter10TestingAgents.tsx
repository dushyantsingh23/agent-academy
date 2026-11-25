import React from 'react';
import {
  CheckCircle2,
  FlaskConical,
  GitCompare,
  Repeat,
  ShieldAlert,
  TestTube2,
  Users,
  Video,
} from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { TestingPyramidLab } from '../components/diagrams/TestingPyramidLab';

export function Chapter10TestingAgents({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Verification & Quality"
        title="Testing AI Agents: Mechanisms, Pyramids & Reliability Math"
        description="Traditional software is deterministic: given input X, expect exact output Y. AI agents are probabilistic, stateful, multi-step systems that call real APIs. Testing them requires a dedicated 6-layer testing pyramid combining deterministic software tests with statistical evaluations."
      />

      <TestingPyramidLab />

      <SectionHeader
        eyebrow="Testing Mechanisms"
        title="The 7 Essential Agent Testing Mechanisms"
        description="High-performing agent teams never rely on a single test type. Combine fast free deterministic checks on every commit with statistical and adversarial evals before release."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ConceptCard icon={<TestTube2 className="h-4 w-4" />} title="1. Tool Unit, Schema & Fuzz Testing" badge="Zero LLM Cost">
          Test every tool as normal code: invalid dates, null fields, SQL injection strings, 500 API
          timeouts, and idempotency keys. Use property-based fuzzing (<code>Hypothesis</code>) to prove
          your tool never crashes the agent loop on malformed LLM arguments.
        </ConceptCard>
        <ConceptCard icon={<Video className="h-4 w-4" />} title="2. Record-and-Replay (VCR) Snapshot Tests" badge="Deterministic CI">
          Record real LLM &amp; MCP tool responses once into JSON cassettes (<code>VCR.py</code> /{' '}
          <code>Polly.js</code>), then replay them in milliseconds on every commit. Catches orchestration
          bugs, broken JSON parsers, and retry regressions with <strong>$0 API spend and zero flake</strong>.
        </ConceptCard>
        <ConceptCard icon={<GitCompare className="h-4 w-4" />} title="3. Trajectory & State-Graph Assertions" badge="Behavioral">
          Verify the <em>path</em>, not just the destination: assert required tools were called, forbidden
          tools were never touched, state keys were populated correctly, and step/token budgets were respected.
        </ConceptCard>
        <ConceptCard icon={<Users className="h-4 w-4" />} title="4. Multi-Turn User Persona Simulations" badge="LLM-vs-LLM">
          Run an automated simulator LLM playing different user personas (impatient customer, vague
          requirements, hostile negotiator, non-native speaker) against your agent over 5–10 turns to
          uncover clarification loops and context drift.
        </ConceptCard>
        <ConceptCard icon={<Repeat className="h-4 w-4" />} title="5. Statistical Pass@k vs. Pass^k Testing" badge="Consistency">
          Because LLMs are stochastic, running a test once proves nothing. Run each golden task{' '}
          <code>k=5</code> times: track <strong>pass@k</strong> (can it solve it?) for coding tasks and{' '}
          <strong>pass^k</strong> (does it succeed <em>every single time</em>?) for mission-critical
          enterprise workflows.
        </ConceptCard>
        <ConceptCard icon={<FlaskConical className="h-4 w-4" />} title="6. LLM-as-a-Judge & Pairwise A/B Grading" badge="Scalable Rubric">
          Score open-ended outputs with a calibrated judge prompt (groundedness, tone, completeness).
          Prefer <strong>pairwise A/B comparison</strong> (&ldquo;Is Candidate B better than Baseline A?&rdquo;)
          over raw 1–10 scores — judges are far more consistent at relative rankings!
        </ConceptCard>
        <ConceptCard icon={<ShieldAlert className="h-4 w-4" />} title="7. Adversarial Red-Team & Shadow Testing" badge="Security + Prod">
          Run automated red-team suites (<code>Promptfoo</code>, <code>Garak</code>, <code>PyRIT</code>)
          for indirect prompt injection and data exfiltration, then mirror live traffic to new agent
          versions in <strong>Shadow Mode</strong> before exposing real users.
        </ConceptCard>
      </div>

      <Callout type="tip" title="Golden Rule: Turn Every Production Bug Into a Permanent Eval Case">
        <p>
          Whenever a user reports a hallucination, wrong tool call, or awkward handoff in production,
          export that exact OpenTelemetry trace into your <strong>Golden Regression Dataset</strong>.
          Within 3 months you will own a moat of 300+ real-world edge cases that automatically block
          regressions whenever you change prompts, tools, or models!
        </p>
      </Callout>

      <CodeBlock
        title="Multi-Mechanism Agent Test Suite (VCR + Persona Sim + Pass^k + Promptfoo)"
        tabs={[
          {
            label: 'Python (VCR + Pass^k)',
            language: 'python',
            code: `import pytest, vcr

# 1. Deterministic VCR Test ($0 cost, <200ms in CI)
@vcr.use_cassette("tests/cassettes/flight_hold_flow.yaml")
def test_agent_handles_tool_500_gracefully():
    res = run_agent("Hold nonstop flight SFO to NRT under $900")
    assert res.status == "held"
    assert res.retry_count == 1  # Verified retry logic without calling real LLM!

# 2. Statistical Pass^k Reliability Test (Pre-release Gate)
@pytest.mark.eval
def test_refund_policy_consistency_pass_power_k():
    k = 5
    passes = 0
    for _ in range(k):
        trace = run_agent_live("Refund order #8821 ($450 - over $100 limit)")
        # Must pause for HITL approval every single time!
        if "request_human_approval" in trace.tools and "issue_refund" not in trace.tools:
            passes += 1
    assert passes == k, f"Failed pass^{k} consistency: only {passes}/{k} passed!"`,
          },
          {
            label: 'Persona Simulator (Python)',
            language: 'python',
            code: `def simulate_conversation(agent, persona_prompt: str, max_turns: int = 6):
    user_sim = make_llm(system=persona_prompt)
    history = []
    user_msg = "Hi, I think you charged me twice last week and I'm furious."

    for turn in range(max_turns):
        agent_reply = agent.chat(user_msg, history=history)
        history.append(("user", user_msg))
        history.append(("agent", agent_reply))

        if agent_reply.resolved:
            break
        user_msg = user_sim.generate(f"Respond naturally to agent: {agent_reply.text}")

    return grade_transcript_with_judge(history, rubric="empathy + policy_adherence")`,
          },
          {
            label: 'Promptfoo Red-Team (YAML)',
            language: 'yaml',
            code: `# promptfooconfig.yaml — Automated Red-Team & Regression Suite
targets:
  - id: https://staging-agent.acme.com/v1/chat
redteam:
  plugins:
    - indirect-prompt-injection
    - pii:direct
    - excessive-agency
    - sql-injection
  strategies:
    - jailbreak
    - base64
# Run in CI: npx promptfoo@latest redteam run --fail-on-error`,
          },
        ]}
      />
    </div>
  );
}
