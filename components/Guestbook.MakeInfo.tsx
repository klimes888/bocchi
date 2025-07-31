"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

import styled, { css } from "styled-components";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StaticImageData } from "next/image";
import { CommentType } from "./Guestbook";

type Props = {
  setEmojiPopup: (props: boolean) => void;
  setNewComment: (props: CommentType) => void;
  selectEmoji: { key: number; img: StaticImageData } | null;
  newComment: CommentType;
  sendData: () => Promise<void>;
};

export default function GuestbookMakeInfo(props: Props) {
  const { newComment, setNewComment, sendData, setEmojiPopup, selectEmoji } =
    props;
  const [alert, setAlert] = useState({ target: 0, msg: "" });

  const vlidateSendData = async () => {
    if (!newComment?.username || newComment?.username?.length <= 1) {
      setAlert({ target: 1, msg: "별명은 2글자 이상 입력해주세요." });
      return;
    }

    if (!newComment?.username || newComment?.username?.length >= 20) {
      setAlert({ target: 1, msg: "별명은 20자 까지만 입력해주세요." });
      return;
    }

    if (!newComment?.message && !selectEmoji) {
      setAlert({
        target: 2,
        msg: "내용을 입력하거나 이모티콘을 선택해주세요.",
      });
      return;
    }

    if (newComment?.message?.length >= 300) {
      setAlert({
        target: 2,
        msg: "300자를 초과할 수 없습니다.",
      });
      return;
    }

    setAlert({ target: 0, msg: "" });
    await sendData();
  };

  const placeHolderHandler = (taget: number, msg: string) => {
    if (taget === alert.target && msg) {
      return alert.msg;
    }
    return selectEmoji ? "" : msg;
  };

  useEffect(() => {
    if (alert.target === 2 && selectEmoji?.key) {
      setAlert({ target: 0, msg: "" });
    }
  }, [selectEmoji, alert]);

  return (
    <CommentForm>
      <CardContent style={{ padding: "1.5rem", width: "100%" }}>
        <FormInner>
          <InputWrap>
            <ExtendInput
              placeholder={placeHolderHandler(1, "별명")}
              $isAlert={alert.target === 1 && !!alert.msg}
              value={newComment.username}
              onChange={({ target }) =>
                setNewComment({ ...newComment, username: target.value })
              }
            />
          </InputWrap>
          <InputWrap>
            <ExtendTextarea
              disabled={!!selectEmoji}
              $isAlert={alert.target === 2 && !!alert.msg}
              placeholder={placeHolderHandler(2, "코멘트 남기기 🎸")}
              value={newComment.message}
              onChange={({ target }) =>
                setNewComment({ ...newComment, message: target.value })
              }
            />
            {selectEmoji ? (
              <ImageWrap>
                <Image src={selectEmoji.img.src} alt="" />
              </ImageWrap>
            ) : null}
          </InputWrap>
        </FormInner>
        <SendButtonWrap>
          <EmojiButton onClick={() => setEmojiPopup(true)}>
            이모티콘
          </EmojiButton>
          <SendButton onClick={vlidateSendData}>
            <Users
              style={{
                width: "1rem",
                height: "1rem",
                marginRight: "0.5rem",
              }}
            />
            남기기
          </SendButton>
        </SendButtonWrap>
      </CardContent>
    </CommentForm>
  );
}

const CommentForm = styled(Card)`
  display: flex;
  width: 100%;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const FormInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: 0.45rem;
  margin-bottom: 1rem;
`;

const InputWrap = styled.div`
  width: 100%;
  position: relative;
`;

const SendButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 1rem;
  width: 100%;
  height: 2.5rem;
`;

const SendButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.gradients.text};
  color: ${(props) => props.theme.colors.white};
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.25rem;
  &:hover {
    opacity: 0.9;
  }
`;

const EmojiButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #444;
  border-radius: 0.25rem;
  color: ${(props) => props.theme.colors.white};
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 0.25rem;
  padding: 0 1rem;
  white-space: nowrap;
  height: 100%;
`;

const ImageWrap = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6.5rem;
  overflow: hidden;
  border-radius: 0.25rem;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  aspect-ratio: 1 / 1;
`;

const inputStyle = css`
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.5rem;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border: 0.1rem solid rgba(131, 110, 110, 0.1);
  }

  &::placeholder {
    font-style: italic;
    opacity: 0.8;
    font-size: 0.9rem;
    font-weight: 400;
  }
`;

const ExtendTextarea = styled.textarea<{ $isAlert: boolean }>`
  min-height: 8rem;
  padding: 0.65rem;
  border: 1px solid
    ${({ $isAlert }) => ($isAlert ? "rgb(248, 86, 86)" : "rgba(0, 0, 0, 0.1)")};
  &:focus {
    padding: 0.6rem 0.65rem 0.55rem 0.6rem;
  }
  &::placeholder {
    color: ${({ $isAlert }) => ($isAlert ? "red" : "#aaa")};
  }

  ${inputStyle}
`;

const ExtendInput = styled.input<{ $isAlert: boolean }>`
  height: 2.5rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid
    ${({ $isAlert }) => ($isAlert ? "rgb(248, 86, 86)" : "rgba(0, 0, 0, 0.1)")};
  &:focus {
    padding: 0.55rem 0.55rem 0.55rem 0.6rem;
  }
  &::placeholder {
    color: ${({ $isAlert }) => ($isAlert ? "rgba(248, 86, 86, 0.8)" : "#aaa")};
  }
  ${inputStyle}
`;
