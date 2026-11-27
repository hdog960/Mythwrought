import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {openP0TileWorld,P0_TILE_WORLD_KIND} from '../src/manual-biomes/forgotten-sands-tile-world.mjs';
const root=process.env.P0_CURRENT_SOURCE;if(!root)throw Error('Exact current source required');
const load=p=>import(pathToFileURL(resolve(root,p)).href);
const [P,V,F,H,N,B,S,P2,I2]=await Promise.all(['src/manual-biomes/profile-world.mjs','src/voxel.mjs','src/physics.mjs','src/world-height.mjs','src/world-height-natural-contract.mjs','src/world-height-budget.mjs','src/world-height-stream.mjs','src/pack2-world.mjs','src/pack2-integration.mjs'].map(load));
const make=seed=>new P.FourRegionWorld(seed,P.fourRegionProfile(seed,P.M8_MOUNTAIN_GENERATOR));
function walk(world,s,turn){
 const [dx,dz]=[[0,-1],[1,0],[0,1],[-1,0]][turn],r=(s.size-1)/2;
 for(let d=1;d<=8;d++){
  const x=s.x+dx*(r+d)+.5,z=s.z+dz*(r+d)+.5;
  for(let y=19;y>=2;y--){
   if(!V.collides(world,x,y+.99,z)&&V.collides(world,x,y+.99-.065,z)){
    const p={x,z,feet:y+.99,yaw:Math.atan2(-dx,-dz),vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0},dist=r+d;
    const progress=()=>-(p.x-x)*dx-(p.z-z)*dz;
    let a=0,b=0,ok=true;while(progress()<dist&&a++<900){F.stepPlayer(world,p,{forward:1},1/60);if(V.collides(world,p.x,p.feet,p.z)){ok=false;break;}}
    if(!ok||progress()<dist)break;
    p.vX=0;p.vZ=0;while(progress()>.1&&b++<900){F.stepPlayer(world,p,{forward:-1},1/60);if(V.collides(world,p.x,p.feet,p.z)){ok=false;break;}}
    if(ok&&progress()<=.1)return {forward:a,back:b};break;
   }
  }
 }
 return null;
}
test('three new ordinary seeds reconstruct actual composed natural source, current collision, owner meshes and strict portable saves',async()=>{
 for(const seed of [42,-741,10301]){
  let epoch='detached-tile-world-r1';const opts={P,V,F,H,N,reserved:()=>false,revision:()=>epoch};
  const f=await openP0TileWorld(seed,[[1,0],[0,0]],opts),original=make(seed),w=f.world,wrapped=new P2.Pack2LiveWorld(w),before=JSON.stringify(original.save());
  assert.equal(f.identity.kind,P0_TILE_WORLD_KIND);assert.equal(f.identity.sites.length,1);assert.equal(f.identity.outcomes[0].reason,'not-desert-macrotile');assert.equal(f.placementAuthority,false);
  const q=f.witnesses[0],site=q.site;
  assert.ok(q.lower&&q.upper);const route=walk(wrapped,site,q.turn);assert.ok(route,'Current composed physical route blocked');
  const upperKeys=new Set();let lower=0,upper=0,meshes=0,peakSection=0,peakCombined=0;
  const r=(site.size-1)/2+8;
  for(let x=site.x-r;x<=site.x+r;x++)for(let z=site.z-r;z<=site.z+r;z++)for(let y=0;y<=17+site.height;y++){
   const a=original.get(x,y,z),b=w.get(x,y,z);if(a===b)continue;
   assert.equal(a,0);assert.notEqual(b,0);assert.equal(original.environmentCaves.get(x,y,z),undefined);
   if(y<20)lower++;else{upper++;upperKeys.add(H.physicalRegionAt(x,y,z).key);}
  }
  assert.equal(lower,f.counts.lower);assert.equal(upper,f.counts.upper);assert.equal(upperKeys.size,f.counts.upperOwners);
  const bytes=new Map();
  for(let cx=Math.floor((site.x-r)/16);cx<=Math.floor((site.x+r)/16);cx++)for(let cz=Math.floor((site.z-r)/16);cz<=Math.floor((site.z+r)/16);cz++)for(let section=0;section<=H.runtimeSectionForY(17+site.height);section++){
   const v=V.meshChunk(wrapped,cx,cz,section),water=I2.pack2WaterSectionVertices(wrapped,cx,cz,section);
   assert.ok(v.every(Number.isFinite));assert.equal(v.length%27,0);
   const k=H.runtimeMeshKey(cx,cz,section),n=section>0?B.validateUpperSectionGeometry(v,water):v.byteLength+water.byteLength;
   if(section>0){assert.equal(H.upperOccupancy(wrapped,k),upperKeys.has(k));if(upperKeys.has(k))assert.ok(n>0);peakSection=Math.max(peakSection,n);}
   bytes.set(k,n);meshes++;
  }
  const plans=[];
  for(const feet of [10,15,16,19,30]){
   const player={x:site.x-16.5,feet,z:site.z+.5},legacy=V.chunkWindow(player.x,player.z,2).map(c=>({...c,section:0})),selected=S.planHeightStream(wrapped,player,legacy);
   const keys=selected.map(c=>H.runtimeMeshKey(c.cx,c.cz,c.section));
   assert.ok(keys.length<=25);assert.ok(H.physicalBodyRegions(player).every(c=>keys.includes(c.key)));
   assert.ok(selected.filter(c=>c.section>0&&upperKeys.has(H.runtimeMeshKey(c.cx,c.cz,c.section))).length<=8);
   let total=0;for(const c of selected){const k=H.runtimeMeshKey(c.cx,c.cz,c.section);if(!bytes.has(k))bytes.set(k,V.meshChunk(wrapped,c.cx,c.cz,c.section).byteLength+I2.pack2WaterSectionVertices(wrapped,c.cx,c.cz,c.section).byteLength);total+=bytes.get(k);}
   peakCombined=Math.max(peakCombined,total);plans.push({feet,owners:keys.length,occupiedUpper:selected.filter(c=>c.section>0&&upperKeys.has(H.runtimeMeshKey(c.cx,c.cz,c.section))).length});
  }
  // An actual top ray must hit a proposed natural solid, not a proxy.
  let top=17+site.height;while(top>=20&&w.get(site.x,top,site.z)===0)top--;
  assert.ok(top>=20);const hit=V.raycast(wrapped,[site.x+.5,top+2.5,site.z+.5],[0,-1,0]);assert.deepEqual(hit.hit,[site.x,top,site.z]);assert.ok(V.collides(wrapped,site.x+.5,top+.1,site.z+.5));
  for(const [x,y,z,id] of [q.lower,q.upper]){assert.equal(w.get(x,y,z),id);assert.equal(w.set(x,y,z,0),true);assert.equal(w.get(x,y,z),0);}
  assert.equal(w.set(site.x,256,site.z,3),true);assert.equal(w.set(site.x,257,site.z,3),false);
  const payload=JSON.parse(JSON.stringify(f.portable())),cold=await openP0TileWorld(seed,[[0,0],[1,0]],opts),re=cold.restore(payload);
  assert.deepEqual(cold.identity,f.identity);assert.deepEqual(re.save(),w.save());
  for(const [x,y,z,id] of [q.lower,q.upper]){assert.equal(re.get(x,y,z),0);assert.equal(re.set(x,y,z,id),true);assert.equal(re.edits.has(V.worldKey(x,y,z)),false);}
  assert.equal(re.get(site.x,256,site.z),3);assert.equal(JSON.stringify(original.save()),before);
  const bad=JSON.parse(JSON.stringify(payload));bad.identity.manifestSha='0'.repeat(64);assert.throws(()=>cold.restore(bad),/identity/);
  epoch='r2';assert.throws(()=>cold.restore(payload),/Stale/);
  console.log('P0 TILE WORLD',JSON.stringify({seed,manifestSha:f.identity.manifestSha,counts:f.counts,route,meshes,peakSection,peakCombined,plans,top,edits:payload.world.edits.length,placementAuthority:false}));
 }
});
