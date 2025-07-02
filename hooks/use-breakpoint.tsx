import { useEffect, useState } from "react";

type Breakpoint = "mobile" | "laptop" | "desktop";

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "desktop"; // SSR safety
    return getBreakpoint(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 설정

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return breakpoint;
}

function getBreakpoint(width: number): Breakpoint {
  if (width < 768) return "mobile";
  if (width < 1280) return "laptop";
  return "desktop";
}
