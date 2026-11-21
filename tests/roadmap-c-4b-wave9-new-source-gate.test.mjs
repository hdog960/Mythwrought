// Isolated additive original-contract gate for Roadmap C 4B Starroot source-only candidate.
// Historical tests/source/workflows are untouched; no acceptance until real browser audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_C_4B_153_ALL} from '../src/building-pool/roadmap-4b/m3-research-wave7-roadmap-c.mjs';
import {ROADMAP_C_4B_WAVE8_RESEARCH} from '../src/building-pool/roadmap-4b/m3-research-wave8-roadmap-c-single.mjs';
import {ROADMAP_C_4B_WAVE9_RESEARCH,ROADMAP_C_4B_WAVE9_PLAN} from '../src/building-pool/roadmap-4b/m3-research-wave9-roadmap-c-starroot.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds} from '../src/building-pool/roadmap-4b/schema.mjs';
import {resolveManualFivePackAsset,planManualFivePackBlueprint,MANUAL_FIVE_PACK_COUNTS} from '../src/builder-assets/manual-five-pack.mjs';
const key=a=>a.join(',');
const floor=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
function orient(points,t){
 const pts=points.map(([x,z])=>{let a=t&1?-x:x,b=z;if(t&2)[a,b]=[b,a];if(t&4)b=-b;return [a,b];});
 const mx=Math.min(...pts.map(v=>v[0])),mz=Math.min(...pts.map(v=>v[1]));
 return new Set(pts.map(([x,z])=>key([x-mx,z-mz])));
}
function maxD4(a,b){
 const B=orient(floor(b),0);let max=0;
 for(let op=0;op<8;op++){
 const A=orient(floor(a),op);let hit=0;for(const k of A)if(B.has(k))hit++;
 max=Math.max(max,hit/(A.size+B.size-hit));}
 return max;
}
const historical=Object.freeze([...ROADMAP_C_4B_153_ALL,ROADMAP_C_4B_WAVE8_RESEARCH]);
test('Starroot uses one unallocated original program slot and preserves all 154 prior immutable source objects',()=>{
 const b=ROADMAP_C_4B_WAVE9_RESEARCH,all=[...historical,b];
 assert.equal(b.id,'r4:magical-research-institute:enchanted-forest:large:01');
 assert.equal(ROADMAP_C_4B_WAVE9_PLAN.variant,1);
 assert.ok(expectedIds().includes(b.id));
 assert.ok(!historical.some(x=>x.id===b.id),'slot already authored');
 assert.equal(validateBlueprint(b).id,b.id);
 assert.deepEqual(validateCollection(all),{authored:155,remaining:130,creatorApproved:0,integrated:0});
 assert.equal(new Set(all.map(v=>v.id)).size,155);
 assert.equal(new Set(all.map(geometrySignature)).size,155);
 assert.ok(historical.every((v,i)=>v===all[i]));
 assert.deepEqual([b.worldPlaced,b.creatorApproved,b.integrated],[false,false,false]);
});
test('Starroot true physical eight-room connectivity, roof supports, two oculi and manual source boxes',()=>{
 const b=ROADMAP_C_4B_WAVE9_RESEARCH,vox=new Map(b.cells.map(c=>[key(c.at),c])),walk=new Set(b.navigation.map(n=>key(n.at)));
 assert.equal(b.spaces.length,8);assert.equal(vox.size,b.cells.length);
 assert.ok(b.cells.length>9000&&b.navigation.length>1000);
 const foundations=b.cells.filter(c=>c.role==='foundation'),floors=floor(b),roofs=b.cells.filter(c=>c.role==='roof'&&c.at[1]===7);
 assert.equal(foundations.length,floors.length);assert.equal(roofs.length,floors.length);
 for(const [x,z] of floors){assert.equal(vox.get(key([x,0,z]))?.role,'foundation');assert.equal(vox.get(key([x,7,z]))?.role,'roof');}
 for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>7))
 assert.ok(vox.has(key([c.at[0],c.at[1]-1,c.at[2]])),'upper roof unsupported '+key(c.at));
 for(const [x,z] of [[17,18],[53,54]])for(let y=0;y<14;y++)
 assert.ok(!vox.has(key([x,y,z])),'false open oculus '+x+','+z);
 const entrance=b.openings.find(x=>x.kind==='entrance');assert.ok(entrance&&walk.has(key(entrance.at)));
 const q=[entrance.at],seen=new Set([key(entrance.at)]);
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
 const at=[x+dx,y,z+dz],v=key(at);if(walk.has(v)&&!seen.has(v)){seen.add(v);q.push(at);}
 }}
 assert.equal(seen.size,walk.size,'unreachable corridors');
 for(const s of b.spaces)assert.ok(seen.has(key(s.access)),'unreachable room '+s.kind);
 const refs=b.cells.filter(c=>c.asset.startsWith('pack')).map(c=>({asset:c.asset,at:c.at,orientation:c.facing}));
 assert.ok(refs.length>=8);
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const result=planManualFivePackBlueprint(refs,{maxInstances:4096});
 assert.equal(result.instances,refs.length);assert.equal(result.worldPlaced,false);
 for(const ref of refs.slice(0,8)){
 const a=resolveManualFivePackAsset(ref.asset,{orientation:ref.orientation});
 assert.ok(a.visibleBoxes.length>0&&a.selectionBoxes.length>0);
 assert.equal(a.livePlaceable,false);
 }
});
test('Starroot strict eight-way original D4 floor IoU <.89 against all 154 prior objects',()=>{
 let max=0,closest='';
 for(const old of historical){const score=maxD4(ROADMAP_C_4B_WAVE9_RESEARCH,old);
 if(score>max){max=score;closest=old.id;}assert.ok(score<.89,'near clone '+old.id+' overlap '+score);
 }
 console.log('STARROOT_D4_MAX='+max+' nearest='+closest);
 assert.ok(max<.89);
});
