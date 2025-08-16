"use client";
import styled from "styled-components";

import a from "@/assets/images/1.jpg";
import b from "@/assets/images/2.jpg";
import c from "@/assets/images/3.jpg";
import d from "@/assets/images/4.jpg";
import e from "@/assets/images/5.jpg";
import f from "@/assets/images/6.jpg";
import g from "@/assets/images/7.jpg";
import h from "@/assets/images/8.jpg";
import i from "@/assets/images/9.jpg";
import j from "@/assets/images/10.jpg";
import k from "@/assets/images/11.jpg";
import l from "@/assets/images/12.jpg";
import m from "@/assets/images/13.jpg";
import n from "@/assets/images/14.jpg";
import o from "@/assets/images/15.jpg";
import p from "@/assets/images/16.jpg";
import q from "@/assets/images/17.jpg";
import r from "@/assets/images/18.jpg";
import s from "@/assets/images/19.jpg";
import t from "@/assets/images/20.jpg";
import u from "@/assets/images/21.jpg";
import v from "@/assets/images/22.jpg";
import w from "@/assets/images/23.jpg";
import x from "@/assets/images/24.jpg";
import y from "@/assets/images/25.jpg";
import z from "@/assets/images/26.jpg";

import aa from "@/assets/images/27.jpg";
import bb from "@/assets/images/28.jpg";
import cc from "@/assets/images/29.jpg";
import dd from "@/assets/images/30.jpg";

import ImageSectionImage from "./ImageSection_Image";
import { useRef, useState } from "react";
import { useBreakpoint } from "@/hooks/use-breakpoint";
// import { useDragDetect } from "@/hooks/use-drag";

export default function ImageSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  // useDragDetect({
  //   threshold: 0.2,
  //   curPos: "section5",
  //   where: "section6",
  // });
  const images = [
    [f, j],
    [bb, o],
    [cc, k],
    [l, d],
    [h, u],
    [q, m],
    [a, aa],
    [r, s],
    [y, v],
    [i, e],
    [t, p],
    [z, g],
    [w, c],
    [n, dd],
    [x, b],
  ];

  const breakPoint = useBreakpoint();
  const size = breakPoint === "mobile" ? 2 : 4;

  let columns: any[] = [];

  for (let i = 0; i < size; i++) {
    columns.push([]);
  }
  images.forEach((img, i) => {
    columns[i % size].push(img);
  });

  return (
    <Section ref={ref} id="section5">
      <ItemSectionInner>
        {columns.map((data, i) => (
          <Column key={i}>
            {data.map((item: any, j: number) => (
              <ImageSectionImage key={j} data={item} />
            ))}
          </Column>
        ))}
      </ItemSectionInner>
    </Section>
  );
}

// Styled Components
const Section = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #000;
  padding-bottom: 12em;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 8rem 0.5rem 8rem 0.5rem;
  }
`;

const ItemSectionInner = styled.div`
  display: flex;
  gap: 1rem;
  height: 100%;
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
