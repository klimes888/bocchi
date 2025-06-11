"use client";

import type React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";

import { ChevronDown, Music, Guitar, Mic } from "lucide-react";
import Image from "next/image";
import { animations } from "@/lib/styled-animations";

export default function MainSection() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <HeroSection>
      <HeroBackground />
      <HeroImage
        src="/placeholder.svg?height=800&width=1200"
        alt="Kessoku Band"
        fill
      />
      <HeroContent>
        <div>
          <h1>Welcome to</h1>
          <h2>Bocchi the Rock!</h2>
          <p className="subtitle">Fan Page</p>
        </div>
        <JapaneseText $isAnimating={isAnimating}>
          孤独だけどロックしてる！
          <br />
          <span>(Lonely, but we rock!)</span>
        </JapaneseText>
        <IconContainer>
          <Guitar />
          <Mic />
          <Music />
        </IconContainer>
      </HeroContent>
      <ScrollIndicator>
        <ChevronDown />
      </ScrollIndicator>
    </HeroSection>
  );
}

// Styled Components
const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background: ${(props) => props.theme.colors.gradients.hero};
`;

const HeroImage = styled(Image)`
  object-fit: cover;
  opacity: 0.3;
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

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  animation: ${animations.bounce} 2s infinite;

  svg {
    width: 2rem;
    height: 2rem;
    color: ${(props) => props.theme.colors.gray[600]};
  }
`;
