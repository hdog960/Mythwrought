// Source-exact READ ONLY dependency audit for the four independently owned
// building-roadmap candidates. No shared engine, PR, world or save mutations.
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import * as pack4 from '../../../../src/block-packs/pack-4/builder-handoff.mjs';
import {BIOME130_REGISTERED_SYMBOLS} from '../../../../src/biome130-registry.mjs';
const root=process.cwd(),consumers=resolve(root,'../consumers');
const importAt=async path=>import(pathToFileURL(path).href);
const sourceAt=(lane,suffix)=>resolve(consumers,lane,suffix);
const [p1,p3,manifest2,manifest5,...builders]=await Promise.all([
 importAt(sourceAt('p1','src/block-packs/pack-1/builder-handoff.mjs')),
 importAt(sourceAt('p3','src/block-packs/pack-3/manifest.mjs')),
 readFile(sourceAt('p2','src/block-packs/pack-2/manifest.json'),'utf8').then(JSON.parse),
 readFile(resolve(root,'src/block-packs/pack-5/manifest.json'),'utf8').then(JSON.parse),
 ...[1,2,3,4].map(n=>importAt(sourceAt('r'+n,'src/building-pool/roadmap-'+n+'/m1-pack4-physical.mjs')))
]);
const ref=(pack,n)=>'pack'+pack+':'+String(n).padStart(3,'0');
const catalogs=new Map([
 ['pack1',new Set(p1.PACK1_BUILDER_FAMILY_REFS)],
 ['pack2',new Set(manifest2.assetRecords.map(a=>ref(2,a.roster)))],
 ['pack3',new Set(p3.PACK3_ROSTER.map(a=>ref(3,a.roster)))],
 ['pack5',new Set(manifest5.entries.map(e=>e.symbolicId))],
 ['biome130',new Set(BIOME130_REGISTERED_SYMBOLS)]
]);
if([...catalogs.values()].some(s=>s.size===0))
 throw Error('Incomplete independent source catalog');
const sha=l=>execFileSync('git',['-C',resolve(consumers,l),'rev-parse','HEAD'],
 {encoding:'utf8'}).trim();
const provenance=Object.fromEntries(['p1','p2','p3','r1','r2','r3','r4'].map(k=>[k,sha(k)]));
const cellsOf=b=>{
 let cells;
 if(Array.isArray(b.placements))cells=b.placements.map(p=>({at:p.at,asset:p.asset}));
 else if(Array.isArray(b.voxels))cells=b.voxels.map(p=>({at:[p.x,p.y,p.z],asset:p.material}));
 else if(Array.isArray(b.modules))cells=b.modules.flatMap(m=>m.cells.map(p=>({at:p.slice(0,3),asset:p[3]})));
 else if(Array.isArray(b.cells))cells=b.cells.map(p=>({at:p.at,asset:p.asset}));
 else throw Error('Unknown independent blueprint schema');
 return new Map(cells.map(c=>[c.at.join(','),c]));
};
// Both candidate cell meshes are original Pack4 collision AABB unions.
// World-space contact requires true boundary match and positive orthogonal area.
function faceContact(p,q){
 const delta=p.supportAt.map((v,i)=>v-p.at[i]);
 const axis=delta.findIndex(v=>v!==0);
 if(axis<0||delta.filter(v=>v!==0).length!==1||Math.abs(delta[axis])!==1)
  return false;
 const forward=delta[axis]>0,other=[0,1,2].filter(i=>i!==axis);
 return p.physical.collision.some(a=>q.physical.collision.some(b=>{
  const aFace=p.at[axis]+a[axis+(forward?3:0)];
  const bFace=q.at[axis]+b[axis+(forward?0:3)];
  return Math.abs(aFace-bFace)<1e-6&&other.every(i=>
   Math.min(p.at[i]+a[i+3],q.at[i]+b[i+3])-
   Math.max(p.at[i]+a[i],q.at[i]+b[i])>1e-6);
 }));
}
const totals={pack4ContactVerified:0,pack4NoContact:0,
 otherPackCatalogResolved:0,otherPackUnknown:0,
 otherPackFaceContactUnverified:0,legacySupport:0,unclassified:0,
 missingSupport:0,notRequired:0};
const byPack={},missing=[],notContact=[],unknown=[],unclassifiedExamples=[],referenced=new Set();
for(let n=1;n<=4;n++){
 const views=builders[n-1].getM1Pack4Construction(pack4);
 for(const view of views){
  const slots=cellsOf(view.physicalSource??view.source);
  const pack4Slots=new Map(view.physicalPlan.placements.map(p=>[p.at.join(','),p]));
  for(const p of view.physicalPlan.placements){
   if(!p.supportAt){totals.notRequired++;continue;}
   const s=slots.get(p.supportAt.join(','));
   if(!s){totals.missingSupport++;if(missing.length<15)missing.push({roadmap:n,blueprint:view.blueprintId,id:p.candidateId,supportAt:p.supportAt});continue;}
   const fam=typeof s.asset==='string'?s.asset.split(':')[0]:'invalid';
   if(fam==='pack4'){
    const q=pack4Slots.get(p.supportAt.join(','));
    if(q&&faceContact(p,q))totals.pack4ContactVerified++;
    else {totals.pack4NoContact++;if(notContact.length<15)notContact.push({roadmap:n,blueprint:view.blueprintId,id:p.candidateId,supportRef:s.asset,supportAt:p.supportAt});}
   }else if(catalogs.has(fam)){
    referenced.add(s.asset);
    if(catalogs.get(fam).has(s.asset)){
     totals.otherPackCatalogResolved++;totals.otherPackFaceContactUnverified++;
     byPack[fam]=(byPack[fam]??0)+1;
    }else{
     totals.otherPackUnknown++;
     if(unknown.length<25)unknown.push({roadmap:n,blueprint:view.blueprintId,ref:s.asset,at:p.supportAt});
    }
   }else if(fam==='live')totals.legacySupport++;
   else {totals.unclassified++;if(unclassifiedExamples.length<25)
    unclassifiedExamples.push({roadmap:n,blueprint:view.blueprintId,asset:s.asset,at:p.supportAt});}
  }
 }
}
const report={status:'READ_ONLY_SOURCE_EXACT',provenance,
 pack4SourceHead:process.env.GITHUB_SHA??null,
 totals,otherPackRefs:[...referenced].sort(),otherPackKnownByPack:byPack,
 missingExamples:missing,pack4NoContactExamples:notContact,unknownExamples:unknown,
 unclassifiedExamples,
 guarantees:{
  pack4ContactVerified:'Exact collision AABB subbox overlap on common neighboring face',
  otherPackCatalogResolved:'Reference exists in source-pinned original catalog ONLY',
  otherPackFaceContactUnverified:'NOT certified as load-bearing or physically touching',
  noProductionRegistry:true,noWorldOrSaveMutation:true,
  noOtherPackModifications:true
 }};
await mkdir('artifacts/pack-4',{recursive:true});
await writeFile('artifacts/pack-4/crosspack-dependency-audit.json',JSON.stringify(report,null,2)+'\n');
console.log('PACK4_CROSSPACK_DEPENDENCY_AUDIT '+JSON.stringify({totals,byPack,unresolved:totals.otherPackFaceContactUnverified+totals.pack4NoContact,
 knownCatalogs:[...catalogs].map(([k,s])=>[k,s.size])}));
if(totals.missingSupport||totals.otherPackUnknown)
 throw Error('Pack 4 builder dependency references missing or unknown candidate families');
