// Additive acceptance probe downstream of source-only draft PR #365. Never edits original tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL} from '../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {ROADMAP_C_4B_WAVE8_RESEARCH,ROADMAP_C_4B_WAVE8_PLAN} from '../src/building-pool/roadmap-4b/m3-research-wave8-roadmap-c-single.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from '../src/building-pool/roadmap-4b/schema.mjs';
import {resolveManualFivePackAsset,planManualFivePackBlueprint,MANUAL_FIVE_PACK_COUNTS} from '../src/builder-assets/manual-five-pack.mjs';
const key=a=>a.join(',');
const floor=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
function orient(points,t){
 const pts=points.map(([x,z])=>{let a=t&1?-x:x,b=z;if(t&2)[a,b]=[b,a];if(t&4)b=-b;return [a,b];});
 const mx=Math.min(...pts.map(v=>v[0])),mz=Math.min(...pts.map(v=>v[1]));
 return new Set(pts.map(([x,z])=>key([x-mx,z-mz])));
}
function maxD4(a,b){const B=orient(floor(b),0);let max=0;for(let op=0;op<8;op++){
 const A=orient(floor(a),op);let hit=0;for(const k of A)if(B.has(k))hit++;
 max=Math.max(max,hit/(A.size+B.size-hit));}return max;}
test('Frostglass compiles with ORIGINAL native 4B contract and leaves all 153 Sunrift-accepted objects intact',()=>{
 const b=ROADMAP_C_4B_WAVE8_RESEARCH;const all=[...ROADMAP_C_4B_153_ALL,b];
 assert.equal(b.id,'r4:magical-research-institute:snow:medium:01');
 assert.equal(validateBlueprint(b).id,b.id);
 assert.deepEqual(validateCollection(all),{authored:154,remaining:131,creatorApproved:0,integrated:0});
 assert.equal(new Set(all.map(v=>v.id)).size,154);
 assert.equal(new Set(all.map(geometrySignature)).size,154);
 assert.ok(ROADMAP_C_4B_153_ALL.every((v,i)=>v===all[i]));
 assert.deepEqual([b.worldPlaced,b.creatorApproved,b.integrated],[false,false,false]);
});
test('Frostglass genuine 8-room built footprint, supported roofs, open oculi, circulation and real Manual Five Pack AABBs',()=>{
 const b=ROADMAP_C_4B_WAVE8_RESEARCH, vox=new Map(b.cells.map(c=>[key(c.at),c])),walk=new Set(b.navigation.map(n=>key(n.at)));
 assert.equal(b.spaces.length,8);assert.equal(vox.size,b.cells.length);
 assert.ok(b.cells.length>9000&&b.navigation.length>1000);
 const foundations=b.cells.filter(c=>c.role==='foundation'),floors=floor(b),roofs=b.cells.filter(c=>c.role==='roof'&&c.at[1]===7);
 assert.equal(foundations.length,floors.length);
 assert.equal(roofs.length,floors.length);
 for(const [x,z] of floors){assert.equal(vox.get(key([x,0,z]))?.role,'foundation');assert.equal(vox.get(key([x,7,z]))?.role,'roof');}
 for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7))
  assert.ok(vox.has(key([c.at[0],c.at[1]-1,c.at[2]])),'upper roof unsupported '+key(c.at));
 for(const [x,z] of [[16,16],[52,18]])for(let y=0;y<14;y++)
  assert.ok(!vox.has(key([x,y,z])),'fake skylight '+x+','+z);
 const ent=b.openings.find(x=>x.kind==='entrance');assert.ok(ent&&walk.has(key(ent.at)));
 const q=[ent.at],seen=new Set([key(ent.at)]);
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
 const at=[x+dx,y,z+dz],v=key(at);if(walk.has(v)&&!seen.has(v)){seen.add(v);q.push(at);}
 }}
 assert.equal(seen.size,walk.size,'unreachable corridor');
 for(const s of b.spaces)assert.ok(seen.has(key(s.access)),'unreachable room '+s.kind);
 const refs=b.cells.filter(c=>c.asset.startsWith('pack')).map(c=>({asset:c.asset,at:c.at,orientation:c.facing}));
 assert.ok(refs.length>=8);
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const result=planManualFivePackBlueprint(refs,{maxInstances:4096});
 assert.equal(result.instances,refs.length);assert.equal(result.worldPlaced,false);
 for(const ref of refs.slice(0,8)){const a=resolveManualFivePackAsset(ref.asset,{orientation:ref.orientation});
 assert.ok(a.visibleBoxes.length>0&&a.selectionBoxes.length>0);assert.equal(a.livePlaceable,false);}
});
test('Frostglass eight-way true source footprint D4 IoU under original category threshold .89 against ALL 153 historical',()=>{
 let max=0;for(const old of ROADMAP_C_4B_153_ALL){const v=maxD4(ROADMAP_C_4B_WAVE8_RESEARCH,old);
 max=Math.max(max,v);assert.ok(v<.89,'near clone of '+old.id+' IoU '+v);}
 assert.ok(max<.89);
});
