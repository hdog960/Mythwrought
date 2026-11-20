// Future settlement interface for original C-only Sandglass Fork barracks.
// Read-only architecture manifest. DOES NOT add world placement, NPCs or saves.
import {createHash} from 'node:crypto';
import {geometryFingerprint} from './contract.mjs';
import {createCRoadmapCDesertBarracks} from './c4-sandglass-fork-desert-barracks.mjs';

const freeze=o=>Object.freeze(o),at=(x,y,z)=>[x,y,z].join(',');
export function createCRoadmapCBarracksHandoff(){
 const b=createCRoadmapCDesertBarracks();
 if(b.id!=='r3:barracks:desert:medium:2'||b.activated)
  throw Error('Roadmap C7 barracks source identity/activation drift');
 const voxels=b.modules.flatMap(m=>m.cells.map(c=>c.slice(0,3)));
 const solid=new Set(voxels.map(p=>p.join(',')));
 const ground=b.modules.find(m=>m.role==='foundation').cells;
 const floor=b.modules.find(m=>m.role==='floor').cells;
 if(ground.length!==1757||floor.length!==1757)
  throw Error('Roadmap C7 barracks foundation witness drift');
 let corridorCells=0;
 for(let z=0;z<=48;z++)for(let x=24;x<=25;x++){
  if(!solid.has(at(x,0,z))||!solid.has(at(x,1,z))||
   [2,3,4].some(y=>solid.has(at(x,y,z))))
   throw Error('Roadmap C7 false two-wide street-to-parade barracks passage '+[x,z]);
  corridorCells++;
 }
 const wells=b.physicalCourtyardVoids.map(w=>{
  let count=0;
  for(let x=w.x0;x<=w.x1;x++)for(let z=w.z0;z<=w.z1;z++){
   if(Array.from({length:b.envelope.height},(_,y)=>y).some(y=>solid.has(at(x,y,z))))
    throw Error('Roadmap C7 guard court is not truly open at '+[x,z]);
   count++;
  }
  return freeze({...w,groundAbsentColumns:count});
 });
 const positions=ground.map(([x,y,z])=>[x,z]);
 const minX=Math.min(...positions.map(p=>p[0])),maxX=Math.max(...positions.map(p=>p[0]));
 const minZ=Math.min(...positions.map(p=>p[1])),maxZ=Math.max(...positions.map(p=>p[1]));
 const digest=createHash('sha256').update(geometryFingerprint(b)).digest('hex');
 return freeze({
  schema:'mythwrought.roadmap-c.garrison-settlement-handoff.v1',id:b.id,
  sourceOnly:true,producerFitCertified:false,gameRegistered:false,settlementPlaced:false,
  citizenAndMobSpawnsEnabled:false,
  sourceFingerprint:freeze({sha256:digest,authoredVoxels:voxels.length}),
  envelope:freeze({...b.envelope}),
  occupiedFoundation:freeze({x:minX,z:minZ,width:maxX-minX+1,depth:maxZ-minZ+1,columns:ground.length}),
  continuousGroundCorridor:freeze({axis:'z',x0:24,x1:25,z0:0,z1:48,clearHeight:3,verifiedColumns:corridorCells}),
  roadSockets:freeze(b.openings.map(x=>freeze({...x}))),
  chamberSockets:freeze(b.spaces.map(s=>freeze({id:s.id,kind:s.kind,accessNode:s.accessNode,
   bounds:freeze({...s.bounds})}))),
  elevatedGuardPosition:freeze({x:20,y:7,z:44,realTreadCount:8,
   stairFoot:freeze({x:22,y:2,z:40})}),
  sourceOpenCourts:freeze(wells),
  neededPhysicalFamilies:freeze([...new Set(b.modules.flatMap(m=>m.cells.map(c=>c[3])))].sort()),
  acceptance:freeze({exactHeadCI:false,chromiumSixViewEvidence:false,
   physicalAssetAABB:false,physicalCollision:false,creatorArt:false,iPhoneWalkTest:false}),
  unresolved:freeze(['No physical barracks bedding family certified',
   'Manual Pack producer rotations and resolved AABBs not independently approved',
   'No settlement placement, defense AI, guards, soldier inventory or schema save mutations'])
 });
}
