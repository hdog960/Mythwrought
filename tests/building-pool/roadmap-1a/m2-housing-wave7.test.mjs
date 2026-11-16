// Builder 1A isolated M2 wave7: exact inherited source, concave architecture, 3D access and producer AABBs.
// This is NOT live registration, world placement, final art, physical-iPhone certification, or a merge approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1a/legacy-buildings.mjs';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {getM2Originals} from '../../../src/building-pool/roadmap-1a/m2-originals.mjs';
import {getM2HousingTranche} from '../../../src/building-pool/roadmap-1a/m2-housing-tranche.mjs';
import {getM2HousingWave2} from '../../../src/building-pool/roadmap-1a/m2-housing-wave2.mjs';
import {getM2HousingWave3} from '../../../src/building-pool/roadmap-1a/m2-housing-wave3.mjs';
import {getM2HousingWave4} from '../../../src/building-pool/roadmap-1a/m2-housing-wave4.mjs';
import {getM2HousingWave5} from '../../../src/building-pool/roadmap-1a/m2-housing-wave5.mjs';
import {getM2HousingWave6} from '../../../src/building-pool/roadmap-1a/m2-housing-wave6.mjs';
import {getM2HousingWave7,M2_HOUSING_WAVE7_IDS} from '../../../src/building-pool/roadmap-1a/m2-housing-wave7.mjs';
import {validatePool,validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-1a/legacy-schema.mjs';
import {findMirroredOrRotatedDuplicates} from '../../../src/building-pool/roadmap-1a/legacy-uniqueness.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';

const prior=[...getM1Blueprints(),...getM1InnExemplars(),...getM2Originals(),...getM2HousingTranche(),
 ...getM2HousingWave2(),...getM2HousingWave3(),...getM2HousingWave4(),...getM2HousingWave5(),...getM2HousingWave6()];
const fresh=getM2HousingWave7(),all=[...prior,...fresh],key=v=>v.join(',');
const gitBlobSha=path=>{
 const bytes=readFileSync(new URL(path,import.meta.url));
 return createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
};
function planar(b){
 return new Set(b.placements.filter(p=>p.role==='partition'&&p.at[1]===1)
  .map(p=>Math.floor(16*p.at[0]/b.footprint.width)+','+Math.floor(16*p.at[2]/b.footprint.depth)));
}
function outline(b){
 const {width:w,depth:d}=b.footprint,notches=b.architecturalIdentity.exteriorNotches??[],out=new Set();
 for(let a=0;a<16;a++)for(let c=0;c<16;c++){
  const x=Math.min(w-1,Math.floor((a+.5)*w/16)),z=Math.min(d-1,Math.floor((c+.5)*d/16));
  if(notches.every(n=>x<n[0]||x>n[2]||z<n[1]||z>n[3]))out.add(a+','+c);
 }
 return out;
}
const iou=(a,b)=>{const intersection=[...a].filter(k=>b.has(k)).length;return intersection/(a.size+b.size-intersection||1);};

test('129 pre-wave7 candidates retained and wave6 source frozen at previously validated Git blob',()=>{
 assert.equal(prior.length,129);
 assert.equal(gitBlobSha('../../../src/building-pool/roadmap-1a/m2-housing-wave6.mjs'),
  '765c901609dfc8a834ec8ac3b9c61ca698d7e6d1');
 // Existing wave6 suite protects the first 114 complete source objects by its independent JSON fingerprint fixture.
 assert.equal(new Set(prior.map(b=>b.id)).size,129);
});
test('15 original houses, one per biome/size, 71243 physical voxels, 2463 removed columns, 79 rooms',()=>{
 assert.equal(fresh.length,15);
 assert.deepEqual(fresh.map(b=>b.id),M2_HOUSING_WAVE7_IDS);
 assert.equal(fresh.reduce((s,b)=>s+b.placements.length,0),71243);
 assert.equal(fresh.reduce((s,b)=>s+b.architecturalIdentity.exteriorVoidFootprintCells,0),2463);
 assert.equal(fresh.reduce((s,b)=>s+b.rooms.length,0),79);
 assert.equal(new Set(fresh.map(b=>b.architecturalIdentity.plan)).size,15);
 for(const biome of ['temperate','desert','snow','enchanted-forest','mountain'])
  for(const size of ['small','medium','large'])
   assert.equal(fresh.filter(b=>b.biome===biome&&b.size===size&&b.category==='house').length,1,biome+'/'+size);
});
test('full 144 authored pool: schema, structural D4, IDs, status, family quotas',()=>{
 assert.equal(validatePool(all).authored,144);
 assert.equal(new Set(all.map(b=>b.id)).size,144);
 assert.equal(new Set(all.map(structuralFingerprint)).size,144);
 assert.deepEqual(findMirroredOrRotatedDuplicates(all),[]);
 assert.deepEqual(all.reduce((o,b)=>(o[b.category]=(o[b.category]??0)+1,o),{}),
  {house:123,tavern:17,inn:4});
 assert.ok(all.every(b=>b.status==='candidate'&&b.worldPlacement===false&&b.liveIntegration===false));
});
test('all wave7 new architecture differs in floor partition and real concave exterior outline',()=>{
 const oldP=prior.map(planar),oldO=prior.map(outline),newP=fresh.map(planar),newO=fresh.map(outline);
 for(let j=0;j<fresh.length;j++)for(let i=0;i<prior.length+j;i++){
  const p=i<prior.length?oldP[i]:newP[i-prior.length],o=i<prior.length?oldO[i]:newO[i-prior.length];
  assert.ok(iou(p,newP[j])<.88,'near duplicate partition '+all[i].id+' vs '+fresh[j].id);
  assert.ok(iou(o,newO[j])<.975,'near duplicate footprint '+all[i].id+' vs '+fresh[j].id);
 }
});
for(const b of fresh){
 test('exact physically empty L/U/T recess, roof/support, accessible source rooms '+b.id,()=>{
  assert.equal(validateBlueprint(b),true);
  const {width:w,depth:d,height:h}=b.footprint,n=b.architecturalIdentity.exteriorNotches;
  assert.ok(n?.length>=1,'missing authored exterior void');assert.equal(b.architecturalIdentity.exteriorOutline,'genuine-concave-perimeter');
  const active=(x,z)=>x>=0&&z>=0&&x<w&&z<d&&n.every(a=>x<a[0]||x>a[2]||z<a[1]||z>a[3]);
  const inside=(x,z)=>x>=1&&z>=1&&x<w-1&&z<d-1&&active(x,z);
  const occ=new Map(b.placements.map(p=>[key(p.at),p])),walk=new Set(b.walkable.map(key));
  assert.equal(occ.size,b.placements.length,'overlapping anchors');
  let absence=0,notchFacing=0;
  for(let x=0;x<w;x++)for(let z=0;z<d;z++){
   if(!active(x,z)){
    absence++;
    for(let y=0;y<h;y++)assert.equal(occ.has(key([x,y,z])),false,'ghost block in exterior void');
    assert.equal(walk.has(key([x,1,z])),false,'nonphysical walkable void');
   }else assert.equal(occ.get(key([x,0,z]))?.role,'foundation','missing real foundation');
   if(inside(x,z)&&[[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>!inside(a,c))){
    assert.equal(occ.get(key([x,4,z]))?.role,'wall','missing complete exterior wall');
    if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,c])=>a>=0&&c>=0&&a<w&&c<d&&!active(a,c)))notchFacing++;
   }
  }
  assert.equal(absence,b.architecturalIdentity.exteriorVoidFootprintCells);
  assert.ok(absence>50&&absence/(w*d)>.08);
  assert.ok(notchFacing>=8,'no actual notch-facing wall');
  const q=[b.portals[0].at],seen=new Set([key(q[0])]);
  for(let i=0;i<q.length;i++)for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
   const a=[q[i][0]+dx,1,q[i][2]+dz],k=key(a);
   if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push(a);}
  }
  assert.equal(seen.size,walk.size,'inaccessible interior');
  assert.equal(b.portals.length,b.rooms.length,'missing room portal');
  for(const room of b.rooms)assert.ok(b.walkable.some(a=>a.every((v,i)=>v>=room.min[i]&&v<room.max[i])),room.id+' inaccessible');
  for(const portal of b.portals){
   const [x,y,z]=portal.at;assert.ok(walk.has(key(portal.at))&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z])),'blocked entry/door');
  }
  for(const roof of b.placements.filter(p=>p.role==='roof')){
   assert.ok(occ.has(key([roof.at[0],roof.at[1]-1,roof.at[2]])),'floating roof');
   assert.equal(roof.weatherSealApproved,false);
  }
  assert.ok(b.architecturalIdentity.roofWings?.length>=2);
  assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.at[1])).size>=2,'non-massed flat roof');
  for(const r of b.footprintReservations){
   assert.equal(r.asset,'pack5:082');assert.equal(r.approval,'unresolved');
   assert.equal(occ.get(key(r.anchor))?.variant,'wanderer-quilt');
   for(const [x,y,z] of r.extraCells){
    assert.ok(active(x,z)&&!occ.has(key([x,y,z]))&&!occ.has(key([x,y+1,z]))&&!walk.has(key([x,y,z])));
    assert.equal(occ.get(key([x,y-1,z]))?.role,'foundation');
   }
  }
  for(const role of ['foundation','wall','partition','roof','support','door','window','furnishing'])
   assert.ok(b.placements.some(p=>p.role===role),role+' missing');
  const pack=auditM1PhysicalSources(b);
  assert.equal(pack.catalog.families,96);assert.equal(pack.catalog.numericVariants,106);
  assert.deepEqual(pack.errors,[],b.id+' physical errors');
  assert.deepEqual(pack.unresolved,[],b.id+' unrecognized family source');
  assert.equal(pack.roofTiles,pack.roofBackingCells);
  assert.equal(pack.bedHeads,pack.bedFeet);
  assert.equal(pack.productionReady,false);
  assert.equal(pack.worldPlaced,false);
  assert.equal(pack.physicalIPhoneTested,false);
 });
}
