import React from 'react';
import { ArrowRight, Download, FileImage, Lock, Printer } from 'lucide-react';
import { GameState } from '../types/game';
import {
  CertificateRenderData,
  downloadCertificatePDF,
  downloadCertificatePNG,
} from '../utils/certificateExport';
import { calculateScoreBreakdown } from '../utils/scoring';

interface CertificateScreenProps {
  gameState: GameState;
  onProceedToReflection: () => void;
  onBackToDashboard: () => void;
}

export const CertificateScreen: React.FC<CertificateScreenProps> = ({
  gameState,
  onProceedToReflection,
  onBackToDashboard,
}) => {
  const allCompleted = gameState.completedMissions.length === 6;
  const breakdown = calculateScoreBreakdown(gameState);

  if (!allCompleted || !gameState.profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <div className="rounded-2xl border border-slate-800 bg-[#0F1E38] p-8">
          <Lock className="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold text-white">
            Certificate Locked
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Complete all six National Unity Task Force missions ({gameState.completedMissions.length}/6 completed)
            to unlock your official Certificate of Achievement.
          </p>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="mt-6 rounded-xl bg-[#C81E2B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const completionDate =
    gameState.completionDate ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const certData: CertificateRenderData = {
    studentName: gameState.profile.fullName,
    className: gameState.profile.className,
    groupName: gameState.profile.groupName,
    achievementLevel: breakdown.achievementLevel,
    finalScore: breakdown.finalScore,
    completionDate,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Export & Navigation Action Bar */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0F1E38] p-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold text-amber-300">Official Academic Record</p>
          <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
            Certificate of Achievement
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => downloadCertificatePDF(certData)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#B01824] transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={() => downloadCertificatePNG(certData)}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-400/60 bg-amber-400/10 px-4 py-2.5 text-xs font-semibold text-amber-200 hover:bg-amber-400/20 transition-colors whitespace-nowrap shrink-0"
          >
            <FileImage className="h-4 w-4" aria-hidden="true" />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-100 hover:border-slate-400 transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            <span>Print Certificate</span>
          </button>
        </div>
      </div>

      {/* Landscape A4 Certificate Preview */}
      <div className="print-only-certificate relative mx-auto aspect-[297/210] w-full max-w-5xl overflow-hidden rounded-lg border-[10px] border-[#0A1931] bg-[#FCFBF7] p-4 text-slate-900 shadow-2xl sm:p-8">
        {/* Inner Gold Borders */}
        <div className="relative flex h-full w-full flex-col justify-between border-2 border-[#C9962B] p-5 sm:p-10">
          {/* Indonesian Red & White Ceremonial Ribbon Accent */}
          <div className="mx-auto mb-2 flex h-3 w-44 overflow-hidden rounded-sm border border-[#C9962B]">
            <div className="h-full w-1/2 bg-[#C81E2B]" />
            <div className="h-full w-1/2 bg-white" />
          </div>

          {/* Subtle Archipelago Silhouette SVG Backdrop */}
          <svg
            viewBox="0 0 900 380"
            className="pointer-events-none absolute inset-0 m-auto h-[72%] w-[82%] opacity-[0.06]"
            aria-hidden="true"
          >
            <g fill="#0A1931">
              <path d="M90,92 L122,95 L155,130 L195,168 L235,212 L262,250 L248,268 L215,245 L170,198 L128,155 L86,112 Z" />
              <path d="M268,284 L318,286 L368,292 L418,296 L422,312 L370,313 L310,308 L266,298 Z" />
              <path d="M432,299 L458,300 L458,314 L432,313 Z" />
              <path d="M468,303 L512,302 L512,316 L470,315 Z" />
              <path d="M524,306 L588,300 L592,317 L526,320 Z" />
              <path d="M336,120 L382,92 L438,88 L466,118 L452,162 L444,210 L404,225 L356,220 L330,188 Z" />
              <path d="M506,128 L558,118 L592,130 L580,148 L545,148 L545,176 L578,195 L566,214 L540,196 L536,238 L514,242 L510,198 L496,174 Z" />
              <path d="M706,165 L754,174 L816,185 L846,204 L848,266 L810,256 L775,232 L738,215 L698,192 Z" />
            </g>
          </svg>

          {/* Header & Title */}
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-bold tracking-[0.22em] text-[#8F6413] sm:text-xs">
              NATIONAL UNITY TASK FORCE · INDONESIA
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-wide text-[#0A1931] sm:text-4xl lg:text-5xl">
              CERTIFICATE OF ACHIEVEMENT
            </h2>
            <div className="mx-auto mt-2.5 h-0.5 w-40 bg-[#C9962B]" />
          </div>

          {/* Recipient & Recognition Statement */}
          <div className="relative z-10 my-2 text-center">
            <p className="text-xs font-medium text-slate-600 sm:text-sm">
              This certificate is proudly presented to
            </p>
            <p className="mt-1.5 font-display text-2xl font-bold text-[#0A1931] sm:text-4xl">
              {certData.studentName}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Class {certData.className}
              {certData.groupName ? ` · ${certData.groupName}` : ''}
            </p>

            <p className="mx-auto mt-3 max-w-3xl text-xs font-semibold leading-relaxed text-slate-800 sm:text-sm">
              In recognition of successfully completing the Indonesia: The Unity Mission – The
              National Integration Challenge.
            </p>
            <p className="mx-auto mt-1.5 max-w-3xl text-[11px] leading-relaxed text-slate-600 sm:text-xs">
              The student has demonstrated knowledge, critical thinking, problem-solving, and
              understanding of the importance of diversity, tolerance, and national integration in
              Indonesian society.
            </p>
          </div>

          {/* Metadata Strip */}
          <div className="relative z-10 mx-auto grid w-full max-w-3xl grid-cols-3 divide-x divide-slate-300 rounded-lg border border-slate-300 bg-slate-100/80 py-2.5 text-center sm:py-3.5">
            <div className="px-2">
              <p className="text-[9px] font-bold tracking-wider text-slate-500 sm:text-[10px]">
                ACHIEVEMENT LEVEL
              </p>
              <p className="mt-0.5 text-xs font-bold text-[#C81E2B] sm:text-sm">
                {certData.achievementLevel}
              </p>
            </div>
            <div className="px-2">
              <p className="text-[9px] font-bold tracking-wider text-slate-500 sm:text-[10px]">
                FINAL SCORE
              </p>
              <p className="mt-0.5 font-mono-num text-sm font-bold text-[#0A1931] sm:text-lg">
                {certData.finalScore}/100
              </p>
            </div>
            <div className="px-2">
              <p className="text-[9px] font-bold tracking-wider text-slate-500 sm:text-[10px]">
                DATE OF COMPLETION
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#0A1931] sm:text-sm">
                {certData.completionDate}
              </p>
            </div>
          </div>

          {/* Closing Quote, Official Seal & Footer (No Fake Signatures) */}
          <div className="relative z-10 mt-2 text-center">
            <p className="font-display text-xs italic font-semibold text-[#8F6413] sm:text-base">
              “Diversity Makes Us Different. Unity Makes Us Strong.”
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-[10px] font-bold tracking-wider text-[#0A1931] sm:text-xs">
                SOCIAL STUDIES – GRADE 9
              </span>

              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-[#C9962B] bg-[#0A1931] text-center sm:h-16 sm:w-16">
                <span className="text-[7px] font-bold text-amber-300 sm:text-[8px]">BHINNEKA</span>
                <span className="font-display text-[9px] font-bold text-white sm:text-[11px]">
                  UNITY
                </span>
                <span className="text-[6px] font-semibold text-amber-200 sm:text-[7px]">
                  GRADE 9
                </span>
              </div>

              <span className="text-[10px] font-bold tracking-wider text-[#0A1931] sm:text-xs">
                THE UNITY MISSION
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Step: Final Reflection */}
      <div className="no-print mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0F1E38] p-5">
        <div>
          <h2 className="font-display text-lg font-bold text-white">
            Final Step: Student Learning Reflection
          </h2>
          <p className="text-xs text-slate-300">
            Answer five brief reflection questions about what you learned during the mission.
          </p>
        </div>
        <button
          type="button"
          onClick={onProceedToReflection}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#B01824] transition-colors whitespace-nowrap shrink-0"
        >
          <span>Proceed to Final Reflection</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
