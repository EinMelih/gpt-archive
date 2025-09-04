"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        emailOrUsername: fd.get("emailOrUsername"),
        password: fd.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      location.href = "/dashboard";
    } else {
      let msg = "Fehler";
      try {
        const j = await res.json();
        msg = j.error ?? msg;
      } catch {}
      setErr(msg);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(1000px_600px_at_50%_0%,rgba(255,255,255,0.06),transparent)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="emailOrUsername">Username</Label>
              <div className="relative">
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  required
                  className="rounded-full pl-10"
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  👤
                </span>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="rounded-full pl-10"
                />
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  🔒
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <Checkbox /> <span>Remember me</span>
              </label>
              <a href="#" className="text-neutral-300 hover:underline">
                Forgot Password?
              </a>
            </div>
            {err && <p className="text-red-600 text-sm">{err}</p>}
            <Button disabled={loading} type="submit" className="rounded-full">
              {loading ? "..." : "Log in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <span>
            Don't have an account?{" "}
            <a href="/signup" className="underline">
              Register
            </a>
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
