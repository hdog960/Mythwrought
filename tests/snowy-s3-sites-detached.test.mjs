import assert from 'node:assert/strict';
import test from 'node:test';
import {snowS3SitesForChunk,snowS3StyleAt,proposeSnowS3PhysicalSite,
  SNOW_S3_STYLES} from '../src/manual-biomes/snowy-s3-sites-detached.mjs';
const key=s=>s.key;
const chunks=(seed)=>{
  const all=new Map();
  for(let cx=-3;cx<=3;cx++)for(let cz=29;cz<=35;cz++)
    for(const site of snowS3SitesForChunk(seed,cx,cz)){
      const first=all.get(key(site));
      if(first)assert.deepEqual(site,first,'Chunk-overlap site drift');
      all.set(key(site),site);
    }
  return all;
};
test('S3 absolute sites are deterministic, sparse, unique and chunk-border invariant',()=>{
  for(const seed of [179,2026]){
    const a=chunks(seed),b=chunks(seed);
    assert.deepEqual([...a],[...b]);
    assert.ok(a.size>35&&a.size<350);
    assert.equal(new Set([...a.values()].map(s=>s.x+','+s.z)).size,a.size);
    for(const s of a.values()){
      assert.ok([-1,1].includes(s.wind));
      assert.ok(Number.isSafeInteger(s.x)&&Number.isSafeInteger(s.z));
      assert.ok(s.styleRoll>=0&&s.styleRoll<1);
    }
  }
  assert.notDeepEqual([...chunks(179)],[...chunks(2026)]);
  assert.throws(()=>snowS3SitesForChunk(2.4,0,0),/Invalid/);
  assert.throws(()=>snowS3SitesForChunk(179,3000000,0),/Invalid/);
});
test('S3 four real styles occur with altitude-dependent visual variety',()=>{
  const low=new Map(SNOW_S3_STYLES.map(s=>[s,0]));
  const high=new Map(SNOW_S3_STYLES.map(s=>[s,0]));
  for(const site of chunks(179).values()){
    low.set(snowS3StyleAt(site,5),low.get(snowS3StyleAt(site,5))+1);
    high.set(snowS3StyleAt(site,11),high.get(snowS3StyleAt(site,11))+1);
  }
  assert.ok([...low.values()].every(v=>v>0));
  assert.ok([...high.values()].every(v=>v>0));
  assert.ok(low.get('compact-fir')>high.get('compact-fir'));
  assert.ok(high.get('windswept-alpine')>low.get('windswept-alpine'));
  assert.equal(snowS3StyleAt(null,3),null);
  assert.equal(snowS3StyleAt({styleRoll:0},19),null);
});
const realStyle=s=>SNOW_S3_STYLES.includes(s);
const proto=(style,x,floor,z)=>({height:5,cells:[
  ...Array.from({length:5},(_,i)=>[x,floor+1+i,z,4]),
  ...Array.from({length:15},(_,i)=>[x+((i%3)-1),floor+2+Math.floor(i/9),
    z+((Math.floor(i/3)%3)-1),i%3===0?407:406])
].filter(([a,b,c,id],index,all)=>id===4||!(a===x&&c===z))});
test('S3 physical candidate rejects edits, unsupported floor, canopy, legacy and malformed shapes',()=>{
  const site=[...chunks(179).values()][0],floor=6;
  const blocks=new Map([[site.x+','+floor+','+site.z,272],
    [site.x+','+(floor-1)+','+site.z,2]]);
  let edits=new Set(),protectedCells=new Set();
  const ctx={inspect:()=>({generator:'mythwrought-five-surface-regions-v7',biome:'snow',
    weight:.95,floor,ground:272}),
    readCell:(x,y,z)=>blocks.get(x+','+y+','+z)??0,
    isEdited:(x,y,z)=>edits.has(x+','+y+','+z),
    isProtected:(x,y,z)=>protectedCells.has(x+','+y+','+z),makeTree:proto};
  const p=proposeSnowS3PhysicalSite(site,ctx);
  assert.ok(p&&realStyle(p.style));
  assert.equal(p.kind,'detached-s3-physically-checked-proposal');
  assert.equal(blocks.size,2,'Planner must never write source world');
  edits.add(site.x+','+floor+','+site.z);
  assert.equal(proposeSnowS3PhysicalSite(site,ctx),null);
  edits.clear();
  blocks.set(site.x+','+(floor-1)+','+site.z,0);
  assert.equal(proposeSnowS3PhysicalSite(site,ctx),null);
  blocks.set(site.x+','+(floor-1)+','+site.z,2);
  const tree=proto(p.style,site.x,floor,site.z);
  const victim=tree.cells.find(r=>r[3]!==4);
  blocks.set(victim.slice(0,3).join(','),7);
  assert.equal(proposeSnowS3PhysicalSite(site,ctx),null);
  blocks.delete(victim.slice(0,3).join(','));
  protectedCells.add(victim.slice(0,3).join(','));
  assert.equal(proposeSnowS3PhysicalSite(site,ctx),null);
  protectedCells.clear();
  for(const invalid of [
    {...ctx,inspect:()=>({...ctx.inspect(),generator:'legacy'})},
    {...ctx,inspect:()=>({...ctx.inspect(),biome:'mountain'})},
    {...ctx,inspect:()=>({...ctx.inspect(),weight:.6})},
    {...ctx,inspect:()=>({...ctx.inspect(),ground:1})},
    {...ctx,inspect:()=>({...ctx.inspect(),floor:16})},
    {...ctx,makeTree:()=>({...tree,cells:[...tree.cells,[site.x,floor+1,site.z,7]]})},
    {...ctx,makeTree:()=>({...tree,cells:tree.cells.filter(r=>!(r[0]===site.x&&r[1]===floor+3&&r[2]===site.z))})},
    {...ctx,makeTree:()=>{throw Error('Invalid shape source')}}
  ])assert.equal(proposeSnowS3PhysicalSite(site,invalid),null);
});
