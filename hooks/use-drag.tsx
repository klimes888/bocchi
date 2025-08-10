"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useBreakpoint } from "./use-breakpoint";

export function useDragDetect({
  threshold,
  curPos,
  where,
}: {
  threshold: number;
  curPos: string;
  where: string;
}) {
  const startY = useRef<number | null>(null);
  const deltaYSum = useRef(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollLockTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const breakPoint = useBreakpoint();

  const lockScroll = () => {
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.body.style.overflow = "";
  };

  useLayoutEffect(() => {
    const section = document.getElementById(curPos);
    if (!section) return;

    const goToNextSection = () => {
      lockScroll();
      const nextSection = document.getElementById(where);
      nextSection?.scrollIntoView({ behavior: "smooth" });

      if (scrollLockTimeout.current) clearTimeout(scrollLockTimeout.current);
      scrollLockTimeout.current = setTimeout(() => {
        unlockScroll();
      }, 500); // 1초 후 스크롤 다시 허용
    };

    // 터치 이벤트
    const handleTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (startY.current === null) return;
      const deltaY = startY.current - e.changedTouches[0].clientY;

      if (deltaY > threshold) goToNextSection();
      startY.current = null;
    };

    // 마우스 이벤트
    const handleMouseDown = (e: MouseEvent) => {
      startY.current = e.clientY;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (startY.current === null) return;
      const deltaY = startY.current - e.clientY;
      if (deltaY > threshold) goToNextSection();

      startY.current = null;
    };

    // wheel 이벤트
    const handleWheel = (e: WheelEvent) => {
      deltaYSum.current += e.deltaY;

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        if (deltaYSum.current > threshold) {
          goToNextSection();
        }
        deltaYSum.current = 0;
      }, 10);
    };

    section.addEventListener("touchmove", handleTouchStart, {
      passive: true,
    });
    section.addEventListener("touchend", handleTouchEnd);
    section.addEventListener("mousedown", handleMouseDown);
    section.addEventListener("mouseup", handleMouseUp);
    section.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchend", handleTouchEnd);
      section.removeEventListener("mousedown", handleMouseDown);
      section.removeEventListener("mouseup", handleMouseUp);
      section.removeEventListener("wheel", handleWheel);
      // unlockScroll();
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [curPos, where, threshold]);
}
