import { authPAT } from "@/lib/pat-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const pat = await authPAT(req);
  if (!pat) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { chatname, chatlog, model, sourceUrl } = await req.json();
  if (!chatname || !chatlog)
    return Response.json(
      { error: "chatname and chatlog required" },
      { status: 400 }
    );

  const chat = await prisma.chat.create({
    data: { userId: pat.userId, chatname, chatlog, model, sourceUrl },
  });

  return Response.json({ ok: true, id: chat.id }, { status: 201 });
}
