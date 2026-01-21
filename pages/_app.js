import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "../pages/globals.css";

function MyApp({ Component, pageProps }) {
  const startYRef = useRef(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      if (window.scrollY !== 0) return;
      startYRef.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      if (isRefreshingRef.current) return;
      if (startYRef.current === null) return;
      if (window.scrollY !== 0) return;

      const currentY = event.touches[0].clientY;
      const delta = currentY - startYRef.current;

      if (delta > 90) {
        isRefreshingRef.current = true;
        window.location.reload();
      }
    };

    const handleTouchEnd = () => {
      startYRef.current = null;
      isRefreshingRef.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <div className="app-container">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
