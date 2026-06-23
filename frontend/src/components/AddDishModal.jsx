/**
 * Modal form to add a new dish.
 */

import React, { useState } from "react";

export default function AddDishModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ dishName: "", imageUrl: "", isPublished: false });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.dishName.trim()) e.dishName = "Dish name is required";
    if (!form.imageUrl.trim()) e.imageUrl = "Image URL is required";
    else {
      try { new URL(form.imageUrl); } catch { e.imageUrl = "Enter a valid URL"; }
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await onCreate(form);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label="Add new dish">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md glass dark:glass-dark rounded-2xl shadow-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Add New Dish</h2>
          <button onClick={onClose} aria-label="Close modal"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dish Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Dish Name
            </label>
            <input
              type="text"
              value={form.dishName}
              onChange={(e) => setForm({ ...form, dishName: e.target.value })}
              placeholder="e.g. Butter Chicken"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm
                bg-white/60 dark:bg-slate-700/60
                text-slate-800 dark:text-slate-100 placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-violet-500/50
                ${errors.dishName ? "border-red-400" : "border-slate-200/60 dark:border-slate-600/60"}`}
            />
            {errors.dishName && <p className="text-red-500 text-xs mt-1">{errors.dishName}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/dish.jpg"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm
                bg-white/60 dark:bg-slate-700/60
                text-slate-800 dark:text-slate-100 placeholder-slate-400
                focus:outline-none focus:ring-2 focus:ring-violet-500/50
                ${errors.imageUrl ? "border-red-400" : "border-slate-200/60 dark:border-slate-600/60"}`}
            />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.isPublished}
              onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              className={`relative w-11 h-6 rounded-full transition-colors
                ${form.isPublished ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow
                transition-transform ${form.isPublished ? "translate-x-5" : "translate-x-0.5"}`}/>
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300">Publish immediately</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-600/60
                text-sm font-medium text-slate-600 dark:text-slate-400
                hover:bg-slate-100/60 dark:hover:bg-slate-700/60 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700
                text-white text-sm font-medium transition-all disabled:opacity-60
                flex items-center justify-center gap-2">
              {submitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {submitting ? "Adding..." : "Add Dish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
