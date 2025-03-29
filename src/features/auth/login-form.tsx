"use client";
"use no memo";
import { signIn } from "next-auth/react";

import GoogleIcon from "~/assets/images/google.svg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;

export function LoginForm({
  callbackUrl = "/onboard",
}: {
  callbackUrl?: string;
}) {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: LoginSchemaType) => {
    void signIn("resend", {
      email: values.email,
      callbackUrl,
    });
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Login to your JHDB account</CardTitle>
        <CardDescription>
          We&apos;ll keep you updated on any submissions that you make
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input id="email" {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="relative mt-6 flex items-center">
          <div className="flex-grow border" />
          <span className="px-2">or</span>
          <div className="flex-grow border" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-3">
          <Button
            variant={"outline"}
            size="lg"
            className="w-full"
            onClick={() =>
              signIn("google", {
                callbackUrl,
              })
            }
          >
            <GoogleIcon />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
