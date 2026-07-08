import React from "react";

export function AuthLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23 9C23 6.23858 20.7614 4 18 4H14C11.2386 4 9 6.23858 9 9V11C9 13.7614 11.2386 16 14 16H18C20.7614 16 23 18.2386 23 21V23C23 25.7614 20.7614 28 18 28H14C11.2386 28 9 25.7614 9 23"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
