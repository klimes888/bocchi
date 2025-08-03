"use client";

import type React from "react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import GuestbookMakeInfo from "./Guestbook.MakeInfo";
import { LoginEnum } from "@/app/page";
import Comments from "./Guestbook.Comment";
import { StaticImageData } from "next/image";
import {
  getGuestBookList,
  guestBook,
  removeGuestBook,
} from "@/lib/firebase/guestBook";
import UseInfinityObserver from "@/hooks/use-infinityObserver";
import { UUID } from "@/lib/create-uuid";

import CONG_LOTT from "@/assets/icons/confetti.json";
import Lottie from "lottie-react";
import lottieCtrl from "lottie-web";

interface Props {
  loginType: LoginEnum;
  userId: string | null;
  setEmojiPopup: Dispatch<SetStateAction<boolean>>;
  setSelectEmoji: Dispatch<
    SetStateAction<{
      key: number;
      img: StaticImageData;
    } | null>
  >;
  isHasUserCheck: (top: number) => void;
  selectEmoji: { key: number; img: StaticImageData } | null;
}

export interface CommentType {
  at: {
    seconds: number;
    nanoseconds: number;
  };
  id: string;
  uid?: string;
  username: string;
  message: string;
  key?: number | null;
  isMe: boolean;
}

export const defaultComment = {
  username: "",
  message: "",
  key: null,
};

export default function Guestbook(props: Props) {
  const { setSelectEmoji, setEmojiPopup, selectEmoji, userId, isHasUserCheck } =
    props;
  const topRef = useRef<HTMLDivElement | null>(null);
  const lottieRef = useRef<any | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { ref, data, isLast } = UseInfinityObserver(() =>
    getGuestBookList(10, userId)
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lottieView, setLottieView] = useState(false);

  const [commentRemove, setCommentRemove] = useState<{
    id: string | null;
    isRemove: boolean;
    loading: boolean;
  }>({
    id: null,
    isRemove: false,
    loading: false,
  });

  const [comments, setComments] = useState(data);
  const [newComment, setNewComment] = useState(defaultComment);

  useEffect(() => {
    const thresholdIndex = 4;
    const updateScales = () => {
      const visibleItems: { index: number; top: number }[] = [];

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();

        // 화면에 보이는 영역만 계산
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          visibleItems.push({ index, top: rect.top });
        }
      });

      // 화면 상단 기준으로 정렬
      // visibleItems.sort((a, b) => a.top - b.top);

      itemRefs.current.forEach((el, index) => {
        if (!el) return;

        const targetIndex = visibleItems.findIndex((v) => v.index === index);
        const baseScale = 0.5;
        if (targetIndex >= 0 && targetIndex < thresholdIndex) {
          el.style.transform = `scale(1)`;
          el.style.marginBottom = `-0.5rem`;
        } else if (targetIndex >= thresholdIndex) {
          const step = 0.1;
          const scale = Math.max(
            1 - (targetIndex - thresholdIndex + 1) * step,
            baseScale
          );
          el.style.transform = `scale(${scale.toFixed(2)})`;
        } else {
          el.style.transform = `scale(${baseScale})`; // 화면 밖이거나 못 잡은 아이템
          el.style.marginBottom = "0";
        }
      });
    };

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScales();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateScales(); // 초기 실행
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCommentSubmit = async () => {
    if (!newComment.username.trim()) return;
    if (!userId) return;

    const comment = {
      username: newComment.username,
      message: selectEmoji?.key ? "" : newComment.message,
      key: selectEmoji?.key || null,
      uid: userId,
    };
    const date = new Date();
    const seconds = Math.floor(date.getTime() / 1000);
    const nanoseconds = (date.getTime() % 1000) * 1_000_000;

    try {
      await guestBook(comment);
      setComments((prev) => [
        {
          ...comment,
          at: { seconds, nanoseconds },
          uid: userId,
          id: UUID(),
          isMe: true,
        },
        ...prev,
      ]);
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        setLottieView(true);
        setTimeout(() => {
          setLottieView(false);
        }, 3500);
      }, 500);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const removeContent = (id: string) => {
    if (commentRemove.loading) return;
    setCommentRemove({ id, isRemove: true, loading: true });
  };

  useEffect(() => {
    // if (!commentRemove.loading) return;
    (async () => {
      try {
        setTimeout(async () => {
          // 2초 뒤에 삭제 실행
          if (!commentRemove.id) return;
          await removeGuestBook(commentRemove.id);
          setComments((prev) => prev.filter((i) => i.id !== commentRemove.id));
          setCommentRemove({ id: null, isRemove: false, loading: false });
        }, 2000);
      } catch (error) {
        console.error("Error: ", error);
      }
    })();
  }, [commentRemove.id]);

  useEffect(() => {
    if (data.length !== 0) {
      setComments((prev) => [...prev, ...data]);
    }
  }, [data]);

  useEffect(() => {
    setComments((prev) =>
      prev.map((data) => ({ ...data, isMe: data.uid === userId }))
    );
  }, [userId]);

  useEffect(() => {
    // emoji 선택 시 message
    if (selectEmoji) {
      setNewComment({ ...newComment, message: "" });
    }
  }, [selectEmoji]);

  useEffect(() => {
    if (lottieView && lottieRef?.current) {
      lottieRef.current.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [lottieView]);

  const congratuationLottieRender = () => {
    return (
      <LottieWrap $visible={lottieView}>
        <Lottie
          lottieRef={lottieRef}
          animationData={CONG_LOTT}
          loop={false}
          autoplay={false}
        />
      </LottieWrap>
    );
  };

  return (
    <GuestbookSection ref={topRef}>
      <Container>
        <SectionTitle>Fan Guestbook</SectionTitle>
        {/* Comments List */}
        <CommentContainer ref={scrollRef}>
          {comments.map(({ key, ...data }, idx) => {
            return (
              <CommentsWrap
                key={data.id + idx}
                ref={!isLast ? ref : null}
                $isRemove={commentRemove.id === data.id}
              >
                <CommentsInner
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                >
                  <Comments
                    emoji={key}
                    {...data}
                    removeContent={removeContent}
                  />
                </CommentsInner>
              </CommentsWrap>
            );
          })}
        </CommentContainer>

        {/* Comment Form */}
        <FormContainer>
          <GuestbookMakeInfo
            setEmojiPopup={(props) => setEmojiPopup(props)}
            selectEmoji={selectEmoji}
            setNewComment={(props) => setNewComment(props)}
            newComment={newComment}
            sendData={handleCommentSubmit}
            setSelectEmoji={setSelectEmoji}
            isHasUserCheck={() =>
              isHasUserCheck(topRef?.current?.offsetTop || 0)
            }
            userId={userId}
          />
          {congratuationLottieRender()}
        </FormContainer>
      </Container>
    </GuestbookSection>
  );
}

const Section = styled.section<{ $background?: string }>`
  padding: 4rem 1rem;
  ${(props) => props.$background && `background: ${props.$background};`}
`;

const SectionTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  background: ${(props) => props.theme.colors.gradients.text};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 40rem;
  width: 100%;
  margin: 0 auto;
`;

const ContainerInner = styled.div`
  display: flex;
  width: 100%;
`;

const FormContainer = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  width: 100%;
  margin-top: 1rem;
`;

const GuestbookSection = styled(Section)`
  display: flex;
  background: #f5f5f5;
  width: 100%;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: scroll;
`;

const CommentsWrap = styled.div<{ $isRemove: boolean }>`
  width: 100%;

  max-height: ${({ $isRemove }) => ($isRemove ? "0" : "15rem")};
  opacity: ${({ $isRemove }) => ($isRemove ? "0" : "1")};

  ${({ $isRemove }) =>
    $isRemove &&
    css`
      transition: max-height 0.5s ease, margin 0.5s ease, opacity 0.5s ease;
    `}
`;
const CommentsInner = styled.div`
  transition: transform 0.3s ease;
  display: flex;
  width: 100%;
  overflow: hidden;
`;

const LottieWrap = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ $visible }) => ($visible ? 99 : -99)};
  opacity: ${({ $visible }) => ($visible ? 1 : 0.1)};
`;
