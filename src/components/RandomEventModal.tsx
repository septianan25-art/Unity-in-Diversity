import React, { useState } from 'react';
import { AlertTriangle, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { DecisionOption, RandomEventItem } from '../types/game';
import { ConsequencePanel } from './ConsequencePanel';

interface RandomEventModalProps {
  event: RandomEventItem;
  onSelectOption: (option: DecisionOption) => void;
  onCompleteEvent: () => void;
  onPlaySubmitSfx: () => void;
  onPlayOutcomeSfx: (tier: DecisionOption['tier']) => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({
  event,
  onSelectOption,
  onCompleteEvent,
  onPlaySubmitSfx,
  onPlayOutcomeSfx,
}) => {
  const [selected, setSelected] = useState<DecisionOption | null>(null);

  const handleChoose = (opt: DecisionOption) => {
    if (selected) return;
    onPlaySubmitSfx();
    setSelected(opt);
    onPlayOutcomeSfx(opt.tier);
    onSelectOption(opt);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-amber-500/60 bg-[#0F1E38] p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Unexpected National Event · {event.urgency}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
            {event.region}
          </span>
        </div>

        <h1 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">
          {event.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-200 sm:text-base">
          {event.scenario}
        </p>

        <p className="mt-5 text-sm font-semibold text-amber-200">
          How will the National Unity Task Force respond?
        </p>

        <div className="mt-4 space-y-3">
          {event.options.map((opt) => {
            const isSelected = selected?.id === opt.id;
            const isDisabled = selected !== null;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={isDisabled}
                onClick={() => handleChoose(opt)}
                className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 text-white'
                    : isDisabled
                    ? 'border-slate-800 bg-[#091326]/60 text-slate-400 opacity-70'
                    : 'border-slate-700 bg-[#091326] text-slate-100 hover:border-amber-400/70 hover:bg-[#11223E]'
                }`}
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 font-mono-num text-xs font-bold text-amber-300">
                  {opt.id}
                </span>
                <span className="text-sm leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {selected && (
          <ConsequencePanel
            selectedOption={selected}
            conceptTerm={event.conceptTerm}
            conceptExplanation={event.conceptExplanation}
            learningTakeaway={event.learningTakeaway}
            nextLabel="Return to Mission Dashboard"
            onContinue={onCompleteEvent}
          />
        )}
      </motion.div>
    </div>
  );
};
