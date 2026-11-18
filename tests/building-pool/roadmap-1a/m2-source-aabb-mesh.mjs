// Builder 1A read-only source Pack1–5 AABB preview. No runtime placement/saves.
// Uses the exact integrator-owned visibleBoxes per voxel and actual authored
// placements. Shading colors are diagnostic, NOT final authored texture materials.
import {resolveManualFivePackAsset,manualFivePackVariants} from '../../../src/builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
import {getM2DiagnosticCells} from './m2-preview-mesh.mjs';
const variants=new Map(PACK5_BUILDER_CATALOG.map(x=>[x.symbolicId,x.variants[0]]));
const liveBox=Object.freeze([[0,0,0,1,1,1]]);
const directions=new Set(['north','east','south','west']);
const colors={foundation:[.36,.41,.44],wall:[.78,.74,.63],partition:[.61,.47,.32],
 support:[.53,.44,.34],roof:[.65,.38,.29],door:[.34,.63,.71],window:[.52,.78,.94],
 furnishing:[.93,.69,.36],decoration:[.7,.55,.36],stair:[.8,.78,.59],floor:[.65,.54,.41]};
const regionTint={'temperate':[1,1,1],'snow':[.91,.97,1.09],'desert':[1.08,.98,.83],
 'enchanted-forest':[.87,1.08,.90],mountain:[.9,.94,1.04]};
const faces=[
 {k:.84,v:[[1,0,1],[1,1,0],[1,0,0],[1,0,1],[1,1,1],[1,1,0]]},
 {k:.68,v:[[0,0,0],[0,1,1],[0,0,1],[0,0,0],[0,1,0],[0,1,1]]},
 {k:1,v:[[0,1,0],[1,1,1],[0,1,1],[0,1,0],[1,1,0],[1,1,1]]},
 {k:.55,v:[[0,0,1],[1,0,0],[0,0,0],[0,0,1],[1,0,1],[1,0,0]]},
 {k:.94,v:[[0,0,1],[0,1,1],[1,1,1],[0,0,1],[1,1,1],[1,0,1]]},
 {k:.74,v:[[1,0,0],[1,1,0],[0,1,0],[1,0,0],[0,1,0],[0,0,0]]}
];
function sourceGeometry(p,cache){
 if(p.asset.startsWith('live:'))return {boxes:liveBox,pack:false,chosenVariant:null};
 if(!/^pack[1-5]:\d{3}$/.test(p.asset))
  throw Error('Unregistered or unsupported physical-source preview family '+p.asset);
 const yaw=directions.has(p.orientation)?p.orientation:'north';
 const options=manualFivePackVariants(p.asset);
 if(options.length!==1&&!Number.isInteger(p.numericId))
  throw Error('Ambiguous producer family needs explicit candidate ID '+p.asset);
 const variant=p.asset.startsWith('pack5:')?(p.variant??variants.get(p.asset)):null;
 if(p.asset.startsWith('pack5:')&&!variant)
  throw Error('Pack5 physical-source preview needs exact authored variant '+p.asset);
 const key=[p.asset,yaw,variant??'',p.numericId??''].join('|');
 let value=cache.get(key);
 if(!value){
  const resolved=resolveManualFivePackAsset(p.asset,{orientation:yaw,variant,numericId:p.numericId??null,
   // Door sidecar OPEN-STOWED was never production-certified. The source
   // Pack2 default physical state is intentionally previewed without pretending
   // to reconcile swept-volume/hinge state or save orientation.
   state:{}});
  if(!resolved.physical||!resolved.visibleBoxes.length||resolved.livePlaceable||resolved.saveWritten)
   throw Error('Invalid fail-closed physical source '+p.asset);
  value={boxes:resolved.visibleBoxes,pack:true,chosenVariant:resolved.variant};
  cache.set(key,value);
 }
 return value;
}
export function makeM2SourceAABBMesh(b,{cutaway=false,maxBoxes=160000}={}){
 const cells=getM2DiagnosticCells(b,{cutaway}),cache=new Map();
 const floats=[],tint=regionTint[b.biome]??[1,1,1];
 let boxCount=0,packBoxes=0,packCells=0,liveCells=0,uncertifiedDoors=0,implicitPack5Variants=0;
 for(const p of cells){
  const found=sourceGeometry(p,cache);
  if(found.pack){packCells++;packBoxes+=found.boxes.length;}
  else liveCells++;
  if(p.role==='door')uncertifiedDoors++;
  if(p.asset.startsWith('pack5:')&&!p.variant)implicitPack5Variants++;
  const rgb=colors[p.role]??[.7,.6,.5];
  for(const box of found.boxes){
   boxCount++;
   if(boxCount>maxBoxes)throw Error('Exceeds source Pack visibleBox budget: '+boxCount);
   if(box.length!==6||box.some(x=>!Number.isFinite(x))||
      [0,1,2].some(i=>box[i]>=box[i+3]))throw Error('Malformed source visibleBox');
   const a=[box[0]+p.at[0],box[1]+p.at[1],box[2]+p.at[2]],
     ext=[box[3]-box[0],box[4]-box[1],box[5]-box[2]];
   for(const face of faces){
    const color=rgb.map((x,i)=>Math.min(1,x*face.k*tint[i]));
    for(let t=0;t<6;t+=3)for(const v of [face.v[t],face.v[t+2],face.v[t+1]])
     floats.push(a[0]+v[0]*ext[0],a[1]+v[1]*ext[1],a[2]+v[2]*ext[2],...color);
   }
  }
 }
 return Object.freeze({
  vertices:new Float32Array(floats),sourceCells:b.placements.length,displayedCells:cells.length,
  triangles:boxCount*12,sourceVisibleBoxCount:boxCount,sourcePackVisibleBoxes:packBoxes,
  sourcePackCells:packCells,liveUnitCells:liveCells,
  uncertifiedStowedDoorStates:uncertifiedDoors,implicitPack5VariantPreviews:implicitPack5Variants,
  renderer:'CHROMIUM_WEBGL2_SOURCE_PACK_VISIBLE_AABB_CANDIDATE_DIAGNOSTIC',
  sourcePackVisibleAABBsRendered:true,realPackTexturesRendered:false,finalCollisionAndSupportApproved:false,
  worldPlaced:false,saveStateReplayed:false,creatorApproved:false,physicalIPhoneTested:false,cutaway
 });
}
