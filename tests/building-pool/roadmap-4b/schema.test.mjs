import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCHEMA, BIOMES, SIZES, PROGRAM, PLANNED_TOTAL, expectedIds,
  validateBlueprint, geometrySignature, validateCollection
} from '../../../src/building-pool/roadmap-4b/schema.mjs';

function exemplar(type='healers-house',variant=1){
  const bounds=[10,6,8],cells=[],navigation=[],rooms=[],openings=[{kind:'entrance',at:[4,2,0],facing:'north'}];
  for(let x=0;x<10;x++)for(let z=0;z<8;z++){
    cells.push({at:[x,0,z],role:'foundation',asset:'live:stone',facing:'north'});
    cells.push({at:[x,1,z],role:'floor',asset:'live:wood',facing:'north'});
    cells.push({at:[x,4,z],role:'roof',asset:'live:wood',facing:'north'});
    if((x===0||x===9||z===0||z===7)&&!(x===4&&z===0)){
      for(let y=2;y<=3;y++)cells.push({at:[x,y,z],role:'wall',asset:'live:stone',facing:'north'});
    }
    if(x>=1&&x<=8&&z>=1&&z<=6)navigation.push({at:[x,2,z],mode:'walk'});
  }
  navigation.push({at:[4,2,0],mode:'walk'});
  const p=PROGRAM.find(p=>p.type===type);
  for(let i=0;i<2;i++){
    const footprint=[];
    for(let x=i?5:1;x<=(i?8:4);x++)for(let z=1;z<=6;z++)footprint.push([x,z]);
    rooms.push({id:'room-'+i,kind:p.rooms[i],level:2,footprint,access:[i?6:2,2,3]});
  }
  return {schema:SCHEMA,id:'r4:'+type+':temperate:small:'+String(variant).padStart(2,'0'),
    type,biome:'temperate',size:'small',variant,bounds,cells,navigation,spaces:rooms,openings,
    dependencies:[],worldPlaced:false,creatorApproved:false,integrated:false};
}
const copy=b=>structuredClone(b);
const fails=(obj,re)=>assert.throws(()=>validateBlueprint(obj),re);

test('five exclusive categories have exactly 285 slots in 15 biome-size combinations',()=>{
  assert.equal(PLANNED_TOTAL,285);
  assert.deepEqual(PROGRAM.map(x=>[x.type,x.perCombination]),[
    ['healers-house',5],['library',4],['schoolhouse',4],
    ['magical-research-institute',3],['arcane-academy',3]
  ]);
  assert.equal(BIOMES.length,5);assert.equal(SIZES.length,3);
  assert.equal(expectedIds().length,285);
  assert.equal(new Set(expectedIds()).size,285);
  for(const p of PROGRAM)for(const biome of BIOMES)for(const size of SIZES)
    assert.equal(expectedIds().filter(id=>id.startsWith('r4:'+p.type+':'+biome+':'+size+':')).length,p.perCombination);
});
test('zero legacy designs means 285 remain, with no claims of acceptance',()=>{
  assert.deepEqual(validateCollection([]),{authored:0,remaining:285,creatorApproved:0,integrated:0});
  assert.throws(()=>validateCollection([],{requireComplete:true}),/not all 285/);
});
test('M0 fixture is not an authored building: geometric validations function',()=>{
  const v=validateBlueprint(exemplar());
  assert.equal(v.theoreticalOnly,true);assert.equal(v.rooms,2);assert.equal(v.unresolvedAssets,0);
  assert.ok(v.physicalCells>200);assert.ok(v.walkableCells>30);
});
test('original Roadmap 4 ID lineage is retained, without inventing PR 123 migration',()=>{
  assert.ok(expectedIds().every(x=>x.startsWith('r4:')));
  assert.ok(expectedIds().every(x=>!x.includes('civic-hall')&&!x.includes('castle-palace')));
  const b=exemplar();b.id=b.id.replace('r4:','r4b:');fails(b,/unstable original-category ID/);
});
test('duplicate physical occupancies fail closed',()=>{
  const b=exemplar();b.cells.push(copy(b.cells[0]));fails(b,/two physical cells overlap/);
});
test('foundation, roof and other mandatory massing cannot be omitted',()=>{
  const b=exemplar();b.cells=b.cells.filter(c=>c.role!=='roof');fails(b,/missing architectural roof/);
});
test('entrances require two-cell clear headroom',()=>{
  const b=exemplar();b.cells.push({at:[4,3,0],role:'wall',asset:'live:stone',facing:'north'});fails(b,/doorway blocked/);
});
test('a room must provide its own supported floor tiles',()=>{
  const b=exemplar();b.spaces[0].footprint.push([0,0]);fails(b,/room tile unsupported or occupied/);
});
test('functional spaces are category specific',()=>{
  const b=exemplar();b.spaces[0].kind='basement';fails(b,/required functional room missing/);
});
test('symbolic materials cannot silently bypass typed source/shape readiness',()=>{
  const b=exemplar();b.cells[0].asset='pack1:007';fails(b,/cell asset missing/);
  b.dependencies=[{ref:'pack1:007',source:'manual-five-pack',status:'catalog-provisional',shape:'partial',orientation:'rotatable',unresolved:['physical support and collision profile'] }];
  assert.equal(validateBlueprint(b).unresolvedAssets,1);
  b.dependencies[0].numericId=35;fails(b,/numeric symbolic dependency/);
});
test('biome130 can only be symbolic and rejects out-of-roster ordinals',()=>{
  const b=exemplar();b.cells[0].asset='biome130:042';
  b.dependencies=[{ref:'biome130:042',source:'biome130',status:'unregistered-symbolic',shape:'unknown',orientation:'unknown',unresolved:['pending live registration'] }];
  assert.equal(validateBlueprint(b).unresolvedAssets,1);
  b.dependencies[0].ref='biome130:999';fails(b,/invalid, duplicated or numeric symbolic dependency/);
});
test('non-physical IDs, extra per-cell quota and unsupported sizes are rejected',()=>{
  const b=exemplar();b.variant=6;fails(b,/invalid allocated slot/);
  b.variant=1;b.size='extra-large';fails(b,/invalid allocated slot/);
});
test('candidate must never claim to be in game or creator accepted',()=>{
  const b=exemplar();b.integrated=true;fails(b,/candidate must not claim/);
});
test('material swaps and reflected coordinate maps cannot create unique buildings',()=>{
  const b=exemplar(),mirror=copy(b);
  const m=x=>9-x;
  mirror.cells.forEach(c=>c.at[0]=m(c.at[0]));
  mirror.openings.forEach(o=>o.at[0]=m(o.at[0]));
  mirror.navigation.forEach(n=>n.at[0]=m(n.at[0]));
  mirror.spaces.forEach(r=>{r.access[0]=m(r.access[0]);r.footprint.forEach(tile=>tile[0]=m(tile[0]));});
  mirror.cells.forEach(c=>{if(c.asset==='live:wood')c.asset='live:stone';});
  mirror.variant=2;mirror.id=mirror.id.replace(':01',':02');
  assert.equal(geometrySignature(b),geometrySignature(mirror));
  assert.throws(()=>validateCollection([b,mirror]),/duplicate architecture/);
});
test('multicell piece reservations are fail-closed against real occupied cells',()=>{
  const b=exemplar();b.cells[0].asset='pack1:007';b.cells[0].reservations=[[1,0,0]];
  b.dependencies=[{ref:'pack1:007',source:'manual-five-pack',status:'catalog-provisional',shape:'multi-cell',orientation:'fixed',unresolved:['exact rotated footprint'] }];
  fails(b,/reservation overlaps occupied cell|multicell reservation collision/);
});
