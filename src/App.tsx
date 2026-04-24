/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
import { useCallback, useEffect } from "react";

import AssetPreloader from "@/components/AssetPreloader";
import BriefingScreen from "@/components/BriefingScreen";
import DeductionScreen from "@/components/DeductionScreen";
import ErrorModal from "@/components/ErrorModal";
import IntroScreen from "@/components/IntroScreen";
import InvestigationScreen from "@/components/InvestigationScreen";
import LoadingScreen from "@/components/LoadingScreen";
import LoadScenarioScreen from "@/components/LoadScenarioScreen";
import ResolutionScreen from "@/components/ResolutionScreen";
import TutorialModal from "@/components/TutorialModal";
import useBackHandler from "@/hooks/useBackHandler";
import useGameEngine from "@/hooks/useGameEngine";
import useScreenAwake from "@/hooks/useScreenAwake";
import { fetchGameUserKey, initAnalyticsOnce } from "@/lib/appsInToss";

export default function App() {
  useEffect(() => {
    initAnalyticsOnce();
    // 게임 유저 식별자 사전 조회 — Step 7에서 백엔드 요청 payload에 동봉 예정
    fetchGameUserKey().then((key) => {
      if (key) sessionStorage.setItem("td_userKey", key);
    });
  }, []);
  const {
    phase,
    setPhase,
    caseData,
    currentSuspectId,
    setCurrentSuspectId,
    chatLogs,
    actionPoints,
    evaluation,
    userInput,
    isTyping,
    loadingText,
    inputPlaceholder,
    deductionInput,
    setDeductionInput,
    isMuted,
    toggleMute,
    showTimeOverModal,
    closeTimeOverModal,
    errorMsg,
    setErrorMsg,
    retryAction,
    audioRef,
    timerSeconds,
    isOverTime,
    handleStartGame,
    handleTutorialComplete,
    handleSendMessage,
    submitDeduction,
    resetGame,
    handleInputChange,
    handleKeyDown,
    goToLoadMenu,
    handleLoadGame,
  } = useGameEngine();

  // 수사(investigation) 중에는 화면이 꺼지지 않도록 유지
  useScreenAwake(phase === "investigation");

  // 페이즈별 네이티브 뒤로가기 처리. 콜백이 실행되면 토스앱 기본 뒤로가기(종료)는 차단됨
  const handleBack = useCallback(() => {
    if (phase === "load_menu") {
      setPhase("intro");
      return;
    }
    if (phase === "briefing") {
      setPhase("intro");
      return;
    }
    if (phase === "investigation") {
      setPhase("briefing");
      return;
    }
    if (phase === "deduction") {
      setPhase("investigation");
      return;
    }
    if (phase === "resolution") {
      resetGame();
      return;
    }
    // intro/tutorial/loading: 핸들러에서 아무것도 하지 않으면 기본 뒤로가기(앱 종료 등)가 동작
  }, [phase, setPhase, resetGame]);

  // intro/tutorial/loading 페이즈는 네이티브 기본 동작을 유지하도록 enabled=false
  useBackHandler(
    handleBack,
    phase !== "intro" && phase !== "tutorial" && phase !== "loading",
  );

  return (
    <>
      <AssetPreloader />

      <ErrorModal
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        onRetry={retryAction}
      />

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}bgm/Cold_Coffee_at_Three_compressed.mp3`}
        loop
        preload="auto"
      />

      {phase === "intro" && (
        <IntroScreen
          onStart={handleStartGame}
          onLoadGame={goToLoadMenu}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}

      {phase === "load_menu" && (
        <LoadScenarioScreen
          onLoad={handleLoadGame}
          onBack={() => setPhase("intro")}
        />
      )}

      {phase === "tutorial" && (
        <TutorialModal onComplete={handleTutorialComplete} />
      )}

      {phase === "loading" && <LoadingScreen loadingText={loadingText} />}

      {phase === "briefing" && caseData && (
        <BriefingScreen
          caseData={caseData}
          onStartInvestigation={() => setPhase("investigation")}
        />
      )}

      {phase === "investigation" && caseData && (
        <InvestigationScreen
          caseData={caseData}
          currentSuspectId={currentSuspectId}
          setCurrentSuspectId={setCurrentSuspectId}
          chatLogs={chatLogs}
          actionPoints={actionPoints}
          timerSeconds={timerSeconds}
          isOverTime={isOverTime}
          showTimeOverModal={showTimeOverModal}
          closeTimeOverModal={closeTimeOverModal}
          userInput={userInput}
          handleInputChange={handleInputChange}
          handleKeyDown={handleKeyDown}
          handleSendMessage={handleSendMessage}
          inputPlaceholder={inputPlaceholder}
          isTyping={isTyping}
          isMuted={isMuted}
          toggleMute={toggleMute}
          onGoToBriefing={() => setPhase("briefing")}
          onGoToDeduction={() => setPhase("deduction")}
        />
      )}

      {phase === "deduction" && caseData && (
        <DeductionScreen
          caseData={caseData}
          deductionInput={deductionInput}
          setDeductionInput={setDeductionInput}
          onSubmit={submitDeduction}
          onBack={() => setPhase("investigation")}
        />
      )}

      {phase === "resolution" && evaluation && caseData && (
        <ResolutionScreen
          evaluation={evaluation}
          caseData={caseData}
          deductionInput={deductionInput}
          onReset={resetGame}
        />
      )}
    </>
  );
}
