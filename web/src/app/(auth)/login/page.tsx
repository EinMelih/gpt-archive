"use client";
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
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input
          name="emailOrUsername"
          placeholder="Email oder Username"
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          className="border p-2 rounded"
          required
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          disabled={loading}
          className="h-10 rounded bg-neutral-900 text-white"
        >
          {loading ? "..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
