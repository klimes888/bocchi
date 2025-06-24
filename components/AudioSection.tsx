"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import Image from "next/image";

import LP from "@/assets/LP.png";
import seishun from "@/assets/music/seisyun_complex.webp";
import { transform } from "next/dist/build/swc/generated-native";

const audioDatas = [
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "(2022-10-12)",
    audio: "/audio/seisyun_complex.mp3",
  },
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "2022-10-12",
    audio: "/audio/seisyun_complex.mp3",
  },
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "2022-10-12",
    audio: "/audio/seisyun_complex.mp3",
  },
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "2022-10-12",
    audio: "/audio/seisyun_complex.mp3",
  },
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "2022-10-12",
    audio: "/audio/seisyun_complex.mp3",
  },
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "2022-10-12",
    audio: "/audio/seisyun_complex.mp3",
  },
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "2022-10-12",
    audio: "/audio/seisyun_complex.mp3",
  },
];

export default function AudioSection() {
  const containerCenter = window.innerWidth / 2; // center fix
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const scrollXRef = useRef(0);

  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const fadeInAudio = (
    audio: HTMLAudioElement,
    duration: number = 2000,
    maxVolume: number = 1
  ) => {
    let volume = 0;
    const step = 50; // ms
    const increment = maxVolume / (duration / step);

    audio.volume = 0;
    audio.play().catch(console.warn);

    const interval = setInterval(() => {
      volume += increment;
      if (volume >= maxVolume) {
        audio.volume = maxVolume;
        clearInterval(interval);
      } else {
        audio.volume = volume;
      }
    }, step);
  };

  // 상수
  useEffect(() => {
    scrollXRef.current = scrollX;
  }, [scrollX]);

  useEffect(() => {
    let isInSection = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInSection = entry.isIntersecting;
      },
      {
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleWheel = (e: WheelEvent) => {
      if (!innerRef.current || !isInSection) return;

      const maxScroll = innerRef.current.scrollWidth - window.innerWidth;
      const currentX = scrollXRef.current;

      if (currentX >= maxScroll && e.deltaY > 0) {
        return; // Allow default scroll (down)
      } else if (currentX <= 0 && e.deltaY < 0) {
        return; // Allow default scroll (up)
      }

      e.preventDefault(); // Horizontal scroll

      setScrollX((prev) => {
        const next = Math.min(Math.max(prev + e.deltaY, 0), maxScroll);
        return next;
      });
    };

    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      observer.disconnect();
      section.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (innerRef.current) {
      const result = innerRef.current.getBoundingClientRect();
      if (result.width <= scrollX) return;
      innerRef.current.style.transform = `translateX(-${scrollX}px)`;
    }

    if (sectionRef.current && innerRef.current) {
      const children = Array.from(innerRef.current.children);

      let closestIndex = 0;
      let minDistance = Infinity;

      children.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(containerCenter - itemCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    }
  }, [scrollX]);

  useEffect(() => {
    if (!audioRefs.current.length) return;

    audioRefs.current.forEach((audio, i) => {
      if (!audio) return;
      if (i === activeIndex) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.warn("Audio play failed", e));
        fadeInAudio(audio, 3000, 0.8);
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!isAllowedToPlay || !audioRefs.current) return;
    fadeInAudio(audioRefs.current[0], 3000, 0.8);
    audioRefs.current[0].play().catch((e) => {
      console.warn("Auto-play error:", e);
    });
  }, [isAllowedToPlay, audioRefs]);

  useEffect(() => {
    const enableAudio = () => {
      setIsAllowedToPlay(true);
      removeListeners(); // 한 번만 감지되게
    };

    const removeListeners = () => {
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("keydown", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
    };

    // 상호작용 감지
    window.addEventListener("click", enableAudio, { once: true });
    window.addEventListener("keydown", enableAudio, { once: true });
    window.addEventListener("touchstart", enableAudio, { once: true });

    return () => {
      removeListeners();
    };
  }, []);

  return (
    <Section id="section4">
      <HorizontalSection ref={sectionRef}>
        <HorizontalInner ref={innerRef}>
          {audioDatas.map(({ title, desc, date, audio }, i) => (
            <ItemLayout
              key={i}
              $isFirst={i === 0}
              $isLast={i === audioDatas.length - 1}
              $active={i === activeIndex && isAllowedToPlay}
            >
              <ItemWrap>
                <ItemContent $active={i === activeIndex && isAllowedToPlay}>
                  <ItemContentInner
                    $active={i === activeIndex && isAllowedToPlay}
                  >
                    <ImageWrap src={LP} alt="" />
                    <AlbumWrap>
                      <Album src={seishun} alt="" />
                    </AlbumWrap>
                  </ItemContentInner>
                </ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDesc>{desc}</ItemDesc>
                <ItemDate>{date}</ItemDate>
              </ItemWrap>
              <audio
                autoPlay
                ref={(el) => {
                  if (el) audioRefs.current[i] = el;
                }}
                src={audio} // 오디오 파일 개별 설정
                preload="auto"
              />
            </ItemLayout>
          ))}
        </HorizontalInner>
      </HorizontalSection>
      {!isAllowedToPlay && (
        <InteractWrap
          onClick={() => {
            setIsAllowedToPlay(true);
          }}
        />
      )}
    </Section>
  );
}

const InteractWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #f1f1f1;
  opacity: 0.4;
  z-index: 1;
`;

// Styled Components
const Section = styled.section<{ $background?: string }>`
  position: relative;
  /* padding: 4rem 1rem; */
  width: 100%;
  height: 100vh;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HorizontalSection = styled.section`
  display: flex;
  width: 100%;
  height: 100%;
`;

const HorizontalInner = styled.div`
  display: flex;
  column-gap: 14rem;
`;

const ItemLayout = styled.div<{
  $isLast: boolean;
  $isFirst: boolean;
  $active: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30rem;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  margin-left: ${({ $isFirst }) => ($isFirst ? `30rem` : "0")};
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to{
    transform: rotate(360deg)
   }
`;

const ItemWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ItemTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 2.5rem;
`;

const ItemDesc = styled.h4`
  font-size: 1rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 1rem;
`;

const ItemDate = styled.span`
  font-size: 0.9rem;
  font-weight: 400;
  color: #222;
`;

const ItemContent = styled.div<{ $active: boolean }>`
  position: relative;
  width: 10rem;
  height: 10rem;
  margin-bottom: 1.5rem;
  ${({ $active }) =>
    $active &&
    css`
      animation: ${rotate} 5s linear infinite;
    `}
`;
const ItemContentInner = styled.div<{ $active: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease;
  ${({ $active }) =>
    $active
      ? css`
          transform: rotateX(0) rotateY(0);
        `
      : css`
          transform: rotateX(40deg) rotateY(40deg);
        `}
`;

const ImageWrap = styled(Image)`
  width: 100%;
  width: 10rem;
  object-fit: contain;
`;

const AlbumWrap = styled.div`
  position: absolute;
  display: flex;
  width: 6rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
`;

const Album = styled(Image)`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  max-width: 6rem;
  max-height: 6rem;
  object-fit: cover;
  overflow: hidden;
`;
