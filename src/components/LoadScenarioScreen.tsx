/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

import { getScenarioDetail, getScenarios } from "@/lib/api";
import type { ScenarioListItem } from "@/lib/api";
import { fonts, noir } from "@/styles/theme";
import type { CaseData } from "@/types/game";

interface LoadScenarioScreenProps {
  onLoad: (data: CaseData) => void;
  onBack: () => void;
}

const CRIME_TYPES: { value: string; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "살인", label: "살인" },
  { value: "방화", label: "방화" },
  { value: "납치", label: "납치" },
  { value: "강도", label: "강도" },
  { value: "절도", label: "절도" },
];

export default function LoadScenarioScreen({
  onLoad,
  onBack,
}: LoadScenarioScreenProps) {
  const [scenarios, setScenarios] = useState<ScenarioListItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCrimeType, setFilterCrimeType] = useState<string>("ALL");

  useEffect(() => {
    fetchScenarios(page, filterCrimeType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterCrimeType]);

  const fetchScenarios = async (pageNum: number, crimeType: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getScenarios(pageNum, 10, crimeType);
      setScenarios(data);
    } catch {
      setError("사건 기록을 불러올 수 없습니다. 서버 상태를 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioClick = async (id: string) => {
    setLoading(true);
    try {
      const caseData = await getScenarioDetail(id);
      onLoad({ ...caseData, scenarioId: id });
    } catch {
      setError("사건 파일을 여는 데 실패했습니다.");
      setLoading(false);
    }
  };

  return (
    <div css={styles.root}>
      <div css={styles.backdrop} />

      <header css={styles.header}>
        <button onClick={onBack} css={styles.backButton}>
          ← 뒤로가기
        </button>
        <h1 css={styles.title}>수사 자료실</h1>
        <div css={styles.filterWrap}>
          <span css={styles.filterLabel}>🗂</span>
          <select
            value={filterCrimeType}
            onChange={(e) => {
              setFilterCrimeType(e.target.value);
              setPage(1);
            }}
            css={styles.filterSelect}
          >
            {CRIME_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div css={styles.contentArea}>
        {error && <div css={styles.errorBox}>{error}</div>}

        {loading && scenarios.length === 0 ? (
          <div css={styles.emptyText}>문서고를 뒤지는 중...</div>
        ) : scenarios.length === 0 ? (
          <div css={styles.emptyText}>해당 조건의 사건 기록이 없습니다.</div>
        ) : (
          <div css={styles.list}>
            {scenarios.map((scenario) => (
              <button
                key={scenario._id}
                onClick={() => handleScenarioClick(scenario._id)}
                css={styles.card}
              >
                <div css={styles.cardAccent} />
                <div css={styles.cardHeader}>
                  <h3 css={styles.cardTitle}>📂 {scenario.title}</h3>
                  <span css={styles.cardDate}>
                    {new Date(scenario.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p css={styles.cardSummary}>{scenario.summary}</p>
                <div css={styles.cardFooter}>
                  <span
                    css={[
                      styles.crimeTag,
                      scenario.crime_type === "살인"
                        ? styles.crimeTagMurder
                        : styles.crimeTagDefault,
                    ]}
                  >
                    {scenario.crime_type}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div css={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          css={styles.pageButton}
        >
          ← 이전
        </button>
        <span css={styles.pageIndicator}>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={scenarios.length < 10 || loading}
          css={styles.pageButton}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}

const styles = {
  root: css({
    minHeight: "100vh",
    backgroundColor: noir.bg900,
    color: noir.text100,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: fonts.serif,
    position: "relative",
  }),
  backdrop: css({
    position: "absolute",
    inset: 0,
    opacity: 0.4,
    backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    zIndex: 0,
  }),
  header: css({
    width: "100%",
    maxWidth: 640,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: `1px solid ${noir.bg700}`,
    zIndex: 1,
  }),
  backButton: css({
    background: "none",
    border: "none",
    color: noir.text400,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: fonts.serif,
    padding: 4,
    "&:active": { color: noir.amber500 },
  }),
  title: css({
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: noir.amber600,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  }),
  filterWrap: css({
    display: "flex",
    alignItems: "center",
    gap: 4,
  }),
  filterLabel: css({
    color: noir.text500,
    fontSize: 14,
  }),
  filterSelect: css({
    backgroundColor: noir.bg800,
    color: noir.text300,
    border: `1px solid ${noir.bg700}`,
    fontSize: 12,
    padding: "4px 6px",
    borderRadius: 2,
    fontFamily: fonts.serif,
    cursor: "pointer",
    "&:focus": { outline: "none", borderColor: noir.amber600 },
  }),
  contentArea: css({
    width: "100%",
    maxWidth: 640,
    flex: 1,
    zIndex: 1,
  }),
  errorBox: css({
    backgroundColor: "rgba(127,29,29,0.3)",
    border: `1px solid ${noir.red700}`,
    color: "#fecaca",
    padding: 12,
    borderRadius: 2,
    marginBottom: 12,
    textAlign: "center",
    fontSize: 13,
  }),
  emptyText: css({
    textAlign: "center",
    color: noir.text500,
    padding: "60px 0",
    fontSize: 14,
  }),
  list: css({
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }),
  card: css({
    width: "100%",
    backgroundColor: noir.bg800,
    border: `1px solid ${noir.bg700}`,
    padding: 16,
    textAlign: "left",
    borderRadius: 2,
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    fontFamily: fonts.serif,
    color: noir.text100,
    "&:active": { backgroundColor: noir.bg700 },
  }),
  cardAccent: css({
    position: "absolute",
    top: 0,
    left: 0,
    width: 3,
    height: "100%",
    backgroundColor: noir.amber700,
  }),
  cardHeader: css({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
    paddingLeft: 10,
  }),
  cardTitle: css({
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: noir.text300,
    display: "flex",
    alignItems: "center",
    gap: 6,
  }),
  cardDate: css({
    fontSize: 10,
    color: noir.text500,
    fontFamily: fonts.mono,
    flexShrink: 0,
  }),
  cardSummary: css({
    margin: 0,
    fontSize: 12,
    color: noir.text400,
    paddingLeft: 10,
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  }),
  cardFooter: css({
    marginTop: 10,
    paddingLeft: 10,
  }),
  crimeTag: css({
    display: "inline-block",
    fontSize: 9,
    padding: "2px 6px",
    borderRadius: 2,
    border: "1px solid",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  }),
  crimeTagMurder: css({
    backgroundColor: "rgba(127,29,29,0.3)",
    borderColor: noir.red800,
    color: "#f87171",
  }),
  crimeTagDefault: css({
    backgroundColor: noir.bg900,
    borderColor: noir.bg700,
    color: noir.text500,
  }),
  pagination: css({
    marginTop: 24,
    marginBottom: 16,
    display: "flex",
    gap: 12,
    alignItems: "center",
    zIndex: 1,
  }),
  pageButton: css({
    padding: "8px 14px",
    backgroundColor: noir.bg800,
    color: noir.text300,
    border: `1px solid ${noir.bg600}`,
    borderRadius: 2,
    fontSize: 12,
    fontFamily: fonts.serif,
    cursor: "pointer",
    "&:disabled": { opacity: 0.4, cursor: "not-allowed" },
    "&:active:not(:disabled)": { backgroundColor: noir.bg700 },
  }),
  pageIndicator: css({
    fontFamily: fonts.mono,
    fontSize: 12,
    color: noir.text500,
  }),
};
