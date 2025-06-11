"use client";

import type React from "react";
import styled, { ThemeProvider } from "styled-components";

import { theme } from "@/lib/styled-theme";
import MusicSection from "@/components/MusicSection";
import VoteSection from "@/components/VoteSection";
import CharacterIntro from "@/components/CharacterIntro";
import { Footer } from "react-day-picker";
import Guestbook from "@/components/Guestbook";
import MainSection from "@/components/MainSection";

export default function BocchiLandingPage() {
  return (
    <ThemeProvider theme={theme}>
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
  min-height: 100vh;
  background: ${(props) => props.theme.colors.gradients.background};
`;
