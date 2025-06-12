"use client";

import { useEffect, useRef } from "react";
import styled from "styled-components";

const colors = [
  { r: 218, g: 0, b: 122 }, // Hot Pink
  { r: 254, g: 241, b: 0 }, // Yellow
  { r: 37, g: 99, b: 235 }, // Blue
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 100;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * (canvas ? canvas.width : 0);
        this.y = Math.random() * (canvas ? canvas.height : 0);
        this.size = Math.random() * 3 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        const chosen = colors[Math.floor(Math.random() * colors.length)];
        this.color = `rgba(${chosen.r}, ${chosen.g}, ${chosen.b}, ${
          Math.random() * 0.1 + 0.3
        })`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > (canvas ? canvas.width : 0)) {
          this.speedX = -this.speedX;
        }

        if (this.y < 0 || this.y > (canvas ? canvas.height : 0)) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <CanvasContainer ref={canvasRef} />;
}
const CanvasContainer = styled.canvas`
  position: absolute;
  inset: 0;
  z-index: 0;
`;
