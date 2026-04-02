import { redirect } from "next/navigation";

/** Legacy `/chat` → unified search with AI mode (Google-style tabs). */
export default async function ChatRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  if (m?.trim()) {
    redirect(`/search?view=ai&m=${encodeURIComponent(m.trim())}`);
  }
  redirect("/search?view=ai");
}
