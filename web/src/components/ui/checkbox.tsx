import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, Props>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={
        "h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
      }
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";
