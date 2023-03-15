import * as fs from "fs";
import { getElements } from "../src/main.js";

const basePath: string = process.cwd();
const layersDir: string = `${basePath}/layers`;

const { layerConfigurations }: { layerConfigurations: { layersOrder: { name: string; options?: { displayName?: string } }[] }[] } = require(`${basePath}/src/config.js`);

// read json data
let rawdata: Buffer = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data: { attributes: { trait_type: string; value: string }[] }[] = JSON.parse(rawdata.toString());
let editionSize: number = data.length;

let rarityData: { [layerName: string]: { trait: string; weight: string; occurrence: string }[] } = {};

// initialize layers to chart
layerConfigurations.forEach((config) => {
  let layers: { name: string; options?: { displayName?: string } }[] = config.layersOrder;

  layers.forEach((layer) => {
    // get elements for each layer
    let elementsForLayer: { trait: string; weight: string; occurrence: string }[] = [];
    let elements: { name: string; weight: number }[] = getElements(`${layersDir}/${layer.name}/`);
    elements.forEach((element) => {
      // just get name and weight for each element
      let rarityDataElement: { trait: string; weight: string; occurrence: string } = {
        trait: element.name,
        weight: element.weight.toFixed(0),
        occurrence: "0", // initialize at 0
      };
      elementsForLayer.push(rarityDataElement);
    });
    let layerName: string = layer.options?.displayName ?? layer.name;
    // don't include duplicate layers
    if (!rarityData[layerName]) {
      // add elements for each layer to chart
      rarityData[layerName] = elementsForLayer;
    }
  });
});

// fill up rarity chart with occurrences from metadata
data.forEach((element) => {
  let attributes: { trait_type: string; value: string }[] = element.attributes;
  attributes.forEach((attribute) => {
    let traitType: string = attribute.trait_type;
    let value: string = attribute.value;

    let rarityDataTraits: { trait: string; weight: string; occurrence: string }[] = rarityData[traitType];
    rarityDataTraits.forEach((rarityDataTrait) => {
      if (rarityDataTrait.trait == value) {
        // keep track of occurrences
        rarityDataTrait.occurrence = (Number.parseInt(rarityDataTrait.occurrence) + 1).toString();
      }
    });
  });
});

// convert occurrences to occurrence string
for (var layerName in rarityData) {
  for (var i in rarityData[layerName]) {
    // get chance
    let occurrence: number = Number.parseInt(rarityData[layerName][i].occurrence);
    let chance: string = ((occurrence / editionSize) * 100).toFixed(2);

    // show two decimal places in percent
    rarityData[layerName][i].occurrence = `${occurrence} in ${editionSize} editions (${chance} %)`;
  }
}

// print out rarity data
for (var layerName in rarityData) {
  console.log(`Trait type: ${layerName}`);
  for (var i in rarityData[layerName]) {
    console.log(rarityData[layerName][i]);
  }
  console.log();
}
