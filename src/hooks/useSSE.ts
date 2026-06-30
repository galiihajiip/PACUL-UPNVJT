"use client";

import { useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pacul_token");
}

/**
 * SSE hook that uses fetch-based EventSource alternative
 * to pass auth token via header instead of URL query string.
 * Falls back to polling if EventSource is not supported.
 */
export function useSSE(onNotification?: (data: unknown) => void) {
  const retryCount = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    const token = getToken();
    if (!token || token === "guest_token_demo") return;

    let abortController: AbortController | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function connectSSE() {
      abortController = new AbortController();

      try {
        const response = await fetch(`${API_URL}/sse/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        retryCount.current = 0; // Reset on successful connection

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === "notifications" && onNotification) {
                  onNotification(data.data);
                }
              } catch {
                // Ignore malformed JSON
              }
            }

            if (line.startsWith("event: close")) {
              // Server requested close, schedule reconnect
              scheduleReconnect();
              return;
            }
          }
        }

        // Stream ended, reconnect
        scheduleReconnect();
      } catch (err) {
        if (abortController?.signal.aborted) return;
        scheduleReconnect();
      }
    }

    function scheduleReconnect() {
      if (retryCount.current >= maxRetries) return;
      retryCount.current++;
      const delay = Math.min(5000 * retryCount.current, 30000);
      timeoutId = setTimeout(connectSSE, delay);
    }

    connectSSE();

    return () => {
      abortController?.abort();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onNotification]);
}
