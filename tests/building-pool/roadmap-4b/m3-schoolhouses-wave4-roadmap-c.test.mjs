// Roadmap C 4B C3: new exact-source original large seven-pavilion school; prior 148 immutable.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_C_4B_WAVE3_SCHOOL,ROADMAP_C_4B_149_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-wave3-roadmap-c.mjs';
import {ROADMAP_C_4B_WAVE4_SCHOOL,ROADMAP_C_4B_150_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-wave4-roadmap-c.mjs';
import {M3_148_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-second5.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {resolveManualFivePackAsset,planManualFivePackBlueprint,MANUAL_FIVE_PACK_COUNTS} from '../../../src/builder-assets/manual-five-pack.mjs';
const key=a=>a.join(',');
function floor(b){return b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);}
function orient(points,t){
 const pts=points.map(([x,z])=>{let a=t&1?-x:x,b=z;if(t&2)[a,b]=[b,a];if(t&4)b=-b;return [a,b];});
 const minX=Math.min(...pts.map(x=>x[0])),minZ=Math.min(...pts.map(x=>x[1]));
 return new Set(pts.map(([x,z])=>key([x-minX,z-minZ])));
}
function maxD4(a,b){const B=orient(floor(b),0);let max=0;for(let t=0;t<8;t++){
 const A=orient(floor(a),t);let hit=0;for(const k of A)if(B.has(k))hit++;
 max=Math.max(max,hit/(A.size+B.size-hit));}return max;}


test('Northglass original snow large academy retains all 149 historical source objects and contributes one unique 150th',()=>{
 const b=ROADMAP_C_4B_WAVE4_SCHOOL;assert.equal(b.id,'r4:schoolhouse:snow:large:01');
 assert.ok(ROADMAP_C_4B_149_ALL.every((old,i)=>old===ROADMAP_C_4B_150_ALL[i]));
 assert.deepEqual(validateCollection(ROADMAP_C_4B_150_ALL),{authored:150,remaining:135,creatorApproved:0,integrated:0});
 assert.equal(new Set(ROADMAP_C_4B_150_ALL.map(geometrySignature)).size,150);
 assert.equal(new Set(ROADMAP_C_4B_150_ALL.map(x=>x.id)).size,150);
});
test('Northglass actual eight reachable winter teaching spaces, two real partition portals, 12k+ physical cells, roof support and Pack source preflight',()=>{
 const b=ROADMAP_C_4B_WAVE4_SCHOOL;assert.equal(validateBlueprint(b).id,b.id);
 assert.deepEqual([b.creatorApproved,b.worldPlaced,b.integrated],[false,false,false]);
 assert.ok(b.cells.length>12000);assert.equal(b.bounds[0],70);assert.equal(b.bounds[2],72);
 assert.equal(b.spaces.length,8);
 assert.deepEqual(new Set(b.spaces.map(r=>r.kind)),new Set(['classroom','shared-study','teacher-area','avalanche-engineering-lab','mountain-rescue-infirmary','tundra-library','weather-observatory','sheltered-seminar']));
 const vox=new Map(b.cells.map(x=>[key(x.at),x])),walk=new Set(b.navigation.map(x=>key(x.at)));
 assert.equal(vox.size,b.cells.length);assert.ok(walk.size>2500);
 const floors=b.cells.filter(x=>x.role==='floor'),foundations=b.cells.filter(x=>x.role==='foundation'),roof=b.cells.filter(x=>x.role==='roof'&&x.at[1]===7);
 assert.equal(floors.length,foundations.length);assert.equal(floors.length,roof.length);
 for(const c of floors){const [x,y,z]=c.at;assert.equal(vox.get(key([x,0,z]))?.role,'foundation');assert.equal(vox.get(key([x,7,z]))?.role,'roof');}
 const elevated=b.cells.filter(x=>x.role==='roof'&&x.at[1]>7);assert.ok(elevated.length>600);
 for(const p of elevated){const [x,y,z]=p.at;assert.ok(vox.has(key([x,y-1,z])),'unsupported raised snow roof '+key(p.at));}
 const portals=b.openings.filter(x=>x.kind!=='window');assert.equal(portals.length,3);
 assert.equal(portals.filter(x=>x.kind==='door').length,2);
 for(const p of portals){const [x,y,z]=p.at;assert.ok(walk.has(key(p.at)),'unwalkable door');assert.ok(!vox.has(key([x,y,z]))&&!vox.has(key([x,y+1,z])),'blocked clear head');assert.equal(p.plannedClosure,'pack2:020');}
 for(const p of portals.filter(x=>x.kind==='door')){const [x,y,z]=p.at;
  assert.equal(vox.get(key([x,4,z]))?.role,'beam');
  assert.equal(vox.get(key([x,y,z-1]))?.role,'partition');
  assert.equal(vox.get(key([x,y,z+1]))?.role,'partition');
 }
 const q=[portals.find(x=>x.kind==='entrance').at],seen=new Set([key(q[0])]);
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=key([x+dx,y,z+dz]);if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push([x+dx,y,z+dz]);}}}
 assert.equal(seen.size,walk.size,'winter class corridor disconnected');
 for(const room of b.spaces)assert.ok(seen.has(key(room.access)),room.kind+' truly unreachable');
 assert.deepEqual(new Set(b.dependencies.map(x=>x.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const refs=b.cells.filter(x=>x.asset.startsWith('pack4:')).map(x=>({asset:x.asset,at:x.at,orientation:x.facing}));assert.ok(refs.length>=8);
 const shape=planManualFivePackBlueprint(refs,{maxInstances:4096});assert.equal(shape.instances,refs.length);assert.equal(shape.dryRun,true);assert.equal(shape.worldPlaced,false);
 for(const ref of refs.slice(0,8)){const physical=resolveManualFivePackAsset(ref.asset,{orientation:ref.orientation});assert.ok(physical.visibleBoxes.length&&physical.selectionBoxes.length);assert.equal(physical.livePlaceable,false);}
});
test('Northglass distinctive 149 new-versus-old original eight-way normalized floor comparisons remain under strict 0.89',()=>{
 const b=ROADMAP_C_4B_WAVE4_SCHOOL;let count=0,max=0;
 for(const old of ROADMAP_C_4B_149_ALL){const val=maxD4(b,old);max=Math.max(max,val);count++;assert.ok(val<.89,'D4 near clone '+old.id+' score '+val);}
 assert.equal(count,149);assert.ok(max<.89);
});
