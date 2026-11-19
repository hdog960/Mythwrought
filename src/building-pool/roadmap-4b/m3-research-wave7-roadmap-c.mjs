// Roadmap C 4B original source catalogue. All 152 historical candidates stay unchanged.
// Browser previews import the identical source-only Sunrift module to avoid
// eagerly revalidating the entire historical catalogue on Chromium startup.
import {ROADMAP_C_4B_152_ALL} from './m3-schoolhouses-wave6-roadmap-c.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
import {ROADMAP_C_4B_WAVE7_RESEARCH} from './m3-research-wave7-roadmap-c-single.mjs';
export {ROADMAP_C_4B_WAVE7_PLAN,ROADMAP_C_4B_WAVE7_RESEARCH,ROADMAP_C_4B_WAVE7_INSTITUTES}
  from './m3-research-wave7-roadmap-c-single.mjs';
export const ROADMAP_C_4B_153_ALL=Object.freeze([...ROADMAP_C_4B_152_ALL,ROADMAP_C_4B_WAVE7_RESEARCH]);
validateCollection(ROADMAP_C_4B_153_ALL);
if(ROADMAP_C_4B_153_ALL.length!==153||new Set(ROADMAP_C_4B_153_ALL.map(geometrySignature)).size!==153)throw Error('Sunrift original source duplicates or changes earlier protected schoolhouse roster');
