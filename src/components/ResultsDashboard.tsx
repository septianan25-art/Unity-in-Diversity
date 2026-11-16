import React from 'react';
import { Award, CheckCircle2, Lock, MessageSquare, Shield, Star, TrendingUp } from 'lucide-react';
import { BADGE_DEFINITIONS } from '../data/missionsData';
import { GameState } from '../types/game';
import { calculateScoreBreakdown } from '../utils/scoring';

interface ResultsDashboardProps {
  mode: 'results' | 'achievements';
  gameState: GameState;
  onOpenCertificate: () => void;
  onOpenReflection: () => void;
  onBackToDashboard: () => void;
  onRestart: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  mode,
  gameState,
  onOpenCertificate,
  onOpenReflection,
  onBackToDashboard,
  onRestart,
}) => {
  const breakdown = calculateScoreBreakdown(gameState);
  const allCompleted = gameState.completedMissions.length === 6;

  if (mode === 'achievements') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-semibold tracking-wider text-amber-300">
              National Unity Merit Honors
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              Task Force Achievements
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {gameState.unlockedBadges.length} of {BADGE_DEFINITIONS.length} badges unlocked · Current Rank: {breakdown.achievementLevel}
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-xs font-semibold text-white hover:border-amber-400 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGE_DEFINITIONS.map((badge) => {
            const unlocked = gameState.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 ${
                  unlocked
                    ? 'border-amber-400/60 bg-[#102442]'
                    : 'border-slate-800 bg-[#0B1629] opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                        unlocked
                          ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                          : 'border-slate-700 bg-slate-900 text-slate-500'
                      }`}
                    >
                      {unlocked ? (
                        <Award className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Lock className="h-4 w-4" aria-hidden="true" />
                      )}
                    </span>
                    <span
                      className={`text-[11px] font-bold ${
                        unlocked ? 'text-emerald-300' : 'text-slate-500'
                      }`}
                    >
                      {unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-base font-bold text-white">
                    {badge.title}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    {badge.description}
                  </p>
                </div>

                <p className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                  Criteria: {badge.criteriaText}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const componentRows = [
    { label: 'Knowledge & Understanding', score: breakdown.knowledgePct, max: 25 },
    { label: 'Critical Thinking & Analysis', score: breakdown.criticalThinkingPct, max: 30 },
    { label: 'Decision-Making & Problem-Solving', score: breakdown.decisionMakingPct, max: 25 },
    { label: 'Cooperation & Negotiation', score: breakdown.cooperationPct, max: 10 },
    { label: 'Final Integration Strategy', score: breakdown.strategyPct, max: 10 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-amber-500/40 bg-[#0F1E38] p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-800 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-wider text-amber-300">
              Final Performance Assessment · {gameState.profile?.fullName}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">
              Mission Debrief & Final Score
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Class {gameState.profile?.className}
              {gameState.profile?.groupName ? ` · ${gameState.profile.groupName}` : ''}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/50 bg-[#091326] px-6 py-4 text-center">
            <p className="text-xs font-semibold text-amber-300">Achievement Level</p>
            <p className="mt-1 font-display text-2xl font-bold text-white">
              {breakdown.achievementLevel}
            </p>
            <p className="mt-1 font-mono-num text-3xl font-bold text-rose-400">
              {breakdown.finalScore}
              <span className="text-base font-normal text-slate-400">/100</span>
            </p>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-[#091326] p-4">
            <p className="text-xs text-slate-400">Final Unity Score</p>
            <p className="mt-1 font-mono-num text-2xl font-bold text-amber-300">
              {gameState.unityScore}/100
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#091326] p-4">
            <p className="text-xs text-slate-400">National Stability</p>
            <p className="mt-1 font-mono-num text-2xl font-bold text-emerald-300">
              {gameState.nationalStability}/100
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#091326] p-4">
            <p className="text-xs text-slate-400">Total Knowledge Points</p>
            <p className="mt-1 font-mono-num text-2xl font-bold text-white">
              {gameState.knowledgePoints}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#091326] p-4">
            <p className="text-xs text-slate-400">Missions Completed</p>
            <p className="mt-1 font-mono-num text-2xl font-bold text-white">
              {gameState.completedMissions.length}/6
            </p>
          </div>
        </div>

        {/* 5-Component Rubric Breakdown + Qualitative Analysis */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <h2 className="font-display text-lg font-bold text-white">
              Transparent Performance Breakdown (100%)
            </h2>
            {componentRows.map((row) => {
              const pct = Math.round((row.score / row.max) * 100);
              return (
                <div key={row.label} className="rounded-xl border border-slate-800 bg-[#091326] p-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium text-slate-200">{row.label}</span>
                    <span className="font-mono-num font-bold text-amber-300">
                      {row.score} / {row.max}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-5">
              <div className="flex items-center gap-2 text-emerald-300">
                <Star className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Strongest Skill</h3>
              </div>
              <p className="mt-2 text-base font-bold text-white">{breakdown.strongestSkill}</p>
            </div>

            <div className="rounded-xl border border-amber-700/40 bg-amber-950/20 p-5">
              <div className="flex items-center gap-2 text-amber-300">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Area for Growth</h3>
              </div>
              <p className="mt-2 text-sm font-semibold text-white">{breakdown.areaForImprovement}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#091326] p-5">
              <div className="flex items-center gap-2 text-sky-300">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Personalized Feedback</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
                {breakdown.personalizedFeedback}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-200 hover:border-slate-500 transition-colors"
            >
              Mission Dashboard
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-xl border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-200 hover:border-rose-400 transition-colors"
            >
              Restart Game
            </button>
          </div>

          {allCompleted && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenReflection}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500/10 px-5 py-3 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 transition-colors"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span>Final Reflection</span>
              </button>
              <button
                type="button"
                onClick={onOpenCertificate}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Generate Certificate of Achievement</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
