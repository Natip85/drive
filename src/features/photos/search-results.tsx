"use client";

import { Suspense, useState } from "react";
import { PhotoGalleryDialog } from "./photo-gallery-dialog";
import { PhotoGrid, PhotoGridSkeleton } from "./photos-dashboard";
import type { File } from "../drive/file-types";

type Props = { results: File };

export default function SearchResultsPage({ results }: Props) {
  const [openPhotoId, setOpenPhotoId] = useState<string | null>(null);

  return (
    <main className="flex-1">
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold">
            Results ({results.length})
          </h2>
          <Suspense fallback={<PhotoGridSkeleton />}>
            <PhotoGrid
              photos={results}
              onPhotoClick={(id) => setOpenPhotoId(id)}
            />
          </Suspense>
        </div>
      </div>
      <PhotoGalleryDialog
        isOpen={openPhotoId !== null}
        onClose={() => setOpenPhotoId(null)}
        photos={results}
        initialPhotoId={openPhotoId}
      />
    </main>
  );
}
