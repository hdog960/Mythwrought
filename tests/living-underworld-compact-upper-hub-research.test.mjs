import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion,networkAirAt,auditUnderworldRegionGraph}
 from '../src/living-underworld/worldwide-network.mjs';
import {compactUpperHubResearchAirAt as compact,
 compactUpperHubResearchAnchors,UPPER_HUB_COMPACT_PROFILE}
 from '../src/living-underworld/compact-upper-hub-research.mjs';
import {auditSourceProtectedChunkRisk}
 from '../src/living-underworld/source-protected-chunk-risk.mjs';
const seed=179,sites=Object.freeze([
 Object.freeze({biome:'plains',rx:-9,rz:0,old:2696,compact:1911}),
 Object.freeze({biome:'desert',rx:-3,rz:-9,old:2425,compact:1595}),
 Object.freeze({biome:'snow',rx:-6,rz:3,old:3230,compact:1857}),
 Object.freeze({biome:'mountain',rx:6,rz:9,old:2994,compact:2193}),
 Object.freeze({biome:'enchanted',rx:-9,rz:-6,old:2823,compact:2061})
]);
const originOf=s=>{
 const h=planUnderworldRegion(seed,s.rx,s.rz).layers[0].hub;
 return {x:Math.floor(h.x/16)*16,y:Math.floor(h.y/16)*16,
  z:Math.floor(h.z/16)*16};
};
const census=(origin,side=16,halo=0)=>{
 let old=0,compactCount=0,newCells=0;const set=new Set(),width=side+2*halo;
 const start={x:origin.x-halo,y:origin.y-halo,z:origin.z-halo};
 for(let i=0;i<width;i++)for(let j=0;j<width;j++)
  for(let k=0;k<width;k++){
   const x=start.x+i,y=start.y+j,z=start.z+k;
   const original=networkAirAt(seed,x,y,z);
   const reduced=compact(seed,x,y,z);
   if(original)old++;
   if(reduced){compactCount++;set.add(i*width*width+j*width+k)}
   if(reduced&&!original)newCells++;
  }
 return {old,compactCount,newCells,set,width};
};
test('Phase35 original five real seed179 upper-hub core masks reproduce 14168 independent baseline cells',()=>{
 let original=0,compactTotal=0,removed=0;
 for(const s of sites){
  const r=census(originOf(s));
  assert.equal(r.old,s.old,s.biome+' original Phase34 core');
  assert.equal(r.compactCount,s.compact,s.biome+' reduced core');
  assert.equal(r.newCells,0,'compact research may NEVER add new original carve cells');
  assert.ok(r.compactCount<s.old);
  original+=r.old;compactTotal+=r.compactCount;removed+=r.old-r.compactCount;
 }
 assert.equal(original,14168);
 assert.equal(compactTotal,9617);
 assert.equal(removed,4551);
 assert.ok(compactTotal<=10000);
 assert.equal(UPPER_HUB_COMPACT_PROFILE.maxFiveBiomeOwnedInteriorCuts,10000);
});
test('Phase35 full 18^3 source-halo cube contains no newly proposed air in all five biomes',()=>{
 for(const s of sites){
  const r=census(originOf(s),16,1);
  assert.equal(r.newCells,0,s.biome);
  assert.equal(r.width,18);
 }
});
test('Phase35 all original upper-hub centers remain in unchanged region network',()=>{
 for(const s of sites){
  const a=compactUpperHubResearchAnchors(seed,s.rx,s.rz);
  assert.equal(compact(seed,a.hub.x,a.hub.y,a.hub.z),true);
  assert.equal(networkAirAt(seed,a.hub.x,a.hub.y,a.hub.z),true);
  assert.equal(a.worldChanged,false);
  assert.equal(a.playerWalkingVerified,false);
  assert.equal(auditUnderworldRegionGraph(seed,s.rx,s.rz).passed,true);
 }
});
test('Phase35 all original upper spoke, vertical and surface-tube centerlines remain carved',()=>{
 for(const s of sites){
  const plan=planUnderworldRegion(seed,s.rx,s.rz);
  assert.equal(plan.layers.length,4);
  assert.equal(plan.capsules.length,36);
  for(const [i,t] of plan.capsules.entries()){
   if(!(i<8||i===16||i===35))continue;
   for(let step=0;step<=12;step++){
    const f=step/12,x=Math.round(t.a.x+(t.b.x-t.a.x)*f),
     y=Math.round(t.a.y+(t.b.y-t.a.y)*f),
     z=Math.round(t.a.z+(t.b.z-t.a.z)*f);
    if(networkAirAt(seed,x,y,z))
     assert.equal(compact(seed,x,y,z),true,
      'Removed upper centerline '+s.biome+' tube '+i+' step '+step);
   }
  }
 }
});
test('Phase35 18^3 compact upper-hub air is a single six-neighbor 3D component per biome',()=>{
 const offsets=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
 for(const s of sites){
  const {set,width}=census(originOf(s),16,1);
  assert.ok(set.size>1000);
  const root=set.values().next().value;
  const seen=new Set([root]),stack=[root];
  while(stack.length){
   const v=stack.pop();
   const z=v%width,y=Math.floor(v/width)%width,
    x=Math.floor(v/(width*width));
   for(const [dx,dy,dz] of offsets){
    const xx=x+dx,yy=y+dy,zz=z+dz;
    if(xx<0||yy<0||zz<0||xx>=width||yy>=width||zz>=width)continue;
    const n=xx*width*width+yy*width+zz;
    if(set.has(n)&&!seen.has(n)){seen.add(n);stack.push(n)}
   }
  }
  assert.equal(seen.size,set.size,
   s.biome+' isolated cells in compact upper hub');
 }
});
test('Phase35 original deep-level chamber voxels are NEVER narrowed by upper-hub compaction',()=>{
 for(const s of sites){
  const plan=planUnderworldRegion(seed,s.rx,s.rz);
  for(let level=2;level<4;level++){
   const hub=plan.layers[level].hub;
   for(const [dx,dy,dz] of [[0,0,0],[2,1,1],[-2,-1,-1]]){
    const x=hub.x+dx,y=hub.y+dy,z=hub.z+dz;
    assert.equal(compact(seed,x,y,z),networkAirAt(seed,x,y,z));
   }
  }
 }
});
test('Phase35 native geometry proposal never bypasses original source ore veto',()=>{
 const s=sites[0],origin=originOf(s),h=planUnderworldRegion(seed,s.rx,s.rz).layers[0].hub;
 let unsafeAtHub=true;
 const source={
  naturalAt:(x,y,z)=>x===h.x&&y===h.y&&z===h.z&&unsafeAtHub?999:1,
  authoredAt:()=>undefined,editedAt:()=>false,protectedAt:()=>false
 };
 assert.equal(compact(seed,h.x,h.y,h.z),true);
 const result=auditSourceProtectedChunkRisk({origin,source,
  candidateAirAt:(x,y,z)=>compact(seed,x,y,z),
  maxCells:6000,maxFaceGrowth:1200});
 assert.equal(result.ok,false);
 assert.equal(result.reason,'ORIGINAL_M7_CARVE_SOURCE_UNSAFE');
 assert.ok(result.counts.oreOrUnsafe>=1);
 assert.equal(result.originalWorldUntouched,true);
 unsafeAtHub=false;
});
test('Phase35 proposal cannot be mistaken for actual native gameplay or settlement clearance',()=>{
 assert.equal(UPPER_HUB_COMPACT_PROFILE.liveGameplayNotEnabled,true);
 assert.equal(UPPER_HUB_COMPACT_PROFILE.generatedOriginalWorldUntouched,true);
 assert.equal(UPPER_HUB_COMPACT_PROFILE.originalGeometryIsAnImmutableUpperBound,true);
 assert.throws(()=>compact(179,1.2,-27,0),TypeError);
 assert.throws(()=>compact(179,0,-211,NaN),TypeError);
 assert.throws(()=>compactUpperHubResearchAnchors(179,0.3,0),TypeError);
});
