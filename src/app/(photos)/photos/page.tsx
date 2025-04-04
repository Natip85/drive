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
  // const todayPhotos = [
  //   {
  //     id: "1",
  //     src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3DCYMgOoub2eH5thV4PTqciKyYldGA8FEvfk1",
  //     alt: "Photo 1",
  //     width: 500,
  //     height: 500,
  //   },
  //   {
  //     id: "2",
  //     src: "/placeholder.svg?height=300&width=500",
  //     alt: "Photo 2",
  //     width: 500,
  //     height: 300,
  //   },
  //   {
  //     id: "3",
  //     src: "/placeholder.svg?height=500&width=300",
  //     alt: "Photo 3",
  //     width: 300,
  //     height: 500,
  //   },
  //   {
  //     id: "4",
  //     src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3aWHTlV8Bz1PonveJAFR2t0wi3ydUHrXmjZK5",
  //     alt: "Photo 4",
  //     width: 400,
  //     height: 400,
  //   },
  // ];

  // const yesterdayPhotos = [
  //   {
  //     id: "5",
  //     src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3aWHTlV8Bz1PonveJAFR2t0wi3ydUHrXmjZK5",
  //     alt: "Photo 5",
  //     width: 600,
  //     height: 400,
  //   },
  //   {
  //     id: "6",
  //     src: "/placeholder.svg?height=600&width=400",
  //     alt: "Photo 6",
  //     width: 400,
  //     height: 600,
  //   },
  //   {
  //     id: "7",
  //     src: "/placeholder.svg?height=500&width=500",
  //     alt: "Photo 7",
  //     width: 500,
  //     height: 500,
  //   },
  // ];

  // const lastWeekPhotos = [
  //   {
  //     id: "8",
  //     src: "/placeholder.svg?height=500&width=300",
  //     alt: "Photo 8",
  //     width: 300,
  //     height: 500,
  //   },
  //   {
  //     id: "9",
  //     src: "/placeholder.svg?height=300&width=500",
  //     alt: "Photo 9",
  //     width: 500,
  //     height: 300,
  //   },
  //   {
  //     id: "10",
  //     src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3DCYMgOoub2eH5thV4PTqciKyYldGA8FEvfk1",
  //     alt: "Photo 10",
  //     width: 400,
  //     height: 400,
  //   },
  //   {
  //     id: "11",
  //     src: "/placeholder.svg?height=600&width=400",
  //     alt: "Photo 11",
  //     width: 400,
  //     height: 600,
  //   },
  //   {
  //     id: "12",
  //     src: "/placeholder.svg?height=400&width=600",
  //     alt: "Photo 12",
  //     width: 600,
  //     height: 400,
  //   },
  // ];

  // Combine all photos for the gallery view
  // const allPhotos = [...todayPhotos, ...yesterdayPhotos, ...lastWeekPhotos];

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
