/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { useState } from "react";

import SuspectAvatar from "@/components/common/SuspectAvatar";
import { submitFeedback } from "@/lib/api";
import { shareResolution } from "@/lib/appsInToss";
import { fonts, noir } from "@/styles/theme";
import type { CaseData, DeductionInput, Evaluation } from "@/types/game";

interface ResolutionScreenProps {
  evaluation: Evaluation;
  caseData: CaseData;
  deductionInput?: DeductionInput;
  onReset: () => void;
}

const FEEDBACK_MAX_LENGTH = 300;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;
const stampIn = keyframes`
  0% { opacity: 0; transform: rotate(-20deg) scale(2); }
  60% { opacity: 1; transform: rotate(12deg) scale(0.95); }
  100% { opacity: 0.8; transform: rotate(12deg) scale(1); }
`;

export default function ResolutionScreen({
  evaluation,
  caseData,
  deductionInput,
  onReset,
}: ResolutionScreenProps) {
  const [showTruth, setShowTruth] = useState(evaluation.isCorrect);
  const [showBriefing, setShowBriefing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const closeFeedbackModal = () => {
    if (feedbackSending) return;
    setShowFeedback(false);
    setFeedbackError(null);
    window.setTimeout(() => {
      setFeedbackText("");
      setFeedbackSent(false);
    }, 300);
  };

  const handleSubmitFeedback = async () => {
    const trimmed = feedbackText.trim();
    if (!trimmed || feedbackSending) return;
    setFeedbackSending(true);
    setFeedbackError(null);
    try {
      const selectedSuspect = deductionInput?.culpritId
        ? caseData.suspects.find((s) => s.id === deductionInput.culpritId)
        : undefined;

      await submitFeedback({
        content: trimmed,
        scenarioId: caseData.scenarioId,
        grade: evaluation.grade,
        gameResult: {
          scenarioTitle: caseData.title,
          selectedSuspectId: deductionInput?.culpritId ?? null,
          selectedSuspectName: selectedSuspect?.name ?? null,
          reasoning: deductionInput?.reasoning ?? "",
          isCorrect: evaluation.isCorrect,
          grade: evaluation.grade,
          culpritName: evaluation.culpritName,
          report: evaluation.report,
          advice: evaluation.advice,
          timeTaken: evaluation.timeTaken,
        },
      });
      setFeedbackSent(true);
      window.setTimeout(closeFeedbackModal, 2000);
    } catch (err) {
      setFeedbackError(
        err instanceof Error ? err.message : "피드백 전송에 실패했습니다.",
      );
    } finally {
      setFeedbackSending(false);
    }
  };

  return (
    <div css={styles.root}>
      <div css={styles.container}>
        <header css={styles.reportHeader}>
          <h2 css={styles.reportTitle}>수사 결과 보고서</h2>
          <p css={styles.caseId}>
            CASE ID:{" "}
            {evaluation.caseNumber ??
              new Date().getTime().toString().slice(-6)}
          </p>
        </header>

        <div css={styles.grid}>
          {/* Polaroid */}
          <div css={styles.polaroid}>
            <div css={styles.polaroidPin} />
            <div css={styles.polaroidPhoto}>
              {showTruth || evaluation.isCorrect ? (
                <SuspectAvatar
                  image={evaluation.culpritImage}
                  alt="Culprit"
                  size={200}
                  shape="square"
                  grayscale
                />
              ) : (
                <span css={styles.photoPlaceholder}>?</span>
              )}
              <div
                css={[
                  styles.stamp,
                  evaluation.isCorrect ? styles.stampSuccess : styles.stampFail,
                ]}
              >
                {evaluation.isCorrect ? "검거 성공" : "검거 실패"}
              </div>
            </div>
            <div css={styles.polaroidCaption}>
              진범: {showTruth ? evaluation.culpritName : "???"}
            </div>
            <div css={styles.polaroidFooter}>
              <span>{new Date().toLocaleDateString()}</span>
              <span css={styles.timeTaken}>
                소요 시간: {evaluation.timeTaken}
              </span>
            </div>
          </div>

          {/* Report */}
          <div css={styles.reportCol}>
            <div css={styles.typewriter}>
              <div css={styles.gradeBadge}>{evaluation.grade}</div>
              <h3 css={styles.typewriterTitle}>탐정 수사 능력 평가</h3>

              <div css={styles.reportBody}>
                <h4 css={styles.reportLabel}>종합 평가</h4>
                <p css={styles.reportText}>{evaluation.report}</p>

                <h4 css={[styles.reportLabel, styles.reportLabelRed]}>
                  조언 및 놓친 단서
                </h4>
                <p css={styles.reportAdvice}>{evaluation.advice}</p>
              </div>
            </div>

            <div css={styles.actionCol}>
              <button
                css={styles.actionBtn}
                onClick={() => setShowBriefing(true)}
              >
                📄 사건 브리핑 문서 확인
              </button>
              {!evaluation.isCorrect && (
                <button
                  css={styles.actionBtn}
                  onClick={() => setShowTruth((v) => !v)}
                >
                  {showTruth ? "🙈 사건의 전말 숨기기" : "👁 진범 및 사건의 전말 확인하기"}
                </button>
              )}
            </div>

            {showTruth && (
              <div css={styles.truthBox}>
                <h3 css={styles.truthTitle}>🛡 사건의 전말</h3>
                <p css={styles.truthText}>{evaluation.truth}</p>
              </div>
            )}
          </div>
        </div>

        <div css={styles.footerActions}>
          <button css={styles.resetBtn} onClick={onReset}>
            ⟳ 새로운 사건 맡기
          </button>
          <button
            css={styles.feedbackBtn}
            onClick={() =>
              shareResolution({
                title: caseData.title,
                grade: evaluation.grade,
                culpritName: evaluation.culpritName,
                timeTaken: evaluation.timeTaken,
              })
            }
          >
            📤 수사 결과 공유하기
          </button>
          <button
            css={styles.feedbackBtn}
            onClick={() => setShowFeedback(true)}
          >
            💬 사무소로 피드백 보내기
          </button>
        </div>
      </div>

      {showBriefing && (
        <BriefingModal
          caseData={caseData}
          onClose={() => setShowBriefing(false)}
        />
      )}

      {showFeedback && (
        <FeedbackModal
          text={feedbackText}
          setText={setFeedbackText}
          sending={feedbackSending}
          sent={feedbackSent}
          errorText={feedbackError}
          onSubmit={handleSubmitFeedback}
          onClose={closeFeedbackModal}
        />
      )}
    </div>
  );
}

// ---- Briefing modal ----
function BriefingModal({
  caseData,
  onClose,
}: {
  caseData: CaseData;
  onClose: () => void;
}) {
  return (
    <div css={styles.overlay}>
      <div css={styles.briefingModal}>
        <header css={styles.briefingHeader}>
          <h3 css={styles.briefingHeaderTitle}>📄 사건 브리핑 문서</h3>
          <button css={styles.closeBtn} onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </header>
        <div css={styles.briefingBody}>
          <section>
            <h4 css={styles.briefingSection}>📄 사건 개요</h4>
            <p css={styles.briefingSummary}>{caseData.summary}</p>
          </section>
          <section>
            <h4 css={styles.briefingSection}>💀 피해자 정보</h4>
            <div css={styles.briefingInfo}>
              <div css={styles.briefingRow}>
                <strong>이름:</strong> <span>{caseData.victim_info.name}</span>
              </div>
              <div css={styles.briefingRow}>
                <strong>발생 시각:</strong>{" "}
                <span>{caseData.victim_info.incident_time}</span>
              </div>
              <div>
                <strong>피해 내용:</strong>
                <p css={styles.briefingPara}>
                  {caseData.victim_info.damage_details}
                </p>
              </div>
              <div>
                <strong>현장 상태:</strong>
                <p css={styles.briefingPara}>
                  {caseData.victim_info.body_condition}
                </p>
              </div>
            </div>
          </section>
          <section>
            <h4 css={styles.briefingSection}>🔬 초동 증거물</h4>
            <div css={styles.briefingList}>
              {caseData.evidence_list.map((item, idx) => (
                <div key={idx} css={styles.briefingEvidence}>
                  <div css={styles.briefingBar} />
                  <div>
                    <div css={styles.briefingEvidenceName}>{item.name}</div>
                    <div css={styles.briefingEvidenceDesc}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h4 css={styles.briefingSection}>👥 용의자 목록</h4>
            <div css={styles.briefingList}>
              {caseData.suspects.map((s) => (
                <div key={s.id} css={styles.briefingSuspect}>
                  <SuspectAvatar
                    image={s.portraitImage}
                    alt={s.name}
                    size={48}
                  />
                  <div>
                    <div css={styles.briefingEvidenceName}>{s.name}</div>
                    <div css={styles.briefingEvidenceDesc}>
                      {s.role} | {s.personality}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div css={styles.briefingFooter}>
          <button css={styles.briefingClose} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Feedback modal ----
function FeedbackModal({
  text,
  setText,
  sending,
  sent,
  errorText,
  onSubmit,
  onClose,
}: {
  text: string;
  setText: (v: string) => void;
  sending: boolean;
  sent: boolean;
  errorText: string | null;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div css={styles.overlay}>
      <div css={styles.feedbackModal}>
        <header css={styles.feedbackHeader}>
          <h3 css={styles.briefingHeaderTitle}>💬 사무소로 피드백 보내기</h3>
          <button
            css={[styles.closeBtn, sending && { opacity: 0.3 }]}
            onClick={onClose}
            disabled={sending}
            aria-label="닫기"
          >
            ✕
          </button>
        </header>
        <div css={styles.feedbackBody}>
          {sent ? (
            <div css={styles.feedbackSent}>
              <div css={styles.feedbackSentIcon}>✓</div>
              <p>소중한 피드백 감사합니다.</p>
              <p css={styles.feedbackSentSub}>MESSAGE DELIVERED</p>
            </div>
          ) : (
            <>
              <p css={styles.feedbackGuide}>
                게임에 대한 의견이나 개선 사항을 사무소로 전해주세요. 최대
                300자까지 남길 수 있습니다.
              </p>
              <div css={styles.feedbackTextareaWrap}>
                <textarea
                  rows={6}
                  value={text}
                  disabled={sending}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v.length <= FEEDBACK_MAX_LENGTH) setText(v);
                  }}
                  placeholder="자유롭게 작성해주세요..."
                  css={styles.feedbackTextarea}
                />
                <span css={styles.feedbackCount}>
                  {text.length} / {FEEDBACK_MAX_LENGTH}
                </span>
              </div>
              {errorText && <p css={styles.feedbackError}>{errorText}</p>}
            </>
          )}
        </div>
        {!sent && (
          <div css={styles.feedbackFooter}>
            <button
              css={styles.feedbackCancel}
              onClick={onClose}
              disabled={sending}
            >
              취소
            </button>
            <button
              css={styles.feedbackSubmit}
              disabled={sending || !text.trim()}
              onClick={onSubmit}
            >
              {sending ? "전송 중..." : "전송"}
            </button>
          </div>
        )}
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
    position: "relative",
  }),
  container: css({
    maxWidth: 960,
    margin: "0 auto",
    animation: `${fadeInUp} 0.6s ease-out`,
  }),
  reportHeader: css({
    textAlign: "center",
    borderBottom: `1px solid rgba(55,65,81,0.5)`,
    paddingBottom: 24,
  }),
  reportTitle: css({
    fontSize: 24,
    color: "#e5e7eb",
    fontWeight: 700,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    textShadow: "0 4px 8px rgba(0,0,0,0.6)",
    margin: 0,
  }),
  caseId: css({
    color: noir.text400,
    fontSize: 10,
    marginTop: 8,
    fontFamily: fonts.mono,
  }),
  grid: css({
    display: "flex",
    flexDirection: "column",
    gap: 32,
    marginTop: 32,
    "@media (min-width: 768px)": {
      flexDirection: "row",
      alignItems: "flex-start",
    },
  }),
  polaroid: css({
    backgroundColor: "#fff",
    padding: 12,
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    transform: "rotate(-2deg)",
    position: "relative",
    alignSelf: "center",
    flexShrink: 0,
    width: 280,
    "@media (min-width: 768px)": { width: "33%" },
  }),
  polaroidPin: css({
    position: "absolute",
    top: -16,
    left: "50%",
    transform: "translateX(-50%)",
    width: 32,
    height: 48,
    border: "4px solid #9ca3af",
    borderBottom: 0,
    borderRadius: "50% 50% 0 0",
    zIndex: 20,
  }),
  polaroidPhoto: css({
    backgroundColor: "#e5e7eb",
    aspectRatio: "1 / 1",
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  }),
  photoPlaceholder: css({
    fontSize: 80,
    color: "#9ca3af",
    fontWeight: 700,
  }),
  stamp: css({
    position: "absolute",
    inset: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "double",
    borderWidth: 4,
    borderRadius: "50%",
    textAlign: "center",
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    animation: `${stampIn} 0.8s ease-out`,
    mixBlendMode: "multiply",
  }),
  stampSuccess: css({ borderColor: noir.red600, color: noir.red600 }),
  stampFail: css({ borderColor: "#6b7280", color: "#6b7280" }),
  polaroidCaption: css({
    textAlign: "center",
    color: "#1f2937",
    fontSize: 18,
    fontWeight: 700,
    paddingBottom: 8,
    borderBottom: "1px solid #f3f4f6",
    minHeight: 40,
  }),
  polaroidFooter: css({
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 8px 0",
    fontFamily: fonts.mono,
    fontSize: 11,
    color: "#6b7280",
  }),
  timeTaken: css({ fontWeight: 700, color: "#374151" }),
  reportCol: css({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  }),
  typewriter: css({
    backgroundColor: "#f0e6d2",
    color: "#1f2937",
    padding: 24,
    borderRadius: 2,
    boxShadow: "0 20px 25px rgba(0,0,0,0.4)",
    position: "relative",
    fontFamily: fonts.mono,
  }),
  gradeBadge: css({
    position: "absolute",
    top: 16,
    right: 16,
    width: 64,
    height: 64,
    border: `4px solid ${noir.red800}`,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(12deg)",
    opacity: 0.8,
    fontSize: 28,
    fontWeight: 900,
    color: noir.red800,
  }),
  typewriterTitle: css({
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: noir.amber800,
    borderBottom: "1px solid rgba(146,64,14,0.2)",
    paddingBottom: 8,
    marginBottom: 16,
  }),
  reportBody: css({ fontSize: 14, lineHeight: 1.6 }),
  reportLabel: css({
    fontWeight: 700,
    color: "#374151",
    borderLeft: "4px solid #9ca3af",
    paddingLeft: 8,
    marginBottom: 4,
    marginTop: 16,
  }),
  reportLabelRed: css({ borderLeftColor: "#fca5a5" }),
  reportText: css({ margin: 0 }),
  reportAdvice: css({
    color: "#374151",
    fontStyle: "italic",
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 8,
    borderRadius: 4,
    margin: 0,
  }),
  actionCol: css({ display: "flex", flexDirection: "column", gap: 12 }),
  actionBtn: css({
    width: "100%",
    padding: "12px 16px",
    backgroundColor: noir.bg800,
    color: noir.amber500,
    border: `1px solid ${noir.bg600}`,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  }),
  truthBox: css({
    backgroundColor: "rgba(0,0,0,0.4)",
    border: `1px solid ${noir.bg700}`,
    padding: 24,
    borderRadius: 2,
    animation: `${fadeIn} 0.4s ease-out`,
  }),
  truthTitle: css({
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: noir.text400,
    marginBottom: 12,
  }),
  truthText: css({
    color: noir.text300,
    lineHeight: 1.6,
    fontSize: 16,
    margin: 0,
  }),
  footerActions: css({
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 32,
    paddingTop: 32,
    borderTop: `1px solid ${noir.bg700}`,
    "@media (min-width: 768px)": { flexDirection: "row", justifyContent: "center" },
  }),
  resetBtn: css({
    padding: "16px 48px",
    backgroundColor: noir.amber800,
    color: noir.amber100,
    border: `1px solid ${noir.amber600}`,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  }),
  feedbackBtn: css({
    padding: "16px 32px",
    backgroundColor: noir.bg800,
    color: noir.text100,
    border: `1px solid ${noir.bg600}`,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  }),

  // Modals
  overlay: css({
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(4px)",
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: `${fadeIn} 0.2s ease-out`,
  }),
  briefingModal: css({
    width: "100%",
    maxWidth: 640,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#eaddcf",
    color: "#1f2937",
    border: "1px solid #4b5563",
  }),
  briefingHeader: css({
    backgroundColor: noir.bg800,
    color: noir.amber500,
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid rgba(146,64,14,0.3)`,
  }),
  briefingHeaderTitle: css({
    fontSize: 16,
    fontWeight: 700,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: fonts.serif,
  }),
  closeBtn: css({
    background: "none",
    border: 0,
    color: noir.text400,
    fontSize: 20,
    cursor: "pointer",
  }),
  briefingBody: css({
    padding: 24,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  }),
  briefingSection: css({
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: 8,
  }),
  briefingSummary: css({
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 500,
    color: "#1f2937",
    borderLeft: "4px solid rgba(146,64,14,0.3)",
    paddingLeft: 16,
    margin: 0,
  }),
  briefingInfo: css({
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 16,
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    border: "1px solid rgba(0,0,0,0.1)",
  }),
  briefingRow: css({
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    paddingBottom: 4,
  }),
  briefingPara: css({ paddingLeft: 8, margin: "4px 0 0" }),
  briefingList: css({ display: "flex", flexDirection: "column", gap: 8 }),
  briefingEvidence: css({
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 12,
    display: "flex",
    gap: 12,
    border: "1px solid rgba(0,0,0,0.05)",
  }),
  briefingBar: css({
    width: 4,
    backgroundColor: noir.amber800,
    flexShrink: 0,
  }),
  briefingEvidenceName: css({ fontWeight: 700, fontSize: 14 }),
  briefingEvidenceDesc: css({ fontSize: 12, color: "#4b5563" }),
  briefingSuspect: css({
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 16,
    display: "flex",
    gap: 16,
    alignItems: "center",
    border: "1px solid rgba(0,0,0,0.1)",
  }),
  briefingFooter: css({
    padding: 16,
    backgroundColor: "#e5e7eb",
    borderTop: "1px solid #d1d5db",
    textAlign: "center",
  }),
  briefingClose: css({
    padding: "12px 32px",
    backgroundColor: noir.bg800,
    color: "#fff",
    border: 0,
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    cursor: "pointer",
  }),

  // Feedback
  feedbackModal: css({
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1a1a1a",
    color: "#e5e7eb",
    border: `1px solid ${noir.bg700}`,
    display: "flex",
    flexDirection: "column",
  }),
  feedbackHeader: css({
    backgroundColor: noir.bg800,
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `1px solid rgba(146,64,14,0.3)`,
    color: noir.amber500,
  }),
  feedbackBody: css({ padding: 24, display: "flex", flexDirection: "column", gap: 16 }),
  feedbackSent: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "32px 0",
    textAlign: "center",
    animation: `${fadeIn} 0.3s ease-out`,
  }),
  feedbackSentIcon: css({
    fontSize: 48,
    color: noir.amber500,
  }),
  feedbackSentSub: css({
    fontSize: 10,
    color: noir.text500,
    fontFamily: fonts.mono,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    margin: 0,
  }),
  feedbackGuide: css({
    fontSize: 12,
    color: noir.text400,
    lineHeight: 1.6,
    margin: 0,
  }),
  feedbackTextareaWrap: css({ position: "relative" }),
  feedbackTextarea: css({
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    border: `1px solid ${noir.bg700}`,
    padding: 12,
    color: "#e5e7eb",
    fontSize: 14,
    fontFamily: fonts.serif,
    resize: "none",
    "&:focus": { outline: "none", borderColor: noir.amber700 },
    "&::placeholder": { color: noir.text500 },
  }),
  feedbackCount: css({
    position: "absolute",
    right: 12,
    bottom: 8,
    fontSize: 10,
    color: noir.text500,
    fontFamily: fonts.mono,
  }),
  feedbackError: css({
    fontSize: 12,
    color: "#fca5a5",
    fontFamily: fonts.mono,
    margin: 0,
  }),
  feedbackFooter: css({
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderTop: `1px solid ${noir.bg800}`,
    display: "flex",
    gap: 12,
  }),
  feedbackCancel: css({
    flex: 1,
    padding: "12px 0",
    backgroundColor: noir.bg800,
    color: noir.text300,
    border: 0,
    fontSize: 13,
    fontFamily: fonts.mono,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    cursor: "pointer",
    "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
  }),
  feedbackSubmit: css({
    flex: 1,
    padding: "12px 0",
    backgroundColor: noir.amber800,
    color: noir.amber100,
    border: 0,
    fontSize: 13,
    fontFamily: fonts.mono,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    cursor: "pointer",
    "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
  }),
};
