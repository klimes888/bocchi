"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import Image from "next/image";
import Lottie from "lottie-react";

import LP from "@/assets/LP.png";
import seishun from "@/assets/music/seisyun_complex.webp";
import distortion from "@/assets/music/distortion.webp";
import karakara from "@/assets/music/karakara.webp";
import naniga_warui from "@/assets/music/naniga_warui.webp";
import rocknroll from "@/assets/music/rocknroll.webp";

import TOUCH_LOTT from "@/assets/icons/touch.json";
import { useIntersectionObserver } from "./useIntersection";

const audioDatas = [
  {
    title: "青春コンプレックス",
    desc: "청춘 콤플렉스 / seisyun complex",
    date: "(2022-10-12)",
    audio: "/audio/seisyun_complex.mp3",
    img: seishun,
  },
  {
    title: "Distortion!!",
    desc: "디스토션!! / ディストーション!!",
    date: "(2022-10-09)",
    audio: "/audio/distortion.mp3",
    img: distortion,
  },
  {
    title: "カラカラ",
    desc: "달각달각 / Karakara",
    date: "(2022-10-29)",
    audio: "/audio/karakara.mp3",
    img: karakara,
  },
  {
    title: "なにが悪い",
    desc: "뭐가 나빠 / What is wrong with",
    date: "(2022-11-27)",
    audio: "/audio/naniga_warui.mp3",
    img: naniga_warui,
  },
  {
    title: "転がる岩、君に朝が降る",
    desc: "구르는 바위, 네게 아침이 내린다 / Rockn' Roll, Morning Light Falls on You",
    date: "(2022-12-25)",
    audio: "/audio/rocknroll.mp3",
    img: rocknroll,
  },
];

const LottieFile = () => (
  <LottieWrap>
    <Lottie
      animationData={TOUCH_LOTT}
      loop={true}
      autoplay={true}
      color="#fff"
    />
  </LottieWrap>
);

type Props = {
  frontSection: number;
};

export default function AudioSection({ frontSection }: Props) {
  const containerCenter = window.innerWidth / 2; // center fix

  // ref
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const isInSection = useRef(false);
  const isAllowedRef = useRef(false);

  // state
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadPage, setLoadPage] = useState(false);
  const [itemSize, setItemSize] = useState(0);
  const [maxHeight, setMaxHeight] = useState(1000);
  const [firstClick, setFirstClick] = useState(false);

  useEffect(() => {
    isAllowedRef.current = isAllowedToPlay;
  }, [isAllowedToPlay]);

  useIntersectionObserver(sectionRef, 0.95, {
    isEnter: () => {
      setLoadPage(true);
      isInSection.current = true;
    },
  });
  useIntersectionObserver(sectionRef, 0.25, {
    elseFunc: () => {
      setLoadPage(false);
      isInSection.current = false;
    },
  });

  const fadeInAudio = (
    audio: HTMLAudioElement,
    duration: number = 2000,
    maxVolume: number = 1
  ) => {
    let volume = 0;
    const step = 50; // ms
    const increment = maxVolume / (duration / step);

    audio.volume = 0;

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

  const fadeOutAudio = (audio: HTMLAudioElement, duration: number = 2000) => {
    let volume = audio.volume;
    const step = 50;
    const decrement = volume / (duration / step);

    const interval = setInterval(() => {
      volume -= decrement;
      if (volume <= 0) {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        clearInterval(interval);
      } else {
        audio.volume = volume;
      }
    }, step);
  };

  // 상수
  useEffect(() => {
    if (!firstClick) return;

    const curSecStart = -(frontSection * window.innerHeight) + scrollX;
    if (-curSecStart >= window.innerHeight / 2.4) {
      // 스크롤 위로 올렸을 때,
      setIsAllowedToPlay(false);
      setActiveIndex(null);
    } else if (curSecStart > maxHeight - window.innerWidth) {
      setIsAllowedToPlay(false);
      setActiveIndex(null);
    } else {
      setIsAllowedToPlay(true);
    }
  }, [scrollX, maxHeight, firstClick]);

  useEffect(() => {
    if (!innerRef.current) return;
    const maxScroll = innerRef.current.scrollWidth + window.innerWidth / 1.2;
    setMaxHeight(maxScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollX(scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sectionStart = (frontSection - frontSection / 4) * window.innerWidth;
  const relativeScroll = scrollX - sectionStart; // 현재 섹션 기준 위치

  const progress =
    Math.min(Math.max((relativeScroll * 2) / maxHeight, 0), 1) * 2; // 0 ~ 1 정규화
  const colorValue = Math.floor(progress * 255);

  useEffect(() => {
    if (!innerRef.current) return;
    // 이전 섹션들 width 만큼 오른쪽으로 이동
    const prevSectionW = frontSection * window.innerWidth;
    innerRef.current.style.transform = `translateX(${
      prevSectionW - window.innerWidth - scrollX
    }px)`;

    const containerCenter = window.innerWidth / 2;
    const children = Array.from(innerRef.current.children);

    let closestIndex = 0;
    let minDistance = Infinity;

    // if (prevSectionW / 2 >= scrollX) return;
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
  }, [scrollX, isAllowedToPlay]);

  useEffect(() => {
    if (!audioRefs.current.length) return;
    audioRefs.current.forEach((audio, i) => {
      if (!audio) return;
      if (activeIndex === null || !isAllowedToPlay) {
        fadeOutAudio(audio, 1000);
        return;
      }

      if (i === activeIndex) {
        audio.currentTime = 0;
        audio.play().catch((e) => console.warn("Audio play failed", e));
        fadeInAudio(audio, 2000, 0.8);
      } else {
        fadeOutAudio(audio, 1000);
      }
    });
  }, [activeIndex, isAllowedToPlay]);

  return (
    <Section id="section4" ref={sectionRef} $height={maxHeight}>
      <HorizontalSection>
        <HorizontalInner ref={innerRef}>
          {audioDatas.map(({ title, desc, date, audio, img }, i) => (
            <ItemLayout
              key={i}
              $isFirst={i === 0}
              $isLast={i === audioDatas.length - 1}
              $active={i === activeIndex && isAllowedToPlay}
              $margin={(containerCenter + itemSize) / 2}
            >
              <ItemWrap $colorValue={colorValue || 0}>
                <ItemContent $active={i === activeIndex && isAllowedToPlay}>
                  <ItemContentInner
                    $active={i === activeIndex && isAllowedToPlay}
                  >
                    <ImageWrap src={LP} alt="" />
                    <AlbumWrap>{img && <Album src={img} alt="" />}</AlbumWrap>
                  </ItemContentInner>
                </ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDesc>{desc}</ItemDesc>
                <ItemDate>{date}</ItemDate>
              </ItemWrap>
              <audio
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
          onClick={(e) => {
            // sectionRef.current?.scrollIntoView({ behavior: "smooth" });
            // setIsAllowedToPlay(true);
            setFirstClick(true);
          }}
        >
          {/* <LottieFile /> */}
        </InteractWrap>
      )}
    </Section>
  );
}

const InteractWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

// Styled Components
const Section = styled.section<{ $height: number }>`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height}px;
  display: flex;
  background: linear-gradient(180deg, #fdf2f8, #fdf2f8, #fdf2f8, #222, #222);
  padding-top: 5em;
  padding-bottom: 30em;
`;

const HorizontalSection = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
`;

const HorizontalInner = styled.div`
  display: flex;
  column-gap: 12rem;
  animation: transform 0.8s ease;
`;

const ItemLayout = styled.div<{
  $isLast: boolean;
  $isFirst: boolean;
  $active: boolean;
  $margin: number;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30rem;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  /* margin-left: ${({ $isFirst, $margin }) => {
    return $isFirst ? $margin : "0";
  }}px;
  margin-right: ${({ $isLast, $margin }) => {
    return $isLast ? $margin : "0";
  }}px; */
  z-index: 1;
  user-select: none;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg)
  }
  to{
    transform: rotate(360deg)
   }
`;

const ItemWrap = styled.div<{ $colorValue: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    color: ${({ $colorValue }) =>
      `rgba(${$colorValue}, ${$colorValue}, ${$colorValue}, 1)`};
  }
`;

const ItemTitle = styled.p`
  font-size: 2.85rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 2rem;
`;

const ItemDesc = styled.p`
  font-size: 1rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 1rem;
`;

const ItemDate = styled.p`
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

const LottieWrap = styled.div`
  width: 20%;
  z-index: 1;
`;
