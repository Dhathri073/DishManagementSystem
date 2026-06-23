/**
 * Two charts side by side:
 *   - Pie: publish ratio (published vs unpublished)
 *   - Bar: 7-day dish creation trend
 */
import React, { useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function last7DayLabels() {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
  }
  return labels;
}

export default function PublicationChart({ dishes }) {
  const published = dishes.filter((d) => d.isPublished).length;
  const unpublished = dishes.length - published;

  // Pie data
  const pieData = {
    labels: ["Published", "Unpublished"],
    datasets: [{
      data: [published, unpublished],
      backgroundColor: ["rgba(16,185,129,0.8)", "rgba(245,158,11,0.8)"],
      borderColor: ["rgba(16,185,129,1)", "rgba(245,158,11,1)"],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 12, usePointStyle: true, pointStyle: "circle", color: "#94a3b8", font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
          },
        },
      },
    },
  };

  // Bar: dishes created per day for last 7 days
  const dayLabels = useMemo(() => last7DayLabels(), []);
  const dayCounts = useMemo(() => {
    return dayLabels.map((_, i) => {
      const target = new Date();
      target.setDate(target.getDate() - (6 - i));
      return dishes.filter((d) => {
        const created = new Date(d.createdAt);
        return (
          created.getFullYear() === target.getFullYear() &&
          created.getMonth() === target.getMonth() &&
          created.getDate() === target.getDate()
        );
      }).length;
    });
  }, [dishes, dayLabels]);

  const barData = {
    labels: dayLabels,
    datasets: [{
      label: "Dishes added",
      data: dayCounts,
      backgroundColor: "rgba(139,92,246,0.7)",
      borderColor: "rgba(139,92,246,1)",
      borderWidth: 2,
      borderRadius: 6,
      hoverBackgroundColor: "rgba(139,92,246,0.9)",
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.raw} added` } },
    },
    scales: {
      x: { ticks: { color: "#94a3b8", font: { size: 10 } }, grid: { display: false } },
      y: {
        ticks: { color: "#94a3b8", font: { size: 10 }, stepSize: 1, precision: 0 },
        grid: { color: "rgba(148,163,184,0.1)" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="glass dark:glass-dark rounded-2xl p-5 shadow-lg animate-slide-up space-y-5">
      {/* Pie */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Publish Ratio
        </h3>
        {dishes.length === 0 ? (
          <div className="h-36 flex items-center justify-center text-slate-400 text-xs">
            No dishes yet
          </div>
        ) : (
          <div className="h-40">
            <Pie data={pieData} options={pieOptions} />
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200/40 dark:border-slate-700/40" />

      {/* Bar */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          7-Day Trend
        </h3>
        <div className="h-36">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
