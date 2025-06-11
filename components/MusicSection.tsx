"use client";
import type React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";
import Image from "next/image";

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

const musicVideos = [
  {
    id: 1,
    title: "青春コンプレックス (Seishun Complex)",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "3:42",
  },
  {
    id: 2,
    title: "ギターと孤独と蒼い惑星 (Guitar to Kodoku to Aoi Wakusei)",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "4:15",
  },
  {
    id: 3,
    title: "転がる岩、君に朝が降る (Korogaru Iwa, Kimi ni Asa ga Furu)",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "3:58",
  },
  {
    id: 4,
    title: "忘れてやらない (Wasurete Yaranai)",
    thumbnail: "/placeholder.svg?height=180&width=320",
    duration: "4:23",
  },
];

export default function MusicSection() {
  const [votes, setVotes] = useState(characters.map((char) => char.votes));
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % musicVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideoIndex(
      (prev) => (prev - 1 + musicVideos.length) % musicVideos.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SectionLayout>
      <Container>
        <SectionTitle>Kessoku Band Music Videos</SectionTitle>
        <div className="carousel-container">
          <div className="carousel-content">
            <Button
              onClick={prevVideo}
              variant="outline"
              size="icon"
              className="carousel-button prev"
            >
              <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
            </Button>

            <div className="video-container">
              <VideoCard>
                <CardContent style={{ padding: 0 }}>
                  <div className="video-overlay">
                    <Image
                      src={
                        musicVideos[currentVideoIndex].thumbnail ||
                        "/placeholder.svg"
                      }
                      alt={musicVideos[currentVideoIndex].title}
                      width={640}
                      height={360}
                      style={{
                        width: "100%",
                        borderRadius: "0.5rem 0.5rem 0 0",
                      }}
                    />
                    <div className="play-button-container">
                      <Button size="lg" className="play-button">
                        <Music
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            marginRight: "0.5rem",
                          }}
                        />
                        Play
                      </Button>
                    </div>
                    <div className="duration">
                      {musicVideos[currentVideoIndex].duration}
                    </div>
                  </div>
                  <div className="video-title">
                    <h3>{musicVideos[currentVideoIndex].title}</h3>
                  </div>
                </CardContent>
              </VideoCard>
            </div>

            <Button
              onClick={nextVideo}
              variant="outline"
              size="icon"
              className="carousel-button next"
            >
              <ChevronRight style={{ width: "1rem", height: "1rem" }} />
            </Button>
          </div>

          <CarouselDots>
            {musicVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={index === currentVideoIndex ? "active" : ""}
              />
            ))}
          </CarouselDots>
        </div>
      </Container>
    </SectionLayout>
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

const SectionLayout = styled(Section)`
  .carousel-container {
    position: relative;
    max-width: 4xl;
    margin: 0 auto;
  }

  .carousel-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .carousel-button {
    position: absolute;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8);

    &:hover {
      background: ${(props) => props.theme.colors.white};
    }

    &.prev {
      left: 0;
    }
    &.next {
      right: 0;
    }
  }

  .video-container {
    width: 100%;
    max-width: 40rem;
  }
`;

const VideoCard = styled(Card)`
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.25);

  .video-overlay {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0.5rem 0.5rem 0 0;
    }
  }

  .play-button-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem 0.5rem 0 0;
    z-index: 1;
  }

  .play-button {
    background: ${(props) => props.theme.colors.red[600]};

    &:hover {
      background: ${(props) => props.theme.colors.red[500]};
    }
  }

  .duration {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.7);
    color: ${(props) => props.theme.colors.white};
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }

  .video-title {
    padding: 1rem;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: ${(props) => props.theme.colors.gray[800]};
    }
  }
`;

const CarouselDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  gap: 0.5rem;

  button {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    border: none;
    transition: all 0.3s ease;
    cursor: pointer;

    &.active {
      background: ${(props) => props.theme.colors.primary.pink};
      transform: scale(1.25);
    }

    &:not(.active) {
      background: ${(props) => props.theme.colors.gray[300]};

      &:hover {
        background: ${(props) => props.theme.colors.gray[400]};
      }
    }
  }
`;
