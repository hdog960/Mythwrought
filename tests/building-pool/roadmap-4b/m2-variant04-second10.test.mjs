// Builder 4B M2 — original fourth-variant healer/library physical-coordinate census.
import test from 'node:test';
import assert from 'node:assert/strict';
import {M2_VARIANT04_SECOND10,M2_113_ALL,M2_113_CENSUS,M2_VARIANT04_SECOND10_NAMES} from '../../../src/building-pool/roadmap-4b/m2-variant04-second10.mjs';
import {M2_103_ALL} from '../../../src/building-pool/roadmap-4b/m2-variant04-first10.mjs';
import {validateBlueprint,validateCollection,geometrySignature,expectedIds,BIOMES,SIZES} from '../../../src/building-pool/roadmap-4b/schema.mjs';
import {resolveManualFivePackAsset,planManualFivePackBlueprint,MANUAL_FIVE_PACK_COUNTS} from '../../../src/builder-assets/manual-five-pack.mjs';
const k=a=>a.join(',');
const base=b=>b.cells.filter(c=>c.role==='floor').map(c=>[c.at[0],c.at[2]]);
const normalized=(points,t)=>{const v=points.map(([x,z])=>{let a=t&1?-x:x,b=z;if(t&2)[a,b]=[b,a];if(t&4)b=-b;return[a,b]});
 const mx=Math.min(...v.map(p=>p[0])),mz=Math.min(...v.map(p=>p[1]));
 return new Set(v.map(([x,z])=>(x-mx)+','+(z-mz)));};
const d4IoU=(left,right)=>{const b=normalized(base(right),0);let max=0;for(let t=0;t<8;t++){
 const a=normalized(base(left),t);let inter=0;for(const key of a)if(b.has(key))inter++;
 max=Math.max(max,inter/(a.size+b.size-inter));}return max;};
test('ten new fourth-variant source objects extend immutable 103 older source objects to exactly 113',()=>{
 assert.equal(M2_VARIANT04_SECOND10.length,10);assert.equal(new Set(M2_VARIANT04_SECOND10_NAMES).size,10);
 assert.deepEqual(validateCollection(M2_113_ALL),{authored:113,remaining:172,creatorApproved:0,integrated:0});
 assert.equal(M2_113_CENSUS.newModels,10);assert.equal(M2_113_CENSUS.healers,55);
 assert.equal(M2_113_CENSUS.libraries,55);assert.equal(M2_113_CENSUS.fingerprints,113);
 assert.ok(M2_103_ALL.every((b,i)=>M2_113_ALL[i]===b),'earlier 103 source coordinate objects must not change');
 assert.equal(new Set(M2_113_ALL.map(b=>b.id)).size,113);
});
test('five original healing and five original library fourth variants fill different 5-biome/3-size slots',()=>{
 const expected=new Set([
 'r4:healers-house:temperate:medium:04',
 'r4:library:temperate:small:04',
 'r4:healers-house:desert:small:04',
 'r4:library:desert:medium:04',
 'r4:healers-house:snow:large:04',
 'r4:library:snow:medium:04',
 'r4:healers-house:enchanted-forest:small:04',
 'r4:library:enchanted-forest:small:04',
 'r4:healers-house:mountain:medium:04',
 'r4:library:mountain:small:04'
 ]);
 assert.deepEqual(new Set(M2_VARIANT04_SECOND10.map(b=>b.id)),expected);
 assert.deepEqual(new Set(M2_VARIANT04_SECOND10.map(b=>b.biome)),new Set(BIOMES));
 assert.deepEqual(new Set(M2_VARIANT04_SECOND10.map(b=>b.size)),new Set(SIZES));
 for(const type of ['healers-house','library'])for(const biome of BIOMES)
  assert.equal(M2_VARIANT04_SECOND10.filter(b=>b.type===type&&b.biome===biome).length,1);
});
for(const b of M2_VARIANT04_SECOND10)test(b.id+' physical voxel supports, navigable functional rooms and real producer shapes',()=>{
 assert.equal(validateBlueprint(b).id,b.id);assert.equal(b.variant,4);assert.ok(expectedIds().includes(b.id));
 assert.ok(b.cells.length>1500);assert.ok(b.spaces.length>=4);assert.ok(b.navigation.length>120);
 assert.equal(b.worldPlaced,false);assert.equal(b.creatorApproved,false);assert.equal(b.integrated,false);
 const vox=new Map(b.cells.map(c=>[k(c.at),c])),nav=new Set(b.navigation.map(n=>k(n.at)));
 const floors=b.cells.filter(c=>c.role==='floor'),found=b.cells.filter(c=>c.role==='foundation');
 assert.equal(floors.length,found.length);
 assert.equal(floors.length,b.cells.filter(c=>c.role==='roof'&&c.at[1]===7).length);
 for(const f of floors)assert.equal(vox.get(k([f.at[0],7,f.at[2]]))?.role,'roof');
 const raised=b.cells.filter(c=>c.role==='roof'&&c.at[1]>7);
 assert.ok(raised.some(c=>c.at[1]===10));
 for(const c of raised)assert.ok(vox.has(k([c.at[0],c.at[1]-1,c.at[2]])),'unsupported roof tier');
 const openings=b.openings.filter(o=>o.kind!=='window');
 assert.ok(openings.some(o=>o.kind==='entrance')&&openings.some(o=>o.kind==='door'));
 for(const o of openings){assert.ok(nav.has(k(o.at)));
  assert.ok(!vox.has(k(o.at))&&!vox.has(k([o.at[0],o.at[1]+1,o.at[2]])),'door blocks two-high clearance');}
 const entry=openings.find(o=>o.kind==='entrance').at,seen=new Set([k(entry)]),q=[entry];
 for(let i=0;i<q.length;i++){const [x,y,z]=q[i];for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const a=[x+dx,y,z+dz],key=k(a);
 if(nav.has(key)&&!seen.has(key)){seen.add(key);q.push(a);}}}
 assert.equal(seen.size,nav.size,'disconnected original circulation');
 for(const room of b.spaces){assert.ok(room.footprint.length>=4);assert.ok(seen.has(k(room.access)),'inaccessible room '+room.kind);
 for(const [x,z] of room.footprint)assert.equal(vox.get(k([x,1,z]))?.role,'floor');}
 const symbolic=new Set(b.dependencies.map(d=>d.ref));
 assert.deepEqual(symbolic,new Set(['pack4:030','pack4:058','pack4:059']));
 assert.ok(b.dependencies.every(d=>d.status==='catalog-provisional'&&d.unresolved.length>=2));
 assert.ok(b.openings.some(o=>o.plannedClosure==='pack2:020'));
 // Resolve actual source-backed producer AABBs without claiming mounting/placement approval.
 assert.deepEqual([MANUAL_FIVE_PACK_COUNTS.families,MANUAL_FIVE_PACK_COUNTS.numericVariants],[96,106]);
 const placements=b.cells.filter(c=>c.asset.startsWith('pack4:')).map(c=>({asset:c.asset,at:c.at,orientation:c.facing}));
 assert.ok(placements.length>=8,'missing real physical candidates');
 const dry=planManualFivePackBlueprint(placements,{maxInstances:4096});
 assert.equal(dry.instances,placements.length);assert.equal(dry.dryRun,true);
 assert.equal(dry.worldPlaced,false);assert.equal(dry.readyForWorldPlacement,false);
 assert.equal(dry.requiresCombinedRuntimeAcceptance,true);
 for(const row of placements.slice(0,8)){const shape=resolveManualFivePackAsset(row.asset,{orientation:row.orientation});
 assert.ok(shape.visibleBoxes.length&&shape.selectionBoxes.length);
 assert.equal(shape.livePlaceable,false);assert.equal(shape.saveWritten,false);
 for(const bounds of shape.visibleBoxes)assert.ok(bounds.every(Number.isFinite));}
});
test('1075 normalized eight-way floor comparisons reject all near-duplicate original architectures',()=>{
 let compared=0,worst=0;
 for(let i=103;i<M2_113_ALL.length;i++)for(let j=0;j<i;j++){
  const v=d4IoU(M2_113_ALL[i],M2_113_ALL[j]);compared++;worst=Math.max(worst,v);
  assert.ok(v<0.89,'source architecture near-duplicate '+M2_113_ALL[i].id+' vs '+M2_113_ALL[j].id+' D4 IoU '+v);
 }
 assert.equal(compared,1075);assert.ok(worst<0.89);
 assert.equal(new Set(M2_113_ALL.map(geometrySignature)).size,113);
});

test('six corrected original internal portals have physically adjacent partitions, two-high clear apertures and source-backed lintels',()=>{
 const expected=new Map([
  ['Willowcross Estuary Recovery House',[23,2,19]],
  ['Red Sirocco Travellers Clinic',[17,2,17]],
  ['Hoarfrost Compass Ward',[28,2,21]],
  ['Iceshelf Zigzag Codex Hall',[22,2,19]],
  ['Mossstar Three-Grove Hospice',[18,2,16]],
  ['Glowring Hollow Reading Atrium',[16,2,9]]
 ]);
 for(const b of M2_VARIANT04_SECOND10){
  if(!expected.has(b.provenance.originalPlan))continue;
  const portal=b.openings.filter(o=>o.kind==='door');
  assert.equal(portal.length,1,'only source-specific original internal doorway: '+b.id);
  assert.deepEqual(portal[0].at,expected.get(b.provenance.originalPlan));
  const [x,y,z]=portal[0].at,vox=new Map(b.cells.map(c=>[k(c.at),c]));
  assert.ok(!vox.has(k([x,y,z]))&&!vox.has(k([x,y+1,z])));
  assert.equal(vox.get(k([x,4,z]))?.role,'beam','physical lintel must carry room divider');
  const walls=[[[x-1,y,z],[x+1,y,z]],[[x,y,z-1],[x,y,z+1]]];
  assert.ok(walls.some(pair=>pair.every(at=>vox.get(k(at))?.role==='partition')),'internal door must be cut through actual two-sided original divider');
  assert.ok(b.navigation.some(n=>k(n.at)===k([x,y,z])));
 }
 assert.equal(expected.size,6);
});
