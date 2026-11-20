import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectCaveClearance} from '../../src/auto-integration-support/cave-clearance-proof.mjs';
const sourceHeads={upper:'a'.repeat(40),deep:'b'.repeat(40)};
const route=[{x:192,y:-45,z:188},{x:192,y:-46,z:188}];
const upper=[],deep=[];
for(const p of route)for(let dx=-1;dx<=1;dx++){
 const dest=p.y===-45?upper:deep;
 for(let dy=0;dy<4;dy++)dest.push({x:p.x+dx,y:p.y+dy,z:p.z,kind:'AIR'});
 dest.push({x:p.x+dx,y:p.y-1,z:p.z,kind:'SOLID'});
}
const check=(overrides={})=>inspectCaveClearance({upper,deep,route,sourceHeads,...overrides});
test('rejects overlapping writes at unapproved transition',()=>assert.match(check().errors.join(),/overlapping/));
test('fails closed without producer heads',()=>assert.match(check({sourceHeads:null}).errors.join(),/heads/));
test('rejects absent supporting floor',()=>assert.match(check({upper:upper.filter(p=>!(p.y===-46&&p.x===191))}).errors.join(),/floor/));
test('rejects protected player edit',()=>assert.match(check({protectedCells:[route[0]]}).errors.join(),/edit/));
test('rejects disconnected route',()=>assert.match(check({route:[route[0],{x:192,y:-47,z:188}]}).errors.join(),/disconnected/));
test('rejects legacy layer modification',()=>assert.match(check({upper:[...upper,{x:192,y:-3,z:188,kind:'AIR'}]}).errors.join(),/legacy/));
test('does not mutate producer writes',()=>{const before=JSON.stringify({upper,deep,route});check();assert.equal(JSON.stringify({upper,deep,route}),before)});
