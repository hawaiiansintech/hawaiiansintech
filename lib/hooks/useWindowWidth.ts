import debounce from "lodash/debounce";
import { useEffect, useState } from "react";

export default function useWindowWidth(delay = 75) {
  const [width, setWidth] = useState(undefined);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    const debouncedHandleResize = debounce(handleResize, delay);
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [delay]);

  return width;
}
