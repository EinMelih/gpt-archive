export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">GPT Archiv</h1>
      <p>
        Self-hosted Archiver.{" "}
        <a className="underline" href="/dashboard">
          Zum Dashboard →
        </a>
      </p>
    </div>
  );
}
