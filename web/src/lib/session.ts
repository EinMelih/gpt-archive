import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getSession() {
  const sid = cookies().get("auth_session")?.value ?? null;
  if (!sid) return null;
  const { session, user } = await lucia.validateSession(sid);
  if (!session) return null;
  return { session, user } as const;
}

export async function requireSession() {
  const su = await getSession();
  if (!su) throw new Error("Unauthorized");
  return su;
}
