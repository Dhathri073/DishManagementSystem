/**
 * Stats cards: Total Dishes (with 7-day trend), Published,
 * Publish Ratio, and Last Updated.
 */

import React from "react";

function TrendBadge({ value }) {
  if (value === null) return null;
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full
      ${up ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
            : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"}`}>
      {up ? "↑" : "↓"} {Math.abs(value)}
    </span>
  );
}

function StatCard({ label, value, sub, icon, gradient, loading, trend }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 shadow-lg glass dark:glass-dark animate-slide-up">
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 ${gradient}`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          {loading ? (
            <div className="skeleton h-8 w-16 rounded-lg mt-1" />
          ) : (
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            {sub && !loading && (
              <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>
            )}
            {trend !== undefined && !loading && <TrendBadge value={trend} />}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${gradient} shadow-lg flex-shrink-0`}>
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
  const ratio = total > 0 ? Math.round((published / total) * 100) : 0;

  // 7-day trend: dishes created in last 7 days vs prior 7 days
  const now = Date.now();
  const day = 86400000;
  const last7 = dishes.filter((d) => now - new Date(d.createdAt) <= 7 * day).length;
  const prev7 = dishes.filter((d) => {
    const age = now - new Date(d.createdAt);
    return age > 7 * day && age <= 14 * day;
  }).length;
  const trend = last7 - prev7;

  const lastUpdated = dishes.length
    ? new Date(Math.max(...dishes.map((d) => new Date(d.updatedAt)))).toLocaleDateString()
    : "—";

  const stats = [
    {
      label: "Total Dishes",
      value: total,
      icon: "🍽️",
      gradient: "bg-violet-500",
      sub: `+${last7} this week`,
      trend,
    },
    {
      label: "Published",
      value: published,
      icon: "✅",
      gradient: "bg-emerald-500",
      sub: `${unpublished} unpublished`,
    },
    {
      label: "Publish Ratio",
      value: `${ratio}%`,
      icon: "📊",
      gradient: "bg-sky-500",
      sub: `${published} of ${total} dishes`,
    },
    {
      label: "Last Updated",
      value: lastUpdated,
      icon: "🕐",
      gradient: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} loading={loading} />
      ))}
    </div>
  );
}
