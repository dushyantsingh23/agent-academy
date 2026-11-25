import React from 'react';
import { Cpu, Database, Flame, GitBranch, Layers, RefreshCw, Server } from 'lucide-react';
import { Callout, CodeBlock, ConceptCard, SectionHeader } from '../components/UI';
import { PostTrainingPipelineLab } from '../components/diagrams/PostTrainingPipelineLab';

export function Chapter15TrainingMlops({
  isCompleted,
  onComplete,
}: {
  isCompleted: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Training & MLOps"
        title="Training, Post-Training & Agentic MLOps / LLMOps"
        description="Understanding how foundation models are pre-trained, post-trained with SFT/DPO/RLVR, distilled with LoRA, and continuously improved via an MLOps data flywheel turns you from an API consumer into a full-stack AI engineer."
      />

      <PostTrainingPipelineLab />

      <SectionHeader
        eyebrow="Post-Training Deep Dive"
        title="How Enterprise Teams Customize Models (LoRA, DPO, RLVR & Distillation)"
        description="Almost nobody pre-trains from scratch — 99% of high-ROI model customization happens in Post-Training:"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <ConceptCard icon={<Layers className="h-4 w-4" />} title="LoRA & QLoRA (Parameter-Efficient FT)" badge="Fast & Cheap">
          Freezes the base weights and trains tiny low-rank adapter matrices ($A \times B$, &lt;1% of
          parameters). QLoRA quantizes the frozen base to 4-bit NF4 so you can fine-tune a 70B model on
          a single node — and serve <strong>100 tenant LoRA adapters on one shared vLLM server</strong>!
        </ConceptCard>
        <ConceptCard icon={<Flame className="h-4 w-4" />} title="Knowledge Distillation (Teacher → Student)" badge="10× Cheaper Prod">
          Run a pricey Frontier Teacher (Gemini Pro / Claude) on 20,000 production tasks, filter for
          verified-correct trajectories, and SFT a tiny 7B–14B Student (Qwen/Gemma/Llama). Often matches
          95%+ of teacher accuracy at <strong>1/15th the cost and 5× speed</strong>.
        </ConceptCard>
        <ConceptCard icon={<GitBranch className="h-4 w-4" />} title="DPO (Direct Preference Optimization)" badge="Alignment">
          Trains on <code>(prompt, chosen_response, rejected_response)</code> triples directly using a
          closed-form loss — achieving RLHF-grade alignment without training or stabilizing a separate
          PPO reward model.
        </ConceptCard>
        <ConceptCard icon={<Cpu className="h-4 w-4" />} title="RLVR / GRPO (Verifiable Rewards)" badge="Agentic Reasoning">
          Samples a group of $G$ candidate trajectories per prompt, runs each through an objective
          verifier (unit tests, SQL execution, JSON schema, math grader), and updates the policy toward
          the winning rollouts. Directly trains error recovery and multi-step planning!
        </ConceptCard>
      </div>

      <SectionHeader
        eyebrow="MLOps / LLMOps"
        title="The Agentic MLOps Architecture & Data Flywheel"
        description="Traditional MLOps tracked CSV datasets and scikit-learn weights. Agentic MLOps manages prompts, tool schemas, LoRA weights, vector indexes, eval suites, and GPU inference fleets together."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ConceptCard icon={<RefreshCw className="h-4 w-4" />} title="1. Trace-to-Dataset Flywheel" badge="Compounding Moat">
          Stream OpenTelemetry production traces → auto-label failures via LLM-Judge &amp; user thumbs
          down → human experts review edge cases → feed back into Golden Evals &amp; SFT/DPO datasets.
        </ConceptCard>
        <ConceptCard icon={<Database className="h-4 w-4" />} title="2. Unified Artifact Registry" badge="Reproducibility">
          Version every deployment bundle atomically: <code>(model_id + lora_sha + prompt_sha + tool_schema_ver + rag_index_ver)</code>{' '}
          in Vertex AI Model Registry / MLflow / W&amp;B.
        </ConceptCard>
        <ConceptCard icon={<Server className="h-4 w-4" />} title="3. GPU Serving & Drift Ops" badge="vLLM / GKE">
          Monitor GPU KV-cache utilization, queue wait time, TTFT/TPS, and weekly eval score drift.
          Autoscale GKE GPU node pools on pending KV-cache requests rather than naive CPU%.
        </ConceptCard>
      </div>

      <CodeBlock
        title="Post-Training with Hugging Face TRL (QLoRA SFT & GRPO Verifiable RL)"
        tabs={[
          {
            label: 'QLoRA SFT (Python)',
            language: 'python',
            code: `from peft import LoraConfig
from trl import SFTTrainer, SFTConfig

lora_cfg = LoraConfig(
    r=16, lora_alpha=32, lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    task_type="CAUSAL_LM",
)

trainer = SFTTrainer(
    model="Qwen/Qwen2.5-14B-Instruct",
    train_dataset=verified_tool_trajectories,  # Multi-turn JSON tool calls
    peft_config=lora_cfg,
    args=SFTConfig(
        output_dir="./qwen14b-sql-agent-lora",
        per_device_train_batch_size=4,
        gradient_accumulation_steps=8,
        learning_rate=2e-4,
        bf16=True,
        num_train_epochs=2,
    ),
)
trainer.train()`,
          },
          {
            label: 'GRPO / RLVR (Python)',
            language: 'python',
            code: `from trl import GRPOTrainer, GRPOConfig

def sql_verifier_reward(completions, expected_results, **kwargs) -> list[float]:
    """Objective verifiable reward: execute generated SQL in read-only sandbox!"""
    rewards = []
    for sql, expected in zip(completions, expected_results):
        try:
            actual = run_readonly_sandbox_sql(sql)
            rewards.append(1.0 if actual == expected else 0.1)  # 0.1 for valid syntax
        except Exception:
            rewards.append(0.0)
    return rewards

trainer = GRPOTrainer(
    model="Qwen/Qwen2.5-7B-Instruct",
    reward_funcs=[sql_verifier_reward],
    train_dataset=sql_prompts_dataset,
    args=GRPOConfig(num_generations=8, max_completion_length=1024, bf16=True),
)
trainer.train()`,
          },
        ]}
      />

      <Callout type="warning" title="Don't Fine-Tune Too Early — Follow the Optimization Ladder">
        <p>
          Always climb in order: <strong>(1) Better Prompts &amp; Few-Shot Examples</strong> →{' '}
          <strong>(2) Better Tools &amp; Hybrid RAG</strong> →{' '}
          <strong>(3) Context Engineering &amp; Multi-Agent Isolation</strong> →{' '}
          <strong>(4) SFT / LoRA Distillation or GRPO Post-Training</strong> once you have 1,000+
          verified traces and clear unit-economics or accuracy gaps.
        </p>
      </Callout>
    </div>
  );
}
