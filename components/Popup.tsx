import styled, { css, keyframes } from "styled-components";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import Starry from "@/assets/starry.jpg";
// import Ticket from "@/assets/ticket.webp";
import Ticket from "@/assets/icons/ticket.json";
import Lottie from "lottie-react";
import { FIREBASE_ERROR_CODE } from "@/lib/firebase/users";

type ResistUser = (flag: {
  id: string;
  pw: string;
}) => Promise<{ code: FIREBASE_ERROR_CODE; data: any | null } | undefined>;

interface Props {
  openChange: Dispatch<SetStateAction<boolean>>;
  resistUser: ResistUser;
  loginUser: ResistUser;
  open: boolean;
  createUser: boolean;
}

interface AuthProps {
  changeAuth: boolean;
  animate: boolean;
  setAnimate: Dispatch<SetStateAction<boolean>>;
  setChangeAuth: Dispatch<SetStateAction<boolean>>;
  resistUser: ResistUser;
  loginUser: ResistUser;
}

const AuthContent = ({
  animate,
  changeAuth,
  setChangeAuth,
  setAnimate,
  resistUser,
  loginUser,
}: AuthProps) => {
  // const isSignUp = type === "signup";
  const [title, setTitle] = useState("라이브 하우스 입장하기");
  const [isAnimated, setIsAnimated] = useState(false);
  const [auth, setAuth] = useState({ id: "", pw: "" });
  const [alert, setAlert] = useState<{ target: string; text: string } | null>(
    null
  );

  const validateHandle = () => {
    if (!auth.id) {
      setAlert({ target: "id", text: "아이디를 입력해주세요" });
      return false;
    }

    if (auth.id.length < 2) {
      setAlert({ target: "id", text: "2글자 이상 입력해주세요" });
      return false;
    }

    if (!auth.pw) {
      setAlert({ target: "pw", text: "패스워드를 입력해주세요" });
      return false;
    }

    if (auth.pw.length < 4) {
      setAlert({ target: "pw", text: "패스워드는 4글자 이상 입력해주세요" });
      return false;
    }

    return true;
  };

  const submitHandle = async () => {
    const { SUCCESS, USER_ALREADY } = FIREBASE_ERROR_CODE;
    // validate
    const valid = validateHandle();
    if (!valid) return;
    const result = await resistUser(auth);
    if (result?.code === SUCCESS) {
      setAlert(null);
      setChangeAuth(false);
    } else if (result?.code === USER_ALREADY) {
      setAlert({ target: "id", text: "이미 존재하는 아이디입니다." });
    } else {
      setAlert({ target: "id", text: "무언가 잘 못 되었습니다." });
    }
  };

  const submitLoginHandle = async () => {
    const valid = validateHandle();
    if (!valid) return;
    const result = await loginUser(auth);
    if (result) {
      setAlert(null);
      // setAnimate(true);
    }
  };

  useEffect(() => {
    if (alert?.target === "pw") {
      setAuth({ ...auth, pw: "" });
    }
    if (alert?.target === "id") {
      setAuth({ ...auth, id: "" });
    }
  }, [alert]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitle(changeAuth ? "입장 티켓 받기" : "라이브 하우스 입장하기");
      setIsAnimated(changeAuth);
      setAlert(null);
      setAuth({ id: "", pw: "" });
      if (!changeAuth) setAnimate(false);
    }, 600);

    if (changeAuth) setAnimate(true);
    return () => clearTimeout(timer);
  }, [changeAuth]);

  // const title = changeAuth ? "입장 티켓 받기" : "라이브 하우스 입장하기";

  const IdPlaceholderHandler = () => {
    if (!alert || alert.target === "pw")
      return isAnimated ? "ID 입력" : "티켓 번호";
    // if (!alert) return "";
    if (alert.target === "id") return alert.text;
  };

  const pwPlaceholderHandler = () => {
    if (!alert || alert.target === "id")
      return isAnimated ? "비밀번호 입력" : "티켓 비밀 번호";
    // if (!alert) return "";
    if (alert.target === "pw") return alert.text;
  };
  const lottieRef = useRef<any | null>(null);

  const lottieTicket = () => {
    if (changeAuth) return <></>;
    return (
      <LottieWrap>
        <Lottie
          color="#fff"
          lottieRef={lottieRef}
          animationData={Ticket}
          loop={false}
          autoplay={false}
        />
      </LottieWrap>
    );
  };

  return (
    <ImageBlurWrap $changeAuth={changeAuth} $animate={animate}>
      <ImageBlur />
      <ModalInner $changeAuth={isAnimated}>
        <ContentBody>
          <SubTitle>STARRY</SubTitle>
          <Title>{title}</Title>
          <InputOuterWrap>
            <InputWrap>
              <Input
                target="id"
                $alert={alert?.target === "id"}
                value={auth.id}
                onChange={(e) => setAuth({ ...auth, id: e.target.value })}
                placeholder={IdPlaceholderHandler()}
              />
            </InputWrap>
            <InputWrap>
              <Input
                target="pw"
                type="password"
                value={auth.pw}
                $alert={alert?.target === "pw"}
                placeholder={pwPlaceholderHandler()}
                onChange={(e) => setAuth({ ...auth, pw: e.target.value })}
              />
            </InputWrap>
            <ButtonWrap>
              <Button
                type="login"
                onMouseEnter={() => {
                  if (!lottieRef.current) return;
                  lottieRef.current.setDirection(1);
                  lottieRef.current.play();
                }}
                onMouseLeave={() => {
                  if (!lottieRef.current) return;
                  lottieRef.current.play();
                  lottieRef.current.setDirection(-1);
                }}
                onClick={() => {
                  isAnimated ? submitHandle() : submitLoginHandle();
                }}
              >
                <ButtonInner>
                  {lottieTicket()}
                  <ButtonText>
                    {isAnimated ? "티켓 받기" : "티켓 제출 하기"}
                  </ButtonText>
                </ButtonInner>
              </Button>
              <Button
                type="signup"
                onClick={() => {
                  setChangeAuth(!changeAuth);
                  // setAnimate(true);
                }}
              >
                <ButtonText>
                  {isAnimated ? "뒤로가기" : "티켓 발급 받기"}
                </ButtonText>
              </Button>
            </ButtonWrap>
          </InputOuterWrap>
        </ContentBody>
      </ModalInner>
    </ImageBlurWrap>
  );
};

export const AuthDialog = ({
  openChange,
  resistUser,
  open,
  createUser,
  loginUser,
}: Props) => {
  const [changeAuth, setChangeAuth] = useState(false); // 회원가입 여부
  const [animate, setAnimate] = useState(false);
  const [realOpen, setRealOpen] = useState(open);

  useEffect(() => {
    if (!open) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`; // dummy layout

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [top, open]);

  const bannerRender = () => {
    return (
      <ModalBannerWrap $changeAuth={changeAuth} $animate={animate}>
        <ModalBanner src={Starry.src} />
      </ModalBannerWrap>
    );
  };

  useEffect(() => {
    if (open) {
      setRealOpen(true);
    } else {
      setTimeout(() => {
        setRealOpen(false);
      }, 600);
    }
  }, [open]);

  useEffect(() => {
    if (createUser) {
      setChangeAuth(false);
    }
  }, [createUser]);
  if (!realOpen) return <></>;

  return (
    <Layout
      onClick={(e) => {
        openChange(false);
        setChangeAuth(false);
      }}
      top={window.scrollY}
    >
      <Modal onClick={(e) => e.stopPropagation()} $open={open}>
        {bannerRender()}
        <AuthContent
          changeAuth={changeAuth}
          setChangeAuth={setChangeAuth}
          animate={animate}
          setAnimate={setAnimate}
          resistUser={resistUser}
          loginUser={loginUser}
        />
      </Modal>
    </Layout>
  );
};

const openModal = keyframes`
  0% {
    transform: translateY(10%);
    opacity: 0;
  }
  60% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
`;

const closeModal = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(10%);
    opacity: 0;
  }
`;

const clipAnimation = keyframes`
  0% {
    clip-path: inset(0 1px 60% 0);
  }
  30% {
    clip-path: inset(0 1px 0 0);
  }
  50% {
    clip-path: inset(0 1px 0 0);
  }
  70% {
    clip-path: inset(70% 1px 0 0);
  }
  100% {
    clip-path: inset(70% 1px 0 0);
  }
`;

const clipAnimationReverse = keyframes`
  0% {
    clip-path: inset(70% 1px 0 0);
  }
  30% {
    clip-path: inset(70% 1px 0 0);
  }
  50% {
    clip-path: inset(0 1px 0 0);
  }
  70% {
    clip-path: inset(0 1px 0 0);
  }
  100% {
    clip-path: inset(0 1px 60% 0);
  }
`;

const backAnimation = keyframes`
  0% {
    clip-path: inset(30% 0 0 0);
  }
  30% {
    clip-path: inset(0 0 0 0);
  }
  50% {
    clip-path: inset(0 0 0 0);
  }
  70% {
    clip-path: inset(0 0 30% 0);
  }
  100% {
    clip-path: inset(0 0 30% 0);
  }
`;

const backAnimationReverse = keyframes`
  0% {
    clip-path: inset(0 0 30% 0);
  }
  30% {
    clip-path: inset(0 0 30% 0);
  }
  50% {
    clip-path: inset(0 0 0 0);
  }
  70% {
    clip-path: inset(0 0 0 0);
  }
  100% {
    clip-path: inset(30% 0 0 0);
  }
`;

const Layout = styled.div<{ top: number }>`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${({ top }) => top}px;
  left: 0;
  width: 100%;
  height: 100vh;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  z-index: 10;
  transition: display 0.1s ease 5s;
`;

const Modal = styled.div<{ $open: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 24rem;
  height: 36rem;
  border-radius: 1rem;
  overflow: hidden;
  z-index: 11;
  animation: ${({ $open }) => ($open ? openModal : closeModal)} 0.5s
    cubic-bezier(0.22, 1.61, 0.36, 1) forwards;
  background: linear-gradient(120deg, #ebabc8, #336ba8);
  box-shadow: 0.5em 0.5em 2em 1em rgba(23, 61, 101, 0.8);
  padding: 4px;
`;

const ModalBannerWrap = styled.div<{ $changeAuth: boolean; $animate: boolean }>`
  position: absolute;
  top: 0.2em;
  left: 0.2em;
  right: 0.2em;
  bottom: 0.2em;
  display: flex;
  object-fit: cover;
  overflow: hidden;
  border-radius: 1.2rem;
  clip-path: inset(0 1px 60% 0);
  z-index: 15;
  ${({ $changeAuth, $animate }) =>
    $animate &&
    css`
      animation: ${$changeAuth ? clipAnimation : clipAnimationReverse} 1.5s ease
        forwards;
    `}
`;

const ModalBanner = styled.img`
  width: 100%;
  object-fit: cover;
  /* clip-path: inset(0 0 70% 0); */
`;

const ImageBlurWrap = styled.div<{ $changeAuth: boolean; $animate: boolean }>`
  position: absolute;
  top: 0.2em;
  left: 0.2em;
  right: 0.2em;
  bottom: 0.2em;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  z-index: 13;
  ${({ $changeAuth, $animate }) =>
    $animate &&
    css`
      animation: ${$changeAuth ? backAnimation : backAnimationReverse} 1.5s ease
        forwards;
    `}
`;

const ImageBlur = styled.div`
  position: absolute;
  top: 0.2em;
  left: 0.2em;
  right: 0.2em;
  bottom: 0.2em;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  width: 100%;
  height: 100%;
  background-image: url(${Starry.src});
  background-position: center center;
  background-repeat: no-repeat;
  object-fit: cover;
  filter: blur(0.4em);
`;

const ModalInner = styled.div<{ $changeAuth: boolean }>`
  display: flex;
  justify-content: end;
  align-items: ${({ $changeAuth }) => ($changeAuth ? "start" : "end")};
  margin-top: ${({ $changeAuth }) => ($changeAuth ? 4 : 0)}em;
  margin-bottom: ${({ $changeAuth }) => ($changeAuth ? 0 : 1)}em;
  width: 100%;
  z-index: 15;
`;

const ContentBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;

const SubTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
`;

const Title = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 1);
`;

const InputOuterWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const InputWrap = styled.div`
  width: 100%;
  height: 2.5rem;
  border-bottom: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input<{ target: string; $alert: boolean }>`
  all: unset;
  padding: 0 0.1em;
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.9);
  &::placeholder {
    color: ${({ $alert }) =>
      $alert ? "rgba(226, 58, 58, 0.7)" : "rgba(255, 255, 255, 1)"};
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1rem;
  gap: 0.5rem;
`;

const ButtonInner = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonText = styled.p`
  font-size: 1rem;
  font-weight: 700;
`;

const Button = styled.button<{ type: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  border-radius: 0.25rem;
  background-color: ${({ type }) =>
    type === "login" ? "#222" : "rgba(255, 255, 255, 0.8)"};
  overflow: hidden;
  &:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
  p {
    color: ${({ type }) =>
      type === "login" ? "rgba(255, 255, 255, 0.9)" : "#222"};
  }
`;

const LottieWrap = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  top: 0;
  bottom: 0;
  left: -3.5rem;
  right: 0;
  width: 3.2rem;
`;
