import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — manages scroll position across route changes.
 *
 * Behavior:
 * - Forward navigation (link clicks): scrolls to top of page,
 *   or to a #hash element if present in the URL.
 * - Back/Forward (browser buttons): restores the saved scroll position
 *   from sessionStorage so the user returns to where they were.
 */
const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  const prevKeyRef = useRef(key);
  const isPopState = useRef(false);

  // Detect browser back/forward via popstate
  useEffect(() => {
    const handlePopState = () => {
      isPopState.current = true;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Save scroll position before leaving the current page
  useEffect(() => {
    const saveScroll = () => {
      const scrollKey = `scroll_${prevKeyRef.current}`;
      sessionStorage.setItem(
        scrollKey,
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      );
    };

    // Save on every scroll (debounced)
    let timer;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(saveScroll, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Handle scroll on route change
  useEffect(() => {
    if (isPopState.current) {
      // Browser back/forward: restore saved position
      const scrollKey = `scroll_${key}`;
      const saved = sessionStorage.getItem(scrollKey);

      if (saved) {
        try {
          const { x, y } = JSON.parse(saved);
          // Use requestAnimationFrame to ensure the DOM has rendered
          requestAnimationFrame(() => {
            window.scrollTo(x, y);
          });
        } catch {
          window.scrollTo(0, 0);
        }
      } else {
        window.scrollTo(0, 0);
      }

      isPopState.current = false;
    } else if (hash) {
      // Hash link: scroll to the element
      const id = hash.replace("#", "");
      // Wait for DOM to render the target element
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo(0, 0);
        }
      });
    } else {
      // Forward navigation (link click): scroll to top
      window.scrollTo(0, 0);
    }

    prevKeyRef.current = key;
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
