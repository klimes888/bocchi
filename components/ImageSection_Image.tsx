"use client";
import styled from "styled-components";

import { useEffect, useRef, useState } from "react";
import { Breakpoint } from "@/hooks/use-breakpoint";

export default function ImageSectionImage({
  data,
  breakPoint,
}: {
  data: any[];
  breakPoint: Breakpoint;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [wheel, setWheel] = useState(0);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(false);

  const rafId = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const prevScrollY = useRef(0);

  // 🌀 이미지 높이 기준으로 wheel 값을 제한
  const clampedWheel = Math.max(0, Math.min(Math.ceil(wheel), height));

  // 📦 스크롤 위치 감지 (위/아래)
  const handleScroll = () => {
    const currentY = window.scrollY;
    const isDown = currentY > prevScrollY.current;
    prevScrollY.current = currentY;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight / 2;

    const inView =
      rect.top <= triggerPoint + 50 && rect.bottom >= triggerPoint - 50;

    if (inView && !active) {
      setActive(true);
      setHeight(rect.height); // 필요한 시점에만 height 계산
    } else if (!inView && active) {
      if (!isDown && wheel <= 0) {
        setActive(false);
      }
    }
  };

  // 🎯 스크롤 이벤트
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 진입 체크
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active, wheel]);

  // 🎡 휠 이벤트
  useEffect(() => {
    if (!active) return;

    const onWheel = (e: WheelEvent) => {
      // 필요시 기본 스크롤 막기
      // e.preventDefault();
      rafId.current = requestAnimationFrame(() => {
        setWheel((prev) => Math.max(prev + e.deltaY, 0));
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };

    // Mobile: touch
    // const onTouchStart = (e: TouchEvent) => {
    //   // 첫 손가락만 사용
    //   startY.current = e.touches[0].clientY;
    // };

    // const onTouchMove = (e: TouchEvent) => {
    //   if (startY.current == null) return;
    //   // 페이지 기본 스크롤을 막고 가상 스크롤만 업데이트
    //   // e.preventDefault();
    //   const currentY = e.touches[0].clientY;
    //   const deltaY = startY.current - currentY; // 손가락 위로 올리면 +, 아래로 내리면 -
    //   rafId.current = requestAnimationFrame(() => {
    //     setWheel((prev) => Math.max(prev + deltaY, 0));
    //   });
    //   // 누적 이동이 되도록 기준점 갱신
    //   startY.current = currentY;
    // };

    // const onTouchEnd = () => {
    //   startY.current = null;
    // };

    // window.addEventListener("touchstart", onTouchStart, { passive: true });
    // window.addEventListener("touchmove", onTouchMove, { passive: false }); // preventDefault 위해 false
    // window.addEventListener("touchend", onTouchEnd, { passive: true });

    // return () => {
    //   window.removeEventListener("touchstart", onTouchStart);
    //   window.removeEventListener("touchmove", onTouchMove);
    //   window.removeEventListener("touchend", onTouchEnd);
    //   if (rafId.current) cancelAnimationFrame(rafId.current);
    // };
  }, [active, breakPoint, setWheel]);

  return (
    <ImageItemWrap ref={ref}>
      <ImageItemInner $height={clampedWheel}>
        <ImageItem
          src={data[1].src}
          $height={height}
          style={{ height: height ? height + "px" : "auto" }}
        />
      </ImageItemInner>
      <ImageItem
        src={data[0].src}
        style={{ height: height ? height + "px" : "auto" }}
      />
    </ImageItemWrap>
  );
}

const ImageItemWrap = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ImageItem = styled.img<{ $height?: number }>`
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const ImageItemInner = styled.div<{ $height: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ $height }) => $height}px;
  overflow: hidden;
`;
