import * as React from "react";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl " +
        (className ?? "")
      }
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={"mb-4 " + (className ?? "")} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={"text-center text-3xl font-semibold " + (className ?? "")}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={"grid gap-4 " + (className ?? "")} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={
        "mt-4 text-center text-sm text-neutral-400 " + (className ?? "")
      }
      {...props}
    />
  );
}
