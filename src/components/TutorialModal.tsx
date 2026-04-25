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

interface TutorialModalProps {
  onComplete: () => void;
  onBack?: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px) rotate(1deg); }
  to { opacity: 1; transform: translateY(0) rotate(1deg); }
`;

export default function TutorialModal({
  onComplete,
  onBack,
}: TutorialModalProps) {
  return (
    <div css={styles.root}>
      <div css={styles.card}>
        <div css={styles.header}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              css={styles.backButton}
              aria-label="뒤로 가기"
            >
              ←
            </button>
          )}
          <span>📖</span>
          <h2 css={styles.headerTitle}>수사 수칙</h2>
        </div>

        <div css={styles.body}>
          <Section icon="🛡" title="목표">
            단순히 범인을 찍는 것이 아닙니다.
            <br />
            <strong css={styles.underlineBold}>누가, 왜, 어떻게</strong>
            <br />
            세 가지를 모두 밝혀내야 최고의 등급을 받습니다.
          </Section>

          <Section icon="⏱" title="자원 및 시간">
            당신에게는{" "}
            <strong css={styles.red}>20번의 행동력(AP)</strong>만 주어집니다.
            <br />
            또한 <strong css={styles.red}>10분 내</strong>에 해결하지 못하면,
            <br />
            아무리 완벽한 추리라도{" "}
            <span css={styles.underline}>최대 B등급</span>만 받게 됩니다.
          </Section>

          <div css={styles.tipBox}>
            <h3 css={styles.tipTitle}>질문 팁</h3>
            <div css={[styles.tipRow, styles.bad]}>
              ✕ &ldquo;너 범인이야?&rdquo; (단순 부정만)
            </div>
            <div css={[styles.tipRow, styles.good]}>
              ✓ &ldquo;8시 정전 때 어디에 있었나?&rdquo;
            </div>
          </div>

          <div css={styles.tipBox}>
            <h3 css={styles.tipTitle}>중요 안내</h3>
            <p css={styles.notice}>
              이 게임의 이미지, 시나리오, 등장인물들은 모두 AI로 생성된 허구이며
              현실 세계와 무관합니다.
            </p>
          </div>
        </div>

        <div css={styles.footer}>
          <button css={styles.confirm} onClick={onComplete}>
            ✓ 수칙 확인 완료
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 css={styles.sectionTitle}>
        <span>{icon}</span> {title}
      </h3>
      <p css={styles.sectionBody}>{children}</p>
    </div>
  );
}

const styles = {
  root: css({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: noir.bg900,
    fontFamily: fonts.serif,
  }),
  card: css({
    width: "100%",
    maxWidth: 420,
    backgroundColor: noir.parchment,
    color: "#1f2937",
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
    transform: "rotate(1deg)",
    animation: `${fadeIn} 0.5s ease-out`,
  }),
  header: css({
    backgroundColor: noir.amber800,
    color: noir.amber100,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderBottom: `4px solid ${noir.amber700}`,
  }),
  backButton: css({
    background: "transparent",
    border: 0,
    color: noir.amber100,
    fontSize: 22,
    lineHeight: 1,
    padding: "4px 8px",
    marginRight: 4,
    cursor: "pointer",
    fontFamily: "inherit",
    "&:active": { opacity: 0.6 },
  }),
  headerTitle: css({
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: "0.1em",
    margin: 0,
  }),
  body: css({
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  }),
  sectionTitle: css({
    color: noir.amber800,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 16,
    fontWeight: 700,
    margin: "0 0 8px",
  }),
  sectionBody: css({
    fontSize: 14,
    lineHeight: 1.6,
    color: "#1f2937",
    margin: 0,
  }),
  underlineBold: css({
    fontWeight: 700,
    borderBottom: "1px solid #000",
  }),
  underline: css({ textDecoration: "underline" }),
  red: css({ color: noir.red700, fontWeight: 700 }),
  tipBox: css({
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 16,
    borderRadius: 4,
    border: "1px solid rgba(0,0,0,0.1)",
  }),
  tipTitle: css({
    fontSize: 11,
    color: "#4b5563",
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    fontWeight: 700,
    margin: "0 0 8px",
  }),
  tipRow: css({
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    padding: "4px 0",
  }),
  bad: css({ color: "rgba(185,28,28,0.7)" }),
  good: css({ color: noir.green800 }),
  notice: css({
    fontSize: 14,
    lineHeight: 1.6,
    color: "#1f2937",
    margin: 0,
  }),
  footer: css({
    padding: 16,
    backgroundColor: noir.parchmentDark,
    borderTop: "1px solid #d6cbb5",
  }),
  confirm: css({
    width: "100%",
    padding: "12px 0",
    backgroundColor: noir.red800,
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    border: 0,
    borderRadius: 2,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    "&:active": { backgroundColor: noir.red700 },
  }),
};
