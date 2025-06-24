"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Heart, Star } from "lucide-react";
import Image from "next/image";

// components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// lib
import { animations } from "@/lib/styled-animations";
import { submitVote } from "@/lib/firebase/vote";

// assets
import NijikaGif from "@/assets/votes/nijika.gif";
import RyoGif from "@/assets/votes/ryo.gif";
import HitoriGif from "@/assets/votes/hitori.gif";
import KitaGif from "@/assets/votes/kita.gif";

import Nijika from "@/assets/votes/nijika.jpg";
import Ryo from "@/assets/votes/ryo.jpg";
import Hitori from "@/assets/votes/hitori.jpg";
import Kita from "@/assets/votes/kita.jpg";
import { useIntersectionObserver } from "./useIntersection";
import { InfinityShape } from "./animation/infinity.shape";

const NUM_ROWS = 10;
const NUM_COLS = 10;

// Character data with their signature colors
const characters = [
  {
    id: 1,
    name: "Hitori Gotoh",
    nickname: "Bocchi",
    voiceActor: "Yoshino Aoyama",
    trait: "Extremely introverted but passionate guitarist",
    color: "linear-gradient(135deg, #f68ac2, #FD02FE)",
    bgColor: "linear-gradient(135deg, #fce7f3, #dbeafe)",
    gif: HitoriGif,
    img: Hitori,
    votes: 0,
  },
  {
    id: 2,
    name: "Nijika Ijichi",
    nickname: "Nijika",
    voiceActor: "Sayumi Suzushiro",
    trait: "Cheerful drummer who brings everyone together",
    color: "linear-gradient(135deg, #facc15, #fb923c)",
    bgColor: "linear-gradient(135deg, #fef3c7, #fed7aa)",
    gif: NijikaGif,
    img: Nijika,
    votes: 0,
  },
  {
    id: 3,
    name: "Ryo Yamada",
    nickname: "Ryo",
    voiceActor: "Saku Mizuno",
    trait: "Cool bassist with a mysterious aura",
    color: "linear-gradient(135deg, #4e84f7, #4f46e5)",
    bgColor: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
    gif: RyoGif,
    img: Ryo,
    votes: 0,
  },
  {
    id: 4,
    name: "Ikuyo Kita",
    nickname: "Kita",
    voiceActor: "Ikumi Hasegawa",
    trait: "Energetic vocalist full of dreams",
    color: "linear-gradient(135deg, #f56969, #fb923c)",
    bgColor: "linear-gradient(135deg, #fecaca, #fed7aa)",
    gif: KitaGif,
    img: Kita,
    votes: 0,
  },
];

interface Props {
  userId: string | null;
  whoVoted: string | null;
  voteCount: Record<string, number> | null;
}

const theme: Record<string, string> = {
  Kita: "#f56969",
  Ryo: "#4e84f7",
  Nijika: "#facc15",
  Bocchi: "#f68ac2",
};

export default function VoteSection(props: Props) {
  const { userId, whoVoted, voteCount } = props;
  const [itemList, setItemList] = useState(characters);
  const [votedCharacter, setVotedCharacter] = useState<number | null>(null);
  const [mouseEnter, setMouseEnter] = useState<number | null>(null);
  const [gridHoverType, setGridHoverType] = useState(characters[0].nickname);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadPage, setLoadPage] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  const titleWrapref = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordRef = useRef<(HTMLDivElement | null)[]>([]);

  const wordAniamtionHandle = (isFirst: boolean) => {
    wordRef.current.forEach((el) => {
      if (!el) return;
      if (isFirst) {
        el.style.height = "15rem";
      } else {
        el.style.height = "0";
      }
      // el.style.opacity = "1";
    });
  };

  const wordSmallHandler = (isFirst: boolean) => {
    wordRef.current.forEach((el) => {
      if (!el) return;
      if (isFirst) {
        el.style.fontSize = "4rem";
      } else {
      }
    });
  };

  const cardWrapHandler = (isFirst: boolean) => {
    cardRef.current.forEach((el) => {
      if (!el) return;
      if (isFirst) {
        el.style.height = "17.5rem";
        el.style.boxShadow = "0 1em 1em 0.25em rgba(0, 0, 0, 0.3)";
      } else {
        el.style.height = "0";
        el.style.boxShadow = "none";
      }
    });
  };

  const titleWrapAnimationHandler = (isFirst: boolean) => {
    if (isFirst) {
      setTimeout(() => {
        wordSmallHandler(true);
      }, 1000);
    }

    if (!titleWrapref.current) return;
    if (isFirst) {
      titleWrapref.current.style.transform = "translate(-50%, -140%)";
    } else {
    }
  };

  useIntersectionObserver(ref, 0.9, {
    isEnter: () => {
      setLoadPage(true);
      requestAnimationFrame(() => {
        wordAniamtionHandle(true);
        titleWrapAnimationHandler(true);
        cardWrapHandler(true);
      });
    },
  });

  useIntersectionObserver(ref, 0.2, {
    elseFunc: () => {
      setLoadPage(false);
      requestAnimationFrame(() => {
        wordAniamtionHandle(false);
        cardWrapHandler(false);
      });
    },
  });

  const handleVote = async (characterIndex: number) => {
    if (votedCharacter !== null || !userId) return;

    try {
      await submitVote({ uid: userId, vote: characterIndex.toString() });

      // count up
      setItemList((prev) =>
        prev.map((data, i) => {
          if (characterIndex === data.id) {
            return { ...data, votes: data.votes + 1 };
          } else return data;
        })
      );

      setVotedCharacter(characterIndex);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    if (!whoVoted) return;
    setVotedCharacter(whoVoted ? Number(whoVoted) : null);
  }, [whoVoted]);

  useEffect(() => {
    if (!voteCount) return;
    const result = characters.map((data, i) => ({
      ...data,
      votes: voteCount[i + 1],
    }));
    setItemList(result);
  }, [voteCount]);

  const words = ["최", "애", "", "선", "정", "하", "기"];

  if (!loadPage) return <SectionLayout id="section3" ref={ref}></SectionLayout>;

  return (
    <SectionLayout id="section3" ref={ref}>
      <InfinityShape theme={theme[gridHoverType]} />
      <Container>
        <SectionTitleWrap ref={titleWrapref}>
          {words.map((word, i) => (
            <SectionTitle
              key={i}
              color={theme[gridHoverType]}
              ref={(el) => {
                wordRef.current[i] = el;
              }}
              $order={i}
              $blank={word === ""}
            >
              <h2>{word}</h2>
            </SectionTitle>
          ))}
        </SectionTitleWrap>
        {/* <p className="description">Who's your favorite Kessoku Band member?</p> */}
        <VoteGrid>
          {itemList.map((character, i) => (
            <VoteCard
              key={character.id}
              ref={(el) => {
                cardRef.current[i] = el;
              }}
              oerder={i}
              onMouseEnter={() => {
                setMouseEnter(character.id);
                setGridHoverType(character.nickname);
              }}
              onMouseLeave={() => setMouseEnter(null)}
            >
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <VoteAvatar $color={character.color}>
                  <ImageWrap
                    src={character.gif}
                    alt={character.name}
                    $isVisible={character.id === mouseEnter && !!mouseEnter}
                  />
                  <ImageWrap
                    src={character.img}
                    alt={character.name}
                    $isVisible={character.id !== mouseEnter}
                  />
                </VoteAvatar>
                <VoteInfo>
                  <h3>{character.name}</h3>
                  <div className="vote-count">
                    <Heart />
                    <span>{character.votes}</span>
                  </div>
                  <VoteButton
                    onClick={() => handleVote(character.id)}
                    disabled={votedCharacter !== null}
                    $voted={votedCharacter !== null}
                    $isVotedCharacter={votedCharacter === character.id}
                    $color={character.color}
                    $isAnimating={isAnimating}
                  >
                    {votedCharacter === character.id ? (
                      <>
                        <Star
                          style={{
                            width: "1rem",
                            height: "1rem",
                            marginRight: "0.5rem",
                          }}
                        />
                        최애 선정!
                      </>
                    ) : votedCharacter !== null ? (
                      "투표 완료"
                    ) : (
                      "투표하기"
                    )}
                  </VoteButton>
                </VoteInfo>
              </CardContent>
            </VoteCard>
          ))}
        </VoteGrid>
      </Container>
    </SectionLayout>
  );
}

// Styled Components
const Section = styled.section<{ $background?: string }>`
  position: relative;
  /* padding: 4rem 1rem; */
  width: 100%;
  height: 100vh;
  ${(props) => props.$background && `background: ${props.$background};`}
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100rem;
  width: 100%;
  height: 100%;
`;

const SectionTitleWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  transition: transform 0.5s 1s ease;
  background: ${(props) => props.theme.colors.gradients.text};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const SectionTitle = styled.div<{
  $order: number;
  $blank: boolean;
  color: string;
}>`
  width: ${({ $blank }) => ($blank ? "0.3rem" : "auto")};
  height: 0;
  overflow: hidden;
  transition: height 0.5s ${({ $order }) => `${0.1 * $order}s`} ease;
  font-size: 10rem;

  h2 {
    font-weight: bold;
    text-align: center;
    transition: font-size 0.5s ease;
    font-size: 4rem;
    color: #fff;
    text-shadow: 0 0 4px ${({ color }) => color},
      0 0 8px ${({ color }) => color};
  }
`;

const SectionLayout = styled(Section)`
  .description {
    text-align: center;
    color: ${(props) => props.theme.colors.gray[600]};
    margin-bottom: 3rem;
  }
`;

const VoteGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const VoteCard = styled(Card)<{ oerder: number }>`
  background: ${(props) => props.theme.colors.white};
  box-shadow: none;
  width: 100%;
  height: 0;
  background-color: #fff;
  transition: height 0.5s ${({ oerder }) => `1.${oerder + 6}s`} ease,
    box-shadow 0.5s ${({ oerder }) => `1.${oerder + 6}s`} ease;
  border-radius: 0.25em;
  overflow: hidden;
  z-index: 9;
  &:hover {
    box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const VoteAvatar = styled.div<{ $color: string }>`
  position: relative;
  width: 7rem;
  max-width: 7rem;
  height: 7rem;
  max-height: 7rem;
  margin: 0 auto;
  border-radius: 50%;
  background: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    border-radius: 50%;
  }
`;

const VoteInfo = styled.div`
  text-align: center;

  h3 {
    font-size: 1.125rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.gray[800]};
  }

  .vote-count {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.5rem 0;

    svg {
      width: 1.25rem;
      height: 1.25rem;
      color: ${(props) => props.theme.colors.red[500]};
    }

    span {
      font-size: 1.5rem;
      font-weight: bold;
      color: ${(props) => props.theme.colors.gray[800]};
    }
  }
`;

const VoteButton = styled(Button)<{
  $voted: boolean;
  $isVotedCharacter: boolean;
  $color: string;
  $isAnimating: boolean;
}>`
  width: 100%;
  transition: all 0.3s ease;

  ${(props) =>
    props.$isVotedCharacter
      ? `
    background: ${props.theme.colors.green[500]};
    &:hover { background: ${props.theme.colors.green[600]}; }
  `
      : `
    background: ${props.$color};
    &:hover { opacity: 0.9; }
  `}

  ${(props) =>
    props.$isAnimating &&
    props.$isVotedCharacter &&
    css`
      animation: ${animations.pulse} 1s ease-in-out;
      transform: scale(1.05);
    `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ImageWrap = styled(Image)<{ $isVisible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
`;

const Dummy = styled.div`
  width: 2.65rem;
  height: 1rem;
`;
