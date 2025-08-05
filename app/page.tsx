"use client";
import type React from "react";
import styled, { ThemeProvider } from "styled-components";
import { ReactLenis } from "lenis/react";

import { theme } from "@/lib/styled-theme";

import CharacterIntro from "@/components/CharacterIntro";
import Guestbook from "@/components/Guestbook";
import MainSection from "@/components/MainSection";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";
import { UUID } from "@/lib/create-uuid";
import {
  createUsers,
  fetchUserDocument,
  USER_ERROR_CODE,
  getUsers,
  getVoteCounts,
} from "@/lib/firebase/users";
import Loading from "@/components/ui/loading";
import GlobalStyle from "./styled-global";
import AudioSection from "@/components/AudioSection";
import ImageSection from "@/components/ImageSection";
import VoteSection from "@/components/VoteSection";
import { AuthDialog } from "@/components/Auth.Popup";
import { EmojiDialog } from "@/components/Emoji.Popup";
import { StaticImageData } from "next/image";
import { useBreakpoint } from "@/hooks/use-breakpoint";

export enum LoginEnum {
  NONE, // not logined
  FIRST, // logined but make profile not yet,
  ALREADY,
}

export default function BocchiLandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [whoVoted, setWhoVoted] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [voteCount, setvoteCount] = useState<Record<string, number> | null>(
    null
  );
  const [isPreventForMobile, setIsPreventForMobile] = useState(false);
  const [createUser, setCreateUser] = useState(false);

  const [dialog, setDialog] = useState(false);
  const [isNowLogin, setIsNowLogin] = useState(false); // 로그인 되어있는 상태인지 or 회원가입 후 로그인 했는지 여부

  const [authAlert, setAuthAlert] = useState(USER_ERROR_CODE.NONE);

  const [loginType, setLoginType] = useState(LoginEnum.FIRST);

  const breakPoint = useBreakpoint();

  const [emojiPopup, setEmojiPopup] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState<{
    key: number;
    img: StaticImageData;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const signupPopupHandle = () => {
    if (userId) return; // if has user info then logined
    setDialog(!dialog);
  };

  useEffect(() => {
    /** 총 투표 수 들고오기 */
    (async () => {
      const count = await getVoteCounts();
      setvoteCount(count);
    })();
  }, []);

  useEffect(() => {
    const isMobile = breakPoint === "mobile";
    setIsPreventForMobile(isMobile);

    if (isMobile) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [breakPoint, isLoading]);

  async function resistUser({ id, pw }: { id: string; pw: string }) {
    try {
      const result = await createUsers(id, pw);
      if (result.data?.id) {
        setUserId(result.data.id);
        // setCreateUser(true);
        // setTimeout(() => {
        //   setDialog(false);
        // }, 1000);
      }
      return result;
    } catch (error) {
      console.error("error: ", error);
    }
  }

  async function loginUser({ id, pw }: { id: string; pw: string }) {
    const { SUCCESS } = USER_ERROR_CODE;
    try {
      const result = await getUsers(id, pw);
      if (result.code === SUCCESS) {
        localStorage.setItem("user_uuid", result.data?.id);
        setUserId(result.data?.id);
        setDialog(false);
        fetchUserData(result.data?.id);
        setIsNowLogin(true);
      } else {
        setAuthAlert(result.code);
      }
      return result;
    } catch (error) {}
  }

  const fetchUserData = async (uuid: string | null) => {
    if (uuid) {
      try {
        const { votes, user } = await fetchUserDocument(uuid);
        if (votes.length >= 1) {
          setWhoVoted(votes[0].vote || null);
        }
        setUserId(user?.id || null);
      } catch (error) {}
    } else {
      // 유저가 없는 경우 유저 등록
      // resistUser();
    }
  };

  useEffect(() => {
    const uuid = localStorage.getItem("user_uuid");

    /** 파이어베이스 투표 데이터 들고 오기 */
    (async () => fetchUserData(uuid))();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const nextSection = document.getElementById("section1");
    nextSection?.scrollIntoView();
  }, []);

  const TITLE = "모바일은 작업중이에요⚠️";
  const DESC = "일단 PC 먼저 확인해주세요.";
  if (isLoading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        {/* <ReactLenis root /> */}
        <PageContainer ref={containerRef}>
          {isPreventForMobile && (
            <Prevent>
              <Popup>
                <PopupInner>
                  <Title>{TITLE}</Title>
                  <Desc>{DESC}</Desc>
                </PopupInner>
              </Popup>
            </Prevent>
          )}
          {/* Hero Section */}
          <MainSection />
          {/* Character Introduction */}
          <CharacterIntro />
          {/* Character Popularity Vote Section */}
          <VoteSection
            userId={userId}
            whoVoted={whoVoted}
            voteCount={voteCount}
            isHasUserCheck={signupPopupHandle}
            isNowLogin={isNowLogin}
          />
          <AudioSection frontSection={3} />
          {/* YouTube Music Video Carousel */}
          {/* <VideoSection /> */}
          {/* <Dummy /> */}
          {/* Image List */}
          <ImageSection />
          {/* Guestbook Section */}
          <Guestbook
            userId={userId}
            loginType={loginType}
            setEmojiPopup={setEmojiPopup}
            selectEmoji={selectEmoji}
            setSelectEmoji={setSelectEmoji}
            isHasUserCheck={signupPopupHandle}
          />
          {/* Footer */}
          <Footer />
          <AuthDialog
            openChange={setDialog}
            resistUser={resistUser}
            open={dialog}
            createUser={createUser}
            loginUser={loginUser}
          />
          <EmojiDialog
            open={emojiPopup}
            openChange={(props) => setEmojiPopup(props)}
            setSelectEmoji={(props) => setSelectEmoji(props)}
            selectEmoji={selectEmoji}
          />
        </PageContainer>
      </ThemeProvider>
    </>
  );
}

// Styled Components
const PageContainer = styled.div`
  position: relative;
  width: 100%;
  background: ${(props) => props.theme.colors.gradients.background};
  transform-style: preserve-3d;
`;

const Prevent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Popup = styled.div`
  width: 12rem;
  background-color: #fff;
  box-shadow: 0 0 0.85rem 0 rgba(0, 0, 0, 0.5);
  border-radius: 0.25rem;
  overflow: hidden;
`;

const PopupInner = styled.div`
  padding: 1rem;
`;

const Title = styled.p`
  font-size: 1rem;
  color: #222;
  font-weight: 700;
  margin-bottom: 0.65rem;
`;

const Desc = styled.p`
  font-size: 0.9rem;
  color: #444;
  font-weight: 400;
`;
