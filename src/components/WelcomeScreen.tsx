import React from 'react';
import { ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onStart: () => void;
  onViewInstructions: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onViewInstructions,
}) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Left Briefing Column */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0F1E38] p-7 sm:p-10 lg:col-span-6"
        >
          <div>
            <p className="text-xs font-semibold tracking-wider text-amber-300">
              Grade 9 Social Studies · National Integration Strategy Simulation
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white text-balance sm:text-5xl">
              Indonesia: The Unity Mission
            </h1>
            <p className="mt-2 text-base font-semibold text-rose-300 sm:text-lg">
              The National Integration Challenge
            </p>
            <p className="mt-1 text-sm italic text-amber-200/90">
              “Different Cultures. Shared Identity. One Nation.”
            </p>

            <p className="mt-6 text-sm leading-relaxed text-slate-200 sm:text-base">
              Indonesia spans thousands of islands enriched by hundreds of languages, faiths, and
              traditions. Yet rapid change brings real tests: cultural misunderstandings, unequal
              regional development, discrimination, and viral online hoaxes.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              As a member of the <strong className="text-white">National Unity Task Force</strong>,
              your decisions across six missions will shape social harmony, regional fairness, and
              Indonesia’s future toward 2045.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B01824] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              <span>Join Task Force</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onViewInstructions}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/60 px-5 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-amber-400/60 hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>How to Play</span>
            </button>
          </div>
        </motion.div>

        {/* Right Hero Artwork Column */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0B172C] lg:col-span-6"
        >
          <img
            src="/src/assets/images/hero_archipelago_banner_1794865908566.jpg"
            alt="Strategic cartographic view of the Indonesian archipelago from Sumatra to Papua"
            referrerPolicy="no-referrer"
            className="h-72 w-full object-cover lg:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081122] via-[#081122]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="text-xs font-semibold text-amber-300">
              Six Strategic Missions · Interactive Map & Real Consequences
            </p>
            <p className="mt-1.5 text-sm text-slate-100 leading-relaxed max-w-lg">
              Analyze cultural roots, resolve school and community conflicts, connect remote islands,
              negotiate regional budgets, and design Indonesia’s 2045 unity strategy.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom 3-Column Overview Strip */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-[#0F1E38]/90 p-5">
          <div className="flex items-center gap-2 text-amber-300">
            <Compass className="h-4 w-4" aria-hidden="true" />
            <h2 className="font-sans text-sm font-semibold text-white">Critical Strategy, Not Trivia</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Evaluate realistic options with both advantages and trade-offs. Every choice shapes
            Unity Score, National Stability, and Knowledge Points.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0F1E38]/90 p-5">
          <div className="flex items-center gap-2 text-amber-300">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <h2 className="font-sans text-sm font-semibold text-white">Dynamic National Events</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Expect sudden viral rumors, monsoon sea disruptions, and regional summits between
            missions to test how you apply Social Studies concepts.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0F1E38]/90 p-5">
          <div className="flex items-center gap-2 text-amber-300">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <h2 className="font-sans text-sm font-semibold text-white">Verified Achievement Certificate</h2>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            Complete all six missions and your final integration reflection to unlock a personalized
            Landscape A4 Certificate downloadable in PDF and PNG.
          </p>
        </div>
      </div>
    </div>
  );
};
