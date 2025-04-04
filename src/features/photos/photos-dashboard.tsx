"use client";

import { MoreHorizontal, Star } from "lucide-react";
import Image from "next/image";
import { Suspense, useState } from "react";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { PhotoGalleryDialog } from "./photo-gallery-dialog";
import { type File } from "../drive/file-types";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
  allPhotos: File;
};
export default function PhotosDashboardPage({ allPhotos }: Props) {
  const [openPhotoId, setOpenPhotoId] = useState<string | null>(null);

  return (
    <main className="flex-1">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">All photos</h2>
          <Suspense fallback={<PhotoGridSkeleton />}>
            <PhotoGrid
              photos={allPhotos}
              onPhotoClick={(id) => setOpenPhotoId(id)}
            />
          </Suspense>
        </div>
      </div>
      <PhotoGalleryDialog
        isOpen={openPhotoId !== null}
        onClose={() => setOpenPhotoId(null)}
        photos={allPhotos}
        initialPhotoId={openPhotoId}
      />
    </main>
  );
}

function PhotoItem({
  photo,
  onClick,
}: {
  photo: File[number];
  onClick: (id: string) => void;
}) {
  const router = useRouter();
  const { mutateAsync: toggleFavorite } =
    api.files.toggleFavorite.useMutation();
  return (
    <div
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-md"
      onClick={() => onClick(photo.publicId)}
    >
      <Image
        src={photo.url || "/placeholder.svg"}
        alt={photo.name}
        width={80}
        height={80}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={async (e) => {
              e.stopPropagation();
              await toggleFavorite({ filePublicId: photo.publicId }).then(() =>
                router.refresh(),
              );
            }}
          >
            {photo.favorites.length > 0
              ? "Remove from favorites"
              : "Add to favorites"}
          </DropdownMenuItem>
          <DropdownMenuItem>Move to trash</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {photo.favorites.length > 0 && (
        <Star className="absolute bottom-2 left-2 size-4 fill-white text-white" />
      )}
    </div>
  );
}

export function PhotoGrid({
  photos,
  onPhotoClick,
}: {
  photos: File;
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

export function PhotoGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-md" />
      ))}
    </div>
  );
}
