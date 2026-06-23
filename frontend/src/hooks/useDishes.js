/**
 * Central state hook for dishes + activity log.
 * Handles fetch, create, toggle, delete, and WebSocket sync.
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { dishApi } from "../services/api";
import { useWebSocket } from "./useWebSocket";

export function useDishes() {
  const [dishes, setDishes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDishes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dishData, activityData] = await Promise.all([
        dishApi.getAll(),
        dishApi.getActivities(),
      ]);
      setDishes(dishData);
      setActivities(activityData);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDishes(); }, [fetchDishes]);

  // Refresh activities after any change
  const refreshActivities = useCallback(async () => {
    try {
      const data = await dishApi.getActivities();
      setActivities(data);
    } catch (_) {}
  }, []);

  // WebSocket event handler
  const handleWsMessage = useCallback((msg) => {
    if (msg.event === "dish_created") {
      setDishes((prev) => {
        if (prev.some((d) => d.dishId === msg.dish.dishId)) return prev;
        return [msg.dish, ...prev];
      });
      toast.success(`"${msg.dish.dishName}" added`);
      refreshActivities();
    } else if (msg.event === "dish_updated") {
      setDishes((prev) =>
        prev.map((d) => (d.dishId === msg.dish.dishId ? msg.dish : d))
      );
      refreshActivities();
    } else if (msg.event === "dish_deleted") {
      setDishes((prev) => prev.filter((d) => d.dishId !== msg.dishId));
      toast("Dish removed", { icon: "🗑️" });
      refreshActivities();
    }
  }, [refreshActivities]);

  useWebSocket(handleWsMessage);

  const createDish = useCallback(async (data) => {
    const promise = dishApi.create(data);
    toast.promise(promise, {
      loading: "Adding dish...",
      success: "Dish added!",
      error: (e) => e.message,
    });
    await promise;
  }, []);

  const toggleDish = useCallback(async (dishId) => {
    try {
      await dishApi.toggle(dishId);
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const deleteDish = useCallback(async (dishId) => {
    try {
      await dishApi.delete(dishId);
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  return { dishes, activities, loading, error, createDish, toggleDish, deleteDish, refetch: fetchDishes };
}
