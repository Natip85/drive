import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import SearchInput from "~/features/photos/search-input";
import FavoriteSvg from "../../../../assets/images/favorite.svg";
import Favorites from "~/features/photos/favorites";
import { api } from "~/trpc/server";

export default async function FavoritesPage() {
  const [favorites] = await Promise.all([api.files.getAllFavoriteFiles()]);

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

      {favorites.length > 0 ? (
        <div>
          <Favorites favorites={favorites} />
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center pt-20">
          <div className="flex flex-col items-center justify-center">
            <div className="size-96">
              <FavoriteSvg />
            </div>
            <div className="text-2xl font-bold md:text-4xl">
              No favorites yet
            </div>
            <p className="max-w-96 text-center">
              Start marking your favorite photos to view them here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
