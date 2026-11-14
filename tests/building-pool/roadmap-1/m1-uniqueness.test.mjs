import test from 'node:test';
import assert from 'node:assert/strict';
import {getM1Blueprints} from '../../../src/building-pool/roadmap-1/m1-buildings.mjs';
import {findMirroredOrRotatedDuplicates,invariantGeometrySignature} from '../../../src/building-pool/roadmap-1/m1-uniqueness.mjs';
import {blueprintId} from '../../../src/building-pool/roadmap-1/schema.mjs';
const b=getM1Blueprints();
test('45 M1 candidates each have a genuinely independent D4 shape, not a mirror or 90-degree rotation',()=>{
 assert.deepEqual(findMirroredOrRotatedDuplicates(b),[]);
});
test('mirror copies are caught even with different IDs and renamed/recolored materials',()=>{
 const original=b[0],copy=structuredClone(original),w=copy.footprint.width;
 copy.id=blueprintId(copy.category,copy.biome,copy.size,2);copy.index=2;copy.title='repainted mirror';
 for(const p of copy.placements)p.at[0]=w-1-p.at[0];
 for(const v of copy.walkable)v[0]=w-1-v[0];
 for(const r of copy.rooms){const mn=r.min[0],mx=r.max[0];r.min[0]=w-mx;r.max[0]=w-mn;}
 for(const d of copy.portals)d.at[0]=w-1-d.at[0];
 assert.equal(invariantGeometrySignature(copy),invariantGeometrySignature(original));
 assert.deepEqual(findMirroredOrRotatedDuplicates([original,copy]),[[original.id,copy.id]]);
});
