"use client";

import type React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Guestbook() {
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "RockFan2023",
      message: "Bocchi is literally me! 🎸",
      date: "2024-01-15",
    },
    {
      id: 2,
      username: "KessokuBandLover",
      message: "This anime changed my life! The music is incredible!",
      date: "2024-01-14",
    },
    {
      id: 3,
      username: "GuitarHero",
      message: "Hitori's character development is amazing 💖",
      date: "2024-01-13",
    },
  ]);
  const [newComment, setNewComment] = useState({ username: "", message: "" });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.username.trim() || !newComment.message.trim()) return;

    const comment = {
      id: comments.length + 1,
      username: newComment.username,
      message: newComment.message,
      date: new Date().toISOString().split("T")[0],
    };
    setComments([comment, ...comments]);
    setNewComment({ username: "", message: "" });
  };

  return (
    <GuestbookSection>
      <Container>
        <SectionTitle>Fan Guestbook</SectionTitle>

        {/* Comment Form */}
        <div className="form-container">
          <CommentForm>
            <CardContent style={{ padding: "1.5rem" }}>
              <form onSubmit={handleCommentSubmit}>
                <Input
                  placeholder="Your name"
                  value={newComment.username}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
                <Textarea
                  placeholder="Leave your message for Bocchi 🎸"
                  value={newComment.message}
                  onChange={(e) =>
                    setNewComment((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  style={{ minHeight: "100px" }}
                />
                <Button type="submit" className="submit-button">
                  <Users
                    style={{
                      width: "1rem",
                      height: "1rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  Post Message
                </Button>
              </form>
            </CardContent>
          </CommentForm>
        </div>

        {/* Comments List */}
        <div className="comments-container">
          {comments.map((comment) => (
            <CommentCard key={comment.id}>
              <CardContent style={{ padding: "1rem" }}>
                <div className="comment-header">
                  <h4>{comment.username}</h4>
                  <span>{comment.date}</span>
                </div>
                <p className="comment-message">{comment.message}</p>
              </CardContent>
            </CommentCard>
          ))}
        </div>
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
  max-width: 80rem;
  margin: 0 auto;
`;

const GuestbookSection = styled(Section)`
  background: linear-gradient(135deg, #fefce8, #fdf2f8);

  .form-container {
    margin-bottom: 2rem;
  }

  .comments-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const CommentForm = styled(Card)`
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .submit-button {
    width: 100%;
    background: ${(props) => props.theme.colors.gradients.text};

    &:hover {
      opacity: 0.9;
    }
  }
`;

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
