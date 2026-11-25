export type ReadingType = 'Blog' | 'Docs' | 'Paper' | 'Video' | 'Interactive' | 'Book' | 'Guide';

export interface ReadingLink {
  title: string;
  source: string;
  url: string;
  type: ReadingType;
}

export interface CaseStudy {
  org: string;
  title: string;
  summary: string;
  lesson: string;
  url?: string;
}

export interface ChapterExtra {
  tldr: string;
  takeaways: string[];
  caseStudies?: CaseStudy[];
  reading?: ReadingLink[];
}

const ANTHROPIC_EFFECTIVE: ReadingLink = {
  title: 'Building Effective Agents',
  source: 'Anthropic',
  url: 'https://www.anthropic.com/research/building-effective-agents',
  type: 'Blog',
};
const ANTHROPIC_MULTI: ReadingLink = {
  title: 'How we built our multi-agent research system',
  source: 'Anthropic Engineering',
  url: 'https://www.anthropic.com/engineering/built-multi-agent-research-system',
  type: 'Blog',
};
const COGNITION_MULTI: ReadingLink = {
  title: "Don't Build Multi-Agents",
  source: 'Cognition',
  url: 'https://cognition.ai/blog/dont-build-multi-agents',
  type: 'Blog',
};
const LETHAL_TRIFECTA: ReadingLink = {
  title: 'The lethal trifecta for AI agents',
  source: 'Simon Willison',
  url: 'https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/',
  type: 'Blog',
};

export const CHAPTER_EXTRAS: Record<string, ChapterExtra> = {
  'ch0-llm-basics': {
    tldr: 'An LLM is a giant prediction machine. It has read a huge chunk of the internet and learned one skill extremely well: guessing the next word-piece (token). Answering questions, writing code and even calling tools all emerge from repeating that guess hundreds of times. Think of it as the most well-read autocomplete ever built.',
    takeaways: [
      'AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Generative AI ⊃ LLMs.',
      'Training means adjusting billions of numbers (weights) so predictions get less wrong, repeated over trillions of tokens.',
      'LLMs read tokens, not words — roughly 1 token ≈ ¾ of an English word. Cost, speed and limits are all measured in tokens.',
      'Embeddings turn meaning into numbers, so "similar" becomes "close together". This powers semantic search and RAG.',
      'Plain LLMs hallucinate, forget between calls and cannot act. Agents exist to fix exactly these gaps.',
    ],
    reading: [
      { title: 'Intro to Large Language Models (1-hour talk)', source: 'Andrej Karpathy', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g', type: 'Video' },
      { title: 'Deep Dive into LLMs like ChatGPT', source: 'Andrej Karpathy', url: 'https://www.youtube.com/watch?v=7xTGNNLPyMI', type: 'Video' },
      { title: 'Neural Networks (visual series)', source: '3Blue1Brown', url: 'https://www.3blue1brown.com/topics/neural-networks', type: 'Video' },
      { title: 'The Illustrated Transformer', source: 'Jay Alammar', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'Blog' },
      { title: 'Transformer Explainer (run GPT-2 in your browser)', source: 'Georgia Tech Polo Club', url: 'https://poloclub.github.io/transformer-explainer/', type: 'Interactive' },
      { title: 'LLM Visualization (3D walkthrough)', source: 'Brendan Bycroft', url: 'https://bbycroft.net/llm', type: 'Interactive' },
      { title: 'LLM Course', source: 'Hugging Face', url: 'https://huggingface.co/learn/llm-course', type: 'Guide' },
    ],
  },

  'ch0-prompting-apis': {
    tldr: "Calling an LLM API is like sending a brilliant contractor a written brief. The clearer the brief — who they are, the background, examples and the exact format you want — the better the result. An agent is what you get when the model can send requests back to your code ('please run this tool') in a loop.",
    takeaways: [
      'Every API call is a list of messages (system, user, assistant) plus settings like temperature and max tokens.',
      'The model is stateless: your app re-sends the conversation history on every call.',
      'Good prompts = role + context + task + examples + output format + constraints.',
      'Use structured output (JSON schemas) whenever code consumes the answer.',
      'Agents emerged step by step: Transformer (2017) → GPT-3 (2020) → ChatGPT (2022) → function calling (2023) → coding agents and MCP (2024) → CLI agents and A2A (2025).',
    ],
    reading: [
      { title: 'Prompt design strategies', source: 'Google Gemini API docs', url: 'https://ai.google.dev/gemini-api/docs/prompting-strategies', type: 'Docs' },
      { title: 'Structured output', source: 'Google Gemini API docs', url: 'https://ai.google.dev/gemini-api/docs/structured-output', type: 'Docs' },
      { title: 'Prompt engineering overview', source: 'Anthropic docs', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview', type: 'Docs' },
      { title: 'Prompt engineering guide', source: 'OpenAI docs', url: 'https://platform.openai.com/docs/guides/prompt-engineering', type: 'Docs' },
      { title: 'Prompt Engineering', source: 'Lilian Weng', url: 'https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/', type: 'Blog' },
      { title: 'LLM Powered Autonomous Agents (the classic 2023 overview)', source: 'Lilian Weng', url: 'https://lilianweng.github.io/posts/2023-06-23-agent/', type: 'Blog' },
    ],
  },

  'ch1-foundations': {
    tldr: 'An agent is an LLM with a goal, tools, memory and a loop: think → act → look at the result → repeat until done. A chatbot answers questions; an agent gets things done.',
    takeaways: [
      'Agent = Model + Tools + Memory + Control loop.',
      'ReAct (Reason + Act) is the core loop behind almost every agent framework.',
      'If you know the steps in advance, a workflow is cheaper and more reliable than an autonomous agent.',
      'Always cap steps, tokens and cost — loops can run away.',
      'You can build a working agent in ~30 lines without any framework.',
    ],
    caseStudies: [
      {
        org: 'Anthropic',
        title: 'Lessons from dozens of teams building agents',
        summary: 'Anthropic reported that the most successful agent implementations used simple, composable patterns rather than complex frameworks. They separate "workflows" (LLMs orchestrated through predefined code paths) from "agents" (LLMs that direct their own process and tool use).',
        lesson: 'Start with the simplest solution; add agentic complexity only when it measurably improves results.',
        url: 'https://www.anthropic.com/research/building-effective-agents',
      },
    ],
    reading: [
      ANTHROPIC_EFFECTIVE,
      { title: 'A Practical Guide to Building Agents (PDF)', source: 'OpenAI', url: 'https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf', type: 'Guide' },
      { title: 'Agents whitepaper', source: 'Google', url: 'https://www.kaggle.com/whitepaper-agents', type: 'Guide' },
      { title: 'Agents', source: 'Chip Huyen', url: 'https://huyenchip.com/2025/01/07/agents.html', type: 'Blog' },
      { title: 'Agentic design patterns', source: 'Andrew Ng · The Batch', url: 'https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/', type: 'Blog' },
      { title: '12-Factor Agents', source: 'HumanLayer', url: 'https://github.com/humanlayer/12-factor-agents', type: 'Guide' },
    ],
  },

  'ch2-reasoning-memory': {
    tldr: "Reasoning is the agent thinking out loud before acting; memory is its notebook. The context window is a small whiteboard that is wiped after every call — great agents decide very carefully what goes on it. That skill is called context engineering.",
    takeaways: [
      'Chain-of-thought and reasoning models spend extra tokens to get better answers.',
      'Four kinds of memory: working (context), episodic (past events), semantic (facts/docs) and procedural (how-to rules).',
      'RAG = look things up before answering. Hybrid search + reranking beats plain vector search.',
      'More context is not always better: stuffing the window degrades quality ("context rot").',
      'Context engineering — write, select, compress, isolate — matters more than clever wording.',
    ],
    caseStudies: [
      {
        org: 'Anthropic',
        title: 'Effective context engineering for AI agents',
        summary: 'Context is a finite resource with diminishing returns. The post describes compaction (summarising old history), structured note-taking outside the context window, sub-agents that return condensed results, and "just-in-time" retrieval through tools instead of pre-loading everything.',
        lesson: 'Aim for the smallest set of high-signal tokens that gets the job done.',
        url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
      },
    ],
    reading: [
      { title: 'Effective context engineering for AI agents', source: 'Anthropic Engineering', url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', type: 'Blog' },
      { title: 'Introducing Contextual Retrieval', source: 'Anthropic', url: 'https://www.anthropic.com/news/contextual-retrieval', type: 'Blog' },
      { title: 'Why We Think (reasoning & test-time compute)', source: 'Lilian Weng', url: 'https://lilianweng.github.io/posts/2025-05-01-thinking/', type: 'Blog' },
      { title: 'Patterns for Building LLM-based Systems & Products', source: 'Eugene Yan', url: 'https://eugeneyan.com/writing/llm-patterns/', type: 'Blog' },
      { title: 'Memory Bank overview', source: 'Google Cloud docs', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/overview', type: 'Docs' },
    ],
  },

  'ch3-tools-mcp-cli': {
    tldr: "Tools are the agent's hands. The model never runs anything itself — it writes a request like get_weather(city='Tokyo'), your program runs it, and hands back the result. MCP is the USB-C port that lets any agent plug into any tool.",
    takeaways: [
      'Function calling = the model outputs structured JSON; your code executes it and returns the result.',
      'Tool names, descriptions and error messages are prompts — write them like docs for a new teammate.',
      'MCP (open-sourced by Anthropic in Nov 2024, then adopted across the industry) standardises tools, resources and prompts.',
      'A handful of well-designed, task-level tools beats hundreds of thin API wrappers.',
      'Always run agent-written code in a sandbox, never on your own machine or servers.',
    ],
    caseStudies: [
      {
        org: 'Anthropic',
        title: 'Writing effective tools for agents',
        summary: 'Tools for agents are a new kind of software: a contract between deterministic systems and a non-deterministic model. Recommendations include consolidating many small endpoints into fewer task-level tools, returning meaningful (not raw) context, clear namespacing, token-efficient responses and evaluating tools by running agents against them.',
        lesson: 'Design tools for how an agent thinks, not how your REST API is shaped.',
        url: 'https://www.anthropic.com/engineering/writing-tools-for-agents',
      },
    ],
    reading: [
      { title: 'Model Context Protocol — docs & spec', source: 'modelcontextprotocol.io', url: 'https://modelcontextprotocol.io', type: 'Docs' },
      { title: 'Introducing the Model Context Protocol', source: 'Anthropic', url: 'https://www.anthropic.com/news/model-context-protocol', type: 'Blog' },
      { title: 'Reference MCP servers', source: 'GitHub', url: 'https://github.com/modelcontextprotocol/servers', type: 'Docs' },
      { title: 'Function calling', source: 'Google Gemini API docs', url: 'https://ai.google.dev/gemini-api/docs/function-calling', type: 'Docs' },
      { title: 'Writing effective tools for agents', source: 'Anthropic Engineering', url: 'https://www.anthropic.com/engineering/writing-tools-for-agents', type: 'Blog' },
      LETHAL_TRIFECTA,
    ],
  },

  'ch4-models-tokens-training': {
    tldr: 'Every request is chopped into tokens, and you pay — in money and in time — per token. A model first reads your whole prompt at once (prefill), then writes one token at a time (decode). Caching the parts of the prompt that never change is the cheapest speed-up in AI.',
    takeaways: [
      'Cost and latency scale with tokens, and agents re-send their growing history on every step.',
      'TTFT (time to first token) is driven by prompt size; TPS (tokens per second) by output generation.',
      'Put static content (instructions, tool schemas) first so prompt caching can kick in.',
      'Quantization (16-bit → 8-bit → 4-bit) lets big models run on fewer GPUs.',
      'Default to managed APIs; self-host for privacy, very high volume or custom models.',
    ],
    caseStudies: [
      {
        org: 'UC Berkeley · vLLM',
        title: 'PagedAttention changes LLM serving',
        summary: "The vLLM team found that most GPU memory waste in LLM serving came from fragmented KV caches. Managing that memory in pages, like an operating system does, let them batch many more requests — their launch post reported up to 24× higher throughput than Hugging Face Transformers.",
        lesson: 'In LLM serving, memory management — not raw compute — is often the bottleneck.',
        url: 'https://blog.vllm.ai/2023/06/20/vllm.html',
      },
    ],
    reading: [
      { title: 'Tiktokenizer — see how text becomes tokens', source: 'tiktokenizer.vercel.app', url: 'https://tiktokenizer.vercel.app', type: 'Interactive' },
      { title: "Let's build the GPT Tokenizer", source: 'Andrej Karpathy', url: 'https://www.youtube.com/watch?v=zduSFxRajkE', type: 'Video' },
      { title: 'Context caching', source: 'Google Gemini API docs', url: 'https://ai.google.dev/gemini-api/docs/caching', type: 'Docs' },
      { title: 'Model speed, price & quality comparisons', source: 'Artificial Analysis', url: 'https://artificialanalysis.ai', type: 'Interactive' },
      { title: 'vLLM documentation', source: 'vLLM', url: 'https://docs.vllm.ai', type: 'Docs' },
    ],
  },

  'ch14-open-models-routers': {
    tldr: "There is no single 'best' model — only the cheapest model that is good enough for each step. Open-weight models are ones you can download and run yourself. A router is a traffic cop that sends easy requests to small, fast models and hard ones to big, smart ones.",
    takeaways: [
      'Open-weight is not always open-source: check the licence (Apache 2.0 / MIT vs custom terms).',
      'Mixture-of-Experts models compute only a few experts per token, but still need memory for all of them.',
      'Choose a model per role (router, planner, coder) and validate on your own eval set, not leaderboards alone.',
      'Routers and AI gateways cut cost and add failover across providers and regions.',
    ],
    caseStudies: [
      {
        org: 'LMSYS',
        title: 'RouteLLM: learning when you need the big model',
        summary: 'Researchers trained routers on human preference data to decide when a cheaper model is good enough. They reported cost reductions of over 85% on MT-Bench while keeping about 95% of GPT-4-level quality.',
        lesson: 'Most real traffic does not need your most expensive model.',
        url: 'https://lmsys.org/blog/2024-07-01-routellm/',
      },
    ],
    reading: [
      { title: 'RouteLLM paper', source: 'arXiv', url: 'https://arxiv.org/abs/2406.18665', type: 'Paper' },
      { title: 'LMArena (crowd-sourced model leaderboard)', source: 'lmarena.ai', url: 'https://lmarena.ai', type: 'Interactive' },
      { title: 'Model Garden', source: 'Google Cloud', url: 'https://cloud.google.com/model-garden', type: 'Docs' },
      { title: 'Open models hub', source: 'Hugging Face', url: 'https://huggingface.co/models', type: 'Docs' },
      { title: 'LiteLLM (AI gateway / router)', source: 'LiteLLM docs', url: 'https://docs.litellm.ai', type: 'Docs' },
    ],
  },

  'ch15-training-mlops': {
    tldr: "Pre-training a model from scratch is like raising a child to adulthood — slow and extremely expensive. Post-training is job training: you take a capable graduate and teach them your company's way of working. Most teams never train at all; they improve prompts, tools and data first.",
    takeaways: [
      'The pipeline: pre-training → supervised fine-tuning (SFT) → preference tuning (RLHF/DPO) → RL with verifiable rewards.',
      'LoRA fine-tunes a tiny add-on instead of the whole model — cheap and easy to serve.',
      'Distillation: let a big model teach a small, cheap one using its verified outputs.',
      'MLOps for agents = versioning prompts, models, tools and evals together, and turning production traces into datasets.',
      'Climb the ladder: prompts → tools & RAG → context engineering → fine-tuning.',
    ],
    caseStudies: [
      {
        org: 'DeepSeek',
        title: 'DeepSeek-R1: reasoning from reinforcement learning',
        summary: 'DeepSeek showed that large-scale RL with automatically checkable rewards (GRPO) can teach a model to reason step by step, verify and backtrack. They released the weights under the MIT licence along with smaller distilled models from 1.5B to 70B parameters.',
        lesson: 'Verifiable rewards plus distillation make strong reasoning available to everyone — including on your own hardware.',
        url: 'https://arxiv.org/abs/2501.12948',
      },
    ],
    reading: [
      { title: 'TRL — Transformer Reinforcement Learning', source: 'Hugging Face docs', url: 'https://huggingface.co/docs/trl', type: 'Docs' },
      { title: 'Fine-tuning guides', source: 'Unsloth docs', url: 'https://docs.unsloth.ai', type: 'Guide' },
      { title: 'RLHF: Reinforcement Learning from Human Feedback', source: 'Chip Huyen', url: 'https://huyenchip.com/2023/05/02/rlhf.html', type: 'Blog' },
      { title: 'Ahead of AI (LLM training deep dives)', source: 'Sebastian Raschka', url: 'https://magazine.sebastianraschka.com', type: 'Blog' },
      { title: 'Tune Gemini models', source: 'Google Cloud docs', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/models/tune-models', type: 'Docs' },
    ],
  },

  'ch5-frameworks': {
    tldr: "Frameworks are kitchen appliances: they save time, but you should know how to cook without them. Learn the raw loop first (Chapter 3), then pick a framework that fits your language, your cloud and how much control you need.",
    takeaways: [
      'Every framework wraps the same loop: model + tools + state.',
      'Google ADK: multi-agent + GCP deployment. LangGraph: explicit graphs. CrewAI: role-based teams. PydanticAI: type-safe Python. Vercel AI SDK: TypeScript UIs.',
      'Choose by language, required control, deployment target and observability.',
      'Reduce lock-in: keep tools behind MCP and prompts in your own repository.',
    ],
    reading: [
      { title: 'Agent Development Kit (ADK) docs', source: 'Google', url: 'https://google.github.io/adk-docs/', type: 'Docs' },
      { title: 'LangGraph docs', source: 'LangChain', url: 'https://langchain-ai.github.io/langgraph/', type: 'Docs' },
      { title: 'CrewAI docs', source: 'CrewAI', url: 'https://docs.crewai.com', type: 'Docs' },
      { title: 'OpenAI Agents SDK', source: 'OpenAI', url: 'https://openai.github.io/openai-agents-python/', type: 'Docs' },
      { title: 'PydanticAI', source: 'Pydantic', url: 'https://ai.pydantic.dev', type: 'Docs' },
      { title: 'AI SDK', source: 'Vercel', url: 'https://ai-sdk.dev', type: 'Docs' },
    ],
  },

  'ch6-multi-agent': {
    tldr: 'Multi-agent systems are teams: a manager splits the work, specialists do their parts (often in parallel) and someone checks the result. Teams are powerful but costly — they use many more tokens and can miscommunicate — so only form a team when a single agent truly can\'t cope.',
    takeaways: [
      'Core patterns: orchestrator-worker, sequential pipeline, parallel fan-out, hierarchy, handoffs (swarm) and debate.',
      'Good reasons to split: context isolation, parallelism, security boundaries and mixing models.',
      'Biggest risk: agents lose shared context and make conflicting decisions.',
      'Always cap iterations, handoffs and total budget.',
    ],
    caseStudies: [
      {
        org: 'Anthropic',
        title: 'A multi-agent research system',
        summary: 'A lead agent plans and spawns parallel sub-agents that search independently. On Anthropic\'s internal research evaluation the multi-agent version outperformed a single agent by about 90%, but used roughly 15× more tokens than a normal chat.',
        lesson: 'Multi-agent pays off for broad, parallel, high-value tasks — and only if you can afford the tokens.',
        url: 'https://www.anthropic.com/engineering/built-multi-agent-research-system',
      },
      {
        org: 'Cognition',
        title: "The counter-argument: Don't Build Multi-Agents",
        summary: 'Sub-agents that only see part of the context make conflicting assumptions, because every action carries implicit decisions. Cognition recommends single-threaded agents that share full context and compress history when needed.',
        lesson: 'For tightly coupled work (one codebase, one document), keep one agent in charge of the context.',
        url: 'https://cognition.ai/blog/dont-build-multi-agents',
      },
    ],
    reading: [
      ANTHROPIC_MULTI,
      COGNITION_MULTI,
      { title: 'Multi-agent systems in ADK', source: 'Google ADK docs', url: 'https://google.github.io/adk-docs/agents/multi-agents/', type: 'Docs' },
      { title: 'Multi-agent concepts', source: 'LangGraph docs', url: 'https://langchain-ai.github.io/langgraph/concepts/multi_agent/', type: 'Docs' },
      { title: 'Handoffs', source: 'OpenAI Agents SDK docs', url: 'https://openai.github.io/openai-agents-python/handoffs/', type: 'Docs' },
    ],
  },

  'ch7-a2a-protocols': {
    tldr: 'MCP lets an agent use tools; A2A lets agents talk to other agents — even ones built by other companies on other frameworks. Each agent publishes a "business card" (Agent Card) saying what it can do, and they collaborate through tracked tasks.',
    takeaways: [
      'The Agent Card (served at /.well-known/agent-card.json) lets other agents discover skills, endpoint and auth.',
      'Work is a Task that moves through states: submitted → working → input-required → completed / failed.',
      'Progress streams over Server-Sent Events; long jobs can use push notifications.',
      'A2A was launched by Google in April 2025 and donated to the Linux Foundation in June 2025.',
      'MCP is vertical (agent ↔ tools); A2A is horizontal (agent ↔ agent). Most real systems use both.',
    ],
    reading: [
      { title: 'A2A Protocol — docs & spec', source: 'a2a-protocol.org', url: 'https://a2a-protocol.org', type: 'Docs' },
      { title: 'A2A on GitHub (spec, SDKs, samples)', source: 'GitHub', url: 'https://github.com/a2aproject/A2A', type: 'Docs' },
      { title: 'Announcing the Agent2Agent Protocol', source: 'Google Developers Blog', url: 'https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/', type: 'Blog' },
      { title: 'A2A with ADK', source: 'Google ADK docs', url: 'https://google.github.io/adk-docs/a2a/', type: 'Docs' },
    ],
  },

  'ch8-gcp-agents': {
    tldr: 'Google Cloud gives you every building block: Gemini models on Vertex AI, ADK to write the agent, Agent Engine to host it without managing servers, Cloud Run or GKE for custom setups, BigQuery and AlloyDB for data, and Model Armor to block attacks.',
    takeaways: [
      'Fastest path to production: ADK agent → Vertex AI Agent Engine (managed sessions, memory, tracing).',
      'Cloud Run suits custom APIs and MCP servers; GKE suits self-hosted open models and sandboxes.',
      'Give each agent its own least-privilege service account; keep secrets in Secret Manager.',
      'Screen inputs and outputs with Model Armor; trace everything with Cloud Trace.',
    ],
    caseStudies: [
      {
        org: 'Google Cloud',
        title: 'Hundreds of real customer gen AI deployments',
        summary: 'Google maintains a large, regularly updated catalogue of customer generative AI and agent use cases across retail, finance, healthcare, manufacturing and the public sector.',
        lesson: 'Before designing from scratch, look for an existing pattern in your industry.',
        url: 'https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders',
      },
    ],
    reading: [
      { title: 'Agent Development Kit docs', source: 'Google', url: 'https://google.github.io/adk-docs/', type: 'Docs' },
      { title: 'Vertex AI Agent Engine overview', source: 'Google Cloud docs', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview', type: 'Docs' },
      { title: 'Agent Starter Pack (production templates)', source: 'GitHub · Google Cloud', url: 'https://github.com/GoogleCloudPlatform/agent-starter-pack', type: 'Guide' },
      { title: 'Model Armor overview', source: 'Google Cloud docs', url: 'https://cloud.google.com/security-command-center/docs/model-armor-overview', type: 'Docs' },
      { title: 'Generative AI on Vertex AI', source: 'Google Cloud docs', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs', type: 'Docs' },
    ],
  },

  'ch9-evals-safety': {
    tldr: "You can't improve what you can't measure. Evals are automated exams for your agent, tracing is a flight recorder of every step it took, and guardrails are seatbelts. Because agents read untrusted text AND take real actions, security must be enforced in code — not just requested in the prompt.",
    takeaways: [
      'Evaluate both the final answer and the path (trajectory) the agent took.',
      'Use LLM-as-a-judge with clear rubrics, calibrated against human ratings.',
      'Trace every model call and tool call (OpenTelemetry) so failures can be replayed.',
      'Prompt injection is unsolved at the model level — design so a tricked agent still can\'t do damage.',
      'Human approval for irreversible actions.',
    ],
    caseStudies: [
      {
        org: 'DoorDash',
        title: 'Guardrails and an LLM judge for a support chatbot',
        summary: 'DoorDash built a RAG chatbot for its delivery drivers with two quality layers: an LLM guardrail that checks each answer for grounding and policy compliance before it is shown, and an LLM judge that continuously monitors conversation quality.',
        lesson: 'Shipping a support agent safely needs an online guardrail and offline quality monitoring — not just a good prompt.',
        url: 'https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/',
      },
    ],
    reading: [
      { title: 'Your AI Product Needs Evals', source: 'Hamel Husain', url: 'https://hamel.dev/blog/posts/evals/', type: 'Blog' },
      { title: 'OWASP Top 10 for LLM Applications', source: 'OWASP GenAI Security Project', url: 'https://genai.owasp.org/llm-top-10/', type: 'Guide' },
      LETHAL_TRIFECTA,
      { title: 'Semantic conventions for generative AI', source: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/specs/semconv/gen-ai/', type: 'Docs' },
      { title: 'Secure AI Framework (SAIF)', source: 'Google', url: 'https://saif.google', type: 'Guide' },
    ],
  },

  'ch10-testing-agents': {
    tldr: "Testing an agent is like testing a new employee: check their tools work (unit tests), replay past situations (recordings), give realistic exams many times — because they never answer identically twice — and try to trick them (red-teaming). All before they meet customers.",
    takeaways: [
      'Build a testing pyramid: cheap deterministic tests at the bottom, expensive live evals at the top.',
      'Record-and-replay (VCR) tests make agent orchestration tests fast, free and non-flaky.',
      'pass@k = succeeds at least once in k tries; pass^k = succeeds every time. Production needs pass^k.',
      'Turn every production bug into a permanent regression test.',
    ],
    caseStudies: [
      {
        org: 'Sierra',
        title: 'τ-bench: measuring agent consistency',
        summary: 'Sierra\'s τ-bench simulates realistic customer conversations with tools and policies. The paper reported that even strong function-calling agents solved under half of the tasks, and that consistency dropped sharply when the same task was repeated (pass^8 below 25% in the retail domain).',
        lesson: 'One lucky run proves nothing. Measure how often the agent succeeds every time.',
        url: 'https://arxiv.org/abs/2406.12045',
      },
    ],
    reading: [
      { title: 'τ-bench paper', source: 'arXiv · Sierra', url: 'https://arxiv.org/abs/2406.12045', type: 'Paper' },
      { title: 'Evaluate agents with ADK', source: 'Google ADK docs', url: 'https://google.github.io/adk-docs/evaluate/', type: 'Docs' },
      { title: 'Promptfoo (evals & red-teaming)', source: 'promptfoo.dev', url: 'https://www.promptfoo.dev/docs/intro/', type: 'Docs' },
      { title: 'Inspect (open-source eval framework)', source: 'UK AI Security Institute', url: 'https://inspect.aisi.org.uk', type: 'Docs' },
      { title: 'VCR.py (record & replay HTTP)', source: 'Read the Docs', url: 'https://vcrpy.readthedocs.io', type: 'Docs' },
    ],
  },

  'ch11-scaling-agents': {
    tldr: 'Scaling an agent is like going from cooking for your family to running a restaurant chain. One user click can trigger a dozen model calls, so rate limits, costs and slow "tail" requests show up fast. The fixes are classic engineering: queues, caching, retries with jitter, multiple regions and right-sized models.',
    takeaways: [
      'Agents multiply traffic: N steps per request, each re-sending a growing history.',
      'Use backoff with jitter, multi-region quota and queues to survive rate limits.',
      'Move long-running jobs to async workers; stream progress for interactive ones.',
      'Enforce tenant isolation in code, and give each tenant its own rate limits and budgets.',
    ],
    caseStudies: [
      {
        org: 'Klarna',
        title: 'Two-thirds of customer chats in month one',
        summary: 'Klarna reported its AI assistant handled 2.3 million conversations in its first month, two-thirds of all customer-service chats, with resolution times falling from 11 minutes to under 2. Klarna later emphasised that customers must always be able to reach a human.',
        lesson: 'Agents can absorb huge volume — but keep a clear human path to protect quality.',
        url: 'https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/',
      },
    ],
    reading: [
      { title: 'Timeouts, retries and backoff with jitter', source: "Amazon Builders' Library", url: 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/', type: 'Guide' },
      { title: 'Handling overload', source: 'Google SRE book', url: 'https://sre.google/sre-book/handling-overload/', type: 'Book' },
      { title: 'Rate limits', source: 'Google Gemini API docs', url: 'https://ai.google.dev/gemini-api/docs/rate-limits', type: 'Docs' },
      { title: 'Provisioned Throughput', source: 'Google Cloud docs', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/provisioned-throughput', type: 'Docs' },
    ],
  },

  'ch10-production-blueprints': {
    tldr: 'Shipping an agent means shipping software that can surprise you. Package it like any service, version prompts and models like code, gate every release on evals, roll out gradually — and keep a big red "off" switch.',
    takeaways: [
      'Split sync (interactive, streamed) and async (long-running, queued) execution.',
      'Version model + prompt + tools + eval set together; tag every trace with the version.',
      'Release path: CI eval gate → shadow traffic → canary → full rollout, with instant rollback.',
      'Idempotent tools, checkpoints and graceful shutdown make crashes harmless.',
    ],
    caseStudies: [
      {
        org: 'LinkedIn',
        title: 'The last 20% takes the longest',
        summary: 'Building a generative AI product, LinkedIn\'s team reached about 80% of the experience they wanted in the first month, then spent four more months pushing past 95% — mostly on evaluation, consistency and edge cases.',
        lesson: 'Budget most of your time for evals and hardening, not the first demo.',
        url: 'https://www.linkedin.com/blog/engineering/generative-ai/musings-on-building-a-generative-ai-product',
      },
    ],
    reading: [
      { title: 'Emerging Patterns in Building GenAI Products', source: 'Martin Fowler', url: 'https://martinfowler.com/articles/gen-ai-patterns/', type: 'Blog' },
      { title: '12-Factor Agents', source: 'HumanLayer', url: 'https://github.com/humanlayer/12-factor-agents', type: 'Guide' },
      { title: 'Agent Starter Pack', source: 'GitHub · Google Cloud', url: 'https://github.com/GoogleCloudPlatform/agent-starter-pack', type: 'Guide' },
      { title: 'Rollouts, rollbacks and traffic migration', source: 'Cloud Run docs', url: 'https://cloud.google.com/run/docs/rollouts-rollbacks-traffic-migration', type: 'Docs' },
    ],
  },

  'ch-companies-case-studies': {
    tldr: 'The fastest-growing software companies of the last few years are built around agents. Studying what they built, how they built it and what went wrong is the shortest path to building your own — and great material for interviews.',
    takeaways: [
      'Winners start narrow, own the environment the agent works in, and treat evals as a moat.',
      'Coding, support, search and expert verticals are where agents first proved real value.',
      'Multi-agent vs single-agent is a trade-off between parallelism and shared context.',
      'Public failures (airline bot, $1 car, deleted database) all trace back to missing guardrails and permissions.',
    ],
    reading: [
      ANTHROPIC_MULTI,
      COGNITION_MULTI,
      { title: 'Claude Code: best practices for agentic coding', source: 'Anthropic Engineering', url: 'https://www.anthropic.com/engineering/claude-code-best-practices', type: 'Blog' },
      { title: 'QueryGPT — natural language to SQL', source: 'Uber Engineering', url: 'https://www.uber.com/blog/query-gpt/', type: 'Blog' },
      { title: 'Musings on building a Generative AI product', source: 'LinkedIn Engineering', url: 'https://www.linkedin.com/blog/engineering/generative-ai/musings-on-building-a-generative-ai-product', type: 'Blog' },
      { title: '101 real-world gen AI use cases', source: 'Google Cloud', url: 'https://cloud.google.com/transform/101-real-world-generative-ai-use-cases-from-industry-leaders', type: 'Guide' },
    ],
  },

  'ch16-must-read-papers': {
    tldr: 'Frameworks change every few months; the ideas in these papers have lasted years. You don\'t need to follow every equation — knowing what each paper changed, and why, is enough to reason about new models and to impress in interviews.',
    takeaways: [
      'Transformers + scaling laws explain why bigger models trained on more data got so capable.',
      'Instruction tuning, RLHF and DPO explain why models follow instructions.',
      'CoT, ReAct, Toolformer and CodeAct explain how models reason and use tools.',
      'Benchmarks like SWE-bench and τ-bench explain how agents are measured.',
    ],
    reading: [
      { title: "Let's build GPT: from scratch, in code", source: 'Andrej Karpathy', url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY', type: 'Video' },
      { title: 'The Illustrated Transformer', source: 'Jay Alammar', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'Blog' },
      { title: 'Daily trending AI papers', source: 'Hugging Face Papers', url: 'https://huggingface.co/papers', type: 'Interactive' },
      { title: "Lil'Log (deep, readable research summaries)", source: 'Lilian Weng', url: 'https://lilianweng.github.io', type: 'Blog' },
    ],
  },

  'ch13-interview-prep': {
    tldr: 'AI interviews test three things: do you understand the fundamentals (tokens, attention, RAG, fine-tuning), can you design a reliable system end to end, and can you reason about trade-offs — cost, latency, safety and quality. Practise explaining each concept simply; that is what interviewers remember.',
    takeaways: [
      'Always clarify requirements and do quick cost/latency maths before drawing boxes.',
      'Default to the simplest design; justify every agent, tool and model you add.',
      'Talk about evals, guardrails and rollout — that is what separates senior answers.',
      'Use real case studies (Chapter 17) as evidence for your trade-offs.',
    ],
    reading: [
      { title: 'AI Engineering (book)', source: "Chip Huyen · O'Reilly", url: 'https://www.oreilly.com/library/view/ai-engineering/9781098166298/', type: 'Book' },
      { title: 'Machine Learning Interviews (free book)', source: 'Chip Huyen', url: 'https://huyenchip.com/ml-interviews-book/', type: 'Book' },
      { title: 'Patterns for Building LLM-based Systems & Products', source: 'Eugene Yan', url: 'https://eugeneyan.com/writing/llm-patterns/', type: 'Blog' },
      ANTHROPIC_EFFECTIVE,
      ANTHROPIC_MULTI,
      COGNITION_MULTI,
    ],
  },

  'ch17-mastery-quiz': {
    tldr: 'Test yourself. Take a random 10-question exam, drill one chapter at a time, or try every question. Each answer comes with an explanation so a wrong answer still teaches you something.',
    takeaways: [],
  },
};
