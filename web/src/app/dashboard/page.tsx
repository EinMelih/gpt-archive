import TokenTable from "@/components/TokenTable";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function Dashboard() {
  const su = await getSession();
  if (!su)
    return (
      <div className="p-6">
        Bitte{" "}
        <a className="underline" href="/login">
          einloggen
        </a>
        .
      </div>
    );

  const chats = await prisma.chat.findMany({
    where: { userId: su.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, chatname: true, createdAt: true },
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <section>
        <h2 className="font-medium mb-3">Chats</h2>
        <ul className="space-y-1">
          {chats.map((c) => (
            <li key={c.id} className="flex justify-between border-b py-2">
              <span>{c.chatname}</span>
              <time className="text-neutral-500 text-sm">
                {new Date(c.createdAt).toLocaleString()}
              </time>
            </li>
          ))}
          {chats.length === 0 && (
            <li className="text-neutral-500">Noch keine Chats.</li>
          )}
        </ul>
      </section>

      <section>
        <h2 className="font-medium mb-3">API Tokens</h2>
        <TokenTable />
      </section>
    </div>
  );
}
