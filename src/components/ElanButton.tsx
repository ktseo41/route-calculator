import React from "react";
import { cn } from "../lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ElanButton({ children, className, ...props }: Props) {
  return (
    <button
      className={cn(
        "elan-btn",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
