import {
  AchievementLevel,
  GameState,
  SkillCategory,
} from '../types/game';

export interface ScoreBreakdown {
  knowledgePct: number; // out of 25
  criticalThinkingPct: number; // out of 30
  decisionMakingPct: number; // out of 25
  cooperationPct: number; // out of 10
  strategyPct: number; // out of 10
  finalScore: number; // out of 100
  achievementLevel: AchievementLevel;
  strongestSkill: string;
  areaForImprovement: string;
  personalizedFeedback: string;
}

export function getAchievementLevel(score: number): AchievementLevel {
  if (score >= 90) return 'UNITY LEGEND';
  if (score >= 80) return 'UNITY CHAMPION';
  if (score >= 71) return 'UNITY ADVOCATE';
  if (score >= 61) return 'UNITY EXPLORER';
  return 'UNITY TRAINEE';
}

export function evaluateStrategyEssay(essay: string, selectedPoliciesCount: number): number {
  const trimmed = essay.trim();
  if (!trimmed) return 0;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lower = trimmed.toLowerCase();

  let score = 0;

  // Base effort & clarity (up to 4 pts)
  if (wordCount >= 40) score += 4;
  else if (wordCount >= 24) score += 3;
  else if (wordCount >= 12) score += 2;
  else score += 1;

  // Conceptual grounding in Social Studies terms (up to 4 pts)
  const conceptKeywords = [
    'diversity',
    'unity',
    'bhinneka',
    'pancasila',
    'equal',
    'equality',
    'education',
    'digital',
    'cooperation',
    'tolerance',
    'respect',
    'island',
    'region',
    'integration',
    'justice',
    'youth',
    'health',
    'transport',
    'culture',
    'future',
    '2045',
    'misinformation',
    'discrimination',
  ];
  const matched = conceptKeywords.filter((kw) => lower.includes(kw)).length;
  if (matched >= 5) score += 4;
  else if (matched >= 3) score += 3;
  else if (matched >= 1) score += 2;

  // Strategic reasoning connectors ("because", "therefore", "so that", "connect", "balance") (up to 2 pts)
  const reasoningMarkers = ['because', 'therefore', 'so that', 'in order to', 'however', 'while', 'together', 'balance'];
  const reasoningHits = reasoningMarkers.filter((m) => lower.includes(m)).length;
  if (reasoningHits >= 2 && selectedPoliciesCount === 4) score += 2;
  else if (reasoningHits >= 1 || selectedPoliciesCount === 4) score += 1;

  return Math.min(10, Math.max(0, score));
}

function averageCategoryRatio(state: GameState, category: SkillCategory): number {
  const entries = state.decisionLogs.filter((d) => d.skillCategory === category);
  if (entries.length === 0) return 0.7; // Neutral baseline before category is tested
  const sum = entries.reduce((acc, item) => acc + item.scoreRatio, 0);
  return sum / entries.length;
}

export function calculateScoreBreakdown(state: GameState): ScoreBreakdown {
  const kRatio = averageCategoryRatio(state, 'knowledge');
  const ctRatio = averageCategoryRatio(state, 'criticalThinking');
  const dmRatio = averageCategoryRatio(state, 'decisionMaking');
  const coopRatio = averageCategoryRatio(state, 'cooperation');

  // Incorporate Mission 4 & Mission 6 practical strategy quality mildly into Decision-Making & Cooperation
  const projectBonus = state.mission4SelectedProjects.length >= 3 ? 0.05 : 0;
  const strategyScore = state.mission6StrategyScore; // 0..10

  const knowledgePct = Math.round(Math.min(25, kRatio * 25));
  const criticalThinkingPct = Math.round(Math.min(30, ctRatio * 30));
  const decisionMakingPct = Math.round(Math.min(25, Math.min(1, dmRatio + projectBonus) * 25));
  const cooperationPct = Math.round(Math.min(10, coopRatio * 10));
  const strategyPct = Math.round(Math.min(10, strategyScore));

  const finalScore = Math.min(
    100,
    knowledgePct + criticalThinkingPct + decisionMakingPct + cooperationPct + strategyPct
  );

  const skillPairs = [
    { label: 'Knowledge & Cultural Understanding', ratio: knowledgePct / 25 },
    { label: 'Critical Thinking & Analysis', ratio: criticalThinkingPct / 30 },
    { label: 'Decision-Making & Problem-Solving', ratio: decisionMakingPct / 25 },
    { label: 'Cooperation & Negotiation', ratio: cooperationPct / 10 },
    { label: 'National Integration Strategy', ratio: strategyPct / 10 },
  ];

  const sortedHigh = [...skillPairs].sort((a, b) => b.ratio - a.ratio);
  const strongestSkill = sortedHigh[0].label;
  const weakest = sortedHigh[sortedHigh.length - 1];
  const areaForImprovement =
    weakest.ratio >= 0.88
      ? 'Continue sharpening long-term policy trade-offs across diverse regions'
      : weakest.label;

  const achievementLevel = getAchievementLevel(finalScore);

  let personalizedFeedback = '';
  if (finalScore >= 90) {
    personalizedFeedback = `Outstanding strategic leadership! You consistently looked beyond quick fixes to balance social justice, minority dignity, and national cooperation across Indonesia. Your strongest capability—${strongestSkill}—helped keep Unity (${state.unityScore}/100) and National Stability (${state.nationalStability}/100) resilient.`;
  } else if (finalScore >= 80) {
    personalizedFeedback = `Strong performance as a National Unity Task Force adviser. You demonstrated solid mastery of Bhinneka Tunggal Ika and interregional fairness, especially in ${strongestSkill}. Reviewing trade-offs in ${areaForImprovement} can elevate your strategy even further.`;
  } else if (finalScore >= 71) {
    personalizedFeedback = `Good progress toward understanding Indonesian national integration. You made thoughtful choices in ${strongestSkill}, though several complex dilemmas showed how tempting short-term fixes can overlook minority or outer-island needs. Focus next on ${areaForImprovement}.`;
  } else {
    personalizedFeedback = `You completed the mission briefing and gained foundational awareness of Indonesian diversity. Several decisions favored short-term convenience or single-group priorities over long-term fairness. Replaying key dilemmas and strengthening ${areaForImprovement} will sharpen your strategic judgment.`;
  }

  return {
    knowledgePct,
    criticalThinkingPct,
    decisionMakingPct,
    cooperationPct,
    strategyPct,
    finalScore,
    achievementLevel,
    strongestSkill,
    areaForImprovement,
    personalizedFeedback,
  };
}

export function clampMetric(val: number): number {
  return Math.max(0, Math.min(100, val));
}
