"use client";
import type React from "react";
import styled from "styled-components";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { animations } from "@/lib/styled-animations";

// assets
import Back from "@/assets/background.jpg";
import LogoText from "@/assets/Logo_Text.png";
import Kessoku from "@/assets/kessoku.png";

export default function MainSection() {
  return (
    <HeroSection>
      <HeroImage src={Back} alt="Kessoku Band" fill />
      <TitleLoggWrap>
        <TitleLogo src={LogoText} alt="" />
      </TitleLoggWrap>
      <HeroBackground />
      <BocchiFont>
        <TitleLogo src={Kessoku} alt="" />
      </BocchiFont>
      <BlackLayout
        style={{
          top: "-10em",
        }}
        $type="top"
      />
      <HeroContent>
        {/* <div>
          <h1>Welcome to</h1>
          <h2>Bocchi the Rock!</h2>
          <p className="subtitle">Fan Page</p>
        </div> */}
        {/* <JapaneseText $isAnimating={isAnimating}>
          孤独だけどロックしてる！
          <br />
          <span>(Lonely, but we rock!)</span>
        </JapaneseText> */}
        {/* <IconContainer>
          <Guitar />
          <Mic />
          <Music />
        </IconContainer> */}
      </HeroContent>
      <BlackLayout style={{ bottom: "-10em" }} />
      <ScrollIndicatorWrap>
        <ScrollIndicator $delay="50ms" style={{ bottom: "5%" }}>
          <ChevronDown color="white" />
        </ScrollIndicator>
        <ScrollIndicator $delay="0ms" style={{ bottom: "50%" }}>
          <ChevronDown color="white" />
        </ScrollIndicator>
      </ScrollIndicatorWrap>
    </HeroSection>
  );
}

// Styled Components
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  /* background: rgba(0, 0, 0, 0.3); */
  animation: ${animations.fadeInBlack} 0.5s forwards;
`;

const HeroImage = styled(Image)`
  object-fit: cover;
  opacity: 0.9;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 1rem;

  h1 {
    font-size: 3.75rem;
    font-weight: bold;
    background: ${(props) => props.theme.colors.gradients.text};
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: ${animations.pulse} 2s infinite;
    margin-bottom: 1rem;

    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
      font-size: 6rem;
    }
  }

  h2 {
    font-size: 2.25rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.gray[800]};
    margin-bottom: 1rem;

    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
      font-size: 3.75rem;
    }
  }

  .subtitle {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.gray[700]};

    @media (min-width: ${(props) => props.theme.breakpoints.md}) {
      font-size: 1.875rem;
    }
  }
`;

const JapaneseText = styled.div<{ $isAnimating: boolean }>`
  font-size: 1.25rem;
  color: ${(props) => props.theme.colors.gray[600]};
  font-weight: 500;
  transition: all 0.5s ease;
  margin: 2rem 0;

  ${(props) =>
    props.$isAnimating &&
    `
    transform: scale(1.1);
    color: ${props.theme.colors.primary.pink};
  `}

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
  }

  span {
    font-size: 1rem;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  svg {
    width: 2rem;
    height: 2rem;
    animation: ${animations.bounce} 2s infinite;

    &:nth-child(1) {
      color: ${(props) => props.theme.colors.primary.pink};
    }
    &:nth-child(2) {
      color: ${(props) => props.theme.colors.primary.yellow};
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      color: ${(props) => props.theme.colors.primary.blue};
      animation-delay: 0.2s;
    }
  }
`;

const ScrollIndicatorWrap = styled.div`
  position: absolute;
  bottom: 4%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  z-index: 999;
`;

const ScrollIndicator = styled.div<{ $delay: string }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  animation: ${animations.bounce} 2s infinite;
  animation-delay: ${({ $delay }) => $delay};
  padding: -1em 0;
  svg {
    width: 2rem;
    height: 2rem;
    color: ${(props) => props.theme.colors.gray[600]};
  }
`;

const TitleLoggWrap = styled.div`
  position: absolute;
  top: 0;
  left: -10em;
  bottom: 0;
  display: flex;
  width: auto;
  height: 100vh;
  z-index: 10;
  transform: rotate(180deg);
  animation: ${animations.fadeInRight} 0.5s forwards 0.7s ease;
  filter: drop-shadow(0em 0em 0.8em rgba(234, 179, 8, 0.5));
`;

const TitleLogo = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const BlackLayout = styled.div<{ $type?: "top" | "bottom" }>`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 5em;
  background-color: #000;
  z-index: 9;
  animation: ${({ $type }) =>
      $type === "top" ? animations.fadeInTop : animations.fadeInBottom}
    0.5s forwards 0.5s;
`;

const BocchiFont = styled.div`
  position: absolute;
  bottom: 12%;
  right: 3%;
  width: 20%;
  filter: drop-shadow(0.25em 0.25em 0.8em rgba(236, 72, 153, 0.8));
  opacity: 0;
  animation: ${animations.fadeInBig} 0.5s forwards 0.9s ease-in-out;
`;
