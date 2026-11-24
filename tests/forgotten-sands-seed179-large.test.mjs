import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {BLOCK} from '../src/voxel.mjs';
import {prepareP0Seed179LargeSite} from '../src/manual-biomes/forgotten-sands-seed179-large.mjs';
import {p0BenchmarkMesh,p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
const sha=v=>createHash('sha256').update(Buffer.from(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
test('new original seed179 63-wide geometry and exterior orientation walking',()=>{
  const {world,selected,walks,walkCertified}=prepareP0Seed179LargeSite(),{view,site,floor,maxY}=selected;
  assert.equal(floor,12);assert.equal(maxY,65);assert.equal(selected.placementAuthority,false);
  const keys=[],cache=new Map();let bytes=0,nonempty=0,proposed=0;
  for(let x=site.minX;x<=site.maxX;x++)for(let z=site.minZ;z<=site.maxZ;z++)
    for(let y=0;y<=maxY;y++){const a=world.get(x,y,z),b=view.get(x,y,z);if(a!==b){assert.equal(a,BLOCK.AIR);assert.notEqual(b,BLOCK.AIR);proposed++;}}
  const mesh=(cx,cz,s)=>{const v=p0BenchmarkMesh(view,cx,cz,s);assert.ok(v.every(Number.isFinite));assert.equal(v.length%27,0);return {hash:sha(v),bytes:v.byteLength};};
  const get=(cx,cz,s)=>{const key=[cx,cz,s].join(',');if(!cache.has(key))cache.set(key,mesh(cx,cz,s));return cache.get(key);};
  for(let cx=Math.floor(site.minX/16);cx<=Math.floor(site.maxX/16);cx++)
    for(let cz=Math.floor(site.minZ/16);cz<=Math.floor(site.maxZ/16);cz++)for(let s=0;s<=3;s++){
      keys.push([cx,cz,s]);const r=get(cx,cz,s);bytes+=r.bytes;if(r.bytes)nonempty++;}
  for(const k of [...keys].reverse())assert.deepEqual(mesh(...k),get(...k));
  let windows=0,peak=0,at=null;
  for(let cx=Math.floor(site.minX/16)-1;cx<=Math.floor(site.maxX/16)+1;cx++)
    for(let cz=Math.floor(site.minZ/16)-1;cz<=Math.floor(site.maxZ/16)+1;cz++)
      for(const feet of [13,20,36,52,65]){
        const win=p0BenchmarkWindow(cx,cz,feet);let n=0;for(const k of win)n+=get(k.cx,k.cz,k.s).bytes;
        assert.ok(win.length<=27);windows++;if(n>peak){peak=n;at=[cx,cz,feet];}}
  assert.ok(proposed>10000);assert.deepEqual(world.save().edits,[]);
  console.log('P0 SEED179 LARGE',JSON.stringify({site,walks,walkCertified,turn:selected.approach?.turn??null,proposed,hashes:keys.length,nonempty,bytes,uniqueMeshes:cache.size,windows,peak,at}));
});
