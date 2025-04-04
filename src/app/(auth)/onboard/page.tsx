import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { auth } from "~/server/auth";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/server";

export default async function OnboardPage() {
  const authUser = await auth();
  if (!authUser) {
    return redirect("/auth/login");
  }
  let user: RouterOutputs["users"]["getMe"];

  try {
    user = await api.users.getMe();
    console.log({ user });
  } catch (error) {
    console.log("drive page err", error, user);
    redirect("/auth/login");
  }

  const rootFolder = await api.users.getRootFolderForUser(authUser.user.id);

  if (!rootFolder) {
    return (
      <form
        action={async () => {
          "use server";
          const user = await api.users.getMe();

          if (!user?.id) {
            return redirect("/auth/login");
          }

          const rootFolderId = await api.users.onboardUser(user.id);

          return redirect(`/drive/${rootFolderId}`);
        }}
      >
        <Button>Create new Drive</Button>
      </form>
    );
  }

  return redirect(`/drive/${rootFolder.publicId}`);
}
