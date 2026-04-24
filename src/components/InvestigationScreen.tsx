/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";

import SuspectAvatar from "@/components/common/SuspectAvatar";
import useSafeArea from "@/hooks/useSafeArea";
import { formatTime } from "@/lib/utils";
import { fonts, noir } from "@/styles/theme";
import type { CaseData, ChatLogs } from "@/types/game";

interface InvestigationScreenProps {
  caseData: CaseData;
  currentSuspectId: number;
  setCurrentSuspectId: (id: number) => void;
  chatLogs: ChatLogs;
  actionPoints: number;
  timerSeconds: number;
  isOverTime: boolean;
  showTimeOverModal: boolean;
  closeTimeOverModal: () => void;
  userInput: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  inputPlaceholder: string;
  isTyping: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  onGoToBriefing: () => void;
  onGoToDeduction: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const typingBlink = keyframes`
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
`;

export default function InvestigationScreen({
  caseData,
  currentSuspectId,
  setCurrentSuspectId,
  chatLogs,
  actionPoints,
  timerSeconds,
  isOverTime,
  showTimeOverModal,
  closeTimeOverModal,
  userInput,
  handleInputChange,
  handleKeyDown,
  handleSendMessage,
  inputPlaceholder,
  isTyping,
  isMuted,
  toggleMute,
  onGoToBriefing,
  onGoToDeduction,
}: InvestigationScreenProps) {
  const safeArea = useSafeArea();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentSuspect = caseData.suspects.find(
    (s) => s.id === currentSuspectId,
  );
  const isNoteTab = currentSuspectId === 0;
  const isTimerWarning = timerSeconds <= 60 && !isOverTime;
  const isApWarning = actionPoints <= 5 && !isNoteTab;
  const sendDisabled =
    !isNoteTab && (actionPoints <= 0 || isTyping || !userInput.trim());
  const inputDisabled = !isNoteTab && (actionPoints <= 0 || isTyping);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLogs, currentSuspectId, isTyping]);

  useEffect(() => {
    if (!isTyping && actionPoints > 0) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [isTyping, currentSuspectId, actionPoints]);

  return (
    <div css={styles.root}>
      {showTimeOverModal && (
        <div css={styles.modalOverlay}>
          <div css={styles.modalCard}>
            <div css={styles.modalHeader}>
              <span css={styles.modalHeaderIcon}>⚠</span>
              <h2 css={styles.modalTitle}>긴급 타전</h2>
            </div>
            <div css={styles.modalBody}>
              <div>
                <h3 css={styles.modalSectionTitle}>⏰ 골든 타임 종료</h3>
                <p css={styles.modalText}>
                  <span css={styles.underlineBold}>제한 시간(10분)</span>이 모두
                  경과했습니다.
                  <br />
                  현장에 경찰 병력이 도착하여 현장을 통제하기 시작했습니다.
                </p>
              </div>
              <div css={styles.penaltyBox}>
                <h3 css={styles.penaltyTitle}>본부 지침 (Penalty)</h3>
                <p css={styles.modalText}>
                  수사는 계속 진행할 수 있으나,
                  <br />
                  최종 평가 등급은{" "}
                  <span css={styles.penaltyGrade}>최대 &apos;B&apos;등급</span>
                  으로 제한됩니다.
                </p>
              </div>
            </div>
            <div css={styles.modalFooter}>
              <button onClick={closeTimeOverModal} css={styles.modalButton}>
                수신 확인
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        css={styles.header}
        style={{
          paddingTop: 10 + safeArea.top,
          paddingRight: 12 + safeArea.right + 48,
          paddingLeft: 12 + safeArea.left,
        }}
      >
        <div css={styles.headerLeft}>
          <h2 css={styles.headerTitle}>{caseData.title}</h2>
          <button onClick={onGoToBriefing} css={styles.briefingLink}>
            서류 다시보기
          </button>
        </div>
        <div css={styles.headerRight}>
          <button
            onClick={toggleMute}
            css={styles.muteButton}
            aria-label={isMuted ? "음소거 해제" : "음소거"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <div
            css={[
              styles.badge,
              isOverTime ? styles.badgeDanger : styles.badgeNeutral,
              isTimerWarning && styles.badgePulse,
            ]}
          >
            <span>⏱</span>
            <span>{formatTime(timerSeconds)}</span>
          </div>
          <div
            css={[
              styles.badge,
              isApWarning ? styles.badgeDanger : styles.badgeAmber,
              isApWarning && styles.badgePulse,
            ]}
          >
            <span>⚡</span>
            <span>{actionPoints}</span>
          </div>
          <button onClick={onGoToDeduction} css={styles.deductionButton}>
            범인 지목
          </button>
        </div>
      </header>

      <div css={styles.chatArea}>
        <div css={styles.chatInner}>
          {chatLogs[currentSuspectId].map((msg, idx) => {
            if (msg.role === "system") {
              return (
                <div key={idx} css={styles.systemRow}>
                  <div css={styles.systemBubble}>{msg.text}</div>
                </div>
              );
            }
            const alignEnd = msg.role === "user" || msg.role === "note";
            return (
              <div
                key={idx}
                css={[
                  styles.msgRow,
                  { justifyContent: alignEnd ? "flex-end" : "flex-start" },
                ]}
              >
                <div
                  css={[
                    styles.bubble,
                    msg.role === "user" && styles.bubbleUser,
                    msg.role === "note" && styles.bubbleNote,
                    msg.role === "ai" && styles.bubbleAi,
                  ]}
                >
                  {msg.role === "ai" && currentSuspect && (
                    <div css={styles.bubbleHeader}>{currentSuspect.name}</div>
                  )}
                  {msg.role === "note" && (
                    <div css={styles.bubbleHeader}>📝 수사 메모</div>
                  )}
                  {msg.text}
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div css={styles.msgRow}>
              <div css={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
                <span css={[styles.typingDot, { animationDelay: "0s" }]} />
                <span css={[styles.typingDot, { animationDelay: "0.15s" }]} />
                <span css={[styles.typingDot, { animationDelay: "0.3s" }]} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div
        css={styles.bottomWrap}
        style={{ paddingBottom: safeArea.bottom }}
      >
        <div css={styles.bottomInner}>
          <div css={styles.tabs}>
            <button
              onClick={() => setCurrentSuspectId(0)}
              css={[
                styles.tabButton,
                isNoteTab && styles.tabButtonActiveNote,
              ]}
            >
              <div css={styles.tabIconWrap}>
                <span css={styles.tabIcon}>📓</span>
              </div>
              <span css={styles.tabLabel}>나</span>
              {isNoteTab && <div css={styles.tabIndicatorNote} />}
            </button>
            {caseData.suspects.map((s) => {
              const active = currentSuspectId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSuspectId(s.id)}
                  css={[
                    styles.tabButton,
                    active && styles.tabButtonActiveSuspect,
                  ]}
                >
                  <SuspectAvatar
                    image={s.portraitImage}
                    alt={s.name}
                    size={32}
                    grayscale={!active}
                  />
                  <span css={styles.tabLabel}>{s.name}</span>
                  {active && <div css={styles.tabIndicatorAmber} />}
                </button>
              );
            })}
          </div>

          <div css={styles.inputRow}>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                actionPoints <= 0 && !isNoteTab
                  ? "행동력이 소진되어 더 이상 심문할 수 없습니다."
                  : inputPlaceholder
              }
              disabled={inputDisabled}
              css={styles.input}
            />
            <button
              onClick={handleSendMessage}
              disabled={sendDisabled}
              css={[
                styles.sendButton,
                isNoteTab ? styles.sendButtonNote : styles.sendButtonSuspect,
              ]}
              aria-label="전송"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: noir.bg950,
    color: noir.text100,
    fontFamily: fonts.sans,
    overflow: "hidden",
    position: "relative",
  }),
  header: css({
    flexShrink: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "rgba(17,24,39,0.95)",
    borderBottom: `1px solid ${noir.bg800}`,
    zIndex: 20,
    gap: 8,
  }),
  headerLeft: css({
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  }),
  headerTitle: css({
    margin: 0,
    fontFamily: fonts.serif,
    fontWeight: 700,
    color: noir.amber600,
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 160,
  }),
  briefingLink: css({
    background: "none",
    border: "none",
    color: noir.text500,
    fontSize: 10,
    textDecoration: "underline",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
  }),
  headerRight: css({
    display: "flex",
    alignItems: "center",
    gap: 6,
  }),
  muteButton: css({
    background: noir.bg800,
    border: "none",
    borderRadius: "50%",
    width: 28,
    height: 28,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  }),
  badge: css({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: fonts.mono,
    fontWeight: 700,
    border: "1px solid transparent",
  }),
  badgeNeutral: css({
    backgroundColor: noir.bg800,
    color: noir.text400,
    borderColor: noir.bg700,
  }),
  badgeAmber: css({
    backgroundColor: noir.bg800,
    color: noir.amber500,
    borderColor: noir.amber800,
  }),
  badgeDanger: css({
    backgroundColor: "rgba(153,27,27,0.5)",
    color: "#fca5a5",
    borderColor: noir.red800,
  }),
  badgePulse: css({
    animation: `${pulse} 1.2s ease-in-out infinite`,
  }),
  deductionButton: css({
    backgroundColor: noir.red800,
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 2,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.05em",
    cursor: "pointer",
    "&:active": { backgroundColor: noir.red700 },
  }),
  chatArea: css({
    flex: 1,
    overflowY: "auto",
    padding: 16,
    backgroundColor: "rgba(17,24,39,0.3)",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    zIndex: 10,
  }),
  chatInner: css({
    width: "100%",
    maxWidth: 640,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }),
  msgRow: css({
    display: "flex",
    animation: `${fadeIn} 0.25s ease-out`,
  }),
  systemRow: css({
    display: "flex",
    justifyContent: "center",
    margin: "4px 0",
  }),
  systemBubble: css({
    backgroundColor: "rgba(31,41,55,0.8)",
    color: noir.text400,
    fontSize: 11,
    padding: "6px 14px",
    borderRadius: 999,
    border: `1px solid rgba(55,65,81,0.5)`,
    maxWidth: "90%",
    textAlign: "center",
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
  }),
  bubble: css({
    maxWidth: "85%",
    borderRadius: 16,
    padding: "10px 14px",
    fontSize: 13,
    lineHeight: 1.6,
    boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }),
  bubbleUser: css({
    backgroundColor: "rgba(146,64,14,0.9)",
    color: "#fff",
    borderTopRightRadius: 4,
  }),
  bubbleAi: css({
    backgroundColor: "rgba(31,41,55,0.9)",
    color: noir.text300,
    border: `1px solid ${noir.bg700}`,
    borderTopLeftRadius: 4,
  }),
  bubbleNote: css({
    backgroundColor: "rgba(55,65,81,0.9)",
    color: noir.text300,
    borderTopRightRadius: 4,
    border: `1px solid ${noir.bg600}`,
    fontStyle: "italic",
  }),
  bubbleHeader: css({
    fontSize: 10,
    color: noir.text500,
    marginBottom: 4,
    fontWeight: 700,
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    gap: 4,
  }),
  typingBubble: css({
    display: "inline-flex",
    gap: 4,
    alignItems: "center",
    padding: "10px 14px",
  }),
  typingDot: css({
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: noir.text400,
    display: "inline-block",
    animation: `${typingBlink} 1.4s infinite ease-in-out both`,
  }),
  bottomWrap: css({
    flexShrink: 0,
    backgroundColor: "rgba(17,24,39,0.95)",
    borderTop: `1px solid ${noir.bg800}`,
    zIndex: 20,
  }),
  bottomInner: css({
    width: "100%",
    maxWidth: 640,
    margin: "0 auto",
  }),
  tabs: css({
    display: "flex",
    borderBottom: `1px solid ${noir.bg800}`,
    overflowX: "auto",
  }),
  tabButton: css({
    flex: 1,
    minWidth: 70,
    background: "transparent",
    border: "none",
    padding: "10px 6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    color: noir.text500,
    position: "relative",
    "& + &": {
      borderLeft: `1px solid ${noir.bg800}`,
    },
  }),
  tabButtonActiveNote: css({
    backgroundColor: "rgba(31,41,55,0.5)",
    color: noir.text300,
  }),
  tabButtonActiveSuspect: css({
    backgroundColor: "rgba(31,41,55,0.5)",
    color: noir.amber500,
  }),
  tabIconWrap: css({
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  tabIcon: css({
    fontSize: 20,
  }),
  tabLabel: css({
    fontSize: 11,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  tabIndicatorNote: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: noir.text500,
  }),
  tabIndicatorAmber: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: noir.amber600,
  }),
  inputRow: css({
    display: "flex",
    gap: 8,
    padding: "10px 12px 16px",
  }),
  input: css({
    flex: 1,
    backgroundColor: "rgba(10,15,26,0.5)",
    border: `1px solid ${noir.bg700}`,
    borderRadius: 6,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 13,
    fontFamily: fonts.sans,
    outline: "none",
    "&::placeholder": { color: noir.text500 },
    "&:focus": { borderColor: noir.amber700 },
    "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
  }),
  sendButton: css({
    border: "none",
    borderRadius: 6,
    padding: "0 16px",
    cursor: "pointer",
    fontSize: 16,
    color: noir.amber100,
    "&:disabled": {
      backgroundColor: noir.bg800,
      color: noir.text500,
      cursor: "not-allowed",
    },
  }),
  sendButtonNote: css({
    backgroundColor: noir.bg700,
    color: noir.text300,
    "&:active": { backgroundColor: noir.bg600 },
  }),
  sendButtonSuspect: css({
    backgroundColor: noir.amber800,
    "&:active": { backgroundColor: noir.amber700 },
  }),
  modalOverlay: css({
    position: "absolute",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    animation: `${fadeIn} 0.3s ease-out`,
  }),
  modalCard: css({
    width: "100%",
    maxWidth: 380,
    backgroundColor: noir.parchment,
    color: "#111827",
    borderRadius: 2,
    overflow: "hidden",
    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
    fontFamily: fonts.serif,
  }),
  modalHeader: css({
    backgroundColor: noir.red800,
    color: "#fee2e2",
    padding: 14,
    borderBottom: `4px solid ${noir.red700}`,
    display: "flex",
    alignItems: "center",
    gap: 8,
  }),
  modalHeaderIcon: css({
    fontSize: 18,
  }),
  modalTitle: css({
    margin: 0,
    fontFamily: fonts.serif,
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  }),
  modalBody: css({
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  }),
  modalSectionTitle: css({
    margin: "0 0 8px 0",
    fontSize: 14,
    fontWeight: 700,
    color: noir.red800,
    display: "flex",
    alignItems: "center",
    gap: 6,
  }),
  modalText: css({
    margin: 0,
    fontSize: 13,
    lineHeight: 1.6,
    color: "#1f2937",
  }),
  underlineBold: css({
    fontWeight: 700,
    borderBottom: "1px solid #000",
  }),
  penaltyBox: css({
    backgroundColor: "rgba(127,29,29,0.08)",
    padding: 14,
    borderRadius: 2,
    border: "1px solid rgba(127,29,29,0.2)",
  }),
  penaltyTitle: css({
    margin: "0 0 8px 0",
    fontSize: 10,
    fontWeight: 700,
    color: noir.red700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  }),
  penaltyGrade: css({
    fontWeight: 700,
    color: noir.red700,
    textDecoration: "underline",
  }),
  modalFooter: css({
    padding: 14,
    backgroundColor: noir.parchmentDark,
    borderTop: "1px solid #d6cbb5",
  }),
  modalButton: css({
    width: "100%",
    backgroundColor: "#1f2937",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: 2,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: fonts.serif,
    "&:active": { backgroundColor: "#111827" },
  }),
};
