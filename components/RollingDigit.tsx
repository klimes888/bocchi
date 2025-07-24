import { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  delay: number;
  rolling: boolean;
  value: number;
}

export const RollingDigit = ({ value, delay, rolling }: Props) => {
  const [count, setCount] = useState(0);

  const delayHandler = () => {
    const timer = setTimeout(() => {
      let startTime: number | null = null;
      let duration = 2000; // 1초
      if (value <= 1030) {
        duration = 700;
      } else if (value <= 1200) {
        duration = 1200;
      } else if (value <= 1500) {
        duration = 1500;
      }
      const startValue = 0;

      const updateCounter = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const progress = Math.min(elapsed / duration, 1); // 0 ~ 1 사이
        const current = Math.floor(
          startValue + (value - startValue) * progress
        );
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
      return () => clearTimeout(timer);
    }, delay);
  };

  useEffect(() => {
    if (!rolling) return;
    delayHandler();
  }, [value, rolling, delay]);

  return (
    <DigitWrapper>
      <DigitList>
        <Digit>{count.toLocaleString()}</Digit>
      </DigitList>
    </DigitWrapper>
  );
};

const DigitWrapper = styled.div`
  position: relative;
`;

const DigitList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Digit = styled.div`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
`;
