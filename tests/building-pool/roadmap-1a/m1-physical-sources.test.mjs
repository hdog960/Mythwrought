import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1InnExemplars} from '../../../src/building-pool/roadmap-1a/m1-inn-exemplars.mjs';
import {auditM1PhysicalSources} from '../../../src/building-pool/roadmap-1a/m1-physical-sources.mjs';
const b=getM1InnExemplars()[0],a=auditM1PhysicalSources(b);
test('1A source-authentic physical family roster is 96 families and 106 variants',()=>{
 assert.equal(a.catalog.families,96);assert.equal(a.catalog.numericVariants,106);
 assert.equal(a.catalog.productionRegistered,false);
 assert.equal(a.productionReady,false);
});
test('Inn resolves actual Pack2,3,4,5 candidate physical shapes without inventing cells',()=>{
 assert.deepEqual(a.errors,[]);
 assert.deepEqual(a.unresolved,[]);
 for(const ref of ['pack2:013','pack2:020','pack2:022','pack3:023','pack4:030','pack5:082'])
  assert.ok(a.descriptors.some(x=>x.startsWith(ref+'/')),ref);
 assert.equal(a.roofTiles,306);assert.equal(a.roofBackingCells,306);
 assert.equal(a.bedHeads,2);assert.equal(a.bedFeet,2);
 assert.equal(a.windowCells,8);assert.equal(a.doorCells,5);
});
test('candidate bed footprint supports are authored, but production registration is still false',()=>{
 const b=a.provisionalSupports.filter(x=>x.asset==='pack5:082');
 assert.equal(b.length,4);
 assert.ok(b.every(x=>x.authorSolid));
 assert.equal(a.worldPlaced,false);assert.equal(a.physicalIPhoneTested,false);
});
