// Real ORIGINAL V6 biome selection + ORIGINAL S3 physical tree recipe +
// ORIGINAL shape/raycast API. Does not construct FourRegionWorld or its saves.
import assert from 'node:assert/strict';
import test from 'node:test';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {FULL_CUBE,raycastShapes,canPlaceShape} from '../src/voxel-shape-interactions.mjs';
import {SNOW_S3_STYLES,snowS3SitesForChunk,snowS3StyleAt} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';

function originalClimateSurvey(seed){
  const sites=new Map();let requests=0;
  for(let cx=-3;cx<=2;cx++)for(let cz=28;cz<=35;cz++)
    for(const site of snowS3SitesForChunk(seed,cx,cz)){
      requests++;
      assert.ok(!sites.has(site.key)||
        JSON.stringify(sites.get(site.key))===JSON.stringify(site),
        'Original 16x16 chunk border changed the global site');
      sites.set(site.key,site);
    }
  const eligible=[...sites.values()].filter(s=>{
    const b=v6BiomeAt(s.x,s.z,seed);
    return b?.name==='snow'&&b.weight>=.8;
  });
  return {requests,sites,eligible};
}

test('two real original V6 seed climates contain stable bounded S3 snow interiors',()=>{
  const expected=new Map([[179,67],[2026,70]]);
  for(const seed of [179,2026]){
    const a=originalClimateSurvey(seed),b=originalClimateSurvey(seed);
    assert.deepEqual(a,b);
    assert.equal(a.eligible.length,expected.get(seed),
      'Actual V6 snow membership or detached S3 site selection drift');
    assert.equal(a.eligible.length,a.sites.size,
      'Expected surveyed region to be genuine snow interior');
    assert.ok(a.requests>a.eligible.length,
      'Survey must include overlapping chunk-visible candidate sites');
    assert.ok(a.eligible.some(s=>s.x<0)&&a.eligible.some(s=>s.x>0),
      'Negative/positive original chunk boundary must both be represented');
    for(const site of a.eligible){
      assert.equal(v6BiomeAt(site.x,site.z,seed).name,'snow');
      assert.ok(v6BiomeAt(site.x,site.z,seed).weight>=.8);
    }
  }
});

test('all four actual S3 tree styles fit the original ceiling and have raycastable solid trunks',()=>{
  const styles=new Set();let inspected=0;
  for(const seed of [179,2026])for(const s of originalClimateSurvey(seed).eligible){
    for(const floor of [5,6,8,10,12]){
      const style=snowS3StyleAt(s,floor);
      if(!style)continue;
      assert.ok(SNOW_S3_STYLES.includes(style));
      const shape=proposedSnowTree(style,s.x,floor,s.z,{wind:s.wind});
      assert.ok(shape,`Rejected nominally viable style ${style} at Y=${floor}`);
      assert.ok(shape.bounds[4]<=19,'Tree canopy breaches original Y=19');
      assert.equal(shape.cells.length,new Set(shape.cells.map(c=>c.slice(0,3).join(','))).size);
      const blockMap=new Map(shape.cells.map(c=>[c.slice(0,3).join(','),c[3]]));
      const voxel=(x,y,z)=>blockMap.has([x,y,z].join(','))?FULL_CUBE:null;
      // At the trunk's lowest segment, needle canopy has not started.
      const trunk=[s.x,floor+1,s.z];
      assert.equal(blockMap.get(trunk.join(',')),4);
      const hit=raycastShapes([s.x+.5,floor+1.5,s.z-2],[0,0,1],voxel,5);
      assert.deepEqual(hit?.cell,trunk,'Engine original ray must target WOOD trunk');
      assert.equal(canPlaceShape(FULL_CUBE,trunk,voxel),false,
        'Original solid collision must reject overlapping WOOD');
      assert.equal(canPlaceShape(FULL_CUBE,[s.x,floor+1,s.z+5],voxel),true);
      styles.add(style);inspected++;
    }
  }
  assert.deepEqual(styles,new Set(SNOW_S3_STYLES));
  assert.ok(inspected>=250,'Insufficient physical S3 site/height evidence');
});

test('original shape raycast follows local player mining: trunk removal opens old cell',()=>{
  const site=originalClimateSurvey(179).eligible[0],floor=6;
  const style=snowS3StyleAt(site,floor);
  const t=proposedSnowTree(style,site.x,floor,site.z,{wind:site.wind});
  const shapes=new Map(t.cells.map(c=>[c.slice(0,3).join(','),FULL_CUBE]));
  const read=(x,y,z)=>shapes.get([x,y,z].join(','))??null;
  const trunk=[site.x,floor+1,site.z];
  assert.deepEqual(raycastShapes([site.x+.5,floor+1.5,site.z-2],[0,0,1],read,5).cell,trunk);
  assert.equal(canPlaceShape(FULL_CUBE,trunk,read),false);
  shapes.delete(trunk.join(','));
  assert.equal(raycastShapes([site.x+.5,floor+1.5,site.z-2],[0,0,1],read,5),null);
  assert.equal(canPlaceShape(FULL_CUBE,trunk,read),true);
});
