"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

// GET helper for pages: { data, loading, error, reload, setData }
export function useApi(path, { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled || !path) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    api(path)
      .then((data) => alive && setState({ data, loading: false, error: "" }))
      .catch((e) => alive && setState({ data: null, loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, [path, enabled, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const setData = useCallback((fn) => setState((s) => ({ ...s, data: typeof fn === "function" ? fn(s.data) : fn })), []);
  return { ...state, reload, setData };
}
