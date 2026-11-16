import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Compass,
  Globe2,
  Handshake,
  Layers,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import {
  CONNECT_PROJECTS,
  CULTURAL_REGIONS,
  POLICY_STRATEGIES_2045,
  REGIONAL_TEAMS,
} from '../data/missionsData';
import {
  DecisionLogEntry,
  DecisionOption,
  MissionDefinition,
} from '../types/game';
import { evaluateStrategyEssay } from '../utils/scoring';
import { ArchipelagoMap } from './ArchipelagoMap';
import { ConsequencePanel } from './ConsequencePanel';

interface MissionPlayerProps {
  mission: MissionDefinition;
  allMissions: MissionDefinition[];
  completedMissions: number[];
  savedM4Projects: string[];
  savedM6Policies: string[];
  savedM6Essay: string;
  onRecordDecision: (entry: DecisionLogEntry) => void;
  onSaveMission4Projects: (projectIds: string[]) => void;
  onSaveMission6Strategy: (policyIds: string[], essay: string, score: number) => void;
  onCompleteMission: (missionId: MissionDefinition['id']) => void;
  onBackToDashboard: () => void;
  onPlaySubmitSfx: () => void;
  onPlayOutcomeSfx: (tier: DecisionOption['tier']) => void;
}

export const MissionPlayer: React.FC<MissionPlayerProps> = ({
  mission,
  allMissions,
  completedMissions,
  savedM4Projects,
  savedM6Policies,
  savedM6Essay,
  onRecordDecision,
  onSaveMission4Projects,
  onSaveMission6Strategy,
  onCompleteMission,
  onBackToDashboard,
  onPlaySubmitSfx,
  onPlayOutcomeSfx,
}) => {
  const isAlreadyCompleted = completedMissions.includes(mission.id);

  // Mission-specific setup phases before/after challenges
  const [phase, setPhase] = useState<'setup' | 'challenges' | 'final-strategy'>(() => {
    if (mission.id === 4 && savedM4Projects.length === 0) return 'setup';
    if (mission.id === 6 && savedM6Policies.length < 4) return 'setup';
    return 'challenges';
  });

  const [challengeIdx, setChallengeIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);

  // Mission 1 Cultural Explorer active tab
  const [activeCultureId, setActiveCultureId] = useState(CULTURAL_REGIONS[0].id);

  // Mission 4 Connect Projects State (100 Unity Points Budget)
  const [selectedProjects, setSelectedProjects] = useState<string[]>(savedM4Projects);
  const m4BudgetSpent = useMemo(
    () =>
      selectedProjects.reduce((sum, id) => {
        const proj = CONNECT_PROJECTS.find((p) => p.id === id);
        return sum + (proj?.cost ?? 0);
      }, 0),
    [selectedProjects]
  );
  const m4Remaining = 100 - m4BudgetSpent;

  const m4HighlightedRegions = useMemo(() => {
    const set = new Set<string>();
    selectedProjects.forEach((id) => {
      CONNECT_PROJECTS.find((p) => p.id === id)?.regionIds.forEach((r) => set.add(r));
    });
    return Array.from(set);
  }, [selectedProjects]);

  // Mission 5 Regional Team Inspector
  const [activeTeamId, setActiveTeamId] = useState(REGIONAL_TEAMS[0].id);

  // Mission 6 Policy Strategy Selection (Choose 4 within 120 pts) + Essay
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>(savedM6Policies);
  const [strategyEssay, setStrategyEssay] = useState(savedM6Essay);
  const [essayError, setEssayError] = useState('');
  const m6BudgetSpent = useMemo(
    () =>
      selectedPolicies.reduce((sum, id) => {
        const pol = POLICY_STRATEGIES_2045.find((p) => p.id === id);
        return sum + (pol?.cost ?? 0);
      }, 0),
    [selectedPolicies]
  );
  const m6Remaining = 120 - m6BudgetSpent;

  const currentChallenge = mission.challenges[challengeIdx];

  const handleToggleProject = (projectId: string, cost: number) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects((prev) => prev.filter((id) => id !== projectId));
    } else if (m4BudgetSpent + cost <= 100) {
      onPlaySubmitSfx();
      setSelectedProjects((prev) => [...prev, projectId]);
    }
  };

  const handleTogglePolicy = (policyId: string, cost: number) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies((prev) => prev.filter((id) => id !== policyId));
    } else if (selectedPolicies.length < 4 && m6BudgetSpent + cost <= 120) {
      onPlaySubmitSfx();
      setSelectedPolicies((prev) => [...prev, policyId]);
    }
  };

  const handleChooseOption = (option: DecisionOption) => {
    if (selectedOption) return;
    onPlaySubmitSfx();
    setSelectedOption(option);
    onPlayOutcomeSfx(option.tier);

    if (!isAlreadyCompleted) {
      onRecordDecision({
        challengeId: currentChallenge.id,
        missionId: mission.id,
        selectedOptionId: option.id,
        tier: option.tier,
        scoreRatio: option.scoreRatio,
        skillCategory: currentChallenge.skillCategory,
        unityDelta: option.unityDelta,
        stabilityDelta: option.stabilityDelta,
        knowledgePoints: option.knowledgePoints,
      });
    }
  };

  const handleAdvanceChallenge = () => {
    setSelectedOption(null);
    if (challengeIdx + 1 < mission.challenges.length) {
      setChallengeIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (mission.id === 6 && !isAlreadyCompleted) {
      setPhase('final-strategy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (!isAlreadyCompleted) {
        onCompleteMission(mission.id);
      } else {
        onBackToDashboard();
      }
    }
  };

  const handleSubmitFinalStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    const words = strategyEssay.trim().split(/\s+/).filter(Boolean);
    if (words.length < 15) {
      setEssayError('Please write at least 15 words explaining why your chosen strategies strengthen Indonesia’s future integration.');
      return;
    }
    const score = evaluateStrategyEssay(strategyEssay, selectedPolicies.length);
    onPlaySubmitSfx();
    onSaveMission6Strategy(selectedPolicies, strategyEssay.trim(), score);
    onCompleteMission(6);
  };

  const activeCulture = CULTURAL_REGIONS.find((c) => c.id === activeCultureId) ?? CULTURAL_REGIONS[0];
  const activeTeam = REGIONAL_TEAMS.find((t) => t.id === activeTeamId) ?? REGIONAL_TEAMS[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Top Breadcrumb & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-xs text-slate-400">
          Mission 0{mission.id} · {mission.title}
          {isAlreadyCompleted && ' · Review Mode (Scores Locked)'}
        </div>
      </div>

      {/* Mission Banner */}
      <div className="mt-5 rounded-2xl border border-slate-800 bg-[#0F1E38] p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-wider text-amber-300">
          {mission.regionLabel} · Learning Objective
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          {mission.title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-300">{mission.learningObjective}</p>
      </div>

      {/* MISSION 1 INTERACTIVE CULTURAL INVESTIGATION EXPLORER */}
      {mission.id === 1 && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B172C] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-300">
              <Compass className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-sans text-sm font-semibold text-white">
                Cultural Investigation Field Notes (Inspect Regions Before Answering)
              </h2>
            </div>
            <span className="text-xs text-slate-400">Click an island to inspect its cultural roots</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {CULTURAL_REGIONS.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setActiveCultureId(reg.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeCultureId === reg.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'border border-slate-700 bg-slate-900/70 text-slate-300 hover:text-white'
                }`}
              >
                {reg.island}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-[#091326] p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-amber-300">
                {activeCulture.regionName} · {activeCulture.ethnicGroup}
              </p>
              <p className="mt-1.5 text-xs text-slate-300">
                <strong className="text-white">Traditional House:</strong> {activeCulture.traditionalHouse}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                <strong className="text-white">Key Tradition:</strong> {activeCulture.tradition}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">Geography Factor:</strong> {activeCulture.geographicFactor}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-emerald-200/90">
                <strong className="text-emerald-300">Why It Evolved:</strong>{' '}
                {activeCulture.culturalConnection}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MISSION 4 PHASE A: INTERACTIVE MAP & 100 UNITY POINTS BUDGET ALLOCATOR */}
      {mission.id === 4 && phase === 'setup' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-amber-500/40 bg-[#0F1E38] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  Step 1: National Connectivity Strategy (100 Unity Points Budget)
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Select at least 3 strategic projects to connect Indonesia’s regions. You cannot
                  afford everything—weigh short-term gains, long-term integration, and trade-offs.
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-[#091326] px-4 py-3 text-right">
                <p className="text-[11px] text-slate-400">Remaining Budget</p>
                <p className="font-mono-num text-2xl font-bold text-amber-300">
                  {m4Remaining} <span className="text-xs font-normal text-slate-400">/ 100 UP</span>
                </p>
              </div>
            </div>

            <div className="mt-5">
              <ArchipelagoMap
                missions={allMissions}
                completedMissions={completedMissions as MissionDefinition['id'][]}
                activeMissionId={4}
                highlightedConnections={m4HighlightedRegions}
                compact
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {CONNECT_PROJECTS.map((proj) => {
                const isSelected = selectedProjects.includes(proj.id);
                const canAfford = m4BudgetSpent + proj.cost <= 100;
                return (
                  <div
                    key={proj.id}
                    className={`flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-slate-800 bg-[#091326]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-semibold text-amber-300">
                            {proj.category}
                          </span>
                          <h3 className="font-sans text-sm font-bold text-white">{proj.title}</h3>
                        </div>
                        <span className="font-mono-num text-xs font-bold text-slate-200 whitespace-nowrap">
                          {proj.cost} UP
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-emerald-200">
                        <strong>Short-term:</strong> {proj.shortTermBenefit}
                      </p>
                      <p className="mt-1 text-xs text-sky-200">
                        <strong>Long-term:</strong> {proj.longTermBenefit}
                      </p>
                      <p className="mt-1 text-xs text-amber-200/80">
                        <strong>Limitation:</strong> {proj.limitation}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={!isSelected && !canAfford}
                      onClick={() => handleToggleProject(proj.id, proj.cost)}
                      className={`mt-4 w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                          : canAfford
                          ? 'border border-slate-600 bg-slate-800 text-white hover:border-amber-400'
                          : 'cursor-not-allowed bg-slate-900 text-slate-500'
                      }`}
                    >
                      {isSelected
                        ? 'Selected (Click to Remove)'
                        : canAfford
                        ? 'Fund Project'
                        : 'Insufficient Budget'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
              <p className="text-xs text-slate-300">
                Selected: <strong className="text-white">{selectedProjects.length}</strong> projects ·{' '}
                Spent: <strong className="font-mono-num text-amber-300">{m4BudgetSpent} UP</strong>
              </p>
              <button
                type="button"
                disabled={selectedProjects.length < 3}
                onClick={() => {
                  onPlaySubmitSfx();
                  onSaveMission4Projects(selectedProjects);
                  setPhase('challenges');
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                  selectedProjects.length >= 3
                    ? 'bg-[#C81E2B] text-white hover:bg-[#B01824]'
                    : 'cursor-not-allowed bg-slate-800 text-slate-500'
                }`}
              >
                <span>Deploy Strategy & Test Resilience</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MISSION 5 REGIONAL NEGOTIATION DELEGATION BRIEFING */}
      {mission.id === 5 && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B172C] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-300">
              <Handshake className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-sans text-sm font-semibold text-white">
                National Negotiation Table · Regional Delegation Profiles
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              Review all four regional needs before mediating compromises
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {REGIONAL_TEAMS.map((team) => (
              <button
                key={team.id}
                type="button"
                onClick={() => setActiveTeamId(team.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  activeTeamId === team.id
                    ? 'bg-amber-400 text-slate-950'
                    : 'border border-slate-700 bg-slate-900/70 text-slate-300 hover:text-white'
                }`}
              >
                {team.provinceSample}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl border border-slate-800 bg-[#091326] p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-amber-300">{activeTeam.name}</p>
              <p className="mt-1.5 text-xs text-slate-300">
                <strong className="text-white">Resources:</strong> {activeTeam.resources}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                <strong className="text-white">Economy:</strong> {activeTeam.economicCondition}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-300">
                <strong className="text-white">Geography Challenge:</strong>{' '}
                {activeTeam.geographicChallenge}
              </p>
              <p className="mt-1.5 text-xs text-emerald-200">
                <strong className="text-emerald-300">Priority Needs:</strong>{' '}
                {activeTeam.priorityNeeds}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MISSION 6 PHASE A: SELECT 4 PRIORITY STRATEGIES FOR INDONESIA 2045 */}
      {mission.id === 6 && phase === 'setup' && (
        <div className="mt-6 rounded-2xl border border-amber-500/40 bg-[#0F1E38] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-rose-300">Indonesia Centennial Cabinet · Year 2045</p>
              <h2 className="mt-1 font-display text-xl font-bold text-white">
                Step 1: Select 4 Priority National Strategies (120-Point Budget)
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Choose exactly 4 national priorities from the 10 proposals below within your 120-point
                development budget.
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-[#091326] px-4 py-3 text-right">
              <p className="text-[11px] text-slate-400">Budget Remaining · Slots</p>
              <p className="font-mono-num text-xl font-bold text-amber-300">
                {m6Remaining} pts · {selectedPolicies.length}/4
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {POLICY_STRATEGIES_2045.map((pol) => {
              const isSelected = selectedPolicies.includes(pol.id);
              const canPick = selectedPolicies.length < 4 && m6BudgetSpent + pol.cost <= 120;
              return (
                <div
                  key={pol.id}
                  className={`flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-800 bg-[#091326]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-300">{pol.pillar}</span>
                        <h3 className="text-sm font-bold text-white">{pol.title}</h3>
                      </div>
                      <span className="font-mono-num text-xs font-bold text-slate-200 whitespace-nowrap">
                        {pol.cost} pts
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-200">{pol.impact}</p>
                    <p className="mt-1 text-xs text-amber-200/80">
                      <strong>Trade-off:</strong> {pol.limitation}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!isSelected && !canPick}
                    onClick={() => handleTogglePolicy(pol.id, pol.cost)}
                    className={`mt-4 w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                        : canPick
                        ? 'border border-slate-600 bg-slate-800 text-white hover:border-amber-400'
                        : 'cursor-not-allowed bg-slate-900 text-slate-500'
                    }`}
                  >
                    {isSelected
                      ? 'Selected Priority (Remove)'
                      : selectedPolicies.length >= 4
                      ? '4 Priorities Selected'
                      : canPick
                      ? 'Select Priority'
                      : 'Over Budget'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-800 pt-4">
            <button
              type="button"
              disabled={selectedPolicies.length !== 4}
              onClick={() => {
                onPlaySubmitSfx();
                onSaveMission6Strategy(selectedPolicies, strategyEssay, 0);
                setPhase('challenges');
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                selectedPolicies.length === 4
                  ? 'bg-[#C81E2B] text-white hover:bg-[#B01824]'
                  : 'cursor-not-allowed bg-slate-800 text-slate-500'
              }`}
            >
              <span>Proceed to 2045 Stress Tests</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE ANALYTICAL CHALLENGE STAGE (ALL MISSIONS) */}
      {phase === 'challenges' && currentChallenge && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0F1E38] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="text-xs font-semibold text-amber-300">
              {currentChallenge.stageLabel} · {currentChallenge.bloomLevel}
            </div>
            <div className="flex items-center gap-1.5">
              {mission.challenges.map((ch, idx) => (
                <span
                  key={ch.id}
                  className={`h-2 w-6 rounded-full transition-colors ${
                    idx < challengeIdx
                      ? 'bg-emerald-400'
                      : idx === challengeIdx
                      ? 'bg-amber-400'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentChallenge.socialIssue && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-200">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
              <span>Identified Social Issue: {currentChallenge.socialIssue}</span>
            </div>
          )}

          {/* Mission 4 active project summary strip */}
          {mission.id === 4 && selectedProjects.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-700 bg-[#091326] px-4 py-2.5 text-xs text-slate-300">
              <Coins className="h-4 w-4 text-amber-300 shrink-0" aria-hidden="true" />
              <span>
                Your Funded Projects ({m4BudgetSpent}/100 UP):{' '}
                {selectedProjects
                  .map((id) => CONNECT_PROJECTS.find((p) => p.id === id)?.title)
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
          )}

          {/* Mission 6 active policy summary strip */}
          {mission.id === 6 && selectedPolicies.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-700 bg-[#091326] px-4 py-2.5 text-xs text-slate-300">
              <Layers className="h-4 w-4 text-amber-300 shrink-0" aria-hidden="true" />
              <span>
                Your 2045 Priorities:{' '}
                {selectedPolicies
                  .map((id) => POLICY_STRATEGIES_2045.find((p) => p.id === id)?.title)
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>
          )}

          <h2 className="mt-5 font-display text-xl font-bold text-white sm:text-2xl">
            {currentChallenge.title}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
            {currentChallenge.scenario}
          </p>

          <p className="mt-5 text-sm font-semibold text-amber-200 sm:text-base">
            {currentChallenge.questionPrompt}
          </p>

          {/* 4 Balanced Options */}
          <div className="mt-4 space-y-3">
            {currentChallenge.options.map((opt) => {
              const isSelected = selectedOption?.id === opt.id;
              const isDisabled = selectedOption !== null;

              let buttonStyle =
                'border-slate-700 bg-[#091326] text-slate-100 hover:border-amber-400/70 hover:bg-[#11223E]';
              if (isSelected) {
                buttonStyle =
                  opt.tier === 'optimal' || opt.tier === 'strong'
                    ? 'border-emerald-400 bg-emerald-950/40 text-white'
                    : opt.tier === 'partial'
                    ? 'border-amber-400 bg-amber-950/40 text-white'
                    : 'border-rose-400 bg-rose-950/40 text-white';
              } else if (isDisabled) {
                buttonStyle = 'border-slate-800 bg-[#091326]/60 text-slate-400 opacity-70';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleChooseOption(opt)}
                  className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${buttonStyle}`}
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 font-mono-num text-xs font-bold text-amber-300">
                    {opt.id}
                  </span>
                  <span className="text-sm leading-relaxed">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Decision Consequence Panel */}
          {selectedOption && (
            <ConsequencePanel
              selectedOption={selectedOption}
              conceptTerm={currentChallenge.conceptTerm}
              conceptExplanation={currentChallenge.conceptExplanation}
              learningTakeaway={currentChallenge.learningTakeaway}
              nextLabel={
                challengeIdx + 1 < mission.challenges.length
                  ? 'Next Challenge'
                  : mission.id === 6 && !isAlreadyCompleted
                  ? 'Proceed to Final Strategy Plan'
                  : isAlreadyCompleted
                  ? 'Return to Dashboard'
                  : 'Complete Mission'
              }
              onContinue={handleAdvanceChallenge}
            />
          )}
        </div>
      )}

      {/* MISSION 6 PHASE C: FINAL INTEGRATION STRATEGY EXPLANATION */}
      {mission.id === 6 && phase === 'final-strategy' && (
        <div className="mt-6 rounded-2xl border border-amber-500/50 bg-[#0F1E38] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-amber-300">
            <Globe2 className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wider">
              Final Policy Adviser Task · 10% of Final Score
            </span>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold text-white">
            Your 2045 National Integration Strategy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Design a strategy to strengthen national integration and explain why your choices are
            important for Indonesia’s future. Reference your 4 selected priorities and explain how
            they balance equality, digital literacy, cooperation, and respect for diversity.
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-amber-200">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              Selected Priorities:{' '}
              {selectedPolicies
                .map((id) => POLICY_STRATEGIES_2045.find((p) => p.id === id)?.title)
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>

          <form onSubmit={handleSubmitFinalStrategy} className="mt-5 space-y-4">
            <div>
              <label htmlFor="final-strategy-essay" className="block text-sm font-medium text-white">
                Strategic Explanation (aim for 3–5 clear sentences)
              </label>
              <textarea
                id="final-strategy-essay"
                rows={6}
                value={strategyEssay}
                onChange={(e) => {
                  setStrategyEssay(e.target.value);
                  setEssayError('');
                }}
                placeholder="Explain how your four chosen strategies connect Indonesia’s islands, reduce inequality, counter online polarization, and uphold Bhinneka Tunggal Ika for the 2045 generation..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-[#091326] p-4 text-sm leading-relaxed text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Tip: Use Social Studies terms like equality, Bhinneka Tunggal Ika, digital literacy,
                  and regional cooperation.
                </span>
                <span className="font-mono-num">
                  {strategyEssay.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>

            {essayError && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{essayError}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Submit Strategy & Complete Mission 6</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
