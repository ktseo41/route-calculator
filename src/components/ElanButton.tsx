import React from "react";
import { cn } from "../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ElanButton({ children, className, ...props }: Props) {
  return (
    <button
      className={cn(
        "px-2 py-0.5 flex items-center z-10",
        "text-white text-md leading-none font-normal font-[jaro] not-italic [font-optical-sizing:auto] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8),_-1px_-1px_1px_rgba(0,0,0,0.5)]",
        "bg-[#6a6a6a] border-2 border-t-[#8a8a8a] border-l-[#8a8a8a] border-b-[#1a1a1a] border-r-[#1a1a1a]",
        "rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
{
  /* <div
    className={cn(
      "absolute top-[3px] left-2 pl-2 pr-3 py-0.5 flex items-center z-10",
      "text-white text-lg leading-none font-normal font-[jaro] not-italic [font-optical-sizing:auto] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8),_-1px_-1px_1px_rgba(0,0,0,0.5)]",
      "bg-[#6a6a6a] border-2 border-t-[#8a8a8a] border-l-[#8a8a8a] border-b-[#1a1a1a] border-r-[#1a1a1a]",
      "rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),_inset_-1px_-1px_1px_rgba(0,0,0,0.3)]"
    )}
  >
    <img
      src="/src/img/faviconV2.png"
      alt="Elan Logo"
      className="inline-block w-4 h-4 mr-1 align-middle"
    />
    ROUTE CALCULATOR
  </div> */
}
