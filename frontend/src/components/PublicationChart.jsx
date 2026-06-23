/**
 * Pie chart showing published vs unpublished dish ratio.
 * Uses Chart.js via react-chartjs-2.
 */

import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PublicationChart({ dishes }) {
  const published = dishes.filter((d) => d.isPublished).length;
  const unpublished = dishes.length - published;

  const data = {
    labels: ["Published", "Unpublished"],
    datasets: [
      {
        data: [published, unpublished],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",   // emerald
          "rgba(245, 158, 11, 0.8)",   // amber
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          color: "#94a3b8",
          font: { size: 12 },
        },
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

  return (
    <div className="glass dark:glass-dark rounded-2xl p-5 shadow-lg animate-slide-up">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
        Publication Overview
      </h3>
      {dishes.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
          No dishes yet
        </div>
      ) : (
        <div className="h-48">
          <Pie data={data} options={options} />
        </div>
      )}
    </div>
  );
}
