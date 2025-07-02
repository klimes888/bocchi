"use client";

import type React from "react";
import {
  createRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import { Heart } from "lucide-react";
import Image from "next/image";

// components
// star.json
// lib
import { animations } from "@/lib/styled-animations";

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
import { useDragDetect } from "@/hooks/use-drag";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import StarLottie from "@/assets/icons/star.json";
import HeartLottie from "@/assets/icons/heart.json";
import FloatHeartLottie from "@/assets/icons/float_heart.json";
import { RollingDigit } from "./RollingDigit";

// Character data with their signature colors
const characters = [
  {
    id: 1,
    name: "Hitori Gotoh",
    nickname: "Bocchi",
    voiceActor: "Yoshino Aoyama",
    trait: "Extremely introverted but passionate guitarist",
    color: "linear-gradient(135deg, #f68ac2, #FD02FE)",
    gif: HitoriGif,
    img: Hitori,
    fColor: "rgba(255, 128, 193, 0.9)",
    kanji: "ご と う ひ と り",
    role: "Main Guitarist",
    votes: 0,
  },
  {
    id: 2,
    name: "Nijika Ijichi",
    nickname: "Nijika",
    voiceActor: "Sayumi Suzushiro",
    trait: "Cheerful drummer who brings everyone together",
    color: "linear-gradient(135deg, #facc15, #fb923c)",
    gif: NijikaGif,
    img: Nijika,
    fColor: "rgba(250, 210, 49, 0.9)",
    kanji: "い じ ち に じ か",
    role: "Drummer",
    votes: 0,
  },
  {
    id: 3,
    name: "Ryo Yamada",
    nickname: "Ryo",
    voiceActor: "Saku Mizuno",
    trait: "Cool bassist with a mysterious aura",
    color: "linear-gradient(135deg, #4e84f7, #4f46e5)",
    gif: RyoGif,
    img: Ryo,
    fColor: "rgba(99, 147, 250, 0.9)",
    kanji: "や ま だ リ ョ ウ",
    role: "Bassist & Sub Vocalist",
    votes: 0,
  },
  {
    id: 4,
    name: "Ikuyo Kita",
    nickname: "Kita",
    trait: "Energetic vocalist full of dreams",
    color: "linear-gradient(135deg, #f56969, #fb923c)",
    gif: KitaGif,
    img: Kita,
    fColor: "rgba(234, 82, 82, 0.9)",
    kanji: "き た い く よ",
    role: "Guitarist & Vocalist",
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
  const [loadPage, setLoadPage] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);

  const lottieRefs = useRef<Array<any | null>>(itemList.map(() => createRef()));
  const heartRefs = useRef<Array<any | null>>(itemList.map(() => createRef()));

  const ref = useRef<HTMLDivElement | null>(null);
  const titleWrapref = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<(HTMLDivElement | null)[]>([]);
  const wordRef = useRef<(HTMLDivElement | null)[]>([]);

  // useDragDetect({ threshold: 20, curPos: "section3", where: "section4" });

  const wordAniamtionHandle = (isFirst: boolean) => {
    wordRef.current.forEach((el) => {
      if (!el) return;
      if (isFirst) {
        el.style.height = "17rem";
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
      titleWrapref.current.style.transform = "translate(-50%, -130%)";
    } else {
    }
  };

  useIntersectionObserver(ref, 0.95, {
    isEnter: () => {
      setLoadPage(true);
      requestAnimationFrame(() => {
        wordAniamtionHandle(true);
        titleWrapAnimationHandler(true);
        cardWrapHandler(true);
      });
    },
  });

  useIntersectionObserver(ref, 0.05, {
    elseFunc: () => {
      setLoadPage(false);
      requestAnimationFrame(() => {
        wordAniamtionHandle(false);
        cardWrapHandler(false);
      });
    },
  });

  useEffect(() => {
    if (!loadPage) return;

    const maxCardDelay = itemList.length * 100 + 1600; // 1.6s + n * 100ms
    const digitDelay = maxCardDelay + 500; // 카드 애니메이션 + 여유시간

    const timer = setTimeout(() => {
      setAnimationActive(true);
    }, digitDelay);

    return () => clearTimeout(timer);
  }, [loadPage]);

  const handleVote = async (characterIndex: number, index: number) => {
    if (votedCharacter !== null || !userId) return;

    try {
      // await submitVote({ uid: userId, vote: characterIndex.toString() });
      // count up
      setItemList((prev) =>
        prev.map((data, i) => {
          if (characterIndex === data.id) {
            return { ...data, votes: data.votes + 1 };
          } else return data;
        })
      );

      setVotedCharacter(characterIndex);
      lottieRefs.current[index].current?.play();
      setTimeout(() => {
        heartRefs.current[index].current?.play();
      }, 1000);
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

  const words = ["투", "표", "하", "기"];

  const floatHeaerLottieWrap = () => {
    return (
      <FloatHeartLottieWrap>
        <Lottie animationData={FloatHeartLottie} loop={true} autoplay={true} />
      </FloatHeartLottieWrap>
    );
  };

  const heaerLottieWrap = (index: number) => {
    return (
      <HeartLottieWrap>
        <Lottie
          lottieRef={heartRefs.current[index]}
          animationData={HeartLottie}
          loop={false}
          autoplay={true}
        />
      </HeartLottieWrap>
    );
  };

  console.log("animationActive", animationActive);
  if (!loadPage) return <SectionLayout id="section3" ref={ref}></SectionLayout>;
  return (
    <SectionLayout id="section3" ref={ref}>
      {/* <InfinityShape theme={theme[gridHoverType]} /> */}
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
              ref={(el: any) => {
                cardRef.current[i] = el;
              }}
              oerder={i}
              onMouseEnter={() => {
                setMouseEnter(character.id);
                setGridHoverType(character.nickname);
              }}
              onMouseLeave={() => setMouseEnter(null)}
            >
              <SkewedBox $color={character.fColor} />
              <CardContent>
                <VoteInfo>
                  <VoteInfoInner>
                    <HeartWrap>
                      {votedCharacter === character.id ? (
                        <>
                          {floatHeaerLottieWrap()}
                          {heaerLottieWrap(i)}
                        </>
                      ) : (
                        <SvgHeartWrap>
                          <Heart />
                        </SvgHeartWrap>
                      )}
                    </HeartWrap>
                    <DigitWrap $loadPage={animationActive}>
                      <RollingDigit
                        value={character.votes}
                        delay={500}
                        rolling={animationActive}
                      />
                    </DigitWrap>
                    {/* {isAnimating && <NumberWrap></NumberWrap>} */}
                    <VoteButton
                      onClick={() => {
                        handleVote(character.id, i);
                      }}
                      disabled={votedCharacter !== null}
                      $voted={votedCharacter !== null}
                      $isVotedCharacter={votedCharacter === character.id}
                      $color={character.color}
                      // $isAnimating={isAnimating}
                    >
                      <LottieWrap $visible={votedCharacter === character.id}>
                        <Lottie
                          lottieRef={lottieRefs.current[i]}
                          animationData={StarLottie}
                          loop={false}
                          autoplay={false}
                        />
                      </LottieWrap>
                      {votedCharacter === character.id ? (
                        <>최애 선정!</>
                      ) : votedCharacter !== null ? (
                        "투표 완료"
                      ) : (
                        "투표하기"
                      )}
                    </VoteButton>
                  </VoteInfoInner>
                </VoteInfo>
                <VoteAvatarWrap>
                  <SubTitle>{character.role}</SubTitle>
                  <AvatarTitle style={{ color: character.fColor || "" }}>
                    {character.name}
                  </AvatarTitle>
                  <KanjiName>{character.kanji}</KanjiName>
                  <VoteAvatar $color={character.color}>
                    <ImageWrap
                      src={character.gif}
                      alt={character.name}
                      $isVisible={
                        (character.id === mouseEnter && !!mouseEnter) ||
                        votedCharacter === character.id
                      }
                    />
                    {votedCharacter !== character.id && (
                      <ImageWrap
                        src={character.img}
                        alt={character.name}
                        $isVisible={character.id !== mouseEnter}
                      />
                    )}
                  </VoteAvatar>
                </VoteAvatarWrap>
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

const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  z-index: 9;
`;

const SkewedBox = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 45%;
  height: 100%;
  opacity: 0.2;
  background-color: ${({ $color }) => $color};
  clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
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
  font-size: 8rem;

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
  grid-template-columns: 4fr;
  gap: 1rem;
  width: 100%;
  margin-top: 5em;
  padding: 1rem;
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const VoteCard = styled.div<{ oerder: number }>`
  position: relative;
  box-shadow: none;
  width: 100%;
  height: 0;
  background-color: #fbfbfb;
  transition: height 0.5s ${({ oerder }) => `1.${oerder + 6}s`} ease,
    box-shadow 0.5s ${({ oerder }) => `1.${oerder + 6}s`} ease;
  border-radius: 0.25em;
  overflow: hidden;
  z-index: 1;

  &:hover {
    box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const VoteAvatarWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  width: 100%;
  padding: 0 1em;
  z-index: 1;
`;

const SubTitle = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  font-style: italic;
`;

const AvatarTitle = styled.p`
  white-space: nowrap;
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.85rem;
`;

const KanjiName = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 0.5rem;
`;

const VoteAvatar = styled.div<{ $color: string }>`
  position: relative;
  width: 9rem;
  height: 9rem;
  border-radius: 0.65rem;
  background: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const VoteInfo = styled.div`
  display: flex;
  flex: 2;
  align-items: end;
  width: 100%;
`;

const VoteInfoInner = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  width: calc(100% - 4rem);
  padding: 0 1rem;

  h3 {
    font-size: 1.125rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.gray[800]};
  }
`;

const DigitWrap = styled.div<{ $loadPage: boolean }>`
  margin: 0.5rem 0;
  overflow: hidden;
  height: ${({ $loadPage }) => ($loadPage ? "2rem" : 0)};
  transition: height 0.35s ease;
`;

const HeartWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 3rem;
`;

const SvgHeartWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  svg {
    width: 3rem;
    height: 3rem;
    color: rgba(243, 115, 115, 0.8);
  }
`;

const VoteButton = styled.button<{
  $voted: boolean;
  $isVotedCharacter: boolean;
  $color: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25em;
  transition: all 0.3s ease;
  height: 3rem;
  width: 100%;
  padding: 0 1rem;
  text-align: center;
  margin: auto;
  font-size: 1rem;
  vertical-align: baseline;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
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
  padding: 0.5rem;
  border-radius: 1rem;
`;

const LottieWrap = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? "inline" : "none")};
  width: 3rem;
  z-index: 2;
  margin-left: -1em;
  margin-right: -0.4em;
  margin-bottom: 0.25em;
`;

const HeartLottieWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12rem;
`;

const FloatHeartLottieWrap = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -80%);
  width: 4rem;
`;

const NumberWrap = styled.div<{ $isAnimating: boolean }>`
  height: 0;
`;
