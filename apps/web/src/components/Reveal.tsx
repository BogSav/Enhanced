import * as React from "react";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";
import { useInView } from "../hooks/useInView";
import type { UseInViewOptions } from "../hooks/useInView";

type Direction = "up" | "down" | "left" | "right" | "none";

export type RevealProps = {
  children: React.ReactNode;
  /** Direction for the entry motion. */
  direction?: Direction;
  /** Pixel offset for the slide before becoming visible. */
  distance?: number;
  /** Milliseconds for the transition duration. */
  duration?: number;
  /** Milliseconds to delay once in view. */
  delay?: number;
  /** Scale from value (e.g., 0.95) for a subtle zoom. */
  scaleFrom?: number;
  /** CSS easing timing function for the transition. */
  easing?: string;
  /** Intersection observer options. */
  inViewOptions?: UseInViewOptions;
  /** If true, element is considered visible immediately (no IO). */
  immediate?: boolean;
} & Omit<BoxProps, "children">;

/**
 * Lightweight reveal-on-scroll wrapper using CSS transitions and IntersectionObserver.
 */
export default function Reveal({
  children,
  direction = "up",
  distance = 16,
  duration = 600,
  delay = 0,
  scaleFrom,
  easing = "cubic-bezier(.2,.8,.2,1)",
  inViewOptions,
  immediate,
  ...boxProps
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(inViewOptions);
  const visible = immediate ? true : inView;

  const transformPieces: string[] = [];
  if (!visible) {
    if (direction === "up") transformPieces.push(`translateY(${distance}px)`);
    if (direction === "down") transformPieces.push(`translateY(-${distance}px)`);
    if (direction === "left") transformPieces.push(`translateX(${distance}px)`);
    if (direction === "right") transformPieces.push(`translateX(-${distance}px)`);
    if (scaleFrom && scaleFrom > 0 && scaleFrom !== 1) transformPieces.push(`scale(${scaleFrom})`);
  } else {
    if (scaleFrom && scaleFrom > 0 && scaleFrom !== 1) transformPieces.push("scale(1)");
  }

  return (
    <Box
      ref={ref}
      {...boxProps}
      sx={{
        opacity: visible ? 1 : 0,
        transform: transformPieces.length ? transformPieces.join(" ") : undefined,
        transitionProperty: "opacity, transform",
        transitionTimingFunction: easing,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
        ...boxProps.sx,
      }}
    >
      {children}
    </Box>
  );
}
