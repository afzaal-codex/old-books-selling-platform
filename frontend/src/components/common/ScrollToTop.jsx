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

  // Handle scroll on route change
  useEffect(() => {
    // 1. Save scroll position of the previous page
    if (prevKeyRef.current) {
      const scrollKey = `scroll_${prevKeyRef.current}`;
      sessionStorage.setItem(
        scrollKey,
        JSON.stringify({ x: window.scrollX, y: window.scrollY })
      );
    }

    if (isPopState.current) {
      // Browser back/forward: restore saved position
      const scrollKey = `scroll_${key}`;
      const saved = sessionStorage.getItem(scrollKey);

      if (saved) {
        try {
          const { x, y } = JSON.parse(saved);
          let attempts = 0;
          const maxAttempts = 40; // retry for up to 2 seconds for async content
          const tryScroll = () => {
            window.scrollTo(x, y);
            const reachedTarget = Math.abs(window.scrollY - y) < 5;
            const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
            if (!reachedTarget && !reachedBottom && attempts < maxAttempts) {
              attempts++;
              setTimeout(tryScroll, 50);
            }
          };
          tryScroll();
        } catch {
          window.scrollTo(0, 0);
        }
      } else {
        window.scrollTo(0, 0);
      }

      isPopState.current = false;
    } else if (hash) {
      // Hash link: scroll to the element with retry for async elements
      const id = hash.replace("#", "");
      let attempts = 0;
      const maxAttempts = 40;
      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 50);
        } else {
          window.scrollTo(0, 0);
        }
      };
      tryScroll();
    } else {
      // Forward navigation: scroll to top immediately
      window.scrollTo(0, 0);
    }

    prevKeyRef.current = key;
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;
