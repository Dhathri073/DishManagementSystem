/**
 * Edit Dish Modal — pre-fills all current dish fields.
 */
import React, { useState, useRef, useCallback } from "react";
import { dishApi } from "../services/api";
import { resolveImageUrl } from "../utils/imageUrl";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Appetizer","Main Course","Dessert","Beverage",
  "Breakfast","Lunch","Dinner","Snack","Salad","Soup","Other",
];

export default function EditDishModal({ dish, onClose, onUpdate }) {
  const [form, setForm] = useState({
    dishName: dish.dishName,
    description: dish.description || "",
    category: dish.category || "Main Course",
    price: dish.price !== undefined ? String(dish.price) : "",
    isPublished: dish.isPublished,
  });
  const [imageUrl, setImageUrl] = useState(dish.imageUrl || "");
  const [imagePreview, setImagePreview] = useState(
    dish.imageUrl ? resolveImageUrl(dish.imageUrl) : ""
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) { toast.error("Images only"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Under 5MB only"); return; }
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setUploading(true);
    try {
      const { imageUrl: url } = await dishApi.uploadImage(file);
      setImageUrl(url);
      URL.revokeObjectURL(preview);
      setImagePreview(resolveImageUrl(url));
    } catch (err) {
      toast.error("Upload failed: " + err.message);
      setImagePreview(dish.imageUrl ? resolveImageUrl(dish.imageUrl) : "");
      URL.revokeObjectURL(preview);
    } finally { setUploading(false); }
  }, [dish.imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.dishName.trim()) errs.dishName = "Dish name is required";
    if (form.price !== "" && isNaN(parseFloat(form.price))) errs.price = "Enter a valid price";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await onUpdate(dish.dishId, {
        ...form,
        price: form.price === "" ? 0 : parseFloat(form.price),
        imageUrl,
      });
      onClose();
    } finally { setSubmitting(false); }
  };

  const inputCls = (err) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm bg-white/60 dark:bg-slate-700/60
    text-slate-800 dark:text-slate-100 placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-violet-500/50
    ${err ? "border-red-400" : "border-slate-200/60 dark:border-slate-600/60"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label="Edit dish">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass dark:glass-dark rounded-2xl shadow-2xl p-6 animate-slide-up max-h-[92vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Edit Dish</h2>
          <button onClick={onClose} aria-label="Close"
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Dish Name *</label>
            <input type="text" value={form.dishName} onChange={(e) => set("dishName", e.target.value)}
              className={inputCls(errors.dishName)} />
            {errors.dishName && <p className="text-red-500 text-xs mt-1">{errors.dishName}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
              rows={2} className={inputCls(false) + " resize-none"} />
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className={inputCls(false)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Price ($)</label>
              <input type="number" min="0" step="0.01" value={form.price}
                onChange={(e) => set("price", e.target.value)} className={inputCls(errors.price)} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Image</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); processFile(e.dataTransfer.files?.[0]); }}
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed rounded-xl p-3 text-center cursor-pointer
                min-h-[100px] flex flex-col items-center justify-center transition-all
                border-slate-300 dark:border-slate-600 hover:border-violet-400 bg-white/30 dark:bg-slate-700/30">
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="max-h-20 max-w-full rounded-lg object-contain" />
                : <p className="text-xs text-slate-400">Click or drag to replace image</p>}
              {uploading && (
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => processFile(e.target.files?.[0])} />
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-3">
            <button type="button" role="switch" aria-checked={form.isPublished}
              onClick={() => set("isPublished", !form.isPublished)}
              className={`relative w-11 h-6 rounded-full transition-colors
                ${form.isPublished ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
                ${form.isPublished ? "translate-x-5" : "translate-x-0.5"}`}/>
            </button>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {form.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-600/60
                text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting || uploading}
              className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700
                text-white text-sm font-medium transition-all disabled:opacity-60
                flex items-center justify-center gap-2">
              {submitting && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>}
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
