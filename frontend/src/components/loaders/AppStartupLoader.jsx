import { useEffect, useState } from "react";
import BrandLoader from "./BrandLoader";

const AppStartupLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.classList.add("startup-loading");

    const timer = setTimeout(() => {
      setVisible(false);
      document.body.classList.remove("startup-loading");
    }, 3100);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove("startup-loading");
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="brand-startup-overlay" aria-hidden="true">
      <BrandLoader label="" startup fullscreen />
    </div>
  );
};

export default AppStartupLoader;
