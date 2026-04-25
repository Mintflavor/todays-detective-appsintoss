/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */

// 토스앱 네이티브 뒤로가기 버튼 인터셉트용 훅.
// `@apps-in-toss/web-framework` v2.4.x의 web 빌드에는 `useBackEvent`가 export되지 않으므로
// (해당 훅은 React Native/Granite native 전용) web 환경에선 no-op로 처리한다.
// 추후 SDK가 web 빌드에서도 백 이벤트를 노출하거나 native 빌드로 전환할 때 실제 구현으로 교체.
export default function useBackHandler(_handler: () => void, _enabled = true) {
  // no-op (web)
}
