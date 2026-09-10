import { redirect } from "next/navigation";

/** Canonical public board lives on `/`. */
export default function LeaderboardRedirectPage() {
  redirect("/");
}
