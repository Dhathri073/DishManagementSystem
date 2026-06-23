/**
 * Central state hook for dishes.
 * Handles fetch, create, toggle, delete, and WebSocket sync.
 */

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { dishApi } from "../services/api";
import { useWebSocket } from "./useWebSocket";

export function useDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all dishes from API
  const fetchDishes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dishApi.getAll();
      setDishes(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Handle incoming WebSocket events
  const handleWsMessage = useCallback((msg) => {
    if (msg.event === "dish_created") {
      setDishes((prev) => {
        // Deduplicate: ignore if dish already exists in state
        if (prev.some((d) => d.dishId === msg.dish.dishId)) return prev;
        return [msg.dish, ...prev];
      });
      toast.success(`"${msg.dish.dishName}" added`);
    } else if (msg.event === "dish_updated") {
      setDishes((prev) =>
        prev.map((d) => (d.dishId === msg.dish.dishId ? msg.dish : d))
      );
    } else if (msg.event === "dish_deleted") {
      setDishes((prev) => prev.filter((d) => d.dishId !== msg.dishId));
      toast("Dish removed", { icon: "🗑️" });
    }
  }, []);

  useWebSocket(handleWsMessage);

  // Create dish
  const createDish = useCallback(async (data) => {
    const promise = dishApi.create(data);
    toast.promise(promise, {
      loading: "Adding dish...",
      success: "Dish added!",
      error: (e) => e.message,
    });
    await promise;
  }, []);

  // Toggle published
  const toggleDish = useCallback(async (dishId) => {
    try {
      await dishApi.toggle(dishId);
      // State update comes via WebSocket broadcast
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  // Delete dish
  const deleteDish = useCallback(async (dishId, name) => {
    try {
      await dishApi.delete(dishId);
      // State update comes via WebSocket broadcast
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  return { dishes, loading, error, createDish, toggleDish, deleteDish, refetch: fetchDishes };
}
