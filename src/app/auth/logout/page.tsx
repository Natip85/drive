import { redirect } from "next/navigation";
import { auth, signOut } from "~/server/auth";

export default async function Logout() {
  const session = await auth();

  if (session) {
    await signOut();
  }

  return redirect("/auth/login");
}
