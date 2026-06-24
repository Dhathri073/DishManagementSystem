/**
 * Admin dish card — click to open detail, Edit/Publish/Delete actions.
 */
import React, { useState } from "react";
import { resolveImageUrl } from "../utils/imageUrl";

export default function DishCard({ dish, onToggle, onDelete, onEdit, onClick }) {
  const [imgError, setImgError] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const stop = (fn) => async (e) => {
    e.stopPropagation();
    await fn();
  };

  const handleToggle = stop(async () => {
    setToggling(true);
    await onToggle(dish.dishId);
    setToggling(false);
  });

  const handleDelete = stop(async () => {
    setDeleting(true);
    await onDelete(dish.dishId);
  });

  const handleEdit = stop(async () => onEdit?.(dish));

  return (
    <div
      onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`View details for ${dish.dishName}`}
      className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer
        glass dark:glass-dark hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 animate-fade-in focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden">
        {!imgError && dish.imageUrl
          ? <img src={resolveImageUrl(dish.imageUrl)} alt={dish.dishName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)} />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🍴</div>}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm
          ${dish.isPublished ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}>
          {dish.isPublished ? "Published" : "Draft"}
        </span>
        {dish.category && (
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium
            bg-black/40 text-white backdrop-blur-sm">
            {dish.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-800 dark:text-white truncate text-sm">{dish.dishName}</h3>
          {dish.price > 0 && (
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex-shrink-0">
              ${parseFloat(dish.price).toFixed(2)}
            </span>
          )}
        </div>
        {dish.description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mb-1">{dish.description}</p>
        )}
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
          {new Date(dish.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-1.5">
          {/* Edit */}
          <button onClick={handleEdit} aria-label="Edit dish"
            className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400
              hover:bg-sky-200 dark:hover:bg-sky-900/60 transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>

          {/* Toggle */}
          <button onClick={handleToggle} disabled={toggling}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 disabled:opacity-50
              ${dish.isPublished
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200"
                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200"}`}>
            {toggling
              ? <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              : dish.isPublished ? "Unpublish" : "Publish"}
          </button>

          {/* Delete */}
          <button onClick={handleDelete} disabled={deleting} aria-label="Delete dish"
            className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400
              hover:bg-red-200 dark:hover:bg-red-900/60 transition-all disabled:opacity-50">
            {deleting
              ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>}
          </button>
        </div>
      </div>
    </div>
  );
}
