import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A small component that scrolls the window to the top whenever the
 * pathname changes. This ensures SPA navigation doesn't preserve the
 * previous scroll position when opening a new page (useful on mobile).
 */
export default function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    // Slight timeout lets the new route render and stabilise layout
    const t = setTimeout(() => {
      try {
        // Prefer 'auto' which is widely supported; cast to satisfy TS
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto" as ScrollBehavior,
        });
      } catch {
        window.scrollTo(0, 0);
      }
    }, 10);

    return () => {
      clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
