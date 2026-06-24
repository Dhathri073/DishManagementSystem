/**
 * Public Menu Page (/menu)
 * Displays only published dishes. Syncs in real-time via WebSocket.
 * Features: search, category filter, sort, detail modal, skeletons, empty state.
 */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../components/Header";
import { SkeletonGrid } from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import MenuDishCard from "../components/MenuDishCard";
import MenuDishDetailModal from "../components/MenuDishDetailModal";
import { dishApi } from "../services/api";
import { useWebSocket } from "../hooks/useWebSocket";
import toast from "react-hot-toast";

const PAGE_SIZE = 12;
const CATEGORIES = [
  "All","Appetizer","Main Course","Dessert","Beverage",
  "Breakfast","Lunch","Dinner","Snack","Salad","Soup","Other",
];
const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "A–Z" },
  { value: "name_desc", label: "Z–A" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
];

export default function MenuPage({ darkMode, onToggleDark }) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dishApi.getMenu();
      setDishes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, category, sort]);

  // Keep selected dish in sync with updates
  useEffect(() => {
    if (!selected) return;
    const updated = dishes.find((d) => d.dishId === selected.dishId);
    if (!updated) setSelected(null);
    else if (updated !== selected) setSelected(updated);
  }, [dishes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Real-time WebSocket sync
  const handleWsMessage = useCallback((msg) => {
    if (msg.event === "dish_created") {
      if (msg.dish.isPublished) {
        setDishes((prev) => {
          if (prev.some((d) => d.dishId === msg.dish.dishId)) return prev;
          return [msg.dish, ...prev];
        });
        toast(`"${msg.dish.dishName}" is now on the menu!`, { icon: "✨" });
      }
    } else if (msg.event === "dish_updated") {
      setDishes((prev) => {
        // If dish was unpublished, remove it from menu
        if (!msg.dish.isPublished) return prev.filter((d) => d.dishId !== msg.dish.dishId);
        // If it became published, add it
        const exists = prev.some((d) => d.dishId === msg.dish.dishId);
        if (!exists) return [msg.dish, ...prev];
        // Otherwise update in place
        return prev.map((d) => (d.dishId === msg.dish.dishId ? msg.dish : d));
      });
    } else if (msg.event === "dish_deleted") {
      setDishes((prev) => prev.filter((d) => d.dishId !== msg.dishId));
    }
  }, []);

  useWebSocket(handleWsMessage);

  const processed = useMemo(() => {
    let result = [...dishes];
    if (category !== "All") result = result.filter((d) => d.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.dishName.toLowerCase().includes(q) ||
        (d.description || "").toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "name_asc") return a.dishName.localeCompare(b.dishName);
      if (sort === "name_desc") return b.dishName.localeCompare(a.dishName);
      if (sort === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sort === "price_desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });
    return result;
  }, [dishes, category, search, sort]);

  const totalPages = Math.ceil(processed.length / PAGE_SIZE);
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-slate-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header search={search} onSearch={setSearch} darkMode={darkMode} onToggleDark={onToggleDark} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Hero banner */}
        <div className="text-center space-y-2 py-4 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            Our Menu
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Fresh ingredients, bold flavours. Browse our full selection below.
          </p>
        </div>

        {/* Category pills + sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Category scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0
                  ${category === c
                    ? "bg-violet-600 text-white shadow"
                    : "glass dark:glass-dark text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium border flex-shrink-0
              bg-white/40 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60
              text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {processed.length} {processed.length === 1 ? "item" : "items"}
            {(search || category !== "All") ? " found" : " on the menu"}
          </p>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm mb-3">{error}</p>
            <button onClick={fetchMenu}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm transition-all">
              Try again
            </button>
          </div>
        )}

        {/* Grid */}
        {!error && (
          loading ? <SkeletonGrid count={8} /> : (
            <>
              {paginated.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {paginated.map((dish) => (
                    <MenuDishCard key={dish.dishId} dish={dish} onClick={() => setSelected(dish)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 animate-fade-in">
                  <span className="text-6xl">🍽️</span>
                  <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">
                    {search || category !== "All"
                      ? "No dishes match your search."
                      : "No dishes on the menu yet."}
                  </p>
                  {(search || category !== "All") && (
                    <button onClick={() => { setSearch(""); setCategory("All"); }}
                      className="mt-3 text-sm text-violet-600 dark:text-violet-400 hover:underline">
                      Clear filters
                    </button>
                  )}
                </div>
              )}
              <Pagination page={page} totalPages={totalPages} onPage={setPage} />
            </>
          )
        )}
      </main>

      {selected && (
        <MenuDishDetailModal dish={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
