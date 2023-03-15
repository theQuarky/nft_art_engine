import { createCanvas, loadImage, Canvas, Image } from "canvas";
import fs from "fs";
import { format, preview_gif } from "../src/config";
import HashlipsGiffer from "../modules/HashlipsGiffer";

const basePath: string = process.cwd();
const buildDir: string = `${basePath}/build`;
const imageDir: string = `${buildDir}/images`;

const canvas: Canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

let hashlipsGiffer: HashlipsGiffer | null = null;

const loadImg = async (_img: string): Promise<{ loadedImage: Image }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const loadedImage: Image = await loadImage(`${_img}`);
      resolve({ loadedImage: loadedImage });
    } catch (error) {
      reject(error);
    }
  });
};


// read image paths
const imageList: Promise<{ loadedImage: Image }>[] = [];

fs.readdirSync(imageDir).forEach((file: string) => {
  imageList.push(loadImg(`${imageDir}/${file}`));
});

const saveProjectPreviewGIF = async (_data: Promise<{ loadedImage: Image }>[]) => {
  // Extract from preview config
  const { numberOfImages, order, repeat, quality, delay, imageName } = preview_gif;
  // Extract from format config
  const { width, height } = format;
  // Prepare canvas
  const previewCanvasWidth: number = width;
  const previewCanvasHeight: number = height;

  if (_data.length < numberOfImages) {
    console.log(
      `You do not have enough images to create a gif with ${numberOfImages} images.`
    );
  } else {
    // Shout from the mountain tops
    console.log(
      `Preparing a ${previewCanvasWidth}x${previewCanvasHeight} project preview with ${_data.length} images.`
    );
    const previewPath: string = `${buildDir}/${imageName}`;

    ctx.clearRect(0, 0, width, height);

    hashlipsGiffer = new HashlipsGiffer(
      canvas,
      ctx,
      `${previewPath}`,
      repeat,
      quality,
      delay
    );
    hashlipsGiffer.start();

    await Promise.all(_data).then((renderObjectArray) => {
      // Determine the order of the Images before creating the gif
      if (order == "ASC") {
        // Do nothing
      } else if (order == "DESC") {
        renderObjectArray.reverse();
      } else if (order == "MIXED") {
        renderObjectArray = renderObjectArray.sort(() => Math.random() - 0.5);
      }

      // Reduce the size of the array of Images to the desired amount
      if ((numberOfImages) > 0) {
        renderObjectArray = renderObjectArray.slice(0, numberOfImages);
      }

      renderObjectArray.forEach((renderObject, index) => {
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(
          renderObject.loadedImage,
          0,
          0,
          previewCanvasWidth,
          previewCanvasHeight
        );
        hashlipsGiffer!.add();
      });
    });
    hashlipsGiffer!.stop();
  }
};

saveProjectPreviewGIF(imageList);
