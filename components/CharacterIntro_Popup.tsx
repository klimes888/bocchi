import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";

import Image, { StaticImageData } from "next/image";
import { chara } from "@/data/intro";
import { useBreakpoint } from "@/hooks/use-breakpoint";

interface Props {
  type: string;
  isOpen: boolean;
  isClick: (flag: boolean) => void;
}

const CloumnCard = ({ prop, isOpen }: any) => {
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    setIsClick(false);
  }, [isOpen]);

  return (
    <AccordianWrap onClick={() => setIsClick(!isClick)}>
      <CardTitle>{prop.title}</CardTitle>
      <CardWrap $isClick={isClick}>
        <CardDesc>{prop.desc}</CardDesc>
      </CardWrap>
    </AccordianWrap>
  );
};

const CharacterIntroPopup = (props: Props) => {
  const { isOpen, isClick, type } = props;
  const [scrollY, setScrollY] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const breakPoint = useBreakpoint();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기값 설정
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      scrollRef.current && (scrollRef.current.scrollTop = 0); // 렌더링 시 처음으로
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`; // dummy layout
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!ref?.current) return;
    const headerElement = (ref.current as HTMLElement).offsetHeight;
    setHeaderHeight(headerElement);
  }, [ref.current, isOpen]);
  const size = breakPoint === "mobile" ? 80 : 122;
  return (
    <Layout
      $open={isOpen}
      style={{ top: scrollY }}
      onClick={() => {
        isClick(!isOpen);
      }}
    >
      <Popup $open={isOpen} style={{ top: scrollY + size }} />
      <ScrollWrapper
        ref={scrollRef}
        style={{ top: scrollY + size, height: window.innerHeight - size }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <UgoiraWrap
            onClick={() => {
              isClick(!isOpen);
            }}
          >
            {type && (
              <Ugoira
                src={chara[type].src}
                alt=""
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </UgoiraWrap> */}
        <PopupInner $open={isOpen}>
          {/** 첫번 째 섹션 */}
          <TitleWrap $index={1} style={{ top: 0 }} ref={ref}>
            <Title>{chara[type]?.desc[0]?.name}</Title>
          </TitleWrap>
          <ContentWrap>
            <BodyImgWrap>
              {chara[type] && <BodyImg src={chara[type].desc[0].img} alt="" />}
            </BodyImgWrap>
            <DescWrapOutter>
              {chara[type]?.desc[0]?.intro.map((prop: any, i: number) => (
                <DescWrap
                  key={i}
                  $isLast={i + 1 === chara[type]?.desc[0]?.intro.length}
                >
                  <DescWrapInner>
                    <Header>{prop.title}</Header>
                    {prop.desc.map((desc: string, i: number) => (
                      <Descript key={i} $isQuote={prop.title === "Quote"}>
                        {desc}
                      </Descript>
                    ))}
                  </DescWrapInner>
                </DescWrap>
              ))}
            </DescWrapOutter>
          </ContentWrap>
          {/** 두번 째 섹션 */}
          <TitleWrap $index={2} style={{ top: headerHeight }}>
            <Title>{chara[type]?.desc[1]?.name}</Title>
          </TitleWrap>
          <DescWrapOutter>
            {chara[type]?.desc[1]?.intro.map((prop: any, i: number) => (
              <CardWrapOutter key={i} $isLast={false}>
                <CloumnCard prop={prop} isOpen={isOpen} />
              </CardWrapOutter>
            ))}
            <DummyLayout />
          </DescWrapOutter>
        </PopupInner>
      </ScrollWrapper>
    </Layout>
  );
};

const Layout = styled.div<{ $open: boolean }>`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* width: 100%; */
  /* height: 100vh; */
  justify-content: flex-start;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  z-index: 10;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: opacity 1s ${({ $open }) => ($open ? "0s" : "0.5s")} ease,
    visibility 0s ${({ $open }) => ($open ? "0s" : "1.5s")}; // 핵심
`;
const ScrollWrapper = styled.div`
  position: fixed;
  width: 100%;
  overflow-y: scroll;
`;

const Popup = styled.div<{ $open: boolean }>`
  position: fixed;
  display: flex;
  width: 100vw;
  /* height: 100vh; */
  background-color: #fff;
  transform: rotate(${({ $open }) => ($open ? "0" : "90deg")});
  transform-origin: left top;
  transition: transform 1s ${({ $open }) => ($open ? "0.5s" : "0s")}
    cubic-bezier(0.19, 1, 0.22, 1);
`;

const PopupInner = styled.div<{ $open: boolean }>`
  background-color: #fff;
  width: 100%;
  transform: rotate(${({ $open }) => ($open ? "0" : "90deg")});
  transform-origin: left top;
  transition: transform 1s ${({ $open }) => ($open ? "0.8s" : "0s")}
    cubic-bezier(0.19, 1, 0.22, 1);
`;

const TitleWrap = styled.div<{ $index: number }>`
  position: sticky;
  background-image: linear-gradient(to right, black 16.666%, #ffffff 16.6667%);
  background-position: bottom;
  background-size: 1rem 1px;
  background-repeat: repeat-x;
  background-color: #fff;
  display: flex;
  width: 100%;
  padding: 0 1em;
  margin-bottom: 0.5em;
  z-index: ${({ $index }) => $index};
`;

const Title = styled.h2`
  font-family: "Roboto Condensed", sans-serif;
  letter-spacing: -0.2rem;
  font-size: clamp(2.5rem, 4vw, 5.5rem);
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em;
  margin-bottom: 3em;
  background-image: linear-gradient(to right, black 16.666%, #ffffff 16.6667%);
  background-position: bottom;
  background-size: 1rem 2px;
  background-repeat: repeat-x;
  min-height: 1px;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5em;
    margin-bottom: 2rem;
    flex-direction: column;
  }
`;

const BodyImgWrap = styled.div`
  max-width: 40%;
  padding: 0 1em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-top: 3rem;
    padding: 0;
    max-width: 30%;
  }
`;
const BodyImg = styled(Image)`
  width: 100%;
`;

const DescWrapOutter = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background-image: linear-gradient(to right, black 16.666%, #ffffff 16.6667%);
  background-position: left;
  background-size: 1px 1.2rem;
  background-repeat: repeat-y;
  background-position: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: auto;
  }
`;

const DummyLayout = styled.div`
  width: 100%;
  height: 20em;
`;

const DescWrap = styled.div<{ $isLast: boolean }>`
  display: flex;
  width: 100%;
  margin: 0 1em;
  padding: 1em 0;
  ${({ $isLast }) =>
    !$isLast &&
    css`
      background-image: linear-gradient(
        to right,
        black 16.666%,
        #ffffff 16.6667%
      );
      background-position: bottom;
      background-size: 0.8rem 1px;
      background-repeat: repeat-x;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: auto;
    margin: 0;
  }
`;

const DescWrapInner = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0;
  }
`;

const Header = styled.p`
  font-family: "Roboto Condensed", sans-serif;
  font-size: clamp(1.1rem, 1vw, 2.5rem);
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
  margin-bottom: 0.25em;
`;

const Descript = styled.div<{ $isQuote: boolean }>`
  font-size: clamp(0.8rem, 1vw, 1.1rem);
  color: rgba(0, 0, 0, 1);
  ${({ $isQuote }) =>
    $isQuote &&
    css`
      font-style: italic;
      font-size: clamp(0.85rem, 1vw, 1.3rem);
      padding-top: 0.5em;
    `}
`;

// Card UI
const AccordianWrap = styled.button`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 0 1em;
  width: 100%;
`;

const CardTitle = styled(Header)`
  font-size: clamp(0.9rem, 1vw, 1.5rem);
  margin-bottom: 0;
  margin-top: 0.25em;
  font-weight: 400;
`;

const CardWrapOutter = styled.div<{ $isLast: boolean }>`
  display: flex;
  width: 100%;
  ${({ $isLast }) =>
    !$isLast &&
    css`
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    `}
`;

const CardWrap = styled.div<{ $isClick: boolean }>`
  display: flex;
  align-items: flex-start;
  width: 80%;
  height: ${({ $isClick }) => ($isClick ? "auto" : 0)};
  max-height: ${({ $isClick }) => ($isClick ? "10rem" : 0)};
  transition: max-height 0.5s ease-in-out;
  overflow-y: hidden;
  margin-top: 0.5em;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    padding: ${({ $isClick }) => ($isClick ? "0.5rem 0" : 0)};
  }
`;

const CardDesc = styled.p`
  text-align: start;
  line-height: 1.8em;
  font-family: "Roboto Condensed", sans-serif;
  font-size: clamp(0.8rem, 1vw, 1.1rem);
  font-weight: 400;
  color: rgba(0, 0, 0, 0.8);
`;

export default CharacterIntroPopup;
