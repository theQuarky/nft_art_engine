import fs from "fs";
import path from "path";
import { createCanvas, loadImage, Canvas, Image } from "canvas";
import { format, pixelFormat } from "../src/config";

const basePath: string = process.cwd();
const buildDir: string = `${basePath}/build/pixel_images`;
const inputDir: string = `${basePath}/build/images`;

const canvas: Canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

interface ImageObject {
  filename: string;
  path: string;
}

const buildSetup = (): void => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const getImages = (_dir: string): ImageObject[] | null => {
  try {
    return fs
      .readdirSync(_dir)
      .filter((item: string): boolean => {
        const extension: string = path.extname(`${_dir}${item}`);
        if (extension == ".png" || extension == ".jpg") {
          return true;
        }
        return false;
      })
      .map((i: string): ImageObject => {
        return {
          filename: i,
          path: `${_dir} /${i}`,
        };
      });
  } catch {
    return null;
  }
};

interface LoadedImageObject {
  imgObject: ImageObject;
  loadedImage: Image;
}

const loadImgData = async (
  _imgObject: ImageObject
): Promise<LoadedImageObject> => {
  try {
    const image: Image = await loadImage(`${_imgObject.path}`);
    return {
      imgObject: _imgObject,
      loadedImage: image,
    };
  } catch (error) {
    console.error("Error loading image:", error);
    throw error;
  }
};

const draw = (_imgObject: LoadedImageObject): void => {
  let size: number = pixelFormat.ratio;
  let w: number = canvas.width * size;
  let h: number = canvas.height * size;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(_imgObject.loadedImage, 0, 0, w, h);
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
};

const saveImage = (_loadedImageObject: LoadedImageObject): void => {
  fs.writeFileSync(
    `${buildDir} / ${_loadedImageObject.imgObject.filename}`,
    canvas.toBuffer("image/png")
  );
};

const startCreating = async (): Promise<void> => {
  const images: ImageObject[] | null = getImages(inputDir);
  if (images == null) {
    console.log("Please generate collection first.");
    return;
  }
  let loadedImageObjects: Promise<LoadedImageObject>[] = [];
  images.forEach((imgObject: ImageObject) => {
    loadedImageObjects.push(loadImgData(imgObject));
  });
  await Promise.all(loadedImageObjects).then(
    (loadedImageObjectArray: LoadedImageObject[]) => {
      loadedImageObjectArray.forEach((loadedImageObject: LoadedImageObject) => {
        draw(loadedImageObject);
        saveImage(loadedImageObject);
        console.log(`Pixelated image: ${loadedImageObject.imgObject.filename}`);
      });
    }
  );
};

buildSetup();
startCreating();