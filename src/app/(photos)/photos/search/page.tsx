import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type SearchParams } from "nuqs/server";
import { loadPageSearchParams } from "~/hooks/use-search-params";
import { api } from "~/trpc/server";
import SearchInput from "~/features/photos/search-input";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { searchTerm } = await loadPageSearchParams(searchParams);

  const photos = await api.files.getSearchTermFiles({ searchTerm });

  return (
    <div className="min-h-screen p-2 md:p-5">
      <div className="relative flex items-center justify-center">
        <Link
          href="/photos"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-0 top-1.5 rounded-full",
          )}
        >
          <ArrowLeft />
        </Link>
        <div>
          <SearchInput />
        </div>
      </div>

      {photos.length ? (
        <div>
          {photos.map((photo) => (
            <div key={photo.id}>{photo.name}</div>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          No results found.
        </div>
      )}
    </div>
  );
}
