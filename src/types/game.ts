/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
export interface Suspect {
  id: number;
  name: string;
  role: string;
  gender?: "Male" | "Female" | "Unknown";
  age?: number;
  portraitImage?: string;
  image_prompt_keywords?: string;
  personality: string;
  secret: string;
  isCulprit: boolean;
  real_action?: string;
  alibi_claim?: string;
  motive?: string;
  trick?: string;
}

export interface VictimInfo {
  name: string;
  damage_details: string;
  body_condition: string;
  incident_time: string;
}

export interface Evidence {
  name: string;
  description: string;
}

export interface WorldSetting {
  location: string;
  weather: string;
}

export interface CaseData {
  title: string;
  summary: string;
  crime_type: string;
  world_setting: WorldSetting;
  timeline_truth: string[];
  victim_info: VictimInfo;
  evidence_list: Evidence[];
  suspects: Suspect[];
  solution: string;
  scenarioId?: string;
  caseNumber?: string;
}

export interface ChatMessage {
  role: "user" | "ai" | "system" | "note";
  text: string;
}

export interface ChatLogs {
  [key: number]: ChatMessage[];
}

export interface DeductionInput {
  culpritId: number | null;
  reasoning: string;
}

export interface Evaluation {
  isCorrect: boolean;
  report: string;
  advice: string;
  grade: string;
  truth: string;
  culpritName: string;
  culpritImage?: string;
  timeTaken: string;
  caseNumber?: string;
}

export type GamePhase =
  | "intro"
  | "load_menu"
  | "tutorial"
  | "loading"
  | "briefing"
  | "investigation"
  | "deduction"
  | "resolution";

export type LoadingType = "case" | "deduction";
