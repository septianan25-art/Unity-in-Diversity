export type ScreenId =
  | 'welcome'
  | 'profile'
  | 'instructions'
  | 'dashboard'
  | 'mission'
  | 'random-event'
  | 'results'
  | 'achievements'
  | 'certificate'
  | 'reflection';

export type MissionId = 1 | 2 | 3 | 4 | 5 | 6;

export type SkillCategory =
  | 'knowledge'
  | 'criticalThinking'
  | 'decisionMaking'
  | 'cooperation';

export type AchievementLevel =
  | 'UNITY LEGEND'
  | 'UNITY CHAMPION'
  | 'UNITY ADVOCATE'
  | 'UNITY EXPLORER'
  | 'UNITY TRAINEE';

export type DecisionTier = 'optimal' | 'strong' | 'partial' | 'weak';

export interface StudentProfile {
  fullName: string;
  className: string;
  groupName: string;
  startedAt: string;
}

export interface DecisionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  tier: DecisionTier;
  scoreRatio: number; // 1.0, 0.72, 0.45, 0.20
  unityDelta: number;
  stabilityDelta: number;
  knowledgePoints: number;
  consequenceTitle: string;
  consequenceSummary: string;
  advantages: string;
  limitations: string;
}

export interface ChallengeItem {
  id: string;
  missionId: MissionId;
  stageLabel: string;
  bloomLevel: 'C2 Understanding' | 'C3 Applying' | 'C4 Analyzing' | 'C5 Evaluating';
  skillCategory: SkillCategory;
  title: string;
  scenario: string;
  socialIssue?: string;
  questionPrompt: string;
  conceptTerm: string;
  conceptExplanation: string;
  learningTakeaway: string;
  options: DecisionOption[];
}

export interface CulturalRegionCard {
  id: string;
  regionName: string;
  island: string;
  ethnicGroup: string;
  traditionalHouse: string;
  tradition: string;
  geographicFactor: string;
  culturalConnection: string;
}

export interface ConnectProject {
  id: string;
  title: string;
  cost: number;
  regionIds: string[];
  category: 'Transport' | 'Digital' | 'Education' | 'Economy' | 'Culture' | 'Health';
  shortTermBenefit: string;
  longTermBenefit: string;
  limitation: string;
  integrationImpact: number;
}

export interface RegionalTeam {
  id: string;
  name: string;
  provinceSample: string;
  resources: string;
  economicCondition: string;
  geographicChallenge: string;
  priorityNeeds: string;
}

export interface PolicyStrategy {
  id: string;
  title: string;
  cost: number;
  pillar: string;
  impact: string;
  limitation: string;
  synergyWith: string[];
}

export interface RandomEventItem {
  id: string;
  title: string;
  region: string;
  urgency: string;
  scenario: string;
  conceptTerm: string;
  conceptExplanation: string;
  learningTakeaway: string;
  options: DecisionOption[];
}

export interface MissionDefinition {
  id: MissionId;
  title: string;
  subtitle: string;
  regionLabel: string;
  mapCoords: { x: number; y: number };
  learningObjective: string;
  briefing: string;
  imagePath: string;
  challenges: ChallengeItem[];
}

export interface DecisionLogEntry {
  challengeId: string;
  missionId: MissionId | 'event';
  selectedOptionId: 'A' | 'B' | 'C' | 'D';
  tier: DecisionTier;
  scoreRatio: number;
  skillCategory: SkillCategory;
  unityDelta: number;
  stabilityDelta: number;
  knowledgePoints: number;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  criteriaText: string;
}

export interface ReflectionAnswers {
  learnedDiversity: string;
  challengingMission: string;
  whyIntegrationMatters: string;
  youthAction: string;
  playAgainChange: string;
}

export interface GameState {
  profile: StudentProfile | null;
  currentScreen: ScreenId;
  unityScore: number;
  knowledgePoints: number;
  nationalStability: number;
  completedMissions: MissionId[];
  activeMissionId: MissionId;
  mission4SelectedProjects: string[];
  mission6SelectedPolicies: string[];
  mission6StrategyEssay: string;
  mission6StrategyScore: number; // 0 to 10
  decisionLogs: DecisionLogEntry[];
  seenRandomEvents: string[];
  activeRandomEventId: string | null;
  unlockedBadges: string[];
  completionDate: string | null;
  reflection: ReflectionAnswers;
}
