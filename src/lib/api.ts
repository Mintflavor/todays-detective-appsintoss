/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import type { CaseData } from "@/types/game";
import { API_BASE_URL, fetchJson } from "./http";

export interface ScenarioListItem {
  _id: string;
  title: string;
  summary: string;
  crime_type: string;
  created_at: string;
}

export interface FeedbackGameResult {
  scenarioTitle?: string;
  selectedSuspectId?: number | null;
  selectedSuspectName?: string | null;
  reasoning?: string;
  isCorrect?: boolean;
  grade?: string;
  culpritName?: string;
  report?: string;
  advice?: string;
  timeTaken?: string;
}

export interface FeedbackItem {
  _id: string;
  content: string;
  scenario_id?: string | null;
  grade?: string | null;
  created_at: string;
  game_result?: FeedbackGameResult | null;
}

export interface SubmitFeedbackPayload {
  content: string;
  scenarioId?: string;
  grade?: string;
  gameResult?: FeedbackGameResult;
}

// --- Scenarios ---

export async function getScenarios(
  page = 1,
  limit = 10,
  crimeType?: string,
): Promise<ScenarioListItem[]> {
  let url = `${API_BASE_URL}/scenarios/?page=${page}&limit=${limit}`;
  if (crimeType && crimeType !== "ALL") {
    url += `&crime_type=${encodeURIComponent(crimeType)}`;
  }
  return fetchJson<ScenarioListItem[]>(url);
}

export async function getScenarioDetail(id: string): Promise<CaseData> {
  return fetchJson<CaseData>(`${API_BASE_URL}/api/game/scenario/${id}`, {
    cache: "no-store",
  });
}

export async function getScenarioDetailFull(id: string): Promise<CaseData> {
  const data = await fetchJson<{ case_data: CaseData }>(
    `${API_BASE_URL}/scenarios/${id}`,
  );
  return data.case_data;
}

export async function deleteScenario(id: string): Promise<void> {
  await fetchJson<unknown>(`${API_BASE_URL}/scenarios/${id}`, {
    method: "DELETE",
  });
}

// --- Feedbacks ---

export async function submitFeedback(
  payload: SubmitFeedbackPayload,
): Promise<void> {
  await fetchJson<unknown>(`${API_BASE_URL}/api/game/feedback`, {
    method: "POST",
    json: payload,
  });
}

export async function getFeedbacks(
  page = 1,
  limit = 10,
): Promise<FeedbackItem[]> {
  return fetchJson<FeedbackItem[]>(
    `${API_BASE_URL}/feedbacks/?page=${page}&limit=${limit}`,
  );
}

export async function deleteFeedback(id: string): Promise<void> {
  await fetchJson<unknown>(`${API_BASE_URL}/feedbacks/${id}`, {
    method: "DELETE",
  });
}
