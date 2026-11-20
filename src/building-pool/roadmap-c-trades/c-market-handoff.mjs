// C7 source-only public-market architectural handoff.
// Deliberately no settlement placer, world spawn, save mutation, or runtime registration.
import {createHash} from 'node:crypto';
import {structuralFingerprint} from '../roadmap-2b/schema.mjs';
import {createCDesertSmallMarket} from './wave1-desert-market.mjs';

const freeze=o=>Object.freeze(o);
export function createCDesertMarketHandoff(){
 const bp=createCDesertSmallMarket(),foundation=bp.voxels.filter(v=>v.kind==='foundation');
 const min=(k)=>Math.min(...foundation.map(v=>v[k])),max=(k)=>Math.max(...foundation.map(v=>v[k]));
 const sourceFingerprint=createHash('sha256').update(structuralFingerprint(bp)).digest('hex');
 const occupied=new Set(bp.voxels.map(v=>v.x+','+v.y+','+v.z));
 const openColumns=bp.physicalOpenCourts.flatMap(r=>{
  const out=[];
  for(let x=r.x0;x<=r.x1;x++)for(let z=r.z0;z<=r.z1;z++){
   for(let y=0;y<bp.extents.y;y++)
    if(occupied.has(x+','+y+','+z))throw Error('Roadmap C handoff falsely advertises an open physical courtyard');
   out.push([x,z]);
  }
  return out;
 });
 const entry=bp.openings.find(x=>x.type==='entrance');
 if(!entry||entry.clearHeightCells<3)throw Error('Roadmap C market handoff lacks physical street entrance');
 return freeze({
  schema:'mythwrought.roadmap-c.market-handoff.v1',
  id:bp.id,category:bp.category,biome:bp.biome,size:bp.size,
  sourceOnly:true,creatorApproved:false,gameRegistered:false,worldPlaced:false,
  sourceFingerprint:freeze({algorithm:'sha256',geometryDigest:sourceFingerprint,
   authoredVoxelCount:bp.voxels.length}),
  actualFootprint:freeze({x:min('x'),z:min('z'),width:max('x')-min('x')+1,
   depth:max('z')-min('z')+1,occupiedGroundColumns:foundation.length,
   actualEnvelope:freeze({...bp.extents})}),
  streetEntrance:freeze({x:entry.x,y:entry.y,z:entry.z,width:2,height:entry.clearHeightCells,facing:'north'}),
  publicApproach:freeze(bp.routeTargets.map(t=>freeze({...t}))),
  retailVendorSockets:freeze(bp.boothApproaches.map(t=>freeze({...t}))),
  openAirGroundColumns:freeze(openColumns.map(x=>freeze([...x]))),
  physicalDependencies:freeze(bp.unresolvedDependencies.map(d=>d.ref)),
  constraints:freeze({flatPublicGround:true,retainTwentyOneTrueSourceVoids:true,
   mustReserveTwoWideRoad:true,threeHighAccess:true,publicMarketNoNpc:true}),
  performance:freeze({actualSourceVoxelCount:bp.voxels.length,producerMeshTriangleBudgetVerified:false,
   sourceCollisionBudgetVerified:false}),
  evidence:freeze({requiredViews:6,viewports:freeze([[667,375],[844,390],[932,430]]),
   realSourceWebGL2Verified:false,producerPhysicalShapesApproved:false,realIPhoneApproved:false}),
  limitations:freeze(['Pack1–5 producer AABB/yaw and glass opacity not independently certified',
   'No trading NPCs, local economy, settlement spawning, powered fixtures or game-world placement'])
 });
}
