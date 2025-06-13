"use client";

import type React from "react";
import { useEffect, useState } from "react";
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

export default function VoteSection(props: Props) {
  const { userId, whoVoted, voteCount } = props;
  const [mouseEnter, setMouseEnter] = useState<number | null>(null);
  const [itemList, setItemList] = useState(characters);
  const [votedCharacter, setVotedCharacter] = useState<number | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <SectionLayout>
      <Container>
        <SectionTitle>최애 선정하기</SectionTitle>
        {/* <p className="description">Who's your favorite Kessoku Band member?</p> */}
        <VoteGrid>
          {itemList.map((character, i) => (
            <VoteCard
              key={character.id}
              onMouseEnter={() => setMouseEnter(character.id)}
              onMouseLeave={() => setMouseEnter(null)}
            >
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <VoteAvatar $color={character.color}>
                  <ImageWrap
                    src={character.gif}
                    alt={character.name}
                    isVisible={character.id === mouseEnter && !!mouseEnter}
                  />
                  <ImageWrap
                    src={character.img}
                    alt={character.name}
                    isVisible={character.id !== mouseEnter}
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
  padding: 4rem 1rem;
  ${(props) => props.$background && `background: ${props.$background};`}
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  background: ${(props) => props.theme.colors.gradients.text};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const SectionLayout = styled(Section)`
  /* background: ${(props) => props.theme.colors.gradients.section}; */
  /* background: #1b1f3b; */
  /* background: linear-gradient(135deg, #000000 0%, #1b1f3b 60%, #da007a 100%); */
  .description {
    text-align: center;
    color: ${(props) => props.theme.colors.gray[600]};
    margin-bottom: 3rem;
  }
`;

const VoteGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 6xl;
  margin: 0 auto;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const VoteCard = styled(Card)`
  background: ${(props) => props.theme.colors.white};
  border: 2px solid ${(props) => props.theme.colors.gray[200]};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 0.25em;
  overflow: hidden;
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

const ImageWrap = styled(Image)<{ isVisible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
`;
