"use client";

import type React from "react";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styled, { css } from "styled-components";
import GuestbookMakeInfo from "./Guestbook.MakeInfo";
import { LoginEnum } from "@/app/page";
import Comments from "./Guestbook.Comment";
import { EmojiDialog } from "./Emoji.Popup";
import { StaticImageData } from "next/image";
import {
  getGuestBookList,
  guestBook,
  removeGuestBook,
} from "@/lib/firebase/guestBook";
import UseInfinityObserver from "@/hooks/use-infinityObserver";
import { UUID } from "@/lib/create-uuid";

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

  const { ref, data, isLast } = UseInfinityObserver(() =>
    getGuestBookList(10, userId)
  );

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
    console.log("data??", data);
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

  return (
    <GuestbookSection ref={topRef}>
      <Container>
        <SectionTitle>Fan Guestbook</SectionTitle>
        {/* Comments List */}
        <div className="comments-container">
          {comments.map(({ key, ...data }, idx) => (
            <CommentsWrap
              key={data.id + idx}
              ref={!isLast ? ref : null}
              $isRemove={commentRemove.id === data.id}
            >
              <Comments emoji={key} {...data} removeContent={removeContent} />
            </CommentsWrap>
          ))}
        </div>

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
  .comments-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const CommentsWrap = styled.div<{ $isRemove: boolean }>`
  display: flex;
  width: 100%;
  overflow: hidden;
  max-height: ${({ $isRemove }) => ($isRemove ? "0" : "15rem")};
  ${({ $isRemove }) =>
    $isRemove &&
    css`
      transition: max-height 0.5s ease;
    `}
`;
