/**
 * Add Dish Modal with drag-and-drop image upload + URL fallback.
 */

import React, { useState, useRef, useCallback } from "react";
import { dishApi } from "../services/api";
import toast from "react-hot-toast";

export default function AddDishModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ dishName: "", isPublished: false });
  const [imageUrl, setImageUrl] = useState("");       // final URL stored in dish
  const [imagePreview, setImagePreview] = useState(""); // local object URL for preview
  const [urlInput, setUrlInput] = useState("");        // manual URL tab input
  const [tab, setTab] = useState("upload");            // "upload" | "url"
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.dishName.trim()) e.dishName = "Dish name is required";
    if (!imageUrl && !urlInput.trim()) e.image = "Please upload or provide an image";
    if (tab === "url" && urlInput.trim()) {
      try { new URL(urlInput); } catch { e.image = "Enter a valid URL"; }
    }
    return e;
  };

  const processFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    // Local preview immediately
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    // Upload to backend
    setUploading(true);
    try {
      const { imageUrl: url } = await dishApi.uploadImage(file);
      setImageUrl(url);
      setErrors((e) => ({ ...e, image: undefined }));
    } catch (err) {
      toast.error("Upload failed: " + err.message);
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalImageUrl = tab === "url" ? urlInput.trim() : imageUrl;
    const errs = validate();
    // Recheck with final values
    if (!form.dishName.trim()) errs.dishName = "Dish name is required";
    if (!finalImageUrl) errs.image = "Please upload or provide an image";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await onCreate({ ...form, imageUrl: finalImageUrl });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label="Add new dish">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md glass dark:glass-dark rounded-2xl shadow-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Add New Dish</h2>
          <button onClick={onClose} aria-label="Close"
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

          {/* Image section — tabs */}
          <div>
            <div className="flex rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-600/60 mb-3">
              {["upload", "url"].map((t) => (
                <button key={t} type="button" onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-xs font-medium transition-all capitalize
                    ${tab === t
                      ? "bg-violet-600 text-white"
                      : "bg-white/40 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400 hover:bg-white/60"}`}>
                  {t === "upload" ? "📁 Upload Image" : "🔗 Image URL"}
                </button>
              ))}
            </div>

            {tab === "upload" ? (
              <div>
                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer
                    transition-all min-h-[140px] flex flex-col items-center justify-center
                    ${dragging
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-violet-400 dark:hover:border-violet-500 bg-white/30 dark:bg-slate-700/30"}`}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview"
                      className="max-h-28 max-w-full rounded-lg object-contain mx-auto" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Drag & drop or <span className="text-violet-600 dark:text-violet-400 font-medium">click to browse</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</p>
                    </>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 animate-spin text-violet-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*"
                  className="hidden" onChange={onFileChange} />
                {imagePreview && (
                  <button type="button" onClick={() => { setImagePreview(""); setImageUrl(""); }}
                    className="text-xs text-red-500 hover:text-red-600 mt-1.5">
                    Remove image
                  </button>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/dish.jpg"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm
                  bg-white/60 dark:bg-slate-700/60
                  text-slate-800 dark:text-slate-100 placeholder-slate-400
                  focus:outline-none focus:ring-2 focus:ring-violet-500/50
                  ${errors.image ? "border-red-400" : "border-slate-200/60 dark:border-slate-600/60"}`}
              />
            )}
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-3">
            <button type="button" role="switch" aria-checked={form.isPublished}
              onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              className={`relative w-11 h-6 rounded-full transition-colors
                ${form.isPublished ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}>
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
            <button type="submit" disabled={submitting || uploading}
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
