/**
 * Root application component.
 * Orchestrates layout, filtering, sorting, pagination, and modals.
 */

import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import Filters from "./components/Filters";
import DishCard from "./components/DishCard";
import SkeletonCard from "./components/SkeletonCard";
import Pagination from "./components/Pagination";
import AddDishModal from "./components/AddDishModal";
import PublicationChart from "./components/PublicationChart";
import ErrorBanner from "./components/ErrorBanner";
import { useDishes } from "./hooks/useDishes";

const PAGE_SIZE = 12;

export default function App() {
  const { dishes, loading, error, createDish, toggleDish, deleteDish, refetch } = useDishes();

  // UI state
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  // Apply dark mode class on <html>
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Reset to page 1 when search/filter/sort changes
  React.useEffect(() => { setPage(1); }, [search, filter, sort]);

  // Derived: filter + search + sort
  const processed = useMemo(() => {
    let result = [...dishes];

    // Filter by status
    if (filter === "published") result = result.filter((d) => d.isPublished);
    else if (filter === "unpublished") result = result.filter((d) => !d.isPublished);

    // Search by name
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.dishName.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "name_asc") return a.dishName.localeCompare(b.dishName);
      if (sort === "name_desc") return b.dishName.localeCompare(a.dishName);
      return 0;
    });

    return result;
  }, [dishes, filter, search, sort]);

  // Pagination
  const totalPages = Math.ceil(processed.length / PAGE_SIZE);
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-slate-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">

      <Header
        search={search}
        onSearch={setSearch}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((v) => !v)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats */}
        <StatsCards dishes={dishes} loading={loading} />

        {/* Chart + Filters row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <PublicationChart dishes={dishes} />
          </div>
          <div className="lg:col-span-3 flex flex-col justify-center">
            <Filters
              filter={filter}
              sort={sort}
              onFilter={setFilter}
              onSort={setSort}
              onAdd={() => setShowModal(true)}
            />
          </div>
        </div>

        {/* Error state */}
        {error && !loading && <ErrorBanner message={error} onRetry={refetch} />}

        {/* Dish Grid */}
        {!error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                : paginated.map((dish) => (
                    <DishCard
                      key={dish.dishId}
                      dish={dish}
                      onToggle={toggleDish}
                      onDelete={deleteDish}
                    />
                  ))}
            </div>

            {/* Empty state */}
            {!loading && processed.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <span className="text-6xl">🍽️</span>
                <p className="mt-4 text-slate-500 dark:text-slate-400">
                  {search || filter !== "all" ? "No dishes match your filters." : "No dishes yet. Add your first one!"}
                </p>
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </main>

      {/* Add Dish Modal */}
      {showModal && (
        <AddDishModal
          onClose={() => setShowModal(false)}
          onCreate={createDish}
        />
      )}
    </div>
  );
}
