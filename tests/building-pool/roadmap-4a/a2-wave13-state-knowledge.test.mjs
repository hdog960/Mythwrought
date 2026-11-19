import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4a/m1-blueprints.mjs';
import {allM2Exemplars} from '../../../src/building-pool/roadmap-4a/m2-blueprints.mjs';
import {allM2Additional} from '../../../src/building-pool/roadmap-4a/m2-additional.mjs';
import {allM2Regional} from '../../../src/building-pool/roadmap-4a/m2-regional.mjs';
import {allM2Expansion} from '../../../src/building-pool/roadmap-4a/m2-expansion.mjs';
import {allM2Tranche} from '../../../src/building-pool/roadmap-4a/m2-tranche.mjs';
import {allM2Next} from '../../../src/building-pool/roadmap-4a/m2-next.mjs';
import {allM2Silhouettes} from '../../../src/building-pool/roadmap-4a/m2-silhouettes.mjs';
import {allM2Profiles} from '../../../src/building-pool/roadmap-4a/m2-profile-architecture.mjs';
import {allM2Courtyards} from '../../../src/building-pool/roadmap-4a/m2-courtyard-architecture.mjs';
import {allM2Districts} from '../../../src/building-pool/roadmap-4a/m2-district-architecture.mjs';
import {allM2CivicWorks} from '../../../src/building-pool/roadmap-4a/m2-civic-works.mjs';
import {allM2PublicWorks} from '../../../src/building-pool/roadmap-4a/m2-public-works.mjs';
import {allM2GuildAndCivic} from '../../../src/building-pool/roadmap-4a/m2-guild-civic.mjs';
import {allM2RegionalCourts} from '../../../src/building-pool/roadmap-4a/m2-regional-courts.mjs';
import {allM2ChambersCrafts} from '../../../src/building-pool/roadmap-4a/m2-chambers-crafts.mjs';
import {allM2FrontierDistricts} from '../../../src/building-pool/roadmap-4a/m2-frontier-districts.mjs';
import {allM2FinalCivicGuild} from '../../../src/building-pool/roadmap-4a/m2-final-civic-guild.mjs';
import {allM3StateKnowledge,buildM3StateKnowledge,M3_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/m3-state-knowledge.mjs';
import {MANUAL_FIVE_PACK_COUNTS} from '../../../src/builder-assets/manual-five-pack.mjs';
import {manualFivePackVariants,resolveManualFivePackAsset,MANUAL_FIVE_PACK_CATALOG} from '../../../src/builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint} from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};

import {allA2OriginalStateKnowledge,buildA2OriginalStateKnowledge,A2_ORIGINAL_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-original-state-knowledge.mjs';
import {allA2Wave2StateKnowledge,buildA2Wave2StateKnowledge,A2_WAVE2_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave2-state-knowledge.mjs';
import {allA2Wave3StateKnowledge,buildA2Wave3StateKnowledge,A2_WAVE3_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave3-state-knowledge.mjs';
import {allA2Wave4StateKnowledge,buildA2Wave4StateKnowledge,A2_WAVE4_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave4-state-knowledge.mjs';
import {allA2Wave5StateKnowledge,buildA2Wave5StateKnowledge,A2_WAVE5_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave5-state-knowledge.mjs';
import {allA2Wave6StateKnowledge,buildA2Wave6StateKnowledge,A2_WAVE6_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave6-state-knowledge.mjs';
import {allA2Wave7StateKnowledge,buildA2Wave7StateKnowledge,A2_WAVE7_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave7-state-knowledge.mjs';
import {allA2Wave8StateKnowledge,buildA2Wave8StateKnowledge,A2_WAVE8_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave8-state-knowledge.mjs';
import {allA2Wave9StateKnowledge,buildA2Wave9StateKnowledge,A2_WAVE9_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave9-state-knowledge.mjs';
import {allA2Wave10StateKnowledge,buildA2Wave10StateKnowledge,A2_WAVE10_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave10-state-knowledge.mjs';
import {allA2Wave11StateKnowledge,buildA2Wave11StateKnowledge,A2_WAVE11_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave11-state-knowledge.mjs';
import {allA2Wave12StateKnowledge,buildA2Wave12StateKnowledge,A2_WAVE12_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave12-state-knowledge.mjs';
import {allA2Wave13StateKnowledge,buildA2Wave13StateKnowledge,A2_WAVE13_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave13-state-knowledge.mjs';
const protected308=()=>[...allM1(),...allM2Exemplars(),...allM2Additional(),...allM2Regional(),...allM2Expansion(),...allM2Tranche(),...allM2Next(),...allM2Silhouettes(),...allM2Profiles(),...allM2Courtyards(),...allM2Districts(),...allM2CivicWorks(),...allM2PublicWorks(),...allM2GuildAndCivic(),...allM2RegionalCourts(),...allM2ChambersCrafts(),...allM2FrontierDistricts(),...allM2FinalCivicGuild(),...allM3StateKnowledge(),...allA2OriginalStateKnowledge(),...allA2Wave2StateKnowledge(),...allA2Wave3StateKnowledge(),...allA2Wave4StateKnowledge(),...allA2Wave5StateKnowledge(),...allA2Wave6StateKnowledge(),...allA2Wave7StateKnowledge(),...allA2Wave8StateKnowledge(),...allA2Wave9StateKnowledge(),...allA2Wave10StateKnowledge(),...allA2Wave11StateKnowledge(),...allA2Wave12StateKnowledge()];
const fresh=()=>allA2Wave13StateKnowledge();
const K=p=>p.join(',');
function floorSymmetry(b){
 const floor=b.cells.filter(c=>c.role==='floor'&&c.at[1]===0).map(c=>[c.at[0],c.at[2]]);
 const out=[];
 for(let flip=0;flip<2;flip++)for(let turn=0;turn<4;turn++){
  const coords=floor.map(([ix,iz])=>{let x=flip?-ix:ix,z=iz;for(let n=0;n<turn;n++)[x,z]=[-z,x];return [x,z]});
  const minX=Math.min(...coords.map(p=>p[0])),minZ=Math.min(...coords.map(p=>p[1]));
  out.push(new Set(coords.map(([x,z])=>(x-minX)+','+(z-minZ))));
 }
 return out;
}
function overlap(a,b){let best=0;for(const left of a)for(const right of b){
 const small=left.size<right.size?left:right,large=left.size<right.size?right:left;
 let n=0;for(const k of small)if(large.has(k))n++;
 best=Math.max(best,n/(left.size+right.size-n));
}return best;}

const EXPECTED=["r4:embassy:enchanted-forest:large:02","r4:grand-archive:enchanted-forest:medium:03","r4:grand-archive:mountain:medium:01","r4:observatory:desert:small:02","r4:observatory:enchanted-forest:small:02","r4:observatory:enchanted-forest:large:01","r4:observatory:mountain:medium:03"];
test('Wave13: exactly seven original legal source IDs, protected 308 unchanged',()=>{
 const old=protected308(),fresh=allA2Wave13StateKnowledge(),all=[...old,...fresh];
 assert.equal(old.length,308);assert.equal(fresh.length,7);assert.equal(all.length,315);
 assert.deepEqual(A2_WAVE13_STATE_KNOWLEDGE_IDS,EXPECTED);
 assert.equal(new Set(all.map(b=>b.id)).size,315);
 assert.equal(validateCollection(all).verified,315);
 for(const b of fresh){
  assert.equal(validateBlueprint(b).theoreticalOnly,true,b.id);
  assert.ok(b.cells.length>1000&&b.navigation.length>200&&b.spaces.length===5,b.id);
  assert.equal(b.openings.filter(o=>o.kind==='window').length,6,b.id);
  assert.equal(b.architecturalNotes.creatorAccepted,false);
  assert.equal(b.architecturalNotes.worldPlacement,false);
  assert.equal(b.architecturalNotes.liveIntegrated,false);
  assert.equal(serializeBlueprint(b),serializeBlueprint(buildA2Wave13StateKnowledge(b.id)));
 }
});
test('Wave13: strict same-category eight-way D4 normalized footprint IoU <0.85 against all 308 historical and new peers',{timeout:240000},()=>{
 const previous=protected308().map(b=>({id:b.id,type:b.type,shapes:floorSymmetry(b)}));
 const fresh=allA2Wave13StateKnowledge().map(b=>({id:b.id,type:b.type,shapes:floorSymmetry(b)}));
 const failures=[],nearest=[];
 for(const b of fresh){
  let best={id:null,iou:-1};
  for(const other of [...previous,...fresh])if(other.id!==b.id&&other.type===b.type){
   const iou=overlap(b.shapes,other.shapes);
   if(iou>best.iou)best={id:other.id,iou};
  }
  nearest.push({source:b.id,...best});
  if(best.iou>=0.85)failures.push({source:b.id,...best});
 }
 console.log('ROADMAP_A2_WAVE13_D4_NEAREST '+JSON.stringify(nearest));
 assert.deepEqual(failures,[]);
});
test('Wave13: five connected authored rooms, real outward windows, clear door and pitched roof support',()=>{
 const facing={north:[0,1],south:[0,-1],east:[1,0],west:[-1,0]};
 for(const b of allA2Wave13StateKnowledge()){
  const map=new Map(b.cells.map(c=>[K(c.at),c])),floor=new Set(b.cells.filter(c=>c.role==='floor'&&c.at[1]===0).map(c=>c.at[0]+','+c.at[2]));
  const entry=b.openings.find(o=>o.kind==='entrance');
  assert.ok(entry&&b.navigation.some(n=>K(n.at)===K(entry.at)),b.id+' entry');
  const visited=new Set([entry.at[0]+','+entry.at[2]]),q=[[entry.at[0],entry.at[2]]];
  for(let i=0;i<q.length;i++)for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const x=q[i][0]+dx,z=q[i][1]+dz,k=x+','+z;
   if(floor.has(k)&&!visited.has(k)&&b.navigation.some(n=>n.at[0]===x&&n.at[2]===z)){visited.add(k);q.push([x,z]);}
  }
  for(const room of b.spaces){
   assert.ok(room.footprint.length>=12,b.id+' room');
   assert.ok(visited.has(room.access[0]+','+room.access[2]),b.id+' unreachable '+room.id);
  }
  assert.equal(b.architecturalNotes.roofProfiles.length,5);
  assert.ok(new Set(b.architecturalNotes.roofProfiles.map(r=>r.profile)).size>=3);
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>5)){
   const [x,y,z]=c.at;
   assert.equal(map.get(K([x,y-1,z]))?.role,'beam',b.id+' missing roof bearing '+K(c.at));
   assert.equal(map.get(K([x,5,z]))?.role,'beam',b.id+' missing load path '+K(c.at));
  }
  for(const o of b.openings.filter(o=>o.kind==='window')){
   const [x,y,z]=o.at,[dx,dz]=facing[o.facing];
   assert.equal(map.get(K(o.at))?.role,'window');
   assert.ok(floor.has(x+','+z)&&!floor.has((x+dx)+','+(z+dz)),b.id+' interior-facing glass '+K(o.at));
  }
 }
});
test('Wave13: integrated five-pack read-only native physical ABI and honest installation blockers',()=>{
 assert.equal(MANUAL_FIVE_PACK_COUNTS.families,96);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.numericVariants,106);
 assert.equal(MANUAL_FIVE_PACK_COUNTS.productionRegistered,false);
 for(const b of allA2Wave13StateKnowledge()){
  const audit=auditBlueprintMaterials(b);
  assert.equal(audit.productionReady,false);
  assert.equal(audit.worldPlaced,false);
  assert.equal(audit.saveWritten,false);
  assert.equal(audit.realIphoneTested,false);
  assert.ok(audit.entries.length>=3);
  assert.ok(audit.entries.every(e=>e.chosenNumericId===null&&e.blockedBy.length>0));
 }
 const chosen=[['pack1:002',1],['pack2:015',2],['pack3:023',3],['pack4:030',4],[PACK5_BUILDER_CATALOG[0].symbolicId,5]];
 for(const [symbol,pack] of chosen){
  const variants=manualFivePackVariants(symbol);assert.ok(variants.length>=1);
  for(const orientation of ['north','east','south','west']){
   if(pack===3&&orientation!=='north'){
    assert.throws(()=>resolveManualFivePackAsset(symbol,{numericId:variants[0].numericId,orientation}),/not certified/);continue;
   }
   const shape=resolveManualFivePackAsset(symbol,{numericId:variants[0].numericId,orientation,
    ...(pack===5?{variant:PACK5_BUILDER_CATALOG[0].variants[0]}:{})});
   assert.equal(shape.sourcePack,pack);
   assert.equal(shape.physical,true);assert.equal(shape.builderResolvable,true);
   assert.equal(shape.livePlaceable,false);assert.equal(shape.saveWritten,false);
   assert.ok(Array.isArray(shape.visibleBoxes)&&Array.isArray(shape.collisionBoxes));
   assert.ok(Array.isArray(shape.occupiedOffsets)&&Array.isArray(shape.supportOffsets));
  }
 }
});
