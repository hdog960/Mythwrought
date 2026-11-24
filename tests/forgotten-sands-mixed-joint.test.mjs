import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {researchP0JointGroup} from '../src/manual-biomes/forgotten-sands-joint-group.mjs';
const cases=[
{seed:179,axis:'z',centers:[[377,-52,23],[377,-12,31],[377,32,31]]},
{seed:179,axis:'z',centers:[[504,-162,23],[504,-122,31],[504,-78,31]]},
{seed:2026,axis:'z',centers:[[629,-1477,23],[629,-1437,31],[629,-1393,31]]},
{seed:2026,axis:'z',centers:[[-900,-2095,31],[-900,-2054,31],[-900,-2011,23]]}];
const spec=c=>({seed:c.seed,axis:c.axis,modules:c.centers.map(([x,z,size])=>({seed:c.seed,x,z,size,height:size===31?28:20}))});
test('mixed large modules share one original view and native continuous chamber routes',()=>{
  for(const c of cases){
    const w=new FourRegionWorld(c.seed,fourRegionProfile(c.seed,M7_ENVIRONMENT_GENERATOR)),before=JSON.stringify(w.save());
    const r=researchP0JointGroup(w,spec(c),{reserved:()=>false,ownerRevision:()=>'quiet-research'});
    assert.equal(r.placementAuthority,false);assert.equal(JSON.stringify(w.save()),before);
    if(r.accepted){
      assert.equal(r.continuousFoundation,false);assert.equal(r.addedPathCells,0);assert.ok(r.proposedCells>20000);
      console.log('P0 MIXED WALK',JSON.stringify({seed:c.seed,centers:c.centers,accepted:true,turns:r.turns,nodes:r.nodes.length,forward:r.forward,back:r.back,proposedCells:r.proposedCells,apronCells:r.apronCells,trials:r.trials,corridorNodes:r.corridorNodes}));
    }else console.log('P0 MIXED WALK',JSON.stringify({seed:c.seed,centers:c.centers,accepted:false,reason:r.reason,detail:r.detail}));
  }
});
test('mixed joint source rejects invalid total span and external reservation',()=>{
  const c=cases[0],w=new FourRegionWorld(c.seed,fourRegionProfile(c.seed,M7_ENVIRONMENT_GENERATOR));
  const s=spec(c);s.modules[2].z++;
  assert.throws(()=>researchP0JointGroup(w,s,{reserved:()=>false,ownerRevision:()=>'quiet'}),/span/);
  const denied=researchP0JointGroup(w,spec(c),{reserved:(x,z)=>x===377&&z===-52,ownerRevision:()=>'quiet'});
  assert.equal(denied.accepted,false);assert.equal(denied.placementAuthority,false);
});
