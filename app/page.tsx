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
  const [createUser, setCreateUser] = useState(false);

  const [dialog, setDialog] = useState(false);
  const [isNowLogin, setIsNowLogin] = useState(false); // 로그인 되어있는 상태인지 or 회원가입 후 로그인 했는지 여부

  const [authAlert, setAuthAlert] = useState(USER_ERROR_CODE.NONE);

  const [loginType, setLoginType] = useState(LoginEnum.FIRST);

  const [emojiPopup, setEmojiPopup] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState<{
    key: number;
    img: StaticImageData;
  } | null>(null);

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

  if (isLoading) return <Loading />;

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        {/* <ReactLenis root /> */}
        <PageContainer>
          {/* Hero Section */}
          {/* <MainSection /> */}
          {/* Character Introduction */}
          {/* <CharacterIntro /> */}
          {/* Character Popularity Vote Section */}
          {/* <VoteSection
            userId={userId}
            whoVoted={whoVoted}
            voteCount={voteCount}
            isHasUserCheck={signupPopupHandle}
            isNowLogin={isNowLogin}
          /> */}
          {/* <AudioSection frontSection={3} /> */}
          {/* YouTube Music Video Carousel */}
          {/* <VideoSection /> */}
          {/* <Dummy /> */}
          {/* Image List */}
          {/* <ImageSection /> */}
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
  min-height: 100vh;
  background: ${(props) => props.theme.colors.gradients.background};
  transform-style: preserve-3d;
`;

const Dummy = styled.div`
  width: 100%;
  height: 100vh;
`;
