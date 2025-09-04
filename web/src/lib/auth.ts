import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";

export const lucia = new Lucia(new PrismaAdapter(prisma.session, prisma.user), {
  sessionCookie: {
    name: "auth_session",
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      path: "/",
    },
  },
  sessionExpiresIn: {
    activePeriod: 1000 * 60 * 60 * 24 * 7,
    idlePeriod: 1000 * 60 * 60 * 24 * 30,
  },
  getUserAttributes: (user) => ({
    username: user.username,
    email: user.email,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      email: string;
    };
  }
}
