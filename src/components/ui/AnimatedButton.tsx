"use client";
import React, { useState } from "react";

interface AnimatedButtonProps {
  text: string;
  icon: React.ElementType;
  href: string;
  variant?: "primary" | "secondary";
}

export const AnimatedButton = ({
  text,
  icon: Icon,
  href,
  variant = "primary",
}: AnimatedButtonProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = href;
  };

  const isPrimary = variant === "primary";

  return (
    <a
      href={href}
      onClick={handleClick}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setTimeout(() => setIsActive(false), 150)}
      className="relative inline-block group select-none active:scale-[0.97]"
      style={{ textDecoration: "none" }}
    >
      <div
        className={`
          relative overflow-hidden
          px-8 py-6 text-base font-semibold
          flex items-center justify-center gap-2
          rounded-xl shadow-lg
          transition-all duration-300 ease-out
          ${isPrimary
            ? `bg-gradient-to-r from-green-600 to-green-700 text-white ${
                isActive ? "brightness-90 scale-[0.98]" : ""
              }`
            : `bg-white text-gray-900 border-2 border-gray-200 ${
                isActive ? "bg-green-50 scale-[0.98]" : ""
              }`
          }
        `}
        style={{
          transform: isActive ? "scale(0.97)" : "scale(1)",
        }}
      >
        {/* Ripple background saat hover/aktif */}
        <div
          className={`
            absolute inset-0 
            ${isPrimary ? "bg-green-800" : "bg-green-50"}
            rounded-xl scale-0 group-hover:scale-150
            transition-transform duration-500 ease-out
            origin-center
          `}
          style={{ zIndex: 0 }}
        />

        {/* Icon */}
        <Icon
          className={`
            relative z-10 h-5 w-5 
            transition-all duration-300
            ${isActive ? "scale-110" : ""}
            group-hover:scale-110 group-hover:rotate-12
            ${!isPrimary && "group-hover:text-green-600"}
          `}
        />

        {/* Text */}
        <span
          className={`relative z-10 ${
            !isPrimary && "group-hover:text-green-600"
          }`}
        >
          {text}
        </span>

        {/* Arrow */}
        <div className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={!isPrimary ? "group-hover:stroke-green-600" : ""}
          >
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </a>
  );
};
