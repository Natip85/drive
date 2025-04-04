"use client";
import { ChevronLeft, ChevronRight, Info, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { type File } from "../drive/file-types";

export function PhotoGalleryDialog({
  isOpen,
  onClose,
  photos,
  initialPhotoId,
}: {
  isOpen: boolean;
  onClose: () => void;
  photos: File;
  initialPhotoId: string | null;
}) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  useState(() => {
    if (initialPhotoId) {
      const index = photos.findIndex(
        (photo) => photo.publicId === initialPhotoId,
      );
      if (index !== -1) {
        setCurrentPhotoIndex(index);
      }
    }
  });

  const currentPhoto = photos[currentPhotoIndex];

  const goToNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const goToPrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      goToNextPhoto();
    } else if (e.key === "ArrowLeft") {
      goToPrevPhoto();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="h-[95vh] w-[80vw] max-w-none p-0 sm:max-w-none md:max-w-none lg:max-w-none"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <DialogTitle className="sr-only">{currentPhoto.name}</DialogTitle>

        {/* Main image container */}
        <div className="relative flex w-full flex-1 items-center justify-center bg-black">
          <div className="relative h-[70vh] w-full">
            <Image
              src={currentPhoto.url || "/placeholder.svg"}
              alt={currentPhoto.name}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80"
            onClick={goToPrevPhoto}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80"
            onClick={goToNextPhoto}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>

          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
            <div className="flex items-center gap-2">
              <span>{currentPhoto.name}</span>
              <span className="text-sm text-white/70">
                {currentPhotoIndex + 1} of {photos.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-white">
                <Info className="h-4 w-4" />
                <span className="sr-only">Info</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="h-20 overflow-x-auto border-t bg-background">
          <div className="flex h-full gap-2 p-2">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`aspect-square h-full cursor-pointer overflow-hidden rounded ${
                  index === currentPhotoIndex ? "ring-2 ring-sky-500" : ""
                }`}
                onClick={() => setCurrentPhotoIndex(index)}
              >
                <Image
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.name}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
