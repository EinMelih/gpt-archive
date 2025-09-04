"use client";
import { useEffect, useState } from "react";

type TokenRow = {
  id: string;
  name: string;
  tokenPrefix: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revoked: boolean;
  createdAt: string;
};

export default function TokenTable() {
  const [rows, setRows] = useState<TokenRow[]>([]);
  const [raw, setRaw] = useState<string | null>(null);
  const [name, setName] = useState("Extension");
  const [expires, setExpires] = useState<string>("");

  async function load() {
    const r = await fetch("/api/tokens");
    if (r.status === 401) {
      location.href = "/login";
      return;
    }
    const j = await r.json();
    setRows(j.tokens);
  }

  useEffect(() => {
    load();
  }, []);

  async function createToken() {
    const r = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, expiresAt: expires || null }),
    });
    const j = await r.json();
    if (r.ok) {
      setRaw(j.rawToken);
      load();
    } else alert(j.error ?? "Fehler");
  }

  async function revoke(id: string) {
    await fetch(`/api/tokens/${id}/revoke`, { method: "POST" });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="border p-3 rounded">
        <h3 className="font-medium mb-2">Neues Token</h3>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            className="border p-2 rounded"
            type="datetime-local"
            value={expires}
            onChange={(e) => setExpires(e.target.value)}
          />
          <button
            onClick={createToken}
            className="px-4 rounded bg-violet-600 text-white"
          >
            Create
          </button>
        </div>
        {raw && (
          <p className="mt-2 text-sm">
            <b>Raw Token (einmalig):</b>{" "}
            <code className="bg-neutral-100 px-2 py-1 rounded">{raw}</code>
          </p>
        )}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th>Prefix</th>
            <th>Expires</th>
            <th>Last Used</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td>{r.name}</td>
              <td className="text-neutral-500">{r.tokenPrefix}</td>
              <td>{r.expiresAt ?? "—"}</td>
              <td>{r.lastUsedAt ?? "—"}</td>
              <td>{r.revoked ? "revoked" : "active"}</td>
              <td>
                <button onClick={() => revoke(r.id)} className="text-red-600">
                  Revoke
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
