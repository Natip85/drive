"use client";

import { Suspense, useState } from "react";
import type { File } from "../drive/file-types";
import { PhotoGrid, PhotoGridSkeleton } from "./photos-dashboard";
import { PhotoGalleryDialog } from "./photo-gallery-dialog";

type Props = { favorites: File };

export default function Favorites({ favorites }: Props) {
  const [openPhotoId, setOpenPhotoId] = useState<string | null>(null);

  return (
    <main className="flex-1">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">Favorites</h2>
          <Suspense fallback={<PhotoGridSkeleton />}>
            <PhotoGrid
              photos={favorites}
              onPhotoClick={(id) => setOpenPhotoId(id)}
            />
          </Suspense>
        </div>
      </div>
      <PhotoGalleryDialog
        isOpen={openPhotoId !== null}
        onClose={() => setOpenPhotoId(null)}
        photos={favorites}
        initialPhotoId={openPhotoId}
      />
    </main>
  );
}
