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
        <ImageWrap>
          <ImageWrapInnner ref={ref}>
            {/* <ScrollLoopVideo src="/bocchi_main.mp4" /> */}
            <div
              style={{
                display: "flex",
                position: "sticky",
                top: 0,
              }}
            >
              <video
                src="/bocchi_main.mp4"
                muted
                playsInline
                autoPlay={true}
                preload="metadata"
                crossOrigin="anonymous"
                // controls // 디버깅 시 켜두면 timeline 확인 용이
                style={{ width: "100%", objectFit: "cover" }}
              />
            </div>
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
  padding: 0.65rem 0.2rem;
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
