import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const sid = (await cookies()).get("auth_session")?.value;
  if (sid) await lucia.invalidateSession(sid);
  const blank = lucia.createBlankSessionCookie();
  (await cookies()).set(blank.name, blank.value, blank.attributes);
  return Response.json({ ok: true });
}
