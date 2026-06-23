/**
 * Custom hook for WebSocket connection.
 * Reconnects automatically with exponential back-off on disconnect.
 */

import { useEffect, useRef, useCallback } from "react";

// In dev, VITE_WS_URL is empty — derive from current host so Vite proxy handles it.
// In production, set VITE_WS_URL to wss://your-backend-domain/ws
const WS_URL =
  import.meta.env.VITE_WS_URL ||
  `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`;

export function useWebSocket(onMessage) {
  const wsRef = useRef(null);
  const reconnectDelay = useRef(1000);
  const onMessageRef = useRef(onMessage);
  const intentionalClose = useRef(false); // prevents reconnect on unmount
  onMessageRef.current = onMessage;

  const connect = useCallback(() => {
    // Don't open a new socket if one is already open or connecting
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    intentionalClose.current = false;
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      reconnectDelay.current = 1000;
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onMessageRef.current(data);
      } catch {
        console.error("WS parse error", e.data);
      }
    };

    ws.onclose = () => {
      // Only reconnect if not intentionally closed (e.g. component unmount)
      if (!intentionalClose.current) {
        console.log(`WS closed. Reconnecting in ${reconnectDelay.current}ms`);
        setTimeout(() => {
          reconnectDelay.current = Math.min(reconnectDelay.current * 2, 30000);
          connect();
        }, reconnectDelay.current);
      }
    };

    ws.onerror = (err) => console.error("WS error", err);
  }, []);

  useEffect(() => {
    connect();
    return () => {
      // Mark as intentional so onclose doesn't trigger reconnect
      intentionalClose.current = true;
      wsRef.current?.close();
    };
  }, [connect]);
}
