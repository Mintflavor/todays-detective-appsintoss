/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import { SafeAreaInsets } from "@apps-in-toss/web-framework";
import { useEffect, useState } from "react";

export interface SafeAreaInsetsValue {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const FALLBACK: SafeAreaInsetsValue = { top: 0, bottom: 0, left: 0, right: 0 };

export default function useSafeArea(): SafeAreaInsetsValue {
  const [insets, setInsets] = useState<SafeAreaInsetsValue>(() => {
    try {
      return SafeAreaInsets.get();
    } catch {
      return FALLBACK;
    }
  });

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    try {
      cleanup = SafeAreaInsets.subscribe({
        onEvent: (next: SafeAreaInsetsValue) => setInsets(next),
      });
    } catch {
      // 브라우저/샌드박스 환경에서 실패할 수 있음 — 초기값 유지
    }
    return () => {
      cleanup?.();
    };
  }, []);

  return insets;
}
