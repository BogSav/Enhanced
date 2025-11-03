import { useLocation, useNavigate } from "react-router-dom";

export type UseScrollReturn = {
  scrollToElement: (id?: string) => void;
  scrollHomeToElement: (hash?: string) => void;
};

export function useScroll(): UseScrollReturn {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const scrollToElement = (id?: string): void => {
    if (!id) {return;}
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
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" as ScrollBehavior });
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
    scrollToElement,
    scrollHomeToElement,
  };
}
