// Pack4's disposable CI verifies builder-OWNED physical adoption modules
// in exact SHA-pinned independent building PRs, without modifying their branches.
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {writeFile,mkdir} from 'node:fs/promises';
import * as pack4 from '../../../../src/block-packs/pack-4/builder-handoff.mjs';

const root=resolve(process.cwd(),'../consumers');
const names=['r1','r2','r3','r4'];
const expected=[45,30,30,30];
const imported=await Promise.all(names.map((lane,index)=>import(
 pathToFileURL(resolve(root,lane,'src/building-pool/roadmap-'+(index+1)+'/m1-pack4-physical.mjs')).href
)));
const reports=[];
for(let i=0;i<names.length;i++){
 const lane=names[i],src=imported[i];
 if(src.PACK4_CONSTRUCTION_SOURCE?.pr!==115||
    src.PACK4_CONSTRUCTION_SOURCE?.variantCount!==23)
  throw Error(lane+' did not adopt expected Pack4 physical catalog API');
 const designs=src.getM1Pack4Construction(pack4);
 if(designs.length!==expected[i])throw Error(lane+' unexpected authored design count '+designs.length);
 let resolvedCount=0,mountReviewCount=0,orientationReviewCount=0,withPack4=0;
 for(const design of designs){
  if(design.pack4Cells!==design.physicalPlan.resolvedCount||
     design.livePlaced!==false)
   throw Error(lane+' has invalid builder physical-plan metadata');
  if(design.pack4Cells)withPack4++;
  resolvedCount+=design.pack4Cells;
  mountReviewCount+=design.mountingSupportReviewCount;
  orientationReviewCount+=design.orientationReviewCount;
  for(const p of design.physicalPlan.placements){
   if(p.physical.visible.length<1||p.physical.collision.length<1||
      p.physical.selection.length<1||
      !(p.physical.previewMesh.opaque instanceof Float32Array))
    throw Error(lane+' yielded non-physical Pack4 building geometry');
  }
 }
 if(resolvedCount<1)throw Error(lane+' unresolved physical Pack4 usage');
 reports.push({lane,blueprints:designs.length,blueprintsUsingPack4:withPack4,
  resolvedPack4Cells:resolvedCount,mountReviewCount,orientationReviewCount,
  builderOwnedModule:true,realPhysicalGeometry:true,
  source:'exact original Pack4 geometry injected into owned building PR adapter',
  liveInstalled:false});
}
await mkdir('artifacts/pack-4',{recursive:true});
await writeFile('artifacts/pack-4/builder-real-roadmaps.json',
 JSON.stringify({status:'PASS',reports},null,2)+'\n');
console.log('PACK4_REAL_BUILDERS '+JSON.stringify({status:'PASS',reports}));
