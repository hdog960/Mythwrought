import test from 'node:test';
import assert from 'node:assert/strict';
import {caveSpawnColumn} from '../src/mobs/cave-spawn-column.mjs';

const cases=[[179,4,5,-5],[379,4,5,-5],[1001,4,5,-5],[-77,-31,92,-12],[0,0,0,-1]];
for(const args of cases)test('complete deterministic deep column coverage '+args.join(','),()=>{
  for(let cycle=0;cycle<3;cycle++){
    const points=Array.from({length:256},(_,i)=>caveSpawnColumn(...args,cycle*256+i+1));
    assert.equal(new Set(points.map(p=>p.join(','))).size,256);
    assert.ok(points.every(p=>p.length===2&&p.every(x=>Number.isInteger(x)&&x>=0&&x<16)));
    assert.deepEqual(points,Array.from({length:256},(_,i)=>caveSpawnColumn(...args,cycle*256+i+1)));
  }
});
test('previous 240-attempt cave census covers 240 distinct columns before rarity filtering',()=>{
  for(const seed of [379,1001])assert.equal(new Set(Array.from({length:240},(_,i)=>caveSpawnColumn(seed,4,5,-5,i+1).join(','))).size,240);
});
