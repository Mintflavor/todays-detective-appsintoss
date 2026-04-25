/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";

import SuspectAvatar from "@/components/common/SuspectAvatar";
import { fonts, noir } from "@/styles/theme";
import type { CaseData } from "@/types/game";

interface BriefingScreenProps {
  caseData: CaseData;
  onStartInvestigation: () => void;
  onBack?: () => void;
  ctaLabel?: string;
}

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function BriefingScreen({
  caseData,
  onStartInvestigation,
  onBack,
  ctaLabel = "수사 시작 →",
}: BriefingScreenProps) {
  const reportTitle =
    caseData.crime_type === "살인" ? "Autopsy Report" : "Incident Report";

  return (
    <div css={styles.root}>
      <div css={styles.card}>
        <header css={styles.header}>
          <div css={styles.headerLeft}>
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
            <div>
              <span css={styles.topSecret}>TOP SECRET</span>
              <h2 css={styles.title}>{caseData.title}</h2>
            </div>
          </div>
          <div css={styles.stampMark}>⚠</div>
        </header>

        <section css={styles.section}>
          <h3 css={styles.sectionTitle}>📄 Case Summary</h3>
          <p css={styles.summary}>{caseData.summary}</p>
        </section>

        <section css={styles.section}>
          <h3 css={styles.sectionTitle}>💀 {reportTitle}</h3>
          <div css={styles.infoBox}>
            <Row label="Name" value={caseData.victim_info.name} />
            <Row
              label="Time of Incident"
              value={caseData.victim_info.incident_time}
            />
            <Block
              label="Details"
              value={caseData.victim_info.damage_details}
            />
            <Block
              label="Scene Condition"
              value={caseData.victim_info.body_condition}
            />
          </div>
        </section>

        <section css={styles.section}>
          <h3 css={styles.sectionTitle}>🔬 Initial Evidence</h3>
          <div css={styles.evidenceList}>
            {caseData.evidence_list.map((item, idx) => (
              <div key={idx} css={styles.evidenceItem}>
                <div css={styles.evidenceBar} />
                <div>
                  <div css={styles.evidenceName}>{item.name}</div>
                  <div css={styles.evidenceDesc}>{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section css={styles.section}>
          <h3 css={styles.sectionTitle}>👥 Suspect List</h3>
          <div css={styles.suspectGrid}>
            {caseData.suspects.map((s) => (
              <div key={s.id} css={styles.suspectCard}>
                <SuspectAvatar image={s.portraitImage} alt={s.name} size={48} />
                <div>
                  <div css={styles.suspectName}>{s.name}</div>
                  <div css={styles.suspectRole}>
                    {s.role} | {s.personality}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div css={styles.ctaWrap}>
          <button onClick={onStartInvestigation} css={styles.ctaButton}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div css={styles.row}>
      <span css={styles.rowLabel}>{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div css={styles.block}>
      <span css={styles.rowLabel}>{label}:</span>
      <p css={styles.blockBody}>{value}</p>
    </div>
  );
}

const styles = {
  root: css({
    minHeight: "100vh",
    padding: 16,
    backgroundColor: noir.bg900,
    color: "#1f2937",
    fontFamily: fonts.serif,
  }),
  card: css({
    maxWidth: 640,
    margin: "16px auto 32px",
    backgroundColor: "#eaddcf",
    borderRadius: 2,
    boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
    padding: 28,
    animation: `${fadeInUp} 0.5s ease-out`,
  }),
  header: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "2px solid #1f2937",
    paddingBottom: 16,
    marginBottom: 24,
  }),
  headerLeft: css({
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
    minWidth: 0,
  }),
  backButton: css({
    background: "transparent",
    border: 0,
    color: "#1f2937",
    fontSize: 22,
    lineHeight: 1,
    padding: "2px 6px",
    marginTop: 2,
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
    "&:active": { opacity: 0.5 },
  }),
  topSecret: css({
    backgroundColor: noir.red800,
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.25em",
    padding: "4px 8px",
    textTransform: "uppercase",
  }),
  title: css({
    fontSize: 24,
    fontWeight: 700,
    marginTop: 8,
    color: "#111827",
    lineHeight: 1.2,
  }),
  stampMark: css({
    width: 48,
    height: 48,
    border: "2px dashed #9ca3af",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    opacity: 0.4,
    transform: "rotate(12deg)",
  }),
  section: css({ marginBottom: 32 }),
  sectionTitle: css({
    fontSize: 11,
    fontWeight: 700,
    color: "#6b7280",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    marginBottom: 12,
  }),
  summary: css({
    fontSize: 16,
    lineHeight: 1.6,
    fontWeight: 500,
    color: "#1f2937",
    borderLeft: `4px solid rgba(146,64,14,0.3)`,
    paddingLeft: 16,
    margin: 0,
  }),
  infoBox: css({
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 16,
    borderRadius: 2,
    border: "1px solid rgba(0,0,0,0.1)",
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  }),
  row: css({
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    paddingBottom: 4,
  }),
  rowLabel: css({ fontWeight: 700, color: "#374151" }),
  block: css({ display: "flex", flexDirection: "column", gap: 4 }),
  blockBody: css({ paddingLeft: 8, margin: 0, color: "#1f2937" }),
  evidenceList: css({ display: "flex", flexDirection: "column", gap: 8 }),
  evidenceItem: css({
    backgroundColor: "rgba(255,255,255,0.5)",
    padding: 12,
    borderRadius: 2,
    border: "1px solid rgba(0,0,0,0.05)",
    display: "flex",
    gap: 12,
    alignItems: "stretch",
  }),
  evidenceBar: css({
    width: 4,
    backgroundColor: noir.amber800,
    borderRadius: 2,
    flexShrink: 0,
  }),
  evidenceName: css({ fontWeight: 700, fontSize: 14, color: "#111827" }),
  evidenceDesc: css({ fontSize: 12, color: "#4b5563" }),
  suspectGrid: css({ display: "flex", flexDirection: "column", gap: 12 }),
  suspectCard: css({
    display: "flex",
    alignItems: "center",
    gap: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 16,
    borderRadius: 2,
    border: "1px solid rgba(0,0,0,0.1)",
  }),
  suspectName: css({ fontWeight: 700, fontSize: 16, color: "#111827" }),
  suspectRole: css({ fontSize: 12, color: "#4b5563", fontStyle: "italic" }),
  ctaWrap: css({
    position: "sticky",
    bottom: 16,
    marginTop: 40,
  }),
  ctaButton: css({
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "#111827",
    color: "#eaddcf",
    fontFamily: fonts.serif,
    fontWeight: 700,
    fontSize: 16,
    border: "1px solid #374151",
    borderRadius: 2,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 20px 25px rgba(0,0,0,0.3)",
    "&:active": { backgroundColor: "#000" },
  }),
};
