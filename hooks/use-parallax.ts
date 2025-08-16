import { useRef, useEffect } from "react";

export function useParallaxSticky(
  containerRef: React.RefObject<HTMLElement | null>, // 진행도 계산 기준(= 300vh 섹션)
  targetRef: React.RefObject<HTMLElement | null>, // transform 적용 대상(이미지 래퍼)
  { speed = 0.25, zoom = true, fromScale = 1.15, toScale = 1 } = {}
) {
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    const update = () => {
      const vh = window.innerHeight;
      const rect = container.getBoundingClientRect();

      // 문서 기준 위치
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = container.offsetHeight; // 300vh
      const y = window.scrollY;

      // sticky 섹션이 뷰포트 상에서 시작할 때 0, 끝날 때 1
      const startY = sectionTop;
      const endY = sectionTop + sectionHeight - vh; // sticky가 끝나는 지점
      const progress = clamp01((y - startY) / Math.max(1, endY - startY));

      // 패럴랙스 translate (원하면 사용)
      const distance = (sectionHeight - vh) * speed; // 섹션 진행만큼 이동량
      const ty = -distance * progress;

      // 줌(contain→cover 느낌은 scale로 근사)
      const scale = zoom ? fromScale + (toScale - fromScale) * progress : 1;

      target.style.transform = `translate3d(0, ${zoom ? 0 : ty}px, 0) scale(${
        zoom ? scale : 1
      })`;
      target.style.willChange = "transform";
    };

    const onScroll = () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(update);
    };

    // 처음 한 번, 이후 스크롤/리사이즈마다
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [containerRef, targetRef, speed, zoom, fromScale, toScale]);
}

type ParallaxOpts = {
  speed?: number; // 패럴랙스 속도 (양수/음수)
  zoom?: boolean; // 줌아웃 효과 on/off
  fromScale?: number; // 시작 스케일 (줌아웃 시작값)
  toScale?: number; // 끝 스케일
};

export function useParallax(
  ref: React.RefObject<HTMLElement>,
  {
    speed = 0.00000001,
    zoom = true,
    fromScale = 1.2,
    toScale = 1.0,
  }: ParallaxOpts = {}
) {
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const s = window.scrollY;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // 패럴랙스 이동
      const ty = -s * speed;
      console.log("ty", ty);
      // 진행도(0~1)
      const center = rect.top + rect.height / 2;
      const dist = Math.min(
        Math.max(Math.abs(center - vh / 2) / (vh / 2), 0),
        1
      );
      const progress = 1 - dist;

      // 줌 아웃 스케일
      const scale = zoom ? fromScale + (toScale - fromScale) * progress : 1;

      el.style.transform = `translate3d(0, ${ty}px, 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
      }
      raf.current = requestAnimationFrame(update);
    };

    const onResize = () => {
      // 위치가 바뀌었을 수 있으니 바로 업데이트
      onScroll();
    };

    // 초기 1회
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf.current) cancelAnimationFrame(raf.current!);
    };
  }, [ref, speed, zoom, fromScale, toScale]);
}
