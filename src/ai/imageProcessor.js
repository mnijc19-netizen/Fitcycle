const MAX_IMAGE_EDGE = 1600;
const JPEG_QUALITY = 0.82;

function canvasToDataUrl(canvas) {
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function loadImageFallback(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片无法读取"));
    };
    image.src = url;
  });
}

export async function processImageFile(file) {
  if (!(file instanceof Blob) || !String(file.type || "").startsWith("image/")) {
    throw new Error("请选择有效的图片文件");
  }
  if (file.size > 25 * 1024 * 1024) throw new Error("单张图片不能超过 25 MB");

  let source;
  let shouldClose = false;
  if (typeof createImageBitmap === "function") {
    source = await createImageBitmap(file, { imageOrientation: "from-image" });
    shouldClose = typeof source.close === "function";
  } else {
    source = await loadImageFallback(file);
  }

  const sourceWidth = source.naturalWidth || source.width;
  const sourceHeight = source.naturalHeight || source.height;
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);
  if (shouldClose) source.close();

  const dataUrl = canvasToDataUrl(canvas);
  return {
    name: typeof file.name === "string" ? file.name : "image.jpg",
    type: "image/jpeg",
    width,
    height,
    dataUrl,
    size: Math.round((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75)
  };
}
