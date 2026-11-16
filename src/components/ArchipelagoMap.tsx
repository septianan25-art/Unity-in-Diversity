import React from 'react';
import { MissionDefinition, MissionId } from '../types/game';

interface ArchipelagoMapProps {
  missions: MissionDefinition[];
  completedMissions: MissionId[];
  activeMissionId?: MissionId;
  onSelectMission?: (id: MissionId) => void;
  highlightedConnections?: string[]; // Used in Mission 4 for visual sea/digital corridors
  compact?: boolean;
}

const ISLAND_HUBS: Record<string, { x: number; y: number; label: string }> = {
  sumatra: { x: 175, y: 175, label: 'Sumatra' },
  java: { x: 350, y: 295, label: 'Java' },
  bali: { x: 445, y: 310, label: 'Bali' },
  nusa: { x: 545, y: 315, label: 'Nusa Tenggara' },
  kalimantan: { x: 405, y: 155, label: 'Kalimantan' },
  sulawesi: { x: 550, y: 170, label: 'Sulawesi' },
  maluku: { x: 655, y: 195, label: 'Maluku' },
  papua: { x: 775, y: 215, label: 'Papua' },
};

const CONNECTION_ARCS: Array<[string, string]> = [
  ['sumatra', 'java'],
  ['java', 'kalimantan'],
  ['java', 'bali'],
  ['bali', 'nusa'],
  ['kalimantan', 'sulawesi'],
  ['sulawesi', 'maluku'],
  ['maluku', 'papua'],
  ['nusa', 'papua'],
  ['sumatra', 'kalimantan'],
];

export const ArchipelagoMap: React.FC<ArchipelagoMapProps> = ({
  missions,
  completedMissions,
  activeMissionId,
  onSelectMission,
  highlightedConnections = [],
  compact = false,
}) => {
  const highestUnlocked = Math.min(6, completedMissions.length + 1) as MissionId;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-700/70 bg-[#071224] p-3 md:p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <span className="font-semibold tracking-wide text-amber-300">
          Indonesian Archipelago Strategic Map
        </span>
        <span className="text-slate-400">
          Sabang to Merauke · {completedMissions.length}/6 Sectors Secured
        </span>
      </div>

      <svg
        viewBox="0 0 900 380"
        className={`w-full ${compact ? 'max-h-[250px]' : 'max-h-[340px]'} select-none`}
        role="img"
        aria-label="Interactive map of the Indonesian archipelago showing six Unity Mission locations"
      >
        <defs>
          <radialGradient id="oceanGlow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#13294B" />
            <stop offset="100%" stopColor="#071224" />
          </radialGradient>
          <linearGradient id="islandFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#26456E" />
            <stop offset="100%" stopColor="#1B3254" />
          </linearGradient>
          <linearGradient id="islandActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#355D91" />
            <stop offset="100%" stopColor="#23426B" />
          </linearGradient>
        </defs>

        {/* Ocean Background & Cartographic Grid */}
        <rect width="900" height="380" rx="10" fill="url(#oceanGlow)" />
        <g stroke="#1E3A5F" strokeWidth="0.7" strokeDasharray="3 5" opacity="0.55">
          <line x1="0" y1="95" x2="900" y2="95" />
          <line x1="0" y1="190" x2="900" y2="190" />
          <line x1="0" y1="285" x2="900" y2="285" />
          <line x1="180" y1="0" x2="180" y2="380" />
          <line x1="360" y1="0" x2="360" y2="380" />
          <line x1="540" y1="0" x2="540" y2="380" />
          <line x1="720" y1="0" x2="720" y2="380" />
        </g>

        {/* Stylized Geographic Silhouettes of Indonesia */}
        <g stroke="#4E73A3" strokeWidth="1.4" fill="url(#islandFill)">
          {/* Sumatra */}
          <path d="M90,92 L122,95 L155,130 L195,168 L235,212 L262,250 L248,268 L215,245 L170,198 L128,155 L86,112 Z" />
          {/* Java */}
          <path d="M268,284 L318,286 L368,292 L418,296 L422,312 L370,313 L310,308 L266,298 Z" />
          {/* Bali & Nusa Tenggara Chain */}
          <path d="M432,299 L458,300 L458,314 L432,313 Z" />
          <path d="M468,303 L512,302 L512,316 L470,315 Z" />
          <path d="M524,306 L588,300 L592,317 L526,320 Z" />
          <path d="M598,310 L628,304 L630,318 L600,320 Z" />
          {/* Kalimantan */}
          <path d="M336,120 L382,92 L438,88 L466,118 L452,162 L444,210 L404,225 L356,220 L330,188 Z" />
          {/* Sulawesi */}
          <path d="M506,128 L558,118 L592,130 L580,148 L545,148 L545,176 L578,195 L566,214 L540,196 L536,238 L514,242 L510,198 L496,174 Z" />
          {/* Maluku Islands */}
          <path d="M628,136 L652,132 L656,158 L636,164 Z" />
          <path d="M636,188 L676,184 L678,202 L640,204 Z" />
          {/* Papua */}
          <path d="M706,165 L754,174 L816,185 L846,204 L848,266 L810,256 L775,232 L738,215 L698,192 Z" />
        </g>

        {/* Maritime & Strategic Connection Lines */}
        {CONNECTION_ARCS.map(([fromId, toId]) => {
          const a = ISLAND_HUBS[fromId];
          const b = ISLAND_HUBS[toId];
          if (!a || !b) return null;
          const isHighlighted =
            highlightedConnections.includes(fromId) && highlightedConnections.includes(toId);
          const midX = (a.x + b.x) / 2;
          const midY = Math.min(a.y, b.y) - 18;

          return (
            <path
              key={`${fromId}-${toId}`}
              d={`M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`}
              fill="none"
              stroke={isHighlighted ? '#F5C451' : '#2D4D77'}
              strokeWidth={isHighlighted ? 2.5 : 1.1}
              strokeDasharray={isHighlighted ? 'none' : '4 4'}
              opacity={isHighlighted ? 0.95 : 0.45}
            />
          );
        })}

        {/* Island Region Labels */}
        <g fill="#94A3B8" fontSize="10.5" fontWeight="500" textAnchor="middle">
          <text x="165" y="218">Sumatra</text>
          <text x="342" y="328">Java</text>
          <text x="402" y="242">Kalimantan</text>
          <text x="546" y="260">Sulawesi</text>
          <text x="545" y="338">Bali & Nusa Tenggara</text>
          <text x="656" y="222">Maluku</text>
          <text x="790" y="282">Papua</text>
        </g>

        {/* Mission Nodes */}
        {missions.map((mission) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isUnlocked = mission.id <= highestUnlocked || isCompleted;
          const isCurrent = activeMissionId === mission.id;

          let fill = '#1E293B';
          let stroke = '#64748B';
          if (isCompleted) {
            fill = '#059669';
            stroke = '#A7F3D0';
          } else if (isCurrent) {
            fill = '#C81E2B';
            stroke = '#F5C451';
          } else if (isUnlocked) {
            fill = '#D9A426';
            stroke = '#FEF3C7';
          }

          return (
            <g
              key={mission.id}
              transform={`translate(${mission.mapCoords.x}, ${mission.mapCoords.y})`}
              onClick={() => isUnlocked && onSelectMission?.(mission.id)}
              className={isUnlocked && onSelectMission ? 'cursor-pointer' : 'cursor-default'}
            >
              {isUnlocked && !isCompleted && (
                <circle r="19" fill={fill} opacity="0.22" />
              )}
              <circle r="13" fill={fill} stroke={stroke} strokeWidth="2.2" />
              <text
                y="4"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="700"
                className="font-mono-num"
              >
                {isCompleted ? '✓' : mission.id}
              </text>
              <g transform="translate(0, -22)">
                <rect
                  x="-58"
                  y="-12"
                  width="116"
                  height="18"
                  rx="4"
                  fill="#091326"
                  fillOpacity="0.88"
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                <text
                  y="0"
                  textAnchor="middle"
                  fill={isUnlocked ? '#F8FAFC' : '#94A3B8'}
                  fontSize="9.5"
                  fontWeight="600"
                >
                  {mission.id}. {mission.title.replace('The ', '').slice(0, 17)}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
