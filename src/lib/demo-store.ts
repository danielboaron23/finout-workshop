"use client";

import { useSyncExternalStore } from "react";

/*
 * Tiny sessionStorage-backed live store for the demo product experience.
 * Every page reads its data through useDemoStore so real actions (delete,
 * create, rename, filter presets) update the UI instantly and survive
 * client-side navigation.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  if (cache.has(key)) return cache.get(key) as T;
  try {
    const raw = window.sessionStorage.getItem(key);
    const val = raw ? (JSON.parse(raw) as T) : fallback;
    cache.set(key, val);
    return val;
  } catch {
    return fallback;
  }
}

export function setDemo<T>(key: string, value: T) {
  cache.set(key, value);
  window.sessionStorage.setItem(key, JSON.stringify(value));
  listeners.get(key)?.forEach((l) => l());
}

export function updateDemo<T>(key: string, fallback: T, fn: (prev: T) => T) {
  setDemo(key, fn(read(key, fallback)));
}

export function useDemoStore<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    (cb) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key)!.add(cb);
      return () => listeners.get(key)!.delete(cb);
    },
    () => read(key, fallback),
    () => fallback,
  );
}
