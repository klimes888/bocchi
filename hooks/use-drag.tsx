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

  // useEffect(() => {
  //   const section = document.getElementById(curPos);
  //   if (!section) return;

  //   const handleWheel = (e: WheelEvent) => {
  //     const atTop = section.scrollTop === 0;
  //     const atBottom =
  //       section.scrollTop + section.clientHeight >= section.scrollHeight;

  //     const goingDown = e.deltaY > 0;
  //     const goingUp = e.deltaY < 0;

  //     // 아래로 스크롤하는 경우 → bottom에 도달하지 않았을 때만 scrollBy 적용
  //     // 위로 스크롤하는 경우 → top에 도달하지 않았을 때만 scrollBy 적용
  //     const shouldScroll = (goingDown && !atBottom) || (goingUp && !atTop);

  //     if (shouldScroll) {
  //       e.preventDefault();
  //       section.scrollTop += e.deltaY * 0.3;
  //       // section.scrollBy({ top: e.deltaY * 0.3 });
  //     }
  //   };

  //   section.addEventListener("wheel", handleWheel, { passive: false });
  //   return () => section.removeEventListener("wheel", handleWheel);
  // }, [curPos]);

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
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    };
  }, [curPos, where, threshold]);
}
