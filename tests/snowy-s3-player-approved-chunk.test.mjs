import assert from 'node:assert/strict';
import test from 'node:test';
import {snowS3SitesForChunk,snowS3StyleAt} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {reviewSnowS3PlayerApprovedChunk} from '../src/manual-biomes/snowy-s3-player-approved-chunk.mjs';
const key=(x,y,z)=>x+','+y+','+z;
function fixture(){
  const seed=179,edits=new Map(),caves=new Map(),extra=new Map();
  const get=(x,y,z)=>edits.get(key(x,y,z))??extra.get(key(x,y,z))??
    (y===6?272:y===5?278:y<5?3:0);
  const world={seed,generationProfile:{generator:'mythwrought-five-surface-regions-v7'},edits,
    environmentCaves:{get:(...p)=>caves.get(key(...p))},
    _columnPlan:()=>new Map([[5,278],[6,272]]),
    _environmentBaseline:get,naturalAndLandmarkBlock:get,get,
    save:()=>({schema:1,seed,edits:[...edits]})};
  const deps={biomeAt:()=>({name:'snow',weight:.96}),terrainHeight:()=>5,
    legacyNatural:()=>0,proposedSnowTree,planScenery:()=>[],describeScene:()=>null};
  const collides=(w,x,feet,z)=>{
    const r=.28,h=1.78,e=1e-5;
    for(let bx=Math.floor(x-r+e);bx<=Math.floor(x+r-e);bx++)
      for(let bz=Math.floor(z-r+e);bz<=Math.floor(z+r-e);bz++)
        for(let by=Math.floor(feet+e);by<=Math.floor(feet+h-e);by++)
          if(w.get(bx,by,bz)!==0)return true;
    return false;
  };
  return {world,edits,extra,caves,deps,collides,sites:snowS3SitesForChunk(seed,0,32)};
}
test('strict future-world S3 preview requires original callback but never activates M7',()=>{
  const {world,deps,collides,edits}=fixture(),before=JSON.stringify(world.save());
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,collides});
  assert.equal(result.safe,true);
  assert.equal(result.sourceCandidates,3);
  assert.equal(result.admitted.length,3);
  assert.ok(result.collisionProbes>300);
  assert.equal(result.notLiveM7,true);
  assert.equal(JSON.stringify(world.save()),before);
  assert.equal(edits.size,0);
});
test('a real-sized blocked narrow footpath vetoes at least one proposed tree',()=>{
  const {world,deps,collides,extra,sites}=fixture(),
    s=sites.find(v=>snowS3StyleAt(v,6)==='highland-pine');
  assert.ok(s);
  for(let dz=-4;dz<=4;dz++)for(let dx=-4;dx<=4;dx++)if(dx!==0)
    for(let dy=1;dy<=3;dy++)extra.set(key(s.x+dx,6+dy,s.z+dz),3);
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,collides});
  // Prior source-geometry or walkway gating can reject before body review.
  assert.equal(result.safe,true);
  assert.ok(result.rejected.some(x=>x.key===s.key));
  assert.equal(world.edits.size,0);
});
test('strict body admission fails closed with missing source and collides changes',()=>{
  const {world,deps,collides}=fixture();
  assert.equal(reviewSnowS3PlayerApprovedChunk(world,0,32,deps).safe,false);
  assert.equal(reviewSnowS3PlayerApprovedChunk({},0,32,{...deps,collides}).safe,false);
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,
    collides:()=>{throw Error('Real engine unavailable');}});
  assert.equal(result.safe,false);
  assert.equal(result.reason,'original-player-collision-callback-failed');
});
test('a mutating collision callback invalidates schema-1 save audit',()=>{
  const {world,deps,collides}=fixture();let done=false;
  const corrupt=(...args)=>{
    if(!done){done=true;world.edits.set('7,8,7',0);}
    return collides(...args);
  };
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,collides:corrupt});
  assert.equal(result.safe,false);
  assert.match(result.reason,/schema-1/);
});

test('strict callback cannot silently inject a protected old cave without schema-1 edits',()=>{
  const {world,deps,collides,caves,sites}=fixture(),first=sites[0];
  let done=false;
  const mutable=(...args)=>{
    if(!done){caves.set(key(first.x+2,6,first.z),0);done=true;}
    return collides(...args);
  };
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,collides:mutable});
  assert.equal(result.safe,false);
  assert.equal(result.reason,'original-M7-cave-or-voxel-state-changed-during-player-review');
  assert.equal(world.edits.size,0);
});

test('subsequent S3 body reviews observe earlier admitted physical trees without world writes',()=>{
  const {world,deps,collides,sites}=fixture();
  const first=sites[0],next=sites[1];
  let combinedBefore=0,firstAfter=0;
  const tracking=(readWorld,x,feet,z)=>{
    const old=world.get(first.x,7,first.z);
    assert.equal(old,0,'Source world must never be painted to stage trees');
    const painted=readWorld.get(first.x,7,first.z)===4;
    if(painted&&x>next.x-3&&x<next.x+4&&z>next.z-4&&z<next.z+5)
      combinedBefore++;
    if(painted&&x<first.x+4&&z<first.z+5)firstAfter++;
    return collides(readWorld,x,feet,z);
  };
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,collides:tracking});
  assert.equal(result.safe,true,JSON.stringify(result));
  assert.equal(result.sequentialAggregateBodyReviewed,true);
  assert.equal(result.admitted.length,3);
  assert.ok(firstAfter>0,'Original first tree must be inserted into detached body review');
  assert.ok(combinedBefore>0,'Later tree reviews must see earlier accepted WOOD');
  assert.equal(world.get(first.x,7,first.z),0);
  assert.equal(result.stagedCells,new Set(result.admitted.flatMap(t=>t.cells.map(c=>key(...c.slice(0,3))))).size);
});

test('original body collision probe budget exhaustion aborts entire forest, not one tree',()=>{
  const {world,deps}=fixture();
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,
    collides:()=>{throw new RangeError('original-player-collision-probe-budget-exceeded');}});
  assert.equal(result.safe,false);
  assert.equal(result.reason,'original-player-collision-probe-budget-exceeded');
  assert.equal(world.edits.size,0);
});

test('incorrect collision return type cannot be counted as an ordinary rejected site',()=>{
  const {world,deps}=fixture();
  const result=reviewSnowS3PlayerApprovedChunk(world,0,32,{...deps,collides:()=>null});
  assert.equal(result.safe,false);
  assert.equal(result.reason,'original-player-collision-callback-failed');
});
