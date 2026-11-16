import React, { useState } from 'react';
import { ArrowRight, UserCheck } from 'lucide-react';
import { StudentProfile } from '../types/game';

interface ProfileScreenProps {
  initialProfile: StudentProfile | null;
  onSubmitProfile: (profile: StudentProfile) => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  initialProfile,
  onSubmitProfile,
  onBack,
}) => {
  const [fullName, setFullName] = useState(initialProfile?.fullName ?? '');
  const [className, setClassName] = useState(initialProfile?.className ?? '');
  const [groupName, setGroupName] = useState(initialProfile?.groupName ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanClass = className.trim();
    if (cleanName.length < 2) {
      setError('Please enter your full name so it appears accurately on your dashboard and certificate.');
      return;
    }
    if (!cleanClass) {
      setError('Please enter your class (for example: 9A or Grade 9B).');
      return;
    }

    onSubmitProfile({
      fullName: cleanName,
      className: cleanClass,
      groupName: groupName.trim(),
      startedAt: initialProfile?.startedAt ?? new Date().toISOString(),
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-slate-800 bg-[#0F1E38] p-7 sm:p-10">
        <div className="flex items-center gap-2 text-amber-300">
          <UserCheck className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-wider">Task Force Registration</span>
        </div>

        <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
          Student Profile Setup
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Enter your details for this session. Your name will appear on your National Unity Task
          Force command dashboard and your final Certificate of Achievement.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="student-full-name" className="block text-sm font-medium text-slate-200">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="student-full-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setError('');
              }}
              placeholder="e.g., Nadia Putri Pratama"
              className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#091326] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="student-class" className="block text-sm font-medium text-slate-200">
                Class <span className="text-rose-400">*</span>
              </label>
              <input
                id="student-class"
                type="text"
                required
                value={className}
                onChange={(e) => {
                  setClassName(e.target.value);
                  setError('');
                }}
                placeholder="e.g., 9A"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#091326] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="student-group" className="block text-sm font-medium text-slate-200">
                Group Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="student-group"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Team Nusantara"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-[#091326] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C81E2B] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B01824] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              <span>START MISSION</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
