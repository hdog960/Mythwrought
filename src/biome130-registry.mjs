// The creator-authorized, production ID bridge for automation-owned biome130 blocks.
// All 130 source-authored families are now registered through the existing physical shape ABI.
// 0..8 legacy, creator-owned manual 9..208, and 255 sentinel remain untouched.
import {validateShape,rotateShape} from './voxel-shape-interactions.mjs';
import {DESERT_CANDIDATE_IDS,desertCandidate} from './auto-block-catalog/biome130/desert.mjs';
import {FORMATION_IDS,desertFormation} from './auto-block-catalog/biome130/formations.mjs';
import {DESERT_ORGANIC_IDS,desertOrganic} from './auto-block-catalog/biome130/desert-organics.mjs';
import {SNOW_IDS,snowCandidate} from './auto-block-catalog/biome130/snow-foundations.mjs';
import {FROZEN_IDS,frozenCandidate} from './auto-block-catalog/biome130/frozen-ice.mjs';
import {GLACIAL_IDS,glacialCandidate} from './auto-block-catalog/biome130/glacial-materials.mjs';
import {ICE_FORMATION_IDS,iceFormation} from './auto-block-catalog/biome130/ice-formations.mjs';
import {SNOW_ORGANIC_CANDIDATES} from './auto-block-catalog/biome130/snow-organics.mjs';
import {ENCHANTED_GROUND_CANDIDATES} from './auto-block-catalog/biome130/enchanted-ground.mjs';
import {ENCHANTED_ROOT_CANDIDATES} from './auto-block-catalog/biome130/enchanted-roots.mjs';
import {ENCHANTED_GEOLOGY} from './auto-block-catalog/biome130/enchanted-geology.mjs';
import {ENCHANTED_FLORA} from './auto-block-catalog/biome130/enchanted-flora.mjs';
import {ENCHANTED_WOOD} from './auto-block-catalog/biome130/enchanted-wood.mjs';
import {MOUNTAIN_FOUNDATIONS} from './auto-block-catalog/biome130/mountain-foundations.mjs';
import {MOUNTAIN_MATERIALS} from './auto-block-catalog/biome130/mountain-materials.mjs';
import {MOUNTAIN_ORE_GEOLOGY} from './auto-block-catalog/biome130/mountain-ore-geology.mjs';
import {MOUNTAIN_CLIFF_SURFACES} from './auto-block-catalog/biome130/mountain-cliff-surfaces.mjs';
import {MOUNTAIN_FINAL_GEOLOGY} from './auto-block-catalog/biome130/mountain-final-geology.mjs';
import {ANCIENT_RUIN_FOUNDATIONS} from './auto-block-catalog/biome130/ancient-ruin-foundations.mjs';
import {ANCIENT_RUIN_DETAILS} from './auto-block-catalog/biome130/ancient-ruin-details.mjs';
import {ANCIENT_RUIN_FRAGMENTS} from './auto-block-catalog/biome130/ancient-ruin-fragments.mjs';
import {UNDERGROUND_CIVILIZATION_FOUNDATIONS} from './auto-block-catalog/biome130/underground-civilization-foundations.mjs';
import {UNDERGROUND_CIVILIZATION_DETAILS} from './auto-block-catalog/biome130/underground-civilization-details.mjs';
import {UNDERGROUND_CIVILIZATION_COMPLETION} from './auto-block-catalog/biome130/underground-civilization-completion.mjs';
import {DUNGEON_COMPONENTS} from './auto-block-catalog/biome130/dungeon-components-081-083.mjs';
import {DUNGEON_COMPONENTS_084_086} from './auto-block-catalog/biome130/dungeon-components-084-086.mjs';
import {DUNGEON_COMPONENTS_087_090} from './auto-block-catalog/biome130/dungeon-components-087-090.mjs';
import {BIOME_ARCHITECTURE_091_093} from './auto-block-catalog/biome130/architecture-091-093.mjs';
import {BIOME_ARCHITECTURE_094_096} from './auto-block-catalog/biome130/architecture-094-096.mjs';
import {BIOME_ARCHITECTURE_097_100} from './auto-block-catalog/biome130/architecture-097-100.mjs';
import {NATURAL_STONE_101_103} from './auto-block-catalog/biome130/stone-101-103.mjs';
import {NATURAL_STONE_104_106} from './auto-block-catalog/biome130/stone-104-106.mjs';
import {NATURAL_STONE_107_109} from './auto-block-catalog/biome130/stone-107-109.mjs';
import {NATURAL_STONE_110_112} from './auto-block-catalog/biome130/stone-110-112.mjs';
import {RAW_LOGS_113_115,logBoxes} from './auto-block-catalog/biome130/raw-logs-113-115.mjs';
import {RAW_LOGS_116_118,rawLogBoxes} from './auto-block-catalog/biome130/raw-logs-116-118.mjs';
import {RAW_LOGS_119_121,rawLogBoxes119} from './auto-block-catalog/biome130/raw-logs-119-121.mjs';
import {NATURAL_LEAVES_122_124,naturalLeafBoxes} from './auto-block-catalog/biome130/natural-leaves-122-124.mjs';
import {NATURAL_LEAVES_125_127,leafBoxes as cedarLeafBoxes} from './auto-block-catalog/biome130/natural-leaves-125-127.mjs';
import {NATURAL_LEAVES_128_130,leafBoxes as redwoodLeafBoxes} from './auto-block-catalog/biome130/natural-leaves-128-130.mjs';

const families=[
  ...DESERT_CANDIDATE_IDS.map(id=>desertCandidate(id)),
  ...FORMATION_IDS.map(id=>desertFormation(id)),
  ...DESERT_ORGANIC_IDS.map(id=>desertOrganic(id)),
  ...SNOW_IDS.map(id=>snowCandidate(id)),
  ...FROZEN_IDS.map(id=>frozenCandidate(id)),
  ...GLACIAL_IDS.map(id=>glacialCandidate(id)),
  ...ICE_FORMATION_IDS.map(id=>iceFormation(id)),
  ...SNOW_ORGANIC_CANDIDATES,...ENCHANTED_GROUND_CANDIDATES,
  ...ENCHANTED_ROOT_CANDIDATES,...ENCHANTED_GEOLOGY,...ENCHANTED_FLORA,
  ...ENCHANTED_WOOD,...MOUNTAIN_FOUNDATIONS,...MOUNTAIN_MATERIALS,
  ...MOUNTAIN_ORE_GEOLOGY,...MOUNTAIN_CLIFF_SURFACES,...MOUNTAIN_FINAL_GEOLOGY,
  ...ANCIENT_RUIN_FOUNDATIONS,...ANCIENT_RUIN_DETAILS,...ANCIENT_RUIN_FRAGMENTS,
  ...UNDERGROUND_CIVILIZATION_FOUNDATIONS,...UNDERGROUND_CIVILIZATION_DETAILS,
  ...UNDERGROUND_CIVILIZATION_COMPLETION,
  // Inert dungeon mechanisms remain static construction pieces: no traps or
  // dynamic state are enabled by registering their physical base geometry.
  ...DUNGEON_COMPONENTS,...DUNGEON_COMPONENTS_084_086,...DUNGEON_COMPONENTS_087_090,
  ...BIOME_ARCHITECTURE_091_093,...BIOME_ARCHITECTURE_094_096,
  ...BIOME_ARCHITECTURE_097_100,
  ...NATURAL_STONE_101_103,...NATURAL_STONE_104_106,
  ...NATURAL_STONE_107_109,...NATURAL_STONE_110_112,
  // Natural logs and foliage author their boxes through source-specific
  // geometry functions, not fabricated full-cube substitutes.
  ...RAW_LOGS_113_115.map(asset=>({...asset,boxes:logBoxes(asset)})),
  ...RAW_LOGS_116_118.map(asset=>({...asset,boxes:rawLogBoxes(asset)})),
  ...RAW_LOGS_119_121.map(asset=>({...asset,boxes:rawLogBoxes119(asset)})),
  ...NATURAL_LEAVES_122_124.map(asset=>({...asset,boxes:naturalLeafBoxes(asset)})),
  ...NATURAL_LEAVES_125_127.map(asset=>({...asset,boxes:cedarLeafBoxes(asset)})),
  ...NATURAL_LEAVES_128_130.map(asset=>({...asset,boxes:redwoodLeafBoxes(asset)}))
];
const parseHex=value=>{
  if(typeof value!=='string')throw Error('Invalid biome material color');
  const str=value.startsWith('#')?value.slice(1):value;
  if(!/^[a-f0-9]{6}$/i.test(str))throw Error('Invalid biome hex palette');
  return Object.freeze([0,2,4].map(i=>parseInt(str.slice(i,i+2),16)/255));
};
const registered=new Map(),symbols=new Map();
for(const original of families){
  const symbol=original.symbolicId??original.id;
  if(typeof symbol!=='string'||!/^biome130:\d{3}$/.test(symbol))throw Error('Invalid biome symbolic identity');
  const ordinal=Number(symbol.slice(-3)),blockId=255+ordinal;
  if(ordinal<1||ordinal>130||blockId===255||registered.has(blockId)||symbols.has(symbol))
    throw Error('Duplicate or unapproved biome block ID '+symbol);
  const boxes=original.shape?.boxes??original.boxes;
  if(!validateShape({boxes}))throw Error('Invalid physical biome boxes '+symbol);
  const palette=original.texture?.palette??original.material?.palette??
    original.palette??original.colors;
  if(!Array.isArray(palette)||!palette.length)throw Error('Missing material palette '+symbol);
  const p=Object.freeze(palette.map(parseHex));
  const solid=original.physical?.solid??original.solid??(original.collision!=='none');
  const definition=Object.freeze({
    symbol,blockId,ordinal,name:original.name,
    boxes:Object.freeze(boxes.map(b=>Object.freeze([...b]))),
    palette:p,solid:Boolean(solid),
    opacity:original.material?.opacity??(original.opacity===undefined||original.opacity==='opaque'?1:original.opacity),
    attachment:original.physical?.attachment??original.attachment??'any',
    alphaMode:original.alpha??(original.transparent?'cutout':'opaque'),
    transparent:Boolean(original.transparent),
    source:'auto:12-biome130',rotationCount:4
  });
  registered.set(blockId,definition);symbols.set(symbol,definition);
}
for(let ordinal=1;ordinal<=130;ordinal++)
  if(!registered.has(255+ordinal))throw Error('Missing authored biome family '+ordinal);
export const BIOME130_REGISTERED_IDS=Object.freeze([...registered.keys()].sort((a,b)=>a-b));
export const BIOME130_REGISTERED_SYMBOLS=Object.freeze(BIOME130_REGISTERED_IDS.map(id=>registered.get(id).symbol));
export const BIOME130_LIVE_COUNT=BIOME130_REGISTERED_IDS.length;
export const isBiome130BlockId=id=>Number.isInteger(id)&&registered.has(id);
export function biome130Block(input,rotation=0){
  const base=typeof input==='string'?symbols.get(input):registered.get(input);
  if(!base||!Number.isInteger(rotation)||rotation<0||rotation>3)throw new RangeError('Unknown biome130 block or orientation');
  if(rotation===0)return base;
  return Object.freeze({...base,boxes:Object.freeze(rotateShape({boxes:base.boxes},rotation).boxes.map(b=>Object.freeze(b)))});
}
export function biome130Color(id,x=0,y=0,z=0,face=0){
  const block=biome130Block(id);
  const n=(Math.imul((x|0)^block.blockId,73856093)^Math.imul(y|0,19349663)^
    Math.imul(z|0,83492791)^Math.imul(face+block.ordinal,2654435761))>>>0;
  return block.palette[n%block.palette.length];
}
