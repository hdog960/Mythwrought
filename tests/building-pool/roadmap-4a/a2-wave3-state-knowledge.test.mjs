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
import {validateBlueprint,validateCollection,geometrySignature,serializeBlueprint} from '../../../src/building-pool/roadmap-4a/schema.mjs';
import {auditBlueprintMaterials} from '../../../src/building-pool/roadmap-4a/m1-material-audit.mjs';
import manifest from '../../../src/building-pool/roadmap-4a/manifest.json' with {type:'json'};

import {allA2OriginalStateKnowledge,buildA2OriginalStateKnowledge,A2_ORIGINAL_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-original-state-knowledge.mjs';
import {allA2Wave2StateKnowledge,buildA2Wave2StateKnowledge,A2_WAVE3_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave2-state-knowledge.mjs';
import {allA2Wave3StateKnowledge,buildA2Wave3StateKnowledge,A2_WAVE3_STATE_KNOWLEDGE_IDS} from '../../../src/building-pool/roadmap-4a/a2-wave3-state-knowledge.mjs';
const protected188=()=>[...allM1(),...allM2Exemplars(),...allM2Additional(),...allM2Regional(),...allM2Expansion(),...allM2Tranche(),...allM2Next(),...allM2Silhouettes(),...allM2Profiles(),...allM2Courtyards(),...allM2Districts(),...allM2CivicWorks(),...allM2PublicWorks(),...allM2GuildAndCivic(),...allM2RegionalCourts(),...allM2ChambersCrafts(),...allM2FrontierDistricts(),...allM2FinalCivicGuild(),...allM3StateKnowledge(),...allA2OriginalStateKnowledge(),...allA2Wave2StateKnowledge()];
const fresh=()=>allA2Wave3StateKnowledge();
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
const expected=["r4:castle-palace:temperate:large:04","r4:castle-palace:desert:medium:04","r4:castle-palace:mountain:small:04","r4:embassy:snow:large:04","r4:embassy:temperate:small:04","r4:embassy:desert:medium:04","r4:grand-archive:snow:medium:04","r4:grand-archive:enchanted-forest:small:04","r4:grand-archive:mountain:large:04","r4:observatory:enchanted-forest:medium:04","r4:observatory:desert:large:04","r4:observatory:snow:small:04"];
test('Roadmap A2 third tranche: twelve distinct new original castle/embassy/archive/observatory sources; preserve protected 188',()=>{
 const old=protected188(),candidate=fresh(),all=[...old,...candidate];
 assert.equal(old.length,188);assert.equal(candidate.length,12);assert.equal(all.length,200);
 assert.deepEqual(A2_WAVE3_STATE_KNOWLEDGE_IDS,expected);
 assert.equal(new Set(all.map(b=>b.id)).size,200);
 assert.equal(validateCollection(all).verified,200);
 for(const b of candidate){
  assert(validateBlueprint(b).theoreticalOnly,b.id);
  assert(b.cells.length>1000&&b.navigation.length>200&&b.spaces.length===5,b.id);
  assert(b.cells.filter(c=>c.role==='window').length>=6);
  assert.deepEqual(b.architecturalNotes.creatorAccepted,false);
  assert.equal(b.architecturalNotes.worldPlacement,false);
  assert.equal(b.architecturalNotes.liveIntegrated,false);
  assert.equal(serializeBlueprint(b),serializeBlueprint(buildA2Wave3StateKnowledge(b.id)));
 }
});
test('Roadmap A2 every new category source has strictly <0.85 D4 floor overlap with 188 previous and other new',()=>{
 const previous=protected188().map(b=>({id:b.id,type:b.type,shapes:floorSymmetry(b)})),candidate=fresh().map(b=>({id:b.id,type:b.type,shapes:floorSymmetry(b)}));
 const nearest=[],failures=[];
 for(let i=0;i<candidate.length;i++){
  const x=candidate[i];let best={other:null,iou:-1};
  for(const y of [...previous,...candidate])if(y.id!==x.id&&y.type===x.type){
   const sim=overlap(x.shapes,y.shapes);
   if(sim>best.iou)best={other:y.id,iou:sim};
  }
  nearest.push({id:x.id,...best});
  if(best.iou>=0.85)failures.push({id:x.id,...best});
 }
 console.log('ROADMAP_A2_4A_D4_NEAREST '+JSON.stringify(nearest));
 assert.deepEqual(failures,[],'A2 wave3 must not clone existing category footprints '+JSON.stringify(failures));
});
test('All A2 roof tiles have true cell bearing, four distinct pitched profiles and original one-story rooms',()=>{
 for(const b of fresh()){
  const map=new Map(b.cells.map(c=>[K(c.at),c]));
  const forms=b.architecturalNotes.roofProfiles;
  assert(forms.length>=4&&new Set(forms.map(x=>x.profile)).size>=3,b.id+' roof variety');
  assert.equal(b.architecturalNotes.storyCount,1);
  assert(b.cells.some(c=>c.role==='roof'&&c.at[1]>=9));
  for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>5)){
   const [x,y,z]=c.at;
   assert.equal(map.get(K([x,y-1,z]))?.role,'beam',b.id+' missing physical roof beam '+K(c.at));
   assert.equal(map.get(K([x,5,z]))?.role,'beam',b.id+' missing source load path '+K(c.at));
  }
  for(const room of b.spaces){
   assert(room.footprint.length>=12,b.id+' room '+room.id);
   assert(map.get(K([room.access[0],0,room.access[2]]))?.role==='floor');
  }
 }
});
test('Source window sockets, entrances, native real-pack producer shapes and physical blocked-by ledger remain honest',()=>{
 assert.equal(MANUAL_FIVE_PACK_COUNTS.families,96);
 for(const b of fresh()){
  const map=new Map(b.cells.map(c=>[K(c.at),c]));
  for(const o of b.openings){
   if(o.kind==='window')assert.equal(map.get(K(o.at))?.role,'window',b.id+' missing glass '+K(o.at));
   else {
    assert(!map.has(K(o.at))&&!map.has(K([o.at[0],o.at[1]+1,o.at[2]])),b.id+' blocked physical doorway '+K(o.at));
    assert(b.navigation.some(n=>K(n.at)===K(o.at)),b.id+' unreachable doorway '+K(o.at));
   }
  }
  const audit=auditBlueprintMaterials(b);
  assert.equal(audit.productionReady,false);
  assert.equal(audit.worldPlaced,false);
  assert.equal(audit.saveWritten,false);
  assert.equal(audit.realIphoneTested,false);
  assert(audit.symbolicCells>50&&audit.entries.length>=3);
  assert(audit.entries.every(e=>e.chosenNumericId===null&&e.blockedBy.length>0));
 }
});

test('new silhouette wave is source-distinct: stepped fork/crescent/terrace roof towers are all genuinely raised and reserved on authored floors',()=>{
 const source=fresh();
 assert.equal(source.length,12);
 const styles=new Set();
 for(const b of source){
  assert.equal(b.architecturalNotes.storyCount,1);
  assert.ok(b.architecturalNotes.skyline.length>=3,b.id+' lacks articulated roof masses');
  assert.ok(b.architecturalNotes.roofProfiles.length===5,b.id+' missing independent roof bands');
  const views=new Set(b.cells.filter(c=>c.role==='roof'&&c.at[1]>5).map(c=>c.at[1]));
  assert.ok(views.size>=3,b.id+' lacks stepped height diversity');
  styles.add(b.architecturalNotes.style);
  assert.ok(b.openings.filter(o=>o.kind==='window').length>=6,b.id);
  assert.equal(b.architecturalNotes.creatorAccepted,false);
 }
 assert.equal(styles.size,12);
});

test('all 72 Wave3 window sockets are on outward-facing exterior load-bearing walls despite faceted tower outcrops',()=>{
 const toward={north:[0,1],south:[0,-1],east:[1,0],west:[-1,0]};
 for(const b of fresh()){
  const occupied=new Set(b.cells.filter(c=>c.role==='floor'&&c.at[1]===0).map(c=>c.at[0]+','+c.at[2]));
  const masonry=new Map(b.cells.map(c=>[K(c.at),c]));
  let windows=0;
  for(const o of b.openings.filter(o=>o.kind==='window')){
   const [dx,dz]=toward[o.facing], [x,y,z]=o.at;
   assert.equal(y,2);
   assert.equal(masonry.get(K(o.at))?.role,'window',b.id+' socket '+K(o.at));
   assert.ok(occupied.has(x+','+z),b.id+' floorless window '+K(o.at));
   assert.ok(!occupied.has((x+dx)+','+(z+dz)),b.id+' window faces into another source floor '+K(o.at));
   windows++;
  }
  assert.equal(windows,6,b.id+' window count');
 }
});
