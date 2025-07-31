import styled, { css, keyframes } from "styled-components";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { USER_ERROR_CODE } from "@/lib/firebase/users";
import { emoji } from "@/data/emoji.img";
import { StaticImageData } from "next/image";

interface Props {
  setSelectEmoji: (props: { key: number; img: StaticImageData } | null) => void;
  selectEmoji: { key: number; img: StaticImageData } | null;
  openChange: (props: boolean) => void;
  open: boolean;
}

interface EmojiProps {}

/**
 * 이모티콘 선택 화면
 */
const EmojiContent = () => {
  return <></>;
};

/**
 * 팝업 Main 화면 (Login)
 */
export const EmojiDialog = ({
  setSelectEmoji,
  selectEmoji,
  openChange,
  open,
}: Props) => {
  const [changeAuth, setChangeAuth] = useState(false); // 회원가입 여부
  const [realOpen, setRealOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // 팝업 자연스럽게 띄우는 애니메이션
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`; // dummy layout
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [top, open]);

  // 팝업 컨트롤 할 때, open boolean
  useEffect(() => {
    setIsLoading(true);
    if (open) {
      setRealOpen(true);
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setChangeAuth(false);
        setRealOpen(false);
        setIsLoading(false);
      }, 800);
    }
  }, [open]);

  const selectImageHandler = ({
    key,
    img,
  }: {
    key: number;
    img: StaticImageData;
  }) => {
    openChange(false);
    if (!!selectEmoji && selectEmoji.key === key) {
      setSelectEmoji(null);
    } else {
      setSelectEmoji({ key, img });
    }
  };
  if (!realOpen) return <></>;

  return (
    <Layout
      onClick={(e) => {
        openChange(false);
      }}
      top={window.scrollY}
    >
      {isLoading && <Dummy />}
      <Modal
        onClick={(e) => {
          e.stopPropagation();
        }}
        $open={open}
      >
        <PopupWrap>
          <PopupWrapHeader></PopupWrapHeader>
          <GridRow>
            {Object.values(emoji).map(({ key, img }, i) => (
              <ImageWrap
                key={i}
                onClick={() => selectImageHandler({ key, img })}
                $isSelected={selectEmoji?.key === key}
              >
                <Image src={img.src} alt="test" />
              </ImageWrap>
            ))}
          </GridRow>
        </PopupWrap>
      </Modal>
    </Layout>
  );
};

const openModal = keyframes`
  0% {
    transform: translateY(10%);
    opacity: 0;
  }
  60% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
`;

const closeModal = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(10%);
    opacity: 0;
  }
`;

const Layout = styled.div<{ top: number }>`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${({ top }) => top}px;
  left: 0;
  width: 100%;
  height: 100vh;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  z-index: 10;
  transition: display 0.1s ease 5s;
`;

const Modal = styled.div<{ $open: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 36rem;
  /* height: 20rem; */
  border-radius: 1rem;
  overflow: hidden;
  z-index: 11;
  animation: ${({ $open }) => ($open ? openModal : closeModal)} 0.5s
    cubic-bezier(0.22, 1.61, 0.36, 1) forwards;
  box-shadow: 0.5em 0.5em 2em 1em rgba(0, 0, 0, 0.2);
  padding: 4px;
`;

const PopupWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: rgb(255, 255, 255);
`;

const PopupWrapHeader = styled.div``;

const GridRow = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem;
  width: 100%;
`;

const ImageWrap = styled.button<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* overflow: hidden; */
  border-radius: 0.25rem;
  box-sizing: content-box;
  border: 0.2rem solid
    ${({ $isSelected }) => ($isSelected ? "orange" : "white")};
  z-index: ${({ $isSelected }) => ($isSelected ? 10 : 1)};
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
`;

const Dummy = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;
