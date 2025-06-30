"use client";
import styled from "styled-components";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function ImageSectionImage({ data }: { data: any[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [wheel, setWheel] = useState(0);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(false);
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

    let animationFrameId: number;

    const handleWheel = (e: WheelEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        setWheel((prev) => {
          const next = prev + e.deltaY;
          return next < 0 ? 0 : next;
        });
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

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
