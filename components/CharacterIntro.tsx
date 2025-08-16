"use client";
import type React from "react";
import styled, { css, keyframes } from "styled-components";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// assets
import Hitori from "@/assets/characters/Hitori_Gotoh.webp";
import Nijika from "@/assets/characters/Nijika_Ijichi.webp";
import Kita from "@/assets/characters/Ikuyo_Kita.webp";
import Ryo from "@/assets/characters/Ryo_Yamada.webp";
import { useIntersectionObserver } from "./useIntersection";
import { Fragment, useLayoutEffect, useRef, useState } from "react";

import Back from "../assets/background.jpg";
import CharacterIntroPopup from "./CharacterIntro_Popup";
import { animations } from "@/lib/styled-animations";
// import { useDragDetect } from "@/hooks/use-drag";
import { useBreakpoint } from "@/hooks/use-breakpoint";

// Character data with their signature colors

const characters = [
  {
    name: "Hitori",
    color: "linear-gradient(135deg, #f472b6, #FD02FE)",
    bgColor: "linear-gradient(135deg, #fce7f3, #dbeafe)",
    radiColor:
      "radial-gradient(circle, rgba(97, 53, 75, 0.1) 70%, rgba(154, 76, 154, 0.3), rgba(253, 2, 254, 0.3)) transparent 90%",
    img: Hitori,
    polygon: "polygon(2% 3%, 97% 0%, 98% 95%, 0% 98%)",
    rotate: "2deg",
    bdColor: "rgba(244, 114, 182, 0.8)",
    animation: "translate(-200%, -200%) rotate(-90deg)",
  },
  {
    name: "Nijika",
    color: "linear-gradient(135deg, #facc15, #fb923c)",
    bgColor: "linear-gradient(135deg, #fef3c7, #fed7aa)",
    radiColor:
      "radial-gradient(circle, rgba(181, 158, 69, 0.1) 70%, rgba(177, 122, 77, 0.3), rgba(251, 181, 60, 0.3)) transparent 90%",
    img: Nijika,
    polygon: "polygon(0% 5%, 95% 0%, 100% 90%, 5% 100%)",
    rotate: "1deg",
    bdColor: "rgb(250, 204, 21, 0.8)",
    animation: "translate(200%, -200%) rotate(90deg)",
  },
  {
    name: "Ryo",
    color: "linear-gradient(135deg, #2563eb, #4f46e5)",
    bgColor: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
    radiColor:
      "radial-gradient(circle, rgba(72, 98, 154, 0.1) 70%, rgba(85, 118, 188, 0.3), rgba(76, 69, 225, 0.3)) transparent 90%",
    img: Ryo,
    pos: { top: "2em", left: "1.5em" },
    polygon: "polygon(2% 4%, 97% 7%, 95% 93%, 5% 96%)",
    rotate: "3deg",
    bdColor: "rgb(37, 99, 235, 0.8)",
    animation: "translate(-200%, 200%) rotate(90deg)",
  },
  {
    name: "Ikuyo",
    color: "linear-gradient(135deg, #f87171, #fb923c)",
    bgColor: "linear-gradient(135deg, #fecaca, #fed7aa)",
    radiColor:
      "radial-gradient(circle, rgba(202, 105, 105, 0.1) 70%, rgba(223, 96, 58, 0.3), rgba(204, 57, 38, 0.3)) transparent 90%",
    img: Kita,
    polygon: "polygon(2% 4%, 97% 7%, 95% 93%, 5% 96%)",
    rotate: "0deg",
    bdColor: "rgb(251, 146, 60, 0.8)",
    animation: "translate(200%, 200%) rotate(-90deg)",
  },
];

export default function CharacterIntro({
  size,
}: {
  size: (flag: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [openPopup, setOpenPopup] = useState<{
    open: boolean;
    type: string;
  }>({ open: false, type: "" });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const { height } = ref.current.getBoundingClientRect();
    size(height);
  }, [ref]);

  // useDragDetect({ threshold: 0.2, curPos: "section2", where: "section3" });
  const [glitch, setGlitch] = useState<string | null>(null);
  const [radiColor, setRadiColor] = useState<string | null>(null);
  const cardRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordRef = useRef<(HTMLDivElement | null)[]>([]);
  const breakPoint = useBreakpoint();

  useIntersectionObserver(ref, 0.8, {
    isEnter: () => {
      requestAnimationFrame(() => {
        cardRef.current.forEach((el) => {
          if (!el) return;
          el.style.transform = "translate(0,0) rotate(0)";
          el.style.opacity = "1";
        });
        wordRef.current.forEach((el) => {
          if (!el) return;
          // el.style.transform = "translateY(0)";
          el.style.background = "rgba(0,0,0,0)";
          // el.style.opacity = "1";
        });
      });
    },
  });

  useIntersectionObserver(ref, 0.3, {
    elseFunc: () => {
      requestAnimationFrame(() => {
        cardRef.current.forEach((el, i) => {
          if (!el) return;
          el.style.transform = characters[i].animation;
          el.style.opacity = "0";
        });
        wordRef.current.forEach((el) => {
          if (!el) return;
          // el.style.transform = "translateY(-1em)";
          el.style.background = "rgba(0,0,0,1)";
        });
      });
    },
  });

  const titleWord = ["K", "e", "s", "s", "o", "k", "u", "", "B", "a", "n", "d"];
  return (
    <FragDiv>
      <Section id="section2" ref={ref}>
        <SectionInner $radiColor={radiColor} />
        <Container>
          <SectionTitleWrap $url={Back.src}>
            {titleWord.map((word, i) => (
              <SectionTitle
                key={i}
                ref={(el) => {
                  wordRef.current[i] = el;
                }}
                $order={i}
              >
                {word !== "" ? word : " "}
              </SectionTitle>
            ))}
          </SectionTitleWrap>
          <CharacterGrid>
            {characters.map((character, i) => (
              <CardLayout
                key={i}
                ref={(el) => {
                  cardRef.current[i] = el;
                }}
                $animation={character.animation}
                $order={i}
                onTouchStart={() => {
                  setGlitch(character.color);
                  setRadiColor(character.radiColor);
                }}
                onTouchEnd={() => {
                  setTimeout(() => {
                    setGlitch(null);
                    setRadiColor(null);
                    setOpenPopup({ open: true, type: character.name });
                  }, 1000);
                }}
                onMouseEnter={() => {
                  setGlitch(character.color);
                  setRadiColor(character.radiColor);
                }}
                onMouseLeave={() => {
                  setGlitch(null);
                  setRadiColor(null);
                }}
                onClick={() => {
                  if (breakPoint !== "mobile") {
                    setOpenPopup({ open: true, type: character.name });
                  }
                }}
              >
                <CharacterCard
                  $bgColor={character.bgColor}
                  $color={character.color}
                  $bdColor={character.bdColor}
                  $isMb={breakPoint === "mobile"}
                >
                  <ContentInner $color={character.color}>
                    <CharacterLayoutOut>
                      <SquareLayout $color={character.bdColor} />
                      <SmallSquare $color={character.bdColor} />
                      <CharacterLayout
                        $polygon={character.polygon}
                        $rotate={character.rotate}
                      />
                    </CharacterLayoutOut>
                    <CharacterAvatar>
                      <BlurCharaImage
                        src={character.img}
                        alt={character.name}
                        $pos={character?.pos}
                      />
                      <CharaImage
                        src={character.img}
                        alt={character.name}
                        $pos={character?.pos}
                      />
                    </CharacterAvatar>
                  </ContentInner>
                </CharacterCard>
              </CardLayout>
            ))}
          </CharacterGrid>
          {/* <Electronic /> */}
        </Container>
      </Section>
      <CharacterIntroPopup
        type={openPopup.type}
        isOpen={openPopup.open}
        isClick={(flag) => {
          setOpenPopup({ ...openPopup, open: flag });
        }}
      />
    </FragDiv>
  );
}

const WiggleUi = styled.div<{ $isMb: boolean }>`
  display: flex;
  position: absolute;
  top: ${({ $isMb }) => ($isMb ? "-20%" : "50%")};
  left: ${({ $isMb }) => ($isMb ? "50%" : "45%")};
  bottom: 0;
  right: 0;
  width: ${({ $isMb }) => ($isMb ? "3%" : "20%")};
  height: ${({ $isMb }) => ($isMb ? "40rem" : "2rem")};
  animation: ${({ $isMb }) =>
      $isMb ? animations.mb_wiggle_up : animations.wiggle_up}
    0.2s infinite;
  z-index: 1;
`;

const WiggleUi2 = styled(WiggleUi)`
  animation: ${animations.wiggle_middle} 0.2s infinite;
`;

const FragDiv = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #000;
`;

const Section = styled.section`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const SectionInner = styled.div<{ $radiColor: string | null }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ $radiColor }) => $radiColor};
  transition: opacity 0.3s ease;
  opacity: ${({ $radiColor }) => ($radiColor ? 1 : 0)};
`;

const SectionTitleWrap = styled.div<{ $url: string }>`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  color: transparent;
  background-image: url(${({ $url }) => $url});
  background-size: 100%; /* Enlarged for smooth animation */
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: animate-background 2s infinite alternate linear;
  flex-wrap: nowrap;

  @keyframes animate-background {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 70% 10%;
    }
  }
`;

const SectionTitle = styled.div<{ $order: number }>`
  /* font-size: 5.5rem; */
  font-size: clamp(3.5rem, 2vw, 5.5rem);
  font-weight: bold;
  transition: background 0.4s ${({ $order }) => `${900 + $order * 40}ms`} ease;
  background-color: rgba(0, 0, 0, 1);
  white-space: pre-wrap;
`;

const Container = styled.div`
  position: relative;
  max-width: 80rem;
  margin: 0 auto;
  @media (max-width: 420px) {
    width: 100%;
  }
`;

const CharacterGrid = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
`;

// card wrapper
const ContentInner = styled.div<{ $color: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.$color};
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CharacterLayoutOut = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1em;
`;

const CharacterLayout = styled.div<{ $polygon: string; $rotate: string }>`
  width: 100%;
  height: 100%;
  background-color: #222;
  overflow: hidden;
  clip-path: ${({ $polygon }) => $polygon};
  transform: rotate(${({ $rotate }) => $rotate});
  transition: transform 0.6s ease;
`;

const SquareLayout = styled.div<{ $color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.1);
  padding: 37%;
  border: 0.1em solid ${({ $color }) => $color};
  z-index: 1;
`;

const SmallSquare = styled(SquareLayout)`
  padding: 18%;
`;

const CharacterAvatar = styled.div`
  width: 18em;
  height: 20em;
  object-fit: contain;
  z-index: 1;
  @media (max-width: 420px) {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: auto;
  }
`;

const CharaImage = styled(Image)<{ $pos?: { top: string; left: string } }>`
  position: absolute;
  top: ${({ $pos }) => $pos?.top || "0"};
  left: ${({ $pos }) => $pos?.left || "0"};
  right: 0;
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center top;
  transform: translateY(0) scale(1);
  transition: all 0.5s ease;
  z-index: 1;
`;

const BlurCharaImage = styled(CharaImage)<{
  $pos?: { top: string; left: string };
}>`
  filter: brightness(0) saturate(100%);
  transform: translateY(1em) scale(1.08);
  transition: all 0.5s ease;
  z-index: 0;
`;

const CardLayout = styled.div<{ $animation: string; $order: number }>`
  position: relative;
  transform: ${({ $animation }) => $animation};
  transition: all 0.6s ${({ $order }) => `${$order * 100}`}ms ease;
  z-index: 1;
`;

const CharacterCard = styled(Card)<{
  $bgColor: string;
  $color: string;
  $bdColor: string;
  $isMb: boolean;
}>`
  position: relative;
  width: 100%;
  transition: transform 0.5s ease;
  overflow: hidden;

  ${CharacterLayout}, ${SmallSquare}, ${CharaImage} {
    transition: all 0.6s ease;
  }

  ${SquareLayout} {
    transition: all 0.6s ease 0.2s;
  }

  &:hover {
    transform: scale(1.05);
    z-index: 2;

    ${CharacterLayout} {
      transform: rotate(5deg) scale(1.05);
      transition: transform 0.6s ease;
    }

    ${SquareLayout} {
      transform: translate(-50%, -50%) scale(1.1) rotate(90deg);
      transition: all 0.6s ease 0.2s;
    }

    ${SmallSquare} {
      display: block;
      transform: translate(-50%, -50%) scale(1.1) rotate(90deg);
      transition: all 0.6s ease;
    }

    ${CharaImage} {
      animation: ${animations.glitch_flicker} 0.5s infinite;
      transform: scale(1.05);
      /* transition: all 0.5s ease; */
    }

    ${CharacterAvatar} {
      animation: ${({ $isMb }) =>
          $isMb ? animations.mb_glitch_step : animations.glitch_step}
        0.5s steps(4, end) infinite;
    }
  }

  @media (max-width: 420px) {
    aspect-ratio: 3 / 4;
  }
`;
