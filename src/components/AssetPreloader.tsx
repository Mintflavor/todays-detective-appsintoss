/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const ASSETS = [
  `${import.meta.env.BASE_URL}images/main_lobby_background.webp`,
  `${import.meta.env.BASE_URL}images/confidential_background.webp`,
  `${import.meta.env.BASE_URL}images/suspect_background.webp`,
  `${import.meta.env.BASE_URL}images/papers_background.webp`,
];

export default function AssetPreloader() {
  return (
    <div css={styles.root} aria-hidden="true">
      {ASSETS.map((src) => (
        <img key={src} src={src} alt="" css={styles.img} />
      ))}
    </div>
  );
}

const styles = {
  root: css({
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    opacity: 0,
    zIndex: -1,
  }),
  img: css({
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }),
};
