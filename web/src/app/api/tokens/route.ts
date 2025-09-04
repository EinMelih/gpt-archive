import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createHash, randomBytes } from "crypto";

function makeRawToken() {
  return "tok_" + randomBytes(24).toString("base64url");
}
function hashToken(raw: string) {
  return createHash("sha256")
    .update((process.env.TOKEN_PEPPER ?? "") + raw)
    .digest("hex");
}

export async function POST(req: Request) {
  const su = await getSession();
  if (!su) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { name, expiresAt } = await req.json().catch(() => ({}));
  const raw = makeRawToken();
  const tokenHash = hashToken(raw);
  const tokenPrefix = raw.slice(0, 12);

  const tok = await prisma.userToken.create({
    data: {
      userId: su.user.id,
      name: name ?? "Extension",
      tokenHash,
      tokenPrefix,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return Response.json(
    { id: tok.id, rawToken: raw, tokenPrefix: tok.tokenPrefix },
    { status: 201 }
  );
}

export async function GET() {
  const su = await getSession();
  if (!su) return Response.json({ error: "unauthorized" }, { status: 401 });

  const tokens = await prisma.userToken.findMany({
    where: { userId: su.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      tokenPrefix: true,
      expiresAt: true,
      lastUsedAt: true,
      revoked: true,
      createdAt: true,
    },
  });
  return Response.json({ tokens });
}
