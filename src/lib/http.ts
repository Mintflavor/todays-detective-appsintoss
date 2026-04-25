/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type FetchOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
};

export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { json, headers, ...rest } = options;
  const init: RequestInit = {
    ...rest,
    headers: {
      ...(json != null ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json != null ? JSON.stringify(json) : (rest as RequestInit).body,
  };

  const response = await fetch(url, init);
  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && "error" in data
        ? String((data as { error: unknown }).error)
        : undefined) ?? `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
