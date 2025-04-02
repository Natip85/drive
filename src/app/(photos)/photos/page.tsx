"use client";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Info,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { PhotoGalleryDialog } from "~/features/photos/photo-gallery-dialog";

export default function PhotosPage() {
  const [openPhotoId, setOpenPhotoId] = useState<string | null>(null);

  const todayPhotos = [
    {
      id: "1",
      src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3DCYMgOoub2eH5thV4PTqciKyYldGA8FEvfk1",
      alt: "Photo 1",
      width: 500,
      height: 500,
    },
    {
      id: "2",
      src: "/placeholder.svg?height=300&width=500",
      alt: "Photo 2",
      width: 500,
      height: 300,
    },
    {
      id: "3",
      src: "/placeholder.svg?height=500&width=300",
      alt: "Photo 3",
      width: 300,
      height: 500,
    },
    {
      id: "4",
      src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3aWHTlV8Bz1PonveJAFR2t0wi3ydUHrXmjZK5",
      alt: "Photo 4",
      width: 400,
      height: 400,
    },
  ];

  const yesterdayPhotos = [
    {
      id: "5",
      src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3aWHTlV8Bz1PonveJAFR2t0wi3ydUHrXmjZK5",
      alt: "Photo 5",
      width: 600,
      height: 400,
    },
    {
      id: "6",
      src: "/placeholder.svg?height=600&width=400",
      alt: "Photo 6",
      width: 400,
      height: 600,
    },
    {
      id: "7",
      src: "/placeholder.svg?height=500&width=500",
      alt: "Photo 7",
      width: 500,
      height: 500,
    },
  ];

  const lastWeekPhotos = [
    {
      id: "8",
      src: "/placeholder.svg?height=500&width=300",
      alt: "Photo 8",
      width: 300,
      height: 500,
    },
    {
      id: "9",
      src: "/placeholder.svg?height=300&width=500",
      alt: "Photo 9",
      width: 500,
      height: 300,
    },
    {
      id: "10",
      src: "https://vtjacek4b0.ufs.sh/f/rhamW1bUOTF3DCYMgOoub2eH5thV4PTqciKyYldGA8FEvfk1",
      alt: "Photo 10",
      width: 400,
      height: 400,
    },
    {
      id: "11",
      src: "/placeholder.svg?height=600&width=400",
      alt: "Photo 11",
      width: 400,
      height: 600,
    },
    {
      id: "12",
      src: "/placeholder.svg?height=400&width=600",
      alt: "Photo 12",
      width: 600,
      height: 400,
    },
  ];

  // Combine all photos for the gallery view
  const allPhotos = [...todayPhotos, ...yesterdayPhotos, ...lastWeekPhotos];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">Photos</span>
          </Link>
          <div className="hidden md:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search your photos"
                className="w-[300px] pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
            <span className="sr-only">Info</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
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
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-12 items-center px-4 md:px-6">
            <Button variant="ghost" className="gap-1 text-muted-foreground">
              <span>Date</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">Today</h2>
            <Suspense fallback={<PhotoGridSkeleton />}>
              <PhotoGrid
                photos={todayPhotos}
                onPhotoClick={(id) => setOpenPhotoId(id)}
              />
            </Suspense>
          </div>
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">Yesterday</h2>
            <Suspense fallback={<PhotoGridSkeleton />}>
              <PhotoGrid
                photos={yesterdayPhotos}
                onPhotoClick={(id) => setOpenPhotoId(id)}
              />
            </Suspense>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Last Week</h2>
            <Suspense fallback={<PhotoGridSkeleton />}>
              <PhotoGrid
                photos={lastWeekPhotos}
                onPhotoClick={(id) => setOpenPhotoId(id)}
              />
            </Suspense>
          </div>
        </div>
      </main>

      {/* Photo Gallery Dialog */}
      <PhotoGalleryDialog
        isOpen={openPhotoId !== null}
        onClose={() => setOpenPhotoId(null)}
        photos={allPhotos}
        initialPhotoId={openPhotoId}
      />
    </div>
  );
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

function PhotoGrid({
  photos,
  onPhotoClick,
}: {
  photos: Photo[];
  onPhotoClick: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {photos.map((photo) => (
        <PhotoItem key={photo.id} photo={photo} onClick={onPhotoClick} />
      ))}
    </div>
  );
}

function PhotoItem({
  photo,
  onClick,
}: {
  photo: Photo;
  onClick: (id: string) => void;
}) {
  return (
    <div
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md"
      onClick={() => onClick(photo.id)}
    >
      <Image
        src={photo.src || "/placeholder.svg"}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          // Add more options functionality here
        }}
      >
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More</span>
      </Button>
    </div>
  );
}

function PhotoGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-md" />
      ))}
    </div>
  );
}
