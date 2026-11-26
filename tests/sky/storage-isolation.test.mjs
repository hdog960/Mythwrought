import test from 'node:test';
import assert from 'node:assert/strict';
import {assertSkyStorageIsolation as check} from './storage-isolation.mjs';
const f='mythwrought-exploration-v1-179',o='mythwrought-navigation00-observations-v1-179',w='mythwrought-v002-world-179',p='mythwrought-navigation00-v1-179';
const fog=cells=>JSON.stringify({version:1,seed:179,cellSize:4,cells});
const obs=(tiles,marks=[])=>JSON.stringify({version:1,seed:179,tiles,marks});
const mark={id:'cave-0-0',kind:'cave',x:1,y:2,z:1};
const start={[f]:fog(['0,0']),[o]:obs([[0,0,'#abcdef',2]],[mark]),[w]:'{"schema":1,"seed":179,"edits":[]}',[p]:'original-waypoint-bytes','mythwrought-exploration-v1-7':'historical-bytes'};
const grown={...start,[f]:fog(['0,0','1,0']),[o]:obs([[0,0,'#abcdef',2],[1,0,'#123456',4]],[mark])};
test('accepts only valid additive observations',()=>check(grown,start));
test('new valid fog and observation record allowed',()=>{const before={[w]:start[w]};check({...before,[f]:fog(['0,0']),[o]:obs([[0,0,'#abcdef',2]])},before);});
for(const [name,after] of [
 ['canonical bytes',{...grown,[w]:'different'}],['waypoint bytes',{...grown,[p]:'changed'}],['other seed bytes',{...grown,'mythwrought-exploration-v1-7':'changed'}],
 ['lost fog',{...grown,[f]:fog(['1,0'])}],['changed prior tile',{...grown,[o]:obs([[0,0,'#abcdef',3]],[mark])}],['lost landmark',{...grown,[o]:obs([[0,0,'#abcdef',2]])}],
 ['unwitnessed tile',{...grown,[o]:obs([[0,0,'#abcdef',2],[7,7,'#123456',4]],[mark])}],['duplicate fog',{...grown,[f]:fog(['0,0','0,0'])}],
 ['wrong seed',{...grown,[f]:JSON.stringify({version:1,seed:7,cellSize:4,cells:['0,0']})}],
 ['missing fog',Object.fromEntries(Object.entries(grown).filter(([k])=>k!==f))],
 ['missing observation',Object.fromEntries(Object.entries(grown).filter(([k])=>k!==o))]
])test('rejects '+name,()=>assert.throws(()=>check(after,start)));
