"use client";

import type React from "react";
import styled, { keyframes } from "styled-components";
import { Card, CardContent } from "@/components/ui/card";
import { CommentType } from "./Guestbook";
import { formatTimestamp } from "@/lib/convertTime";
import { emoji } from "@/data/emoji.img";
import { Delete, X } from "lucide-react";

export default function Comments(
  comment: CommentType & {
    removeContent: (id: string) => void;
    emoji?: number | null;
  }
) {
  const time = formatTimestamp(comment.at);

  const covertEmojiOrMsg = () => {
    if (!comment.message && comment.emoji) {
      const findImg = Object.values(emoji).find(
        (i) => i.key === Number(comment.emoji)
      );
      return (
        <ImageWrap>
          {findImg?.img && <Image src={findImg?.img.src} alt="test" />}
        </ImageWrap>
      );
    } else {
      return <BodyMessage>{comment.message}</BodyMessage>;
    }
  };

  const removeCommentRender = () => {
    if (!comment.isMe) return;
    return (
      <RemoveButton onClick={() => comment.removeContent(comment.id)}>
        <X size={18} color={"#f15555"} />
      </RemoveButton>
    );
  };

  return (
    <CommentCard>
      <CardContent style={{ padding: "1rem" }}>
        <CardContentInner>
          <CardInfoWrap>
            <CardInfoNameInner>
              <CardInfo>{comment.username}</CardInfo>
              <CardUserId>@{comment.uid}</CardUserId>
            </CardInfoNameInner>
            <DateWrap>
              <Date>{time}</Date>
            </DateWrap>
            <RemoveButtonWrap>{removeCommentRender()}</RemoveButtonWrap>
          </CardInfoWrap>
          <CardInfoBody>{covertEmojiOrMsg()}</CardInfoBody>
          {/* <div className="comment-header">
            <h4>{comment.username}</h4>
            <span>{comment.date}</span>
          </div>
          <p className="comment-message">{comment.message}</p> */}
        </CardContentInner>
      </CardContent>
    </CommentCard>
  );
}

const CommentCard = styled(Card)`
  width: 100%;
  background: linear-gradient(90deg, #fef3c7, #fce7f3);
  border-left: 4px solid ${(props) => props.theme.colors.primary.pink};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;

    h4 {
      font-weight: 600;
      color: ${(props) => props.theme.colors.gray[800]};
    }

    span {
      font-size: 0.875rem;
      color: ${(props) => props.theme.colors.gray[500]};
    }
  }

  .comment-message {
    color: ${(props) => props.theme.colors.gray[700]};
  }
`;

const CardContentInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CardInfoWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CardInfoNameInner = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const RemoveButtonWrap = styled.div`
  width: 1.85rem;
  display: flex;
  justify-content: end;
  align-items: center;
`;

const pulseAnimation = keyframes`
0% {
  transform: scale(1);
  }
  10% {
    transform: scale(0.9);
  }
  30% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1);
  }
  70% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1.2);
  }
`;

const RemoveButton = styled.button`
  @keyframes pulseDrop {
    0% {
      transform: scale(1);
    }
    20% {
      transform: scale(0.8);
    }
    25% {
      transform: scale(0.75);
    }
    30% {
      transform: scale(0.8);
    }
    40% {
      transform: scale(1.4);
    }
    /* 35% {
      transform: scale(1.3);
    } */
    95% {
      transform: scale(1.4);
    }
    100% {
      transform: scale(1);
    }
  }

  transition: transform 0.5s cubic-bezier(0.22, 1.61, 0.36, 1);
  &:hover {
    animation: pulseDrop 1.2s ease-out;
  }
  &:active {
    animation: pulseDrop 1.2s ease-out;
  }
`;

const CardInfoBody = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const CardInfo = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
`;

const CardUserId = styled.h5`
  font-size: 0.9rem;
  font-weight: 500;
  color: #888;
  margin-left: 0.25rem;
`;

const DateWrap = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const Date = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  color: #888;
  white-space: nowrap;
  padding-top: 0.15rem;
`;

const BodyMessage = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  color: #444;
`;

const ImageWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
  overflow: hidden;
  border-radius: 0.25rem;
  box-sizing: content-box;
  border: 0.2rem solid orange;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
`;
