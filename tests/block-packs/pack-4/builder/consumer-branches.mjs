// Run only from the Pack4 disposable combined checkout in GitHub Actions.
// Read four independent builder PR snapshots without editing their branches.
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {writeFile,mkdir} from 'node:fs/promises';
import {resolvePack4BuilderBlueprint} from '../../../../src/block-packs/pack-4/builder-handoff.mjs';

const base=resolve(process.cwd(),'../consumers');
const load=async(lane,path)=>import(pathToFileURL(resolve(base,lane,path)).href);
const [r1,r2,r3,r4]=await Promise.all([
 load('r1','src/building-pool/roadmap-1/m1-buildings.mjs'),
 load('r2','src/building-pool/roadmap-2/m1-representatives.mjs'),
 load('r3','src/building-pool/roadmap-3/m1.mjs'),
 load('r4','src/building-pool/roadmap-4/m1-blueprints.mjs')
]);
const cohorts=[
 ['r1',r1.getM1Blueprints()],
 ['r2',r2.M1_REPRESENTATIVES],
 ['r3',r3.createM1Pool()],
 ['r4',r4.allM1()]
];
const reports=[];
for(const [lane,buildings] of cohorts){
 let resolvedCount=0,mountReviewCount=0,orientationReviewCount=0,withPack4=0;
 for(const b of buildings){
  const plan=resolvePack4BuilderBlueprint(b);
  if(plan.resolvedCount)withPack4++;
  resolvedCount+=plan.resolvedCount;
  mountReviewCount+=plan.placements.filter(p=>!p.supportVerified).length;
  orientationReviewCount+=plan.orientationReviewCount;
  for(const p of plan.placements){
   if(p.physical.visible.length<1||p.physical.collision.length<1||
      p.physical.selection.length<1||!p.physical.previewMesh.opaque)
    throw Error(lane+' yielded unreal Pack4 physical shape');
  }
 }
 if(resolvedCount<1)throw Error(lane+' has no real Pack4 candidate placement: broken handoff');
 reports.push({lane,blueprints:buildings.length,blueprintsUsingPack4:withPack4,
  resolvedPack4Cells:resolvedCount,mountReviewCount,orientationReviewCount,
  source:'exact original candidate physical geometry',liveInstalled:false});
}
await mkdir('artifacts/pack-4',{recursive:true});
await writeFile('artifacts/pack-4/builder-real-roadmaps.json',
 JSON.stringify({status:'PASS',reports},null,2)+'\n');
console.log('PACK4_REAL_BUILDERS '+JSON.stringify({status:'PASS',reports}));
