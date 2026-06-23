/**
 * Loading skeleton placeholder for a dish card.
 */

import React from "react";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg glass dark:glass-dark">
      <div className="skeleton h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded-lg" />
        <div className="skeleton h-3 w-1/2 rounded-lg" />
        <div className="flex gap-2 pt-1">
          <div className="skeleton flex-1 h-8 rounded-xl" />
          <div className="skeleton w-10 h-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
