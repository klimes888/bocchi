"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

import styled, { css } from "styled-components";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { StaticImageData } from "next/image";
import { CommentType } from "./Guestbook";

import { defaultComment } from "@/components/Guestbook";

type Props = {
  setEmojiPopup: (props: boolean) => void;
  setNewComment: (props: typeof defaultComment) => void;
  selectEmoji: { key: number; img: StaticImageData } | null;
  newComment: typeof defaultComment;
  sendData: () => Promise<void>;
  setSelectEmoji: Dispatch<
    SetStateAction<{
      key: number;
      img: StaticImageData;
    } | null>
  >;
  isHasUserCheck: (size: number) => void;
  userId: string | null;
};

export default function GuestbookMakeInfo(props: Props) {
  const {
    newComment,
    setNewComment,
    setSelectEmoji,
    sendData,
    setEmojiPopup,
    selectEmoji,
    userId,
    isHasUserCheck,
  } = props;
  const [alert, setAlert] = useState({ target: 0, msg: "" });

  const vlidateSendData = async () => {
    if (!userId) return;
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

    try {
      await sendData();
    } catch (error) {
    } finally {
      setAlert({ target: 0, msg: "" });
      setNewComment({ key: null, message: "", username: "" });
      setSelectEmoji(null);
    }
  };

  const placeHolderHandler = (taget: number, msg: string) => {
    if (taget === alert.target && msg) {
      return alert.msg;
    }
    return selectEmoji ? "" : msg;
  };

  const inputRef = useRef<any>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!window.visualViewport) return;

    let initialHeight = window.visualViewport.height;

    const handleResize = () => {
      const currentHeight = window.visualViewport!.height;
      if (currentHeight < initialHeight) {
        setKeyboardHeight(initialHeight - currentHeight); // 키보드 높이 저장
      } else {
        setKeyboardHeight(0); // 키보드 닫힘
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  const validateChangeEv = (type: string, value: string) => {
    if (!userId) {
      isHasUserCheck(keyboardHeight);
      inputRef.current?.blur();
      return;
    }
    setNewComment({ ...newComment, [type]: value });
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
              ref={inputRef}
              placeholder={placeHolderHandler(1, "별명")}
              $isAlert={alert.target === 1 && !!alert.msg}
              value={newComment.username}
              onChange={({ target }) =>
                validateChangeEv("username", target.value)
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
                validateChangeEv("message", target.value)
              }
            />
            {selectEmoji ? (
              <ImageWrap>
                <Image src={selectEmoji?.img?.src} alt="" />
              </ImageWrap>
            ) : null}
          </InputWrap>
        </FormInner>
        <SendButtonWrap>
          <EmojiButton
            $isLogin={!!userId}
            onClick={() => userId && setEmojiPopup(true)}
          >
            이모티콘
          </EmojiButton>
          <SendButton $isLogin={!!userId} onClick={vlidateSendData}>
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

const SendButton = styled.button<{ $isLogin: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colors.gradients.text};
  color: ${(props) => props.theme.colors.white};
  opacity: ${({ $isLogin }) => ($isLogin ? 1 : 0.6)};
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0.25rem;
  &:hover {
    opacity: ${({ $isLogin }) => ($isLogin ? 0.9 : 0.5)};
  }
`;

const EmojiButton = styled.button<{ $isLogin: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #444;
  border-radius: 0.25rem;
  color: ${(props) => props.theme.colors.white};
  opacity: ${({ $isLogin }) => ($isLogin ? 1 : 0.6)};
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 0.25rem;
  padding: 0 1rem;
  white-space: nowrap;
  height: 100%;
  &:hover {
    opacity: ${({ $isLogin }) => ($isLogin ? 0.9 : 0.5)};
  }
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
  z-index: 0;
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
