"use client";
import type React from "react";
import styled from "styled-components";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// assets
import Hitori from "@/assets/characters/Hitori_Gotoh.webp";
import Nijika from "@/assets/characters/Nijika_Ijichi.webp";
import Kita from "@/assets/characters/Ikuyo_Kita.webp";
import Ryo from "@/assets/characters/Ryo_Yamada.webp";

// Character data with their signature colors
const characters = [
  {
    name: "Hitori Gotoh",
    nickname: "Bocchi",
    color: "linear-gradient(135deg, #f472b6, #FD02FE)",
    bgColor: "linear-gradient(135deg, #fce7f3, #dbeafe)",
    img: Hitori,
    polygon: "polygon(2% 3%, 97% 0%, 98% 95%, 0% 98%)",
    rotate: "2deg",
    bdColor: "rgba(244, 114, 182, 0.8)",
  },
  {
    name: "Nijika Ijichi",
    nickname: "Nijika",
    color: "linear-gradient(135deg, #facc15, #fb923c)",
    bgColor: "linear-gradient(135deg, #fef3c7, #fed7aa)",
    img: Nijika,
    polygon: "polygon(0% 5%, 95% 0%, 100% 90%, 5% 100%)",
    rotate: "1deg",
    bdColor: "rgb(250, 204, 21, 0.8)",
  },
  {
    name: "Ryo Yamada",
    nickname: "Ryo",
    color: "linear-gradient(135deg, #2563eb, #4f46e5)",
    bgColor: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
    img: Ryo,
    pos: { top: "2em", left: "1.5em" },
    polygon: "polygon(2% 4%, 97% 7%, 95% 93%, 5% 96%)",
    rotate: "3deg",
    bdColor: "rgb(37, 99, 235, 0.8)",
  },
  {
    name: "Ikuyo Kita",
    nickname: "Kita",
    color: "linear-gradient(135deg, #f87171, #fb923c)",
    bgColor: "linear-gradient(135deg, #fecaca, #fed7aa)",
    img: Kita,
    polygon: "polygon(2% 4%, 97% 7%, 95% 93%, 5% 96%)",
    rotate: "0deg",
    bdColor: "rgb(251, 146, 60, 0.8)",
  },
];

export default function CharacterIntro() {
  return (
    <Section id="section2">
      <Container>
        <SectionTitle>Kessoku Band</SectionTitle>
        <CharacterGrid>
          {characters.map((character, i) => (
            <CharacterCard
              key={i}
              $bgColor={character.bgColor}
              $color={character.color}
            >
              <ContentInner $color={character.color}>
                <CharacterLayoutOut>
                  <SquareLayout $color={character.bdColor} />
                  <CharacterLayout
                    $polygon={character.polygon}
                    $rotate={character.rotate}
                  />
                </CharacterLayoutOut>
                <CharacterAvatar>
                  <CharaImage
                    src={character.img}
                    alt={character.name}
                    $pos={character?.pos}
                  />
                </CharacterAvatar>
              </ContentInner>
            </CharacterCard>
          ))}
        </CharacterGrid>
      </Container>
    </Section>
  );
}

const Section = styled.section<{ $background?: string }>`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  text-align: center;
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
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
`;

const CharacterCard = styled(Card)<{ $bgColor: string; $color: string }>`
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }
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
`;

const SquareLayout = styled.div<{ $color: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 37%;
  border: 0.1em solid ${({ $color }) => $color};
  z-index: 1;
`;

const CharacterAvatar = styled.div`
  margin: 0 auto;
  width: 18em;
  height: 20em;
`;

const CharaImage = styled(Image)<{ $pos?: { top: string; left: string } }>`
  position: absolute;
  top: ${({ $pos }) => $pos?.top || 0};
  left: ${({ $pos }) => $pos?.left || 0};
  right: 0;
  width: 100%;
  height: auto;
  object-fit: cover;
  z-index: 999;
  object-position: center top;
`;
