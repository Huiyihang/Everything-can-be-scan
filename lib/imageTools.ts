export interface CompressedImage {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  wasCompressed: boolean;
}

const MAX_IMAGE_SIDE = 1280;
const JPEG_QUALITY = 0.82;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("图片读取失败"));
    };
    reader.onerror = () => reject(new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片解析失败"));
    image.src = dataUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("图片压缩失败"));
      },
      type,
      quality
    );
  });
}

function getCanvasSize(width: number, height: number) {
  const maxSide = Math.max(width, height);

  if (maxSide <= MAX_IMAGE_SIDE) {
    return {
      width,
      height,
      wasResized: false
    };
  }

  const ratio = MAX_IMAGE_SIDE / maxSide;

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
    wasResized: true
  };
}

export async function compressImageFile(file: File): Promise<CompressedImage> {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);
  const size = getCanvasSize(image.naturalWidth, image.naturalHeight);

  if (!size.wasResized && file.size <= 1.6 * 1024 * 1024) {
    return {
      dataUrl: originalDataUrl,
      originalSize: file.size,
      compressedSize: file.size,
      width: image.naturalWidth,
      height: image.naturalHeight,
      wasCompressed: false
    };
  }

  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("浏览器不支持图片压缩");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size.width, size.height);
  context.drawImage(image, 0, 0, size.width, size.height);

  const blob = await canvasToBlob(canvas, "image/jpeg", JPEG_QUALITY);

  return {
    dataUrl: await readFileAsDataUrl(new File([blob], "scan-image.jpg", { type: "image/jpeg" })),
    originalSize: file.size,
    compressedSize: blob.size,
    width: size.width,
    height: size.height,
    wasCompressed: blob.size < file.size || size.wasResized
  };
}

export function formatImageSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
