import assert from 'node:assert/strict';
import {test} from 'node:test';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {planEnvironmentalColumn} from '../src/manual-biomes/environment-v7.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {ENVIRONMENT_GROUND as G} from '../src/environment-ground.mjs';
import {proposedDesertRockFeather} from '../scripts/ci/desert-p3-rock-feather-proposal.mjs';
import {desertRockFeatherCandidate} from '../src/manual-biomes/desert-rock-feather-candidate.mjs';
const sites=[[179,-786,-1774,5],[2026,-2848,-774,8]];
const cardinal=[[1,0],[-1,0],[0,1],[0,-1]];
function originalPlan(world,x,z){
  const region=v6BiomeAt(x,z,world.seed);
  return world._oasisNear(x,z,0,region)?.columns.get(x+','+z)??
    planEnvironmentalColumn(x,z,world.seed,(a,b,c)=>world._environmentBaseline(a,b,c),region);
}
test('authentic world matches original proposal at every sampled cell; only caps change',()=>{
  for(const [seed,cx,cz,expected] of sites){
    const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
    let modified=0,screePreserved=0,originalEligible=0,protectedVeto=0;
    let beforeSharp=0,afterSharp=0;
    const sampled=new Map();
    for(let dz=-17;dz<=17;dz++)for(let dx=-17;dx<=17;dx++){
      const x=cx+dx,z=cz+dz,region=v6BiomeAt(x,z,seed);
      const original=originalPlan(world,x,z);
      const actual=world._columnPlan(x,z);
      assert.deepEqual([...actual.keys()],[...original.keys()],'No shape or height modification');
      if(!original.size){assert.equal(actual.size,0);protectedVeto++;continue;}
      originalEligible++;
      const top=Math.max(...original.keys()),oldCap=original.get(top),newCap=actual.get(top);
      for(const [y,old] of original)if(y!==top)assert.equal(actual.get(y),old,'Deep material unchanged');
      const adjacent=cardinal.some(([ox,oz])=>{
        const nx=x+ox,nz=z+oz,near=v6BiomeAt(nx,nz,seed);
        if(near?.name!=='desert')return false;
        const source=originalPlan(world,nx,nz);
        return source.size&&source.get(Math.max(...source.keys()))===G.scree;
      });
      const expectedCap=region?.name==='desert'&&region.weight<=.5?
        proposedDesertRockFeather({seed,x,z,cap:oldCap,eligible:true,screeNeighbor:adjacent}):oldCap;
      assert.equal(newCap,expectedCap,JSON.stringify({seed,x,z,oldCap,newCap,expectedCap}));
      assert.equal(desertRockFeatherCandidate(seed,x,z,oldCap,true,adjacent),expectedCap);
      if(oldCap===G.scree){screePreserved++;assert.equal(newCap,G.scree);}
      if(newCap!==oldCap){
        assert.equal(oldCap,258);
        assert.equal(newCap,261);
        modified++;
      }
      sampled.set(x+','+z,{oldCap,newCap,region});
    }
    for(let z=cz-16;z<=cz+16;z++)for(let x=cx-16;x<=cx+16;x++){
      const a=sampled.get(x+','+z);
      for(const [dx,dz] of [[1,0],[0,1]]){
        const b=sampled.get((x+dx)+','+(z+dz));
        if(a?.region?.name!=='desert'||b?.region?.name!=='desert')continue;
        if([a.oldCap,b.oldCap].includes(258)&&[a.oldCap,b.oldCap].includes(G.scree))beforeSharp++;
        if([a.newCap,b.newCap].includes(258)&&[a.newCap,b.newCap].includes(G.scree))afterSharp++;
      }
    }
    assert.equal(modified,expected,'Candidate must match previous actual research count');
    assert.ok(afterSharp<=beforeSharp);
    const at=world._columnPlan(cx,cz),top=Math.max(...at.keys());
    assert.equal(world.naturalAndLandmarkBlock(cx,top,cz),G.scree);
    assert.deepEqual(world.save().edits,[]);
    console.log('DESERT_FEATHER_GAMEPLAY_SOURCE '+JSON.stringify({
      seed,modified,screePreserved,originalEligible,protectedVeto,
      sharpBefore:beforeSharp,sharpAfter:afterSharp}));
  }
});
test('candidate fails closed for protected/non-hardpan/original Mountain scree',()=>{
  for(const cap of [null,0,256,257,259,261,G.scree,G.gneiss]){
    assert.equal(desertRockFeatherCandidate(179,0,0,cap,true,true),cap);
  }
  assert.equal(desertRockFeatherCandidate(179,0,0,258,false,true),258);
  assert.equal(desertRockFeatherCandidate(179,0,0,258,true,false),258);
});
