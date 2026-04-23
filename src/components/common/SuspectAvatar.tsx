/*
 * 작성자 : 박현일
 * 이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.
 *
 * Author: Hyunil Park
 * Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).
 */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { noir } from "@/styles/theme";

interface SuspectAvatarProps {
  image?: string;
  alt: string;
  size?: number;
  shape?: "circle" | "square";
  grayscale?: boolean;
}

export function resolvePortrait(image?: string): string | null {
  if (!image) return null;
  return image.startsWith("http") ? image : `data:image/jpeg;base64,${image}`;
}

export default function SuspectAvatar({
  image,
  alt,
  size = 48,
  shape = "circle",
  grayscale = false,
}: SuspectAvatarProps) {
  const src = resolvePortrait(image);
  const borderRadius = shape === "circle" ? "50%" : 0;

  return (
    <div
      css={[
        styles.root,
        {
          width: size,
          height: size,
          borderRadius,
        },
      ]}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          css={[
            styles.img,
            grayscale && { filter: "grayscale(1) contrast(1.25)" },
          ]}
        />
      ) : (
        <span css={styles.placeholder}>👤</span>
      )}
    </div>
  );
}

const styles = {
  root: css({
    flexShrink: 0,
    backgroundColor: noir.bg700,
    border: `1px solid ${noir.bg600}`,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  }),
  img: css({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  }),
  placeholder: css({
    fontSize: "1.4em",
    color: noir.text400,
  }),
};
