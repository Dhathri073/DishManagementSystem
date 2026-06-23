/**
 * Recent Activities panel.
 * Shows the last 20 dish events: created, published, unpublished, deleted.
 * Updates in real-time via the activities prop passed from useDishes.
 */

import React from "react";

const ACTION_META = {
  created:     { icon: "✨", color: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400" },
  published:   { icon: "✅", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  unpublished: { icon: "⏸️", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
  deleted:     { icon: "🗑️", color: "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400" },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function RecentActivities({ activities, loading }) {
  return (
    <div className="glass dark:glass-dark rounded-2xl p-5 shadow-lg animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Recent Activity
        </h3>
        <span className="text-xs text-slate-400 dark:text-slate-500">Last 20 events</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton w-8 h-8 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3 w-3/4 rounded" />
                <div className="skeleton h-2.5 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
          No activity yet
        </p>
      ) : (
        <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {activities.map((a) => {
            const meta = ACTION_META[a.action] || ACTION_META.created;
            return (
              <li key={a.activityId}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/30
                  dark:hover:bg-slate-700/30 transition-colors animate-fade-in">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${meta.color}`}>
                  {meta.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    <span className="capitalize">{a.action}</span>{" "}
                    <span className="text-slate-900 dark:text-white">{a.dishName}</span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {timeAgo(a.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
