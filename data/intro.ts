import HitoriGif from "@/assets/characters/hitori_ugo.webp";
import NijikaGif from "@/assets/characters/Nijika_ugo.webp";
import RyoGif from "@/assets/characters/Ryo_ugo.webp";
import KitaGif from "@/assets/characters/Kita_ugo.webp";
import Hitori from "@/assets/characters/Hitori_Intro.jpg";
import Image, { StaticImageData } from "next/image";

export const chara: Record<string, { desc: any[] }> = {
  Hitori: {
    desc: [
      {
        src: HitoriGif.src,
        img: Hitori,
        name: "HITORI GOTO",
        intro: [
          {
            title: "Name",
            desc: ["기타 히어로 (ギターヒーロー)", "봇치 (ぼっち)"],
          },
          {
            title: "Family",
            desc: [
              "고토 나오키 [아버지]",
              "고토 미치요 [어머니]",
              "고토 후타리 [여동생]",
              "할머니",
            ],
          },
          {
            title: "Quote",
            desc: [
              `“저, 저는... 기타리스트로서 모두의 소중한 결속 밴드를 최고의 밴드로 만들고 싶어요.”`,
            ],
          },
        ],
      },
      {
        src: "",
        img: "",
        name: "INTRO",
        intro: [
          {
            title: "요약",
            desc: "고토 히토리(後藤 ひとり)**는 『ぼっち・ざ・ろっく！(봇치・더・록!)』의 주인공으로, 뛰어난 기타 실력을 지닌 내성적인 고등학생이다. 애니메이션 및 만화에서 그녀는 “보치짱(ぼっちちゃん)“이라는 별명으로 자주 불리며, 사회성이 극도로 부족한 성격과 대비되는 무대 위에서의 폭발적인 퍼포먼스로 팬들의 인기를 얻고 있다.",
          },
          {
            title: "성격 및 특징",
            desc: "고토 히토리는 극도로 내성적인 성격으로, 타인과의 커뮤니케이션을 어려워하며 자신감도 부족하다. 사람들과 어울리지 못해 학교생활에 적응하지 못하고 혼자 있는 시간이 많다. 이러한 외로움과 불안함 속에서 “인기 있는 사람이 되고 싶다”는 열망으로 초등학교 시절 기타를 독학으로 배우기 시작하였다. \n사회적 상황에서는 불안으로 인해 가상의 시나리오를 상상하거나, 스스로를 자책하는 독백을 자주 하는 등 코미컬한 묘사가 많지만, 실제로는 깊은 감정과 예민한 감성을 지닌 인물이다.",
          },
          {
            title: "기타 실력",
            desc: "히토리는 매일 수 시간 이상을 연습에 몰두해온 결과, 고등학생임에도 불구하고 매우 높은 수준의 기타 연주 능력을 보유하고 있다. 그녀의 연주는 감정 표현이 풍부하고 즉흥 연주에도 능숙하여, 밴드 내에서 핵심적인 음악적 역할을 맡고 있다. 그러나 그 실력은 오직 무대 위에서만 제대로 발휘되며, 일상에서는 극심한 긴장으로 인해 제대로 드러나지 못하는 경우도 많다.",
          },
          {
            title: "밴드 활동",
            desc: "우연히 만난 드러머 이지치 니지카의 권유로 인해, 인디 밴드 **결속 밴드(結束バンド)**의 기타리스트로 활동하게 된다. 밴드 멤버들과의 관계를 통해 점차 사회성과 자신감을 조금씩 회복해 나가며, 음악을 통해 자신을 표현하는 방법을 배워간다.",
          },
          {
            title: "평가",
            desc: "고토 히토리는 현대 청소년들이 겪는 사회적 불안, 자아 정체성, 소외감 등을 사실적으로 반영한 캐릭터로서 많은 공감을 얻고 있다. 특히 현실적인 감정 묘사와 대비되는 비현실적 연주 장면은 캐릭터의 이중성을 강화하며, 작품의 중요한 매력 포인트로 작용한다.",
          },
        ],
      },
    ],
  },
  Nijika: { src: NijikaGif.src, img: Hitori },
  Ryo: { src: RyoGif.src, img: Hitori },
  Ikuyo: { src: KitaGif.src, img: Hitori },
};
