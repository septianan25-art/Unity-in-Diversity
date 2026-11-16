import React from 'react';
import { ArrowLeft, Award, Compass, Scale, Shield } from 'lucide-react';

interface InstructionsScreenProps {
  hasProfile: boolean;
  onContinue: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({
  hasProfile,
  onContinue,
}) => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-slate-800 bg-[#0F1E38] p-7 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-amber-300">
              Task Force Operations Manual
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              Game Instructions & Scoring Guide
            </h1>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{hasProfile ? 'Return to Dashboard' : 'Proceed to Registration'}</span>
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-[#091326] p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-sans text-base font-semibold text-white">1. Core Simulation Indicators</h2>
            </div>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-300">
              <li>
                <strong className="text-white">Unity Score (Starts at 70/100):</strong> Measures how
                well your decisions protect social harmony, equality, and shared identity.
              </li>
              <li>
                <strong className="text-white">Knowledge Points (Starts at 0):</strong> Tracks your
                mastery of Social Studies concepts on diversity and national integration.
              </li>
              <li>
                <strong className="text-white">National Stability (Starts at 70/100):</strong>{' '}
                Reflects public trust, regional fairness, and peace across Indonesia’s islands.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#091326] p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <Scale className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-sans text-base font-semibold text-white">2. How Decisions Are Evaluated</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Real leadership rarely offers easy choices. Each scenario offers four realistic
              options. Some choices solve a short-term problem while hurting long-term trust; others
              benefit one majority group while neglecting smaller islands.
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
              Scoring is weighted—thoughtful compromises earn partial credit, while balanced,
              inclusive solutions earn maximum points.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#091326] p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <Compass className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-sans text-base font-semibold text-white">3. Six Missions & Random Events</h2>
            </div>
            <ol className="mt-3 space-y-1.5 text-sm text-slate-300 list-decimal list-inside">
              <li><strong className="text-white">The Diversity Discovery:</strong> Explore why cultures evolved differently.</li>
              <li><strong className="text-white">The Bhinneka Tunggal Ika Test:</strong> Resolve real school & civic dilemmas.</li>
              <li><strong className="text-white">The Unity Crisis:</strong> Contain discrimination, conflict & fake news.</li>
              <li><strong className="text-white">Connect the Islands:</strong> Allocate 100 Unity Points on the Indonesia map.</li>
              <li><strong className="text-white">The National Negotiation:</strong> Mediate 3 rounds across 4 regional teams.</li>
              <li><strong className="text-white">Save Indonesia 2045:</strong> Design a centennial national strategy.</li>
            </ol>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#091326] p-5">
            <div className="flex items-center gap-2 text-amber-300">
              <Award className="h-4 w-4" aria-hidden="true" />
              <h2 className="font-sans text-base font-semibold text-white">4. Performance Rubric (100%)</h2>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-slate-300 font-mono-num">
              <div className="flex justify-between"><span>Knowledge & Understanding</span><span className="text-amber-300">25%</span></div>
              <div className="flex justify-between"><span>Critical Thinking & Analysis</span><span className="text-amber-300">30%</span></div>
              <div className="flex justify-between"><span>Decision-Making & Problem-Solving</span><span className="text-amber-300">25%</span></div>
              <div className="flex justify-between"><span>Cooperation & Negotiation</span><span className="text-amber-300">10%</span></div>
              <div className="flex justify-between"><span>Final Integration Strategy</span><span className="text-amber-300">10%</span></div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Ranks: 90–100 Unity Legend · 80–89 Unity Champion · 71–79 Unity Advocate · 61–70 Unity Explorer · 0–60 Unity Trainee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
