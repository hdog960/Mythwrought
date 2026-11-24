// Genuine Chromium IndexedDB, localStorage and Web Locks. Isolated temporary
// browser context on loopback; no physical iPhone, WebGL or user storage.
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd();
const server=createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/mountain-admission-test'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><title>Isolated V8 admission test</title>');return;}
  const file=path.resolve(root,'.'+pathname);
  if(!file.startsWith(root+path.sep))throw Error('invalid path');
  res.writeHead(200,{'Content-Type':file.endsWith('.mjs')?'text/javascript':'text/plain'});
  res.end(await readFile(file));
 }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext(),page=await ctx.newPage();
 const url='http://127.0.0.1:'+server.address().port+'/mountain-admission-test';
 await page.goto(url);
 const result=await page.evaluate(async()=>{
  const a=await import('/src/manual-biomes/mountain-v8-new-world-admission.mjs');
  const {VoxelWorld,BLOCK}=await import('/src/voxel.mjs');
  const {VAULT_DB,MIRROR_DB}= { ...(await import('/src/vault.mjs')), ...(await import('/src/mirror.mjs')) };
  const {createVaultBackup}=await import('/src/vault.mjs');
  const {writeMirror}=await import('/src/mirror.mjs');
  const {openM2World,planM2WorldChoice,saveM2World}=await import('/src/manual-biomes/m2-runtime-bridge.mjs');
  const {SELECTED_SEED_KEY}=await import('/src/seeds.mjs');
  const {activateFourRegionProfile}=await import('/src/manual-biomes/profile-storage.mjs');
  const {M8_MOUNTAIN_GENERATOR}=await import('/src/manual-biomes/profile-world.mjs');
  const assert=(v,msg)=>{if(!v)throw Error(msg);};
  const refused=async(fn,pattern)=>{try{await fn();}catch(e){assert(pattern.test(String(e)),String(e));return;}throw Error('expected refusal '+pattern);};
  const snap=()=>JSON.stringify(Object.entries(localStorage).sort());
  const names=async()=>JSON.stringify((await indexedDB.databases()).map(x=>x.name).sort());
  const start=await names(),seed=20801;
  assert(start==='[]','fresh browser not empty');
  const absence=await a.inspectMountainV8OptionalSeed(seed);
  assert(!absence.claimed&&absence.absent.length===2,'absent database evidence');
  assert(await names()===start,'absence inspection created DB');
  const created=await a.createMountainV8CandidateWorld(String(seed),{confirmed:true});
  assert(created.created&&created.base.generationProfile.generator===M8_MOUNTAIN_GENERATOR,'V8 not opened');
  assert(await names()===start,'creation created optional DB');
  assert(localStorage.getItem(SELECTED_SEED_KEY)===null,'selected seed changed');
  const original=snap();
  await refused(()=>a.createMountainV8CandidateWorld(String(seed),{confirmed:true}),/local world|sidecar/);
  assert(snap()===original,'duplicate changed bytes');
  created.world.set(0,-100,0,BLOCK.AIR);
  assert(saveM2World(localStorage,created.world).ok,'profile save failed');
  const reopened=openM2World(localStorage,planM2WorldChoice(String(seed)));
  assert(reopened.base.generationProfile.generator===M8_MOUNTAIN_GENERATOR,'profile lost');
  assert(reopened.world.get(0,-100,0)===BLOCK.AIR,'mining edit lost');
  assert(JSON.stringify(reopened.world.save())===JSON.stringify(created.world.save()),'schema1 changed');
  const vSeed=20802,mSeed=20803;
  await createVaultBackup(JSON.stringify(new VoxelWorld(vSeed).save()));
  await writeMirror(JSON.stringify(new VoxelWorld(mSeed).save()));
  const before=snap(),dbNames=await names();
  await refused(()=>a.createMountainV8CandidateWorld(String(vSeed),{confirmed:true}),/Vault\/Mirror/);
  await refused(()=>a.createMountainV8CandidateWorld(String(mSeed),{confirmed:true}),/Vault\/Mirror/);
  assert(snap()===before&&await names()===dbNames,'claimed seed mutated storage');
  const sideSeed=20804;localStorage.setItem('mythwrought-caves-v1-seed-'+sideSeed,'opaque cave bytes');
  const side=snap();
  await refused(()=>a.createMountainV8CandidateWorld(String(sideSeed),{confirmed:true}),/local world|sidecar/);
  assert(snap()===side,'cave sidecar mutated');
  localStorage.setItem('mythwrought-unrecognized-owner-20805','reserved bytes');
  const unknown=snap();
  await refused(()=>a.createMountainV8CandidateWorld('20805',{confirmed:true}),/Additional local seed ownership/);
  assert(snap()===unknown,'unknown sidecar changed');
  await refused(()=>Promise.resolve(activateFourRegionProfile(localStorage,20806,{explicitNewWorld:true,generator:M8_MOUNTAIN_GENERATOR})),/not yet enabled/);
  assert(await names()===dbNames,'DB enumeration changed');
  return {seed,absence,existingClaims:[vSeed,mSeed],localRefusals:[sideSeed,20805],dbNames,saveRestored:true};
 });
 console.log('ACTUAL BROWSER ADMISSION',JSON.stringify(result));
 const other=await ctx.newPage();await other.goto(url);
 const create=p=>p.evaluate(async()=>{
  const a=await import('/src/manual-biomes/mountain-v8-new-world-admission.mjs');
  try{const r=await a.createMountainV8CandidateWorld('20807',{confirmed:true});return {created:r.created};}
  catch(e){return {created:false,error:String(e)};}
 });
 const concurrent=await Promise.all([create(page),create(other)]);
 assert.equal(concurrent.filter(x=>x.created).length,1);
 assert.match(concurrent.find(x=>!x.created).error,/local world|sidecar/);
 console.log('ACTUAL TWO-TAB COOPERATING WEB LOCK',JSON.stringify(concurrent));
 await ctx.close();
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
