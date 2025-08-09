"use client";

import { useRef, useEffect, useState, SetStateAction, Dispatch } from "react";
import styled, { css } from "styled-components";
import { Heart } from "lucide-react";
import Image, { StaticImageData } from "next/image";

// components
// star.json
// lib
import { animations } from "@/lib/styled-animations";

import Lottie from "lottie-react";
import { RollingDigit } from "./RollingDigit";
import HeartLottie from "@/assets/icons/heart.json";
import FloatHeartLottie from "@/assets/icons/float_heart.json";
import { useBreakpoint } from "@/hooks/use-breakpoint";

interface CharacterType {
  id: number;
  name: string;
  nickname: string;
  family: string;
  trait: string;
  linear: { deg: string; a: string; b: string };
  gif: StaticImageData;
  img: StaticImageData;
  voted: StaticImageData;
  fColor: string;
  // bdColor: string;
  kanji: string;
  role: string;
  votes: number;
  open: boolean;
}

interface Props {
  character: CharacterType;
  votedCharacter: number | null;
  handleVote: (flag: number, idx: number) => Promise<void>;
  order: number;
  animationActive: boolean;
  loadPage: boolean;
  isAlreadyVote: boolean;
  isNowLogin: boolean;
  setItemList: Dispatch<SetStateAction<CharacterType[]>>;
}

export default function VoteSectionCard(props: Props) {
  const {
    character,
    votedCharacter,
    handleVote,
    order,
    animationActive,
    loadPage,
    setItemList,
    isAlreadyVote,
    isNowLogin,
  } = props;

  const charaRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const shadowWrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const floatHeartRefs = useRef<any>(null);
  const heartRefs = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [rectCalc, setRectCalc] = useState<DOMRect | null>(null);
  const [rollingAnime, setRollingAnime] = useState(false);
  const [preventMouse, setPreventMouse] = useState(true);

  const breakPoint = useBreakpoint();

  const cardWrapHandler = () => {
    const card = charaRef.current;
    let timer;
    if (
      !card ||
      !titleWrapRef.current ||
      !shadowWrapRef.current ||
      !buttonRef.current
    )
      return;
    if (loadPage) {
      const size = breakPoint === "mobile" ? "20rem" : "27rem";
      card.style.height = size;
      card.style.boxShadow = "0 1em 1em 0.25em rgba(0, 0, 0, 0.3)";

      const txtSize = breakPoint === "mobile" ? "8rem" : "12rem";
      setTimeout(() => {
        if (!titleWrapRef.current) return;
        titleWrapRef.current.style.height = txtSize;
      }, 500);

      shadowWrapRef.current.style.height = txtSize;
      buttonRef.current.style.height = "3rem";
    } else {
      card.style.height = "0";
      card.style.boxShadow = "none";
      titleWrapRef.current.style.height = "0";
      titleWrapRef.current.style.opacity = "0";
      shadowWrapRef.current.style.height = "0";
      buttonRef.current.style.height = "0";
      setRollingAnime(false);
      // charaRef.current.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    const card = charaRef.current;
    if (!card) return;

    const trigger = () => {
      setPreventMouse(!loadPage);
    };

    card.addEventListener("transitionend", trigger);
    return () => {
      card.removeEventListener("transitionend", trigger);
    };
  }, [loadPage]);

  useEffect(() => {
    if (!loadPage || !charaRef) return;
    const result = setTimeout(() => {
      cardWrapHandler();
    }, 600);

    return () => clearTimeout(result);
  }, [loadPage]);

  useEffect(() => {
    const card = charaRef.current;

    const animationHandle = () => {
      // End rotate and scale up card
      setTimeout(() => {
        if (!card) return;
        if (votedCharacter === character.id) {
          // just selected card
          if (bodyRef?.current) {
            bodyRef.current.style.zIndex = "999";
          }
          const sacle = breakPoint === "mobile" ? "1.05" : "1.15";
          card.style.transform = `scale(${sacle}) rotateY(1980deg)`;
          if (heartRefs?.current || floatHeartRefs?.current) {
            heartRefs.current.play();
            floatHeartRefs.current.play();
          }
          setRollingAnime(true);
        } else {
          card.style.transform = "scale(0.95) rotateY(1980deg)";
          setRollingAnime(true);
        }
        card.style.transition = "transform 300ms ease-out";
      }, 500);
    };

    if (card && character.open) {
      // Trigger when click card for card rotate
      card.style.transition = "transform 1000ms cubic-bezier(0.1, 0.9, 0.2, 1)";
      card.style.transform = `rotateX(0deg) rotateY(1980deg)`;
      const size = breakPoint === "mobile" ? "19rem" : "24.5rem";
      card.style.height = size;

      // card transition이 끝난 후 실행하는 리스너
      card.addEventListener("transitionend", animationHandle);

      if (frontRef?.current) {
        frontRef.current.style.overflow = "hidden";
      }

      const glare = glareRef.current;
      if (glare && character.open) {
        glare.style.background = `linear-gradient(120deg, ${character.linear.a}, ${character.linear.b}`;
      }
    }

    return () => {
      // clear memory
      card && card.removeEventListener("transitionend", animationHandle);
    };
  }, [character.open]);

  useEffect(() => {
    if (!votedCharacter) return;

    const [firstDelay, secondDelay] =
      isAlreadyVote && !isNowLogin ? [2500, 4000] : [500, 2000];

    const timers: NodeJS.Timeout[] = [];

    // 첫 번째 애니메이션 (투표된 캐릭터만 열기)
    timers.push(
      setTimeout(() => {
        setItemList((prev) =>
          prev.map((data) =>
            data.id === votedCharacter ? { ...data, open: true } : data
          )
        );
      }, firstDelay)
    );

    // 두 번째 애니메이션 (나머지도 열기)
    timers.push(
      setTimeout(() => {
        setItemList((prev) =>
          prev.map((data) =>
            data.id !== votedCharacter ? { ...data, open: true } : data
          )
        );
      }, secondDelay)
    );

    // cleanup: 모든 타이머 제거
    return () => timers.forEach(clearTimeout);
  }, [votedCharacter, isAlreadyVote]);

  // tilt cacl
  const tiltCalcHandler = (e: React.MouseEvent) => {
    if (character.open) return;
    const card = charaRef.current;
    const glare = glareRef.current;
    if (!card || !glare || !rectCalc) return;
    const x = e.clientX - rectCalc.left; // 카드 내부에서의 마우스 X
    const y = e.clientY - rectCalc.top; // 카드 내부에서의 마우스 Y

    const centerX = rectCalc.width / 2;
    const centerY = rectCalc.height / 2;

    const rotateX = ((y - centerY) / centerY) * 25; // 위아래 반전
    const rotateY = ((x - centerX) / centerX) * -25;

    const toFixedRotateX = rotateX.toFixed(2);
    const toFixedRotateY = rotateY.toFixed(2);

    card.style.transform = `rotateX(${toFixedRotateX}deg) rotateY(${toFixedRotateY}deg)`;
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    glare.style.background = `linear-gradient(${angle}deg, ${character.linear.a}, ${character.linear.b}`;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (preventMouse) return;
    const card = charaRef.current;
    if (card) {
      const rect = card.getBoundingClientRect();
      setRectCalc(rect);
    }
    // Just run once
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transition = "transform 0.25s ease";
    timeoutRef.current = setTimeout(() => {
      if (!card) return;
      card.style.transition = "none";
    }, 150); // transition 시간과 일치

    tiltCalcHandler(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (preventMouse) return;
    tiltCalcHandler(e);
  };

  const handleMouseLeave = () => {
    if (character.open || preventMouse) return;
    const card = charaRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transition = "transform 0.25s ease";
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
    glare.style.background = `linear-gradient(120deg, ${character.linear.a}, ${character.linear.b}`;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const heartLottieWrap = () => {
    return (
      <HeartLottieWrap>
        <Lottie
          lottieRef={heartRefs}
          animationData={HeartLottie}
          loop={false}
          autoplay={false}
        />
      </HeartLottieWrap>
    );
  };

  const floatHeaerLottieWrap = () => {
    return (
      <FloatHeartLottieWrap>
        <Lottie
          lottieRef={floatHeartRefs}
          animationData={FloatHeartLottie}
          loop={true}
          autoplay={false}
        />
      </FloatHeartLottieWrap>
    );
  };

  return (
    <VoteCardWrap
      ref={bodyRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      order={order}
      onClick={() => {
        if (votedCharacter) return;
        handleVote(character.id, order - 1);
      }}
    >
      <VoteCard ref={charaRef} order={order} $isBack={character.open}>
        <VoteCardFront ref={frontRef}>
          <Glare ref={glareRef} color={character.linear} />
          <TitleWrap ref={titleWrapRef} order={order} $loadPage={loadPage}>
            <SubTitle>{character.role}</SubTitle>
            <AvatarTitle>{character.name}</AvatarTitle>
            <KanjiName>{character.kanji}</KanjiName>
          </TitleWrap>
          <TextShadow ref={shadowWrapRef} order={order} $loadPage={loadPage}>
            <SubTitle>{character.role}</SubTitle>
            <AvatarTitle>{character.name}</AvatarTitle>
            <KanjiName>{character.kanji}</KanjiName>
          </TextShadow>
          <MusicToolWrap $isNijka={character.id === 2}>
            <ImageItem src={character.img} alt="" />
          </MusicToolWrap>
          <MusicToolWrap2 $isNijka={character.id === 2}>
            <ShadowImage src={character.img} alt="" />
          </MusicToolWrap2>
          <VoteButton
            ref={buttonRef}
            // disabled={votedCharacter !== null}
            $voted={votedCharacter !== null}
            $isVotedCharacter={votedCharacter === character.id}
            $color={character.linear}
            // $isAnimating={isAnimating}
          >
            {/* <p>투표하기</p> */}
            <p>Voting</p>
          </VoteButton>

          {/* <SkewedBox $color={character.fColor} /> */}
        </VoteCardFront>
        <VoteCardBack
          $color={character.linear}
          $isVotedCharacter={votedCharacter === character.id}
        >
          <CardContent>
            <CharacterDummy color={character.fColor} />
            <CharacterWrap type={character.nickname}>
              <CharacterImg src={character.voted} alt="" />
            </CharacterWrap>
            <VoteInfo />
            <VoteInfo />
            <VoteInfo>
              <VoteInfoTop>
                <VoteInfoTopTitle>
                  <InfoTitle color={character.fColor}>
                    {character.nickname}
                  </InfoTitle>
                  <SubInfoTitle>{character.family}</SubInfoTitle>
                </VoteInfoTopTitle>
              </VoteInfoTop>
              <VoteInfoBottom>
                <HeartWrap>
                  {votedCharacter === character.id ? (
                    <>
                      {floatHeaerLottieWrap()}
                      {heartLottieWrap()}
                    </>
                  ) : (
                    <SvgHeartWrap>
                      <Heart />
                    </SvgHeartWrap>
                  )}
                </HeartWrap>
                <DigitWrap $loadPage={rollingAnime}>
                  <RollingDigit
                    value={character.votes}
                    delay={1000}
                    rolling={rollingAnime && animationActive}
                  />
                </DigitWrap>
              </VoteInfoBottom>
            </VoteInfo>
          </CardContent>
        </VoteCardBack>
      </VoteCard>
    </VoteCardWrap>
  );
}

// Styled Components
const VoteCardWrap = styled.div<{
  order: number;
}>`
  position: relative;
  width: 100%;
  height: 27em;
  transform-style: preserve-3d;
  perspective: 50em;
  z-index: ${({ order }) => 5 - order};
  user-select: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 20em;
    perspective: 40em;
  }
`;

const VoteCard = styled.div<{
  order: number;
  $isBack: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 0;
  transition: height 0.5s ${({ order }) => `0.${order + 5}s`} ease,
    box-shadow 0.5s ${({ order }) => `0.${order + 5}s`} ease;
  border-radius: 1em;
  z-index: 1;
  transform-style: preserve-3d;
  pointer-events: none;
`;

const CardFace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const VoteCardFront = styled(CardFace)`
  transform-style: preserve-3d;
  perspective: 50em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    perspective: 40em;
  }
`;

const VoteCardBack = styled(CardFace)<{
  $isVotedCharacter: boolean;
  $color: Record<string, string>;
}>`
  transform: rotateY(180deg);
  background-color: #f1f1f1;
  z-index: 1;
  border-radius: 1rem;
  ${(props) =>
    props.$isVotedCharacter &&
    css`
      animation: ${animations.pulse(props.$color, { a: "80", b: "03" })} 1s
        ease-in-out infinite 1.1s;
    `}
`;

const CardContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0.65rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.25rem;
  }
`;

const CharacterDummy = styled.div<{ color?: string }>`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  transform: translate(-50%, 10%);
  width: 90%;
  height: 16rem;
  border-radius: 0.2rem;
  opacity: 0.5;
  background-color: ${({ color }) => color};
  z-index: 9;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 12rem;
  }
`;

const CharacterWrap = styled(CharacterDummy)<{ type?: string }>`
  transform: translate(-50%, 0);
  height: 17.6rem;
  overflow: hidden;
  opacity: 1;
  background-color: transparent;
  z-index: 10;

  ${({ type }) => {
    switch (type) {
      case "HITORI":
        return `width: 65%; transform: translate(-50%, 1%); height: 18rem;`;
      case "RYO":
        return `width: 80%; transform: translate(-50%, 1%); height: 18rem;`;
      case "NIJIKA":
        return `width: 77%; transform: translate(-50%, 0%); height: 18rem;`;
      case "IKUYO":
        return `width: 90.5%; transform: translate(-50%, 2%); height: 18rem;`;

      default:
        return "width: 70%;";
    }
  }}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    height: 13rem;

    ${({ type }) => {
      switch (type) {
        case "HITORI":
          return `width: 65%; transform: translate(-50%, 0%); height: 14rem;`;
        case "RYO":
          return `width: 80%; transform: translate(-50%, 1%);`;
        case "NIJIKA":
          return `width: 77%; transform: translate(-50%, -1%); height: 13.5rem;`;
        case "IKUYO":
          return `width: 90%; transform: translate(-50%, 1%); height: 13.5rem;`;

        default:
          return "width: 70%;";
      }
    }}
  }
`;

const CharacterImg = styled(Image)`
  width: 100%;
`;

const Glare = styled.div<{ color: Record<string, string> }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  inset: 0;
  border-radius: 1em;
  background: linear-gradient(
    var(--tilt-angle, 120deg),
    ${({ color }) => color.a},
    ${({ color }) => color.b}
  );
  transition: background 0.3s ease;
  will-change: background;
`;

const TitleWrap = styled.div<{ order?: number; $loadPage: boolean }>`
  position: absolute;
  top: 3em;
  left: 2em;
  z-index: 9;
  transform: translate3d(0, 0, 2.5em);
  opacity: ${({ $loadPage }) => ($loadPage ? 1 : 0)};
  height: 0;
  overflow: hidden;
  ${({ order }) =>
    order &&
    css`
      transition: height 0.5s ${`0.${order + 5}s`} ease,
        opacity 0.5s ${`0.${order + 5}s`} ease;
    `}
`;

const TextShadow = styled.div<{ order: number; $loadPage: boolean }>`
  position: absolute;
  transform: translate3d(0, 0, 1.2em);
  top: 3em;
  left: 2em;
  opacity: 0.8;
  opacity: ${({ $loadPage }) => ($loadPage ? 1 : 0)};
  filter: blur(0.1em) brightness(0.2);
  height: 0;
  overflow: hidden;
  transition: height 0.5s ${({ order }) => `0.${order + 5}s`} ease;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    transform: translate3d(0, 0, 1em);
    font-size: 0.85rem;
  }
`;

const SubTitle = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.85rem;
  }
`;

const AvatarTitle = styled.p<{ $invertColor?: string }>`
  white-space: nowrap;
  font-size: 2.85rem;
  font-weight: 900;
  line-height: 2.95rem;
  letter-spacing: 0.1rem;
  color: ${({ $invertColor }) =>
    $invertColor ? $invertColor : "rgba(255, 255, 255, 1)"};
  white-space: pre-line;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
    font-weight: 700;
    line-height: 2rem;
  }
`;

const KanjiName = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const MusicToolWrap = styled.div<{ $isNijka: boolean }>`
  position: absolute;
  top: ${({ $isNijka }) => ($isNijka ? 58 : 55)}%;
  left: ${({ $isNijka }) => ($isNijka ? 45 : 50)}%;
  transform: translate3d(-50%, -50%, 5em);
  width: ${({ $isNijka }) => ($isNijka ? 14 : 18)}rem;
  height: 100%;
  z-index: 9999;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: ${({ $isNijka }) => ($isNijka ? 60 : 55)}%;
    left: ${({ $isNijka }) => ($isNijka ? 50 : 50)}%;
    width: ${({ $isNijka }) => ($isNijka ? 9 : 10)}rem;
  }
`;

const MusicToolWrap2 = styled(MusicToolWrap)`
  top: ${({ $isNijka }) => ($isNijka ? 60 : 57)}%;
  left: ${({ $isNijka }) => ($isNijka ? 46 : 51)}%;
  transform: translate3d(-50%, -50%, 3em);
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    transform: translate3d(-50%, -50%, 2em);
  }
`;

const ImageItem = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 9;
`;

const ShadowImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 8;
  opacity: 0.6;
  filter: blur(0.1em) brightness(0.3);
`;

const VoteInfo = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const VoteInfoTop = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  z-index: 11;
`;

const VoteInfoTopTitle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 0.4rem;
  margin-top: -0.3rem;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    margin-top: 0.5rem;
  }
`;

const InfoTitle = styled.p`
  font-family: "Year One", sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 1.2rem;
  }
`;

const SubInfoTitle = styled.p`
  font-size: 0.9rem;
  line-height: 1rem;
  color: #888;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    font-size: 0.8rem;
    line-height: 0.9rem;
  }
`;

const VoteInfoBottom = styled(VoteInfoTop)`
  justify-content: end;
  align-items: end;
  height: 100%;
  /* padding: 1rem; */

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.gray[800]};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    align-items: center;
  }
`;

const DigitWrap = styled.div<{ $loadPage: boolean }>`
  margin: 0.5rem 0;
  padding-right: 0.5rem;
  overflow: hidden;
  height: ${({ $loadPage }) => ($loadPage ? "2rem" : 0)};
  transition: height 0.35s ease;
`;

const HeartWrap = styled.div`
  position: relative;
  display: flex;
  /* align-items: center; */
  justify-content: center;
  width: 3rem;
  height: 3rem;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: 2rem;
    height: 2rem;
  }
`;

const SvgHeartWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  svg {
    width: 2rem;
    height: 2rem;
    color: rgba(243, 115, 115, 0.8);
    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    transform: translate(-50%, -60%);
  }
`;

const VoteButton = styled.div<{
  $voted: boolean;
  $isVotedCharacter: boolean;
  $color: Record<string, string>;
}>`
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 1em 1em;
  transition: height 0.3s 0.65s ease;
  height: 0;
  overflow: hidden;
  text-align: center;
  margin: auto;
  font-size: 1rem;
  vertical-align: baseline;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  transform-style: preserve-3d;
  transform: translateX(-50%);

  cursor: pointer;
  z-index: 10;
  ${(props) =>
    css`
      background: linear-gradient(120deg, ${props.$color.a}, ${props.$color.b});
      &:hover {
        opacity: 0.9;
      }
    `}

  &:disabled {
    cursor: not-allowed;
  }

  p {
  }
`;

const HeartLottieWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 10em);
  transform-style: preserve-3d;
  width: 6rem;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: 4rem;
  }
`;

const FloatHeartLottieWrap = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -75%);
  width: 2rem;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: 1.8rem;
  }
`;
