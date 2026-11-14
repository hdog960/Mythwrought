import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SCHEMA,PROGRAM,BIOMES,SIZES,PLANNED_TOTAL,REGISTERED,expectedIds,
  validateBlueprint,validateCollection,serializeBlueprint,geometrySignature}
  from '../../../src/building-pool/roadmap-4/schema.mjs';

function fixture(){
  const cells=[];
  for(let x=0;x<7;x++)for(let z=0;z<7;z++){
    cells.push({at:[x,0,z],asset:'base:stone',role:'floor',facing:'north'});
    cells.push({at:[x,4,z],asset:'base:wood',role:'roof',facing:'north'});
  }
  for(let y=1;y<=3;y++){
    for(let x=0;x<7;x++)for(const z of [0,6]){
      if(z===0&&x===3&&y<=2)continue;
      cells.push({at:[x,y,z],asset:'base:stone',role:'wall',facing:'north'});
    }
    for(let z=1;z<6;z++)for(const x of [0,6])
      cells.push({at:[x,y,z],asset:'base:stone',role:'wall',facing:'east'});
  }
  cells.push({at:[1,1,3],asset:'base:wood',role:'partition',facing:'north'});
  return {
    schema:SCHEMA,id:'r4:civic-hall:temperate:small:01',type:'civic-hall',biome:'temperate',size:'small',variant:1,
    bounds:[7,6,7],dependencies:[],cells,
    openings:[{at:[3,1,0],kind:'entrance',facing:'south'}],
    navigation:[
      {at:[3,1,0],mode:'walk'},{at:[3,1,1],mode:'walk'},{at:[3,1,2],mode:'walk'},
      {at:[2,1,2],mode:'walk'},{at:[4,1,2],mode:'walk'}
    ],
    spaces:[
      {id:'council',kind:'meeting',level:1,access:[2,1,2],footprint:[[1,2],[2,2]]},
      {id:'records',kind:'administration',level:1,access:[4,1,2],footprint:[[4,2],[5,2]]}
    ]
  };
}
const clone=x=>structuredClone(x);
const fails=(b,re)=>assert.throws(()=>validateBlueprint(b),re);

test('catalog has exactly 600 stable IDs, 5 biomes, 3 sizes, 11 kinds and correct milestone totals',()=>{
  const ids=expectedIds();
  assert.equal(ids.length,600);
  assert.equal(new Set(ids).size,600);
  assert.equal(BIOMES.length,5);assert.equal(SIZES.length,3);
  assert.equal(PROGRAM.length,11);assert.equal(PLANNED_TOTAL,600);
  assert.deepEqual([2,3,4].map(m=>PROGRAM.filter(p=>p.milestone===m)
    .reduce((n,p)=>n+p.perSizeBiome*15,0)),[225,195,180]);
});

test('checked-in manifest equals executable counts and claims zero authored buildings',()=>{
  const m=JSON.parse(fs.readFileSync(new URL('../../../src/building-pool/roadmap-4/manifest.json',import.meta.url),'utf8'));
  assert.equal(m.plannedTotal,600);assert.equal(m.authoredTotal,0);
  assert.equal(m.acceptedTotal,0);assert.equal(m.integrated,false);assert.equal(m.worldPlaced,false);
  assert.deepEqual(m.registeredCoreIds,REGISTERED);
  assert.deepEqual(m.categories.map(c=>c.type),PROGRAM.map(p=>p.type));
  assert.deepEqual(m.categories.map(c=>c.total),PROGRAM.map(p=>p.perSizeBiome*15));
});

test('fully constructed M0 test fixture validates with traversable authored rooms',()=>{
  assert.deepEqual(validateBlueprint(fixture()),{
    id:'r4:civic-hall:temperate:small:01',occupiedCells:fixture().cells.length,
    walkableCells:5,rooms:2,unresolvedAssets:0,levels:1,theoreticalOnly:true
  });
});
test('canonical serialization is order-independent for placement and room ordering',()=>{
  const a=fixture(),b=clone(a);
  b.cells.reverse();b.navigation.reverse();b.spaces.reverse();
  assert.equal(serializeBlueprint(a),serializeBlueprint(b));
});
test('reject overlapping voxel cells and obstructed walkable head clearance',()=>{
  const a=fixture();a.cells.push(clone(a.cells[0]));fails(a,/overlapping/);
  const b=fixture();b.cells.push({at:[3,2,1],asset:'base:stone',role:'column',facing:'north'});
  fails(b,/blocked/);
});
test('reject missing functional rooms, unsupported navigation and disconnected passages',()=>{
  const a=fixture();a.spaces.pop();fails(a,/administration/);
  const b=fixture();b.navigation=b.navigation.filter(n=>n.at[2]!==1);fails(b,/unreachable|room/);
  const c=fixture();c.cells=c.cells.filter(n=>n.at.join(',')!=='2,0,2');fails(c,/navigation lacks authored support|room footprint missing floor support/);
});
test('symbolic assets must include realistic unresolved dependency contracts and never numeric IDs',()=>{
  const a=fixture();a.cells.find(c=>c.role==='partition').asset='pack1:008';
  a.dependencies=[{ref:'pack1:008',state:'candidate',intendedShape:'partial',
    orientation:'rotatable',attachment:'floor',unresolved:['candidate geometry winding','stair collision adapter']}];
  assert.equal(validateBlueprint(a).unresolvedAssets,1);
  const b=clone(a);b.dependencies[0].numericId=10;fails(b,/misowned/);
  const c=clone(a);c.dependencies[0].unresolved=[];fails(c,/incomplete/);
  const d=clone(a);d.dependencies[0].ref='biome130:131';fails(d,/misowned/);
});
test('reject false full-cube stairs and inaccessible multiple storeys',()=>{
  const a=fixture();a.cells.find(c=>c.role==='partition').role='stair';
  fails(a,/full-cube registered block/);
  const b=fixture();b.spaces[0].level=2;fails(b,/room has no authored navigable access/);
});
test('fingerprint ignores material recolors but records structural change',()=>{
  const a=fixture(),b=clone(a);
  b.cells.find(c=>c.role==='partition').asset='base:stone';
  assert.equal(geometrySignature(a),geometrySignature(b));
  const c=clone(a);c.cells.find(x=>x.role==='partition').at=[1,1,4];
  assert.notEqual(geometrySignature(a),geometrySignature(c));
});
test('collection rejects duplicate IDs and rotated/tint-only duplicates',()=>{
  const a=fixture(),b=clone(a);b.variant=2;b.id='r4:civic-hall:temperate:small:02';
  assert.deepEqual(validateCollection([a]),{verified:1,expected:600,complete:false});
  assert.throws(()=>validateCollection([a,a]),/duplicate ID/);
  assert.throws(()=>validateCollection([a,b]),/repeated structure/);
  assert.throws(()=>validateCollection([a],{requireComplete:true}),/incomplete/);
});
