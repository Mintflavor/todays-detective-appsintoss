/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import { useBackEvent } from "@apps-in-toss/web-framework";
import { useEffect } from "react";

// 토스앱 네이티브 뒤로가기 버튼을 컴포넌트 단위로 인터셉트
// enabled=true일 때만 등록되고, 콜백이 호출되면 기본 뒤로가기 동작은 차단됨
// useBackEvent는 브라우저 환경에서도 안전하게 no-op 컨트롤러를 반환해야 정상
export default function useBackHandler(handler: () => void, enabled = true) {
  const backEvent = useBackEvent();

  useEffect(() => {
    if (!enabled || !backEvent) return;
    backEvent.addEventListener(handler);
    return () => {
      backEvent.removeEventListener(handler);
    };
  }, [backEvent, handler, enabled]);
}
