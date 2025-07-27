"use client";

import type React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Card, CardContent } from "@/components/ui/card";
import { LoginEnum } from "@/app/page";

interface Props {
  username: string;
  date: string;
  message: string;
}

export default function Comments(comment: Props) {
  return (
    <CommentCard>
      <CardContent style={{ padding: "1rem" }}>
        <div className="comment-header">
          <h4>{comment.username}</h4>
          <span>{comment.date}</span>
        </div>
        <p className="comment-message">{comment.message}</p>
      </CardContent>
    </CommentCard>
  );
}

const CommentCard = styled(Card)`
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
