import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolles to the top when the path changes
// See: https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
