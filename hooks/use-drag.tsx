"use client";
import { useEffect, useLayoutEffect, useRef } from "react";

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

  useLayoutEffect(() => {
    const section = document.getElementById(curPos);
    if (!section) return;

    const goToNextSection = () => {
      const nextSection = document.getElementById(where);
      nextSection?.scrollIntoView({ behavior: "smooth" });
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
      }, 50);
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
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [curPos, where, threshold]);
}
