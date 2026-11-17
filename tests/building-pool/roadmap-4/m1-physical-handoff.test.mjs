import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';

// Read-only reference to the currently unmerged manual Pack 1 stone-shape contract.
// Verified against src/block-packs/pack-1/stone-shapes.mjs, blob
// f5feaaf2e4e18892b5bc3b5466d2808ebeee63e3 (branch owned by Pack 1).
// These are test-only local AABB profiles, not imported runtime assets or IDs.
const STAIR_LOWER = Object.freeze([[0,0,0,1,0.5,1],[0,0.5,0.5,1,1,1]]);
const SLAB_LOWER = Object.freeze([[0,0,0,1,0.5,1]]);
const STEP_HEIGHT = 0.5;
const all = allM1();
const k = (x,y,z)=>[x,y,z].join(',');
function quarterTurn([x,y,z,X,Y,Z],rot){
  for(let i=0;i<rot;i++) [x,z,X,Z]=[1-Z,x,1-z,X];
  return [x,y,z,X,Y,Z];
}
function topAt(boxes,x,z){
  let top=0;
  for(const [lo,lowY,front,hi,highY,back] of boxes){
    if(lo<=x&&x<hi&&front<=z&&z<back)top=Math.max(top,highY);
  }
  return top;
}
const eastwardStair=STAIR_LOWER.map(b=>quarterTurn(b,3));

test('source-aligned Pack 1 lower-stair rotation rises east by two half-block treads',()=>{
  assert.equal(topAt(eastwardStair,0.25,0.5),0.5);
  assert.equal(topAt(eastwardStair,0.75,0.5),1);
  assert.equal(topAt(STAIR_LOWER,0.5,0.25),0.5);
  assert.equal(topAt(STAIR_LOWER,0.5,0.75),1);
  assert.equal(topAt(SLAB_LOWER,0.5,0.5),0.5);
});

test('all 35 flights use a lower-half-slab landing so the final transition is no taller than half a block',()=>{
  let flights=0;
  for(const b of all){
    const blocks=new Map(b.cells.map(c=>[k(...c.at),c]));
    const entranceZ=b.openings.find(o=>o.kind==='entrance').at[2];
    const mid=Math.floor(b.bounds[0]/2);
    const storeys=b.architecturalNotes.storyCount;
    const deps=new Set(b.dependencies.map(d=>d.ref));
    if(storeys>1){
      assert.ok(deps.has('pack1:007')&&deps.has('pack1:008'),b.id+' missing slab/stair dependency');
    }
    for(let level=0;level<storeys-1;level++){
      const z=entranceZ+3+(level%2)*3;
      const floorY=level*4;
      const finish=blocks.get(k(mid+1,floorY+3,z));
      const landing=blocks.get(k(mid+2,floorY+4,z));
      assert.equal(finish?.role,'stair',b.id);
      assert.equal(finish.asset,'pack1:008',b.id);
      assert.equal(finish.facing,'east',b.id);
      assert.equal(landing?.role,'landing',b.id);
      assert.equal(landing.asset,'pack1:007',b.id+' full-block landing makes a whole-block lip');
      const finishTop=floorY+3+topAt(eastwardStair,0.75,0.5);
      const landingTop=floorY+4+topAt(SLAB_LOWER,0.5,0.5);
      const upperFloorTop=floorY+5;
      assert.ok(landingTop-finishTop<=STEP_HEIGHT,b.id+' last stair/landing too high');
      assert.ok(upperFloorTop-landingTop<=STEP_HEIGHT,b.id+' upper floor transition too high');
      flights++;
    }
  }
  assert.equal(flights,35);
});

test('every stair flight has quarter-turn-y state requirement unresolved; never claim schema-1 state serialization works',()=>{
  for(const b of all.filter(b=>b.architecturalNotes.storyCount>1)){
    const d=b.dependencies.find(d=>d.ref==='pack1:008');
    assert.ok(d&&d.orientation==='rotatable'&&d.state==='candidate',b.id);
    assert.ok(d.unresolved.some(s=>/orientation|collision|alignment/i.test(s)),b.id);
    // Facing east for these stairs means Pack 1 rotation 3, which is not a
    // canonical schema-1 persisted variant: explicit integration blocker.
    assert.ok(b.cells.filter(c=>c.role==='stair').every(c=>c.facing==='east'&&c.asset==='pack1:008'),b.id);
  }
});

test('regional roof and thin-pane candidates remain explicit unresolved partial shapes, never full game-block claims',()=>{
  for(const b of all){
    const roofs=b.dependencies.filter(d=>d.ref.startsWith('pack3:'));
    assert.equal(roofs.length,1,b.id);
    assert.equal(roofs[0].intendedShape,'partial',b.id);
    assert.ok(roofs[0].unresolved.some(s=>/pitch|ridge|attachment/i.test(s)),b.id);
    const pane=b.dependencies.find(d=>d.ref==='pack4:030');
    if(pane){
      assert.equal(pane.intendedShape,'partial');
      assert.equal(pane.orientation,'rotatable');
      assert.ok(pane.unresolved.some(s=>/mount|order/i.test(s)));
    }
  }
});
