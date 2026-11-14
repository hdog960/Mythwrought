// M1-only physical-access, asset-reservation and architectural-distinction review.
// Standalone examination of candidate geometry, never a production-world adapter.
import {BIOMES,validateBlueprint} from './schema.mjs';
import {invariantGeometrySignature} from './m1-uniqueness.mjs';

const ASSETS={
 pack1:[1,2,3,4,5,6,7,8,9,10,11,12,47,48,49,50,51,52,53,54,55],
 pack2:[13,14,15,16,17,18,19,20,21,22,39,40,41,42,43,44,45,46],
 pack3:[23,24,25,26,27,28,29,69,70,71,72,73,74,75,76,77,78],
 pack4:[30,31,32,33,34,35,36,37,38,56,57,58,59,60,61,62,63,64,65,66,67,68],
 pack5:[79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96]
};
const key=v=>v.join(',');
const near=(v,p)=>[0,1,2].reduce((n,i)=>n+Math.abs(v[i]-p[i]),0);
const boundsDist=(v,r)=>v.reduce((n,a,i)=>n+(a<r.min[i]?r.min[i]-a:a>=r.max[i]?a-r.max[i]+1:0),0);
const directions=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
const neighbors=v=>directions.map(d=>[v[0]+d[0],v[1],v[2]+d[2]]);
const cellInRoom=(cell,r)=>cell.every((n,i)=>n>=r.min[i]&&n<r.max[i]);
const assert=(pred,msg)=>{if(!pred)throw new Error(msg);};

export function auditM1Building(b){
 validateBlueprint(b);
 assert(['house','tavern','stable'].includes(b.category),b.id+': unsupported candidate class');
 const occupied=new Map(b.placements.map(p=>[key(p.at),p]));
 const open=new Map(b.walkable.map(p=>[key(p),p]));
 const rooms=new Map(b.rooms.map(r=>[r.id,r]));
 const entrance=b.portals.filter(p=>p.from==='outside'||p.to==='outside');
 assert(entrance.length===1,b.id+': requires exactly one explicit external entrance');
 const external=entrance[0].at;
 assert(external[1]===1 && external[2]===1,b.id+': mislocated exterior threshold');
 const entranceOutside=[external[0],external[1],0];
 assert(open.has(key(entranceOutside)),b.id+': missing open outdoor standing cell');
 assert(!occupied.has(key(entranceOutside)),b.id+': entrance obstructed');
 assert(open.has(key(external)),b.id+': missing walkable doorway threshold');
 // Traverse real uninterrupted horizontal empty-cell path from the actual outside.
 const flood=new Set([key(entranceOutside)]),q=[entranceOutside];
 for(let i=0;i<q.length;i++)for(const v of neighbors(q[i])){
  const k=key(v);if(open.has(k)&&!flood.has(k)){flood.add(k);q.push(v);}
 }
 assert(flood.size===open.size,b.id+': inaccessible circulation despite declared walkable graph');
 for(const r of b.rooms){
  const cells=b.walkable.filter(v=>cellInRoom(v,r));
  assert(cells.length>=2,b.id+': '+r.id+' too small for genuine circulation');
  assert(cells.some(v=>flood.has(key(v))),b.id+': inaccessible room '+r.id);
 }
 for(const p of b.portals){
  const roles=[p.from,p.to].filter(x=>x!=='outside');
  assert(roles.every(id=>boundsDist(p.at,rooms.get(id))<=1),b.id+': '+p.from+' → '+p.to+' mislabeled / not adjacent to real rooms');
  assert(!occupied.has(key(p.at))&&!occupied.has(key([p.at[0],p.at[1]+1,p.at[2]])),b.id+': blocked door portal head/body');
  assert(neighbors(p.at).some(v=>open.has(key(v))),b.id+': no open neighbor through portal');
  const door=b.placements.find(q=>q.role==='door'&&q.mount?.[0]===p.at[0]&&q.mount?.[1]===p.at[2]);
  if(p.opening==='hinged-leaf'){
   assert(door&&door.asset==='pack2:020'&&door.doorState==='open-stowed',b.id+': declared hinged opening has no authored stowed leaf');
  }else if(p.opening==='open-stall-bay'){
   assert(b.category==='stable'&&!door,b.id+': open stall bay is mislabeled or incorrectly hinged');
   const x=p.at[0],z=p.at[2];
   for(const dz of [-1,1]){
    const q=occupied.get(key([x,1,z+dz]));
    assert(q&&q.role==='partition'&&(q.asset==='pack5:096'||q.asset==='live:wood'),b.id+': missing physical rails flanking open stall bay');
   }
  }else throw new Error(b.id+': doorway must specify hinged-leaf or open-stall-bay');
 }
 for(const cell of b.walkable){
  const [x,y,z]=cell;
  assert(!occupied.has(key([x,y+1,z])),b.id+': head strike at '+key(cell));
  assert(occupied.has(key([x,y-1,z])),b.id+': missing physical floor support under '+key(cell));
 }
 for(const p of b.placements){
  if(p.asset.startsWith('live:'))continue;
  const matched=/^(pack[1-5]):(\d{3})$/.exec(p.asset);
  assert(matched && ASSETS[matched[1]]?.includes(Number(matched[2])),b.id+': '+p.asset+' is missing from the actual five-pack roster');
  assert(p.occupancy.kind==='unresolved' && p.occupancy.bounds===null,b.id+': pretending a manual candidate is registered/has approved occupancy');
  assert(b.dependencies.some(d=>d.asset===p.asset&&d.status==='unresolved'&&d.requires.length>=3),b.id+': unresolved candidate lacks handoff');
 }
 const regional=b.architecturalIdentity;
 assert(typeof regional.regionalDetail==='string' && regional.physicalProfileCells>=4,b.id+': unsupported generic silhouette, regional outside-detail absent');
 const facade=b.placements.filter(p=>p.role==='support'&&p.at[1]>0&&(p.at[0]===0||p.at[0]===b.footprint.width-1||p.at[2]===0));
 assert(facade.length>=regional.physicalProfileCells,b.id+': regional physical profile missing from geometry');
 // An actual roof-frame beam layout is authored, but material load bearing is
 // deliberately NOT certified until Pack 2 shapes, anchors and long-span rules
 // can be tested in the live engine.
 const frame=b.placements.filter(p=>p.roofFrame);
 assert(regional.roofFrame?.spanApproval==='unresolved',b.id+': future timber strength must not be falsely certified');
 assert(regional.roofFrame.asset==='pack2:015'&&regional.roofFrame.cellCount===frame.length,
        b.id+': roof frame metadata does not match actual physical voxel count');
 assert(regional.roofFrame.sections>=2&&frame.length>=b.footprint.width-4,b.id+': roof lacks complete crossbeam spans');
 const beamZs=new Set(frame.filter(p=>p.roofFrame==='crossbeam').map(p=>p.at[2]));
 assert(beamZs.size===regional.roofFrame.sections,b.id+': roof structural section count not backed by actual crossbeams');
 for(const z of beamZs){
  for(let x=2;x<b.footprint.width-2;x++){
   const beam=frame.find(p=>p.roofFrame==='crossbeam'&&p.at[0]===x&&p.at[2]===z);
   assert(beam,b.id+': roof frame contains an unsupported empty span at '+x+','+z);
  }
  const y=frame.find(p=>p.roofFrame==='crossbeam'&&p.at[2]===z).at[1];
  assert(occupied.has(key([1,y,z]))&&occupied.has(key([b.footprint.width-2,y,z])),
         b.id+': timber crossbeam is not anchored into both external side walls');
 }
 for(const p of frame.filter(p=>p.roofFrame==='tie-post')){
  const [x,y,z]=p.at;
  assert(occupied.has(key([x,y+1,z])),b.id+': floating roof tie-post without immediate roof/beam contact');
 }
 const intended=regional.roomFurniture;
 for(const room of b.rooms){
  const actual=b.placements.filter(p=>p.role==='furnishing'&&p.room===room.id);
  const expected=room.id==='aisle'?0:room.id==='taproom'?3:room.id==='tack-room'?2:b.category==='stable'?1:2;
  assert(intended[room.id]===actual.length,b.id+': '+room.id+' planned/actual furnishing mismatch');
  assert(actual.length>=expected,b.id+': '+room.id+' lacks dedicated physical interior fittings');
  assert(actual.every(p=>cellInRoom(p.at,room)),b.id+': '+room.id+' furniture is actually in another room');
 }
 if(b.category==='tavern'){
  assert(b.rooms.some(r=>r.id==='taproom'),b.id+': no physical bar service room');
  assert(b.placements.some(p=>p.room==='taproom'&&p.asset==='pack5:086'),b.id+': no bar counter');
  assert(b.placements.some(p=>p.role==='furnishing'&&p.asset==='pack5:090')||b.rooms.length<3,b.id+': missing kitchen range');
 }
 if(b.category==='stable'){
  assert(Array.isArray(b.animals)&&b.animals.length===0,b.id+': animals are forbidden');
  assert(['west-front','east-front','west-rear','east-rear'].every(id=>rooms.has(id)),b.id+': missing stall bay');
  const candidateRails=b.placements.filter(p=>p.role==='partition'&&p.asset==='pack5:096');
  assert(candidateRails.length>=4,b.id+': no physical stable-stall edge rails');
  const axes=[b.architecturalIdentity.localEntrance[0]-2,b.architecturalIdentity.localEntrance[0]+2];
  assert(axes.every(x=>candidateRails.some(p=>p.at[0]===x)),b.id+': left/right aisles not partitioned into physical bays');
 }
 return {id:b.id,rooms:b.rooms.length,portals:b.portals.length,reachableCells:flood.size,unresolvedAssetFamilies:b.dependencies.length,physicalProfileCells:regional.physicalProfileCells,roofFrameCells:frame.length,roofSpanUnresolved:true};
}

export function auditM1Set(blueprints){
 assert(Array.isArray(blueprints)&&blueprints.length===45,'M1 candidate count cannot be silently changed');
 const sigs=new Map(),identities=new Map(),records=[];
 for(const b of blueprints){
  const r=auditM1Building(b),sig=invariantGeometrySignature(b);
  assert(!sigs.has(sig),'rotated/mirrored identity collision: '+b.id+' / '+sigs.get(sig));
  sigs.set(sig,b.id);
  // A meaningful independent archetype must not match the full plan/roof/feature
  // AND the actual regional massing identity. Dimensions alone do not count.
  const a=b.architecturalIdentity;
  const sem=[b.category,b.size,a.plan,a.roof,a.feature,a.regionalDetail].join('|');
  assert(!identities.has(sem),'architectural identity is only a resize/repaint: '+b.id+' / '+identities.get(sem));
  identities.set(sem,b.id);records.push(r);
 }
 assert(new Set(blueprints.map(b=>b.id)).size===45,'building IDs must never repeat');
 return {count:records.length,totalWalkable:records.reduce((n,r)=>n+r.reachableCells,0),totalPhysicalProfileCells:records.reduce((n,r)=>n+r.physicalProfileCells,0),records};
}

export function assertNoRepeatedBlueprintsInSettlement(ids){
 assert(Array.isArray(ids),'settlement building IDs must be a list');
 const seen=new Set();for(const id of ids){
  assert(typeof id==='string'&&id.startsWith('r1:'),'unexpected building pool ID');
  assert(!seen.has(id),'identical house/building blueprint reused in one settlement: '+id);
  seen.add(id);
 }
 return true;
}
