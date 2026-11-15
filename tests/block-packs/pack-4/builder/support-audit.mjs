// Read only. Diagnose actual mounting/support cells in all 4 exact-head
// independent building roadmaps, without assuming future asset solidity.
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
import * as pack4 from '../../../../src/block-packs/pack-4/builder-handoff.mjs';
const base=resolve(process.cwd(),'../consumers');
const names=['r1','r2','r3','r4'];
const mod=await Promise.all(names.map((lane,i)=>import(pathToFileURL(
 resolve(base,lane,'src/building-pool/roadmap-'+(i+1)+'/m1-pack4-physical.mjs')).href)));
const cellsOf=b=>{
 let cells;
 if(Array.isArray(b.placements))cells=b.placements.map(p=>({at:p.at,asset:p.asset,role:p.role}));
 else if(Array.isArray(b.voxels))cells=b.voxels.map(p=>({at:[p.x,p.y,p.z],asset:p.material,role:p.kind}));
 else if(Array.isArray(b.modules))cells=b.modules.flatMap(m=>m.cells.map(p=>({at:p.slice(0,3),asset:p[3],role:m.role})));
 else if(Array.isArray(b.cells))cells=b.cells.map(p=>({at:p.at,asset:p.asset,role:p.role}));
 else throw Error('Unsupported building format');
 return new Map(cells.map(c=>[c.at.join(','),c]));
};
const records=[],total={missing:0,live:0,otherPack:0,pack4:0,notRequired:0,other:0};
for(let i=0;i<names.length;i++){
 const lane=names[i],designs=mod[i].getM1Pack4Construction(pack4);
 const report={lane,designs:designs.length,pack4Cells:0,mounted:0,missing:0,
  live:0,otherPack:0,pack4:0,notRequired:0,other:0,
  missingExamples:[],missingById:{},pendingFacingById:{}};
 for(const design of designs){
  const cells=cellsOf(design.source);
  for(const p of design.physicalPlan.placements){
   report.pack4Cells++;
   if(p.orientationRequiresReview)
    report.pendingFacingById[p.candidateId]=(report.pendingFacingById[p.candidateId]||0)+1;
   const id=p.candidateId;
   if(!p.supportAt){report.notRequired++;total.notRequired++;continue;}
   report.mounted++;
   const actual=cells.get(p.supportAt.join(','));
   const cat=!actual?'missing':actual.asset.startsWith('live:')?'live':
    actual.asset.startsWith('pack4:')?'pack4':/^pack[1-5]:|^biome130:/.test(actual.asset)?'otherPack':'other';
   report[cat]++;total[cat]++;
   if(cat==='missing'){
    report.missingById[id]=(report.missingById[id]||0)+1;
    const entry={blueprint:design.blueprintId,id,ref:p.asset,at:p.at,
     mount:p.mount,rotation:p.rotation,supportAt:p.supportAt,
     nearby:[]};
    for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,-1,0],[0,1,0]]){
     const q=[p.at[0]+dx,p.at[1]+dy,p.at[2]+dz],
       neighbor=cells.get(q.join(','));
     if(neighbor)entry.nearby.push({offset:[dx,dy,dz],asset:neighbor.asset,role:neighbor.role});
    }
    records.push({...entry,lane});
    if(report.missingExamples.length<12)report.missingExamples.push(entry);
   }
  }
 }
 report.mountedSupportCellsPresent=report.mounted-report.missing;
 report.mountCoverageRate=report.mounted?Number((report.mountedSupportCellsPresent/report.mounted).toFixed(4)):1;
 console.log('PACK4_SUPPORT_AUDIT_LANE '+JSON.stringify(report));
}
const result={status:'AUDITED',total,missingDetails:records,claims:{
 'live':'live catalog cell planned; not proof of world placement',
 'pack4':'original physical candidate cell planned; requires contact validation',
 'otherPack':'future symbolic cell planned; physical solidity still unresolved',
 'missing':'NO authored occupied support in required neighboring cell'
}};
await mkdir('artifacts/pack-4',{recursive:true});
await writeFile('artifacts/pack-4/builder-support-audit.json',JSON.stringify(result,null,2)+'\n');
console.log('PACK4_SUPPORT_AUDIT_TOTAL '+JSON.stringify(total));
