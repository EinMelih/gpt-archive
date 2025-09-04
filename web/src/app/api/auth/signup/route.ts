import { lucia } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "username must be at least 3 characters")
    .max(20, "username must be at most 20 characters")
    .regex(
      /^[A-Za-z0-9.]+$/,
      "username may only contain letters, digits, and dot"
    )
    .refine(
      (s) => !(s.startsWith(".") || s.endsWith(".")),
      "username cannot start or end with dot"
    )
    .refine((s) => !/\.\./.test(s), "username cannot contain consecutive dots")
    .transform((s) => s.normalize("NFKC")),
  email: z
    .string()
    .trim()
    .email("invalid email address")
    .max(254, "email too long")
    .transform((s) => s.toLowerCase()),
  password: z
    .string()
    .min(8, "password must be at least 8 characters")
    .max(200, "password too long")
    .refine((s) => /[a-z]/.test(s), "password must include a lowercase letter")
    .refine((s) => /[A-Z]/.test(s), "password must include an uppercase letter")
    .refine((s) => /\d/.test(s), "password must include a number")
    .refine(
      (s) => /[^A-Za-z0-9]/.test(s),
      "password must include a special character"
    ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {
        username: [],
        email: [],
        password: [],
      };
      for (const issue of parsed.error.issues) {
        const pathKey = (issue.path?.[0] ?? "") as string;
        if (!fieldErrors[pathKey]) fieldErrors[pathKey] = [];
        fieldErrors[pathKey].push(issue.message);
      }
      return Response.json({ errors: fieldErrors }, { status: 400 });
    }

    const { username, email, password } = parsed.data;

    const [emailExists, usernameExists] = await Promise.all([
      prisma.user.findFirst({ where: { email } }),
      prisma.user.findFirst({ where: { username } }),
    ]);
    if (emailExists || usernameExists) {
      const errors: Record<string, string[]> = {};
      if (emailExists) errors.email = ["email is already registered"];
      if (usernameExists) errors.username = ["username is already taken"];
      return Response.json({ errors }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });

    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(cookie.name, cookie.value, cookie.attributes);

    return Response.json({ ok: true, userId: user.id });
  } catch (err: unknown) {
    return Response.json({ error: "internal error" }, { status: 500 });
  }
}
