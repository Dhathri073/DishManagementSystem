/**
 * Admin Dashboard page (/admin)
 * Full dish management: add, edit, delete, publish/unpublish, analytics, activity log.
 */
import React, { useState, useMemo } from "react";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import Filters from "../components/Filters";
import DishCard from "../components/DishCard";
import { SkeletonGrid } from "../components/SkeletonCard";
import Pagination from "../components/Pagination";
import AddDishModal from "../components/AddDishModal";
import EditDishModal from "../components/EditDishModal";
import DishDetailModal from "../components/DishDetailModal";
import PublicationChart from "../components/PublicationChart";
import RecentActivities from "../components/RecentActivities";
import ErrorBanner from "../components/ErrorBanner";
import { useDishes } from "../hooks/useDishes";

const PAGE_SIZE = 12;

export default function AdminPage({ darkMode, onToggleDark }) {
  const { dishes, activities, loading, error, createDish, updateDish, toggleDish, deleteDish, refetch } = useDishes();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDish, setEditDish] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  React.useEffect(() => { setPage(1); }, [search, filter, sort]);

  // Keep detail modal in sync with live dish data
  React.useEffect(() => {
    if (!selectedDish) return;
    const updated = dishes.find((d) => d.dishId === selectedDish.dishId);
    if (!updated) setSelectedDish(null);
    else if (updated !== selectedDish) setSelectedDish(updated);
  }, [dishes]); // eslint-disable-line react-hooks/exhaustive-deps

  const processed = useMemo(() => {
    let result = [...dishes];
    if (filter === "published") result = result.filter((d) => d.isPublished);
    else if (filter === "unpublished") result = result.filter((d) => !d.isPublished);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => {
        const nameMatch = d.dishName.toLowerCase().includes(q);
        const statusMatch =
          (q === "published" && d.isPublished) ||
          (q === "unpublished" && !d.isPublished) ||
          (q === "draft" && !d.isPublished);
        return nameMatch || statusMatch;
      });
    }
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "name_asc") return a.dishName.localeCompare(b.dishName);
      if (sort === "name_desc") return b.dishName.localeCompare(a.dishName);
      return 0;
    });
    return result;
  }, [dishes, filter, search, sort]);

  const totalPages = Math.ceil(processed.length / PAGE_SIZE);
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-slate-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100">

      <Header search={search} onSearch={setSearch} darkMode={darkMode} onToggleDark={onToggleDark} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <StatsCards dishes={dishes} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PublicationChart dishes={dishes} />
          <RecentActivities activities={activities} loading={loading} />
          <div className="flex flex-col justify-center">
            <Filters
              filter={filter}
              sort={sort}
              onFilter={setFilter}
              onSort={setSort}
              onAdd={() => setShowAddModal(true)}
              resultCount={processed.length}
              totalCount={dishes.length}
              search={search}
            />
          </div>
        </div>

        {error && !loading && <ErrorBanner message={error} onRetry={refetch} />}

        {!error && (
          loading ? <SkeletonGrid count={8} /> : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginated.map((dish) => (
                  <DishCard
                    key={dish.dishId}
                    dish={dish}
                    onToggle={toggleDish}
                    onDelete={deleteDish}
                    onEdit={(d) => setEditDish(d)}
                    onClick={() => setSelectedDish(dish)}
                  />
                ))}
              </div>

              {processed.length === 0 && (
                <div className="text-center py-20 animate-fade-in">
                  <span className="text-6xl">🍽️</span>
                  <p className="mt-4 text-slate-500 dark:text-slate-400">
                    {search || filter !== "all"
                      ? `No dishes match your filters.`
                      : "No dishes yet. Add your first one!"}
                  </p>
                  {(search || filter !== "all") && (
                    <button
                      onClick={() => { setSearch(""); setFilter("all"); }}
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

      {showAddModal && (
        <AddDishModal onClose={() => setShowAddModal(false)} onCreate={createDish} />
      )}

      {editDish && (
        <EditDishModal
          dish={editDish}
          onClose={() => setEditDish(null)}
          onUpdate={updateDish}
        />
      )}

      {selectedDish && (
        <DishDetailModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onToggle={toggleDish}
          onDelete={deleteDish}
        />
      )}
    </div>
  );
}
