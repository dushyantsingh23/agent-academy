# AgentAcademy — Learn AI Agents End to End

**Live site: https://agentacademy.web.app**

AgentAcademy is a free, interactive handbook that takes a software engineer from "what is a token?" all the way to designing, building, testing, scaling and deploying production AI agents — and handling AI engineering interviews.

It is written in plain English, with 25+ interactive labs and animations, real company case studies, and curated links to the original blogs, papers and docs.

## What's inside

22 chapters in six parts:

| Part | Chapters |
| --- | --- |
| **I. AI Fundamentals** | How LLMs work (neural nets, training, tokens, embeddings, attention) · Prompting, LLM APIs & the road to agents |
| **II. Agent Foundations** | Agent types & the core loop · Reasoning, planning & memory · Tools, function calling, MCP & CLIs |
| **III. Models, Training & Frameworks** | Tokens, cost & serving · Open-weight models & routers · Training, post-training & MLOps · Train, run & deploy your own model (and why GPUs) · Agent frameworks (ADK, LangGraph, CrewAI, …) |
| **IV. Multi-Agent, A2A & Cloud** | Multi-agent systems · Agent-to-Agent (A2A) protocol · Building agents on Google Cloud |
| **V. Production** | Evals, tracing & security · Testing agents · Scaling agents · Deploying to production |
| **VI. Real World, Research & Interviews** | AI agent companies & case studies · Must-read papers · Interview prep · Final quiz · Staying current |

Every chapter starts with an "In plain English" summary and ends with key takeaways, a real-world case study and further reading.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion for animations, Lucide icons
- Hosted on Firebase Hosting

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Deploy (Firebase Hosting)

```bash
npm run build
npx firebase-tools deploy --only hosting
```

`firebase.json` serves `dist/` as a single-page app. Update `.firebaserc` and the `site` in `firebase.json` to point at your own Firebase project.

## Project structure

```
src/
  App.tsx                  # layout, navigation, curriculum parts
  chapters/                # one component per chapter
  components/              # shared UI, chapter extras, search, home page
  components/diagrams/     # interactive labs and simulators
  data/chapters.ts         # chapter metadata and ordering
  data/chapterExtras.ts    # summaries, takeaways, case studies, reading links
  data/quizBank.ts         # final quiz questions
```

## Contributing

Corrections and improvements are welcome — especially fixes to facts, outdated APIs or broken links. Please open an issue or a pull request.

## A note on accuracy

AI moves quickly. Model names, prices, company metrics and API details reflect the time of writing and are labelled as illustrative or "publicly reported" where appropriate. Always check the linked primary sources and current provider documentation before relying on them.

## License

Licensed under the [Apache License, Version 2.0](LICENSE).
