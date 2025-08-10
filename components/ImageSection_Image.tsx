"use client";
import styled from "styled-components";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function ImageSectionImage({ data }: { data: any[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [wheel, setWheel] = useState(0);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(false);

  const prevScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  // 가시성 판정 + Δ스크롤만큼 wheel 누적
  const handleScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - prevScrollY.current;
    prevScrollY.current = currentY;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight;
    const trigger = winH / 2;
    const inView = rect.top <= trigger + 50 && rect.bottom >= trigger - 50;

    if (!inView) {
      // 화면을 벗어나면 활성 끄고 종료
      if (active) setActive(false);
      return;
    }

    if (!active) {
      setActive(true);
      // inView 진입 시 height 없으면 채워두기
      if (!height) setHeight(rect.height);
    }

    // inView 상태에서만 스크롤 델타 반영
    if (delta !== 0) {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setWheel((prev) => {
          const next = prev + delta;
          return Math.max(0, Math.min(next, height || rect.height));
        });
      });
    }
  };

  // window scroll 리스너(한 번만 등록)
  useEffect(() => {
    // 초기 스냅샷
    prevScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    // 최초 한 번 체크
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // 요소 높이 변화 대응 (글자 줄바꿈/리사이즈 등)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      setHeight(h);
      // wheel 클램프
      setWheel((prev) => Math.max(0, Math.min(prev, h)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 렌더용 클램프
  const clampedWheel = Math.max(0, Math.min(Math.ceil(wheel), height));

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
  /* window 스크롤을 사용하므로 여기 overflow는 기본값으로 두는 게 자연스러움 */
`;

const ImageItem = styled.img<{ $height?: number }>`
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const ImageItemInner = styled.div<{ $height: number }>`
  position: absolute;
  inset: 0 0 auto 0;
  width: 100%;
  height: ${({ $height }) => $height}px;
  overflow: hidden;
`;
