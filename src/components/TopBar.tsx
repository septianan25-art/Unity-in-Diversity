import React from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { ScreenId } from '../types/game';

interface TopBarProps {
  currentScreen: ScreenId;
  hasProfile: boolean;
  allCompleted: boolean;
  onNavigate: (screen: ScreenId) => void;
  onRestart: () => void;
  audioSettings: {
    musicEnabled: boolean;
    sfxEnabled: boolean;
    muted: boolean;
    volume: number;
  };
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onToggleMute: () => void;
  onVolumeChange: (val: number) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentScreen,
  hasProfile,
  allCompleted,
  onNavigate,
  onRestart,
  audioSettings,
  onToggleMusic,
  onToggleSfx,
  onToggleMute,
  onVolumeChange,
}) => {
  return (
    <div className="no-print border-b border-slate-800/90 bg-[#081122]/95 backdrop-blur-sm">
      {/* Strict 3-Zone Top Bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate(hasProfile ? 'dashboard' : 'welcome')}
          className="font-display text-left text-base font-bold tracking-tight text-slate-50 whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 rounded"
        >
          Indonesia: The Unity Mission
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          {hasProfile && (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 ${
                currentScreen === 'dashboard' ? 'text-amber-300 underline' : ''
              }`}
            >
              Dashboard
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('instructions')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 ${
              currentScreen === 'instructions' ? 'text-amber-300 underline' : ''
            }`}
          >
            Instructions
          </button>
          {hasProfile && (
            <button
              type="button"
              onClick={() => onNavigate('achievements')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 ${
                currentScreen === 'achievements' ? 'text-amber-300 underline' : ''
              }`}
            >
              Achievements
            </button>
          )}
          {allCompleted && (
            <button
              type="button"
              onClick={() => onNavigate('certificate')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white hover:underline underline-offset-4 ${
                currentScreen === 'certificate' ? 'text-amber-300 underline' : ''
              }`}
            >
              Certificate
            </button>
          )}
        </nav>

        <div className="flex items-center shrink-0">
          {hasProfile ? (
            <button
              type="button"
              onClick={onRestart}
              className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-100 whitespace-nowrap shrink-0 transition-colors hover:border-amber-400/60 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              Restart Game
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="rounded-lg bg-[#C81E2B] px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-[#B01824] focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              Start Mission
            </button>
          )}
        </div>
      </header>

      {/* Compact Workspace Audio & Quick Mobile Nav Toolbar */}
      <div className="border-t border-slate-800/60 bg-[#0A162B]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <div className="flex items-center gap-2 md:hidden overflow-x-auto">
            {hasProfile && (
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap shrink-0 ${
                  currentScreen === 'dashboard' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
                }`}
              >
                Dashboard
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('instructions')}
              className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap shrink-0 ${
                currentScreen === 'instructions' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
              }`}
            >
              Instructions
            </button>
            {hasProfile && (
              <button
                type="button"
                onClick={() => onNavigate('achievements')}
                className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap shrink-0 ${
                  currentScreen === 'achievements' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
                }`}
              >
                Achievements
              </button>
            )}
            {allCompleted && (
              <button
                type="button"
                onClick={() => onNavigate('certificate')}
                className={`px-2.5 py-1.5 rounded font-medium whitespace-nowrap shrink-0 ${
                  currentScreen === 'certificate' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-300'
                }`}
              >
                Certificate
              </button>
            )}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onToggleMusic}
              aria-pressed={audioSettings.musicEnabled}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-medium whitespace-nowrap shrink-0 transition-colors ${
                audioSettings.musicEnabled && !audioSettings.muted
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-200'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Music className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Music: {audioSettings.musicEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleSfx}
              aria-pressed={audioSettings.sfxEnabled}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-medium whitespace-nowrap shrink-0 transition-colors ${
                audioSettings.sfxEnabled && !audioSettings.muted
                  ? 'border-sky-500/40 bg-sky-500/15 text-sky-200'
                  : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>SFX: {audioSettings.sfxEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <label className="flex items-center gap-2 text-slate-300 whitespace-nowrap shrink-0">
              <span className="sr-only">Master Volume</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(audioSettings.volume * 100)}
                onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
                className="h-1.5 w-20 cursor-pointer accent-amber-400"
                aria-label="Audio volume"
              />
              <span className="font-mono-num text-[11px] text-slate-400 w-8">
                {Math.round(audioSettings.volume * 100)}%
              </span>
            </label>

            <button
              type="button"
              onClick={onToggleMute}
              aria-pressed={audioSettings.muted}
              className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 font-medium whitespace-nowrap shrink-0 transition-colors ${
                audioSettings.muted
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-200'
                  : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500'
              }`}
            >
              {audioSettings.muted ? (
                <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{audioSettings.muted ? 'Muted' : 'Mute'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
