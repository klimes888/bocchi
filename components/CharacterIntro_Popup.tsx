import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

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
    <Layout
      $open={isOpen}
      style={{ top: scrollY }}
      onClick={() => {
        isClick(!isOpen);
      }}
    >
      <Popup onClick={(e) => e.stopPropagation()} $open={isOpen}>
        <UgoiraWrap>{type && <Ugoira src={chara[type]} alt="" />}</UgoiraWrap>
      </Popup>
    </Layout>
  );
};

const OpenAnime = {
  open: keyframes`
    0% {
      /* transform: translate(50%, -50%) rotate(45deg); */
      transform: rotate(90deg);

    }
    100% {
      transform: rotate(0deg);
    }
    `,
  close: keyframes``,
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
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  z-index: 10;
`;

const Popup = styled.div<{ $open: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 22em;
  transform: rotate(90deg);
  transform-origin: left top;
  background-color: #fff;
  animation: ${({ $open }) => ($open ? OpenAnime.open : OpenAnime.close)} 1s
    forwards ease-in-out;
  animation-delay: 1s;
  z-index: 3;
`;

const UgoiraWrap = styled.div`
  position: absolute;
  top: -10em;
  left: 0;
`;

const Ugoira = styled.img`
  width: 10em;
  height: 10em;
`;

export default CharacterIntroPopup;
