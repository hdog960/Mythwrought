import test from 'node:test';
import assert from 'node:assert/strict';
import {ACID_POOL_SHAPES,planAcidPool} from '../../../src/liquids/acid/content/pools.mjs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const peer=process.env.ACID_PHYSICS_MODULE?await import(pathToFileURL(resolve(process.env.ACID_PHYSICS_MODULE)).href):null;
const fixture=(over={})=>{
  const anchor=over.anchor??[0,0,0],shape=over.shape??'seep';
  const points=new Set(ACID_POOL_SHAPES[shape].map(([dx,dz])=>[anchor[0]+dx,anchor[1],anchor[2]+dz].join(',')));
  const inside=(...p)=>points.has(p.join(','));
  return {anchor,shape,availableUnits:100,acidQuantities:(n)=>({fixture:n*3}),engine:{getCell:()=>null},
    isLoaded:()=>true,isOpen:inside,isSolid:(...p)=>!inside(...p),canPlace:()=>true,...over};
};
test('finite seep has five distinct cells and all required containment',()=>{
  const p=planAcidPool(fixture({availableUnits:23}));
  assert.equal(p.totalUnits,20);assert.equal(p.remainingUnits,3);assert.deepEqual(p.totalQuantities,{fixture:60});
  assert.equal(new Set(p.placements.map(c=>[c.x,c.y,c.z].join(','))).size,5);
  assert.equal(p.requiredSolid.length,13);assert.ok(p.placements.every(c=>c.id==='acid'&&c.units===4&&c.expected===null));
  assert.ok(Object.isFrozen(p)&&Object.isFrozen(p.placements)&&Object.isFrozen(p.placements[0].quantities));
});
test('full basin uses finite stock and no renewable source',()=>{
  const p=planAcidPool(fixture({shape:'basin',unitsPerCell:8,availableUnits:72}));
  assert.equal(p.totalUnits,72);assert.equal(p.remainingUnits,0);assert.equal(p.placements.length,9);
  assert.equal(p.requiredSolid.length,21);assert.equal(planAcidPool(fixture({shape:'basin',unitsPerCell:8,availableUnits:71})),null);
});
test('unloaded floor, missing wall, protected target and occupied cell refuse the entire proposal',()=>{
  for(const over of [{isLoaded:(x,y)=>y!==-1},{isSolid:()=>false},{canPlace:()=>false},
    {engine:{getCell:()=>({id:'water',units:1})}},{isOpen:()=>false}])assert.equal(planAcidPool(fixture(over)),null);
});
test('physical edges and safe integers fail closed',()=>{
  assert.equal(planAcidPool(fixture({anchor:[0,-210,0]})),null);
  assert.equal(planAcidPool(fixture({anchor:[Number.MAX_SAFE_INTEGER,0,0]})),null);
  assert.equal(planAcidPool(fixture({anchor:[0,256,0]})).placements.length,5);
});
test('host reads are bounded and no mutation method is called',()=>{
  let reads=0,quantities=0;
  const f=fixture({engine:{getCell:()=>{reads++;return null;},insert:()=>assert.fail('mutation')},
    acidQuantities:n=>{quantities++;return {fixture:n};}});
  assert.deepEqual(planAcidPool(f),planAcidPool(f));assert.equal(reads,10);assert.equal(quantities,2);
});
test('invalid config and quantity payloads reject without applying anything',()=>{
  for(const over of [{availableUnits:-1},{unitsPerCell:9},{acidQuantities:()=>({bad:-1})},
    {acidQuantities:()=>({bad:2**40+1})}])assert.throws(()=>planAcidPool(fixture(over)));
  assert.throws(()=>planAcidPool({...fixture(),shape:'constructor'}));
});
test('fresh planning refuses a changed host without mutating the original plan',()=>{
  let blocked=false;const f=fixture({canPlace:()=>!blocked});const p=planAcidPool(f);blocked=true;
  assert.equal(planAcidPool(f),null);assert.equal(p.totalUnits,20);assert.equal(p.placements.length,5);
});
if(peer)test('actual Acid A quantity factory and strength reader preserve requested concentration',()=>{
  const p=planAcidPool(fixture({acidQuantities:peer.acidQuantities,strength:725}));
  assert.ok(p.placements.every(c=>peer.readAcidStrength(c)===725));
  assert.equal(p.placements.reduce((n,c)=>n+c.quantities[peer.ACID_SOLUTE],0),20*725);
  assert.equal(p.totalQuantities[peer.ACID_SOLUTE],20*725);
});
