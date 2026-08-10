"use client";

import { useEffect, useState } from "react";

/*
 * Minimal toast system for the demo product experience.
 * showToast("Deleted", { undo: () => ... }) — bottom-center, Finout styling
 * (dark #101828 pill, white text, blue Undo action), auto-dismiss 4s.
 */

export type Toast = { id: number; message: string; undo?: () => void };

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l([...toasts]));
}

export function showToast(message: string, opts?: { undo?: () => void }) {
  const id = nextId++;
  toasts = [...toasts, { id, message, undo: opts?.undo }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 4000);
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const l: Listener = (t) => setItems(t);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-[1000] flex flex-col gap-[8px] items-center">
      {items.map((t) => (
        <div
          key={t.id}
          className="bg-[#101828] flex gap-[16px] items-center px-[16px] py-[10px] rounded-[8px] shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.1),0px_2px_4px_-2px_rgba(16,24,40,0.06)]"
        >
          <span className="font-sans font-normal leading-[20px] text-[14px] text-white whitespace-nowrap">{t.message}</span>
          {t.undo && (
            <button
              className="font-sans font-medium leading-[20px] text-[14px] text-[#84caff] whitespace-nowrap cursor-pointer"
              onClick={() => {
                t.undo?.();
                toasts = toasts.filter((x) => x.id !== t.id);
                emit();
              }}
            >
              Undo
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
