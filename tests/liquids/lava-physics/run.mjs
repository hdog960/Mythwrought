import * as lava from "../../../src/liquids/lava/physics/definition.mjs";
import {runLavaFixtures} from "./fixtures.mjs";
import {pathToFileURL} from "node:url";
import {resolve} from "node:path";
const core=process.env.LIQUID_ENGINE_MODULE?await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE)).href):null;
const passed=runLavaFixtures(lava,core);
for(const name of passed)console.log("PASS "+name);
console.log(passed.length+" passed; core integration "+(core?"executed":"not requested"));
