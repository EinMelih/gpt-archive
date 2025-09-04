"use client";
import { useEffect, useState } from "react";

export default function AuthHeader() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/tokens")
      .then((r) => setAuthed(r.status !== 401))
      .catch(() => setAuthed(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/";
  }

  return (
    <header className="flex justify-end items-center gap-3 p-4 h-16 border-b">
      {authed ? (
        <button
          onClick={logout}
          className="px-4 h-10 rounded-full bg-neutral-900 text-white"
        >
          Logout
        </button>
      ) : (
        <div className="flex gap-2">
          <a
            href="/signup"
            className="px-4 h-10 rounded-full bg-violet-600 text-white"
          >
            Sign Up
          </a>
          <a href="/login" className="px-4 h-10 rounded-full border">
            Sign In
          </a>
        </div>
      )}
    </header>
  );
}
