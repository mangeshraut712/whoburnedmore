import React from "react";

type WbmLogoProps = {
  size?: number;
  className?: string;
  decorative?: boolean;
};

/** Animated flame-over-cash logo matching whoburnedmore.com */
export function WbmLogo({
  size = 76,
  className = "",
  decorative = false,
}: WbmLogoProps) {
  const uid = React.useId().replace(/:/g, "");
  const flameId = `wbmFlameGrad-${uid}`;
  const innerId = `wbmInnerGrad-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`select-none wbm-logo-glow ${className}`}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "whoburnedmore"}
    >
      <defs>
        <linearGradient
          id={flameId}
          x1="32"
          y1="44"
          x2="32"
          y2="5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#c2410c" />
          <stop offset="0.45" stopColor="#f97316" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient
          id={innerId}
          x1="32"
          y1="44"
          x2="32"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      <g strokeLinejoin="round">
        <g transform="rotate(13 32 49)">
          <rect x="12" y="42" width="40" height="14" rx="2.5" fill="#e7e7ea" />
          <rect
            x="14.5"
            y="44.2"
            width="35"
            height="9.6"
            rx="1.5"
            fill="none"
            stroke="#71717a"
            strokeWidth="0.8"
            opacity="0.7"
          />
        </g>
        <g transform="rotate(-13 32 49)">
          <rect x="12" y="42" width="40" height="14" rx="2.5" fill="#e7e7ea" />
          <rect
            x="14.5"
            y="44.2"
            width="35"
            height="9.6"
            rx="1.5"
            fill="none"
            stroke="#71717a"
            strokeWidth="0.8"
            opacity="0.7"
          />
          <ellipse
            cx="32"
            cy="49"
            rx="6"
            ry="4.6"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1"
          />
          <path
            d="M32 44.6 L32 53.4"
            stroke="#3f3f46"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M34.4 46.4 C32.7 45.4, 30 45.8, 30 47.6 C30 49.1, 32 49.4, 33.2 49.8 C35 50.3, 35 52.5, 32.7 52.5 C31 52.5, 30 51.9, 29.7 51"
            fill="none"
            stroke="#3f3f46"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </g>
      <g className="wbm-flame">
        <path
          d="M32 5 C35 12, 39 16, 39 24 C42 21, 44 17, 43.5 13 C43 18, 44.5 24, 42 29 C46 33, 46 40, 40 43.5 L24 43.5 C18 40, 18 33, 22 29 C19.5 24, 21 18, 20.5 13 C20 17, 22 21, 25 24 C26 16, 29 12, 32 5 Z"
          fill={`url(#${flameId})`}
        />
        <path
          className="wbm-ember"
          d="M32 19 C33.5 25, 30 28.5, 31 34 C28 36, 28 41, 32 43.5 C36 41, 36 36, 33 34 C34.5 28.5, 31 25, 32 19 Z"
          fill={`url(#${innerId})`}
        />
      </g>
    </svg>
  );
}
