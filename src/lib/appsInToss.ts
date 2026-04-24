/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import {
  Analytics,
  getUserKeyForGame,
  setScreenAwakeMode,
  share,
} from "@apps-in-toss/web-framework";

// 앱 최초 부팅 시 1회 호출되는 Analytics 초기화
// 샌드박스/QR 환경에서는 이벤트가 수집되지 않고, 라이브 환경에서만 실제 집계됨
let analyticsInitialized = false;
export function initAnalyticsOnce() {
  if (analyticsInitialized) return;
  try {
    Analytics.init({});
    analyticsInitialized = true;
  } catch (e) {
    // 샌드박스/웹 환경에서 브릿지 미연결일 수 있음
    console.warn("[Analytics] init skipped:", e);
  }
}

// 게임 미니앱 전용 유저 식별자. 토스앱 5.232.0 미만 또는 비게임 미니앱이면 null 반환
export async function fetchGameUserKey(): Promise<string | null> {
  try {
    const result = await getUserKeyForGame();
    if (!result) return null;
    if (result === "INVALID_CATEGORY" || result === "ERROR") return null;
    if (result.type === "HASH") return result.hash;
    return null;
  } catch (e) {
    console.warn("[getUserKeyForGame] failed:", e);
    return null;
  }
}

// 수사 결과 공유 — 범인·등급·소요시간 요약
export async function shareResolution(args: {
  title: string;
  grade?: string;
  culpritName?: string;
  timeTaken?: string;
}): Promise<boolean> {
  const { title, grade, culpritName, timeTaken } = args;
  const lines = [
    "🕵️ 오늘의 탐정",
    `📁 ${title}`,
    culpritName && `👤 지목한 범인: ${culpritName}`,
    grade && `🏅 등급: ${grade}`,
    timeTaken && `⏱ 소요시간: ${timeTaken}`,
    "",
    "토스에서 '오늘의 탐정'으로 수사를 시작해보세요.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await share({ message: lines });
    return true;
  } catch (e) {
    console.warn("[share] failed:", e);
    return false;
  }
}

// 특정 화면에서 화면 꺼짐 방지. 진입 시 enable, 이탈 시 disable
export async function setAwake(enabled: boolean) {
  try {
    await setScreenAwakeMode({ enabled });
  } catch (e) {
    console.warn("[setScreenAwakeMode] failed:", e);
  }
}
