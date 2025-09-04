import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: false;
};

export function Button({ className, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={
        "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 " +
        (className ?? "")
      }
      {...props}
    />
  );
}
