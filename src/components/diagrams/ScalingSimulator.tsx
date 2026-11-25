import React, { useState, useMemo } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Gauge, Server, Zap } from 'lucide-react';

export function ScalingSimulator() {
  const [concurrentUsers, setConcurrentUsers] = useState(500);
  const [stepsPerRun, setStepsPerRun] = useState(6);
  const [mitigations, setMitigations] = useState({
    multiRegion: true,
    promptCache: true,
    queueBackpressure: true,
    modelCascade: true,
    semanticCache: false,
  });

  const toggle = (k: keyof typeof mitigations) =>
    setMitigations((p) => ({ ...p, [k]: !p[k] }));

  const stats = useMemo(() => {
    const cacheBypass = mitigations.semanticCache ? 0.72 : 1.0;
    const effectiveRunsPerMin = Math.round(concurrentUsers * 0.6 * cacheBypass);
    const llmCallsPerMin = effectiveRunsPerMin * stepsPerRun;
    const tokensPerCall = mitigations.promptCache ? 1800 : 5200;
    const totalTpm = llmCallsPerMin * tokensPerCall;

    // Capacity limits: single region ~2M TPM / 2,000 RPM vs multi-region pool ~15M TPM / 15,000 RPM
    const tpmCap = mitigations.multiRegion ? 15_000_000 : 2_000_000;
    const rpmCap = mitigations.multiRegion ? 15_000 : 2_000;

    const tpmLoadPct = Math.round((totalTpm / tpmCap) * 100);
    const rpmLoadPct = Math.round((llmCallsPerMin / rpmCap) * 100);
    const peakLoad = Math.max(tpmLoadPct, rpmLoadPct);

    const rateLimit429 =
      peakLoad > 100 && !mitigations.queueBackpressure
        ? Math.min(92, Math.round((peakLoad - 100) * 0.85))
        : peakLoad > 140
          ? Math.min(45, Math.round((peakLoad - 140) * 0.35))
          : 0;

    const baseStepLatency = mitigations.modelCascade ? 0.75 : 2.1;
    const queueDelay =
      peakLoad > 100 && mitigations.queueBackpressure
        ? ((peakLoad - 100) / 100) * 4.5
        : 0;
    const p99LatencySec = stepsPerRun * baseStepLatency * 1.45 + queueDelay;

    return {
      llmCallsPerMin,
      totalTpm,
      tpmLoadPct,
      rpmLoadPct,
      rateLimit429,
      p99LatencySec,
    };
  }, [concurrentUsers, stepsPerRun, mitigations]);

  const healthy = stats.rateLimit429 === 0 && stats.p99LatencySec < 15;

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-slate-100 shadow-xl dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-5 py-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-amber-400">
            <Server className="h-3.5 w-3.5" /> Interactive Load &amp; Bottleneck Simulator
          </span>
          <h3 className="font-display text-lg font-bold text-white">
            Stress-Test Your Agent Fleet at Scale
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold ${
            healthy
              ? 'bg-emerald-500/15 text-emerald-300'
              : 'bg-rose-500/20 text-rose-300'
          }`}
        >
          {healthy ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" /> FLEET HEALTHY
            </>
          ) : (
            <>
              <AlertTriangle className="h-3.5 w-3.5" /> BOTTLENECK DETECTED
            </>
          )}
        </span>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-12 sm:p-6">
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Concurrent Active Users</span>
              <strong className="font-mono text-amber-300">
                {concurrentUsers.toLocaleString()} users
              </strong>
            </div>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={concurrentUsers}
              onChange={(e) => setConcurrentUsers(Number(e.target.value))}
              className="mt-2 w-full accent-amber-400"
            />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Avg. Agent Loop Steps / Run</span>
              <strong className="font-mono text-amber-300">{stepsPerRun} steps</strong>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={stepsPerRun}
              onChange={(e) => setStepsPerRun(Number(e.target.value))}
              className="mt-2 w-full accent-amber-400"
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Toggle Scaling Mitigations
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['multiRegion', 'Multi-Region Quota Pool'],
                  ['promptCache', 'KV Prompt Caching'],
                  ['queueBackpressure', 'Pub/Sub Queue Backpressure'],
                  ['modelCascade', 'Flash/Pro Model Cascading'],
                  ['semanticCache', 'Semantic Response Cache'],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => toggle(k)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                    mitigations[k]
                      ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  <span className="pr-1">{label}</span>
                  <span className="font-mono text-[10px]">{mitigations[k] ? 'ON' : 'OFF'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Telemetry */}
        <div className="flex flex-col justify-between gap-4 lg:col-span-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Zap className="h-3.5 w-3.5 text-amber-400" /> Token Throughput
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-white">
                {(stats.totalTpm / 1_000_000).toFixed(2)}M <span className="text-xs text-slate-400">TPM</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Quota utilization:{' '}
                <strong className={stats.tpmLoadPct > 95 ? 'text-rose-400' : 'text-emerald-400'}>
                  {stats.tpmLoadPct}%
                </strong>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Activity className="h-3.5 w-3.5 text-cyan-400" /> LLM Requests / Min
              </div>
              <div className="mt-1 font-mono text-xl font-bold text-white">
                {stats.llmCallsPerMin.toLocaleString()} <span className="text-xs text-slate-400">RPM</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                RPM utilization:{' '}
                <strong className={stats.rpmLoadPct > 95 ? 'text-rose-400' : 'text-emerald-400'}>
                  {stats.rpmLoadPct}%
                </strong>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Gauge className="h-3.5 w-3.5 text-indigo-400" /> Est. P99 Run Latency
              </div>
              <div
                className={`mt-1 font-mono text-xl font-bold ${
                  stats.p99LatencySec > 18 ? 'text-rose-400' : stats.p99LatencySec > 10 ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {stats.p99LatencySec.toFixed(1)}s
              </div>
              <div className="mt-1 text-[11px] text-slate-400">End-to-end multi-step</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> HTTP 429 Error Rate
              </div>
              <div
                className={`mt-1 font-mono text-xl font-bold ${
                  stats.rateLimit429 > 0 ? 'text-rose-400' : 'text-emerald-300'
                }`}
              >
                {stats.rateLimit429}%
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {stats.rateLimit429 > 0 ? 'Thundering herd retries!' : 'Zero dropped requests'}
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-4 text-xs leading-relaxed ${
              healthy
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
            }`}
          >
            {healthy ? (
              <p>
                <strong>Smooth Scaling!</strong> Multi-region quotas, prompt caching, and model
                cascading absorb {concurrentUsers.toLocaleString()} concurrent users without 429
                storms or runaway P99 tail latency.
              </p>
            ) : (
              <p>
                <strong>Scaling Incident!</strong>{' '}
                {stats.rateLimit429 > 0
                  ? 'You hit provider TPM/RPM limits! Enable Multi-Region Quota Pooling, Prompt Caching, and Pub/Sub Queue Backpressure to stop 429 retry storms.'
                  : 'P99 latency is too high for interactive UX. Turn on Flash/Pro Model Cascading, reduce step count, or shift long runs to async background queues.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
