import { useEffect, useRef } from "react";
import ScrollToTop from "./components/common/ScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import AppStartupLoader from "./components/loaders/AppStartupLoader";
import SeoHead from "./components/common/SeoHead";
import { logout } from "./store/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        dispatch(logout());
      }, 3600000); // 1 hour in milliseconds
    };

    // Initialize timer
    resetTimer();

    // Listen for activity events
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <ScrollToTop />
      <SeoHead />
      <AppRoutes />
      <AppStartupLoader />
    </>
  );
};

export default App;
