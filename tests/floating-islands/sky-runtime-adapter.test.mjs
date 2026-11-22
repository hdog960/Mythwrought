import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SKY_ISLAND_MIN_Y,SKY_ISLAND_MAX_Y,SKY_ISLAND_SECTION_COUNT,SKY_ISLAND_LIGHTING_POLICY,
  SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS,
  skyIslandSectionForY,skyIslandSectionBounds,skyIslandMeshKey,skyIslandBodyRegions,
  verifySkyIslandFlightSpace,planSkyIslandResidency,planSkyIslandMeshJobs
} from '../src/floating-islands/sky-runtime-adapter.mjs';

test('exact upper world coverage Y20..256 uses fifteen no-gap slices',()=>{
  assert.equal(SKY_ISLAND_MIN_Y,20);assert.equal(SKY_ISLAND_MAX_Y,256);
  assert.equal(SKY_ISLAND_SECTION_COUNT,15);
  const covered=[];
  for(let section=0;section<SKY_ISLAND_SECTION_COUNT;section++){
    const bounds=skyIslandSectionBounds(section);
    for(let y=bounds.minY;y<=bounds.maxY;y++){
      assert.equal(skyIslandSectionForY(y),section);
      covered.push(y);
    }
  }
  assert.deepEqual(covered,Array.from({length:237},(_,i)=>i+20));
  assert.equal(skyIslandSectionForY(19),null);
  assert.equal(skyIslandSectionForY(257),null);
  assert.equal(skyIslandSectionForY(NaN),null);
  assert.throws(()=>skyIslandSectionBounds(15));
});

test('sky keys cannot alias existing surface and negative-depth chunk keys',()=>{
  for(const [cx,cz] of [[0,0],[-1,-1],[625,-625],[10000,-10000]]){
    const key=skyIslandMeshKey(cx,cz,14);
    assert.equal(key,`sky:${cx},${cz},14`);
    assert.notEqual(key,`${cx},${cz}`);
    assert.notEqual(key,`${cx},${cz},-14`);
  }
});

test('sky body overlap tracks negative x/z chunk seams and two vertical slices',()=>{
  const regions=skyIslandBodyRegions({x:0,feet:35.5,z:0});
  assert.equal(regions.length,8);
  assert.deepEqual([...new Set(regions.map(x=>x.section))],[0,1]);
  assert.deepEqual([...new Set(regions.map(x=>x.cx))],[-1,0]);
  assert.deepEqual([...new Set(regions.map(x=>x.cz))],[-1,0]);
  assert.equal(new Set(regions.map(r=>r.key)).size,8);
});

test('flight refuses missing sky seam BEFORE querying physical clearance',()=>{
  let collisionReads=0;
  const gate=verifySkyIslandFlightSpace({x:0,feet:35.5,z:0},{
    isSkySectionLoaded:r=>r.cx===0,
    isBodyClear:()=>{collisionReads++;return true;}
  });
  assert.equal(gate.ready,false);assert.equal(gate.reason,'Upper section not resident');
  assert.equal(gate.missing.length,4);assert.equal(collisionReads,0);
});

test('flight refuses colliding upper geometry and accepts loaded clear body',()=>{
  const at={x:12,feet:200,z:-24};
  const unloaded=verifySkyIslandFlightSpace(at,{isSkySectionLoaded:()=>false,isBodyClear:()=>true});
  assert.equal(unloaded.ready,false);
  const blocked=verifySkyIslandFlightSpace(at,{isSkySectionLoaded:()=>true,isBodyClear:()=>false});
  assert.equal(blocked.reason,'Physical body obstructed');
  const ready=verifySkyIslandFlightSpace(at,{isSkySectionLoaded:()=>true,isBodyClear:()=>true});
  assert.equal(ready.ready,true);assert.ok(ready.required.length>0);
  assert.equal(verifySkyIslandFlightSpace({...at,feet:258},{isSkySectionLoaded:()=>true,isBodyClear:()=>true}).ready,false);
});

test('original surface remains owned by base host; overhead body needs sky',()=>{
  const surface=skyIslandBodyRegions({x:4,feet:12,z:4});
  assert.deepEqual(surface,[]);
  const crossing=skyIslandBodyRegions({x:4,feet:19.5,z:4});
  assert.equal(crossing.length,1);assert.equal(crossing[0].section,0);
});

test('worldwide candidates remain coordinate-stable well beyond ten thousand blocks',()=>{
  const ground=[{cx:750,cz:-800},{cx:751,cz:-800}];
  const sky=[{cx:750,cz:-800,section:2},{cx:750,cz:-800,section:5}];
  const p={x:12005,feet:130,z:-12801};
  const a=planSkyIslandResidency({position:p,ground,sky});
  const b=planSkyIslandResidency({position:p,ground:[...ground].reverse(),sky:[...sky].reverse()});
  assert.deepEqual(a,b);
  assert.ok(a.slots.some(row=>row.kind==='sky'));
  assert.equal(a.slots.find(row=>row.kind==='sky').cx,750);
});

test('near-ground 3x3 terrain protection and upper visibility share 25 total slots',()=>{
  const ground=[];
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)ground.push({cx:dx,cz:dz});
  const sky=Array.from({length:12},(_,i)=>({cx:i%3-1,cz:Math.floor(i/3)-1,section:i+1}));
  const a=planSkyIslandResidency({position:{x:0,feet:11,z:0},ground,sky});
  assert.equal(a.total,25);assert.ok(a.skyCount>=3);assert.ok(a.skyCount<=6);
  assert.equal(a.groundCount+a.skyCount,25);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)
    assert.ok(a.slots.some(row=>row.key===`ground:${dx},${dz}`));
});

test('high flight gives preference to upper sections without inventing extra GPU slots',()=>{
  const ground=Array.from({length:25},(_,i)=>({cx:i%5-2,cz:Math.floor(i/5)-2}));
  const sky=Array.from({length:20},(_,i)=>({cx:i%5-2,cz:Math.floor(i/5)-2,section:12}));
  const a=planSkyIslandResidency({position:{x:0,feet:218,z:0},ground,sky,maxResident:25,maxSkyResident:6});
  assert.equal(a.total,25);assert.equal(a.skyCount,6);
  assert.equal(new Set(a.slots.map(row=>row.key)).size,25);
});

test('duplicate descriptors are deduplicated and input arrays unmodified',()=>{
  const sky=[{cx:0,cz:0,section:0},{cx:0,cz:0,section:0}];
  const before=structuredClone(sky);
  const plan=planSkyIslandResidency({position:{x:0,feet:20,z:0},sky});
  assert.equal(plan.skyCount,1);assert.deepEqual(sky,before);
  assert.ok(Object.isFrozen(plan.slots));assert.ok(Object.isFrozen(plan.slots[0]));
});

test('bounded frame jobs prepare at most two new upper meshes, never commit GPU state',()=>{
  const desired=[{kind:'ground',key:'ground:0,0'},{kind:'sky',key:'sky:0,0,1',cx:0,cz:0,section:1},
    {kind:'sky',key:'sky:0,0,2',cx:0,cz:0,section:2},
    {kind:'sky',key:'sky:0,0,3',cx:0,cz:0,section:3}];
  const planned=planSkyIslandMeshJobs({desired,resident:['ground:0,0','sky:1,0,1']});
  assert.deepEqual(planned.requests.map(x=>x.key),['sky:0,0,1','sky:0,0,2']);
  assert.deepEqual(planned.staleSky,['sky:1,0,1']);
  assert.equal(planned.commitAllowed,false);assert.equal(planned.requiresAtomicGpuStaging,true);
});

test('reject oversized work, invalid parameters, and forged section metadata',()=>{
  const position={x:0,feet:50,z:0};
  assert.throws(()=>planSkyIslandResidency({position,sky:[{cx:0,cz:0,section:15}]}));
  assert.throws(()=>planSkyIslandResidency({position,ground:new Array(257).fill({cx:0,cz:0})}));
  assert.throws(()=>planSkyIslandResidency({position,maxResident:28}));
  assert.throws(()=>planSkyIslandResidency({position,minimumSkyReserve:7}));
  assert.throws(()=>planSkyIslandMeshJobs({maxNewJobs:3}));
  assert.throws(()=>skyIslandBodyRegions({x:0,feet:50,z:0,radius:10}));
});

test('surface daylight must not depend on overhead island geometry',()=>{
  assert.equal(SKY_ISLAND_LIGHTING_POLICY.castSurfaceShadows,false);
  assert.equal(SKY_ISLAND_LIGHTING_POLICY.darkenGroundUnderIslands,false);
  assert.equal(SKY_ISLAND_LIGHTING_POLICY.shadowDrawPasses,0);
  assert.equal(SKY_ISLAND_LIGHTING_POLICY.requiresDepthReadback,false);
});

test('worldwide discovery does not allocate remote upper meshes outside local view budget',()=>{
  const at={x:12000,feet:200,z:-12800};
  const cx=Math.floor(at.x/16),cz=Math.floor(at.z/16);
  const result=planSkyIslandResidency({position:at,sky:[
    {cx,cz,section:10},
    {cx:cx+SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS,cz,section:11},
    {cx:cx+SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS+1,cz,section:12},
    {cx:-10000,cz:10000,section:13}]});
  assert.equal(result.skyCount,2);
  assert.ok(result.slots.every(row=>row.cx===cx || row.cx===cx+SKY_ISLAND_MAX_VIEW_RADIUS_CHUNKS));
});

test('upper-world flight hard-stops at the highest supported source Y',()=>{
  const host={isSkySectionLoaded:()=>true,isBodyClear:()=>true};
  assert.equal(verifySkyIslandFlightSpace({x:0,z:0,feet:256},host).ready,true);
  assert.equal(verifySkyIslandFlightSpace({x:0,z:0,feet:256.01},host).ready,false);
});
