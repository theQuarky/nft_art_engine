interface IMode {
  sourceOver: string;
  sourceIn: string;
  sourceOut: string;
  sourceAtop: string;
  destinationOver: string;
  destinationOut: string;
  destinationIn: string;
  destinationAtop: string;
  lighter: string;
  copy: string;
  xor: string;
  multiply: string;
  screen: string;
  overlay: string;
  darken: string;
  lighten: string;
  colorDodge: string;
  colorBurn: string;
  hardLight: string;
  softLight: string;
  difference: string;
  exclusion: string;
  hue: string;
  saturation: string;
  color: string;
  luminosity: string;
}
const MODE: IMode = {
  sourceOver: "source-over",
  sourceIn: "source-in",
  sourceOut: "source-out",
  sourceAtop: "source-out",
  destinationOver: "destination-over",
  destinationIn: "destination-in",
  destinationOut: "destination-out",
  destinationAtop: "destination-atop",
  lighter: "lighter",
  copy: "copy",
  xor: "xor",
  multiply: "multiply",
  screen: "screen",
  overlay: "overlay",
  darken: "darken",
  lighten: "lighten",
  colorDodge: "color-dodge",
  colorBurn: "color-burn",
  hardLight: "hard-light",
  softLight: "soft-light",
  difference: "difference",
  exclusion: "exclusion",
  hue: "hue",
  saturation: "saturation",
  color: "color",
  luminosity: "luminosity",
};

export default MODE;