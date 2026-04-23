/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { useEffect, useState } from "react";

import { fonts, noir } from "@/styles/theme";

interface LoadingScreenProps {
  loadingText: string;
}

const GAME_TIPS = [
  "범인은 거짓말을 하고 있을 수 있습니다. 핵심 트릭과 알리바이 모순을 찾아보세요.",
  "모든 용의자는 비밀을 가지고 있습니다. 하지만 모든 비밀이 범행과 관련 있는 것은 아닙니다.",
  "사건 현장의 날씨와 시간은 알리바이를 검증하는 중요한 단서가 됩니다.",
  "용의자의 성격에 주목하세요. 감정적인 동요를 일으켜 진실을 얻어낼 수도 있습니다.",
  "범행 동기를 파악하면 용의자 목록을 크게 좁힐 수 있습니다.",
  "너무 뻔해 보이는 용의자는 함정일 수 있습니다. 이면을 들여다보세요.",
  "피해자와의 관계 속에 살해 동기가 숨어있을 가능성이 높습니다.",
  "알리바이가 너무 완벽하다면, 오히려 트릭이 숨겨져 있을 수 있습니다.",
  "증거물은 거짓말을 하지 않습니다. 증언과 증거가 엇갈린다면 증거를 믿으세요.",
];

const spin = keyframes`
  to { transform: rotate(360deg); }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;
const loadingBar = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
`;
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export default function LoadingScreen({ loadingText }: LoadingScreenProps) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * GAME_TIPS.length));
  }, []);

  const nextTip = () => setTipIndex((prev) => (prev + 1) % GAME_TIPS.length);

  return (
    <div css={styles.root}>
      <div css={styles.spinner} aria-hidden>
        ⟳
      </div>
      <p css={styles.loadingText}>{loadingText}</p>
      <div css={styles.barTrack}>
        <div css={styles.barFill} />
      </div>
      <div css={styles.tipBox} onClick={nextTip}>
        <span css={styles.tipIcon}>💡</span>
        <p css={styles.tipText}>&ldquo;{GAME_TIPS[tipIndex]}&rdquo;</p>
      </div>
    </div>
  );
}

const styles = {
  root: css({
    minHeight: "100vh",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: noir.bg950,
    color: noir.text100,
    fontFamily: fonts.serif,
  }),
  spinner: css({
    fontSize: 48,
    color: noir.amber700,
    marginBottom: 24,
    animation: `${spin} 1.2s linear infinite`,
  }),
  loadingText: css({
    fontSize: 20,
    color: noir.amber500,
    letterSpacing: "0.25em",
    textAlign: "center",
    animation: `${pulse} 2s ease-in-out infinite`,
    margin: 0,
  }),
  barTrack: css({
    marginTop: 32,
    marginBottom: 48,
    width: 192,
    height: 4,
    backgroundColor: noir.bg800,
    borderRadius: 999,
    overflow: "hidden",
  }),
  barFill: css({
    height: "100%",
    width: "100%",
    backgroundColor: noir.amber800,
    transformOrigin: "left",
    animation: `${loadingBar} 3s ease-in-out infinite`,
  }),
  tipBox: css({
    maxWidth: 512,
    cursor: "pointer",
    userSelect: "none",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "0 16px",
    animation: `${fadeIn} 0.8s ease-out`,
    transition: "opacity 0.2s",
    "&:active": { opacity: 0.7 },
  }),
  tipIcon: css({ fontSize: 24, color: noir.amber700 }),
  tipText: css({
    fontFamily: fonts.sans,
    fontSize: 14,
    color: noir.text400,
    lineHeight: 1.6,
    wordBreak: "keep-all",
    margin: 0,
  }),
};
