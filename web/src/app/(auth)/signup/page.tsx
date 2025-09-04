"use client";
import { useState } from "react";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string[];
    email?: string[];
    password?: string[];
  }>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setFieldErrors({});
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        username: fd.get("username"),
        email: fd.get("email"),
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
        if (j && j.errors && typeof j.errors === "object") {
          setFieldErrors(j.errors);
          msg = null as any;
        } else {
          msg = j.error ?? msg;
        }
      } catch {}
      setErr(msg);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <div className="grid gap-1">
          <input
            name="username"
            placeholder="Username"
            className="border p-2 rounded"
            required
          />
          <p className="text-xs text-neutral-500">
            Erlaubt: Buchstaben, Zahlen und Punkt. 3–20 Zeichen, kein Punkt am
            Anfang/Ende, keine zwei Punkte hintereinander.
          </p>
          {fieldErrors.username?.length ? (
            <ul className="text-red-600 text-sm list-disc ml-5">
              {fieldErrors.username.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="grid gap-1">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 rounded"
            required
          />
          <p className="text-xs text-neutral-500">
            Gültige Email-Adresse erforderlich.
          </p>
          {fieldErrors.email?.length ? (
            <ul className="text-red-600 text-sm list-disc ml-5">
              {fieldErrors.email.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="grid gap-1">
          <input
            type="password"
            name="password"
            placeholder="Passwort"
            className="border p-2 rounded"
            required
          />
          <p className="text-xs text-neutral-500">
            Mind. 8 Zeichen, mit Groß-/Kleinbuchstabe, Zahl und Sonderzeichen.
          </p>
          {fieldErrors.password?.length ? (
            <ul className="text-red-600 text-sm list-disc ml-5">
              {fieldErrors.password.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          disabled={loading}
          className="h-10 rounded bg-violet-600 text-white"
        >
          {loading ? "..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
