import { Plus, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import PhotosDashboardPage from "~/features/photos/photos-dashboard";
import SearchInput from "~/features/photos/search-input";
import { api } from "~/trpc/server";

export default async function PhotosPage() {
  const [allPhotos] = await Promise.all([api.files.getAllFiles()]);

  return (
    <div className="p-2 md:p-5">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SearchInput />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Upload className="mr-2 h-4 w-4" />
                Upload photos
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                Create folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <PhotosDashboardPage allPhotos={allPhotos} />
    </div>
  );
}
