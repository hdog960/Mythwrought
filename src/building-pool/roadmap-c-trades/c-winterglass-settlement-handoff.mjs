// Roadmap C C7: literal source-only Winterglass future-settlement interface.
// Read-only; never activates town placement, shops, merchants, saves or NPCs.
import {createHash} from 'node:crypto';
import {structuralFingerprint} from '../roadmap-2b/schema.mjs';
import {createCWinterglassMarket} from './wave6-winterglass-snow-market.mjs';
export function createCWinterglassHandoff(){
 const b=createCWinterglassMarket();
 const cells=new Set(b.voxels.map(v=>[v.x,v.y,v.z].join(',')));
 const ground=b.voxels.filter(v=>v.kind==='foundation');
 const windows=b.voxels.filter(v=>v.kind==='window');
 const roofs=b.voxels.filter(v=>v.kind==='roof');
 if(ground.length!==1929||roofs.length!==710||windows.length!==28||b.actualSourceCourts.length!==30)
  throw Error('C7 Winterglass original geometry witness drift');
 for(const p of b.actualSourceCourts)for(let y=0;y<b.extents.y;y++)
  if(cells.has([p.x,y,p.z].join(',')))throw Error('C7 false physically open thermal source cell');
 for(const e of b.originalBooths){
  const {x,z}=e.approach;
  if(!cells.has([x,0,z].join(','))||!cells.has([x,1,z].join(','))||
    [2,3,4].some(y=>cells.has([x,y,z].join(','))))
   throw Error('C7 Winterglass booth physically blocked '+e.name);
 }
 const digest=createHash('sha256').update(structuralFingerprint(b)).digest('hex');
 const fx=ground.map(v=>v.x),fz=ground.map(v=>v.z);
 const frozen=Object.freeze;
 return frozen({
  schema:'mythwrought.roadmap-c.winterglass-snow-market-handoff.v1',
  id:b.id,category:b.category,biome:b.biome,
  sourceOnly:true,approvedForProduction:false,registeredInGame:false,
  settlementPlaced:false,merchantAIEnabled:false,worldGenerationEnabled:false,
  sourceWitness:frozen({sha256:digest,voxelCells:b.voxels.length,
   foundationColumns:ground.length,roofCells:roofs.length,glassCells:windows.length}),
  envelope:frozen({...b.extents}),
  actualFoundation:frozen({x:Math.min(...fx),z:Math.min(...fz),
   width:Math.max(...fx)-Math.min(...fx)+1,depth:Math.max(...fz)-Math.min(...fz)+1}),
  roadSockets:frozen([frozen({x:24,y:2,z:0,width:2,headroom:3,facing:'south'})]),
  tradeBooths:frozen(b.originalBooths.map(q=>frozen({
   name:q.name,roofHeight:q.roofY,
   sourceApproach:frozen({...q.approach}),bounds:frozen({...q.bounds}),
   activeMerchant:false}))),
  trueSourceAbsentGround:frozen(b.actualSourceCourts.map(q=>frozen({...q}))),
  realPublicPlazaWitness:frozen(b.publicWaypoints.map(q=>frozen({...q}))),
  unresolvedProducerAssets:frozen([...new Set(b.voxels.map(v=>v.material))].sort()),
  technicalAcceptance:frozen({sourceCIComplete:false,strictHistoricalB205D4Passed:false,
   sixWebGL2PNGsIndependentlyAudited:false,realProducerAABBAndYawPassed:false,
   iPhoneArtApproved:false}),
  knownGaps:frozen(['no real Pack1-5 roof/ice geometry certified',
   'no NPC commerce, weather simulation or village placement',
   'PWA saves and production registration remain untouched'])
 });
}
