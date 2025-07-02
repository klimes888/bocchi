import { useBreakpoint } from "@/hooks/use-breakpoint";
import React, { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const predefinedBounce = Array.from({ length: 10 }).map((_, i) => {
  const scaleStart = 0.2 * i;
  const scaleEnd = 0.2 * (i + 1);
  const rotateStart = 3 * i;
  const rotateEnd = 3 * (i + 1);

  return keyframes`
      0% {
        transform: scale(${scaleStart}) rotate(${rotateStart}deg);
      }
      100% {
        transform: scale(${scaleEnd}) rotate(${rotateEnd}deg);
      }
    `;
});

export const InfinityShape = ({ theme }: { theme: string }) => {
  let NUM_ROWS = 80;
  let NUM_COLS = 80;
  const breakPoint = useBreakpoint();

  switch (breakPoint) {
    case "desktop":
      NUM_ROWS = 80;
      NUM_COLS = 120;
      break;

    case "mobile":
      NUM_ROWS = 70;
      NUM_COLS = 80;
      break;

    default:
      break;
  }

  const getSizeRef = useRef<HTMLDivElement | null>(null);
  const [getHeight, setGetHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (getSizeRef.current) {
        const data = getSizeRef.current.getBoundingClientRect();
        setGetHeight(data.height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [getSizeRef]);

  //   if (!getHeight) return <></>;

  const row = Math.floor(getHeight / NUM_ROWS);
  const colunm = Math.floor(getHeight / NUM_COLS);

  return (
    <Grid $color={theme} ref={getSizeRef}>
      {[...Array(row)].map((_, rowIdx) => (
        <Row key={rowIdx}>
          {[...Array(colunm)].map((_, colIdx) => (
            <A key={colIdx}>
              <span>★</span>
              <B index={colIdx} $color={theme}>
                ★
              </B>
            </A>
          ))}
        </Row>
      ))}
    </Grid>
  );
};

const translateX = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
`;

const Row = styled.div`
  display: flex;
`;

const A = styled.div`
  width: 10%;
  height: 80px;
  position: relative;
  animation: ${translateX} 2s linear infinite;
`;

const B = styled.div<{ index: number; $color: string }>`
  position: absolute;
  width: 100%;
  height: 4rem;
  background-color: ${({ $color }) => $color};
  padding: 1.5rem;
  box-sizing: border-box;
  color: white;
  animation: ${({ index }) => predefinedBounce[index % 10]} 2s linear infinite;
  transition: background-color 0.3s ease;
`;

const Grid = styled.div<{ $color: string }>`
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  color: ${({ $color }) => $color};
  height: 100vh;
  width: 100vw;
  user-select: none;
  transition: color 0.3s ease;
`;
