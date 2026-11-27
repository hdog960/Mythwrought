import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {ShatteredPeaksTerraceWorld} from '../../src/manual-biomes/shattered-peaks-terrace.mjs';
import {inspectPhysicalMountainRange} from '../../src/manual-biomes/shattered-peaks-range-connectivity.mjs';
// New expanded physical proof only. Previous six-seed proposal survey and
// native vista/edit qualification are reused, not rerun.
const out='artifacts/shattered-peaks-session6';
await mkdir(out,{recursive:true});
const results=[];
for(const [seed,x,z,minimum] of [[19777,-1035,549,201],[711,-562,1062,191]]){
 const w=new ShatteredPeaksTerraceWorld(seed);
 const result=inspectPhysicalMountainRange(w,{x,z});
 assert.ok(result.peak?.y>=minimum,'known physically retained summit');
 assert.equal(result.admitted+result.vetoed,49*49);
 assert.ok(result.physicalCells>0&&result.protectedChecks>0);
 assert.ok(result.components[0].largest?.cells>1,'connected actual highland');
 if(seed===19777)assert.ok(result.components[2].total>0,'physical Y200+ evidence');
 assert.ok(result.approach,'bounded lower approach viewpoint');
 results.push(result);
 console.log('SP6_PHYSICAL_RANGE',JSON.stringify(result));
}
await writeFile(out+'/range.json',JSON.stringify(results,null,2));
