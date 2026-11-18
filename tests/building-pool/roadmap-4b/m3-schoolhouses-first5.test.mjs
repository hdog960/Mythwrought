// Builder 4B M3: five source-authored original schoolhouses, real read-only manual producer shape evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M3_SCHOOLHOUSES_FIRST5,M3_143_ALL,M3_143_CENSUS,M3_SCHOOLHOUSES_FIRST5_NAMES} from '../../../src/building-pool/roadmap-4b/m3-schoolhouses-first5.mjs';
import {M2_138_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant05-final15.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {resolveManualFivePackAsset,planManualFivePackBlueprint,MANUAL_FIVE_PACK_COUNTS} from '../../../src/builder-assets/manual-five-pack.mjs';
const k=a=>a.join(',');
const floor=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
const norm=(pts,t)=>{
 const v=pts.map(([x,z])=>{let a=t&1?-x:x,b=z;if(t&2)[a,b]=[b,a];if(t&4)b=-b;return[a,b]});
 const minX=Math.min(...v.map(p=>p[0])),minZ=Math.min(...v.map(p=>p[1]));
 return new Set(v.map(([x,z])=>(x-minX)+','+(z-minZ)));
};
const d4IoU=(a,b)=>{
 const B=norm(floor(b),0);let worst=0;
 for(let t=0;t<8;t++){const A=norm(floor(a),t);let common=0;for(const x of A)if(B.has(x))common++;
  worst=Math.max(worst,common/(A.size+B.size-common));}
 return worst;
};
test('M3 five source originals extend all 138 accepted M2/M1 sources immutably',()=>{
 assert.equal(M3_SCHOOLHOUSES_FIRST5.length,5);
 assert.deepEqual(validateCollection(M3_143_ALL),{authored:143,remaining:142,creatorApproved:0,integrated:0});
 assert.deepEqual([M3_143_CENSUS.authored,M3_143_CENSUS.remaining,M3_143_CENSUS.schoolhouses,M3_143_CENSUS.fingerprints],[143,142,6,143]);
 assert.equal(new Set(M3_SCHOOLHOUSES_FIRST5_NAMES).size,5);
 assert.ok(M2_138_ALL.every((b,i)=>M3_143_ALL[i]===b),'138 accepted prior physical sources must not change');
 assert.equal(new Set(M3_143_ALL.map(b=>b.id)).size,143);
});
test('five independent M3 schools have one distinct new source slot per biome, true classrooms and shared study',()=>{
 const wanted=new Set([
 'r4:schoolhouse:temperate:medium:01','r4:schoolhouse:desert:large:01',
 'r4:schoolhouse:snow:small:01','r4:schoolhouse:enchanted-forest:large:01',
 'r4:schoolhouse:mountain:medium:01']);
 assert.deepEqual(new Set(M3_SCHOOLHOUSES_FIRST5.map(b=>b.id)),wanted);
 assert.deepEqual(new Set(M3_SCHOOLHOUSES_FIRST5.map(b=>b.biome)),new Set(BIOMES));
 for(const b of M3_SCHOOLHOUSES_FIRST5){
  assert.equal(b.type,'schoolhouse');assert.equal(b.variant,1);
  assert.equal(b.provenance.milestone,'M3');
  assert.ok(b.provenance.source.startsWith('M3'));
  assert.ok(b.spaces.some(s=>s.kind==='classroom'));
  assert.ok(b.spaces.some(s=>s.kind==='shared-study'));
 }
});
for(const b of M3_SCHOOLHOUSES_FIRST5)test(b.id+' has fully connected two-high education rooms, real bearing roofs and read-only source producer candidates',()=>{
 assert.equal(validateBlueprint(b).id,b.id);assert.ok(expectedIds().includes(b.id));
 assert.equal(b.worldPlaced,false);assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);
 assert.ok(b.cells.length>1500);assert.ok(b.spaces.length>=4);assert.ok(b.navigation.length>100);
 const vox=new Map(b.cells.map(c=>[k(c.at),c])),nav=new Set(b.navigation.map(n=>k(n.at)));
 const floors=b.cells.filter(c=>c.role==='floor'),found=b.cells.filter(c=>c.role==='foundation');
 assert.equal(floors.length,found.length);
 assert.equal(floors.length,b.cells.filter(c=>c.role==='roof'&&c.at[1]===7).length);
 for(const c of floors)assert.equal(vox.get(k([c.at[0],7,c.at[2]]))?.role,'roof');
 const raised=b.cells.filter(c=>c.role==='roof'&&c.at[1]>7);
 assert.ok(raised.some(c=>c.at[1]===10));
 for(const c of raised)assert.ok(vox.has(k([c.at[0],c.at[1]-1,c.at[2]])),'roof tier has no source support');
 const entry=b.openings.filter(o=>o.kind==='entrance'),doors=b.openings.filter(o=>o.kind==='door');
 assert.equal(entry.length,1);assert.equal(doors.length,1);
 for(const o of [...entry,...doors]){const [x,y,z]=o.at;
  assert.ok(nav.has(k(o.at)),'source door missing navigation');
  assert.ok(!vox.has(k([x,y,z]))&&!vox.has(k([x,y+1,z])),'source door lacks full two-cell headroom');
  assert.equal(o.plannedClosure,'pack2:020','closure planned only; never real mounted door');
 }
 const [x,y,z]=doors[0].at;
 assert.equal(vox.get(k([x,4,z]))?.role,'beam','a true bearing door lintel required');
 assert.ok([[[x-1,y,z],[x+1,y,z]],[[x,y,z-1],[x,y,z+1]]].some(pair=>pair.every(at=>vox.get(k(at))?.role==='partition')),
 'source internal portal must be cut between actual physical divider walls');
 const visited=new Set([k(entry[0].at)]),q=[entry[0].at];
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=[x+dx,y,z+dz],p=k(n);
  if(nav.has(p)&&!visited.has(p)){q.push(n);visited.add(p);}}}
 assert.equal(visited.size,nav.size,'school rooms/circulation disconnected');
 for(const room of b.spaces){assert.ok(room.footprint.length>=4);assert.ok(visited.has(k(room.access)),'room not accessible '+room.kind);
  for(const [x,z] of room.footprint)assert.equal(vox.get(k([x,1,z]))?.role,'floor');}
 assert.deepEqual(new Set(b.dependencies.map(d=>d.ref)),new Set(['pack4:030','pack4:058','pack4:059']));
 assert.ok(b.dependencies.every(d=>d.status==='catalog-provisional'&&d.unresolved.length>=2));
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const refs=b.cells.filter(c=>c.asset.startsWith('pack4:')).map(c=>({asset:c.asset,at:c.at,orientation:c.facing}));
 assert.ok(refs.length>=8);
 const dry=planManualFivePackBlueprint(refs,{maxInstances:4096});
 assert.equal(dry.instances,refs.length);assert.equal(dry.dryRun,true);
 assert.equal(dry.worldPlaced,false);assert.equal(dry.readyForWorldPlacement,false);
 assert.equal(dry.requiresCombinedRuntimeAcceptance,true);
 for(const ref of refs.slice(0,10)){const producer=resolveManualFivePackAsset(ref.asset,{orientation:ref.orientation});
  assert.ok(producer.visibleBoxes.length&&producer.selectionBoxes.length);
  assert.equal(producer.livePlaceable,false);assert.equal(producer.saveWritten,false);
  for(const box of producer.visibleBoxes)assert.ok(box.every(Number.isFinite));}
});
test('all 700 new schoolhouse-versus-old and within-cohort 8-way D4 normalized IoUs are strictly below 0.89',()=>{
 let count=0,max=0;
 for(let i=138;i<M3_143_ALL.length;i++)for(let j=0;j<i;j++){
  const v=d4IoU(M3_143_ALL[i],M3_143_ALL[j]);count++;max=Math.max(max,v);
  assert.ok(v<0.89,'schoolhouse D4 floor near-duplicate '+M3_143_ALL[i].id+' vs '+M3_143_ALL[j].id+' overlap '+v);
 }
 assert.equal(count,700);assert.ok(max<0.89);
 assert.equal(new Set(M3_143_ALL.map(geometrySignature)).size,143);
});
