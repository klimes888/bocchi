"use client";
import type React from "react";
import styled, { ThemeProvider } from "styled-components";

import { theme } from "@/lib/styled-theme";
import MusicSection from "@/components/MusicSection";
import VoteSection from "@/components/VoteSection";
import CharacterIntro from "@/components/CharacterIntro";
import Guestbook from "@/components/Guestbook";
import MainSection from "@/components/MainSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { UUID } from "@/lib/create-uuid";
import {
  createUsers,
  fetchUserDocument,
  getVoteCounts,
} from "@/lib/firebase/users";
import Loading from "@/components/ui/loading";

export default function BocchiLandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [whoVoted, setWhoVoted] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [voteCount, setvoteCount] = useState<Record<string, number> | null>(
    null
  );
  console.log("isLoading", isLoading);
  useEffect(() => {
    (async () => {
      const count = await getVoteCounts();
      setvoteCount(count);
    })();
  }, []);

  useEffect(() => {
    const uuid = localStorage.getItem("user_uuid");

    const resistUser = async () => {
      const id = UUID();
      const result = await createUsers(id);
      if (result) {
        localStorage.setItem("user_uuid", result);
        setUserId(result);
      }
    };

    (async () => {
      if (uuid) {
        try {
          const { user, votes } = await fetchUserDocument(uuid);
          const { uid, vote } = votes[0];

          setWhoVoted(vote || null);
          setUserId(uid || null);
        } catch (error) {
          resistUser();
        }
      } else {
        resistUser();
      }
    })();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const nextSection = document.getElementById("section1");
    nextSection?.scrollIntoView();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        {/* Hero Section */}
        <MainSection />

        {/* Character Introduction */}
        <CharacterIntro />

        {/* Character Popularity Vote Section */}
        <VoteSection
          userId={userId}
          whoVoted={whoVoted}
          voteCount={voteCount}
        />
        {/* YouTube Music Video Carousel */}
        <MusicSection />

        {/* Guestbook Section */}
        <Guestbook />

        {/* Footer */}
        <Footer />
      </PageContainer>
    </ThemeProvider>
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
