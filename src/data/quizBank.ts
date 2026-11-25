import { ChapterId, QuizQuestion } from '../types';
import { CHAPTERS } from './chapters';

export interface QuizTopic {
  id: string;
  chapterNum: number;
  topic: string;
  badge: string;
  questions: QuizQuestion[];
}

const RAW_TOPICS: QuizTopic[] = [
  {
    id: 'ch1',
    chapterNum: 1,
    topic: 'Foundations & Types of Agents',
    badge: 'Agent Architect I',
    questions: [
      {
        id: 'q1',
        question: 'What is the defining architectural difference between a single LLM call and an AI Agent?',
        options: [
          'Agents always use a larger parameter count model.',
          'An agent runs an iterative control loop combining reasoning, tool execution, observations, and state until a goal is satisfied.',
          'Agents never use system prompts.',
          'Agents only work with local open-weights models.',
        ],
        correctIndex: 1,
        explanation: 'An agent wraps the model in an iterative perception → reasoning → action → observation loop with state/memory and termination conditions.',
      },
      {
        id: 'q2',
        question: 'When should you prefer a deterministic Agentic Workflow over an open-ended Autonomous Agent?',
        options: [
          'When the steps are well-defined, predictable cost/latency matters, and strict compliance is required.',
          'When the problem is completely unknown and requires open-ended exploration.',
          'Never — autonomous agents are always cheaper and faster.',
          'Only when you do not have access to tools.',
        ],
        correctIndex: 0,
        explanation: 'Workflows give predictable latency, lower cost, and easier auditing for repeatable business processes, whereas autonomous agents shine on open-ended tasks.',
      },
      {
        id: 'q3',
        question: 'In Russell & Norvig\'s taxonomy, which agent type explicitly scores competing valid plans using a preference function (e.g., cost vs. speed)?',
        options: ['Simple Reflex Agent', 'Utility-Based Agent', 'Stateless Router', 'Regex Agent'],
        correctIndex: 1,
        explanation: 'Utility-based agents map states/plans to a scalar utility score so they can pick the optimal trade-off among multiple goal-satisfying plans.',
      },
    ],
  },
  {
    id: 'ch2',
    chapterNum: 2,
    topic: 'Reasoning, Planning & Memory',
    badge: 'Memory Engineer',
    questions: [
      {
        id: 'q1',
        question: 'Which memory type stores reusable past experiences and user preferences across separate sessions?',
        options: ['Working / Short-Term Memory', 'Episodic Memory', 'CPU L1 Cache', 'Tokenization Vocabulary'],
        correctIndex: 1,
        explanation: 'Episodic memory captures past experiences, user preferences, and learned trajectories across sessions (e.g., via Vertex AI Memory Bank or Mem0).',
      },
      {
        id: 'q2',
        question: 'Why does "Context Rot" happen even on 1M-token models?',
        options: [
          'Models forget their training data after 10 minutes.',
          'Accumulating noisy raw tool outputs dilutes attention, increases latency/cost, and causes instructions to be missed.',
          'JSON cannot exceed 4,096 characters.',
          'Context windows shrink automatically after each API call.',
        ],
        correctIndex: 1,
        explanation: 'Even long-context models lose focus when cluttered with thousands of lines of irrelevant logs; context compaction and subagent isolation keep signal-to-noise high.',
      },
      {
        id: 'q3',
        question: 'What is the main advantage of the CodeAct pattern over pure JSON function calling?',
        options: [
          'It requires no sandbox.',
          'The agent can compose loops, conditionals, and data transformations in a single executable script instead of many sequential tool calls.',
          'It eliminates the need for an LLM.',
          'It only works in JavaScript.',
        ],
        correctIndex: 1,
        explanation: 'CodeAct lets agents express complex control flow and filter large outputs directly inside a sandboxed interpreter in one turn.',
      },
    ],
  },
  {
    id: 'ch3',
    chapterNum: 3,
    topic: 'Tools, Function Calling, MCP & CLIs',
    badge: 'Toolsmith',
    questions: [
      {
        id: 'q1',
        question: 'What core problem does the Model Context Protocol (MCP) solve?',
        options: [
          'Training larger foundation models faster.',
          'Replacing M × N bespoke agent-to-tool integrations with an open JSON-RPC 2.0 standard for discovering and invoking Tools, Resources, and Prompts.',
          'Compressing GPU VRAM during inference.',
          'Replacing HTTPS with WebSockets.',
        ],
        correctIndex: 1,
        explanation: 'MCP standardizes how any host/agent discovers and invokes tools, reads URI-addressed resources, and loads prompt templates across any MCP server.',
      },
      {
        id: 'q2',
        question: 'What is the best practice when a tool encounters invalid parameters or a transient API error?',
        options: [
          'Crash the entire agent process immediately.',
          'Return a clear, actionable error message as the tool observation so the LLM can self-correct.',
          'Silently return an empty string.',
          'Expose raw stack traces and database passwords to the user.',
        ],
        correctIndex: 1,
        explanation: 'Returning structured, actionable error descriptions lets the model fix its arguments or try a fallback strategy on the next loop iteration.',
      },
      {
        id: 'q3',
        question: 'Why should you avoid exposing 200 fine-grained REST endpoints directly as 200 MCP tools?',
        options: [
          'MCP only supports 5 tools maximum.',
          'Huge tool lists bloat the prompt context, increase cost, and degrade the model\'s tool-selection accuracy.',
          'LLMs cannot read JSON schemas.',
          'REST endpoints cannot be called from Python.',
        ],
        correctIndex: 1,
        explanation: 'Coarse-grained, workflow-aligned tools keep schema token overhead low and dramatically improve tool-calling accuracy.',
      },
    ],
  },
  {
    id: 'ch4',
    chapterNum: 4,
    topic: 'Models, Tokens & Inference',
    badge: 'Inference Master',
    questions: [
      {
        id: 'q1',
        question: 'Why does putting dynamic timestamps or changing user data at the VERY TOP of your system prompt hurt agent performance and cost?',
        options: [
          'Models cannot parse dates.',
          'It invalidates the KV Prefix Cache on every single turn, preventing 75–90% prompt caching discounts and slowing TTFT.',
          'It doubles the model parameter count.',
          'It disables JSON schema validation.',
        ],
        correctIndex: 1,
        explanation: 'Prefix/Prompt caching requires an exact token-for-token match from token 0. Always keep static instructions and tool definitions first, and append dynamic state at the end.',
      },
      {
        id: 'q2',
        question: 'Your agent feels slow before the first word appears, even though output speed is fine. Which metric is the problem and what usually causes it?',
        options: [
          'Tokens per second (TPS), caused by a slow network.',
          'Time to first token (TTFT), usually caused by a very long prompt that must be read (prefilled) before generation starts.',
          'Temperature being set too low.',
          'The model having too few parameters.',
        ],
        correctIndex: 1,
        explanation: 'TTFT is dominated by prefill — processing every input token. Long histories and tool outputs inflate it; prompt caching and trimming context fix it.',
      },
      {
        id: 'q3',
        question: 'Which inference optimization lets vLLM and SGLang dramatically speed up multi-turn agent loops?',
        options: [
          'Disabling batching',
          'PagedAttention & Automatic Prefix Caching (RadixAttention)',
          'Converting JSON to XML',
          'Running inference on CPU only',
        ],
        correctIndex: 1,
        explanation: 'Prefix caching reuses already-computed KV cache blocks for shared system prompts and prior conversation turns across steps.',
      },
    ],
  },
  {
    id: 'ch14',
    chapterNum: 5,
    topic: 'Open-Weight Models & Routers',
    badge: 'Model Strategist',
    questions: [
      {
        id: 'q1',
        question: 'Why does a 671B Mixture-of-Experts (MoE) model with 37B active parameters still require large multi-GPU VRAM to self-host?',
        options: [
          'Because all 671B total expert weights must reside in GPU memory even though only 37B parameters are computed per token.',
          'Because MoE models cannot be quantized.',
          'Because MoE models run on CPUs only.',
          'Because MoE models do not use attention.',
        ],
        correctIndex: 0,
        explanation: 'MoE dramatically reduces compute FLOPs and decode latency per token, but you must still fit all total expert weights plus KV cache in VRAM.',
      },
      {
        id: 'q2',
        question: 'How does a Speculative Cascade Model Router guarantee high quality while cutting LLM costs?',
        options: [
          'It randomly picks a cheap model 50% of the time.',
          'It runs a fast/cheap model first, checks the output with a fast verifier (schema, unit test, confidence), and escalates to a frontier model only if verification fails.',
          'It disables tool calling.',
          'It truncates the user prompt to 10 words.',
        ],
        correctIndex: 1,
        explanation: 'Cascade routing captures cheap-model speed and savings on easy cases while preserving frontier accuracy on hard edge cases.',
      },
      {
        id: 'q3',
        question: 'What is the #1 rule for choosing between two candidate models for your agent?',
        options: [
          'Pick whichever model has the highest parameter count.',
          'Benchmark both models on YOUR own Golden Evaluation Dataset measuring accuracy, pass^k, P95 latency, and $/task.',
          'Always pick the newest release without testing.',
          'Only use models trained in 2023.',
        ],
        correctIndex: 1,
        explanation: 'Public leaderboards rarely match your domain tool schemas and edge cases — your own golden eval suite is the ultimate ground truth.',
      },
    ],
  },
  {
    id: 'ch15',
    chapterNum: 6,
    topic: 'Training, Post-Training & MLOps',
    badge: 'MLOps & Post-Training Engineer',
    questions: [
      {
        id: 'q1',
        question: 'What is the biggest operational advantage of serving LoRA adapters on vLLM for a multi-tenant AI product?',
        options: [
          'You can serve dozens of tenant-customized adapters on top of a single shared base model in GPU memory with minimal extra VRAM.',
          'LoRA eliminates the need for GPUs.',
          'LoRA doubles the context window automatically.',
          'LoRA replaces the need for evaluation.',
        ],
        correctIndex: 0,
        explanation: 'Multi-LoRA serving dynamically swaps tiny low-rank adapter matrices per request while sharing the massive base model weights in VRAM.',
      },
      {
        id: 'q2',
        question: 'In Agentic MLOps, why is autoscaling self-hosted LLM GPU pods based on CPU utilization an anti-pattern?',
        options: [
          'LLM inference bottlenecks on GPU KV-cache memory saturation and pending request queue depth, not host CPU%.',
          'GPUs do not exist on Kubernetes.',
          'CPU% is always 100% during idle.',
          'Autoscaling is disabled for Python.',
        ],
        correctIndex: 0,
        explanation: 'Scale vLLM/SGLang pods using inference-native metrics like `vllm:num_requests_waiting` and `vllm:gpu_cache_usage_perc`.',
      },
      {
        id: 'q3',
        question: 'How does Knowledge Distillation help scale an expensive Frontier-model agent?',
        options: [
          'By collecting verified-correct trajectories from the Frontier Teacher and fine-tuning a much smaller, faster Student model (e.g., 7B–14B) for the narrow production workload.',
          'By deleting all prompts.',
          'By lowering GPU clock speed.',
          'By converting JSON into CSV.',
        ],
        correctIndex: 0,
        explanation: 'Distillation transfers frontier task capability into small models that run 5–15× cheaper and faster in production.',
      },
    ],
  },
  {
    id: 'ch5',
    chapterNum: 7,
    topic: 'Agent Frameworks & Libraries',
    badge: 'Polyglot Builder',
    questions: [
      {
        id: 'q1',
        question: 'Which framework excels when you want explicit cyclic state graphs, time-travel debugging, and fine-grained checkpoint interrupts?',
        options: ['LangGraph', 'Simple Regex', 'SQLite', 'Tailwind CSS'],
        correctIndex: 0,
        explanation: 'LangGraph models agents as explicit stateful graphs with built-in persistence, time-travel replay, and human-in-the-loop interrupts.',
      },
      {
        id: 'q2',
        question: 'What distinguishes DSPy from traditional agent frameworks?',
        options: [
          'It only runs in the browser.',
          'It treats prompts and weights as optimizable modules compiled automatically against an evaluation metric.',
          'It replaces Python with Rust.',
          'It disables tool calling.',
        ],
        correctIndex: 1,
        explanation: 'DSPy separates program signatures from prompt strings and uses optimizers (MIPRO, BootstrapFewShot) to tune prompts automatically.',
      },
      {
        id: 'q3',
        question: 'Which framework offers native SequentialAgent, ParallelAgent, LoopAgent, MCP, A2A, and direct deployment to Vertex AI Agent Engine?',
        options: ['Google ADK (Agent Development Kit)', 'jQuery', 'Flask', 'Pandas'],
        correctIndex: 0,
        explanation: 'Google ADK provides composable workflow + LLM agents with native MCP and A2A support across Python, Java, and Go.',
      },
    ],
  },
  {
    id: 'ch6',
    chapterNum: 8,
    topic: 'Multi-Agent Systems & Orchestration',
    badge: 'Swarm Commander',
    questions: [
      {
        id: 'q1',
        question: 'Which multi-agent topology minimizes wall-clock latency when running 3 independent analyses (Security, Performance, Tests) on the same PR diff?',
        options: ['Sequential Pipeline', 'Parallel Fan-Out / Gather', 'Single-threaded Reflex Loop', 'Manual Copy-Paste'],
        correctIndex: 1,
        explanation: 'Parallel Fan-Out executes independent specialist agents concurrently and merges results in an aggregator, running at the speed of the slowest branch.',
      },
      {
        id: 'q2',
        question: 'What is the primary risk of a Generator-Critic (Debate) or Swarm Handoff topology without guardrails?',
        options: [
          'It runs too fast.',
          'Infinite critique loops or agent ping-ponging that exhaust tokens and budget.',
          'It disables JSON formatting.',
          'It cannot use tools.',
        ],
        correctIndex: 1,
        explanation: 'Cyclic topologies must always enforce explicit max_iterations, max_handoffs, and token budget circuit breakers.',
      },
      {
        id: 'q3',
        question: 'Why does Context Isolation in a multi-agent system often improve accuracy over one giant agent?',
        options: [
          'Smaller contexts prevent noisy raw tool logs from distracting the coordinator and keep each specialist focused on its role and narrow toolset.',
          'Multi-agent systems use zero tokens.',
          'LLMs refuse to call more than 2 functions.',
          'It eliminates the need for evaluation.',
        ],
        correctIndex: 0,
        explanation: 'Isolating noisy sub-tasks inside specialist subagents keeps the main coordinator context clean and high-signal.',
      },
    ],
  },
  {
    id: 'ch7',
    chapterNum: 9,
    topic: 'Agent-to-Agent (A2A) Communication',
    badge: 'Protocol Diplomat',
    questions: [
      {
        id: 'q1',
        question: 'How do MCP and A2A complement each other in a modern agentic stack?',
        options: [
          'They do the exact same thing and cannot be used together.',
          'MCP connects an agent to its tools, APIs, and data sources; A2A enables peer agents across frameworks/organizations to discover and collaborate on tasks.',
          'MCP is only for Python; A2A is only for CSS.',
          'A2A replaces HTTPS.',
        ],
        correctIndex: 1,
        explanation: 'MCP is vertical (Agent ↔ Tools/Resources), while A2A is horizontal (Agent ↔ Remote Agent). Together they form the complete open interoperability stack.',
      },
      {
        id: 'q2',
        question: 'What is the purpose of `/.well-known/agent-card.json` in the A2A Protocol?',
        options: [
          'It stores the agent\'s private API keys.',
          'It serves the public Agent Card declaring the agent\'s endpoint, skills, streaming capabilities, and auth schemes for discovery.',
          'It trains the LLM weights.',
          'It replaces DNS.',
        ],
        correctIndex: 1,
        explanation: 'The Agent Card enables dynamic capability discovery so client agents know what a remote agent can do and how to authenticate.',
      },
      {
        id: 'q3',
        question: 'Which A2A Task state signals that a remote agent needs clarification or human approval before continuing?',
        options: ['completed', 'input-required', 'canceled', 'compiled'],
        correctIndex: 1,
        explanation: 'The `input-required` state supports multi-turn agent-to-agent negotiations and human-in-the-loop approvals on the same taskId.',
      },
    ],
  },
  {
    id: 'ch8',
    chapterNum: 10,
    topic: 'Building AI Agents on GCP',
    badge: 'GCP Agent Specialist',
    questions: [
      {
        id: 'q1',
        question: 'Which managed GCP service runs ADK/LangGraph agents with built-in Session persistence, Memory Bank, auto-scaling, and OpenTelemetry tracing?',
        options: ['Cloud DNS', 'Vertex AI Agent Engine', 'Cloud CDN', 'Cloud Build'],
        correctIndex: 1,
        explanation: 'Vertex AI Agent Engine is Google Cloud\'s purpose-built managed runtime for deploying and scaling production AI agents.',
      },
      {
        id: 'q2',
        question: 'Which GCP service screens incoming prompts and outgoing LLM responses for prompt injection, jailbreaks, and PII leakage at the edge?',
        options: ['Model Armor', 'Cloud Scheduler', 'Artifact Registry', 'Cloud Spanner'],
        correctIndex: 0,
        explanation: 'Model Armor provides configurable safety, prompt-injection, and Sensitive Data Protection (SDP) screening for LLM and agent traffic.',
      },
      {
        id: 'q3',
        question: 'Why should you use parameterized BigQuery queries and a dedicated `roles/bigquery.dataViewer` Service Account for an analytics agent?',
        options: [
          'To prevent SQL injection and ensure the agent cannot accidentally drop or mutate production tables.',
          'Because BigQuery does not support SELECT statements otherwise.',
          'To disable Cloud Trace.',
          'To bypass IAM authentication.',
        ],
        correctIndex: 0,
        explanation: 'Parameterized queries block SQL injection while least-privilege IAM guarantees read-only blast-radius containment even if the LLM hallucinates.',
      },
    ],
  },
  {
    id: 'ch9',
    chapterNum: 11,
    topic: 'Evaluation, Observability & Security',
    badge: 'Safety Guardian',
    questions: [
      {
        id: 'q1',
        question: 'What is Indirect Prompt Injection?',
        options: [
          'A syntax error in Python.',
          'Malicious instructions hidden inside untrusted external data (like a webpage, email, or PDF) that hijack the agent\'s next tool calls.',
          'When a user types a very long prompt.',
          'A GPU memory leak.',
        ],
        correctIndex: 1,
        explanation: 'Because LLMs process system instructions and retrieved untrusted data in the same token stream, malicious text inside fetched content can trick unguarded agents into executing unintended tools.',
      },
      {
        id: 'q2',
        question: 'Why should you evaluate BOTH the final answer and the tool-call trajectory?',
        options: [
          'An agent might get lucky with a right-looking final answer while hallucinating data, calling dangerous tools, or wasting 15 unnecessary steps.',
          'Trajectory evals eliminate the need for LLMs.',
          'Final answers are never important.',
          'OpenTelemetry forbids inspecting final answers.',
        ],
        correctIndex: 0,
        explanation: 'Trajectory evaluation catches silent reliability bugs, policy violations, and runaway token inefficiencies that final-text checks miss.',
      },
      {
        id: 'q3',
        question: 'What is the single best defense before an agent executes an irreversible high-impact action (like deleting data or wiring funds)?',
        options: [
          'Increasing the LLM temperature to 1.5.',
          'Enforcing a Human-in-the-Loop (HITL) approval gate combined with least-privilege tool policies.',
          'Asking the LLM politely in the system prompt not to make mistakes.',
          'Disabling logging.',
        ],
        correctIndex: 1,
        explanation: 'Deterministic code-level policy enforcement and HITL approval gates guarantee safety even when an LLM is tricked or hallucinates.',
      },
    ],
  },
  {
    id: 'ch10',
    chapterNum: 12,
    topic: 'Testing AI Agents & Pass^k',
    badge: 'Verification Engineer',
    questions: [
      {
        id: 'q1',
        question: 'What is the key difference between pass@5 and pass^5 when testing an AI agent?',
        options: [
          'pass@5 measures if the agent succeeds at least once in 5 tries; pass^5 measures if the agent succeeds on ALL 5 consecutive tries.',
          'pass@5 is only for Python; pass^5 is only for TypeScript.',
          'pass^5 is always higher than pass@5.',
          'They are identical metrics.',
        ],
        correctIndex: 0,
        explanation: 'Enterprise workflows need high pass^k (reliability every time), whereas exploratory coding benchmarks often report pass@k (at least one valid solution).',
      },
      {
        id: 'q2',
        question: 'Why are Record-and-Replay (VCR) tests placed near the base of the Agent Testing Pyramid?',
        options: [
          'They test live model creativity on every commit.',
          'They replay recorded LLM/tool HTTP cassettes deterministically in milliseconds for $0, catching orchestration and parser regressions without flaky CI.',
          'They replace the need for production observability.',
          'They bypass JSON schema validation.',
        ],
        correctIndex: 1,
        explanation: 'VCR cassettes make agent orchestration tests fast, free, and 100% deterministic in CI, reserving expensive live LLM evals for PR gates and pre-release suites.',
      },
      {
        id: 'q3',
        question: 'Why is Pairwise A/B Grading often preferred over raw 1–10 scoring when using an LLM-as-a-Judge?',
        options: [
          'Judge models are much more consistent when comparing two candidates side-by-side against a rubric than assigning arbitrary absolute numbers.',
          'LLMs cannot output numbers between 1 and 10.',
          'Pairwise grading uses zero tokens.',
          'It removes the need for a golden dataset.',
        ],
        correctIndex: 0,
        explanation: 'Relative pairwise comparisons drastically reduce calibration drift and variance in LLM-as-a-Judge pipelines.',
      },
    ],
  },
  {
    id: 'ch11',
    chapterNum: 13,
    topic: 'Scaling AI Agents & Failure Modes',
    badge: 'Scale Architect',
    questions: [
      {
        id: 'q1',
        question: 'Why does a 10-step agent fleet hit LLM provider rate limits much faster than a standard chat app?',
        options: [
          'Each user request triggers 10 sequential LLM calls and re-sends growing history every step, multiplying both RPM and TPM quadratically.',
          'Agents cannot use HTTPS.',
          'Providers block all multi-step prompts.',
          'Agents always use 10 GPUs per token.',
        ],
        correctIndex: 0,
        explanation: 'Multi-step loops amplify requests per user by N× and total input tokens by O(N²), quickly saturating single-region RPM/TPM quotas.',
      },
      {
        id: 'q2',
        question: 'What is the safest way to enforce multi-tenant data isolation in a scaled RAG agent?',
        options: [
          'Ask the LLM politely in the system prompt not to mention other tenants.',
          'Enforce mandatory tenant_id filters deterministically in your database/vector query code and namespace all cache keys by tenant_id.',
          'Put all tenants in one shared Redis key.',
          'Disable authentication.',
        ],
        correctIndex: 1,
        explanation: 'Security boundaries must ALWAYS be enforced deterministically in application/database code, never delegated to LLM instructions.',
      },
      {
        id: 'q3',
        question: 'Which pattern stops HTTP 429 retry storms from cascading into a full outage during traffic spikes?',
        options: [
          'Immediate tight while-loop retries with zero delay.',
          'Exponential backoff with full jitter + multi-region quota pooling + async queue backpressure.',
          'Increasing temperature to 2.0.',
          'Disabling error handling.',
        ],
        correctIndex: 1,
        explanation: 'Jitter spreads out retries, multi-region pools multiply quota headroom, and async queues absorb bursts cleanly.',
      },
    ],
  },
  {
    id: 'ch12',
    chapterNum: 14,
    topic: 'Running & Deploying to Production',
    badge: 'Grandmaster Agent Architect',
    questions: [
      {
        id: 'q1',
        question: 'What is the safest rollout progression when deploying a major prompt or model upgrade to production?',
        options: [
          'Edit the prompt directly in production and hope for the best.',
          'CI Golden Eval Gate → Shadow Mode (0% user impact) → Canary Rollout (5–10%) with telemetry alerts → 100% rollout.',
          'Disable all tests to deploy faster.',
          'Restart the database on every prompt edit.',
        ],
        correctIndex: 1,
        explanation: 'Combining CI eval gates, shadow traffic comparison, and canary traffic shifting catches cost, latency, and quality regressions before full rollout.',
      },
      {
        id: 'q2',
        question: 'Why do production agent containers need graceful SIGTERM shutdown handling and per-step checkpointing?',
        options: [
          'Because agent loops run for seconds to minutes — abrupt container termination drops in-flight multi-step work or leaves partial side effects.',
          'Because Docker cannot stop Python processes otherwise.',
          'To increase LLM token prices.',
          'To disable SSE streaming.',
        ],
        correctIndex: 0,
        explanation: 'Graceful draining + durable checkpointing lets autoscalers safely cycle pods without losing long-running agent sessions.',
      },
      {
        id: 'q3',
        question: 'Why should mutating agent tools (like creating invoices or sending refunds) accept an `idempotency_key`?',
        options: [
          'So that automatic retries or durable-execution crash recoveries never execute duplicate side effects.',
          'To encrypt the LLM weights.',
          'To increase token usage.',
          'Because JSON requires it.',
        ],
        correctIndex: 0,
        explanation: 'Durable agent runtimes retry failed network steps; idempotency keys guarantee at-most-once execution of real-world mutations.',
      },
    ],
  },
  {
    id: 'ch16',
    chapterNum: 15,
    topic: 'Must-Read Seminal Papers',
    badge: 'Research Scholar',
    questions: [
      {
        id: 'q1',
        question: 'In "Attention Is All You Need", why does causal self-attention scale quadratically O(n²) with sequence length n?',
        options: [
          'Every token\'s Query vector computes dot-product attention scores against all prior Key vectors in the sequence.',
          'Transformers must retrain weights on every prompt.',
          'Tokenizers double the string length each turn.',
          'GPUs can only multiply 2×2 matrices.',
        ],
        correctIndex: 0,
        explanation: 'Computing Q · Kᵀ across n tokens creates an n × n attention matrix — which is why KV caching, FlashAttention, and context compaction are vital for long-running agents.',
      },
      {
        id: 'q2',
        question: 'What key concept did the SWE-agent paper introduce for building better coding agents?',
        options: [
          'Removing all tests.',
          'Agent-Computer Interfaces (ACI) — designing ergonomic, LLM-friendly file editors, linters, and search commands instead of raw human terminal primitives.',
          'Replacing Python with Assembly.',
          'Disabling tool observations.',
        ],
        correctIndex: 1,
        explanation: 'Just as humans need great UIs (HCI), LLM agents perform dramatically better when given crisp, informative, guardrail-backed tool interfaces (ACI).',
      },
      {
        id: 'q3',
        question: 'What was the core breakthrough of PagedAttention (vLLM) for serving LLMs at scale?',
        options: [
          'Eliminating KV cache fragmentation by storing KV blocks in non-contiguous OS-style virtual memory pages, unlocking massive batch sizes and prefix sharing.',
          'Training models without GPUs.',
          'Replacing attention with regex.',
          'Shrinking prompts to 10 tokens.',
        ],
        correctIndex: 0,
        explanation: 'PagedAttention eliminated ~60–80% wasted KV cache memory fragmentation, multiplying serving throughput and enabling shared-prefix caching.',
      },
    ],
  },
  {
    id: 'ch13',
    chapterNum: 16,
    topic: 'Staff-Level Interview & System Design',
    badge: 'Staff AI Architect',
    questions: [
      {
        id: 'q1',
        question: 'In a Staff-level interview asking you to connect an agent to 400 internal microservices, what is the strongest architectural answer?',
        options: [
          'Paste all 400 OpenAPI specs into the system prompt.',
          'Design coarse-grained intent-level MCP tools combined with Dynamic Tool Retrieval (Tool RAG) so only the top 5–8 relevant schemas enter context per task.',
          'Fine-tune a new foundation model every week whenever an API changes.',
          'Tell the user to run curl commands manually.',
        ],
        correctIndex: 1,
        explanation: 'Coarse-grained tools + dynamic tool retrieval keeps prompt token overhead low, preserves KV caching, and maximizes tool-calling precision.',
      },
      {
        id: 'q2',
        question: 'How should an enterprise MCP/A2A gateway prevent the "Confused Deputy" privilege escalation attack?',
        options: [
          'Use a single shared admin service account for all users.',
          'Propagate user identity via OAuth 2.1 On-Behalf-Of (OBO) tokens scoped to the intersection of User Permissions and Agent Permissions.',
          'Ask the LLM in the system prompt to verify the user\'s role.',
          'Disable authentication inside the VPC.',
        ],
        correctIndex: 1,
        explanation: 'OAuth OBO token delegation guarantees that an agent can never access or mutate resources that the invoking user is not authorized to touch.',
      },
      {
        id: 'q3',
        question: 'When designing an autonomous coding agent platform, why should GitHub PR creation tokens live OUTSIDE the code-execution sandbox?',
        options: [
          'Because GitHub APIs do not work inside Linux containers.',
          'To prevent untrusted repository code or malicious prompt injections inside the sandbox from reading and exfiltrating privileged GitHub credentials.',
          'To save 5MB of RAM.',
          'Because Firecracker VMs cannot use HTTPS.',
        ],
        correctIndex: 1,
        explanation: 'Separating untrusted code execution from privileged credentialed actions minimizes blast radius even if the sandbox is fully compromised.',
      },
    ],
  },
];


const EXTRA_TOPICS: QuizTopic[] = [
  {
    id: 'llm',
    chapterNum: 1,
    topic: 'How LLMs Work',
    badge: 'AI Foundations',
    questions: [
      {
        id: 'q1',
        question: "Why is an LLM often described as 'autocomplete at massive scale'?",
        options: [
          'It searches the internet for every answer.',
          'It is trained to predict the next token from the previous ones, and generates text by repeating that prediction.',
          'It stores every web page in a database and copies the closest match.',
          'It follows hand-written grammar rules.',
        ],
        correctIndex: 1,
        explanation: 'LLMs are next-token predictors. Long answers, code and tool calls are produced one predicted token at a time.',
      },
      {
        id: 'q2',
        question: 'What happens when you raise temperature from 0 to 1.5?',
        options: [
          'The model becomes faster.',
          'The probability distribution flattens, so less likely tokens are picked more often — more varied and riskier output.',
          'The context window doubles.',
          'The model uses a larger number of parameters.',
        ],
        correctIndex: 1,
        explanation: 'Temperature 0 always picks the top token; higher values spread probability to unlikely tokens. Agents usually run at low temperature.',
      },
      {
        id: 'q3',
        question: 'Why do LLMs hallucinate?',
        options: [
          'Because their GPUs overheat.',
          'They generate the most plausible-sounding continuation, not verified facts, and have no built-in way to check a source.',
          'Because temperature is always set to zero.',
          'Because tokenizers delete facts.',
        ],
        correctIndex: 1,
        explanation: 'Plausibility is not truth. Grounding (RAG), tools and verification steps are how agents reduce hallucination.',
      },
    ],
  },
  {
    id: 'prompting',
    chapterNum: 2,
    topic: 'Prompting & LLM APIs',
    badge: 'Prompt Engineer',
    questions: [
      {
        id: 'q1',
        question: 'What is the system message for in an LLM API call?',
        options: [
          'Storing the API key.',
          'Setting persistent instructions — role, rules, tone and output format — for the whole conversation.',
          'Choosing which GPU runs the request.',
          'Logging errors.',
        ],
        correctIndex: 1,
        explanation: 'The system instruction frames every turn. Keep it stable so it can also be cached.',
      },
      {
        id: 'q2',
        question: "Why use structured output (a JSON schema) instead of just asking 'please answer in JSON'?",
        options: [
          'It makes the model more creative.',
          'The API constrains generation to valid JSON matching your schema, so your code can parse it reliably.',
          'It is the only way to use temperature.',
          'It removes the need for a prompt.',
        ],
        correctIndex: 1,
        explanation: 'Constrained decoding guarantees parseable output — the same mechanism that makes tool calling reliable.',
      },
      {
        id: 'q3',
        question: 'Which milestone gave LLM APIs reliable, structured tool use — the key ingredient for agents?',
        options: ['The Transformer paper (2017)', 'Native function calling in LLM APIs (2023)', 'Byte-pair tokenizers', 'Larger GPUs'],
        correctIndex: 1,
        explanation: 'Function calling (mid-2023) let models return schema-validated tool requests, turning agent demos into products.',
      },
    ],
  },
  {
    id: 'companies',
    chapterNum: 17,
    topic: 'Companies & Case Studies',
    badge: 'Industry Analyst',
    questions: [
      {
        id: 'q1',
        question: "Anthropic's multi-agent research system beat a single agent on research tasks. What was the main trade-off?",
        options: [
          'It could not use tools.',
          'Much higher token usage (about 15× a normal chat), so it only pays off for valuable, parallelisable tasks.',
          'It required fine-tuning a new model.',
          'It only worked offline.',
        ],
        correctIndex: 1,
        explanation: 'Parallel sub-agents improve breadth and quality but multiply token spend.',
      },
      {
        id: 'q2',
        question: "What is the core argument of Cognition's 'Don't Build Multi-Agents'?",
        options: [
          'Agents should never use tools.',
          'Sub-agents without full shared context make conflicting decisions; prefer single-threaded agents that share full context.',
          'Multi-agent systems are always cheaper.',
          'Agents should run on CPUs.',
        ],
        correctIndex: 1,
        explanation: 'Actions carry implicit decisions; fragmenting context fragments those decisions.',
      },
      {
        id: 'q3',
        question: 'Several public chatbot failures (a refund promise, a $1 car "deal", a deleted database) share which root cause?',
        options: [
          'The models were too small.',
          'Missing guardrails and permissions: the model could make commitments or take actions that code and humans never checked.',
          'Temperature was set to zero.',
          'They used RAG.',
        ],
        correctIndex: 1,
        explanation: 'Instructions are not permissions. Enforce policies in code, use least privilege and require approval for high-impact actions.',
      },
    ],
  },
];

const TOPIC_TO_CHAPTER: Record<string, ChapterId> = {
  llm: 'ch0-llm-basics',
  prompting: 'ch0-prompting-apis',
  ch1: 'ch1-foundations',
  ch2: 'ch2-reasoning-memory',
  ch3: 'ch3-tools-mcp-cli',
  ch4: 'ch4-models-tokens-training',
  ch14: 'ch14-open-models-routers',
  ch15: 'ch15-training-mlops',
  ch5: 'ch5-frameworks',
  ch6: 'ch6-multi-agent',
  ch7: 'ch7-a2a-protocols',
  ch8: 'ch8-gcp-agents',
  ch9: 'ch9-evals-safety',
  ch10: 'ch10-testing-agents',
  ch11: 'ch11-scaling-agents',
  ch12: 'ch10-production-blueprints',
  companies: 'ch-companies-case-studies',
  ch16: 'ch16-must-read-papers',
  ch13: 'ch13-interview-prep',
};

export const QUIZ_TOPICS: QuizTopic[] = [...RAW_TOPICS, ...EXTRA_TOPICS]
  .map((t) => ({
    ...t,
    chapterNum: CHAPTERS.find((c) => c.id === TOPIC_TO_CHAPTER[t.id])?.number ?? t.chapterNum,
  }))
  .sort((a, b) => a.chapterNum - b.chapterNum);
