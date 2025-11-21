import * as React from "react";

import { cn } from "@/lib/utils";

const TableContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
      // Modern shadow and border with lighter tone
      "shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.3)]",
      className
    )}
    {...props}
  />
));
TableContainer.displayName = "TableContainer";

const TableRoot = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom border-collapse", className)}
    {...props}
  />
));
TableRoot.displayName = "Table";

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "sticky top-0 z-20 [&_tr]:border-0",
        // Enhanced header with lighter gradient
        "bg-gradient-to-b from-[#2d2d30] to-[#28282b]",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.15)]",
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        // Smooth transitions for all states
        "transition-all duration-200 ease-out",
        // Border between rows with stronger visibility
        "border-b border-[#4a4a4f]",
        // Last row no border
        "last:border-b-0",
        // Remove iOS tap highlight
        "[-webkit-tap-highlight-color:transparent]",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        // Increased height for better spacing
        "h-12 px-3 text-left align-middle whitespace-nowrap",
        // Remove all borders
        "border-0",
        // Enhanced typography with better contrast
        "text-sm font-semibold tracking-wide text-[#f0f0f0]",
        // First column width
        "[&:first-child]:w-32",
        // Checkbox handling
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        // Better spacing
        "h-12 px-1 py-3 align-middle whitespace-nowrap overflow-hidden relative",
        // Remove all borders
        "border-0",
        // Inherit background from row
        "bg-inherit",
        // Improved text styling with better readability
        "text-sm text-[#e0e0e0]",
        // First column width with brighter text
        "[&:first-child]:w-32 [&:first-child]:font-medium [&:first-child]:text-[#f5f5f5]",
        // Checkbox handling
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

const Table = Object.assign(TableRoot, {
  Container: TableContainer,
});

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
