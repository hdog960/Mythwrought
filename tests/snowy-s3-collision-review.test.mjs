import assert from 'node:assert/strict';
import test from 'node:test';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {snowS3SitesForChunk,snowS3StyleAt} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
import {proposedSnowTree} from '../src/manual-biomes/snowy-s3-tree-prototypes.mjs';
import {reviewSnowS3CandidateSelection} from '../src/manual-biomes/snowy-s3-collision-review.mjs';

const candidate=(site,floor)=>{
  const style=snowS3StyleAt(site,floor);
  if(!style)return null;
  const physical=proposedSnowTree(style,site.x,floor,site.z,{wind:site.wind});
  if(!physical)return null;
  return Object.freeze({kind:'detached-s3-physically-checked-proposal',
    key:site.key,x:site.x,z:site.z,floor,style,
    voxelCount:physical.cells.length,
    cells:Object.freeze(physical.cells.map(row=>Object.freeze([...row])))});
};
const sites=seed=>{
  const m=new Map();
  for(let cx=-3;cx<=2;cx++)for(let cz=28;cz<=35;cz++)
    for(const s of snowS3SitesForChunk(seed,cx,cz))
      if(v6BiomeAt(s.x,s.z,seed)?.name==='snow')m.set(s.key,s);
  return [...m.values()];
};

test('original engine shape/selection certifies real four-style physical snowy trees across two seeds',()=>{
  let count=0,all=new Set();
  for(const seed of [179,2026]){
    const sample=sites(seed);
    assert.equal(sample.length,seed===179?67:70);
    for(const site of sample)for(const floor of [4,6,8,11,13]){
      const p=candidate(site,floor);
      if(!p)continue;
      const certificate=reviewSnowS3CandidateSelection(p);
      assert.ok(certificate,`${seed} ${site.key} floor ${floor}: missing collision certificate`);
      assert.equal(certificate.sourceWorldMutated,false);
      assert.equal(certificate.voxelCount,p.cells.length);
      assert.equal(certificate.firstTrunkRemovable,true);
      assert.equal(certificate.trunkRayDistance,2);
      all.add(certificate.style);count++;
    }
  }
  assert.ok(count>350);
  assert.deepEqual(all,new Set(['compact-fir','layered-spruce','highland-pine','windswept-alpine']));
});

test('fail closed for amended physical arrays, disconnected trunk and unsupported IDs',()=>{
  const p=candidate(sites(179)[0],6);
  assert.ok(reviewSnowS3CandidateSelection(p));
  const clone=()=>p.cells.map(row=>[...row]);
  for(const mutate of [
    rows=>rows.push([...rows[0]]),
    rows=>{const trunk=rows.find(r=>r[3]===4);trunk[3]=407;},
    rows=>{rows[0][3]=500;},
    rows=>{rows[0][1]=20;},
    rows=>{rows[0][0]+=6;},
    rows=>{rows.splice(0,1);}
  ]){
    const rows=clone();mutate(rows);
    const invalid={...p,voxelCount:rows.length,cells:Object.freeze(rows.map(r=>Object.freeze(r)))};
    assert.equal(reviewSnowS3CandidateSelection(invalid),null);
  }
  assert.equal(reviewSnowS3CandidateSelection({...p,cells:clone()}),null);
  assert.equal(reviewSnowS3CandidateSelection({...p,kind:'live-world'}),null);
  assert.equal(reviewSnowS3CandidateSelection({...p,style:'other'}),null);
  assert.equal(reviewSnowS3CandidateSelection({...p,voxelCount:120}),null);
});
