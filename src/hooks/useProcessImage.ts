import { useCallback } from "react";

const useProcessImage = () => {
  const processImage = useCallback(
    (
      file: File,
      canvasRef: React.RefObject<HTMLCanvasElement>,
      setSelectedImage: (selectedImage: string | null) => void,
    ) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              // Determine the size of the square crop
              const size = Math.min(img.width, img.height);
              // Calculate crop position
              const xOffset = (img.width - size) / 2;
              const yOffset = (img.height - size) / 2;

              // Set canvas size to 300x300 for a smaller output
              canvasRef.current.width = 300;
              canvasRef.current.height = 300;

              // Draw the cropped and resized image
              ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, 300, 300);

              // Convert to low quality JPEG
              const lowQualityJpeg = canvasRef.current.toDataURL(
                "image/jpeg",
                // 0.5,
              ); // 0.5 is 50% quality
              setSelectedImage(lowQualityJpeg);
            }
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  return processImage;
};

export default useProcessImage;
