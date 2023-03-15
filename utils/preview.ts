import fs from "fs";
import { createCanvas, loadImage, Canvas, CanvasRenderingContext2D, Image } from "canvas";

const basePath: string = process.cwd();
const buildDir: string = `${basePath}/build`;

const { preview } = require(`${basePath}/src/config.js`);

// read json data
const rawdata: Buffer = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
const metadataList: object[] = JSON.parse(rawdata.toString());

const saveProjectPreviewImage = async (_data: object[]) => {
  // Extract from preview config
  const { thumbWidth, thumbPerRow, imageRatio, imageName } = preview;
  // Calculate height on the fly
  const thumbHeight: number = thumbWidth * imageRatio;
  // Prepare canvas
  const previewCanvasWidth: number = thumbWidth * thumbPerRow;
  const previewCanvasHeight: number =
    thumbHeight * Math.ceil(_data.length / thumbPerRow);
  // Shout from the mountain tops
  console.log(
    `Preparing a ${previewCanvasWidth}x${previewCanvasHeight} project preview with ${_data.length} thumbnails.`
  );

  // Initiate the canvas now that we have calculated everything
  const previewPath: string = `${buildDir}/${imageName}`;
  const previewCanvas: Canvas = createCanvas(previewCanvasWidth, previewCanvasHeight);
  const previewCtx: CanvasRenderingContext2D = previewCanvas.getContext("2d");

  // Iterate all NFTs and insert thumbnail into preview image
  // Don't want to rely on "edition" for assuming index
  for (let index: number = 0; index < _data.length; index++) {
    const nft: any = _data[index];
    await loadImage(`${buildDir}/images/${nft.edition}.png`)
      .then((image: Image) => {
        previewCtx.drawImage(
          image,
          thumbWidth * (index % thumbPerRow),
          thumbHeight * Math.trunc(index / thumbPerRow),
          thumbWidth,
          thumbHeight
        );
      });
  }

  // Write Project Preview to file
  fs.writeFileSync(previewPath, previewCanvas.toBuffer("image/png"));
  console.log(`Project preview image located at: ${previewPath}`);
};

saveProjectPreviewImage(metadataList);
