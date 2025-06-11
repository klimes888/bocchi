"use client";

import type React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { animations } from "@/lib/styled-animations";

// Character data with their signature colors
const characters = [
  {
    id: 1,
    name: "Hitori Gotoh",
    nickname: "Bocchi",
    voiceActor: "Yoshino Aoyama",
    trait: "Extremely introverted but passionate guitarist",
    color: "linear-gradient(135deg, #f472b6, #60a5fa)",
    bgColor: "linear-gradient(135deg, #fce7f3, #dbeafe)",
    votes: 1247,
  },
  {
    id: 2,
    name: "Nijika Ijichi",
    nickname: "Nijika",
    voiceActor: "Sayumi Suzushiro",
    trait: "Cheerful drummer who brings everyone together",
    color: "linear-gradient(135deg, #facc15, #fb923c)",
    bgColor: "linear-gradient(135deg, #fef3c7, #fed7aa)",
    votes: 892,
  },
  {
    id: 3,
    name: "Ryo Yamada",
    nickname: "Ryo",
    voiceActor: "Saku Mizuno",
    trait: "Cool bassist with a mysterious aura",
    color: "linear-gradient(135deg, #2563eb, #4f46e5)",
    bgColor: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
    votes: 1056,
  },
  {
    id: 4,
    name: "Ikuyo Kita",
    nickname: "Kita",
    voiceActor: "Ikumi Hasegawa",
    trait: "Energetic vocalist full of dreams",
    color: "linear-gradient(135deg, #f87171, #fb923c)",
    bgColor: "linear-gradient(135deg, #fecaca, #fed7aa)",
    votes: 734,
  },
];

export default function VoteSection() {
  const [votes, setVotes] = useState(characters.map((char) => char.votes));
  const [votedCharacter, setVotedCharacter] = useState<number | null>(null);

  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = (characterIndex: number) => {
    if (votedCharacter !== null) return;

    setVotes((prev) =>
      prev.map((vote, index) => (index === characterIndex ? vote + 1 : vote))
    );
    setVotedCharacter(characterIndex);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <SectionLayout>
      <Container>
        <SectionTitle>Character Popularity Vote</SectionTitle>
        <p className="description">Who's your favorite Kessoku Band member?</p>
        <VoteGrid>
          {characters.map((character, index) => (
            <VoteCard key={character.id}>
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <VoteAvatar $color={character.color}>
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt={character.name}
                    width={64}
                    height={64}
                  />
                </VoteAvatar>
                <VoteInfo>
                  <h3>{character.name}</h3>
                  <div className="vote-count">
                    <Heart />
                    <span>{votes[index]}</span>
                  </div>
                  <VoteButton
                    onClick={() => handleVote(index)}
                    disabled={votedCharacter !== null}
                    $voted={votedCharacter !== null}
                    $isVotedCharacter={votedCharacter === index}
                    $color={character.color}
                    $isAnimating={isAnimating}
                  >
                    {votedCharacter === index ? (
                      <>
                        <Star
                          style={{
                            width: "1rem",
                            height: "1rem",
                            marginRight: "0.5rem",
                          }}
                        />
                        Voted!
                      </>
                    ) : votedCharacter !== null ? (
                      "Vote Cast"
                    ) : (
                      "Vote"
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
  background: ${(props) => props.theme.colors.gradients.section};

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

  &:hover {
    box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const VoteAvatar = styled.div<{ $color: string }>`
  width: 5rem;
  height: 5rem;
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
    `
    animation: ${animations.pulse} 1s ease-in-out;
    transform: scale(1.05);
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
