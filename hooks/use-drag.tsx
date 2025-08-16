import { useEffect, useRef } from "react";

type Options = {
  sectionIds: string[];
  /** 섹션 하단에서 이만큼 위 지점에 센티넬(트리거) 설치(px) */
  triggerOffsetPx?: number;
  /** 스냅 후 재트리거 금지 시간(ms) */
  cooldownMs?: number;
  /** 센티넬 가시 임계값(0~1). 0이면 보이기만 해도 트리거 */
  threshold?: number;
  /** 센티넬 교차 여백. 하단을 당겨 일찍 트리거하려면 '0px 0px -15%' 등 */
  rootMargin?: string;
  /** 스냅 후 ‘어떤 스크롤이라도’ 재무장할지 (기본: 사용자 입력만) */
  rearmOnAnyScroll?: boolean;
};

export function useSectionAutoSnap({
  sectionIds,
  triggerOffsetPx = 120,
  cooldownMs = 900,
  threshold = 0.2,
  rootMargin = "0px 0px -10%",
  rearmOnAnyScroll = false,
}: Options) {
  // 전역 상태(해당 훅 인스턴스 내에서 공유)
  const snapping = useRef(false);
  const cooldownUntil = useRef(0);
  const userInteracted = useRef(false);
  const lastY = useRef(0);
  const dirDown = useRef(false);

  // 방향 + 사용자 입력 감지
  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      dirDown.current = y > lastY.current;
      lastY.current = y;
      if (rearmOnAnyScroll) userInteracted.current = true;
    };
    const markInteracted = () => {
      userInteracted.current = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", markInteracted, { passive: true });
    window.addEventListener("touchstart", markInteracted, { passive: true });
    window.addEventListener("keydown", markInteracted);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", markInteracted);
      window.removeEventListener("touchstart", markInteracted);
      window.removeEventListener("keydown", markInteracted);
    };
  }, [rearmOnAnyScroll]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length < 2) return;

    // 각 섹션 하단에 얇은 센티넬 설치
    const sentinels: HTMLDivElement[] = [];
    const originalPos: string[] = [];

    sections.forEach((sec, idx) => {
      originalPos[idx] = sec.style.position;
      if (getComputedStyle(sec).position === "static") {
        sec.style.position = "relative";
      }
      const s = document.createElement("div");
      s.style.position = "absolute";
      s.style.left = "0";
      s.style.right = "0";
      s.style.height = "1px";
      s.style.bottom = `${triggerOffsetPx}px`;
      s.style.pointerEvents = "none";
      s.dataset.index = String(idx);
      sec.appendChild(s);
      sentinels.push(s);
    });

    const getActiveIndexByCenter = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].offsetTop;
        const bottom = top + sections[i].offsetHeight;
        if (mid >= top && mid < bottom) {
          idx = i;
          break;
        }
      }
      return idx;
    };

    const io = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        const cooled = now >= cooldownUntil.current;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const sentinel = entry.target as HTMLDivElement;
          const i = Number(sentinel.dataset.index);
          if (!Number.isFinite(i)) return;
          if (i >= sections.length - 1) return; // 마지막 섹션이면 스킵
          if (!dirDown.current) return; // 위로 스크롤이면 스킵
          if (!userInteracted.current) return; // 사용자 입력 없으면 스킵
          if (snapping.current || !cooled) return; // 스냅 중/쿨다운 중이면 스킵

          // 현재 화면 중앙이 가리키는 섹션이 i일 때만 다음으로
          if (getActiveIndexByCenter() !== i) return;

          // 스냅!
          snapping.current = true;
          cooldownUntil.current = now + cooldownMs;
          userInteracted.current = false; // 다음 동작 전 새 입력 필요

          sections[i + 1].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // scrollend(지원 브라우저) + 타임아웃 병행
          const end = () => {
            snapping.current = false;
          };
          const onScrollEnd = () => {
            window.removeEventListener("scrollend", onScrollEnd);
            end();
          };
          window.addEventListener("scrollend", onScrollEnd, { once: true });
          window.setTimeout(end, cooldownMs);
        });
      },
      { root: null, threshold, rootMargin }
    );

    sentinels.forEach((s) => io.observe(s));

    return () => {
      io.disconnect();
      sentinels.forEach((s, idx) => {
        s.parentElement?.removeChild(s);
        sections[idx].style.position = originalPos[idx];
      });
    };
  }, [sectionIds, triggerOffsetPx, cooldownMs, threshold, rootMargin]);
}
