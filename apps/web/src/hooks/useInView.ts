import { useEffect, useRef, useState } from "react";

import type { RefObject } from "react";

export type UseInViewOptions = {
  /** IntersectionObserver root margin, e.g. "0px 0px -20% 0px" */
  rootMargin?: string;
  /** Threshold between 0 and 1 when the callback should fire */
  threshold?: number | number[];
  /** If true, once it becomes visible it stays visible */
  once?: boolean;
};

/**
 * Tiny IntersectionObserver hook to detect when an element enters the viewport.
 * Defaults are tuned for section reveals: triggers a bit before full visibility and only once.
 */
export function useInView<T extends Element = Element>({
  rootMargin = "0px 0px -15% 0px",
  threshold = 0.15,
  once = true,
}: UseInViewOptions = {}): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    let didUnmount = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!didUnmount) {
              setInView(true);
            }
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            if (!didUnmount) {
              setInView(false);
            }
          }
        });
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => {
      didUnmount = true;
      observer.disconnect();
    };
  }, [rootMargin, threshold, once]);

  return { ref, inView };
}
