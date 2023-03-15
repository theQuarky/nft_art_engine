export const basePath: string = process.cwd();
import MODE from "../constants/blend_mode";
import NETWORK from "../constants/network";

export const network: string = NETWORK.eth;

// General metadata for Ethereum
export const namePrefix: string = "Your Collection";
export const description: string = "Remember to replace this description";
export const baseUri: string = "ipfs://NewUriToReplace";

interface ISolanaMetaData {
  symbol: string;
  seller_fee_basis_points: number;
  external_url: string;
  creators: {
    address: string;
    share: number
  }[]
}

export interface ILayerConfigurations {
  growEditionSizeTo: number;
  layersOrder: {
    name: string;
  }[];
}

interface IFormate {
  width: number;
  height: number;
  smoothing: boolean;
}

interface IGif {
  export: boolean;
  repeat: number;
  quality: 100;
  delay: 500;
}

interface IText {
  only: boolean;
  color: string;
  size: number;
  xGap: number;
  yGap: number;
  align: string;
  baseline: string;
  weight: string;
  family: string;
  spacer: string
}

interface IBackground {
  generate: boolean;
  brightness: string;
  static: boolean;
  default: string
}

interface IPreview {
  thumbPerRow: number;
  thumbWidth: number;
  imageRatio: number;
  imageName: string;
};

interface IPreviewGif {
  numberOfImages: number;
  order: "ASC" | "DESC" | "MIXED";
  repeat: number;
  quality: number;
  delay: number;
  imageName: string;
}

export const solanaMetadata: ISolanaMetaData = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://www.youtube.com/c/hashlipsnft",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};
// If you have selected Solana then the collection starts from 0 automatically
export const layerConfigurations: ILayerConfigurations[] = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
      { name: "Bottom lid" },
      { name: "Top lid" },
    ],
  },
];

export const shuffleLayerConfigurations: boolean = false;

export const debugLogs: boolean = false;

export const format: IFormate = {
  width: 512,
  height: 512,
  smoothing: false,
};

export const gif: IGif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

export const text: IText = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

export const pixelFormat: { ratio: number } = {
  ratio: 2 / 128,
};

export const background: IBackground = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

export const extraMetadata: any = {};

export const rarityDelimiter: string = "#";

export const uniqueDnaTorrance: number = 10000;

export const preview: IPreview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

export const preview_gif: IPreviewGif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

