import test from 'node:test';
import assert from 'node:assert/strict';
import {measureNaturalCaveDensity,UNDERWORLD_BANDS} from '../src/living-underworld/density-audit.mjs';
import {candidateCaveAt,UNDERWORLD_CANDIDATE_KIND} from '../src/living-underworld/procedural-core.mjs';

test('density audit counts actual integer AIR cells and per-band totals, not sky',()=>{
  const report=measureNaturalCaveDensity({seed:179,regions:[{name:'example',x:0,z:0}],
    columnsPerSide:2,regionWidth:8,bands:[{name:'small',minY:-6,maxY:-4}],
    blockAt:(x,y,z)=>y===-5?0:8,biomeAt:()=> 'mountain'});
  assert.equal(report.overall.total,12);
  assert.equal(report.overall.air,4);
  assert.equal(report.overall.percentage,100/3);
  assert.equal(report.byDepth[0].air,4);
  assert.equal(report.byBiome[0].name,'mountain');
  assert.equal(report.byRegion[0].total,12);
  assert.equal(report.caveConnectivity,'NOT_MEASURED');
});

test('audits are deterministic and refuse invalid natural block readers',()=>{
  const options={seed:41,regions:[{name:'remote',x:-65536,z:65536}],
    bands:[{name:'b',minY:-9,maxY:-4}],columnsPerSide:4,regionWidth:32,
    blockAt:(x,y,z)=> (Math.abs(x+z+y)%3===0?0:8)};
  assert.deepEqual(measureNaturalCaveDensity(options),measureNaturalCaveDensity(options));
  assert.throws(()=>measureNaturalCaveDensity({...options,blockAt:()=>undefined}),/invalid block id/);
});

test('bands cover the intended deep underground exactly once',()=>{
  const ys=UNDERWORLD_BANDS.flatMap(b=>Array.from({length:b.maxY-b.minY+1},(_,i)=>b.minY+i));
  assert.equal(ys.length,207);
  assert.equal(new Set(ys).size,207);
  assert.equal(Math.min(...ys),-210);
  assert.equal(Math.max(...ys),-4);
});

test('worldwide cave candidate is seed- and coordinate-deterministic beyond spawn',()=>{
  assert.match(UNDERWORLD_CANDIDATE_KIND,/worldwide/);
  for(const seed of [179,-12,123456])for(const [x,y,z] of [
    [0,-55,0],[11,-109,14],[8192,-95,-8192],[-65536,-170,65536]]){
    const before=candidateCaveAt(seed,x,y,z),after=candidateCaveAt(seed,x,y,z);
    assert.equal(typeof before,'boolean');assert.equal(before,after);
  }
  assert.equal(candidateCaveAt(179,0,20,0),false);
  assert.equal(candidateCaveAt(179,0,-211,0),false);
  assert.throws(()=>candidateCaveAt(179,1.5,-20,0),/Invalid worldwide/);
});

test('worldwide cave candidate has physical air and stone at distant regions and depth bands',()=>{
  for(const [x,z] of [[0,0],[8192,-8192],[-16384,16384]]){
    let carved=0,solid=0;
    for(let dx=0;dx<96;dx+=8)for(let dz=0;dz<96;dz+=8)
      for(let y=-204;y<=-12;y+=12){
        if(candidateCaveAt(179,x+dx,y,z+dz))carved++;else solid++;
      }
    assert.ok(carved>0,`no candidate cavities at ${x},${z}`);
    assert.ok(solid>0,`no remaining solid rock at ${x},${z}`);
  }
});
