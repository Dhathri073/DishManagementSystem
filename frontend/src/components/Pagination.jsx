/**
 * Simple pagination controls.
 */

import React from "react";

export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="p-2 rounded-xl glass dark:glass-dark disabled:opacity-40
          hover:bg-white/40 dark:hover:bg-slate-700/60 transition-all"
      >
        <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={p === page ? "page" : undefined}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
            ${p === page
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
              : "glass dark:glass-dark text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-700/60"}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="p-2 rounded-xl glass dark:glass-dark disabled:opacity-40
          hover:bg-white/40 dark:hover:bg-slate-700/60 transition-all"
      >
        <svg className="w-4 h-4 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
