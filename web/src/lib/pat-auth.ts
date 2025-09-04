import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";

function hashToken(raw: string) {
  return createHash("sha256")
    .update((process.env.TOKEN_PEPPER ?? "") + raw)
    .digest("hex");
}

export async function authPAT(req: Request) {
  const raw = (req.headers.get("authorization") || "").replace(
    /^Bearer\s+/i,
    ""
  );
  if (!raw) return null;
  const tokenHash = hashToken(raw);
  const tok = await prisma.userToken.findUnique({ where: { tokenHash } });
  if (!tok || tok.revoked) return null;
  if (tok.expiresAt && tok.expiresAt < new Date()) return null;
  await prisma.userToken.update({
    where: { id: tok.id },
    data: { lastUsedAt: new Date() },
  });
  return { userId: tok.userId, tokenId: tok.id } as const;
}

export function makeRawToken() {
  return "tok_" + randomBytes(24).toString("base64url");
}
