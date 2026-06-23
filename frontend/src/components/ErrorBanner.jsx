/**
 * Full-page error state with retry button.
 */

import React from "react";

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
      <span className="text-5xl">⚠️</span>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700
          text-white text-sm font-medium transition-all"
      >
        Retry
      </button>
    </div>
  );
}
