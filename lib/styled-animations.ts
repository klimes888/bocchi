import { keyframes } from "styled-components";

export const animations = {
  pulse: keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  `,

  bounce: keyframes`
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-30px); }
    70% { transform: translateY(-15px); }
    90% { transform: translateY(-4px); }
  `,

  fadeIn: keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `,

  fadeInBlack: keyframes`
    from { background-color: rgba(0,0,0,0); }
    to { background-color: rgba(0,0,0,0.5); }
  `,

  fadeInTop: keyframes`
    from { transform: translateY(0) }
    to { transform: translateY(10em) }
  `,
  fadeInBottom: keyframes`
    from { transform: translateY(0) }
    to { transform: translateY(-10em) }
  `,
  fadeInRight: keyframes`
    from { opacity: 0; transform: translateX(0) }
    to { opacity: 1; transform: translateX(10em) }
  `,
  fadeInBig: keyframes`
    from { opacity: 0.1; transform: scale(2) }
    to { opacity: 1; transform: scale(1) }
  `,

  slideInLeft: keyframes`
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,

  slideInRight: keyframes`
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,

  scaleIn: keyframes`
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `,

  rotate: keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `,
};
