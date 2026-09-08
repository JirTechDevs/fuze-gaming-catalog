import { redirect } from "next/navigation";

// ponytail: old admin UI removed — middleware still guards /admin, redirect to real dashboard
export default function AdminPage() {
  redirect("/dashboard");
}
