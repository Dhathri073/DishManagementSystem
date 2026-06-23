/**
 * Animated skeleton placeholder shown while dishes load.
 */
import React from "react";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg glass dark:glass-dark animate-fade-in">
      {/* Image placeholder */}
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        {/* Date */}
        <div className="skeleton h-3 w-1/3 rounded-lg" />
        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          <div className="skeleton flex-1 h-8 rounded-xl" />
          <div className="skeleton w-9 h-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 animate-fade-in">
        {/* Spinner */}
        <svg className="w-4 h-4 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        <span className="text-sm text-slate-500 dark:text-slate-400">Loading dishes…</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
