import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { LoginForm } from "~/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center bg-sidebar p-2">
      <Button
        variant="ghost"
        asChild
        className="absolute left-4 top-4 hover:bg-transparent hover:text-blue-500"
      >
        <Link href="/">
          <ArrowLeft /> Back
        </Link>
      </Button>
      <LoginForm />
    </div>
  );
}
