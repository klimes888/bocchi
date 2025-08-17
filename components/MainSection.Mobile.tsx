"use client";
import styled from "styled-components";

// assets
import Back from "@/assets/background.jpg";
import LogoText from "@/assets/Logo_Text.png";
import Kessoku from "@/assets/kessoku.png";
import MainMb from "@/assets/mb_main.jpg";

// import { useDragDetect } from "@/hooks/use-drag";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParallaxSticky } from "@/hooks/use-parallax";

const speed = 0.5,
  fromScale = 1.35,
  toScale = 1;

export default function MainSectionMobile({
  size,
}: {
  size: (flag: number) => void;
}) {
  const [heigh, setHeigh] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useParallaxSticky(sectionRef, ref, { speed, zoom: true, fromScale, toScale });

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const { height } = sectionRef.current.getBoundingClientRect();
    size(height);
    setHeigh(height);
  }, []);

  const Title = "BOCCHI THE\nROCK!";
  return (
    <HeroSection id="section1" ref={sectionRef}>
      <HeroSectionImageWrap>
        {/* <LogoWrap ref={logoRef}>
          <Logo src={Kessoku.src} alt="asd" />
        </LogoWrap> */}
        <ImageWrap>
          <ImageWrapInnner ref={ref}>
            <ScrollLoopVideo src="/bocchi_main.mp4" />
            {/* {heigh > 0 ?  : <></>} */}
            {/* <Image src={MainMb.src} alt="" /> */}
          </ImageWrapInnner>
        </ImageWrap>
        <TextWrap ref={textRef}>{Title}</TextWrap>
      </HeroSectionImageWrap>
    </HeroSection>
  );
}

// Styled Components
const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 300vh;
  min-height: 300vh;
  display: flex;
  background-color: #eca500;
`;

const HeroSectionImageWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  justify-content: center;
  align-items: center;
  top: 0;
  width: 100%;
  height: 100vh;
`;

const TextWrap = styled.p`
  font-family: "Trample Over Beauty", sans-serif;
  font-size: 3.6rem;
  font-weight: 900;
  line-height: 3rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.35rem 0.2rem;
`;

const ImageWrap = styled.div`
  width: 100%;
  overflow: hidden;
  z-index: 9;
`;

const ImageWrapInnner = styled.div`
  width: 100%;
`;

const Image = styled.img`
  width: 100%;
  object-fit: contain;
`;

type Props = {
  src: string;
  /** 비디오 1루프(0→끝) 당 필요한 스크롤 픽셀수 */
  pixelsPerLoop?: number;
  /** 섹션 높이(px). sticky 영역을 만들기 위한 여분 높이 */
  sectionHeight?: number;
};

export function ScrollLoopVideo({ src, pixelsPerLoop = 2000 }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const raf = useRef<number | null>(null);

  // 드래그 스크럽 상태
  const dragging = useRef(false);
  const startY = useRef<number>(0);
  const dragOffset = useRef<number>(0);
  const savedScrollYAtDragStart = useRef<number>(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => setDuration(v.duration || 100);
    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [videoRef.current]);

  useEffect(() => {
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v || !duration) return;

    v.pause();

    // 스크롤 → 목표 진행도(0~1) 계산
    const getTargetProgress = () => {
      const loops = window.scrollY / pixelsPerLoop;
      // 0~1 모듈러
      return ((loops % 1) + 1) % 1;
    };

    let target = getTargetProgress(); // 목표 진행도
    let prog = target; // 실제 반영 중인 진행도
    let stop = false;

    const easing = 0.15; // 보간 속도 (0.1~0.25 정도로 조절)
    const eps = 1e-3; // 변화 임계값

    const tickWithRAF = () => {
      if (stop) return;
      target = getTargetProgress();
      // lerp
      prog += (target - prog) * easing;
      if (Math.abs(target - prog) < eps) prog = target;

      v.currentTime = prog * duration;

      requestAnimationFrame(tickWithRAF);
    };

    const tickWithRVFC = (_now: number, _meta: VideoFrameCallbackMetadata) => {
      if (stop) return;
      target = getTargetProgress();
      prog += (target - prog) * easing;
      if (Math.abs(target - prog) < eps) prog = target;

      v.currentTime = prog * duration;

      v.requestVideoFrameCallback(tickWithRVFC);
    };

    // 보이는 동안만 루프 가동
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stop = false;
          if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
            v.requestVideoFrameCallback(tickWithRVFC as any);
          } else {
            requestAnimationFrame(tickWithRAF);
          }
        } else {
          stop = true;
        }
      },
      { threshold: 0 }
    );

    io.observe(el);

    // 스크롤 핸들러는 “루프에게 목표만 바꿔달라”고 알려주는 용도
    const onScroll = () => {
      target = getTargetProgress();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 초기 동기화
    v.currentTime = target * duration;

    return () => {
      io.disconnect();
      stop = true;
      window.removeEventListener("scroll", onScroll);
    };
  }, [duration, pixelsPerLoop]);

  return (
    <div
      ref={wrapRef}
      style={{
        display: "flex",
        justifyContent: "center",
        position: "sticky",
        top: 0,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
        // controls // 디버깅 시 켜두면 timeline 확인 용이
        style={{ width: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
