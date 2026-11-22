// Gloamfen focused DEVELOPMENT-only sunlit atrium and real source-geometry safety regression.
// Additive test on isolated UNMERGED DETACHED branch. It is not part of existing #414 CI,
// and has NOT passed until genuinely executed against this exact source revision.
import test from 'node:test';
import assert from 'node:assert/strict';
import {getRoadmapC1AHousesWave17,ROADMAP_C_1A_WAVE17_IDS} from '../src/building-pool/roadmap-1a/m2-housing-wave17-roadmap-c.mjs';
import {validateBlueprint} from '../src/building-pool/roadmap-1a/legacy-schema.mjs';

const key=(x,y,z)=>[x,y,z].join(',');
test('original Gloamfen mooncourt is 63 OPEN SKY columns with true ground and uninterrupted interior sightlines',()=>{
  assert.deepEqual(ROADMAP_C_1A_WAVE17_IDS,['r1:house:enchanted-forest:large:019']);
  const [b]=getRoadmapC1AHousesWave17();
  assert.equal(validateBlueprint(b),true);
  const map=new Map(b.placements.map(p=>[key(...p.at),p]));
  assert.equal(map.size,b.placements.length);
  const courtyard=[24,35,32,41];
  assert.equal((courtyard[2]-courtyard[0]+1)*(courtyard[3]-courtyard[1]+1),63);
  assert.deepEqual(b.architecturalIdentity.outdoorCourtyard,courtyard);
  let columns=0;
  const walked=new Set(b.walkable.map(p=>key(...p)));
  for(let x=courtyard[0];x<=courtyard[2];x++)for(let z=courtyard[1];z<=courtyard[3];z++){
    columns++;
    assert.equal(map.get(key(x,0,z))?.role,'foundation','moon court missing real ground '+x+','+z);
    assert.ok(walked.has(key(x,1,z)),'moon court not actually traversable '+x+','+z);
    for(let y=1;y<b.footprint.height;y++){
      assert.ok(!map.has(key(x,y,z)),'sunlit courtyard column occluded '+x+','+y+','+z);
    }
  }
  assert.equal(columns,63);
  assert.equal(b.worldPlacement,false);
  assert.equal(b.liveIntegration,false);
  assert.equal(b.architecturalIdentity.roofWeatherSealApproved,false);
});
test('Gloamfen nine honest passable thresholds have TWO actual cleared voxel levels and connected interior',()=>{
  const [b]=getRoadmapC1AHousesWave17();
  const map=new Map(b.placements.map(p=>[key(...p.at),p]));
  const walked=new Set(b.walkable.map(p=>key(...p)));
  assert.equal(b.portals.length,9);
  for(const portal of b.portals){
    const [x,y,z]=portal.at;
    assert.equal(y,1);
    assert.ok(walked.has(key(x,y,z)),'doorway missing actual walkable voxel '+portal.from+'→'+portal.to);
    assert.ok(!map.has(key(x,1,z))&&!map.has(key(x,2,z)),'fake or blocked two-high doorway');
  }
  assert.equal(b.rooms.length,7);
  const queue=[b.portals[0].at],seen=new Set([key(...queue[0])]);
  for(let i=0;i<queue.length;i++){
    const [x,y,z]=queue[i];
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const k=key(x+dx,y,z+dz);
      if(walked.has(k)&&!seen.has(k)){seen.add(k);queue.push([x+dx,y,z+dz]);}
    }
  }
  assert.equal(seen.size,walked.size,'real connected corridor geometry is broken');
});
test('Gloamfen 454-cell external missing-foundation courts are absent at all 12 levels and source roofs physically supported',()=>{
  const [b]=getRoadmapC1AHousesWave17();
  const map=new Map(b.placements.map(p=>[key(...p.at),p]));
  const cuts=b.architecturalIdentity.exteriorNotches;
  assert.equal(cuts.length,3);
  let removed=0;
  for(let x=0;x<b.footprint.width;x++)for(let z=0;z<b.footprint.depth;z++){
    const absent=cuts.some(([x0,z0,x1,z1])=>x>=x0&&x<=x1&&z>=z0&&z<=z1);
    if(absent){
      removed++;
      for(let y=0;y<b.footprint.height;y++)assert.ok(!map.has(key(x,y,z)),'false open notch voxel '+key(x,y,z));
    }else assert.equal(map.get(key(x,0,z))?.role,'foundation');
  }
  assert.equal(removed,454);
  assert.equal(b.architecturalIdentity.exteriorVoidFootprintCells,454);
  const roofs=b.placements.filter(p=>p.role==='roof');
  assert.ok(roofs.length>1500);
  assert.ok(new Set(roofs.map(p=>p.at[1])).size>=4,'flat repeating roof ridge');
  for(const r of roofs){
    const [x,y,z]=r.at;
    assert.ok(map.has(key(x,y-1,z)),'unsupported upper roof '+key(x,y,z));
  }
  assert.equal(b.footprintReservations.length,2);
  for(const r of b.footprintReservations)for(const foot of r.extraCells){
    assert.ok(!map.has(key(...foot))&&!b.walkable.some(v=>key(...v)===key(...foot)),'bed-foot collision');
  }
});
