/**
 * Individual dish card with glassmorphism styling.
 * Shows image, name, status badge, toggle and delete buttons.
 */

import React, { useState } from "react";

export default function DishCard({ dish, onToggle, onDelete }) {
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
    // component unmounts after delete, no need to reset
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-lg
      glass dark:glass-dark hover:shadow-xl hover:-translate-y-1
      transition-all duration-300 animate-fade-in">

      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-slate-200 to-slate-300
        dark:from-slate-700 dark:to-slate-800 overflow-hidden">
        {!imgError ? (
          <img
            src={dish.imageUrl}
            alt={dish.dishName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🍴</div>
        )}

        {/* Status badge overlay */}
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold
            shadow-lg backdrop-blur-sm
            ${dish.isPublished
              ? "bg-emerald-500/90 text-white"
              : "bg-amber-500/90 text-white"}`}
        >
          {dish.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-white truncate text-sm mb-1">
          {dish.dishName}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
          {new Date(dish.createdAt).toLocaleDateString()}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Toggle button */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all
              flex items-center justify-center gap-1
              ${dish.isPublished
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60"
                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
              } disabled:opacity-50`}
          >
            {toggling ? (
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : dish.isPublished ? "Unpublish" : "Publish"}
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete dish"
            className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30
              text-red-600 dark:text-red-400
              hover:bg-red-200 dark:hover:bg-red-900/60
              transition-all disabled:opacity-50"
          >
            {deleting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
