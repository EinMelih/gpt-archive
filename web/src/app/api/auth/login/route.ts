import { lucia } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  emailOrUsername: z.string(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const { emailOrUsername, password } = schema.parse(await req.json());
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
    if (!user)
      return Response.json({ error: "invalid creds" }, { status: 401 });

    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) return Response.json({ error: "invalid creds" }, { status: 401 });

    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(cookie.name, cookie.value, cookie.attributes);

    return Response.json({ ok: true, userId: user.id });
  } catch (err: unknown) {
    console.error("/api/auth/login error", err);
    if (err && typeof err === "object" && "issues" in err) {
      return Response.json({ error: "invalid input" }, { status: 400 });
    }
    return Response.json({ error: "internal error" }, { status: 500 });
  }
}
