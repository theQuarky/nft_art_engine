const basePath: string = process.cwd();
import { startCreating, buildSetup } from "./src/main";

(() => {
  buildSetup();
  startCreating();
})();
