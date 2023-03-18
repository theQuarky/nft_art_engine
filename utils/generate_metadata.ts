import fs from "fs";
import path from "path";
import { Canvas, createCanvas, loadImage, Image } from "canvas";
import {
  format,
  namePrefix,
  description,
  baseUri,
} from "../src/config.js";
const basePath: string = process.cwd();
const buildDir: string = `${basePath}/build/json`;
const inputDir: string = `${basePath}/build/images`;

const canvas: Canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

const metadataList: {
  name: string;
  description: string;
  image: string;
  edition: number;
  attributes: {
    trait_type: string;
    value: string | number;
  }[][];
  compiler: string;
}[] = [];

const buildSetup: Function = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const getImages: Function = (_dir: string) => {
  try {
    return fs
      .readdirSync(_dir)
      .filter((item: string) => {
        let extension: string = path.extname(`${_dir}${item}`);
        if (extension == ".png" || extension == ".jpg") {
          return item;
        }
      })
      .map((i: string) => {
        return {
          filename: i,
          path: `${_dir}/${i}`,
        };
      });
  } catch {
    return null;
  }
};

const loadImgData: Function = async (_imgObject: {
  filename: string;
  path: string;
}) => {
  try {
    const image: Image = await loadImage(`${_imgObject.path}`);
    return {
      imgObject: _imgObject,
      loadedImage: image,
    };
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

const draw: Function = (_imgObject: {
  imgObject: {
    filename: string;
    path: string;
  };
  loadedImage: Image;
}) => {

  let w: number = canvas.width;
  let h: number = canvas.height;
  ctx.drawImage(_imgObject.loadedImage, 0, 0, w, h);
};

const addRarity: Function = () => {
  let w: number = canvas.width;
  let h: number = canvas.height;
  let i: number = -4;
  let count: number = 0;
  let imgdata = ctx.getImageData(0, 0, w, h);
  let rgb: Uint8ClampedArray = imgdata.data;
  let newRgb: { r: number, g: number, b: number } = { r: 0, g: 0, b: 0 };
  const tolerance: number = 15;
  const rareColorBase: string = "NOT a Hot Dog";
  const rareColor: {
    name: string;
    rgb: {
      r: number;
      g: number;
      b: number
    }
  }[] = [
      { name: "Hot Dog", rgb: { r: 192, g: 158, b: 131 } },
      { name: "Hot Dog", rgb: { r: 128, g: 134, b: 90 } },
      { name: "Hot Dog", rgb: { r: 113, g: 65, b: 179 } },
      { name: "Hot Dog", rgb: { r: 162, g: 108, b: 67 } },
    ];

  while ((i += 10 * 4) < rgb.length) {
    ++count;
    newRgb.r += rgb[i];
    newRgb.g += rgb[i + 1];
    newRgb.b += rgb[i + 2];
  }

  newRgb.r = ~~(newRgb.r / count);
  newRgb.g = ~~(newRgb.g / count);
  newRgb.b = ~~(newRgb.b / count);

  let rarity: string = rareColorBase;

  rareColor.forEach((color: {
    name: string;
    rgb: {
      r: number;
      g: number;
      b: number;
    };
  }) => {
    if (isNeighborColor(newRgb, color.rgb, tolerance)) {
      rarity = color.name;
    }
  });

  console.log(newRgb);
  console.log(rarity);

  return [
    {
      trait_type: "average color",
      value: `rgb(${newRgb.r},${newRgb.g},${newRgb.b})`,
    },
    {
      trait_type: "What is this?",
      value: rarity,
    },
    {
      trait_type: "date",
      value: randomIntFromInterval(1500, 1900),
    },
  ];
};

const randomIntFromInterval: Function = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const isNeighborColor: Function = (color1: {
  r: number;
  g: number;
  b: number;
}, color2: {
  r: number;
  g: number;
  b: number;
}, tolerance: number) => {
  return (
    Math.abs(color1.r - color2.r) <= tolerance &&
    Math.abs(color1.g - color2.g) <= tolerance &&
    Math.abs(color1.b - color2.b) <= tolerance
  );
};

const saveMetadata: Function = (_loadedImageObject: {
  imgObject: {
    filename: string;
    path: string;
  };
  loadedImage: Image;
} | undefined) => {

  let shortName: string | undefined = _loadedImageObject?.imgObject.filename.replace(
    /\.[^/.]+$/,
    ""
  );

  let tempAttributes: ({
    trait_type: string;
    value: string | number;
  })[][] = [];

  tempAttributes.push(addRarity());

  let tempMetadata: {
    name: string;
    description: string;
    image: string;
    edition: number;
    attributes: {
      trait_type: string;
      value: string | number;
    }[][];
    compiler: string;
  } = {
    name: `${namePrefix} #${shortName}`,
    description: description,
    image: `${baseUri}/${shortName}.png`,
    edition: Number(shortName),
    attributes: tempAttributes,
    compiler: "HashLips Art Engine",
  };

  fs.writeFileSync(
    `${buildDir}/${shortName}.json`,
    JSON.stringify(tempMetadata, null, 2)
  );
  metadataList.push(tempMetadata);
};

const writeMetaData: Function = (_data: string) => {
  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
};

const startCreating: Function = async () => {
  const images: {
    filename: string;
    path: string;
  }[] | null = getImages(inputDir);

  if (images == null) {
    console.log("Please generate collection first.");
    return;
  }
  let loadedImageObjects: Promise<{
    imgObject: any;
    loadedImage: Image;
  } | undefined>[] = [];

  images.forEach((imgObject: {
    filename: string;
    path: string;
  }) => {
    loadedImageObjects.push(loadImgData(imgObject));
  });
  await Promise.all(loadedImageObjects).then((loadedImageObjectArray: ({
    imgObject: {
      filename: string;
      path: string;
    };
    loadedImage: Image;
  } | undefined)[]) => {

    loadedImageObjectArray.forEach((loadedImageObject: ({
      imgObject: {
        filename: string;
        path: string;
      };
      loadedImage: Image;
    } | undefined)) => {

      draw(loadedImageObject);
      saveMetadata(loadedImageObject);
      console.log(
        `Created metadata for image: ${loadedImageObject?.imgObject.filename}`
      );
    });
  });
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

buildSetup();
startCreating();
