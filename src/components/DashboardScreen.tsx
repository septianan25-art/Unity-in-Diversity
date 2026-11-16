import React from 'react';
import { Award, CheckCircle2, Lock, Play, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GameState, MissionDefinition, MissionId } from '../types/game';
import { calculateScoreBreakdown } from '../utils/scoring';
import { ArchipelagoMap } from './ArchipelagoMap';

interface DashboardScreenProps {
  gameState: GameState;
  missions: MissionDefinition[];
  onStartMission: (id: MissionId) => void;
  onViewResults: () => void;
  onViewCertificate: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  gameState,
  missions,
  onStartMission,
  onViewResults,
  onViewCertificate,
}) => {
  const breakdown = calculateScoreBreakdown(gameState);
  const completedCount = gameState.completedMissions.length;
  const allDone = completedCount === 6;
  const nextMissionId = Math.min(6, completedCount + 1) as MissionId;

  const activeProjectsRegions = gameState.mission4SelectedProjects.length > 0
    ? ['sumatra', 'java', 'kalimantan', 'sulawesi', 'bali', 'nusa', 'maluku', 'papua']
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Student Identity Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-semibold tracking-wider text-amber-300">
            National Unity Task Force Command Center
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
            Welcome, {gameState.profile?.fullName}
          </h1>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm">
            Class {gameState.profile?.className}
            {gameState.profile?.groupName ? ` · ${gameState.profile.groupName}` : ''} ·{' '}
            <span>Current Rank: {breakdown.achievementLevel}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {allDone ? (
            <>
              <button
                type="button"
                onClick={onViewResults}
                className="rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-white hover:border-amber-400 transition-colors whitespace-nowrap shrink-0"
              >
                View Final Scoreboard
              </button>
              <button
                type="button"
                onClick={onViewCertificate}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#B01824] transition-colors whitespace-nowrap shrink-0"
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>Open Certificate</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onStartMission(nextMissionId)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors whitespace-nowrap shrink-0"
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Continue Mission {nextMissionId}</span>
            </button>
          )}
        </div>
      </div>

      {/* 5 Live Performance Indicators */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <motion.div
          key={`unity-${gameState.unityScore}`}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="rounded-xl border border-slate-800 bg-[#0F1E38] p-4"
        >
          <p className="text-xs font-medium text-slate-400">Unity Score</p>
          <p className="mt-1 font-mono-num text-2xl font-bold text-white">
            {gameState.unityScore}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${gameState.unityScore}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          key={`kp-${gameState.knowledgePoints}`}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="rounded-xl border border-slate-800 bg-[#0F1E38] p-4"
        >
          <p className="text-xs font-medium text-slate-400">Knowledge Points</p>
          <p className="mt-1 font-mono-num text-2xl font-bold text-amber-300">
            {gameState.knowledgePoints}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">Earned from analysis</p>
        </motion.div>

        <motion.div
          key={`stab-${gameState.nationalStability}`}
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          className="rounded-xl border border-slate-800 bg-[#0F1E38] p-4"
        >
          <p className="text-xs font-medium text-slate-400">National Stability</p>
          <p className="mt-1 font-mono-num text-2xl font-bold text-emerald-300">
            {gameState.nationalStability}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${gameState.nationalStability}%` }}
            />
          </div>
        </motion.div>

        <div className="rounded-xl border border-slate-800 bg-[#0F1E38] p-4">
          <p className="text-xs font-medium text-slate-400">Mission Progress</p>
          <p className="mt-1 font-mono-num text-2xl font-bold text-white">
            {completedCount}
            <span className="text-sm font-normal text-slate-400">/6</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            {allDone ? 'All missions completed' : `${6 - completedCount} missions remaining`}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-slate-800 bg-[#0F1E38] p-4">
          <p className="text-xs font-medium text-slate-400">Achievement Level</p>
          <p className="mt-1.5 text-sm font-bold text-rose-300 truncate">
            {breakdown.achievementLevel}
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            {gameState.unlockedBadges.length}/8 badges unlocked
          </p>
        </div>
      </div>

      {/* Interactive Indonesian Archipelago Map */}
      <div className="mt-6">
        <ArchipelagoMap
          missions={missions}
          completedMissions={gameState.completedMissions}
          activeMissionId={allDone ? undefined : nextMissionId}
          onSelectMission={(id) => onStartMission(id)}
          highlightedConnections={activeProjectsRegions}
        />
      </div>

      {/* Six Mission Cards */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-bold text-white">
            Six National Unity Missions
          </h2>
          <p className="text-xs text-slate-400">
            Complete missions in order to unlock the next strategic sector
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => {
            const isCompleted = gameState.completedMissions.includes(mission.id);
            const isUnlocked = mission.id <= nextMissionId || isCompleted;

            return (
              <div
                key={mission.id}
                className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors ${
                  isCompleted
                    ? 'border-emerald-700/60 bg-[#0E2136]'
                    : isUnlocked
                    ? 'border-amber-500/50 bg-[#112342]'
                    : 'border-slate-800 bg-[#0B1629] opacity-75'
                }`}
              >
                <div>
                  <div className="overflow-hidden rounded-xl border border-slate-800/80 mb-4 h-36 bg-[#071224]">
                    <img
                      src={mission.imagePath}
                      alt={mission.title}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover ${!isUnlocked ? 'grayscale opacity-50' : ''}`}
                    />
                  </div>

                  <p className="text-xs font-medium text-amber-300">
                    Mission 0{mission.id} · {mission.regionLabel}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-white">
                    {mission.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    {mission.briefing}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-300">Completed</span>
                      </>
                    ) : isUnlocked ? (
                      <>
                        <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
                        <span className="text-amber-200">Active Mission</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-slate-500" aria-hidden="true" />
                        <span className="text-slate-400">Locked</span>
                      </>
                    )}
                  </span>

                  <button
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => onStartMission(mission.id)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      isCompleted
                        ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
                        : isUnlocked
                        ? 'bg-[#C81E2B] text-white hover:bg-[#B01824]'
                        : 'cursor-not-allowed bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? 'Review Mission' : isUnlocked ? 'Launch Mission' : 'Locked'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integrity Reminder Strip */}
      <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-800 bg-[#0B172C] p-4 text-xs text-slate-300">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
        <p className="leading-relaxed">
          <strong className="text-white">Task Force Principle:</strong> Protecting Indonesia’s unity
          requires more than polite tolerance—it demands equal opportunity, fair regional
          development, mutual respect, and shared responsibility across every island.
        </p>
      </div>
    </div>
  );
};
