"use client";
import styled from "styled-components";

// assets
import Back from "@/assets/background.jpg";
import LogoText from "@/assets/Logo_Text.png";
import Kessoku from "@/assets/kessoku.png";
import MainMb from "@/assets/mb_main.jpg";
// import { useDragDetect } from "@/hooks/use-drag";
import { useLayoutEffect, useRef, useState } from "react";
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
  // hooks
  // useDragDetect({
  //   threshold: 0.2,
  //   curPos: "section1",
  //   where: "section2",
  // });
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
            <Image src={MainMb.src} alt="" />
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

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 8rem;
`;

const Logo = styled.img`
  height: 100%;
`;
