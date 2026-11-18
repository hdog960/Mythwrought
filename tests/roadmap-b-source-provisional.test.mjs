// Roadmap B candidate-only preflight. Keep separate from legacy source proofs.
// Presence here is NOT gallery, real producer ABI, iPhone, or placement approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createStoneveinSwitchbackBaths} from '../src/building-pool/roadmap-b/b1-stonevein-switchback-baths.mjs';
import {createIronpassHorseshoeExchange} from '../src/building-pool/roadmap-b/b2-ironpass-market.mjs';
import {get1BCandidates} from '../src/building-pool/roadmap-1b/candidates.mjs';
import {validateBlueprint as verify1B,stableBlueprintJSON} from '../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
import {validateBlueprint as verify2B} from '../src/building-pool/roadmap-2b/schema.mjs';
const code=(p)=>p.join(',');
const voxels=b=>new Map(b.placements.map(p=>[code(p.at),p]));
function actualWalkable2B(b){
 const occ=new Set(b.voxels.map(p=>[p.x,p.y,p.z].join(',')));
 const ground=new Set(b.voxels.filter(p=>p.kind==='floor').map(p=>p.x+','+p.z));
 const open=new Set([...ground].filter(k=>{const [x,z]=k.split(',');return !occ.has(x+',2,'+z)&&!occ.has(x+',3,'+z);}));
 const initial='19,2';assert.ok(open.has(initial),'mountain market public entrance obstructed');
 const seen=new Set([initial]),queue=[initial];
 while(queue.length){const [x,z]=queue.shift().split(',').map(Number);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const to=[x+dx,z+dz].join(',');if(open.has(to)&&!seen.has(to)){seen.add(to);queue.push(to);}
  }
 }
 return {open,seen,ground};
}
test('B1 Stonevein is a fresh canonical 1B slot preserving all 169 original source candidates',()=>{
 const original=get1BCandidates(),before=original.map(stableBlueprintJSON);
 const b=createStoneveinSwitchbackBaths();
 assert.equal(original.length,169);assert.equal(b.id,'r1:bathhouse:mountain:medium:004');
 assert.ok(!original.some(x=>x.id===b.id));assert.deepEqual(original.map(stableBlueprintJSON),before);
 assert.equal(verify1B(b),true);assert.ok(b.placements.length>3300);
 assert.equal(b.liveIntegration,false);assert.equal(b.worldPlacement,false);
});
test('B1 actual nonrectangular sky-open roofed baths have reachable rooms and grounded supported roofs',()=>{
 const b=createStoneveinSwitchbackBaths(),map=voxels(b),f=new Set(b.placements.filter(p=>p.role==='foundation').map(p=>p.at[0]+','+p.at[2]));
 assert.ok(b.walkable.length>700);assert.ok(b.rooms.length>=5&&b.portals.length>=7);
 let sky=0;for(let x=14;x<=25;x++)for(let z=16;z<=27;z++)if(!f.has(x+','+z))sky++;
 assert.ok(sky>55,'no real open-sky missing foundation');
 assert.ok(new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.roofProfile)).size>=4);
 for(const p of b.portals){assert.ok(!map.has(code(p.at)),'blocked door');assert.ok(!map.has(code([p.at[0],2,p.at[2]])),'blocked head');}
 for(const p of b.placements.filter(p=>p.role==='support'))assert.ok(f.has(p.at[0]+','+p.at[2]),'floating authored roof support');
});
test('B2 Ironpass is not a relabelled historical template and retains 146 protected prior models',()=>{
 const ledger=JSON.parse(readFileSync('src/building-pool/roadmap-2b/m1-authoring-ledger.json','utf8'));
 assert.equal(ledger.authoredCandidates,146);assert.equal(ledger.sourceExactInheritedTemples,15);
 const b=createIronpassHorseshoeExchange(),result=verify2B(b);
 assert.equal(b.id,'r2:market-square:mountain:medium:03');
 assert.ok(!ledger.originals.some(x=>x.id===b.id));
 assert.equal(result.valid,true);assert.ok(b.voxels.length>4500);
 assert.equal(b.worldPlaced,false);assert.equal(b.numericIdsAssigned,false);
});
test('B2 Ironpass has actual open courtyard, grounded bearing supports, 3-high clear gates and connected public source routes',()=>{
 const b=createIronpassHorseshoeExchange(),w=actualWalkable2B(b);
 assert.equal(w.seen.size,w.open.size,'physically disconnected market floor');
 for(const t of b.routeTargets)assert.ok(w.seen.has(t.x+','+t.z),'inaccessible trade function '+t.label);
 let gap=0;for(let x=14;x<=25;x++)for(let z=16;z<=27;z++)if(!w.ground.has(x+','+z))gap++;
 assert.ok(gap>70,'courtyard falsely filled with ground');
 assert.ok(new Set(b.voxels.filter(v=>v.kind==='roof').map(v=>v.profile)).size>=4);
 assert.equal(b.openings.filter(o=>o.type==='window').length,6);
 assert.ok(b.sourceSupportAudits.length>=9&&b.sourceSupportAudits.every(s=>s.placedCells>=3));
});
