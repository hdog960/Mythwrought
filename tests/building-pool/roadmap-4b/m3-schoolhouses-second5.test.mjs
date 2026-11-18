// Roadmap C Builder 4B M3 Wave 2 acceptance — exclusively original candidate coordinates.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M3_SCHOOLHOUSES_SECOND5,M3_148_ALL,M3_148_CENSUS} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-second5.mjs';
import {M3_143_ALL} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-first5.mjs';
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

test('M3 Wave 2 adds five original ID slots while retaining all 143 source blueprints exactly',()=>{
 const expected=['r4:schoolhouse:temperate:small:01','r4:schoolhouse:desert:medium:01','r4:schoolhouse:snow:medium:01',
 'r4:schoolhouse:enchanted-forest:medium:01','r4:schoolhouse:mountain:large:01'];
 assert.deepEqual(M3_SCHOOLHOUSES_SECOND5.map(b=>b.id),expected);
 assert.deepEqual(validateCollection(M3_148_ALL),{authored:148,remaining:137,creatorApproved:0,integrated:0});
 assert.equal(M3_148_CENSUS.schoolhouses,11);
 assert.equal(M3_148_CENSUS.fingerprints,148);
 assert.ok(M3_143_ALL.every((b,i)=>M3_148_ALL[i]===b),'no mutation or copying of original 143 physical sources');
 assert.equal(new Set(M3_148_ALL.map(b=>b.id)).size,148);
});
for(const b of M3_SCHOOLHOUSES_SECOND5)test(b.id+' has source-backed rooms, roof support, true doors and physical producer preflight',()=>{
 assert.equal(validateBlueprint(b).id,b.id);
 assert.equal(b.type,'schoolhouse');assert.equal(b.variant,1);assert.equal(b.provenance.milestone,'M3');
 assert.deepEqual([b.worldPlaced,b.creatorApproved,b.integrated],[false,false,false]);
 assert.ok(b.cells.length>1500,'not enough actual source authored voxels');
 assert.ok(b.spaces.length>=4);
 assert.ok(b.spaces.some(r=>r.kind==='classroom')&&b.spaces.some(r=>r.kind==='shared-study'));
 const vox=new Map(b.cells.map(c=>[key(c.at),c])),nav=new Set(b.navigation.map(p=>key(p.at)));
 assert.ok(nav.size>100);
 const foundation=b.cells.filter(c=>c.role==='foundation'),floors=b.cells.filter(c=>c.role==='floor');
 assert.equal(foundation.length,floors.length);
 assert.equal(floors.length,b.cells.filter(c=>c.role==='roof'&&c.at[1]===7).length);
 for(const c of floors){const [x,y,z]=c.at;assert.equal(vox.get(key([x,0,z]))?.role,'foundation');assert.equal(vox.get(key([x,7,z]))?.role,'roof');}
 const raised=b.cells.filter(c=>c.role==='roof'&&c.at[1]>7);
 assert.ok(raised.some(c=>c.at[1]===10),'no actual elevated pitched roof');
 for(const c of raised){const [x,y,z]=c.at;assert.ok(vox.has(key([x,y-1,z])),'floating roof structure');}
 const entries=b.openings.filter(o=>o.kind==='entrance'),doors=b.openings.filter(o=>o.kind==='door');
 assert.equal(entries.length,1);assert.equal(doors.length,1);
 for(const o of [...entries,...doors]){
  const [x,y,z]=o.at;assert.equal(o.plannedClosure,'pack2:020');
  assert.ok(nav.has(key(o.at)),'door missing actual navigation');
  assert.ok(!vox.has(key([x,y,z]))&&!vox.has(key([x,y+1,z])),'door blocked');
 }
 const portal=doors[0].at,[x,y,z]=portal;
 assert.equal(vox.get(key([x,4,z]))?.role,'beam','actual door lintel missing');
 assert.ok([[[x-1,y,z],[x+1,y,z]],[[x,y,z-1],[x,y,z+1]]].some(pair=>pair.every(pos=>vox.get(key(pos))?.role==='partition')),'portal not cut through actual partition');
 const seen=new Set([key(entries[0].at)]),queue=[entries[0].at];
 for(let i=0;i<queue.length;i++){
  const [px,py,pz]=queue[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const q=[px+dx,py,pz+dz],k=key(q);if(nav.has(k)&&!seen.has(k)){seen.add(k);queue.push(q);}
  }
 }
 assert.equal(seen.size,nav.size,'disconnected rooms or corridors');
 for(const room of b.spaces){assert.ok(room.footprint.length>=4);assert.ok(seen.has(key(room.access)),'unreachable '+room.kind);}
 assert.deepEqual(new Set(b.dependencies.map(x=>x.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const refs=b.cells.filter(c=>c.asset.startsWith('pack4:')).map(c=>({asset:c.asset,at:c.at,orientation:c.facing}));
 assert.ok(refs.length>=8);
 const dry=planManualFivePackBlueprint(refs,{maxInstances:4096});
 assert.equal(dry.instances,refs.length);assert.equal(dry.dryRun,true);assert.equal(dry.worldPlaced,false);
 for(const ref of refs.slice(0,8)){
  const physical=resolveManualFivePackAsset(ref.asset,{orientation:ref.orientation});
  assert.ok(physical.visibleBoxes.length>0&&physical.selectionBoxes.length>0);
  assert.equal(physical.livePlaceable,false);
 }
});
test('five original schoolhouses pass 725 new-versus-old and new-versus-new eight-way D4 floor IoUs strictly below 0.89',()=>{
 let compared=0,max=0;
 for(let i=143;i<148;i++)for(let j=0;j<i;j++){
  const d4=maxD4(M3_148_ALL[i],M3_148_ALL[j]);compared++;max=Math.max(d4,max);
  assert.ok(d4<0.89,'D4 near-duplicate '+M3_148_ALL[i].id+' versus '+M3_148_ALL[j].id+' = '+d4);
 }
 assert.equal(compared,725);assert.ok(max<0.89);
 assert.equal(new Set(M3_148_ALL.map(geometrySignature)).size,148);
});
