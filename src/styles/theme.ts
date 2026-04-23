/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
// 원본의 noir 탐정 테마(amber + dark gray)를 유지하기 위한 색상 토큰
export const noir = {
  bg900: "#111827",
  bg950: "#0a0f1a",
  bg800: "#1f2937",
  bg700: "#374151",
  bg600: "#4b5563",
  text100: "#f3f4f6",
  text300: "#d1d5db",
  text400: "#9ca3af",
  text500: "#6b7280",
  amber500: "#f59e0b",
  amber600: "#d97706",
  amber700: "#b45309",
  amber800: "#92400e",
  amber100: "#fef3c7",
  red500: "#ef4444",
  red600: "#dc2626",
  red700: "#b91c1c",
  red800: "#991b1b",
  parchment: "#f0e6d2",
  parchmentDark: "#e6dbc5",
  green700: "#15803d",
  green800: "#166534",
} as const;

export const fonts = {
  serif: `"Nanum Myeongjo", "Noto Serif KR", Georgia, serif`,
  sans: `"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif`,
  mono: `"JetBrains Mono", "Courier New", monospace`,
} as const;
