/**
 * Filter bar: status pills, sort selector, result count, Add Dish button.
 */
import React from "react";

const FILTERS = ["all", "published", "unpublished"];
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
];

export default function Filters({ filter, sort, onFilter, onSort, onAdd, resultCount, totalCount, search }) {
  const isFiltered = filter !== "all" || (search && search.trim());

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: pills + sort */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter pills */}
        <div className="flex bg-white/40 dark:bg-slate-800/40 rounded-xl p-1 border
          border-slate-200/60 dark:border-slate-700/60">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => onFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                ${filter === f
                  ? "bg-violet-600 text-white shadow"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select value={sort} onChange={(e) => onSort(e.target.value)}
          className="px-3 py-2 rounded-xl text-xs font-medium border
            bg-white/40 dark:bg-slate-800/40
            border-slate-200/60 dark:border-slate-700/60
            text-slate-700 dark:text-slate-300
            focus:outline-none focus:ring-2 focus:ring-violet-500/50">
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="flex-1" />

        {/* Add dish */}
        <button onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600
            hover:bg-violet-700 text-white text-sm font-medium transition-all shadow-lg
            hover:shadow-violet-500/30">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Dish
        </button>
      </div>

      {/* Row 2: result count pill */}
      {resultCount !== undefined && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isFiltered
              ? `Showing ${resultCount} of ${totalCount} dishes`
              : `${totalCount} dish${totalCount !== 1 ? "es" : ""} total`}
          </span>
          {isFiltered && resultCount !== totalCount && (
            <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30
              text-violet-600 dark:text-violet-400 text-xs font-medium">
              filtered
            </span>
          )}
        </div>
      )}
    </div>
  );
}
