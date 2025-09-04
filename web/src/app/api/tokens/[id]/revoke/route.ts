import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { NextRequest } from "next/server";

export async function POST(
  _: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const su = await getSession();
  if (!su) return Response.json({ error: "unauthorized" }, { status: 401 });

  await prisma.userToken.update({
    where: { id },
    data: { revoked: true },
  });

  return Response.json({ ok: true });
}
