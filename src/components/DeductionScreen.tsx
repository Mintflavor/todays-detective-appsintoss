/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import type { ChangeEvent } from "react";

import SuspectAvatar from "@/components/common/SuspectAvatar";
import { fonts, noir } from "@/styles/theme";
import type { CaseData, DeductionInput } from "@/types/game";

interface DeductionScreenProps {
  caseData: CaseData;
  deductionInput: DeductionInput;
  setDeductionInput: (
    input: DeductionInput | ((prev: DeductionInput) => DeductionInput),
  ) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function DeductionScreen({
  caseData,
  deductionInput,
  setDeductionInput,
  onSubmit,
  onBack,
}: DeductionScreenProps) {
  const canSubmit =
    deductionInput.culpritId != null && deductionInput.reasoning.trim() !== "";

  return (
    <div css={styles.root}>
      <div css={styles.card}>
        <div css={styles.stripe} />

        <div css={styles.header}>
          <div css={styles.alertIcon} aria-hidden>
            ⚠
          </div>
          <h2 css={styles.title}>최종 수사 보고</h2>
          <p css={styles.subtitle}>범인을 지목하고 사건의 진실을 밝히세요</p>
        </div>

        <div css={styles.section}>
          <label css={styles.label}>용의자 지목</label>
          <div css={styles.suspectGrid}>
            {caseData.suspects.map((s) => {
              const selected = deductionInput.culpritId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() =>
                    setDeductionInput((prev) => ({ ...prev, culpritId: s.id }))
                  }
                  css={[styles.suspectBtn, selected && styles.suspectBtnActive]}
                >
                  <div css={styles.avatarWrap}>
                    <SuspectAvatar
                      image={s.portraitImage}
                      alt={s.name}
                      size={68}
                    />
                  </div>
                  <div css={styles.suspectName}>{s.name}</div>
                  <div css={styles.suspectRole}>{s.role}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div css={styles.section}>
          <label css={styles.label}>범행 동기 및 트릭</label>
          <textarea
            value={deductionInput.reasoning}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDeductionInput((prev) => ({
                ...prev,
                reasoning: e.target.value,
              }))
            }
            placeholder="범행 동기와 사용된 트릭을 상세히 서술하시오..."
            css={styles.textarea}
          />
        </div>

        <div css={styles.buttons}>
          <button css={styles.backBtn} onClick={onBack}>
            ‹ 수사 계속하기
          </button>
          <button
            css={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: css({
    minHeight: "100vh",
    padding: 24,
    backgroundColor: noir.bg900,
    color: noir.text100,
    fontFamily: fonts.serif,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  card: css({
    width: "100%",
    maxWidth: 480,
    backgroundColor: noir.bg800,
    border: `1px solid ${noir.bg700}`,
    borderRadius: 2,
    padding: 24,
    position: "relative",
    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
    animation: `${fadeIn} 0.5s ease-out`,
  }),
  stripe: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 4,
    background: `linear-gradient(to right, ${noir.red800}, ${noir.red600}, ${noir.red800})`,
  }),
  header: css({ textAlign: "center", marginBottom: 24 }),
  alertIcon: css({
    fontSize: 40,
    color: noir.red500,
    marginBottom: 12,
  }),
  title: css({
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "#fff",
    margin: 0,
  }),
  subtitle: css({
    fontSize: 10,
    color: noir.text500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginTop: 8,
  }),
  section: css({ marginBottom: 24 }),
  label: css({
    display: "block",
    color: noir.text400,
    fontSize: 11,
    fontFamily: fonts.sans,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    fontWeight: 700,
    marginBottom: 12,
  }),
  suspectGrid: css({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  }),
  suspectBtn: css({
    padding: "12px 8px",
    backgroundColor: noir.bg900,
    border: `2px solid ${noir.bg700}`,
    borderRadius: 2,
    color: noir.text500,
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.15s, background-color 0.15s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  }),
  suspectBtnActive: css({
    borderColor: noir.red600,
    backgroundColor: "rgba(127,29,29,0.2)",
    color: "#fca5a5",
    boxShadow: "0 0 15px rgba(220,38,38,0.3)",
  }),
  avatarWrap: css({
    width: "100%",
    aspectRatio: "1 / 1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  suspectName: css({ fontWeight: 700, fontSize: 12 }),
  suspectRole: css({ fontSize: 10, color: noir.text400 }),
  textarea: css({
    width: "100%",
    height: 128,
    backgroundColor: noir.bg900,
    border: `1px solid ${noir.bg700}`,
    borderRadius: 2,
    padding: 12,
    color: "#fff",
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 1.6,
    resize: "none",
    "&:focus": { borderColor: noir.red600, outline: "none" },
    "&::placeholder": { color: noir.text500 },
  }),
  buttons: css({ display: "flex", gap: 12 }),
  backBtn: css({
    flex: 1,
    padding: "14px 0",
    backgroundColor: noir.bg700,
    color: noir.text300,
    fontWeight: 700,
    fontSize: 12,
    border: 0,
    borderRadius: 2,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  }),
  submitBtn: css({
    flex: 2,
    padding: "14px 0",
    backgroundColor: noir.red800,
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.25em",
    border: 0,
    borderRadius: 2,
    cursor: "pointer",
    boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
    "&:active": { backgroundColor: noir.red700 },
  }),
  submitBtnDisabled: css({
    backgroundColor: noir.bg800,
    color: noir.bg600,
    cursor: "not-allowed",
    boxShadow: "none",
  }),
};
