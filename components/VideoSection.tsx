import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import YouTube from "react-youtube";

const video = [
  "8ekm6LeTT4s",
  "4RJRHR0g0AA",
  "XGsjFZyoP34",
  "ViSoA9XALx0",
  "BGlQakaaJDs",
  "fv-rg-vQAzQ",
  "1x7xaWRsE0A",
];

const opts = {
  height: "100%",
  width: "100%",
  playerVars: {
    autoplay: 0,
    mute: 0,
    controls: 0,
    rel: 1, // 관련 영상 추천 X
    modestbranding: 1, // YouTube 로고 최소화
  },
};

const items = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  content: `Item ${i}`,
}));

const visibleCount = 5;
const half = Math.floor(visibleCount / 2);

const VideoSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<any[]>([]);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemCount = video.length;

  // const visibleItems = useMemo(() => {
  //   const result = [];
  //   for (let i = -half; i <= half; i++) {
  //     const index = (currentIndex + i + itemCount) % itemCount;
  //     result.push({ index, relative: i });
  //   }
  //   return result;
  // }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % itemCount);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount);
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setContainerWidth(width);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 초기 실행

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 이전 슬라이드 비디오 멈춤
    const prevIndex = (currentIndex - 1 + itemCount) % itemCount;
    const nextIndex = (currentIndex + 1) % itemCount;

    const player = playerRefs.current[currentIndex];

    if (player && typeof player.playVideo === "function") {
      player.playVideo();
    }

    [prevIndex, nextIndex].forEach((i) => {
      const p = playerRefs.current[i];

      if (p && typeof p.pauseVideo === "function") {
        p.pauseVideo();
      }
    });
  }, [currentIndex]);
  const itemWidth = containerWidth / (visibleCount - 2);

  return (
    <CarouselWrap>
      <CarouselWrapInner ref={containerRef} $move={itemWidth * currentIndex}>
        {video.map((_, i) => {
          return (
            <Slide
              key={i}
              $isCur={
                (currentIndex + i + itemCount) % itemCount === currentIndex
              }
              $itemWidth={itemWidth}
              // style={{
              //   visibility: video.some((v) => v.index === index)
              //     ? "visible"
              //     : "hidden",
              // }}
            >
              <VideoWrapper>
                <YouTube
                  videoId={video[i]}
                  opts={{
                    ...opts,
                    playerVars: {
                      ...opts.playerVars,
                      autoplay:
                        i === (currentIndex + i + itemCount) % itemCount
                          ? 1
                          : 0,
                    },
                  }}
                  onReady={(e) => {
                    playerRefs.current[i] = e.target;
                  }}
                />
              </VideoWrapper>
            </Slide>
          );
        })}
      </CarouselWrapInner>
      <ButtonWrap>
        <Button onClick={handlePrev}>Prev</Button>
        <Button onClick={handleNext}>Next</Button>
      </ButtonWrap>
    </CarouselWrap>
  );
};

const CarouselWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 15em;
`;

const CarouselWrapInner = styled.div<{ $move: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  /* transform: translate(calc(0 - ${({ $move }) => `${$move}px`}), -50%); */
  transform: translate(0, -50%);
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  overflow: hidden;
`;

const ButtonWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  z-index: 99;
`;

const Button = styled.div`
  padding: 1em;
  background-color: #999;
`;

const Slide = styled.div<{
  $isCur: boolean;
  $itemWidth: number;
}>`
  transform: scale(${({ $isCur }) => ($isCur ? 1.1 : 0.8)});

  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  /* width: 100%; */
  transform-origin: center center;
  width: ${({ $itemWidth }) => $itemWidth}px;
  /* width: 30em; */
  height: 100%;
  z-index: ${({ $isCur }) => ($isCur ? 9 : 8)};
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 66.25%;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export default VideoSection;

// import React, { useState, useEffect, useRef, useMemo } from "react";
// import styled from "styled-components";
// import YouTube from "react-youtube";

// const video = [
//   "8ekm6LeTT4s",
//   "4RJRHR0g0AA",
//   "XGsjFZyoP34",
//   "ViSoA9XALx0",
//   "BGlQakaaJDs",
//   "fv-rg-vQAzQ",
//   "1x7xaWRsE0A",
// ];

// const opts = {
//   height: "100%",
//   width: "100%",
//   playerVars: {
//     autoplay: 0,
//     mute: 0,
//     controls: 0,
//     rel: 1, // 관련 영상 추천 X
//     modestbranding: 1, // YouTube 로고 최소화
//   },
// };

// const items = Array.from({ length: 7 }, (_, i) => ({
//   id: i,
//   content: `Item ${i}`,
// }));

// const visibleCount = 7;
// const half = Math.floor(visibleCount / 2);

// const VideoSection = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const playerRefs = useRef<any[]>([]);
//   const [containerWidth, setContainerWidth] = useState<number>(0);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const itemCount = video.length;

//   const visibleItems = useMemo(() => {
//     const result = [];
//     for (let i = -half; i <= half; i++) {
//       const index = (currentIndex + i + itemCount) % itemCount;
//       result.push({ index, relative: i });
//     }
//     return result;
//   }, [currentIndex]);

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % itemCount);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       if (containerRef.current) {
//         const { width } = containerRef.current.getBoundingClientRect();
//         setContainerWidth(width);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); // 초기 실행

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     // 이전 슬라이드 비디오 멈춤
//     const prevIndex = (currentIndex - 1 + itemCount) % itemCount;
//     const nextIndex = (currentIndex + 1) % itemCount;

//     const player = playerRefs.current[currentIndex];

//     if (player && typeof player.playVideo === "function") {
//       player.playVideo();
//     }

//     [prevIndex, nextIndex].forEach((i) => {
//       const p = playerRefs.current[i];

//       if (p && typeof p.pauseVideo === "function") {
//         p.pauseVideo();
//       }
//     });
//   }, [currentIndex]);
//   console.log("visibleItems", ...visibleItems);
//   return (
//     <CarouselWrap>
//       <CarouselWrapInner ref={containerRef}>
//         {visibleItems.map(({ index, relative }, i) => {
//           const itemWidth = containerWidth / (visibleCount - 2);
//           return (
//             <Slide
//               key={index}
//               $relative={i - 1}
//               $isCur={index === currentIndex}
//               $itemWidth={itemWidth}
//               style={{
//                 visibility: visibleItems.some((v) => v.index === index)
//                   ? "visible"
//                   : "hidden",
//               }}
//             >
//               <VideoWrapper>
//                 <YouTube
//                   videoId={video[index]}
//                   opts={{
//                     ...opts,
//                     playerVars: {
//                       ...opts.playerVars,
//                       autoplay: index === currentIndex ? 1 : 0,
//                     },
//                   }}
//                   onReady={(e) => {
//                     playerRefs.current[index] = e.target;
//                   }}
//                 />
//               </VideoWrapper>
//             </Slide>
//           );
//         })}
//       </CarouselWrapInner>
//       <ButtonWrap>
//         <Button onClick={handlePrev}>Prev</Button>
//         <Button onClick={handleNext}>Next</Button>
//       </ButtonWrap>
//     </CarouselWrap>
//   );
// };

// const CarouselWrap = styled.div`
//   position: relative;
//   display: flex;
//   justify-content: center;
//   flex-direction: column;
//   width: 100%;
//   height: 15em;
// `;

// const CarouselWrapInner = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 120%;
//   height: 100%;
//   overflow: hidden;
// `;

// const ButtonWrap = styled.div`
//   display: flex;
//   width: 100%;
//   justify-content: space-around;
//   z-index: 99;
// `;

// const Button = styled.div`
//   padding: 1em;
//   background-color: #999;
// `;

// const Slide = styled.div<{
//   $relative: number;
//   $isCur: boolean;
//   $itemWidth: number;
// }>`
//   position: absolute;
//   left: 0;
//   top: 50%;
//   transform: translateX(
//       ${({ $relative, $itemWidth }) => $relative * $itemWidth}px
//     )
//     translateY(-50%) scale(${({ $isCur }) => ($isCur ? 1.4 : 0.8)});

//   transition: transform 0.3s ease;
//   display: flex;
//   align-items: center;
//   width: 100%;
//   transform-origin: center center;
//   width: ${({ $itemWidth }) => $itemWidth}px;
//   height: 100%;
//   z-index: ${({ $isCur }) => ($isCur ? 9 : 8)};
// `;

// const VideoWrapper = styled.div`
//   position: relative;
//   width: 100%;
//   padding-bottom: 66.25%;
//   overflow: hidden;

//   iframe {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//   }
// `;

// export default VideoSection;
