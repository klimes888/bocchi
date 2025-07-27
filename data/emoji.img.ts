// hitori
import HITORI1 from "@/assets/emoji/hitori1.jpg";
import HITORI2 from "@/assets/emoji/hitori2.jpg";
import HITORI3 from "@/assets/emoji/hitori3.jpg";
import HITORI4 from "@/assets/emoji/hitori4.jpg";
import HITORI5 from "@/assets/emoji/hitori5.jpg";

// kikuri
import KIKURI1 from "@/assets/emoji/kikuri1.jpg";

// kita
import KITA1 from "@/assets/emoji/kita1.jpg";
import KITA2 from "@/assets/emoji/kita2.jpg";

// nijika
import NIJIKA1 from "@/assets/emoji/nijika1.jpg";

// ryo
import RYO1 from "@/assets/emoji/ryo1.jpg";
import { StaticImageData } from "next/image";

enum CHARA_TYPE {
  HITORI,
  RYO,
  KITA,
  NIJIKA,
  KIKURI,
}

enum EMOTION {
  FURI, // 분노
  SAD, // 슬픔
  EMBRARRAS, // 당황
  HAPPY, // 행복
  EMOTIONLESS, // 무표정
}

const { FURI, SAD, EMBRARRAS, HAPPY, EMOTIONLESS } = EMOTION;

const { HITORI, RYO, KITA, NIJIKA, KIKURI } = CHARA_TYPE;

export const emoji: Record<
  string,
  { type: CHARA_TYPE; img: StaticImageData; emoji: EMOTION; key: number }
> = {
  "1": { type: HITORI, img: HITORI1, emoji: HAPPY, key: 1 },
  "2": { type: HITORI, img: HITORI2, emoji: EMBRARRAS, key: 2 },
  "3": { type: HITORI, img: HITORI3, emoji: EMBRARRAS, key: 3 },
  "4": { type: HITORI, img: HITORI4, emoji: EMBRARRAS, key: 4 },
  "5": { type: HITORI, img: HITORI5, emoji: EMBRARRAS, key: 5 },
  "6": { type: KIKURI, img: KIKURI1, emoji: HAPPY, key: 6 },
  "7": { type: KITA, img: KITA1, emoji: HAPPY, key: 7 },
  "8": { type: KITA, img: KITA2, emoji: HAPPY, key: 8 },
  "9": { type: NIJIKA, img: NIJIKA1, emoji: HAPPY, key: 9 },
  "10": { type: RYO, img: RYO1, emoji: HAPPY, key: 10 },
};
