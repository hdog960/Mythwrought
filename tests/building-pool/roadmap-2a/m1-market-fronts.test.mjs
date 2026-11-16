import test from 'node:test';
import assert from 'node:assert/strict';
import {M1_MARKET_FRONTS} from '../../../src/building-pool/roadmap-2a/m1-market-fronts.mjs';
import {M1_GENERAL_STORES} from '../../../src/building-pool/roadmap-2a/m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from '../../../src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from '../../../src/building-pool/roadmap-2a/m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from '../../../src/building-pool/roadmap-2a/m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from '../../../src/building-pool/roadmap-2a/m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from '../../../src/building-pool/roadmap-2a/m1-category-arcades.mjs';
import {validateBlueprint,structuralFingerprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {inventory,plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {resolveManualFivePackAsset} from '../../../src/builder-assets/manual-five-pack.mjs';
const all=[...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS];
const coord=(x,y,z)=>[x,y,z].join(',');
const map=b=>new Map(b.voxels.map(v=>[coord(v.x,v.y,v.z),v]));
function roomWalk(b){
 const cells=map(b),start=b.openings.find(o=>o.type==='entrance'),q=[[start.x,1]],visited=new Set();
 for(let i=0;i<q.length;i++){
  const [x,z]=q[i],here=x+','+z;
  if(visited.has(here)||x<1||z<1||x>=b.extents.x-1||z>=b.extents.z-1||cells.get(coord(x,1,z))?.kind!=='floor'||[2,3,4].some(y=>cells.has(coord(x,y,z))))continue;
  visited.add(here);for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);
 }
 return visited;
}
test('six source-authored distinct regional shop and bank models bring true 2A registry to 50 of 420',()=>{
 assert.equal(M1_MARKET_FRONTS.length,6);assert.equal(all.length,50);
 assert.equal(new Set(all.map(b=>b.id)).size,50);assert.equal(new Set(all.map(structuralFingerprint)).size,50);
 assert.equal(plannedSlots().filter(s=>s.authoredHere).length,86);assert.equal(inventory().authoredCandidateTotal,86);
 assert.equal(inventory().newlyAuthored,71);assert.equal(inventory().unwrittenNewCandidates,334);
 assert.equal(inventory().creatorApproved,0);assert.equal(inventory().integratedIntoGame,0);
 for(const b of M1_MARKET_FRONTS){assert(validateBlueprint(b).valid);assert(b.voxels.length>1200&&b.rooms.length===3);assert(!b.worldPlaced&&!b.numericIdsAssigned);}
});
test('new source-authored shops each have three reachable rooms, window-specific materials and two-wide portico clearance',()=>{
 for(const b of M1_MARKET_FRONTS){
  const c=map(b),seen=roomWalk(b);
  for(const r of b.rooms)assert(seen.has(r.access.join(',')),b.id+' blocked named room '+r.name);
  for(const o of b.openings.filter(o=>o.type==='entrance'||o.type==='internal-doorway'))
   for(let d=0;d<3;d++)assert(!c.has(coord(o.x,o.y+d,o.z)),b.id+' obstructed opening');
  for(const w of b.openings.filter(o=>o.type==='window'))assert.equal(c.get(coord(w.x,w.y,w.z))?.material,w.material);
  const porticoOpenings=b.openings.filter(o=>o.role&&['-outer-secondary','-inner-primary','-inner-secondary'].some(suffix=>o.role.endsWith(suffix)));
  assert.equal(porticoOpenings.length,3,b.id+' missing source-authored two-wide portico portal');
  assert(b.voxels.filter(v=>v.portico).length>=6);
 }
});
test('physically resolved two-cell oak dividers and vaulted bank gateway are not silently treated as one cell',()=>{
 const pet=M1_MARKET_FRONTS.find(x=>x.category==='pet-shop');
 const rails=pet.voxels.filter(v=>v.physicalVariant==='oak-stall-divider'),used=new Set();
 assert.equal(rails.length,3);
 for(const v of rails){
  const family=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing});
  assert.equal(family.occupiedOffsets.length,2);
  for(const [dx,dy,dz] of family.occupiedOffsets){const k=coord(v.x+dx,v.y+dy,v.z+dz);assert(!used.has(k),k);used.add(k);}
 }
 assert.equal(used.size,6);
 const bank=M1_MARKET_FRONTS.find(x=>x.category==='bank');
 const gate=bank.openings.find(o=>o.role==='vault-threshold'),second=bank.openings.find(o=>o.role==='vault-wide-secondary');
 assert(gate&&second);assert.equal(gate.intendedFacing,'north');
 const family=resolveManualFivePackAsset(gate.doorSymbol,{variant:gate.physicalVariant,orientation:gate.intendedFacing});
 assert.equal(family.occupiedOffsets.length,2);
 assert(family.occupiedOffsets.map(([x,y,z])=>coord(gate.x+x,gate.y+y,gate.z+z)).includes(coord(second.x,second.y,second.z)));
});
