import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const su = await getSession();
  if (!su) return Response.json({ error: "unauthorized" }, { status: 401 });

  await prisma.userToken.update({
    where: { id: params.id },
    data: { revoked: true },
  });

  return Response.json({ ok: true });
}
