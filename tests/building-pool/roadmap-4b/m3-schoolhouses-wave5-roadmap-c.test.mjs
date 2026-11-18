// Roadmap C 4B original wave 5 — new woodland Luminbough conservatory only; 150 old objects immutable.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_C_4B_150_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-wave4-roadmap-c.mjs';
import {ROADMAP_C_4B_WAVE5_SCHOOL,ROADMAP_C_4B_151_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-wave5-roadmap-c.mjs';
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


test('Luminbough new original source 151 preserves all 150 previous schoolhouse objects intact',()=>{
 const b=ROADMAP_C_4B_WAVE5_SCHOOL;
 assert.equal(b.id,'r4:schoolhouse:enchanted-forest:large:01');
 assert.ok(ROADMAP_C_4B_150_ALL.every((previous,i)=>previous===ROADMAP_C_4B_151_ALL[i]));
 assert.deepEqual(validateCollection(ROADMAP_C_4B_151_ALL),{authored:151,remaining:134,creatorApproved:0,integrated:0});
 assert.equal(new Set(ROADMAP_C_4B_151_ALL.map(geometrySignature)).size,151);
 assert.equal(new Set(ROADMAP_C_4B_151_ALL.map(b=>b.id)).size,151);
});
test('Luminbough original two open forest moonwells, eight accessible teaching rooms, two genuine portals, support-backed roof/producer AABB',()=>{
 const b=ROADMAP_C_4B_WAVE5_SCHOOL;assert.equal(validateBlueprint(b).id,b.id);
 assert.deepEqual([b.creatorApproved,b.worldPlaced,b.integrated],[false,false,false]);
 assert.ok(b.cells.length>14000);assert.deepEqual([b.bounds[0],b.bounds[2]],[74,76]);
 assert.equal(b.spaces.length,8);
 assert.deepEqual(new Set(b.spaces.map(r=>r.kind)),new Set(['classroom','shared-study','teacher-area','arcanist-library','moonstone-observatory','potion-botanical-laboratory','enchanted-music-hall','field-astronomy']));
 const voxel=new Map(b.cells.map(c=>[key(c.at),c])),walk=new Set(b.navigation.map(p=>key(p.at)));
 assert.equal(voxel.size,b.cells.length);assert.ok(walk.size>3000);
 const foundations=b.cells.filter(x=>x.role==='foundation'),floors=b.cells.filter(x=>x.role==='floor'),roofs=b.cells.filter(x=>x.role==='roof'&&x.at[1]===7);
 assert.equal(foundations.length,floors.length);assert.equal(roofs.length,floors.length);
 for(const c of floors){const [x,y,z]=c.at;assert.equal(voxel.get(key([x,0,z]))?.role,'foundation');assert.equal(voxel.get(key([x,7,z]))?.role,'roof');}
 const realRaise=b.cells.filter(x=>x.role==='roof'&&x.at[1]>7);assert.ok(realRaise.length>600);
 for(const c of realRaise){const [x,y,z]=c.at;assert.ok(voxel.has(key([x,y-1,z])),'non-bearing canopy roof '+key(c.at));}
 for(const [x,z] of [[15,35],[61,37]]){
  for(const [dx,dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]])for(let y=0;y<14;y++)assert.ok(!voxel.has(key([x+dx,y,z+dz])),'canopy skylight is fake '+x+','+z);
 }
 const portals=b.openings.filter(x=>x.kind!=='window');assert.equal(portals.length,3);
 assert.equal(portals.filter(x=>x.kind==='door').length,2);
 for(const p of portals){const [x,y,z]=p.at;assert.ok(walk.has(key(p.at)),'door not floor-walkable');assert.ok(!voxel.has(key([x,y,z]))&&!voxel.has(key([x,y+1,z])),'door blocked');assert.equal(p.plannedClosure,'pack2:020');}
 for(const d of portals.filter(x=>x.kind==='door')){const [x,y,z]=d.at;assert.equal(voxel.get(key([x,4,z]))?.role,'beam');assert.equal(voxel.get(key([x,y,z-1]))?.role,'partition');assert.equal(voxel.get(key([x,y,z+1]))?.role,'partition');}
 const origin=portals.find(x=>x.kind==='entrance').at,Q=[origin],seen=new Set([key(origin)]);
 for(let i=0;i<Q.length;i++){const [x,y,z]=Q[i];for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){let a=key([x+dx,y,z+dz]);if(walk.has(a)&&!seen.has(a)){seen.add(a);Q.push([x+dx,y,z+dz]);}}}
 assert.equal(seen.size,walk.size,'source corridor disconnected');for(const s of b.spaces)assert.ok(seen.has(key(s.access)),'unreachable '+s.kind);
 assert.deepEqual(new Set(b.dependencies.map(x=>x.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const refs=b.cells.filter(x=>x.asset.startsWith('pack4:')).map(x=>({asset:x.asset,at:x.at,orientation:x.facing}));assert.ok(refs.length>=8);
 const pre=planManualFivePackBlueprint(refs,{maxInstances:4096});assert.equal(pre.instances,refs.length);assert.equal(pre.dryRun,true);assert.equal(pre.worldPlaced,false);
 for(const ref of refs.slice(0,8)){const s=resolveManualFivePackAsset(ref.asset,{orientation:ref.orientation});assert.ok(s.visibleBoxes.length&&s.selectionBoxes.length);assert.equal(s.livePlaceable,false);}
});
test('Luminbough source footprint has strict eight-way D4 Jaccard IoU under 0.89 versus all 150 earlier schoolhouses',()=>{
 const b=ROADMAP_C_4B_WAVE5_SCHOOL;let max=0,compared=0;for(const old of ROADMAP_C_4B_150_ALL){const iou=maxD4(b,old);compared++;max=Math.max(max,iou);assert.ok(iou<.89,'D4 source near clone of '+old.id+': '+iou);}
 assert.equal(compared,150);assert.ok(max<.89);
});
