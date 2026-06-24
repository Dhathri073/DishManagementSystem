/**
 * Public-facing dish card for the /menu page.
 * Shows image, name, category, price, description snippet.
 * Clicking opens the detail modal.
 */
import React, { useState } from "react";
import { resolveImageUrl } from "../utils/imageUrl";

export default function MenuDishCard({ dish, onClick }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`View ${dish.dishName}`}
      className="group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer
        glass dark:glass-dark hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300 animate-fade-in
        focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300
        dark:from-slate-700 dark:to-slate-800 overflow-hidden">
        {!imgError && dish.imageUrl
          ? <img
              src={resolveImageUrl(dish.imageUrl)}
              alt={dish.dishName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🍴</div>
        }
        {/* Category badge */}
        {dish.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium
            bg-black/40 text-white backdrop-blur-sm">
            {dish.category}
          </span>
        )}
        {/* Price badge */}
        {dish.price > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold
            bg-violet-600/90 text-white backdrop-blur-sm shadow-lg">
            ${parseFloat(dish.price).toFixed(2)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1 truncate">
          {dish.dishName}
        </h3>
        {dish.description ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-600 italic">No description</p>
        )}

        {/* View details hint */}
        <div className="mt-3 flex items-center gap-1 text-violet-600 dark:text-violet-400">
          <span className="text-xs font-medium">View details</span>
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
