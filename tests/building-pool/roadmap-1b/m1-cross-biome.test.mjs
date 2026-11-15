// Real Node source-execution and coordinate-parity tests for seven NEW Builder 1B biome-size designs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getCrossBiome1BPlans} from '../../../src/building-pool/roadmap-1b/m1-cross-biome-plans.mjs';
import {get1BCandidates} from '../../../src/building-pool/roadmap-1b/candidates.mjs';
import {getInheritedStables} from '../../../src/building-pool/roadmap-1b/legacy-import.mjs';
import {validateAllocation,QUOTAS} from '../../../src/building-pool/roadmap-1b/schema.mjs';
import {validateBlueprint,stableBlueprintJSON,structuralFingerprint} from '../../../src/building-pool/roadmap-1b/legacy-stable-schema.mjs';
const key=v=>v.join(',');
const family=(b,asset)=>b.placements.filter(p=>p.asset===asset);
const byCategory=Object.fromEntries(getCrossBiome1BPlans().map(b=>[b.category,b]));
test('seven original cross-biome source-authored building candidates have unique IDs, 3D massing and valid connected rooms',()=>{
 const newPlans=getCrossBiome1BPlans(),old=get1BCandidates();
 assert.equal(newPlans.length,7);assert.equal(old.length,28);
 assert.equal(new Set(newPlans.map(b=>b.id)).size,7);
 assert.equal(new Set(old.map(b=>b.id)).size,28);
 assert.equal(new Set(old.map(b=>structuralFingerprint(b))).size,28,'duplicate physical shape independent of materials');
 for(const b of newPlans){
  assert.equal(validateBlueprint(b),true);
  assert.equal(b.status,'candidate');assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.ok(b.placements.length>=1100,'not a real 3D source: '+b.id);
  assert.ok(b.walkable.length>=250,'no interior circulation: '+b.id);
  assert.ok(b.rooms.length>=3&&b.portals.length>=3,'no functional program: '+b.id);
  assert.ok(b.placements.some(p=>p.role==='foundation'));
  assert.ok(b.placements.some(p=>p.role==='roof'));
  assert.ok(b.placements.some(p=>p.role==='window'));
  assert.ok(b.dependencies.some(d=>d.asset==='pack4:030'));
  assert.ok(b.dependencies.every(d=>d.status==='unresolved'&&d.requires.length>=3));
  assert.ok(b.placements.every(p=>p.asset!=='pack5:090'),'Pack 5 oven incorrectly used as storage');
  const occupied=new Set(b.placements.map(p=>key(p.at)));
  for(const portal of b.portals){
   assert.ok(!occupied.has(key(portal.at)),'physical portal blocked: '+b.id);
   assert.ok(!occupied.has(key([portal.at[0],portal.at[1]+1,portal.at[2]])),'portal head obstruction '+b.id);
   assert.ok(b.walkable.some(w=>key(w)===key(portal.at)),'unwalkable room doorway: '+b.id);
  }
  assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(getCrossBiome1BPlans().find(other=>other.id===b.id)),
   'non-deterministic generated cells '+b.id);
 }
 assert.deepEqual(validateAllocation(old).authored,28);assert.equal(validateAllocation(old).remaining,407);
});
test('Desert Medium bathhouse has physical separate hot/cold basins, four reachable zones, and an open cooling court',()=>{
 const b=byCategory.bathhouse;
 assert.equal(b.id,'r1:bathhouse:desert:medium:001');
 assert.ok(b.placements.filter(p=>p.purpose==='empty-basin-rim').length>25);
 assert.equal(b.rooms.length,4);assert.equal(b.portals.length,5);
 assert.ok(b.placements.some(p=>p.canopy==='arched-shade-arcade'));
 assert.ok(b.walkable.some(w=>key(w)==='14,1,16'),'courtyard basin access not truly open');
 assert.ok(b.walkable.some(w=>key(w)==='18,1,16'),'court side ventilation route not truly open');
});
test('Snow Medium Stable #004 is not inherited #002 and has six entirely empty accessible pens',()=>{
 const b=byCategory.stable;
 assert.equal(b.id,'r1:stable:snow:medium:004');
 assert.ok(!getInheritedStables().some(x=>x.id===b.id),'original ID overwritten');
 assert.equal(b.rooms.length,8);
 assert.equal(b.portals.filter(p=>p.opening==='open-empty-stall-bay').length,6);
 assert.ok(!b.animals||b.animals.length===0);
 assert.ok(b.placements.filter(p=>p.purpose==='roof-snow-brace').length>=10);
 assert.ok([...new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.at[1]))].length>=4);
});
test('Mountain Medium granary has two cart doors, a real partition into four functions and steep supported ridge',()=>{
 const b=byCategory['farm-barn'];
 assert.equal(b.footprint.width,25);assert.equal(b.rooms.length,4);
 assert.equal(b.portals.filter(p=>p.from==='outside').length,2);
 assert.ok(b.placements.filter(p=>p.purpose==='granary-ridge-post').length>=6);
 assert.ok(b.placements.some(p=>p.purpose==='grain-crate'));
 assert.ok(b.placements.some(p=>p.purpose==='equipment-rack'));
});
test('Mountain Large glasshouse has three genuinely separate glazed roof spans, seed bank and cold frame',()=>{
 const b=byCategory.greenhouse;
 assert.equal(b.id,'r1:greenhouse:mountain:large:001');
 assert.equal(b.footprint.width,29);assert.equal(b.footprint.depth,31);assert.equal(b.rooms.length,5);
 assert.ok(family(b,'pack4:030').filter(p=>p.role==='roof').length>400);
 assert.deepEqual([...new Set(b.placements.filter(p=>p.glazedMountainRidge).map(p=>p.glazedMountainRidge))].sort(),[1,2,3]);
 assert.ok(b.placements.filter(p=>p.purpose==='tiered alpine propagation trough').length>60);
 assert.ok(b.rooms.some(r=>r.id==='seed-bank-and-potting'));
 assert.ok(b.rooms.some(r=>r.id==='rear-cold-frame'));
});
test('Desert Medium fishing lodge genuinely has two branched piers with a void between them',()=>{
 const b=byCategory['fishing-lodge'],placement=new Set(b.placements.map(p=>key(p.at)));
 assert.ok(placement.has('7,0,30')&&placement.has('15,0,30'));
 assert.ok(!placement.has('11,0,30'),'twin dock prongs were silently filled');
 assert.ok(b.portals.some(p=>p.opening==='two-prong-shore-pier'));
 assert.ok(b.placements.some(p=>p.purpose==='air-drying-net'));
});
test('Enchanted Forest Medium Harbor Office has clerestory, actual curved service desk and two archives',()=>{
 const b=byCategory['harbor-office'];
 assert.ok(b.placements.filter(p=>p.purpose==='curving public permit counter').length===8);
 assert.ok(b.placements.filter(p=>p.moonrootVault).length>400);
 assert.ok([...new Set(b.placements.filter(p=>p.role==='roof').map(p=>p.at[1]))].length>=4);
 assert.ok(b.rooms.some(r=>r.id==='chart-and-survey-wing'));
 assert.ok(b.rooms.some(r=>r.id==='customs-ledger-wing'));
});
test('Snow Medium lighthouse physically bears two intermediate decks and retains a continuous vertical shaft',()=>{
 const b=byCategory.lighthouse,walk=new Set(b.walkable.map(key));
 assert.equal(b.footprint.height,29);
 assert.ok(b.placements.filter(p=>p.purpose==='lower-landing-load-post').length>=30);
 assert.ok(b.placements.filter(p=>p.purpose==='upper-landing-load-post').length>=30);
 assert.ok(b.placements.some(p=>p.purpose==='unlit frost beacon support'));
 const occupied=new Map(b.placements.map(p=>[key(p.at),p]));
 for(const y of [13,15,18,20,22])for(const z of [6,9,12]){
  assert.equal(occupied.get('4,'+y+','+z)?.role,'wall','roof not continuously supported by tall tapering shell at y='+y);
 }

 for(let y=1;y<=22;y++)assert.ok(walk.has('9,'+y+',9'),'shaft cut off at y='+y);
 assert.ok(walk.has('8,10,9')&&walk.has('8,20,9'),'upper landing disconnected');
 assert.ok(b.portals.filter(p=>p.opening.includes('unapproved')).length===2);
});
test('five biomes and all three physical sizes now represented by truly authored 1B candidates',()=>{
 const all=get1BCandidates(),sizes=new Set(all.map(b=>b.size)),biomes=new Set(all.map(b=>b.biome));
 assert.deepEqual([...sizes].sort(),['large','medium','small']);
 assert.deepEqual([...biomes].sort(),['desert','enchanted-forest','mountain','snow','temperate']);
 for(const [cat,quota] of Object.entries(QUOTAS)){
   const count=all.filter(b=>b.category===cat).length;
   assert.ok(count>0&&count<=quota*15);
 }
 assert.equal(all.filter(b=>b.category==='stable').length,16);
});
