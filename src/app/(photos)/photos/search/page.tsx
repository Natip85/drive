import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { type SearchParams } from "nuqs/server";
import { loadPageSearchParams } from "~/hooks/use-search-params";
import { api } from "~/trpc/server";
import SearchInput from "~/features/photos/search-input";
import SearchResultsPage from "~/features/photos/search-results";
import SearchSvg from "../../../../assets/images/search.svg";
type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { searchTerm } = await loadPageSearchParams(searchParams);

  const results = await api.files.getSearchTermFiles({ searchTerm });

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

      {results.length ? (
        <div>
          <SearchResultsPage results={results} />
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center pt-20">
          <div className="flex flex-col items-center justify-center">
            <div className="size-96">
              <SearchSvg />
            </div>
            <div className="text-2xl font-bold md:text-4xl">No results</div>
            <p className="max-w-96 text-center">Try another search term.</p>
          </div>
        </div>
      )}
    </div>
  );
}
