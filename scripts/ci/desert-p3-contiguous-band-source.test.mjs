// Authentic M7 Desert source-only bounded material interface accounting.
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {proposedDesertBandCap} from './desert-p3-contiguous-band-proposal.mjs';
const sites=[[179,-786,-1774],[2026,-2848,-774]];
test('genuine original V7 band preserves source geometry and counts all new and old interfaces',()=>{
 for(const [seed,cx,cz] of sites){
  const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const cache=new Map();
  let lookups=0;
  function originalAt(x,z){
   const key=x+','+z;
   if(cache.has(key))return cache.get(key);
   lookups++;
   const biome=v6BiomeAt(x,z,seed),plan=world._columnPlan(x,z);
   const eligible=plan.size>0,top=eligible?Math.max(...plan.keys()):null;
   const cell={x,z,biome:biome?.name??'plains',weight:biome?.weight??0,
     eligible,top,cap:eligible?plan.get(top):null};
   cache.set(key,cell);return cell;
  }
  const cells=new Map(),metrics={seed,examined:0,eligible:0,protectedVeto:0,
   changed:0,sourceScree:0,preservedScree:0,hardpanRockBefore:0,hardpanRockAfter:0,
   hardpanScreeBefore:0,hardpanScreeAfter:0,rockScreeBefore:0,rockScreeAfter:0,
   materialTransitionsBefore:0,materialTransitionsAfter:0,unrelatedChanged:0,
   witnesses:[]};
  for(let z=cz-16;z<=cz+16;z++)for(let x=cx-16;x<=cx+16;x++){
   metrics.examined++;
   const old=originalAt(x,z);
   const cap=proposedDesertBandCap(old,originalAt);
   const cell={...old,next:cap};cells.set(x+','+z,cell);
   if(!old.eligible){metrics.protectedVeto++;assert.equal(cap,null);continue;}
   metrics.eligible++;
   if(old.cap===401){metrics.sourceScree++;if(cap===401)metrics.preservedScree++;}
   if(cap!==old.cap){
    assert.equal(old.biome,'desert');assert.ok(old.weight<=.5);
    assert.equal(old.cap,258);assert.equal(cap,261);
    assert.equal(world._columnPlan(x,z).get(old.top),258,'Research does not mutate game');
    metrics.changed++;
    if(metrics.witnesses.length<10)metrics.witnesses.push([x,z,old.top,old.cap,cap]);
   }
  }
  const count=(a,b,phase)=>{
   const ca=a[phase],cb=b[phase];if(ca===cb)return;
   metrics[phase==='cap'?'materialTransitionsBefore':'materialTransitionsAfter']++;
   const pair=[ca,cb].sort((x,y)=>x-y).join('/');
   const label=phase==='cap'?'Before':'After';
   if(pair==='258/401')metrics['hardpanScree'+label]++;
   if(pair==='258/261')metrics['hardpanRock'+label]++;
   if(pair==='261/401')metrics['rockScree'+label]++;
  };
  for(let z=cz-16;z<=cz+16;z++)for(let x=cx-16;x<=cx+16;x++){
   const a=cells.get(x+','+z);
   if(a?.biome!=='desert'||!a.eligible)continue;
   for(const [dx,dz] of [[1,0],[0,1]]){
    const b=cells.get((x+dx)+','+(z+dz));
    if(b?.biome!=='desert'||!b.eligible)continue;
    count(a,b,'cap');count(a,b,'next');
   }
  }
  assert.equal(metrics.sourceScree,metrics.preservedScree);
  assert.equal(metrics.hardpanScreeAfter,0,'Contiguous one-cell apron must remove all eligible direct hardpan/scree contacts inside sample');
  assert.equal(metrics.unrelatedChanged,0);
  assert.deepEqual(world.save().edits,[]);
  console.log('DESERT_P3_CONTIGUOUS_SOURCE '+JSON.stringify({...metrics,originalColumnLookups:lookups}));
 }
});
test('band fail-closed for protected, non-desert, plain, mountain, non-hardpan and absent source scree',()=>{
 const originalAt=()=>({eligible:true,biome:'desert',cap:401});
 for(const item of [
  {eligible:false,biome:'desert',weight:.2,cap:258},
  {eligible:true,biome:'snow',weight:.2,cap:258},
  {eligible:true,biome:'mountain',weight:.2,cap:258},
  {eligible:true,biome:'plains',weight:0,cap:258},
  {eligible:true,biome:'desert',weight:.7,cap:258},
  {eligible:true,biome:'desert',weight:.2,cap:401},
  {eligible:true,biome:'desert',weight:.2,cap:256}
 ])assert.equal(proposedDesertBandCap({...item,x:0,z:0},originalAt),item.cap);
 assert.equal(proposedDesertBandCap({x:0,z:0,eligible:true,biome:'desert',weight:.2,cap:258},
  ()=>({eligible:false,biome:'desert',cap:401})),258);
});
