/**
 * Builder 3A M3: true merged Pack physical-family collider check for
 * fifth-variant H-plan carpentry/stonemasonry. Native AABB collision and support evidence,
 * NOT production placement, heat certification or structural approval.
 */
import {createM3CarpenterFifthPool} from './m3-carpenter-fifth-variants.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {auditLegacyBlacksmithSupports} from './legacy-physical-support-audit.mjs';

const k=(x,y,z)=>x+','+y+','+z,at=c=>k(...c.slice(0,3));
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
const worldBox=(b,c)=>b.map((v,i)=>v+c[i%3]);
const intersects=(a,b)=>{
 const e=1e-7;
 return a[0]<b[3]-e&&b[0]<a[3]-e&&a[1]<b[4]-e&&b[1]<a[4]-e&&a[2]<b[5]-e&&b[2]<a[5]-e;
};
function meta(c){
 const p=c[4]??{};
 return {orientation:p.orientation??'north',variant:p.variant??null,state:p.state??{}};
}
export function auditM3CarpenterFifthPhysicalFit(){
 const models=createM3CarpenterFifthPool(),out=[],legacy=auditLegacyBlacksmithSupports();
 const resolved=new Map();let fixtureIntersections=0,missingSupports=0,occupiedReservationBlocks=0;
 let roofBearingWitnessAbsent=0,roofBearingSamples=0,corridorIntrusions=0;
 function resolve(c){
  const input=meta(c),id=c[3]+'|'+JSON.stringify(input);
  if(!resolved.has(id))resolved.set(id,resolveManualFivePackAsset(c[3],input));
  return resolved.get(id);
 }
 for(const b of models){
  const cellList=b.modules.flatMap(m=>m.cells);
  const filled=new Map(cellList.map(c=>[at(c),c])),fixtures=[],roles=new Map(b.modules.map(m=>[m.role,m.cells]));
  const physicalPieces=roles.get('fixture')??[]; // inspect every source fixture, including real Pack2 joinery benches and Pack1 stone carving blocks
  for(const c of physicalPieces){
   const shape=resolve(c),p=c.slice(0,3);
   const reservations=shape.occupiedOffsets.filter(o=>o.some(v=>v!==0))
     .map(o=>plus(p,o)).filter(o=>filled.has(k(...o)));
   const supporting=shape.supportOffsets.map(o=>plus(p,o));
   const missing=supporting.filter(o=>!filled.has(k(...o)));
   occupiedReservationBlocks+=reservations.length;missingSupports+=missing.length;
   let hits=0,neighborCells=0;
   for(let x=p[0]-2;x<=p[0]+2;x++)for(let y=p[1]-2;y<=p[1]+2;y++)for(let z=p[2]-2;z<=p[2]+2;z++){
    const other=filled.get(k(x,y,z));if(!other||other===c)continue;
    neighborCells++;
    const neighbor=resolve(other);
    if(shape.collisionBoxes.some(a=>neighbor.collisionBoxes.some(d=>
       intersects(worldBox(a,p),worldBox(d,other)))))hits++;
   }
   fixtureIntersections+=hits;
   fixtures.push({at:p,asset:c[3],physicalNumericId:shape.numericId,
    orientation:meta(c).orientation,realVariant:shape.variant,
    realOccupiedOffsets:shape.occupiedOffsets.length,
    nearbyPhysicalCellsChecked:neighborCells,
    collisionAABBIntersections:hits,missingSourceSupports:missing,
    blockedMultiCellReservations:reservations,livePlaceable:shape.livePlaceable});
  }
  // Geometry-support witness only. Never assert engineering load capacity from
  // a purlin's proximity. Count unanswered roof positions, not "safety passes".
  const supports=[...(roles.get('roof-purlin')??[]),...(roles.get('bearing-pier')??[]),
    ...(roles.get('wall')??[]),...(roles.get('bearing-pier')??[])];
  const sampled=roles.get('roof')??[];
  const structuralIndex=new Set(supports.map(s=>k(...s.slice(0,3))));
  let unknown=0,n=0;
  for(let i=0;i<sampled.length;i+=5){
   const c=sampled[i];n++;
   let isNearby=false;
   for(let dx=-3;dx<=3&&!isNearby;dx++)for(let dz=-3;dz<=3&&!isNearby;dz++){
    if(Math.abs(dx)+Math.abs(dz)>3)continue;
    for(let dy=0;dy<=2;dy++)if(structuralIndex.has(k(c[0]+dx,c[1]-dy,c[2]+dz))){
     isNearby=true;break;
    }
   }
   if(!isNearby)unknown++;
  }
  roofBearingWitnessAbsent+=unknown;roofBearingSamples+=n;
  // Check real physical source AABB footprint not only vacant nominal cells
  // along the 2-wide x 3-high all-building through spine.
  const entry=b.navigation.nodes[0],roofClearance=[];
  for(let z=2;z<b.envelope.depth;z+=3)for(let x=entry.x;x<entry.x+2;x++)for(let y=2;y<=4;y++){
   const cube=[x,y,z,x+1,y+1,z+1];
   const nearby=[];
   for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++){
    const c=filled.get(k(x+dx,y+dy,z+dz));if(c)nearby.push(c);
   }
   for(const neighbor of nearby){
    const box=resolve(neighbor).collisionBoxes;
    if(box.some(a=>intersects(cube,worldBox(a,neighbor)))){
     corridorIntrusions++;roofClearance.push([x,y,z,neighbor[3],neighbor.slice(0,3)]);
    }
   }
  }
  out.push({id:b.id,sourceCandidateOnly:true,notProductionApproved:true,
    sourceCellCount:cellList.length,provenance:'native real merged producer AABBs',
    sourceNominalTwoWideRoute:true,fixtureCount:fixtures.length,
    roofSamples:n,roofSampleWithoutNearbyBearingWitness:unknown,
    sampledCorridorIntrusions:roofClearance,
    physicalRoofLoadAccepted:false,heatApproved:false,weatherApproved:false,
    inspectedFixtures:fixtures});
 }
 return Object.freeze({schema:'mythwrought.builder3a.m3.carpenter-fifth-physical-aabb.v1',
  sampledModels:models.length,sourceOnly:true,productionPlaced:0,
  oldLegacyMountBlockersStillOpen:legacy.missingSupports,
  inheritedBlueprintsModified:false,
  producerShapeFamiliesUsed:resolved.size,
  physicalFixtureAABBIntersections:fixtureIntersections,
  missingAuthoredSupports:missingSupports,
  overlappingOccupiedOffsets:occupiedReservationBlocks,
  roofBearingSamples,roofBearingWitnessAbsent,
  sampledPhysicalCorridorIntrusions:corridorIntrusions,
  structuralCapacityCertified:false,roofWeatherCertified:false,
  fullBlockWorldMeshRendered:false,iPhoneHardwareTested:false,
  models:out});
}
