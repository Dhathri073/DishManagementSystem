/**
 * Public dish detail modal for /menu page.
 * Shows full image, name, category, price, description, created date.
 * No admin actions (no edit/delete/toggle).
 */
import React, { useState } from "react";
import { resolveImageUrl } from "../utils/imageUrl";

export default function MenuDishDetailModal({ dish, onClose }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={dish.dishName}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative w-full max-w-lg glass dark:glass-dark rounded-2xl
        shadow-2xl overflow-hidden animate-slide-up">

        {/* Image hero */}
        <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300
          dark:from-slate-700 dark:to-slate-800">
          {!imgError && dish.imageUrl
            ? <img
                src={resolveImageUrl(dish.imageUrl)}
                alt={dish.dishName}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            : <div className="w-full h-full flex items-center justify-center text-8xl">🍴</div>
          }

          {/* Close button */}
          <button onClick={onClose} aria-label="Close"
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/30 hover:bg-black/50
              text-white transition-all backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Category */}
          {dish.category && (
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium
              bg-black/40 text-white backdrop-blur-sm">
              {dish.category}
            </span>
          )}

          {/* Price */}
          {dish.price > 0 && (
            <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold
              bg-violet-600 text-white shadow-lg">
              ${parseFloat(dish.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{dish.dishName}</h2>

          {dish.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {dish.description}
            </p>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/30 dark:bg-slate-700/30 rounded-xl p-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Category</p>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {dish.category || "—"}
              </p>
            </div>

            <div className="bg-white/30 dark:bg-slate-700/30 rounded-xl p-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Price</p>
              <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                {dish.price > 0 ? `$${parseFloat(dish.price).toFixed(2)}` : "—"}
              </p>
            </div>

            <div className="bg-white/30 dark:bg-slate-700/30 rounded-xl p-3 col-span-2">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Added on</p>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {new Date(dish.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric"
                })}
              </p>
            </div>
          </div>

          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700
              text-white text-sm font-medium transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
