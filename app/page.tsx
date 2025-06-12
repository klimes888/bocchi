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
import Loading from "@/components/ui/loading";

export default function BocchiLandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    const nextSection = document.getElementById("section1");
    nextSection?.scrollIntoView();
  }, []);

  // if (!isLoading) return

  return (
    <ThemeProvider theme={theme}>
      {/* <Loading isLoading={isLoading} /> */}
      <PageContainer>
        {/* Hero Section */}
        <MainSection />

        {/* Character Introduction */}
        <CharacterIntro />

        {/* Character Popularity Vote Section */}
        <VoteSection />
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
`;
