import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {nearDuplicatePairs,normalizedArchitectureCells} from '../../../src/building-pool/roadmap-1/m1-near-duplicate-review.mjs';
const buildings=getM1Blueprints();
test('all 45 authored buildings yield size-normalized material-independent structural patterns',()=>{
 for(const b of buildings)assert.ok(normalizedArchitectureCells(b).size>15,b.id);
 const top=nearDuplicatePairs(buildings,{limit:12});
 assert.equal(top.length,12);assert.ok(top.every(x=>x.similarity>=0&&x.similarity<=1));
 assert.ok(top.every(x=>x.a.split(':')[1]===x.b.split(':')[1]));
});
test('review scoring identifies an unchanged recolored/renamed clone as perfect similarity',()=>{
 const original=buildings[0],repaint=structuredClone(original);
 repaint.id='r1:house:temperate:small:020';
 repaint.title='Different paint, identical house';
 repaint.placements.filter(p=>p.asset==='live:wood').forEach(p=>p.asset='live:stone');
 const top=nearDuplicatePairs([original,repaint],{limit:1});
 assert.equal(top[0].similarity,1);
});
test('review respects category and reports useful nearest-neighbor pairs',()=>{
 const top=nearDuplicatePairs(buildings,{category:'tavern',limit:5});
 assert.equal(top.length,5);
 assert.ok(top.every(x=>x.a.startsWith('r1:tavern')&&x.b.startsWith('r1:tavern')));
 assert.throws(()=>nearDuplicatePairs(buildings,{limit:0}),/invalid/);
});
