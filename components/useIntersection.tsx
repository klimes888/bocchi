import { useEffect } from "react";

export const useIntersectionObserver = (
  ref: React.RefObject<any>,
  threshold: number = 0.9,
  func: { isEnter?: () => void; elseFunc?: () => void }
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!ref.current) return;

        if (entry.isIntersecting) {
          if (!func.isEnter) return;
          func.isEnter();
        } else {
          if (!func.elseFunc) return;
          func.elseFunc();
        }
      },
      { threshold }
    );

    const target = ref.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [ref, threshold]);
};
