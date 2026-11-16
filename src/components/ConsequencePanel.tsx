import React from 'react';
import { AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { DecisionOption } from '../types/game';

interface ConsequencePanelProps {
  selectedOption: DecisionOption;
  conceptTerm: string;
  conceptExplanation: string;
  learningTakeaway: string;
  nextLabel: string;
  onContinue: () => void;
}

export const ConsequencePanel: React.FC<ConsequencePanelProps> = ({
  selectedOption,
  conceptTerm,
  conceptExplanation,
  learningTakeaway,
  nextLabel,
  onContinue,
}) => {
  const tierStyles = {
    optimal: {
      border: 'border-emerald-500/50 bg-emerald-950/30',
      labelColor: 'text-emerald-300',
      labelText: 'Optimal & Inclusive Decision',
      Icon: CheckCircle2,
    },
    strong: {
      border: 'border-sky-500/50 bg-sky-950/30',
      labelColor: 'text-sky-300',
      labelText: 'Effective With Minor Trade-Offs',
      Icon: CheckCircle2,
    },
    partial: {
      border: 'border-amber-500/50 bg-amber-950/30',
      labelColor: 'text-amber-300',
      labelText: 'Partial Impact · Significant Limitations',
      Icon: Info,
    },
    weak: {
      border: 'border-rose-500/50 bg-rose-950/30',
      labelColor: 'text-rose-300',
      labelText: 'Weak Long-Term Integration Impact',
      Icon: AlertTriangle,
    },
  }[selectedOption.tier];

  const TierIcon = tierStyles.Icon;

  const formatDelta = (val: number) => (val > 0 ? `+${val}` : `${val}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-6 space-y-5"
    >
      {/* Consequence Outcome Header */}
      <div className={`rounded-2xl border p-6 ${tierStyles.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <TierIcon className={`h-5 w-5 ${tierStyles.labelColor}`} aria-hidden="true" />
            <span className={`text-xs font-bold uppercase tracking-wider ${tierStyles.labelColor}`}>
              {tierStyles.labelText}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono-num text-xs">
            <span className={selectedOption.unityDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
              Unity: {formatDelta(selectedOption.unityDelta)}
            </span>
            <span className={selectedOption.stabilityDelta >= 0 ? 'text-sky-300' : 'text-rose-300'}>
              Stability: {formatDelta(selectedOption.stabilityDelta)}
            </span>
            <span className="text-amber-300">
              Knowledge: +{selectedOption.knowledgePoints} pts
            </span>
          </div>
        </div>

        <h3 className="mt-3 font-display text-xl font-bold text-white">
          {selectedOption.consequenceTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
          {selectedOption.consequenceSummary}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-700/60 pt-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-emerald-300">Key Advantage</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {selectedOption.advantages}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-300">Trade-Off / Limitation</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {selectedOption.limitations}
            </p>
          </div>
        </div>
      </div>

      {/* Social Studies Concept & Takeaway */}
      <div className="rounded-2xl border border-slate-800 bg-[#091326] p-5">
        <div className="flex items-center gap-2 text-amber-300">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-semibold">
            Social Studies Concept: {conceptTerm}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">{conceptExplanation}</p>
        <p className="mt-3 border-t border-slate-800 pt-3 text-xs font-medium text-amber-200">
          Learning Takeaway: {learningTakeaway}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors whitespace-nowrap shrink-0"
        >
          <span>{nextLabel}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
};
