"use client";

import type React from "react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import GuestbookMakeInfo from "./Guestbook.MakeInfo";
import { LoginEnum } from "@/app/page";
import Comments from "./Guestbook.Comment";
import { EmojiDialog } from "./Emoji.Popup";
import { StaticImageData } from "next/image";

interface Props {
  userId: string | null;
  loginType: LoginEnum;
  setEmojiPopup: Dispatch<SetStateAction<boolean>>;
  selectEmoji: { key: number; img: StaticImageData } | null;
}

export interface CommentType {
  username: string;
  message: string;
  key: number | null;
}

const commentsData = [
  {
    id: 1,
    username: "RockFan2023",
    message: "Bocchi is literally me! 🎸",
    type: 1,
  },
  {
    id: 2,
    username: "KessokuBandLover",
    message: "This anime changed my life! The music is incredible!",
    type: 2,
  },
  {
    id: 3,
    username: "GuitarHero",
    message: "Hitori's character development is amazing 💖",
    type: 1,
  },
];

export default function Guestbook(props: Props) {
  const { setEmojiPopup, selectEmoji } = props;

  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState<CommentType>({
    username: "",
    message: "",
    key: null,
  });
  const handleCommentSubmit = () => {
    if (!newComment.username.trim() || !newComment.message.trim()) return;

    const comment = {
      username: newComment.username,
      message: selectEmoji?.key ? "" : newComment.message,
      key: selectEmoji?.key || null,
    };
  };

  useEffect(() => {
    // emoji 선택 시 message
    if (selectEmoji) {
      setNewComment({ ...newComment, message: "" });
    }
  }, [selectEmoji]);

  return (
    <GuestbookSection>
      <Container>
        <SectionTitle>Fan Guestbook</SectionTitle>
        {/* Comments List */}
        <div className="comments-container">
          {comments.map((comment) => (
            <Fragment key={comment.id}>
              <Comments username={""} date={""} message={""} />
            </Fragment>
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
