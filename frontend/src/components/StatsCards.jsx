/**
 * Stats overview cards: Total, Published, Unpublished, Last Updated.
 */

import React from "react";

function StatCard({ label, value, icon, gradient, loading }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 shadow-lg
        glass dark:glass-dark animate-slide-up`}
    >
      {/* Background gradient blob */}
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 ${gradient}`} />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          {loading ? (
            <div className="skeleton h-8 w-16 rounded-lg mt-1" />
          ) : (
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${gradient} shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StatsCards({ dishes, loading }) {
  const total = dishes.length;
  const published = dishes.filter((d) => d.isPublished).length;
  const unpublished = total - published;
  const lastUpdated = dishes.length
    ? new Date(
        Math.max(...dishes.map((d) => new Date(d.updatedAt)))
      ).toLocaleDateString()
    : "—";

  const stats = [
    { label: "Total Dishes", value: total, icon: "🍽️", gradient: "bg-violet-500" },
    { label: "Published", value: published, icon: "✅", gradient: "bg-emerald-500" },
    { label: "Unpublished", value: unpublished, icon: "⏸️", gradient: "bg-amber-500" },
    { label: "Last Updated", value: lastUpdated, icon: "🕐", gradient: "bg-sky-500" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} loading={loading} />
      ))}
    </div>
  );
}
