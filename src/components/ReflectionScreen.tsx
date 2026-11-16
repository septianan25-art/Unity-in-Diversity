import React, { useState } from 'react';
import { CheckCircle2, FileText, RotateCcw, Save } from 'lucide-react';
import { GameState, ReflectionAnswers } from '../types/game';

interface ReflectionScreenProps {
  gameState: GameState;
  onSaveReflection: (answers: ReflectionAnswers) => void;
  onBackToCertificate: () => void;
  onRestart: () => void;
}

const REFLECTION_QUESTIONS: Array<{
  key: keyof ReflectionAnswers;
  number: number;
  prompt: string;
  placeholder: string;
}> = [
  {
    key: 'learnedDiversity',
    number: 1,
    prompt: 'What did you learn about the diversity of Indonesian society?',
    placeholder: 'Reflect on how geography, history, trade, and traditions shaped Indonesian diversity...',
  },
  {
    key: 'challengingMission',
    number: 2,
    prompt: 'Which mission challenged your thinking the most?',
    placeholder: 'Explain which scenario or trade-off made you reconsider your first choice and why...',
  },
  {
    key: 'whyIntegrationMatters',
    number: 3,
    prompt: 'Why is national integration important for Indonesia?',
    placeholder: 'Connect social harmony, equal development, and Bhinneka Tunggal Ika to Indonesia’s stability...',
  },
  {
    key: 'youthAction',
    number: 4,
    prompt: 'What can young people do to maintain national unity?',
    placeholder: 'Describe concrete actions Grade 9 students can take at school, in communities, and online...',
  },
  {
    key: 'playAgainChange',
    number: 5,
    prompt: 'What would you do differently if you played this game again?',
    placeholder: 'Share how you would adjust your budget priorities, negotiation compromises, or crisis responses...',
  },
];

export const ReflectionScreen: React.FC<ReflectionScreenProps> = ({
  gameState,
  onSaveReflection,
  onBackToCertificate,
  onRestart,
}) => {
  const [answers, setAnswers] = useState<ReflectionAnswers>(gameState.reflection);
  const [savedNotice, setSavedNotice] = useState(false);

  const completedCount = Object.values(answers).filter((v) => v.trim().length > 0).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection(answers);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handleDownloadSummary = () => {
    onSaveReflection(answers);
    const lines = [
      'INDONESIA: THE UNITY MISSION — STUDENT LEARNING REFLECTION',
      `Student: ${gameState.profile?.fullName ?? 'Student'}`,
      `Class: ${gameState.profile?.className ?? '-'}${gameState.profile?.groupName ? ` · ${gameState.profile.groupName}` : ''}`,
      `Date: ${gameState.completionDate ?? new Date().toLocaleDateString()}`,
      '',
      ...REFLECTION_QUESTIONS.flatMap((q) => [
        `${q.number}. ${q.prompt}`,
        answers[q.key].trim() || '(No response entered)',
        '',
      ]),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `unity-mission-reflection-${(gameState.profile?.fullName || 'student').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-slate-800 bg-[#0F1E38] p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <p className="text-xs font-semibold tracking-wider text-amber-300">
              Post-Mission Social Studies Reflection
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              Final Learning Reflection
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Completed {completedCount} of 5 reflections · {gameState.profile?.fullName}
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToCertificate}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-amber-400 transition-colors"
          >
            Back to Certificate
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {REFLECTION_QUESTIONS.map((q) => (
            <div key={q.key} className="rounded-xl border border-slate-800 bg-[#091326] p-5">
              <label htmlFor={`ref-${q.key}`} className="block text-sm font-semibold text-white">
                {q.number}. {q.prompt}
              </label>
              <textarea
                id={`ref-${q.key}`}
                rows={3}
                value={answers[q.key]}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [q.key]: e.target.value,
                  }))
                }
                placeholder={q.placeholder}
                className="mt-2.5 w-full rounded-xl border border-slate-700 bg-[#071020] p-3.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          ))}

          {savedNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Your reflection answers have been saved for this session.</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-xs font-semibold text-slate-200 hover:border-rose-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Play Again (New Session)</span>
            </button>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDownloadSummary}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-500/10 px-5 py-3 text-xs font-semibold text-amber-200 hover:bg-amber-500/20 transition-colors"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>Download Reflection (.txt)</span>
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                <span>Save Reflections</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
