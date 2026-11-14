import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints,getM1Blueprint} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {BIOMES,SIZES,validatePool,structuralFingerprint,stableBlueprintJSON} from '../../../src/building-pool/roadmap-1/schema.mjs';
import {DESIGN_MATRIX} from '../../../src/building-pool/roadmap-1/m1-designs.mjs';
const buildings=getM1Blueprints();
const key=(x,y,z)=>[x,y,z].join(',');
test('45 authored names, 15 of each class; complete 5-biome/3-size representative grid',()=>{
 assert.equal(buildings.length,45);assert.equal(new Set(buildings.map(x=>x.title)).size,45);
 for(const category of ['house','tavern','stable']){
  assert.equal(buildings.filter(b=>b.category===category).length,15);
  for(const biome of BIOMES)for(const size of SIZES){
   const b=buildings.find(x=>x.category===category&&x.biome===biome&&x.size===size);
   assert.ok(b,category+'/'+biome+'/'+size);assert.equal(b.index,SIZES.indexOf(size)+1);
  }
 }
 assert.equal(validatePool(buildings).authored,45);
});
test('authored matrices contain independent regional material and architecture layouts',()=>{
 const roofProfiles=new Set(),featureKinds=new Set(),plans=new Set();
 for(const b of buildings){const {plan,roof,feature}=b.architecturalIdentity;roofProfiles.add(roof);featureKinds.add(feature);plans.add(plan);assert.ok(DESIGN_MATRIX[b.category][b.biome][SIZES.indexOf(b.size)]);}
 assert.ok(roofProfiles.size>=8);assert.ok(featureKinds.size>=6);assert.ok(plans.size>=5);
 assert.equal(new Set(buildings.map(structuralFingerprint)).size,45);
});
test('all 45 serialize deterministically and select by stable ID',()=>{
 for(const b of buildings){assert.equal(getM1Blueprint(b.id)?.title,b.title);assert.equal(stableBlueprintJSON(b),stableBlueprintJSON(getM1Blueprint(b.id)));}
 assert.equal(getM1Blueprint('r1:invalid'),null);
});
test('every authored footprint has an uninterrupted ground slab and physical walls and roof',()=>{
 for(const b of buildings){const set=new Set(b.placements.filter(p=>p.at[1]===0).map(p=>key(...p.at)));const {width:w,depth:d}=b.footprint;
  for(let x=0;x<w;x++)for(let z=0;z<d;z++)assert.ok(set.has(key(x,0,z)),b.id+': missing slab '+x+','+z);
  for(const role of ['foundation','wall','roof','window','door','furnishing'])assert.ok(b.placements.some(p=>p.role===role),b.id+': missing '+role);
  assert.ok(b.placements.length>=200,b.id+': incomplete built volume');
 }
});
test('doors are nonblocking two-high openings, hinged placeholders on adjoining material',()=>{
 for(const b of buildings){const map=new Map(b.placements.map(p=>[key(...p.at),p]));
  for(const d of b.portals){const [x,y,z]=d.at;assert.equal(map.has(key(x,y,z)),false,b.id+' blocked portal foot');assert.equal(map.has(key(x,y+1,z)),false,b.id+' blocked portal head');}
  const actual=b.placements.filter(p=>p.role==='door');assert.ok(actual.length>=1);
  for(const p of actual){assert.equal(p.asset,'pack2:020');assert.equal(p.doorState,'open-stowed');assert.ok(p.mount?.length===2);}
 }
});
test('every room has walkable cells, every portal connects physical walkable sides',()=>{
 for(const b of buildings){const cells=new Set(b.walkable.map(v=>key(...v)));
  const contains=(r,v)=>v.every((n,i)=>n>=r.min[i]&&n<r.max[i]);
  for(const r of b.rooms)assert.ok(b.walkable.some(v=>contains(r,v)),b.id+': unused room '+r.id);
  for(const p of b.portals){const [x,y,z]=p.at;assert.ok(cells.has(key(x,y,z)));const near=[[x-1,y,z],[x+1,y,z],[x,y,z-1],[x,y,z+1]].filter(v=>cells.has(key(...v)));
   assert.ok(near.length>=1,b.id+': island doorway '+p.from+'->'+p.to);
  }
 }
});
test('all represented walking cells have two-high empty head clearance',()=>{
 for(const b of buildings){const occ=new Set(b.placements.map(p=>key(...p.at)));
  for(const [x,y,z] of b.walkable){assert.equal(occ.has(key(x,y,z)),false);assert.equal(occ.has(key(x,y+1,z)),false,b.id+' head clearance '+x+','+z);}
 }
});
test('independent depth and silhouette increase from small to medium to large per biome and class',()=>{
 for(const category of ['house','tavern','stable'])for(const biome of BIOMES){const bs=SIZES.map(size=>buildings.find(b=>b.category===category&&b.biome===biome&&b.size===size));
  assert.ok(bs[0].footprint.width*bs[0].footprint.depth<bs[1].footprint.width*bs[1].footprint.depth);
  assert.ok(bs[1].footprint.width*bs[1].footprint.depth<bs[2].footprint.width*bs[2].footprint.depth);
 }
});
test('each stable is completely empty of animals and contains tangible four-bay rails',()=>{
 for(const b of buildings.filter(b=>b.category==='stable')){
  assert.deepEqual(b.animals,[]);assert.equal(b.rooms.length,6);
  assert.ok(b.rooms.some(r=>r.id==='tack-room'));assert.ok(b.placements.some(p=>p.asset==='pack5:096'&&p.role==='furnishing'));
  assert.ok(b.placements.filter(p=>p.role==='partition').length>=5);
  assert.equal(b.portals.length,6);
 }
});
test('all symbolic candidate family dependencies are unresolved, no live IDs are assigned',()=>{
 for(const b of buildings){const placed=[...new Set(b.placements.filter(p=>!p.asset.startsWith('live:')).map(p=>p.asset))].sort();const deps=b.dependencies.map(d=>d.asset).sort();assert.deepEqual(deps,placed);
  assert.ok(b.dependencies.every(d=>d.status==='unresolved'&&d.requires.length>=3));
  assert.equal(b.worldPlacement,false);assert.equal(b.liveIntegration,false);
  assert.ok(b.placements.every(p=>typeof p.asset==='string'&&!/^\d+$/.test(p.asset)));
 }
});
test('plaster, snowy timber, enchanted beams, and mountain stone are physically referenced where intended',()=>{
 for(const [biome,asset] of [['temperate','pack2:013'],['desert','pack5:079'],['snow','pack2:014'],['enchanted-forest','pack2:015'],['mountain','pack1:006']]){
  for(const b of buildings.filter(b=>b.biome===biome))assert.ok(b.placements.some(p=>p.asset===asset&&p.role==='wall'));
 }
});
test('every candidate is standalone, not a world placement or functioning tavern/merchant/animal source',()=>{
 assert.ok(buildings.every(b=>b.worldPlacement===false&&b.liveIntegration===false));
 assert.ok(buildings.every(b=>b.placements.every(p=>!['npc','animal','merchant','harvest','gameplay'].includes(p.role))));
});

test('mountain large halls have three actual longitudinal aisles rather than recolored four-square cross rooms',()=>{
 for(const id of ['r1:house:mountain:large:003','r1:tavern:mountain:large:003']){
  const b=getM1Blueprint(id);
  assert.equal(b.architecturalIdentity.plan,'gallery');
  assert.equal(b.rooms.length,3);
  assert.equal(b.portals.length,3);
  const central=b.rooms[0],side=b.rooms.slice(1);
  assert.ok(side.every(r=>r.min[0]>=2&&r.max[0]<=b.footprint.width-2));
  assert.ok(central.min[0]>side[0].min[0]&&central.max[0]<side[1].max[0]);
  assert.ok(b.placements.some(p=>p.role==='partition'&&p.at[0]===central.min[0]-1));
  assert.ok(b.placements.some(p=>p.role==='partition'&&p.at[0]===central.max[0]));
 }
});
test('enchanted forest large stable has physically inward-sloping butterfly roofing',()=>{
 const b=getM1Blueprint('r1:stable:enchanted-forest:large:003');
 assert.equal(b.architecturalIdentity.roof,'butterfly');
 const {width,depth}=b.footprint;
 const z=Math.floor(depth/2),yAt=x=>b.placements.find(p=>p.role==='roof'&&p.at[0]===x&&p.at[2]===z)?.at[1];
 assert.ok(yAt(0)>yAt(Math.floor(width/2)));
 assert.ok(yAt(width-1)>yAt(Math.floor(width/2)));
 assert.deepEqual(b.animals,[]);
});
test('desert medium and large stable pen zone layout differs physically from temperate equivalents',()=>{
 for(const size of ['medium','large']){
  const ix=size==='medium'?'002':'003';
  const a=getM1Blueprint('r1:stable:desert:'+size+':'+ix);
  const b=getM1Blueprint('r1:stable:temperate:'+size+':'+ix);
  const front=d=>d.rooms.find(r=>r.id==='west-front');
  assert.ok(front(a).max[2]<front(b).max[2],a.id);
  assert.ok(a.placements.some(p=>p.role==='partition'&&p.at[2]===front(a).max[2]));
 }
});
