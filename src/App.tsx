import { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import { soundEngine } from './audio/soundEngine';
import { CertificateScreen } from './components/CertificateScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { MissionPlayer } from './components/MissionPlayer';
import { ProfileScreen } from './components/ProfileScreen';
import { RandomEventModal } from './components/RandomEventModal';
import { ReflectionScreen } from './components/ReflectionScreen';
import { ResultsDashboard } from './components/ResultsDashboard';
import { TopBar } from './components/TopBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BADGE_DEFINITIONS, MISSIONS, RANDOM_EVENTS } from './data/missionsData';
import {
  DecisionLogEntry,
  DecisionOption,
  GameState,
  MissionId,
  ReflectionAnswers,
  ScreenId,
  StudentProfile,
} from './types/game';
import { calculateScoreBreakdown, clampMetric } from './utils/scoring';

const SESSION_KEY = 'indonesia_unity_mission_state_v1';

const INITIAL_REFLECTION: ReflectionAnswers = {
  learnedDiversity: '',
  challengingMission: '',
  whyIntegrationMatters: '',
  youthAction: '',
  playAgainChange: '',
};

function createInitialState(): GameState {
  return {
    profile: null,
    currentScreen: 'welcome',
    unityScore: 70,
    knowledgePoints: 0,
    nationalStability: 70,
    completedMissions: [],
    activeMissionId: 1,
    mission4SelectedProjects: [],
    mission6SelectedPolicies: [],
    mission6StrategyEssay: '',
    mission6StrategyScore: 0,
    decisionLogs: [],
    seenRandomEvents: [],
    activeRandomEventId: null,
    unlockedBadges: [],
    completionDate: null,
    reflection: { ...INITIAL_REFLECTION },
  };
}

function loadSessionState(): GameState {
  if (typeof window === 'undefined') return createInitialState();
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed || typeof parsed.unityScore !== 'number') return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
}

function evaluateUnlockedBadges(state: GameState): string[] {
  const badges = new Set<string>(state.unlockedBadges);

  if (state.completedMissions.includes(1)) {
    const m1Logs = state.decisionLogs.filter((l) => l.missionId === 1);
    const avg = m1Logs.length
      ? m1Logs.reduce((a, b) => a + b.scoreRatio, 0) / m1Logs.length
      : 0;
    if (avg >= 0.65) badges.add('badge-scholar');
  }

  if (state.completedMissions.includes(2) && state.unityScore >= 72) {
    badges.add('badge-bhinneka');
  }

  if (state.completedMissions.includes(3) && state.nationalStability >= 70) {
    badges.add('badge-mediator');
  }

  if (state.completedMissions.includes(4) && state.mission4SelectedProjects.length >= 3) {
    badges.add('badge-bridge');
  }

  if (state.completedMissions.includes(5)) {
    badges.add('badge-negotiator');
  }

  if (
    state.completedMissions.includes(6) &&
    state.mission6SelectedPolicies.length === 4 &&
    state.mission6StrategyEssay.trim().length > 0
  ) {
    badges.add('badge-2045');
  }

  const strongEvents = state.decisionLogs.filter(
    (l) => l.missionId === 'event' && l.scoreRatio >= 0.7
  ).length;
  if (strongEvents >= 2) {
    badges.add('badge-responder');
  }

  if (state.completedMissions.length === 6) {
    const final = calculateScoreBreakdown(state).finalScore;
    if (final >= 80) {
      badges.add('badge-exemplar');
    }
  }

  return Array.from(badges);
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => loadSessionState());
  const [audioSettings, setAudioSettings] = useState(() => soundEngine.getSettings());
  const [badgeToast, setBadgeToast] = useState<string | null>(null);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(gameState));
    } catch {
      // Ignore storage quota errors
    }
  }, [gameState]);

  const showNewBadgeToastIfNeeded = (prevBadges: string[], nextBadges: string[]) => {
    const newlyUnlocked = nextBadges.find((b) => !prevBadges.includes(b));
    if (newlyUnlocked) {
      const def = BADGE_DEFINITIONS.find((d) => d.id === newlyUnlocked);
      if (def) {
        soundEngine.playBadgeUnlocked();
        setBadgeToast(def.title);
        setTimeout(() => setBadgeToast(null), 4500);
      }
    }
  };

  const navigate = (screen: ScreenId) => {
    soundEngine.unlockAudio();
    setGameState((prev) => ({ ...prev, currentScreen: screen }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitProfile = (profile: StudentProfile) => {
    soundEngine.unlockAudio();
    soundEngine.playMissionStart();
    setGameState((prev) => ({
      ...prev,
      profile,
      currentScreen: 'dashboard',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMission = (missionId: MissionId) => {
    soundEngine.unlockAudio();
    soundEngine.playMissionStart();
    setGameState((prev) => ({
      ...prev,
      activeMissionId: missionId,
      currentScreen: 'mission',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordDecision = (entry: DecisionLogEntry) => {
    setGameState((prev) => {
      // Prevent duplicate logs if same challengeId exists
      const filtered = prev.decisionLogs.filter((d) => d.challengeId !== entry.challengeId);
      const nextLogs = [...filtered, entry];
      const nextState: GameState = {
        ...prev,
        unityScore: clampMetric(prev.unityScore + entry.unityDelta),
        nationalStability: clampMetric(prev.nationalStability + entry.stabilityDelta),
        knowledgePoints: prev.knowledgePoints + entry.knowledgePoints,
        decisionLogs: nextLogs,
      };
      return nextState;
    });
  };

  const handleCompleteMission = (missionId: MissionId) => {
    setGameState((prev) => {
      const completed = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : ([...prev.completedMissions, missionId] as MissionId[]);

      const tempState: GameState = {
        ...prev,
        completedMissions: completed,
      };
      const updatedBadges = evaluateUnlockedBadges(tempState);
      showNewBadgeToastIfNeeded(prev.unlockedBadges, updatedBadges);

      // Final mission completed
      if (completed.length === 6 && missionId === 6) {
        soundEngine.playFinalVictory();
        const dateStr =
          prev.completionDate ||
          new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        return {
          ...tempState,
          unlockedBadges: updatedBadges,
          completionDate: dateStr,
          currentScreen: 'results',
        };
      }

      // Trigger an unexpected Random Event after Missions 1, 3, and 5
      const shouldTriggerEvent = [1, 3, 5].includes(missionId);
      if (shouldTriggerEvent) {
        const unseen = RANDOM_EVENTS.filter((ev) => !prev.seenRandomEvents.includes(ev.id));
        if (unseen.length > 0) {
          const picked = unseen[Math.floor(Math.random() * unseen.length)];
          soundEngine.playCrisisAlert();
          return {
            ...tempState,
            unlockedBadges: updatedBadges,
            seenRandomEvents: [...prev.seenRandomEvents, picked.id],
            activeRandomEventId: picked.id,
            currentScreen: 'random-event',
          };
        }
      }

      return {
        ...tempState,
        unlockedBadges: updatedBadges,
        currentScreen: 'dashboard',
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRandomEventOption = (opt: DecisionOption) => {
    if (!gameState.activeRandomEventId) return;
    handleRecordDecision({
      challengeId: gameState.activeRandomEventId,
      missionId: 'event',
      selectedOptionId: opt.id,
      tier: opt.tier,
      scoreRatio: opt.scoreRatio,
      skillCategory: 'decisionMaking',
      unityDelta: opt.unityDelta,
      stabilityDelta: opt.stabilityDelta,
      knowledgePoints: opt.knowledgePoints,
    });
  };

  const handleCompleteRandomEvent = () => {
    setGameState((prev) => {
      const updatedBadges = evaluateUnlockedBadges(prev);
      showNewBadgeToastIfNeeded(prev.unlockedBadges, updatedBadges);
      return {
        ...prev,
        unlockedBadges: updatedBadges,
        activeRandomEventId: null,
        currentScreen: 'dashboard',
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmRestart = () => {
    setShowRestartConfirm(false);
    const fresh = createInitialState();
    setGameState(fresh);
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOutcomeSfx = (tier: DecisionOption['tier']) => {
    if (tier === 'optimal' || tier === 'strong') {
      soundEngine.playChallengeSuccess();
    } else {
      soundEngine.playChallengeReflective();
    }
  };

  const activeMission =
    MISSIONS.find((m) => m.id === gameState.activeMissionId) ?? MISSIONS[0];

  const activeRandomEvent =
    RANDOM_EVENTS.find((ev) => ev.id === gameState.activeRandomEventId) ?? null;

  return (
    <div
      className="min-h-screen bg-[#091326] text-slate-100 flex flex-col"
      onClick={() => soundEngine.unlockAudio()}
    >
      <TopBar
        currentScreen={gameState.currentScreen}
        hasProfile={Boolean(gameState.profile)}
        allCompleted={gameState.completedMissions.length === 6}
        onNavigate={navigate}
        onRestart={() => setShowRestartConfirm(true)}
        audioSettings={audioSettings}
        onToggleMusic={() => {
          soundEngine.unlockAudio();
          soundEngine.setMusicEnabled(!audioSettings.musicEnabled);
          setAudioSettings(soundEngine.getSettings());
        }}
        onToggleSfx={() => {
          soundEngine.unlockAudio();
          soundEngine.setSfxEnabled(!audioSettings.sfxEnabled);
          setAudioSettings(soundEngine.getSettings());
        }}
        onToggleMute={() => {
          soundEngine.unlockAudio();
          soundEngine.setMuted(!audioSettings.muted);
          setAudioSettings(soundEngine.getSettings());
        }}
        onVolumeChange={(val) => {
          soundEngine.unlockAudio();
          soundEngine.setVolume(val);
          setAudioSettings(soundEngine.getSettings());
        }}
      />

      <main className="flex-1">
        {gameState.currentScreen === 'welcome' && (
          <WelcomeScreen
            onStart={() => navigate(gameState.profile ? 'dashboard' : 'profile')}
            onViewInstructions={() => navigate('instructions')}
          />
        )}

        {gameState.currentScreen === 'profile' && (
          <ProfileScreen
            initialProfile={gameState.profile}
            onSubmitProfile={handleSubmitProfile}
            onBack={() => navigate('welcome')}
          />
        )}

        {gameState.currentScreen === 'instructions' && (
          <InstructionsScreen
            hasProfile={Boolean(gameState.profile)}
            onContinue={() => navigate(gameState.profile ? 'dashboard' : 'profile')}
          />
        )}

        {gameState.currentScreen === 'dashboard' && gameState.profile && (
          <DashboardScreen
            gameState={gameState}
            missions={MISSIONS}
            onStartMission={handleStartMission}
            onViewResults={() => navigate('results')}
            onViewCertificate={() => navigate('certificate')}
          />
        )}

        {gameState.currentScreen === 'mission' && gameState.profile && (
          <MissionPlayer
            key={`mission-${activeMission.id}`}
            mission={activeMission}
            allMissions={MISSIONS}
            completedMissions={gameState.completedMissions}
            savedM4Projects={gameState.mission4SelectedProjects}
            savedM6Policies={gameState.mission6SelectedPolicies}
            savedM6Essay={gameState.mission6StrategyEssay}
            onRecordDecision={handleRecordDecision}
            onSaveMission4Projects={(projectIds) =>
              setGameState((prev) => ({
                ...prev,
                mission4SelectedProjects: projectIds,
              }))
            }
            onSaveMission6Strategy={(policyIds, essay, score) =>
              setGameState((prev) => ({
                ...prev,
                mission6SelectedPolicies: policyIds,
                mission6StrategyEssay: essay,
                mission6StrategyScore: score,
              }))
            }
            onCompleteMission={handleCompleteMission}
            onBackToDashboard={() => navigate('dashboard')}
            onPlaySubmitSfx={() => soundEngine.playDecisionSubmit()}
            onPlayOutcomeSfx={handleOutcomeSfx}
          />
        )}

        {gameState.currentScreen === 'random-event' && activeRandomEvent && (
          <RandomEventModal
            key={activeRandomEvent.id}
            event={activeRandomEvent}
            onSelectOption={handleSelectRandomEventOption}
            onCompleteEvent={handleCompleteRandomEvent}
            onPlaySubmitSfx={() => soundEngine.playDecisionSubmit()}
            onPlayOutcomeSfx={handleOutcomeSfx}
          />
        )}

        {(gameState.currentScreen === 'results' ||
          gameState.currentScreen === 'achievements') &&
          gameState.profile && (
            <ResultsDashboard
              mode={gameState.currentScreen === 'achievements' ? 'achievements' : 'results'}
              gameState={gameState}
              onOpenCertificate={() => navigate('certificate')}
              onOpenReflection={() => navigate('reflection')}
              onBackToDashboard={() => navigate('dashboard')}
              onRestart={() => setShowRestartConfirm(true)}
            />
          )}

        {gameState.currentScreen === 'certificate' && (
          <CertificateScreen
            gameState={gameState}
            onProceedToReflection={() => navigate('reflection')}
            onBackToDashboard={() => navigate('dashboard')}
          />
        )}

        {gameState.currentScreen === 'reflection' && (
          <ReflectionScreen
            gameState={gameState}
            onSaveReflection={(reflection) =>
              setGameState((prev) => ({ ...prev, reflection }))
            }
            onBackToCertificate={() => navigate('certificate')}
            onRestart={() => setShowRestartConfirm(true)}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="no-print border-t border-slate-800/80 bg-[#071020] py-4 text-center text-xs text-slate-400">
        Indonesia: The Unity Mission · Social Studies Grade 9 · “Different Cultures. Shared Identity. One Nation.”
      </footer>

      {/* Achievement Unlocked Notification Toast */}
      {badgeToast && (
        <div
          role="status"
          className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-amber-400/60 bg-[#102442] px-4 py-3 shadow-2xl"
        >
          <Award className="h-5 w-5 text-amber-300 shrink-0" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Achievement Unlocked
            </p>
            <p className="text-sm font-semibold text-white">{badgeToast}</p>
          </div>
          <button
            type="button"
            onClick={() => setBadgeToast(null)}
            aria-label="Close notification"
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Custom In-App Restart Confirmation Modal (Never window.confirm) */}
      {showRestartConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="restart-modal-title"
          className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0F1E38] p-6 shadow-2xl">
            <h2 id="restart-modal-title" className="font-display text-xl font-bold text-white">
              Restart Mission Session?
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Starting a new session will reset your current Unity Score, Knowledge Points, mission
              progress, and profile details.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
                className="rounded-xl border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-slate-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestart}
                className="rounded-xl bg-[#C81E2B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#B01824] transition-colors"
              >
                Yes, Restart Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
