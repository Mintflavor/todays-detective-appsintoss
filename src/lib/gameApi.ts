/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import type { CaseData, Evaluation } from "@/types/game";
import { API_BASE_URL, fetchJson } from "./http";

interface StartResponse {
  caseData: Omit<CaseData, "scenarioId">;
  scenarioId: string;
}

// 동시 두 번 호출 방지 — 동일 페이지 라이프사이클에서 인플라이트 promise를 공유한다.
// (자동 재시도는 위험: API Gateway HTTP API의 30초 timeout으로 fetch가 끊겨도 Lambda는 계속 실행되어
//  DB에 시나리오가 저장될 수 있음 → 재시도가 새 시나리오를 만들어 고아 데이터 발생.
//  콜드 스타트는 Lambda 메모리 증설로 인프라 측에서 해결.)
let inFlightStartCase: Promise<CaseData> | null = null;

// 최근 플레이한 시나리오 _id를 디바이스에 누적해 서버에 전달한다.
// 서버는 해당 id를 $nin으로 제외하고 $sample하므로 가능한 한 새로운 사건이 나온다.
// 모든 시나리오가 제외되어 결과가 0건이면 서버가 자동으로 fallback해 제외 없이 랜덤한다.
const RECENT_SCENARIOS_KEY = "td_recentScenarioIds";
const RECENT_SCENARIOS_LIMIT = 50;

function readRecentScenarioIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SCENARIOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}

function pushRecentScenarioId(id: string) {
  if (!id) return;
  try {
    const list = readRecentScenarioIds().filter((v) => v !== id);
    list.push(id);
    const trimmed = list.slice(-RECENT_SCENARIOS_LIMIT);
    localStorage.setItem(RECENT_SCENARIOS_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage 사용 불가(시크릿 모드 등) 시 조용히 무시
  }
}

export async function startCase(): Promise<CaseData> {
  if (inFlightStartCase) return inFlightStartCase;

  const run = (async () => {
    const excludeIds = readRecentScenarioIds();
    const data = await fetchJson<StartResponse>(
      `${API_BASE_URL}/api/game/start`,
      { method: "POST", json: { excludeIds } },
    );
    if (!data?.caseData) {
      throw new Error("Invalid Case Data Structure");
    }
    pushRecentScenarioId(data.scenarioId);
    return { ...data.caseData, scenarioId: data.scenarioId };
  })();

  inFlightStartCase = run;
  try {
    return await run;
  } finally {
    inFlightStartCase = null;
  }
}

interface ChatResponse {
  reply: string;
}

export async function chatWithSuspect(params: {
  scenarioId: string;
  suspectId: number;
  message: string;
  history: string;
}): Promise<string> {
  const data = await fetchJson<ChatResponse>(
    `${API_BASE_URL}/api/game/chat`,
    { method: "POST", json: params },
  );
  return data.reply;
}

interface EvaluateResponse {
  isCorrect: boolean;
  report: string;
  advice: string;
  grade: string;
  truth: string;
  culpritName: string;
}

export async function evaluateCase(params: {
  scenarioId: string;
  deductionData: {
    culpritName: string;
    reasoning: string;
    isOverTime: boolean;
  };
}): Promise<Evaluation> {
  const data = await fetchJson<EvaluateResponse>(
    `${API_BASE_URL}/api/game/evaluate`,
    { method: "POST", json: params },
  );

  return {
    isCorrect: data.isCorrect,
    report: data.report,
    advice: data.advice,
    grade: data.grade,
    truth: data.truth,
    culpritName: data.culpritName,
    timeTaken: "",
  };
}
