// Isolated, source-backed M2 final fifth-variant acceptance, never production placement.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_VARIANT05_FINAL15,M2_138_ALL,M2_138_CENSUS,M2_VARIANT05_FINAL_NAMES} from '../../../src/building-pool/roadmap-4b/m2-variant05-final15.mjs';
import {M2_123_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant04-final10.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES,SIZES} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {resolveManualFivePackAsset,planManualFivePackBlueprint,MANUAL_FIVE_PACK_COUNTS} from '../../../src/builder-assets/manual-five-pack.mjs';
const key=p=>p.join(',');
const footprint=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
const normalized=(points,t)=>{const v=points.map(([x,z])=>{let a=t&1?-x:x,b=z;if(t&2)[a,b]=[b,a];if(t&4)b=-b;return[a,b]});
 const xmin=Math.min(...v.map(p=>p[0])),zmin=Math.min(...v.map(p=>p[1]));return new Set(v.map(([x,z])=>(x-xmin)+','+(z-zmin)));};
const d4IoU=(left,right)=>{const B=normalized(footprint(right),0);let max=0;for(let t=0;t<8;t++){const A=normalized(footprint(left),t);let common=0;for(const a of A)if(B.has(a))common++;max=Math.max(max,common/(A.size+B.size-common));}return max;};
test('fifteen fifth-variant healer objects extend immutable original 123 to 138',()=>{
 assert.equal(M2_VARIANT05_FINAL15.length,15);
 assert.deepEqual(validateCollection(M2_138_ALL),{authored:138,remaining:147,creatorApproved:0,integrated:0});
 assert.deepEqual([M2_138_CENSUS.authored,M2_138_CENSUS.remaining,M2_138_CENSUS.healers,M2_138_CENSUS.libraries,M2_138_CENSUS.fingerprints],[138,147,75,60,138]);
 assert.equal(new Set(M2_VARIANT05_FINAL_NAMES).size,15);
 assert.ok(M2_123_ALL.every((b,i)=>M2_138_ALL[i]===b),'previous 123 original source objects must be identical');
 assert.equal(new Set(M2_138_ALL.map(b=>b.id)).size,138);
});
test('fifth healer variants fill each of five biomes at all three sizes exactly once',()=>{
 const expected=new Set(BIOMES.flatMap(b=>SIZES.map(s=>'r4:healers-house:'+b+':'+s+':05')));
 assert.deepEqual(new Set(M2_VARIANT05_FINAL15.map(b=>b.id)),expected);
 for(const biome of BIOMES)for(const size of SIZES)assert.equal(M2_138_ALL.filter(b=>b.type==='healers-house'&&b.biome===biome&&b.size===size).length,5);
 for(const biome of BIOMES)for(const size of SIZES)assert.equal(M2_138_ALL.filter(b=>b.type==='library'&&b.biome===biome&&b.size===size).length,4);
});
for(const b of M2_VARIANT05_FINAL15)test(b.id+' has real doors, bearing roof, walkable original clinical rooms and producer source candidates',()=>{
 assert.equal(validateBlueprint(b).id,b.id);
 assert.ok(expectedIds().includes(b.id));
 assert.equal(b.variant,5);assert.ok(b.cells.length>1500&&b.spaces.length>=4&&b.navigation.length>100);
 assert.equal(b.worldPlaced,false);assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);
 const vox=new Map(b.cells.map(c=>[key(c.at),c])),walk=new Set(b.navigation.map(n=>key(n.at)));
 const floors=b.cells.filter(c=>c.role==='floor'),foundations=b.cells.filter(c=>c.role==='foundation');
 assert.equal(floors.length,foundations.length);
 assert.equal(floors.length,b.cells.filter(c=>c.role==='roof'&&c.at[1]===7).length);
 for(const c of floors)assert.equal(vox.get(key([c.at[0],7,c.at[2]]))?.role,'roof');
 const raised=b.cells.filter(c=>c.role==='roof'&&c.at[1]>7);
 assert.ok(raised.some(c=>c.at[1]===10),'must have non-flat bearing-backed roof');
 for(const c of raised)assert.ok(vox.has(key([c.at[0],c.at[1]-1,c.at[2]])),'floating unsupported raised roof');
 const entry=b.openings.filter(o=>o.kind==='entrance'),doors=b.openings.filter(o=>o.kind==='door');
 assert.equal(entry.length,1);assert.equal(doors.length,1,'one real internal authored aperture mandatory');
 for(const o of [...entry,...doors]){
  const [x,y,z]=o.at;
  assert.ok(walk.has(key(o.at)),'aperture outside walkable graph');
  assert.ok(!vox.has(key([x,y,z]))&&!vox.has(key([x,y+1,z])),'physical opening blocked');
 }
 const [x,y,z]=doors[0].at;
 assert.equal(vox.get(key([x,4,z]))?.role,'beam','internal door lintel required');
 assert.ok([[[x-1,y,z],[x+1,y,z]],[[x,y,z-1],[x,y,z+1]]].some(pair=>pair.every(p=>vox.get(key(p))?.role==='partition')),'internal door must be actually cut through supported partition');
 const seen=new Set([key(entry[0].at)]),queue=[entry[0].at];
 for(let i=0;i<queue.length;i++){const [x,y,z]=queue[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const p=[x+dx,y,z+dz],k=key(p);if(walk.has(k)&&!seen.has(k)){queue.push(p);seen.add(k);}
 }}
 assert.equal(seen.size,walk.size,'source walks divided into disconnected islands');
 for(const room of b.spaces){assert.ok(room.footprint.length>=4,'tiny room '+room.kind);assert.ok(seen.has(key(room.access)),'room inaccessible '+room.kind);
  for(const [rx,rz] of room.footprint)assert.equal(vox.get(key([rx,1,rz]))?.role,'floor');}
 assert.ok(b.spaces.some(s=>s.kind==='treatment')&&b.spaces.some(s=>s.kind==='recovery'),'healer category requires clinical functions');
 assert.deepEqual(new Set(b.dependencies.map(x=>x.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.ok(b.dependencies.every(d=>d.status==='catalog-provisional'&&d.unresolved.length>=2));
 assert.ok(b.openings.some(o=>o.plannedClosure==='pack2:020'),'doors are planned symbolic closures only');
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const producers=b.cells.filter(c=>c.asset.startsWith('pack4:')).map(c=>({asset:c.asset,at:c.at,orientation:c.facing}));
 assert.ok(producers.length>=8);
 const dry=planManualFivePackBlueprint(producers,{maxInstances:4096});
 assert.equal(dry.instances,producers.length);
 assert.equal(dry.dryRun,true);assert.equal(dry.worldPlaced,false);assert.equal(dry.readyForWorldPlacement,false);
 assert.equal(dry.requiresCombinedRuntimeAcceptance,true);
 for(const candidate of producers.slice(0,10)){
  const shape=resolveManualFivePackAsset(candidate.asset,{orientation:candidate.orientation});
  assert.ok(shape.visibleBoxes.length&&shape.selectionBoxes.length);
  assert.equal(shape.livePlaceable,false);assert.equal(shape.saveWritten,false);
  for(const box of shape.visibleBoxes)assert.ok(box.every(Number.isFinite));
 }
});
test('all 1950 newly introduced normalized 8-way D4 floor comparisons are below strict 0.89',()=>{
 let count=0,max=0;
 for(let i=123;i<M2_138_ALL.length;i++)for(let j=0;j<i;j++){
  const v=d4IoU(M2_138_ALL[i],M2_138_ALL[j]);count++;max=Math.max(max,v);
  assert.ok(v<0.89,'D4 near-duplicate '+M2_138_ALL[i].id+' vs '+M2_138_ALL[j].id+' overlap='+v);
 }
 assert.equal(count,1950);assert.ok(max<0.89);
 assert.equal(new Set(M2_138_ALL.map(geometrySignature)).size,138);
});
