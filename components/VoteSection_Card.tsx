"use client";

import { useRef, useEffect, createRef, useState } from "react";
import styled, { css } from "styled-components";
import { Heart } from "lucide-react";
import Image, { StaticImageData } from "next/image";

// components
// star.json
// lib
import { animations } from "@/lib/styled-animations";

import Lottie from "lottie-react";
import StarLottie from "@/assets/icons/star.json";
import { RollingDigit } from "./RollingDigit";
import HeartLottie from "@/assets/icons/heart.json";
import FloatHeartLottie from "@/assets/icons/float_heart.json";
import { animateProportSpeedUtil } from "@/utils/animateProportSpeed.util";

interface Props {
  character: {
    id: number;
    name: string;
    nickname: string;
    trait: string;
    linear: Record<string, string>;
    gif: StaticImageData;
    img: StaticImageData;
    fColor: string;
    kanji: string;
    role: string;
    votes: number;
  };
  votedCharacter: number | null;
  handleVote: (flag: number, idx: number) => Promise<void>;
  order: number;
  animationActive: boolean;
  loadPage: boolean;
}

export default function VoteSectionCard(props: Props) {
  const {
    character,
    votedCharacter,
    handleVote,
    order,
    animationActive,
    loadPage,
  } = props;
  const charaRef = useRef<HTMLDivElement | null>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);
  const shadowWrapRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const lottieRefs = useRef<any>(null);
  const heartRefs = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [rectCalc, setRectCalc] = useState<DOMRect | null>(null);
  const [isBack, setIsBack] = useState(false);

  const cardWrapHandler = () => {
    if (
      !charaRef.current ||
      !titleWrapRef.current ||
      !shadowWrapRef.current ||
      !buttonRef.current
    )
      return;
    if (loadPage) {
      charaRef.current.style.height = "25.5rem";
      charaRef.current.style.boxShadow = "0 1em 1em 0.25em rgba(0, 0, 0, 0.3)";
      titleWrapRef.current.style.height = "12rem";
      shadowWrapRef.current.style.height = "12rem";
      buttonRef.current.style.height = "3rem";
      // animateProportSpeedUtil({
      //   start: 0,
      //   end: 0.9,
      //   duration: 1000,
      //   onUpdate: (v) => {
      //     console.log("value:", v.toFixed(2)); // 필요시 반올림
      //   },
      //   onComplete: () => {
      //     console.log("Done!");
      //   },
      //   easing: (t) => t * t, // 예: ease-in
      // });
      // charaRef.current.style.overflow = "none";
    } else {
      charaRef.current.style.height = "0";
      charaRef.current.style.boxShadow = "none";
      titleWrapRef.current.style.height = "0";
      shadowWrapRef.current.style.height = "0";
      buttonRef.current.style.height = "0";
      // charaRef.current.style.overflow = "hidden";
    }
  };

  useEffect(() => {
    if (!loadPage || !charaRef) return;
    setTimeout(() => {
      cardWrapHandler();
    }, 600);
  }, [charaRef, loadPage]);

  useEffect(() => {
    const card = charaRef.current;
    const glare = glareRef.current;
    if (glare && card && isBack) {
      card.style.transition = "transform 1000ms ease";
      card.style.transform = `rotateX(0deg) rotateY(1980deg)`;
      card.style.overflow = "hidden";
      glare.style.background = `linear-gradient(120deg, ${character.linear.a}, ${character.linear.b}`;
    }
  }, [isBack]);

  // tilt cacl
  const tiltCalcHandler = (e: React.MouseEvent) => {
    if (isBack) return;
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
    const card = charaRef.current;
    if (charaRef.current) {
      const rect = charaRef.current.getBoundingClientRect();
      setRectCalc(rect);
    }
    // Just run once
    const glare = glareRef.current;
    if (!card || !glare) return;
    card.style.transition = "transform 0.25s ease";
    timeoutRef.current = setTimeout(() => {
      card.style.transition = "none";
    }, 150); // transition 시간과 일치
    tiltCalcHandler(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    tiltCalcHandler(e);
  };

  const handleMouseLeave = () => {
    if (isBack) return;
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
          autoplay={true}
        />
      </HeartLottieWrap>
    );
  };

  const floatHeaerLottieWrap = () => {
    return (
      <FloatHeartLottieWrap>
        <Lottie animationData={FloatHeartLottie} loop={true} autoplay={true} />
      </FloatHeartLottieWrap>
    );
  };
  return (
    <VoteCardWrap
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      order={order}
      onClick={() => {
        handleVote(character.id, order);
        setIsBack(true);
      }}
    >
      <VoteCard
        key={character.id}
        order={order}
        ref={charaRef}
        $color={character.linear}
        $isVotedCharacter={votedCharacter === character.id}
        $isBack={isBack}
      >
        {/* <Glare ref={glareRef} color={character.linear} /> */}
        <VoteCardFront>
          <TitleWrap ref={titleWrapRef} order={order}>
            <SubTitle>{character.role}</SubTitle>
            <AvatarTitle>{character.name}</AvatarTitle>
            <KanjiName>{character.kanji}</KanjiName>
          </TitleWrap>
          <TextShadow ref={shadowWrapRef} order={order}>
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
            {/* <LottieWrap $visible={votedCharacter === character.id}>
            <Lottie
              lottieRef={lottieRefs}
              animationData={StarLottie}
              loop={false}
              autoplay={false}
            />
          </LottieWrap> */}
            <p>투표하기</p>
          </VoteButton>
        </VoteCardFront>
        <Glare ref={glareRef} color={character.linear} />
        <VoteCardBack>
          <CardContent>
            <VoteInfo>
              <VoteInfoInner>
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
                <DigitWrap $loadPage={animationActive}>
                  <RollingDigit
                    value={character.votes}
                    delay={500}
                    rolling={animationActive}
                  />
                </DigitWrap>

                {/* <VoteButton
                  onClick={() => {
                    handleVote(character.id, order);
                  }}
                  disabled={votedCharacter !== null}
                  $voted={votedCharacter !== null}
                  $isVotedCharacter={votedCharacter === character.id}
                  $color={character.color}
                  // $isAnimating={isAnimating}
                >
                  <LottieWrap $visible={votedCharacter === character.id}>
                    <Lottie
                      lottieRef={lottieRefs}
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
                </VoteButton> */}
              </VoteInfoInner>
            </VoteInfo>
            {/* <VoteAvatarWrap>
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
            </VoteAvatarWrap> */}
          </CardContent>
        </VoteCardBack>
        {/* <SkewedBox $color={character.fColor} /> */}
      </VoteCard>
    </VoteCardWrap>
  );
}

// Styled Components
const VoteCardWrap = styled.div<{ order: number }>`
  width: 100%;
  height: 27em;
  transform-style: preserve-3d;
  perspective: 80em;
  z-index: ${({ order }) => 4 - order};
  user-select: none;
`;

const VoteCard = styled.div<{
  order: number;
  $isVotedCharacter: boolean;
  $isBack: boolean;
  $color: Record<string, string>;
}>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 0;
  transition: height 0.5s ${({ order }) => `0.${order + 6}s`} ease,
    box-shadow 0.5s ${({ order }) => `0.${order + 6}s`} ease,
    transform 0.25s ease;
  border-radius: 1em;
  z-index: 1;
  transform-style: preserve-3d;
  perspective: 50em;
  pointer-events: none;
  will-change: transform;
  ${(props) =>
    props.$isVotedCharacter &&
    css`
      animation: ${animations.pulse(props.$color, { a: "80", b: "03" })} 1s
        ease-in-out infinite 1.1s;
    `}

  /* ${(props) =>
    css`
      transform: rotateY(${props.$isBack ? "180deg" : "0deg"});
    `} */

  &:hover {
    box-shadow: 0 25px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const VoteCardFront = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 50em;
  backface-visibility: hidden;
`;

const VoteCardBack = styled(VoteCardFront)`
  /* backface-visibility: visible; */
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: rotateY(180deg);
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

const VoteAvatarWrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: end;
  justify-content: center;
  width: 100%;
  padding: 0 1em;
  z-index: 1;
  transform-style: preserve-3d;
`;

const TitleWrap = styled.div<{ order: number }>`
  position: absolute;
  top: 3em;
  left: 2em;
  z-index: 9;
  transform: translate3d(0, 0, 2.5em);
  height: 0;
  overflow: hidden;
  transition: height 0.5s ${({ order }) => `0.${order + 6}s`} ease;
`;

const TextShadow = styled.div<{ order: number }>`
  position: absolute;
  transform: translate3d(0, 0, 1em);
  top: 3em;
  left: 2em;
  opacity: 0.8;
  filter: blur(0.1em) brightness(0.2);
  height: 0;
  overflow: hidden;
  transition: height 0.5s ${({ order }) => `0.${order + 6}s`} ease;
`;

const SubTitle = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
`;

const AvatarTitle = styled.p`
  white-space: nowrap;
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 2.8rem;
  color: rgba(255, 255, 255, 1);
  white-space: pre-line;
`;

const KanjiName = styled.p`
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
`;

const MusicToolWrap = styled.div<{ $isNijka: boolean }>`
  position: absolute;
  top: ${({ $isNijka }) => ($isNijka ? 58 : 55)}%;
  left: ${({ $isNijka }) => ($isNijka ? 45 : 50)}%;
  transform: translate3d(-50%, -50%, 5em);
  width: ${({ $isNijka }) => ($isNijka ? 12 : 14)}rem;
  height: 100%;
  z-index: 12;
`;

const MusicToolWrap2 = styled(MusicToolWrap)`
  top: ${({ $isNijka }) => ($isNijka ? 60 : 57)}%;
  left: ${({ $isNijka }) => ($isNijka ? 46 : 51)}%;
  transform: translate3d(-50%, -50%, 3em);
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

const VoteAvatar = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 9rem;
  height: 9rem;
  border-radius: 0.65rem;
  background: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform-style: preserve-3d;
  transform: translate3d(0, 0, 10em);
`;

const VoteInfo = styled.div`
  position: relative;
  display: flex;
  flex: 2;
  align-items: end;
  width: 100%;
`;

const VoteInfoInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  /* box-shadow: 0.2em 0.5em 0.5em 1px rgba(0, 0, 0, 0.3); */
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
  transform: translate3d(-50%, -50%, 10em);
  transform-style: preserve-3d;
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
