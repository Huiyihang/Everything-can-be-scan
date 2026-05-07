import type { ScanResult } from "@/lib/types";

interface ShareImageInput {
  imageDataUrl: string;
  result: ScanResult;
}

const CARD_WIDTH = 900;
const CARD_HEIGHT = 1280;

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("分享图生成失败"));
    image.src = dataUrl;
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const targetRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > targetRatio) {
    sourceWidth = sourceHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = sourceWidth / targetRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height
  );
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const chars = Array.from(text);
  let line = "";
  let lines = 0;

  for (const char of chars) {
    const testLine = line + char;

    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, y);
      y += lineHeight;
      lines += 1;
      line = char;

      if (lines >= maxLines - 1) {
        break;
      }
    } else {
      line = testLine;
    }
  }

  if (line && lines < maxLines) {
    context.fillText(line, x, y);
  }
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("分享图生成失败"));
    }, "image/png");
  });
}

export async function createShareImage({
  imageDataUrl,
  result
}: ShareImageInput) {
  const image = await loadImage(imageDataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("浏览器不支持分享图生成");
  }

  context.fillStyle = "#f7f8fb";
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  context.fillStyle = "rgba(25, 181, 159, 0.16)";
  context.fillRect(0, 0, 310, 120);
  context.fillStyle = "rgba(240, 111, 95, 0.12)";
  context.fillRect(CARD_WIDTH - 260, 0, 260, 140);
  context.fillStyle = "rgba(242, 201, 76, 0.24)";
  context.fillRect(0, CARD_HEIGHT - 140, 260, 140);

  context.fillStyle = "#171820";
  context.font = '700 28px Arial, "Microsoft YaHei", sans-serif';
  context.fillText("万物皆可扫", 56, 72);
  context.fillStyle = "#19b59f";
  context.font = '700 18px Arial, "Microsoft YaHei", sans-serif';
  context.fillText("AI 扫物日记", 56, 104);

  roundRect(context, 56, 140, 788, 520, 28);
  context.save();
  context.clip();
  drawCoverImage(context, image, 56, 140, 788, 520);
  context.restore();

  context.fillStyle = "rgba(23, 24, 32, 0.56)";
  context.fillRect(56, 548, 788, 112);
  context.fillStyle = "#ffffff";
  context.font = '700 24px Arial, "Microsoft YaHei", sans-serif';
  context.fillText("识别结果", 92, 594);
  context.font = '900 46px Arial, "Microsoft YaHei", sans-serif';
  context.fillText(result.objectName, 92, 640);

  context.fillStyle = "#ffffff";
  roundRect(context, 56, 700, 788, 212, 24);
  context.fill();
  context.fillStyle = "#667085";
  context.font = '700 22px Arial, "Microsoft YaHei", sans-serif';
  context.fillText("它的小日记", 92, 752);
  context.fillStyle = "#171820";
  context.font = '700 31px Arial, "Microsoft YaHei", sans-serif';
  wrapText(context, result.diary, 92, 804, 716, 46, 3);

  let tagX = 92;
  context.font = '700 20px Arial, "Microsoft YaHei", sans-serif';
  for (const tag of result.emotionTags.slice(0, 3)) {
    const label = `#${tag}`;
    const width = context.measureText(label).width + 34;

    context.fillStyle = "rgba(240, 111, 95, 0.12)";
    roundRect(context, tagX, 938, width, 42, 21);
    context.fill();
    context.fillStyle = "#f06f5f";
    context.fillText(label, tagX + 17, 966);
    tagX += width + 12;
  }

  context.fillStyle = "#171820";
  roundRect(context, 56, 1018, 788, 154, 24);
  context.fill();
  context.fillStyle = "#ffffff";
  context.font = '900 28px Arial, "Microsoft YaHei", sans-serif';
  context.fillText(result.service.title, 92, 1072);
  context.fillStyle = "rgba(255, 255, 255, 0.72)";
  context.font = '700 22px Arial, "Microsoft YaHei", sans-serif';
  wrapText(context, result.service.description, 92, 1114, 716, 32, 2);

  context.fillStyle = "#667085";
  context.font = '700 18px Arial, "Microsoft YaHei", sans-serif';
  context.fillText("扫码发现身边物品的小宇宙", 56, 1228);

  return canvasToBlob(canvas);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
