/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import { useEffect } from "react";

import { setAwake } from "@/lib/appsInToss";

// 특정 화면에서 화면 꺼짐을 방지한다. 언마운트(또는 active=false 전환) 시 자동 복구
export default function useScreenAwake(active: boolean) {
  useEffect(() => {
    if (!active) return;
    setAwake(true);
    return () => {
      setAwake(false);
    };
  }, [active]);
}
