"use client";

import type React from "react";

import styled from "styled-components";

import { Music, Guitar, Mic } from "lucide-react";
import { animations } from "@/lib/styled-animations";

export default function Footer() {
  return (
    <SectionLayout>
      <Container>
        <div className="icon-container">
          <Guitar />
          <Music />
          <Mic />
        </div>
        <p className="main-text">© 2024 Bocchi the Rock! Fan Page</p>
        <p className="sub-text">Made with ❤️ for all Kessoku Band fans</p>
        <p className="disclaimer">
          This is a fan-made tribute page. All rights belong to their respective
          owners.
        </p>
      </Container>
    </SectionLayout>
  );
}

// Styled Components

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const SectionLayout = styled.footer`
  background: linear-gradient(90deg, #db2777, #eab308, #2563eb);
  color: ${(props) => props.theme.colors.white};
  padding: 2rem 1rem;
  text-align: center;

  .icon-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;

    svg {
      width: 2rem;
      height: 2rem;
      animation: ${animations.pulse} 2s infinite;

      &:nth-child(2) {
        animation-delay: 0.1s;
      }
      &:nth-child(3) {
        animation-delay: 0.2s;
      }
    }
  }

  .main-text {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .sub-text {
    font-size: 0.875rem;
    opacity: 0.9;
  }

  .disclaimer {
    font-size: 0.75rem;
    margin-top: 0.5rem;
    opacity: 0.75;
  }
`;
