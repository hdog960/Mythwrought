import assert from 'node:assert/strict';
import {test} from 'node:test';
import {performance} from 'node:perf_hooks';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const seed=566928984;
const previous=process.env.MINING_SAVE_BASELINE;
assert.ok(previous,'Exact production baseline checkout required');
async function api(root){
 const load=p=>import(pathToFileURL(resolve(root,'src',p)).href);
 const [v,p,b,p2,s,k,scope]=await Promise.all(['voxel.mjs','manual-biomes/profile-world.mjs','manual-biomes/m2-runtime-bridge.mjs','pack2-world.mjs','persistence.mjs','seeds.mjs','manual-biomes/mountain-v8-isolated-storage.mjs'].map(load));
 return {...v,...p,...b,...p2,...s,...k,...scope};
}
const old=await api(previous),next=await api('.');
function fixture(A,{x=-11,z=-175,rows=155,generator=A.M8_MOUNTAIN_GENERATOR,extras=false}={}){
 const map=new Map(),log=[];let fault=null;
 const raw={get length(){return map.size},key:i=>[...map.keys()][i]??null,
 getItem(k){log.push(['get',k]);return map.get(k)??null},
 setItem(k,v){log.push(['set',k,String(v)]);if(fault?.(k,v))throw Error('injected write failure');map.set(k,String(v))},
 removeItem(k){log.push(['remove',k]);map.delete(k)}};
 const store=A.mountainV8Storage(raw),key=A.worldSlotKey(seed);
 let base;
 if(generator){const profile=A.fourRegionProfile(seed,generator),bytes=JSON.stringify(profile),record=JSON.stringify({version:1,checksum:A.saveFingerprint(bytes),raw:bytes});store.setItem(key+'-four-biomes-profile-v1',record);store.setItem(key+'-four-biomes-profile-v1-journal',record);base=new A.FourRegionWorld(seed,profile)}else base=new A.VoxelWorld(seed);
 const world=new A.Pack2LiveWorld(base);
 for(let i=0;i<rows;i++){const a=x+Math.floor(i/155)*32,y=14-i%155;assert.ok(world.set(a,y,z,world.get(a,y,z)===0?8:0))}
 if(extras){assert.ok(world.set(500,256,500,256,2));assert.ok(world.set(500,-210,500,0));assert.ok(world.placePack2(501,255,500,59,{rotation:0}));}
 const save=(opts)=>A.saveM2World(store,world,opts);
 const reopen=()=>A.openM2World(store,A.planM2WorldChoice(String(seed))).world;
 const snapshot=()=>[...map].sort(([a],[b])=>a.localeCompare(b));
 return {A,map,store,key,world,save,reopen,snapshot,log,fail:f=>{fault=f}};
}
function paired(opts){const a=fixture(old,opts),b=fixture(next,opts);return [a,b]}
function parity(a,b,{cold=true}={}){assert.deepEqual(b.snapshot(),a.snapshot());assert.deepEqual(b.log,a.log);if(cold){for(const f of [a,b]){const w=f.reopen();assert.deepEqual(w.save(),f.world.save());assert.deepEqual(w.pack2Snapshot(),f.world.pack2Snapshot());assert.equal(Object.hasOwn(w.base,'naturalAndLandmarkBlock'),false)}}}
function saveBoth(a,b,opts){a.log.length=b.log.length=0;let ra,rb;for(const [f,set] of [[a,v=>ra=v],[b,v=>rb=v]]){try{set(f.save(opts))}catch(e){set({threw:String(e)})}}assert.deepEqual(rb,ra);parity(a,b,{cold:false});return ra}
function edit(f,x,y,z){assert.ok(f.world.set(x,y,z,f.world.get(x,y,z)===0?8:0))}
function instrument(A){let active=false,stats;const originals=[];for(const [kind,proto] of [['legacy',A.VoxelWorld.prototype],['profile',A.FourRegionWorld.prototype]]){const orig=proto.naturalAndLandmarkBlock;originals.push(()=>{proto.naturalAndLandmarkBlock=orig});proto.naturalAndLandmarkBlock=function(x,y,z){if(!active||(kind==='legacy'&&this instanceof A.FourRegionWorld))return orig.call(this,x,y,z);const t=performance.now();try{return orig.call(this,x,y,z)}finally{stats[kind+'Ms']+=performance.now()-t;if(y>=-3&&y<=19)stats[kind+'SurfaceCalls']++}}}return {measure(fn){stats={legacyMs:0,profileMs:0,legacySurfaceCalls:0,profileSurfaceCalls:0};active=true;const t=performance.now();try{assert.ok(fn().ok);return {ms:performance.now()-t,...stats}}finally{active=false}},close(){for(const restore of originals)restore()}}}
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
test('current-profile same-byte saves, actual cold reopen and bounded source replay',()=>{
 for(const [label,x,z,rows] of [['spawn',0,0,155],['remote',-11,-175,155],['remote-history',-11,-175,310]]){
  const [a,b]=paired({x,z,rows});assert.ok(saveBoth(a,b).ok);const ia=instrument(old),ib=instrument(next),base=[],candidate=[];
  try{for(let j=0;j<12;j++){for(const f of [a,b]){edit(f,x,-140-j,z);f.log.length=0}base.push(ia.measure(a.save));candidate.push(ib.measure(b.save));parity(a,b,{cold:false})}}finally{ia.close();ib.close()}
  parity(a,b);assert.ok(base.every(r=>r.legacySurfaceCalls>0&&r.profileSurfaceCalls>0));assert.ok(candidate.every(r=>r.legacySurfaceCalls===0&&r.profileSurfaceCalls===0));
  console.log('MINING_SAVE_BENCH '+JSON.stringify({label,seed,x,z,rows:b.world.edits.size,iterations:12,baselineMedianMs:median(base.map(r=>r.ms)),candidateMedianMs:median(candidate.map(r=>r.ms)),baselineNaturalMs:median(base.map(r=>r.legacyMs+r.profileMs)),candidateNaturalMs:median(candidate.map(r=>r.legacyMs+r.profileMs)),baselineSurfaceCalls:median(base.map(r=>r.legacySurfaceCalls+r.profileSurfaceCalls)),candidateSurfaceCalls:median(candidate.map(r=>r.legacySurfaceCalls+r.profileSurfaceCalls)),baseline:base,candidate}));
 }
});
test('upper/lower/rotation/Pack2 exact bytes, historical generator and legacy parity',()=>{
 for(const generator of [next.M8_MOUNTAIN_GENERATOR,next.FOUR_REGION_GENERATOR,null]){const [a,b]=paired({generator,rows:40,extras:true});assert.ok(saveBoth(a,b).ok);for(const f of [a,b]){edit(f,-11,-141,-175);f.world.set(500,256,500,256,3)}assert.ok(saveBoth(a,b).ok);parity(a,b)}
});
test('changed storage and interrupted writes are never served from memoized save verdicts',()=>{
 const [a,b]=paired({rows:155,extras:true});assert.ok(saveBoth(a,b).ok);
 for(const f of [a,b]){edit(f,-11,-141,-175);f.fail(k=>k.endsWith(f.key));}assert.equal(saveBoth(a,b).ok,false);
 for(const f of [a,b]){f.fail(null);assert.deepEqual(f.reopen().save(),f.world.save());edit(f,-11,-142,-175)}assert.equal(saveBoth(a,b).ok,false);
 for(const f of [a,b]){const recovered=f.reopen();assert.notDeepEqual(recovered.save(),f.world.save());}
});
test('damaged profile, Pack2 journal, malformed raw and explicit recovery retain original decisions',()=>{
 for(const mode of ['profile','pack2','primary','journal']){
  const [a,b]=paired({rows:155,extras:true});assert.ok(saveBoth(a,b).ok);
  for(const f of [a,b]){const k=f.key;const suffix={profile:'-four-biomes-profile-v1',pack2:'-pack2-live-v1-journal',primary:'',journal:'-integrity-v009'}[mode];f.store.setItem(k+suffix,'{broken');edit(f,-11,-141,-175)}
  saveBoth(a,b);
 }
 const [a,b]=paired({rows:40,extras:true});assert.ok(saveBoth(a,b).ok);for(const f of [a,b]){f.store.setItem(f.key,'{broken');edit(f,-11,-141,-175)}saveBoth(a,b,{allowReplaceCorrupt:true});
});
