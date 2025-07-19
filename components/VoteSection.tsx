"use client";

import type React from "react";
import { createRef, Fragment, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

// assets
import NijikaGif from "@/assets/votes/nijika.gif";
import RyoGif from "@/assets/votes/ryo.gif";
import HitoriGif from "@/assets/votes/hitori.gif";
import KitaGif from "@/assets/votes/kita.gif";

import Nijika from "@/assets/votes/trans_nijika.png";
import Ryo from "@/assets/votes/trans_yamada.png";
import Hitori from "@/assets/votes/trans_hitori.png";
import Kita from "@/assets/votes/trans_kita.png";

import { useIntersectionObserver } from "./useIntersection";

import { useDragDetect } from "@/hooks/use-drag";

import { submitVote } from "@/lib/firebase/vote";
import VoteSectionCard from "./VoteSection_Card";

// Character data with their signature colors
const characters = [
  {
    id: 1,
    name: "Hitori\nGotoh",
    nickname: "Bocchi",
    voiceActor: "Yoshino Aoyama",
    trait: "Extremely introverted but passionate guitarist",
    linear: { deg: "135deg", a: "#f68ac2", b: "rgb(253, 2, 254)" },
    // color: "linear-gradient(135deg, #f68ac2, #FD02FE)",
    gif: HitoriGif,
    img: Hitori,
    fColor: "rgba(255, 128, 193, 0.9)",
    kanji: "ご と う ひ と り",
    role: "Main Guitarist",
    votes: 0,
  },
  {
    id: 2,
    name: "Nijika\nIjichi",
    nickname: "Nijika",
    voiceActor: "Sayumi Suzushiro",
    trait: "Cheerful drummer who brings everyone together",
    linear: { deg: "135deg", a: "#facc15", b: "#fb923c" },
    gif: NijikaGif,
    img: Nijika,
    fColor: "rgba(250, 210, 49, 0.9)",
    kanji: "い じ ち に じ か",
    role: "Drummer",
    votes: 0,
  },
  {
    id: 3,
    name: "Ryo\nYamada",
    nickname: "Ryo",
    voiceActor: "Saku Mizuno",
    trait: "Cool bassist with a mysterious aura",
    linear: { deg: "135deg", a: "#4e84f7", b: "#4f46e5" },
    gif: RyoGif,
    img: Ryo,
    fColor: "rgba(99, 147, 250, 0.9)",
    kanji: "や ま だ リ ョ ウ",
    role: "Bassist & Sub Vocalist",
    votes: 0,
  },
  {
    id: 4,
    name: "Ikuyo\nKita",
    nickname: "Kita",
    trait: "Energetic vocalist full of dreams",
    linear: { deg: "135deg", a: "#f56969", b: "#fb923c" },
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
  isHasUserCheck: (top: number) => void;
}

const theme: Record<string, string> = {
  Kita: "#f56969",
  Ryo: "#4e84f7",
  Nijika: "#facc15",
  Bocchi: "#f68ac2",
};

export default function VoteSection(props: Props) {
  useDragDetect({ threshold: 20, curPos: "section3", where: "section4" });
  const { userId, whoVoted, voteCount, isHasUserCheck } = props;
  const [itemList, setItemList] = useState(characters);
  const [votedCharacter, setVotedCharacter] = useState<number | null>(null);
  const [gridHoverType, setGridHoverType] = useState(characters[0].nickname);
  const [loadPage, setLoadPage] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);

  const heartRefs = useRef<Array<any | null>>(itemList.map(() => createRef()));

  const ref = useRef<HTMLDivElement | null>(null);
  const titleWrapref = useRef<HTMLDivElement | null>(null);
  const wordRef = useRef<(HTMLDivElement | null)[]>([]);

  const wordAniamtionHandle = (isFirst: boolean) => {
    wordRef.current.forEach((el) => {
      if (!el) return;
      if (isFirst) {
        el.style.height = "17rem";
      } else {
        el.style.height = "0";
      }
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

  useIntersectionObserver(ref, 0.9, {
    isEnter: () => {
      setLoadPage(true);
      requestAnimationFrame(() => {
        wordAniamtionHandle(true);
        titleWrapAnimationHandler(true);
      });
    },
  });

  useIntersectionObserver(ref, 0.05, {
    elseFunc: () => {
      setLoadPage(false);
      requestAnimationFrame(() => {
        wordAniamtionHandle(false);
      });
    },
  });

  const handleVote = async (characterIndex: number, index: number) => {
    if (!ref.current) return;
    if (!userId) {
      const top = ref.current?.offsetTop;
      isHasUserCheck(top);
      return;
    }
    if (votedCharacter !== null) return;

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
      // who selected
      setVotedCharacter(characterIndex);
      setTimeout(() => {
        // lottieRefs.current[index].current?.play();
        heartRefs.current[index].current?.play();
      }, 1000);
    } catch (error) {
      alert("투표에 문제가 생겼습니다. 다시 실행해주세요");
      console.error("error", error);
    }
  };

  useEffect(() => {
    if (!loadPage) return;

    const maxCardDelay = itemList.length * 100 + 1600; // 1.6s + n * 100ms
    const digitDelay = maxCardDelay + 500; // 카드 애니메이션 + 여유시간

    const timer = setTimeout(() => {
      setAnimationActive(true);
    }, digitDelay);

    return () => clearTimeout(timer);
  }, [loadPage]);

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
            <Fragment key={i}>
              <VoteSectionCard
                character={character}
                votedCharacter={votedCharacter}
                handleVote={handleVote}
                animationActive={animationActive}
                order={i}
                loadPage={loadPage}
              />
            </Fragment>
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
  grid-template-columns: 2fr;
  gap: 2.5rem;
  width: 100%;
  max-width: 80rem;
  margin-top: 5em;
  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
