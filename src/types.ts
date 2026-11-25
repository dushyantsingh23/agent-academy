export type ChapterId =
  | 'home'
  | 'ch0-llm-basics'
  | 'ch0-prompting-apis'
  | 'ch-companies-case-studies'
  | 'ch-own-model-gpus'
  | 'ch-stay-current'
  | 'ch1-foundations'
  | 'ch2-reasoning-memory'
  | 'ch3-tools-mcp-cli'
  | 'ch4-models-tokens-training'
  | 'ch5-frameworks'
  | 'ch6-multi-agent'
  | 'ch7-a2a-protocols'
  | 'ch8-gcp-agents'
  | 'ch9-evals-safety'
  | 'ch10-testing-agents'
  | 'ch11-scaling-agents'
  | 'ch10-production-blueprints'
  | 'ch13-interview-prep'
  | 'ch14-open-models-routers'
  | 'ch15-training-mlops'
  | 'ch16-must-read-papers'
  | 'ch17-mastery-quiz';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeTab {
  label: string;
  language: string;
  code: string;
}

export interface ChapterMeta {
  id: Exclude<ChapterId, 'home'>;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  xp: number;
  accent: string;
  tags: string[];
  badge: string;
}
