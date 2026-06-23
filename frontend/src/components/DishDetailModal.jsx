/**
 * Dish Detail Modal.
 * Opens when a card is clicked — shows full image, name, ID, dates, status.
 */

import React, { useState } from "react";

export default function DishDetailModal({ dish, onClose, onToggle, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(dish.dishId);
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(dish.dishId, dish.dishName);
    onClose();
  };

  const copyId = () => {
    navigator.clipboard.writeText(dish.dishId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label="Dish details">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass dark:glass-dark rounded-2xl
        shadow-2xl overflow-hidden animate-slide-up">

        {/* Image hero */}
        <div className="relative h-56 bg-gradient-to-br from-slate-200 to-slate-300
          dark:from-slate-700 dark:to-slate-800">
          {!imgError && dish.imageUrl ? (
            <img
              src={dish.imageUrl}
              alt={dish.dishName}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🍴</div>
          )}

          {/* Close */}
          <button onClick={onClose} aria-label="Close"
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/30 hover:bg-black/50
              text-white transition-all backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Status badge */}
          <span className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-semibold
            shadow-lg backdrop-blur-sm
            ${dish.isPublished ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
            {dish.isPublished ? "Published" : "Draft"}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{dish.dishName}</h2>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/30 dark:bg-slate-700/30 rounded-xl p-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Dish ID</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate flex-1">
                  {dish.dishId.slice(0, 18)}…
                </p>
                <button onClick={copyId} title="Copy ID"
                  className="p-1 rounded hover:bg-white/40 dark:hover:bg-slate-600/40 text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white/30 dark:bg-slate-700/30 rounded-xl p-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Status</p>
              <p className={`text-xs font-semibold ${dish.isPublished ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {dish.isPublished ? "Published" : "Unpublished"}
              </p>
            </div>

            <div className="bg-white/30 dark:bg-slate-700/30 rounded-xl p-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Created</p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {new Date(dish.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="bg-white/30 dark:bg-slate-700/30 rounded-xl p-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Last Updated</p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {new Date(dish.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={handleToggle} disabled={toggling}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                flex items-center justify-center gap-2 disabled:opacity-50
                ${dish.isPublished
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200"}`}>
              {toggling ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : dish.isPublished ? "Unpublish" : "Publish"}
            </button>

            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all
                flex items-center justify-center gap-2 disabled:opacity-50
                bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400
                hover:bg-red-200 dark:hover:bg-red-900/60">
              {deleting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : "Delete Dish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
