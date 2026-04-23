/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";

import { fonts, noir } from "@/styles/theme";

interface IntroScreenProps {
  onStart: () => void;
  onLoadGame: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function IntroScreen({
  onStart,
  onLoadGame,
  isMuted,
  toggleMute,
}: IntroScreenProps) {
  return (
    <div css={styles.root}>
      <div css={styles.bgOverlay} />
      <div css={styles.grid} />

      <button
        onClick={toggleMute}
        css={styles.muteBtn}
        aria-label={isMuted ? "음소거 해제" : "음소거"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <div css={styles.content}>
        <div css={styles.logoBadge}>🔍</div>
        <h1 css={styles.title}>
          오늘의 <span css={styles.titleAmber}>탐정</span>
        </h1>
        <p css={styles.subtitle}>10분의 미스터리</p>
        <p css={styles.subtitleEn}>The Daily Detective</p>

        <div css={styles.buttons}>
          <button css={[styles.ctaButton, styles.ctaPrimary]} onClick={onStart}>
            📄 새로운 의뢰
          </button>
          <button
            css={[styles.ctaButton, styles.ctaSecondary]}
            onClick={onLoadGame}
          >
            🗄 사건 기록실
          </button>
        </div>
      </div>

      <footer css={styles.footer}>
        © 2025 Hyunil Park. All Rights Reserved.
      </footer>
    </div>
  );
}

const styles = {
  root: css({
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: noir.bg900,
    color: noir.text100,
    overflow: "hidden",
    fontFamily: fonts.sans,
  }),
  bgOverlay: css({
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(17,24,39,0.9)",
  }),
  grid: css({
    position: "absolute",
    inset: 0,
    opacity: 0.1,
    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
    backgroundSize: "30px 30px",
    pointerEvents: "none",
  }),
  muteBtn: css({
    position: "absolute",
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "rgba(31,41,55,0.8)",
    backdropFilter: "blur(4px)",
    border: `1px solid ${noir.bg700}`,
    color: noir.text400,
    fontSize: 16,
    cursor: "pointer",
    zIndex: 50,
  }),
  content: css({
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    maxWidth: 420,
    width: "100%",
    animation: `${fadeIn} 0.6s ease-out`,
  }),
  logoBadge: css({
    width: 96,
    height: 96,
    margin: "0 auto 16px",
    borderRadius: "50%",
    backgroundColor: noir.bg800,
    border: `4px solid rgba(146,64,14,0.5)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 48,
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  }),
  title: css({
    fontFamily: fonts.serif,
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    margin: "0 0 8px",
  }),
  titleAmber: css({ color: noir.amber700 }),
  subtitle: css({
    fontFamily: fonts.serif,
    color: noir.amber500,
    letterSpacing: "0.25em",
    fontWeight: 700,
    margin: "0 0 8px",
  }),
  subtitleEn: css({
    fontSize: 12,
    color: noir.text500,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    padding: "8px 0",
    borderTop: `1px solid ${noir.bg700}`,
    borderBottom: `1px solid ${noir.bg700}`,
    margin: "0 0 48px",
  }),
  buttons: css({
    display: "flex",
    flexDirection: "column",
    gap: 16,
  }),
  ctaButton: css({
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: 700,
    padding: "16px 24px",
    borderRadius: 2,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    transition: "transform 0.15s ease, background-color 0.15s ease",
    "&:active": { transform: "scale(0.98)" },
  }),
  ctaPrimary: css({
    backgroundColor: noir.amber800,
    color: noir.amber100,
    border: `1px solid ${noir.amber600}`,
  }),
  ctaSecondary: css({
    backgroundColor: noir.bg800,
    color: noir.text300,
    border: `1px solid ${noir.bg600}`,
  }),
  footer: css({
    position: "absolute",
    bottom: 16,
    width: "100%",
    textAlign: "center",
    fontSize: 10,
    color: "rgba(107,114,128,0.5)",
    fontFamily: fonts.mono,
    zIndex: 10,
  }),
};
