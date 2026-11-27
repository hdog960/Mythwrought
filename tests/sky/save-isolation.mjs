// Sky-only actions may coexist with append-only observed map discovery.
// Compare every other byte; only the exact exercised seed's two independently
// scheduled navigation records may grow. Use the original source validators.
import assert from 'node:assert/strict';
import {loadExploration} from '../../src/exploration-map.mjs';
import {createObservationCatalog} from '../../src/navigation00/navigation-observation-catalog.mjs';
export function assertSkySaveIsolation(after,before,message,seed=179){
 const fog='mythwrought-exploration-v1-'+seed,obs='mythwrought-navigation00-observations-v1-'+seed;
 const nav=k=>k===fog||k===obs;
 const stable=s=>Object.fromEntries(Object.entries(s).filter(([k])=>!nav(k)));
 assert.deepEqual(stable(after),stable(before),message);
 for(const s of [before,after]){
  const storage={getItem:k=>s[k]??null};
  const discovery=loadExploration(storage,seed);
  const catalog=createObservationCatalog({seed,discovery,storage});
  assert.equal(discovery.readOnly,false,'Invalid navigation discovery bytes');
  assert.equal(catalog.readOnly,false,'Invalid observed navigation bytes');
  if(s[obs]){
   const v=JSON.parse(s[obs]);
   assert.ok(v.tiles.every(t=>discovery.seen.has(t[0]+','+t[1])),'Observation outside discovered cells');
   assert.ok(v.marks.every(p=>discovery.has(p.x,p.z)),'Landmark outside discovered cells');
  }
 }
 for(const key of [fog,obs]){
  if(!Object.hasOwn(before,key))continue;
  assert.ok(Object.hasOwn(after,key),'Navigation record disappeared: '+key);
  const prior=JSON.parse(before[key]),next=JSON.parse(after[key]);
  assert.equal(next.version,prior.version);assert.equal(next.seed,prior.seed);
  if(key===fog){
   assert.equal(next.cellSize,prior.cellSize);
   assert.ok(prior.cells.every(c=>next.cells.includes(c)),'Existing discovery lost');
  }else{
   const tiles=new Map(next.tiles.map(t=>[t[0]+','+t[1],t]));
   for(const t of prior.tiles)assert.deepEqual(tiles.get(t[0]+','+t[1]),t,'Existing observation changed');
   assert.deepEqual(next.marks,prior.marks,'Sky action changed existing landmark set');
  }
 }
}
