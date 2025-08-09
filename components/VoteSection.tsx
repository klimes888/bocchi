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

// assets - voted
import VotedBocchi from "@/assets/votes/voted_bocchi.png";
import VotedYamada from "@/assets/votes/voted_yamada.png";
import VotedNijika from "@/assets/votes/voted_nijika.png";
import VotedKita from "@/assets/votes/voted_kita2.png";

import { useIntersectionObserver } from "./useIntersection";

import { useDragDetect } from "@/hooks/use-drag";

import { submitVote } from "@/lib/firebase/vote";
import VoteSectionCard from "./VoteSection_Card";
import { useBreakpoint } from "@/hooks/use-breakpoint";

// Character data with their signature colors
const characters = [
  {
    id: 1,
    name: "Hitori\nGotoh",
    nickname: "HITORI",
    family: "GOTOH",
    voiceActor: "Yoshino Aoyama",
    trait: "Extremely introverted but passionate guitarist",
    linear: { deg: "135deg", a: "#f68ac2", b: "#fd02fe" },
    // color: "linear-gradient(135deg, #f68ac2, #FD02FE)",
    gif: HitoriGif,
    img: Hitori,
    voted: VotedBocchi,
    fColor: "rgba(255, 128, 193, 0.9)",
    kanji: "ご と う ひ と り",
    role: "Main Guitarist",
    votes: 921,
    open: false,
  },
  {
    id: 2,
    name: "Nijika\nIjichi",
    nickname: "NIJIKA",
    family: "IJICHI",
    voiceActor: "Sayumi Suzushiro",
    trait: "Cheerful drummer who brings everyone together",
    linear: { deg: "135deg", a: "#facc15", b: "#fb923c" },
    gif: NijikaGif,
    img: Nijika,
    voted: VotedNijika,
    fColor: "rgba(250, 210, 49, 0.9)",
    kanji: "い じ ち に じ か",
    role: "Drummer",
    votes: 1112,
    open: false,
  },
  {
    id: 3,
    name: "Ryo\nYamada",
    nickname: "RYO",
    family: "YAMADA",
    voiceActor: "Saku Mizuno",
    trait: "Cool bassist with a mysterious aura",
    linear: { deg: "135deg", a: "#4e84f7", b: "#4f46e5" },
    gif: RyoGif,
    img: Ryo,
    voted: VotedYamada,
    fColor: "rgba(99, 147, 250, 0.9)",
    kanji: "や ま だ リ ョ ウ",
    role: "Bassist & Sub Vocalist",
    votes: 902,
    open: false,
  },
  {
    id: 4,
    name: "Ikuyo\nKita",
    nickname: "IKUYO",
    family: "KITA",
    trait: "Energetic vocalist full of dreams",
    linear: { deg: "135deg", a: "#f56969", b: "#fb923c" },
    gif: KitaGif,
    img: Kita,
    voted: VotedKita,
    fColor: "rgba(234, 82, 82, 0.9)",
    kanji: "き た い く よ",
    role: "Guitarist & Vocalist",
    votes: 823,
    open: false,
  },
];

interface Props {
  userId: string | null;
  whoVoted: string | null;
  voteCount: Record<string, number> | null;
  isHasUserCheck: (top: number) => void;
  isNowLogin: boolean;
}

const theme: Record<string, string> = {
  KITA: "#f56969",
  RYO: "#4e84f7",
  NIJIKA: "#facc15",
  HITORI: "#f68ac2",
};

export default function VoteSection(props: Props) {
  useDragDetect({ threshold: 20, curPos: "section3", where: "section4" });
  const { userId, whoVoted, voteCount, isHasUserCheck, isNowLogin } = props;
  const [itemList, setItemList] = useState(characters);
  const [votedCharacter, setVotedCharacter] = useState<number | null>(null);
  const [gridHoverType, setGridHoverType] = useState(characters[0].nickname);
  const [loadPage, setLoadPage] = useState(false);
  const [animationActive, setAnimationActive] = useState(false);
  const [isAlreadyVote, setIsAlreadyVote] = useState(true);

  const breakPoint = useBreakpoint();

  // const [isAllOpen, setIsAllOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const titleWrapref = useRef<HTMLDivElement | null>(null);
  const wordRef = useRef<(HTMLDivElement | null)[]>([]);

  const wordAniamtionHandle = (isFirst: boolean) => {
    const size = breakPoint === "mobile" ? "12rem" : "17rem";
    wordRef.current.forEach((el) => {
      if (!el) return;
      if (isFirst) {
        el.style.height = size;
      } else {
        el.style.height = "0";
      }
    });
  };

  const wordSmallHandler = (isFirst: boolean) => {
    const size = breakPoint === "mobile" ? "2.5rem" : "4rem";
    wordRef.current.forEach((el) => {
      if (!el) return;
      if (isFirst) {
        el.style.fontSize = size;
      } else {
      }
    });
  };

  const titleWrapAnimationHandler = (isFirst: boolean) => {
    if (isFirst) {
      setTimeout(() => {
        wordSmallHandler(true);
        if (!titleWrapref.current) return;
        if (isFirst) {
          const top = breakPoint === "mobile" ? "-200%" : "-130%";
          titleWrapref.current.style.transform = `translate(-50%, ${top})`;
        }
      }, 1000);
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
    // setVotedCharacter(characterIndex);
    // return;
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
    setIsAlreadyVote(true);
    setVotedCharacter(whoVoted ? Number(whoVoted) : null);
  }, [whoVoted]);

  useEffect(() => {
    if (!voteCount) return;
    const result = characters.map((data, i) => ({
      ...data,
      votes: voteCount[i + 1] + data.votes, // dummy
    }));
    setItemList(result);
  }, [voteCount]);

  const words = ["V", "O", "T", "E"];

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
                order={i + 1}
                loadPage={loadPage}
                setItemList={setItemList}
                isAlreadyVote={isAlreadyVote}
                isNowLogin={isNowLogin}
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

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0rem 0.5rem 8em 0.5rem;
  }
`;

const SectionTitleWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  transition: transform 0.5s ease;
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
  @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
    font-size: 4rem;
  }
  h2 {
    font-weight: bold;
    text-align: center;
    transition: font-size 0.5s ease;
    font-size: 4rem;
    color: #fff;
    text-shadow: 0 0 4px ${({ color }) => color},
      0 0 8px ${({ color }) => color};
    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      font-size: 3rem;
    }
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
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  width: 100%;
  max-width: 85rem;
  margin-top: 5em;
  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.65rem;
    margin-top: 11em;
  }
`;
