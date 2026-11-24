import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {BLOCK} from '../src/voxel.mjs';
import {prepareP0SecondSite,p0BenchmarkMesh,p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
const sha=v=>createHash('sha256').update(Buffer.from(v.buffer,v.byteOffset,v.byteLength)).digest('hex');
test('second negative-coordinate original site complete mesh and true exterior walks',()=>{
  const {world,selected,walks,walkCertified}=prepareP0SecondSite(),{view,site,floor,maxY}=selected;
  assert.equal(floor,13);assert.equal(maxY,66);assert.equal(selected.placementAuthority,false);
  const coords=[],hashes=new Map();let bytes=0,nonempty=0,proposals=0;
  for(let x=site.minX;x<=site.maxX;x++)for(let z=site.minZ;z<=site.maxZ;z++)
    for(let y=0;y<=maxY;y++){
      const a=world.get(x,y,z),b=view.get(x,y,z);
      if(a!==b){assert.equal(a,BLOCK.AIR);assert.notEqual(b,BLOCK.AIR);proposals++;}
    }
  for(let cx=Math.floor(site.minX/16);cx<=Math.floor(site.maxX/16);cx++)
    for(let cz=Math.floor(site.minZ/16);cz<=Math.floor(site.maxZ/16);cz++)for(let s=0;s<=3;s++){
      coords.push([cx,cz,s]);const v=p0BenchmarkMesh(view,cx,cz,s);
      assert.ok(v.every(Number.isFinite));assert.equal(v.length%27,0);
      hashes.set(coords.at(-1).join(','),sha(v));bytes+=v.byteLength;if(v.length)nonempty++;
    }
  for(const c of [...coords].reverse())assert.equal(sha(p0BenchmarkMesh(view,...c)),hashes.get(c.join(',')));
  assert.ok(proposals>10000);assert.deepEqual(world.save().edits,[]);
  assert.equal(p0BenchmarkWindow(-58,-129,14).length,18);
  assert.equal(p0BenchmarkWindow(-58,-129,36).length,27);
  assert.equal(p0BenchmarkWindow(-58,-129,8,{nearUpperSite:false}).length,25);
  assert.equal(p0BenchmarkWindow(-58,-129,1,{nearUpperSite:false,openShaft:true}).length,34);
  assert.equal(p0BenchmarkWindow(-58,-129,-50,{nearUpperSite:false}).length,27);
  console.log('P0 SECOND SITE',JSON.stringify({walks,walkCertified,turn:selected.approach?.turn??null,proposals,sections:coords.length,bytes,nonempty}));
});
