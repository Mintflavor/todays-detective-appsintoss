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

export async function startCase(): Promise<CaseData> {
  const data = await fetchJson<StartResponse>(`${API_BASE_URL}/api/game/start`, {
    method: "POST",
  });

  if (!data?.caseData) {
    throw new Error("Invalid Case Data Structure");
  }

  return { ...data.caseData, scenarioId: data.scenarioId };
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
