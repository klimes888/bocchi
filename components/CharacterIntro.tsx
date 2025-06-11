"use client";
import type React from "react";
import styled from "styled-components";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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

export default function CharacterIntro() {
  return (
    <Section>
      <Container>
        <SectionTitle>Meet Kessoku Band</SectionTitle>
        <CharacterGrid>
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              $bgColor={character.bgColor}
              $color={character.color}
            >
              <CardContent style={{ padding: "1.5rem", textAlign: "center" }}>
                <CharacterAvatar $color={character.color}>
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt={character.name}
                    width={80}
                    height={80}
                  />
                </CharacterAvatar>
                <CharacterInfo>
                  <h3>{character.name}</h3>
                  <p className="nickname">"{character.nickname}"</p>
                  <p className="voice-actor">CV: {character.voiceActor}</p>
                  <p className="trait">{character.trait}</p>
                </CharacterInfo>
              </CardContent>
            </CharacterCard>
          ))}
        </CharacterGrid>
      </Container>
    </Section>
  );
}

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

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CharacterCard = styled(Card)<{ $bgColor: string; $color: string }>`
  background: ${(props) => props.$bgColor};
  border: 2px solid ${(props) => props.theme.colors.white};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }
`;

const CharacterAvatar = styled.div<{ $color: string }>`
  width: 6rem;
  height: 6rem;
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

const CharacterInfo = styled.div`
  text-align: center;

  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.gray[800]};
  }

  .nickname {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.gray[600]};
    font-weight: 500;
  }

  .voice-actor {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colors.gray[500]};
    margin-top: 0.25rem;
  }

  .trait {
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.gray[700]};
    font-style: italic;
    margin-top: 1rem;
  }
`;
