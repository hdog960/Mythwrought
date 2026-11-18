// Roadmap C 4B C3: new exact-source original large seven-pavilion school; prior 148 immutable.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_C_4B_WAVE3_SCHOOL,ROADMAP_C_4B_149_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-wave3-roadmap-c.mjs';
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


test('original Alderbridge seven-pavilion temperate large school adds exact one new candidate without modifying 148 previous objects',()=>{
 const b=ROADMAP_C_4B_WAVE3_SCHOOL;assert.equal(b.id,'r4:schoolhouse:temperate:large:01');
 assert.ok(M3_148_ALL.every((x,i)=>x===ROADMAP_C_4B_149_ALL[i]));
 assert.deepEqual(validateCollection(ROADMAP_C_4B_149_ALL),{authored:149,remaining:136,creatorApproved:0,integrated:0});
 assert.equal(new Set(ROADMAP_C_4B_149_ALL.map(geometrySignature)).size,149);
 assert.equal(new Set(ROADMAP_C_4B_149_ALL.map(b=>b.id)).size,149);
});
test('Alderbridge has actual six-room interconnected supported architecture, reliable portals and real read-only Pack source boxes',()=>{
 const b=ROADMAP_C_4B_WAVE3_SCHOOL;
 assert.equal(validateBlueprint(b).id,b.id);assert.deepEqual([b.creatorApproved,b.worldPlaced,b.integrated],[false,false,false]);
 assert.ok(b.cells.length>10000);assert.equal(b.bounds[0],64);assert.equal(b.bounds[2],65);
 assert.equal(b.spaces.length,6);assert.deepEqual(new Set(b.spaces.map(r=>r.kind)),new Set(['classroom','shared-study','teacher-area','natural-history-laboratory','civic-cartography-gallery','roundcourt-lecture-room']));
 const vox=new Map(b.cells.map(x=>[key(x.at),x])),walk=new Set(b.navigation.map(x=>key(x.at)));
 assert.equal(vox.size,b.cells.length,'voxel role overlap');assert.ok(walk.size>2000);
 const floor=b.cells.filter(x=>x.role==='floor'),foundation=b.cells.filter(x=>x.role==='foundation'),roof=b.cells.filter(x=>x.role==='roof'&&x.at[1]===7);
 assert.equal(floor.length,foundation.length);assert.equal(floor.length,roof.length);
 for(const c of floor){const [x,y,z]=c.at;assert.equal(vox.get(key([x,0,z]))?.role,'foundation');assert.equal(vox.get(key([x,7,z]))?.role,'roof');}
 const highRoof=b.cells.filter(x=>x.role==='roof'&&x.at[1]>7);assert.ok(highRoof.length>100);
 for(const p of highRoof){const [x,y,z]=p.at;assert.ok(vox.has(key([x,y-1,z])),'floating bearing roof '+key(p.at));}
 const openings=b.openings.filter(x=>x.kind!=='window');assert.equal(openings.length,2);
 for(const o of openings){const [x,y,z]=o.at;assert.ok(walk.has(key(o.at)),'portal not navigable');assert.ok(!vox.has(key([x,y,z]))&&!vox.has(key([x,y+1,z])),'portal blocked');assert.equal(o.plannedClosure,'pack2:020');}
 const interior=openings.find(x=>x.kind==='door'),[ix,iy,iz]=interior.at;
 assert.equal(vox.get(key([ix,4,iz]))?.role,'beam');assert.equal(vox.get(key([ix,iy,iz-1]))?.role,'partition');assert.equal(vox.get(key([ix,iy,iz+1]))?.role,'partition');
 const q=[openings.find(x=>x.kind==='entrance').at],seen=new Set([key(q[0])]);for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=key([x+dx,y,z+dz]);if(walk.has(k)&&!seen.has(k)){seen.add(k);q.push([x+dx,y,z+dz]);}}}
 assert.equal(seen.size,walk.size,'actual inaccessible map cells');for(const room of b.spaces)assert.ok(seen.has(key(room.access)),'unreachable '+room.kind);
 assert.deepEqual(new Set(b.dependencies.map(x=>x.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const refs=b.cells.filter(x=>x.asset.startsWith('pack4:')).map(x=>({asset:x.asset,at:x.at,orientation:x.facing}));assert.ok(refs.length>=8);
 const producer=planManualFivePackBlueprint(refs,{maxInstances:4096});assert.equal(producer.instances,refs.length);assert.equal(producer.dryRun,true);assert.equal(producer.worldPlaced,false);
 for(const x of refs.slice(0,8)){const shape=resolveManualFivePackAsset(x.asset,{orientation:x.orientation});assert.ok(shape.visibleBoxes.length&&shape.selectionBoxes.length);assert.equal(shape.livePlaceable,false);}
});
test('Alderbridge new source has strict eight-way normalized floor D4 overlap below 0.89 against all 148 old candidates',()=>{
 const b=ROADMAP_C_4B_WAVE3_SCHOOL;let maximum=0,compared=0;
 for(const old of M3_148_ALL){let v=maxD4(b,old);compared++;maximum=Math.max(maximum,v);assert.ok(v<0.89,'near duplicate: '+old.id+' '+v);}
 assert.equal(compared,148);assert.ok(maximum<0.89);
});
