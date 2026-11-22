import assert from 'node:assert/strict';
import test from 'node:test';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {auditSnowS3OriginalPlayerBody} from '../src/manual-biomes/snowy-s3-player-body-audit.mjs';
const key=(x,y,z)=>x+','+y+','+z;
function fixture(){
  const x=0,z=0,floor=6;
  const shape=proposedSnowTree('compact-fir',x,floor,z);
  const candidate=Object.freeze({kind:'detached-s3-physically-checked-proposal',key:'0,0',x,z,floor,
    style:'compact-fir',voxelCount:shape.cells.length,
    cells:Object.freeze(shape.cells.map(c=>Object.freeze([...c])))});
  const extra=new Map(),edits=new Map();
  const world={edits,get:(x,y,z)=>extra.get(key(x,y,z))??(y<=floor?272:0),
    save:()=>({schema:1,seed:179,edits:[...edits]})};
  // Test-only full-cube AABB stand-in, explicitly not original engine.
  const fullCubeCollides=(w,x,feet,z)=>{
    const r=.28,h=1.78,e=1e-5;
    for(let bx=Math.floor(x-r+e);bx<=Math.floor(x+r-e);bx++)
      for(let bz=Math.floor(z-r+e);bz<=Math.floor(z+r-e);bz++)
        for(let by=Math.floor(feet+e);by<=Math.floor(feet+h-e);by++)
          if(w.get(bx,by,bz)!==0)return true;
    return false;
  };
  return {world,candidate,extra,collides:fullCubeCollides};
}
test('true BODY_RADIUS .28 and BODY_HEIGHT 1.78 shape-interface proxy preserves open detours',()=>{
  const {world,candidate,collides}=fixture(),before=JSON.stringify([...world.edits]);
  const a=auditSnowS3OriginalPlayerBody(world,candidate,{collides});
  assert.equal(a.safe,true);
  assert.equal(a.protectedOldPairs,992);
  assert.equal(a.boundaryPortals,32);
  assert.equal(a.preservedPairs,992);
  assert.ok(a.edgeEvaluations<=600);
  assert.ok(a.collisionProbes>100&&a.collisionProbes<=950,
    `Boundary-wide cached body review must stay bounded; got ${a.collisionProbes}`);
  assert.deepEqual(a,auditSnowS3OriginalPlayerBody(world,candidate,{collides}));
  assert.equal(JSON.stringify([...world.edits]),before);
});
test('solid existing narrow walkway cannot be severed by snowy WOOD + needles',()=>{
  const {world,candidate,extra,collides}=fixture();
  for(let z=-4;z<=4;z++)for(let x=-4;x<=4;x++)
    if(x!==0)for(const y of [7,8,9])extra.set(key(x,y,z),3);
  const a=auditSnowS3OriginalPlayerBody(world,candidate,{collides});
  assert.equal(a.safe,false);
  assert.equal(a.reason,'original-player-body-passage-severed');
});
test('fractional edge collision is sampled, not inferred from empty end cells',()=>{
  const {world,candidate,collides}=fixture();
  let fractional=0;
  const veto=(w,x,feet,z)=>{
    if(Math.abs((x%1)-.75)<.001 && Math.abs((z%1)-.5)<.001 && feet>=6){fractional++;return true;}
    return collides(w,x,feet,z);
  };
  const a=auditSnowS3OriginalPlayerBody(world,candidate,{collides:veto});
  assert.ok(fractional>0,'A midpoint-protruding scene must be inspected');
  assert.ok(a.collisionProbes>100);
});
test('no source, forged physical tree or failed collision callback is never certified',()=>{
  const {world,candidate,collides}=fixture();
  assert.equal(auditSnowS3OriginalPlayerBody(world,candidate,{}).safe,false);
  assert.equal(auditSnowS3OriginalPlayerBody(world,{...candidate,style:'wrong'},{collides}).safe,false);
  assert.equal(auditSnowS3OriginalPlayerBody(world,candidate,{collides:()=>{throw Error('bad');}}).safe,false);
});

test('body reader cannot mutate a schema-1 edit during collision evaluation',()=>{
  const {world,candidate,collides}=fixture();
  let changed=false;
  const bad=(...args)=>{
    if(!changed){world.edits.set('7,8,7',0);changed=true;}
    return collides(...args);
  };
  const result=auditSnowS3OriginalPlayerBody(world,candidate,{collides:bad});
  assert.equal(result.safe,false);
  assert.equal(result.reason,'original-schema-1-save-mutated-during-body-review');
});

test('off-center cardinal snow trail is protected beyond the four old midpoint portals',()=>{
  const {world,candidate,extra,collides}=fixture();
  // The original side trail is at x=+2, not at the tree's center (x=0).
  // Only the northern/southern OFFSET boundary openings are connected.
  for(let z=-4;z<=4;z++)for(let x=-4;x<=4;x++)
    if(x!==2)for(const y of [7,8,9])extra.set(key(x,y,z),3);
  const a=auditSnowS3OriginalPlayerBody(world,candidate,{collides});
  assert.equal(a.safe,false,'Snowy canopy at (2,8,0) must not bury an offset trail');
  assert.equal(a.reason,'original-player-body-passage-severed');
  assert.deepEqual(a.portals,[[2,-4],[2,4]]);
});

test('source step-up checks intermediate body heights, not only endpoints',()=>{
  const {world,extra,collides,candidate:fir}=fixture();
  const shape=proposedSnowTree('highland-pine',fir.x,fir.floor,fir.z);
  const candidate=Object.freeze({...fir,style:'highland-pine',
    voxelCount:shape.cells.length,
    cells:Object.freeze(shape.cells.map(row=>Object.freeze([...row])))});
  // Tall pine's first boughs are above head height in the x=+2 lane.
  // The one-block ramp has clear body endpoints, but a moving overhang can
  // obstruct the intermediate rise. A pure highest-feet horizontal probe
  // would incorrectly certify that climb.
  for(let z=-4;z<=4;z++)for(let x=-4;x<=4;x++)
    if(x!==2)for(const y of [7,8,9])extra.set(key(x,y,z),3);
  extra.set(key(2,7,0),272);
  const baseline=auditSnowS3OriginalPlayerBody(world,candidate,{collides});
  assert.equal(baseline.safe,true,'Original lane and pine must be compatible');
  let intermediate=0;
  const obstructed=(w,x,feet,z)=>{
    if(w!==world&&Math.abs(x-2.5)<1e-6&&Math.abs(z+.5)<1e-6&&
       feet>7.1&&feet<7.9){intermediate++;return true;}
    return collides(w,x,feet,z);
  };
  const blocked=auditSnowS3OriginalPlayerBody(world,candidate,{collides:obstructed});
  assert.ok(intermediate>0,'Real-height ascent must be physically sampled');
  assert.equal(blocked.safe,false);
  assert.equal(blocked.reason,'original-player-body-passage-severed');
  assert.equal(world.edits.size,0);
});


test('original body evidence refuses incomplete save source and non-boolean collision readers',()=>{
  const {world,candidate}=fixture();
  assert.equal(auditSnowS3OriginalPlayerBody({...world,save:null},candidate,{collides:()=>false}).safe,false);
  assert.equal(auditSnowS3OriginalPlayerBody({...world,edits:null},candidate,{collides:()=>false}).safe,false);
  assert.equal(auditSnowS3OriginalPlayerBody({...world,save:()=>{throw Error('save unavailable');}},candidate,{collides:()=>false}).reason,
    'original-schema-1-save-source-failed');
  const notBoolean=auditSnowS3OriginalPlayerBody(world,candidate,{collides:()=>undefined});
  assert.equal(notBoolean.safe,false);
  assert.equal(notBoolean.reason,'original-player-collision-callback-failed');
});
