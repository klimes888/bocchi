import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";

import Hitori from "@/assets/characters/hitori_ugo.webp";
import Nijika from "@/assets/characters/Nijika_ugo.webp";
import Ryo from "@/assets/characters/Ryo_ugo.webp";
import Kita from "@/assets/characters/Kita_ugo.webp";

interface Props {
  type: string | null;
  isOpen: boolean;
  isClick: (flag: boolean) => void;
}

const chara: Record<string, string> = {
  Hitori: Hitori.src,
  Nijika: Nijika.src,
  Ryo: Ryo.src,
  Ikuyo: Kita.src,
};

const CharacterIntroPopup = (props: Props) => {
  const { isOpen, isClick, type } = props;
  const [scrollY, setScrollY] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <Layout $open={isOpen} style={{ top: scrollY }}>
      <Popup $open={isOpen}>
        <Scroll>
          <UgoiraWrap
            onClick={() => {
              isClick(!isOpen);
            }}
          >
            {type && (
              <Ugoira
                src={chara[type]}
                alt=""
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </UgoiraWrap>
          <PopupInner ref={scrollRef}>
            <TitleWrap>
              <Title>GOTO HITORI</Title>
            </TitleWrap>
            <ContentWrap></ContentWrap>
          </PopupInner>
        </Scroll>
      </Popup>
    </Layout>
  );
};

const OpenAnime = {
  open: keyframes`
    0% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(0deg);
    }
    `,
  close: keyframes`
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(90deg);
    }
  `,
};

const Layout = styled.div<{ $open: boolean }>`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  height: 100vh;
  justify-content: flex-start;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  z-index: 10;
`;

const Scroll = styled.div`
  width: 100%;
  overflow-y: scroll; /* Y축으로 스크롤 허용 */
`;

const Popup = styled.div<{ $open: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: rotate(${({ $open }) => ($open ? "0" : "90deg")});
  transform-origin: left top;
  transition: transform 1s 1s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 3;
`;

const UgoiraWrap = styled.div`
  display: flex;
  width: 100%;
  height: 10em;
`;

const Ugoira = styled.img`
  width: 10em;
  height: 100%;
`;

const PopupInner = styled.div`
  background-color: #fff;
  width: 100%;
`;

const TitleWrap = styled.div`
  position: sticky;
  top: 0;
  background-color: #fff;
  display: flex;
  width: 100%;
`;

const Title = styled.h2`
  font-family: "Roboto Condensed", sans-serif;
  letter-spacing: -0.5rem;
  font-size: 5.5rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
`;

const ContentWrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  /* background-color: #ddb1c8; */
`;

export default CharacterIntroPopup;
