// Cave #240 real WebGL-style far-rock staging ownership and budget tests.
// All tests use the source Cave World and a deterministic GL adapter; the
// genuine original index/main WebGL2 browser suite proves actual GPU rendering.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {createCaveFarWallGpu,planCaveFarWallSources,C6_FAR_BOUNDS}
 from '../src/manual-caves/c6-far-wall-gpu.mjs';
import {sectionWindow,sectionChunkRadius} from '../src/depth.mjs';
const world=createStagedCaveRuntime(314159,null,{approved:true}).world;
function fakeGl(){
 let next=0;const live=new Set(),uploaded=[],drawn=[];
 const gl={NO_ERROR:0,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
  FLOAT:5126,TRIANGLES:4,
  createBuffer(){const b={id:++next};live.add(b);return b;},
  getError(){return 0;},
  bindBuffer(_target,b){this.bound=b;},
  bufferData(_target,arr){assert.ok(arr instanceof Float32Array);uploaded.push(arr.byteLength);},
  deleteBuffer(b){live.delete(b);},
  vertexAttribPointer(){},
  drawArrays(_mode,_start,n){drawn.push(n);}
 };
 return {gl,live,uploaded,drawn};
}
const fan={x:204,z:136,feet:-124,yaw:0,pitch:0};
const complete=(p=fan)=>new Map(Array.from({length:
 sectionWindow(p.feet,false).reduce((n,s)=>n+(2*sectionChunkRadius(s,
 sectionWindow(p.feet,false)[0])+1)**2,0)},(_,i)=>[String(i),{buffer:{}}]));
function step(far,player=fan,{frame=30,enabled=true,nearChunks=complete(player),
 nearPending=new Map(),activeWorld=world}={}){
 return far.step({world:activeWorld,player,nearChunks,nearPending,
  frame,viewport:[844,390],enabled});
}
test('C6 actual source-planner is bounded, deterministic and opt-in within the cave',()=>{
 const a=planCaveFarWallSources(world,fan,[844,390]);
 const b=planCaveFarWallSources(world,fan,[844,390]);
 assert.deepEqual(a,b);
 assert.equal(a.nearExpected,27);
 assert.ok(a.samples<=C6_FAR_BOUNDS.maxSourceSamples);
 assert.ok(a.selected.length<=4);
 assert.ok(a.selected.every(c=>sectionWindow(fan.feet,false).includes(c.section)),
  'Far genuine-rock meshes must stay inside already-approved vertical sections');
 assert.ok(a.selected.every(c=>Number.isInteger(c.cx)&&Number.isInteger(c.cz)));
 const surface=planCaveFarWallSources(world,{...fan,feet:4},[844,390]);
 assert.equal(surface.selected.length,0);
});
test('C6 distant overhead source rock is chosen from a REAL adjacent depth section',()=>{
 // Camera at section -8. The rock roof is physically in section -7 and
 // beyond the 3x3 near stream, but still within the approved two-chunk ring.
 // Old eye-height-only rays/active-section filtering returned no roof mesh.
 const rock={get(x,y,z){return z>=32&&z<48&&y>=-115&&y<=-100?
  BLOCK.DEEPSTONE:BLOCK.AIR;}};
 const camera={x:8,z:8,feet:-124,yaw:0,pitch:0};
 const plan=planCaveFarWallSources(rock,camera,[844,390]);
 assert.ok(plan.selected.some(c=>c.section===-7&&c.cz===2&&
  c.source[1]>=-115&&c.source[1]<=-100),
 'Source-authenticated overhead ceiling was not found outside near stream');
 assert.ok(plan.samples<=C6_FAR_BOUNDS.maxSourceSamples);
 assert.ok(plan.selected.length<=C6_FAR_BOUNDS.maxChunks);
});
test('C6 actual Fan pixel ray selects its source-authenticated upper roof chunk',()=>{
 // Original 667x375 screen has a 383x320 genuine WebGL canvas.
 // The captured sky pixel x408,y78 rays to DEEPSTONE in 12,10,-7.
 assert.equal(world.get(196,-111,160),BLOCK.DEEPSTONE);
 const camera={x:204.5,z:136.5,feet:-123.99,yaw:0,
  pitch:-0.01999733397315129};
 const plan=planCaveFarWallSources(world,camera,[383,320]);
 assert.ok(plan.selected.some(c=>c.key==='12,10,-7'),
  'Original camera screen ray overhead rock omitted: '+
  JSON.stringify(plan.selected.map(c=>[c.key,c.hits])));
 // Current-head actual screenshot x228..283/y108..118 reveals real
 // ceiling in a second upper section chunk. Both rock roofs must be drawn.
 assert.equal(world.get(215,-115,160),BLOCK.DEEPSTONE);
 assert.ok(plan.selected.some(c=>c.key==='13,10,-7'),
  'Original game remaining Fan upper left skylight chunk omitted: '+
  JSON.stringify(plan.selected.map(c=>[c.key,c.hits,c.roofHits])));
 // Four output buffers, but source-authentic adjacent seam slices:
 // actual screenshot sees both 12,10,-8 and 13,10,-8.
 assert.equal(world.get(207,-116,160),BLOCK.DEEPSTONE);
 assert.ok(plan.selected.some(c=>c.key==='13,10,-8'),
  'Real peripheral 13,10,-8 rock must remain visible');
 const joined=plan.selected.find(c=>c.key==='12,10,-7');
 assert.equal(joined?.companion?.key,'12,10,-8',
  'Must pack the real adjacent lower section into a single buffer');
 assert.equal(plan.joinedSources,1);
 assert.ok(plan.samples<=C6_FAR_BOUNDS.maxSourceSamples);
 assert.ok(plan.selected.length<=C6_FAR_BOUNDS.maxChunks);
});
test('C6 wide original Fan source rock is covered in exactly four real GPU buffers',()=>{
 // Actual original-game 844x390 screenshot inner WebGL canvas is 540x335.
 // The formerly open sky edge rays first hit DEEPSTONE x225,-116,155,
 // beyond the three-chunk near radius, in source chunk 14,9,-8.
 const camera={x:204.5,z:136.5,feet:-123.99,
  yaw:0,pitch:-0.01999733397315129};
 const viewport=[540,335];
 assert.equal(world.get(225,-116,155),BLOCK.DEEPSTONE);
 const plan=planCaveFarWallSources(world,camera,viewport);
 assert.ok(plan.samples<=C6_FAR_BOUNDS.maxSourceSamples);
 assert.equal(plan.selected.length,4,'Source-aware Fan must still use only 4 GPU buffers');
 assert.ok(plan.selected.some(c=>c.key==='14,9,-8'),
  'Actual wide Fan missing first-solid rock: '+JSON.stringify(plan.selected.map(c=>c.key)));
 assert.ok(plan.selected.some(c=>c.key==='13,10,-7'&&
  c.companion?.key==='13,10,-8'),
  'Existing lower section must be joined to its real upper neighbor');
 assert.equal(plan.joinedSources,1);
 // Real remaining upper-right 329-pixel hole is NOT open world:
 // screenshot first-solid x182,-116,z169 must occupy the existing
 // 11,10,-7 GPU buffer as one allowed lower-section seam slice.
 assert.equal(world.get(182,-116,169),BLOCK.DEEPSTONE);
 const westRoof=plan.selected.find(c=>c.key==='11,10,-7');
 const middleRoof=plan.selected.find(c=>c.key==='12,10,-7');
 assert.equal(world.get(194,-116,162),BLOCK.DEEPSTONE);
 assert.equal(middleRoof?.seamCompanion?.key,'12,10,-8',
  'Original screenshot-proven middle rock seam must remain rendered');
 assert.equal(westRoof?.wideWitnessCompanion?.key,'11,10,-8',
  'Western screenshot-proven lower rock must share the existing GPU slot');
 assert.equal(plan.joinedSources,1);
 assert.equal(plan.seamSources,1,'Original strict one-seam cap remains');
 assert.equal(plan.wideWitnessSources,1,'At most one extra real wide source slice');
 assert.equal(plan.pending.some(c=>c.key==='11,10,-8'||c.key==='12,10,-8'),false,
  'Both physical lower sky-covering slices must be resident');
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 const near=complete(camera);
 for(let frame=30;frame<43;frame++)far.step({
  world,player:camera,nearChunks:near,nearPending:new Map(),
  frame,viewport,enabled:true
 });
 const state=far.stats();
 assert.equal(state.chunks,4);
 assert.equal(state.pending,0);
 assert.equal(state.budgetExcluded,0);
 assert.equal(state.failures,0);
 assert.equal(state.joinedSources,1);
 assert.equal(state.seamSources,1);
 assert.equal(state.wideWitnessSources,1);
 assert.equal(state.sourceSections,7,'Four buffers must count all seven physical source sections');
 assert.ok(state.sourceSamples<=3264&&state.bytes>0&&state.bytes<=1048576);
 assert.equal(g.uploaded.length,4);
 assert.equal(g.uploaded.reduce((sum,n)=>sum+n,0),state.bytes);
 assert.equal(far.draw({atPos:0,atColor:1,atUv:2,atMat:3}),state.vertices);
 far.invalidate();assert.equal(g.live.size,0);
});

test('C6 true Rift screen rays select source-authentic upper boundary within four GPU buffers',()=>{
 // Genuine original-game 667x375 diagnostic Rift camera on seed 314159:
 // blue x202..208/y134..137 first intersects real DEEPSTONE at
 // x176,y=-83,z192 in section 11,12,-5, absent from coarse 17-ray grid.
 const camera={x:159.5,z:210.5,feet:-90.99,
  yaw:1.8650308919060845,pitch:0.05620218481286228};
 assert.equal(world.get(176,-83,192),BLOCK.DEEPSTONE);
 const plan=planCaveFarWallSources(world,camera,[383,320]);
 assert.ok(plan.samples<=C6_FAR_BOUNDS.maxSourceSamples);
 assert.ok(plan.selected.length<=C6_FAR_BOUNDS.maxChunks);
 assert.equal(plan.joinedSources,1);
 assert.ok(plan.selected.some(c=>c.key==='11,11,-5'),
  'Rift original upper rock must not be displaced');
 assert.ok(plan.selected.some(c=>c.key==='11,12,-6'&&
  c.companion?.key==='11,12,-5'),
  'Rift missing upper real boundary must be joined in existing GPU slot: '+
  JSON.stringify(plan.selected.map(c=>[c.key,c.companion?.key])));
 // The separate screenshot-proven Rift void is NOT this existing source.
 // It first intersects physical x174,-84,187 in the adjacent lower slice.
 assert.equal(world.get(174,-84,187),BLOCK.DEEPSTONE);
 assert.equal(plan.seamSources,1);
 assert.ok(plan.selected.some(c=>c.key==='10,11,-5'&&
  c.seamCompanion?.key==='10,11,-6'),
  'Rift first-solid lower seam must join without replacing existing roof: '+
  JSON.stringify(plan.selected.map(c=>[c.key,c.seamCompanion?.key])));
});

test('C6 genuine 844x390 Rift upper seam is sourced and rendered without extra buffers',()=>{
 // Exact screenshot: 15 cyan pixels at x284..291/y139..142,
 // first-solid DEEPSTONE at x176,-83,z192. Never paint over sky.
 const camera={x:159.5,z:210.5,feet:-90.99,
  yaw:1.8650308919060845,pitch:0.05620218481286228};
 const viewport=[540,335];
 assert.equal(world.get(176,-83,192),BLOCK.DEEPSTONE);
 const plan=planCaveFarWallSources(world,camera,viewport);
 assert.equal(plan.samples<=C6_FAR_BOUNDS.maxSourceSamples,true);
 assert.equal(plan.selected.length,4,'Retain strict four-buffer cap');
 assert.equal(plan.joinedSources,1);
 assert.equal(plan.seamSources,1,'One real source-bound seam, not a new buffer');
 assert.ok(plan.selected.some(c=>c.key==='11,11,-6'&&
   c.companion?.key==='11,11,-5'),
   'Keep the already accepted real 844px Rift rock join: '+
   JSON.stringify(plan.selected.map(c=>[c.key,c.companion?.key,c.seamCompanion?.key])));
 assert.ok(plan.selected.some(c=>c.key==='11,12,-6'&&
   c.seamCompanion?.key==='11,12,-5'),
   'Screenshot-proven second Rift source must share the 11,12,-6 GPU buffer: '+
   JSON.stringify(plan.selected.map(c=>[c.key,c.companion?.key,c.seamCompanion?.key])));
 assert.equal(plan.pending.some(c=>c.key==='11,12,-5'),false);
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl),near=complete(camera);
 for(let frame=30;frame<43;frame++)far.step({
  world,player:camera,nearChunks:near,nearPending:new Map(),
  frame,viewport,enabled:true
 });
 const state=far.stats();
 assert.equal(state.chunks,4);
 assert.equal(state.pending,0);
 assert.equal(state.budgetExcluded,0);
 assert.equal(state.failures,0);
 assert.equal(state.joinedSources,1);
 assert.equal(state.seamSources,1);
 assert.equal(state.wideWitnessSources,0,'No extra wide GPU rock joining');
 assert.equal(state.sourceSections,6);
 assert.ok(state.sourceSamples<=3264);
 assert.ok(state.bytes>0&&state.bytes<=1048576);
 assert.equal(g.uploaded.length,4);
 assert.equal(g.uploaded.reduce((n,x)=>n+x,0),state.bytes);
 assert.equal(far.draw({atPos:0,atColor:1,atUv:2,atMat:3}),state.vertices);
 far.invalidate();assert.equal(g.live.size,0);
});

test('C6 original Rift two real seam sources upload and draw under 4 GPU buffers / 1 MiB',()=>{
 const camera={x:159.5,z:210.5,feet:-90.99,
  yaw:1.8650308919060845,pitch:0.05620218481286228};
 const viewport=[383,320];
 // The actual original-game screenshot previously showed 586 sky pixels.
 // Real rock at x174,-84,187 was omitted from the four GPU buffers.
 assert.equal(world.get(174,-84,187),BLOCK.DEEPSTONE);
 const plan=planCaveFarWallSources(world,camera,viewport);
 assert.equal(plan.joinedSources,1);
 assert.equal(plan.seamSources,1);
 assert.ok(plan.selected.some(c=>c.key==='11,12,-6' &&
  c.companion?.key==='11,12,-5'));
 assert.ok(plan.selected.some(c=>c.key==='10,11,-5' &&
  c.seamCompanion?.key==='10,11,-6'));
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl),near=complete(camera);
 for(let frame=30;frame<42;frame++){
  const snapshot=far.step({world,player:camera,nearChunks:near,
    nearPending:new Map(),frame,viewport,enabled:true});
  assert.equal(snapshot.failures,0,'Actual Rift rock GPU mesh upload failed');
  assert.ok(snapshot.bytes<=1048576,'Rift wall exceeds 1MiB GPU budget');
 }
 const state=far.stats();
 assert.equal(state.chunks,plan.selected.length,
  'Genuine far rock selected by source ray was never uploaded');
 assert.equal(state.pending,0,'Source rock remains unuploaded');
 assert.equal(state.budgetExcluded,0,
  'Mandatory sky-covering rock is silently excluded by GPU budget');
 assert.equal(state.joinedSources,1);
 assert.equal(state.seamSources,1);
 assert.equal(state.sourceSections,state.chunks+2);
 assert.equal(g.uploaded.length,state.chunks,
  'A fifth GPU buffer must never be used to mask the leak');
 assert.ok(g.uploaded.every(n=>n>0&&n%36===0));
 assert.equal(g.uploaded.reduce((sum,n)=>sum+n,0),state.bytes);
 assert.ok(state.bytes>0&&state.bytes<=1048576);
 assert.equal(far.draw({atPos:0,atColor:1,atUv:2,atMat:3}),state.vertices);
 far.invalidate();
 assert.equal(far.stats().bytes,0);
 assert.equal(g.live.size,0);
});
test('C6 no GPU allocations in any ordinary world or while near meshes pending',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 assert.equal(step(far,fan,{enabled:false}).chunks,0);
 assert.equal(g.uploaded.length,0);
 assert.equal(step(far,fan,{nearPending:new Map([['near',[0,0,-8]]])}).chunks,0);
 assert.equal(g.uploaded.length,0);
 assert.equal(step(far,fan,{nearChunks:new Map()}).chunks,0);
 assert.equal(g.uploaded.length,0);
 far.invalidate();assert.equal(g.live.size,0);
});
test('C6 far opaque draw uses genuine 36-byte packed source mesh and exact caps',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 for(let frame=30;frame<40;frame++)step(far,fan,{frame});
 const s=far.stats();
 assert.ok(s.chunks>0,'Expected original-world far rock beyond 27 near buffers');
 assert.ok(s.chunks<=4);
 assert.ok(s.joinedSources<=1);
 assert.ok(s.seamSources<=C6_FAR_BOUNDS.maxSeamSources);
 assert.ok(s.wideWitnessSources<=C6_FAR_BOUNDS.maxWideWitnessSources);
 assert.equal(s.sourceSections,s.chunks+s.joinedSources+s.seamSources+s.wideWitnessSources);
 assert.ok(s.bytes>0&&s.bytes<=1048576);
 assert.ok(s.vertices>0);
 assert.equal(g.uploaded.reduce((n,v)=>n+v,0),s.bytes);
 assert.equal(g.uploaded.every(n=>n%36===0),true);
 assert.equal(g.uploaded.length,s.chunks,
  'Real adjacent source slices must upload into one far GPU buffer');
 assert.equal(s.uploads,g.uploaded.length);
 const vertices=far.draw({atPos:0,atColor:1,atUv:2,atMat:3});
 assert.equal(vertices,s.vertices);
 assert.equal(g.drawn.reduce((n,v)=>n+v,0),s.vertices);
 far.invalidate();
 assert.equal(far.stats().bytes,0);
 assert.equal(g.live.size,0,'No leaked far GPU handles after edit invalidation');
});
test('C6 world/profile switch and real surface clear every far GPU buffer',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 for(let frame=30;frame<36;frame++)step(far,fan,{frame});
 assert.ok(far.stats().bytes>0);
 step(far,{...fan,feet:5},{frame:36});
 assert.equal(far.stats().chunks,0);
 assert.equal(g.live.size,0);
 for(let frame=60;frame<67;frame++)step(far,fan,{frame});
 assert.ok(far.stats().bytes>0);
 step(far,fan,{enabled:false,frame:67});
 assert.equal(far.stats().bytes,0);
 assert.equal(g.live.size,0);
});
test('C6 context lost discards stale references with no forbidden GPU calls',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 for(let frame=30;frame<37;frame++)step(far,fan,{frame});
 const before=g.uploaded.length;
 assert.ok(before>0);
 far.resetForLostContext();
 assert.equal(far.stats().chunks,0);
 assert.equal(far.stats().bytes,0);
 // WebGL handles already invalid at real loss, don't delete on lost context.
});
test('C6 F1 never touches canonical Cave World edits, near stream or saved keys',()=>{
 const before=world.base.edits.size;
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 const near=complete(fan),beforeNear=near.size;
 for(let frame=30;frame<36;frame++)step(far,fan,{frame,nearChunks:near});
 assert.equal(world.base.edits.size,before);
 assert.equal(near.size,beforeNear);
 assert.equal(far.stats().maxBytes,1048576);
 assert.equal(far.stats().maxChunks,4);
 far.invalidate();
});
