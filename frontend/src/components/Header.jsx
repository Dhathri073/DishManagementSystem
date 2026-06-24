/**
 * App header — nav links (Dashboard / Menu), search, dark mode toggle.
 * Nav links are hidden on the public /menu page.
 */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Header({ search, onSearch, darkMode, onToggleDark }) {
  const hasSearch = (search || "").trim().length > 0;
  const { pathname } = useLocation();
  const isMenu = pathname === "/menu";

  return (
    <header className="sticky top-0 z-30 w-full glass dark:glass-dark shadow-lg px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🍽️</span>
          <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
            {isMenu ? "Our Menu" : "DishBoard"}
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1 flex-shrink-0">
          <NavLink to="/admin"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${isActive ? "bg-violet-600 text-white shadow" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/40"}`}>
            Dashboard
          </NavLink>
          <NavLink to="/menu"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-xs font-medium transition-all
              ${isActive ? "bg-violet-600 text-white shadow" : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/40"}`}>
            Menu
          </NavLink>
        </nav>

        {/* Search (shown on both pages) */}
        {onSearch && (
          <div className="flex-1 max-w-md mx-auto relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={isMenu ? "Search menu…" : 'Search by name or "published"…'}
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full pl-9 pr-8 py-2 rounded-xl bg-white/60 dark:bg-slate-700/60
                text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all border
                ${hasSearch ? "border-violet-400 dark:border-violet-500" : "border-slate-200/60 dark:border-slate-600/60"}`}
            />
            {hasSearch && (
              <>
                <span className="absolute right-8 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <button onClick={() => onSearch("")} aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        )}

        {/* Dark mode toggle */}
        <button onClick={onToggleDark} aria-label="Toggle dark mode"
          className="p-2 rounded-xl bg-white/60 dark:bg-slate-700/60
            border border-slate-200/60 dark:border-slate-600/60
            hover:bg-white/90 dark:hover:bg-slate-700 transition-all flex-shrink-0">
          {darkMode
            ? <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
              </svg>
            : <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>}
        </button>
      </div>
    </header>
  );
}
