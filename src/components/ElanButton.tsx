import React from "react";
import { cn } from "../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ElanButton({ children, className, ...props }: Props) {
  return (
    <button
      className={cn(
        "px-2 py-0.5 flex items-center z-10",
        "text-white text-md leading-none font-normal font-[jaro] not-italic [font-optical-sizing:auto] text-shadow-[1px_1px_2px_rgba(0,0,0,0.8),_-1px_-1px_1px_rgba(0,0,0,0.5)]",
        "bg-[#4a4a4a] border-1 border-t-[#6a6a6a] border-l-[#6a6a6a] border-b-[#2a2a2a] border-r-[#2a2a2a]",
        "rounded-[3px] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.1),_inset_-1px_-1px_1px_rgba(0,0,0,0.5)]",
        "hover:bg-[#5a5a5a] hover:border-t-[#7a7a7a] hover:border-l-[#7a7a7a] transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
