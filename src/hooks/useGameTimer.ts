/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import { useEffect, useState } from "react";

interface UseGameTimerProps {
  initialSeconds: number;
  isActive: boolean;
  onTimeUp: () => void;
}

interface UseGameTimerReturn {
  timerSeconds: number;
  isOverTime: boolean;
  resetTimer: () => void;
}

export default function useGameTimer({
  initialSeconds,
  isActive,
  onTimeUp,
}: UseGameTimerProps): UseGameTimerReturn {
  const [timerSeconds, setTimerSeconds] = useState<number>(initialSeconds);
  const [isOverTime, setIsOverTime] = useState<boolean>(false);

  useEffect(() => {
    if (!isActive || timerSeconds <= 0) return;

    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsOverTime(true);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isActive, timerSeconds, onTimeUp]);

  const resetTimer = () => {
    setTimerSeconds(initialSeconds);
    setIsOverTime(false);
  };

  return { timerSeconds, isOverTime, resetTimer };
}
