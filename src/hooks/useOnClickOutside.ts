import type { RefObject } from "react";
import { useEffect } from "react";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (e: MouseEvent) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    function onClick(e: MouseEvent) {
      const node = ref.current;
      if (node && !node.contains(e.target as Node)) handler(e);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [ref, handler, enabled]);
}
