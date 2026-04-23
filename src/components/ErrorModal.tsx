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

interface ErrorModalProps {
  errorMsg: string | null;
  onRetry: (() => void) | null;
  setErrorMsg: (msg: string | null) => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

export default function ErrorModal({
  errorMsg,
  onRetry,
  setErrorMsg,
}: ErrorModalProps) {
  if (!errorMsg) return null;

  const handleRetry = () => {
    setErrorMsg(null);
    if (onRetry) onRetry();
  };

  return (
    <div css={styles.overlay}>
      <div css={styles.card}>
        <div css={styles.icon} aria-hidden>
          📡
        </div>
        <h2 css={styles.title}>SIGNAL LOST</h2>
        <p css={styles.message}>{errorMsg}</p>
        <button css={styles.button} onClick={handleRetry}>
          ⟳ 재접속 시도
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: css({
    position: "fixed",
    inset: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(4px)",
    animation: `${fadeIn} 0.2s ease-out`,
    fontFamily: fonts.sans,
  }),
  card: css({
    width: "100%",
    maxWidth: 360,
    padding: 24,
    backgroundColor: noir.bg800,
    border: `2px solid ${noir.red600}`,
    borderRadius: 2,
    textAlign: "center",
    boxShadow: "0 0 20px rgba(220,38,38,0.5)",
  }),
  icon: css({
    fontSize: 48,
    marginBottom: 16,
    color: noir.red500,
    animation: `${pulse} 1.2s ease-in-out infinite`,
  }),
  title: css({
    fontSize: 20,
    fontWeight: 700,
    color: noir.red500,
    letterSpacing: "0.25em",
    margin: "0 0 8px",
  }),
  message: css({
    color: noir.text300,
    fontFamily: fonts.mono,
    fontSize: 14,
    margin: "0 0 24px",
  }),
  button: css({
    width: "100%",
    padding: "12px 0",
    backgroundColor: noir.red700,
    color: "#fff",
    fontWeight: 700,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    border: 0,
    borderRadius: 2,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    "&:active": { backgroundColor: noir.red800 },
  }),
};
