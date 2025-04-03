"use client";
"use no memo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";
import { fileSelectSchema, type FileSelect } from "./file-types";

export default function RenameFileForm({
  setIsOpen,
  file,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  file: FileSelect;
}) {
  const router = useRouter();

  const { mutateAsync: renameFile, isPending: isLoading } =
    api.files.renameFile.useMutation();

  const form = useForm<FileSelect>({
    resolver: zodResolver(fileSelectSchema),
    defaultValues: file,
  });
  const onSubmit = async (values: FileSelect) => {
    await renameFile(values);
    setIsOpen(false);
    router.refresh();
  };
  console.log("ERRORS: ", form.formState.errors);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input id="name" {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <Button
              variant={"ghost"}
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full hover:bg-[#C1E7FE]"
            >
              Cancel
            </Button>

            <Button
              variant={"ghost"}
              type="submit"
              className="rounded-full hover:bg-[#C1E7FE]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Loading...
                </span>
              ) : (
                <span>Rename</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
