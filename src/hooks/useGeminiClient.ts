/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import { useState } from "react";

import { chatWithSuspect, evaluateCase, startCase } from "@/lib/gameApi";
import type { CaseData, Evaluation } from "@/types/game";

interface UseGeminiClientReturn {
  errorMsg: string | null;
  setErrorMsg: (msg: string | null) => void;
  retryAction: (() => void) | null;
  setRetryAction: (action: (() => void) | null) => void;
  generateCase: () => Promise<CaseData>;
  interrogateSuspect: (
    scenarioId: string,
    suspectId: number,
    history: string,
    userMsg: string,
  ) => Promise<string>;
  evaluateDeduction: (
    scenarioId: string,
    culpritName: string,
    reasoning: string,
    isOverTime: boolean,
  ) => Promise<Evaluation>;
}

export default function useGeminiClient(): UseGeminiClientReturn {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  const withErrorHandling = async <T>(
    action: () => Promise<T>,
    failMessage: string,
    retryCallback: () => void,
  ): Promise<T> => {
    try {
      setErrorMsg(null);
      setRetryAction(null);
      return await action();
    } catch (e) {
      console.error("Gemini Client Error:", e);
      setErrorMsg(failMessage);
      setRetryAction(() => retryCallback);
      throw e;
    }
  };

  const generateCase = (): Promise<CaseData> =>
    withErrorHandling(
      () => startCase(),
      "사건 파일을 불러오는데 실패했습니다.",
      generateCase,
    );

  const interrogateSuspect = (
    scenarioId: string,
    suspectId: number,
    history: string,
    userMsg: string,
  ): Promise<string> =>
    withErrorHandling(
      () =>
        chatWithSuspect({
          scenarioId,
          suspectId,
          message: userMsg,
          history,
        }),
      "용의자와의 통신이 불안정합니다. 다시 시도해주세요.",
      () => interrogateSuspect(scenarioId, suspectId, history, userMsg),
    );

  const evaluateDeduction = (
    scenarioId: string,
    culpritName: string,
    reasoning: string,
    isOverTime: boolean,
  ): Promise<Evaluation> =>
    withErrorHandling(
      () =>
        evaluateCase({
          scenarioId,
          deductionData: { culpritName, reasoning, isOverTime },
        }),
      "추리 평가 중 오류가 발생했습니다.",
      () => evaluateDeduction(scenarioId, culpritName, reasoning, isOverTime),
    );

  return {
    errorMsg,
    setErrorMsg,
    retryAction,
    setRetryAction,
    generateCase,
    interrogateSuspect,
    evaluateDeduction,
  };
}
