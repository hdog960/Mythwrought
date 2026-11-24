// Creator-owned Mountain V8 material namespace. Deliberately separate from
// biome130, manual packs and Resonance. Issue #452 authorization #7146299596.
// This module defines genuine unit-cell geometry and colors, not a global
// activation switch. Historical world source and original IDs stay unchanged.
import {validateShape,FULL_CUBE} from '../voxel-shape-interactions.mjs';

const cube=FULL_CUBE.boxes;
const rows=[
 ['stone','Alpine granite',true,cube,['#777c80','#868b90','#70777d'],42],
 ['dirt','Alpine loam',true,cube,['#63513e','#76634c','#6d5943'],43],
 ['snow','Alpine snow',true,cube,['#e7eff3','#d8e5ed','#f2f5f5'],41],
 ['alpine-grass','Alpine meadow grass',true,cube,['#6e9148','#789d4e','#638449'],43],
 ['slate','Alpine slate',true,cube,['#4d5962','#5d6871','#46515a'],42],
 ['gneiss','Alpine banded gneiss',true,cube,['#a09889','#b2aa9d','#827c74'],42],
 ['scree','Alpine weathered scree',true,cube,['#827768','#938675','#746c61'],42],
 ['flower','Alpine flower stem',false,[
  [.45,0,.45,.55,1,.55],[.20,.24,.46,.50,.34,.54],[.50,.48,.46,.80,.59,.54],
  [.46,.35,.19,.54,.45,.50]],['#477639','#608e43','#3e6633'],0],
 ['flower-petal','Alpine flower blossom',false,[
  [.45,0,.45,.55,.16,.55],[.30,.12,.40,.70,.30,.60],
  [.40,.12,.30,.60,.30,.70],[.20,.21,.44,.43,.38,.56],
  [.57,.21,.44,.80,.38,.56],[.44,.21,.20,.56,.38,.43],
  [.44,.21,.57,.56,.38,.80]],['#f5c34c','#f7d77a','#f0b740'],0],
 ['heather','Alpine heather stems',false,[
  [.42,0,.42,.58,1,.58],[.22,.14,.22,.35,.72,.35],[.65,.14,.65,.78,.72,.78],
  [.22,.30,.65,.35,.86,.78],[.65,.30,.22,.78,.86,.35],
  [.30,.36,.30,.70,.48,.70]],['#567642','#627c48','#465f39'],0],
 ['heather-tip','Alpine heather bloom',false,[
  [.36,0,.36,.64,.21,.64],[.20,.13,.25,.40,.32,.45],
  [.60,.13,.55,.80,.32,.75],[.40,.18,.40,.60,.42,.60],
  [.20,.15,.55,.40,.34,.75],[.60,.15,.25,.80,.34,.45]],['#ad679b','#c583b5','#945689'],0],
 ['conifer-trunk','Alpine dwarf pine trunk',true,[
  [.32,0,.32,.68,1,.68],[0,.18,.42,1,.30,.58],
  [.42,.18,0,.58,.30,1]],['#674a32','#795b3d','#59412d'],0],
 ['conifer-needles','Alpine dwarf pine needles',false,[
  [.16,0,.16,.84,.48,.84],[0,.10,.20,1,.58,.80],
  [.20,.10,0,.80,.58,1],[.22,.38,.22,.78,.82,.78],
  [.29,.70,.29,.71,1,.71]],['#345d3d','#426f45','#294e36'],0]
];
// The runtime module must not import catalogs that themselves import voxel.
// Qualification supplies the original owner registries to this explicit check.
const occupied=new Set([0,1,2,3,4,5,6,7,8,255,65535]);
const defs=new Map(),byName=new Map();
for(const [index,[key,name,solid,boxes,hex,materialTag]] of rows.entries()){
 const blockId=500+index;
 if(occupied.has(blockId)||defs.has(blockId)||byName.has(key)||!validateShape({boxes})||
    hex.length<2||hex.some(c=>!/^#[0-9a-f]{6}$/i.test(c)))throw Error('Mountain V8 namespace or geometry conflict: '+key);
 const palette=Object.freeze(hex.map(c=>Object.freeze([1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255))));
 const color=Object.freeze(palette[0].map((_,i)=>palette.reduce((sum,c)=>sum+c[i],0)/palette.length));
 const descriptor=Object.freeze({blockId,key,name,symbol:'mountain-v8:'+key,source:'creator:mountain-v8',
  solid,opacity:1,transparent:false,rotationCount:1,materialTag,color,palette,
  boxes:Object.freeze(boxes.map(b=>Object.freeze([...b]))),terrain:index<7});
 defs.set(blockId,descriptor);byName.set(key,descriptor);
}
export const MOUNTAIN_V8_MATERIAL_IDS=Object.freeze([...defs.keys()]);
export const MOUNTAIN_V8_MATERIAL=Object.freeze(Object.fromEntries([...byName].map(([k,v])=>[k,v.blockId])));
export const isMountainV8Material=id=>Number.isInteger(id)&&defs.has(id);
export const mountainV8Material=id=>defs.get(id);
export const isMountainV8Flora=id=>defs.has(id)&&!defs.get(id).terrain;
export function assertMountainV8Namespace(ids){
 for(const id of ids)if(defs.has(id))throw Error('Existing owner claims Mountain V8 ID '+id);
 return true;
}
export function mountainV8MaterialColor(id,x=0,y=0,z=0,face=0){
 const a=defs.get(id);
 if(!a)throw Error('Unknown Mountain V8 material');
 if(a.terrain)return a.color;
 const hash=(Math.imul((x|0)^id,73856093)^Math.imul(y|0,19349663)^Math.imul(z|0,83492791)^Math.imul(face+1,2654435761))>>>0;
 return a.palette[hash%a.palette.length];
}
