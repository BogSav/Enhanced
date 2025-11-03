import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}

/**
 * A hook that provides helpers for scrolling to element IDs and navigating
 * to the home route with an optional fragment. This centralises scroll logic
 * so other components (like the Header) can reuse the behaviour.
 */
export function useScroll() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // This function scrolls to an element with the given ID smoothly
  // since the element has to be on the same page as the button that calls this
  // function, we need to handle navigation outside the home page in the `go` function below
  const scrollToElement = (id?: string): void => {
    if (!id) {
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollHomeToElement = (hash?: string): void => {
    // If already on home, just scroll to the required element
    if (pathname === "/") {
      if (hash === undefined) {
        try {
          // Prefer 'auto' which is widely supported; cast to satisfy TS
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth" as ScrollBehavior,
          });
        } catch {
          window.scrollTo(0, 0);
        }
        return;
      }
      scrollToElement(hash);
      return;
    }

    // Navigate to home with hash then try to scroll after a short delay
    void navigate(hash ? `/#${hash}` : `/`);

    // Allow the route to render
    setTimeout(() => {
      scrollToElement(hash);
    }, 120);
  };

  return {
    scrollToElement: scrollToElement,
    scrollHomeToElement: scrollHomeToElement,
  };
}
