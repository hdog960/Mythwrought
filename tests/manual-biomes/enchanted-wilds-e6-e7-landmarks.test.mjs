import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,meshChunk,collides} from '../../src/voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR} from '../../src/manual-biomes/profile-world.mjs';
import {WildsFamilyResearchWorld,wildsRegionAt} from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import {WILDS_LANDMARKS,buildWildsLandmark} from '../../src/manual-biomes/enchanted-wilds-landmarks.mjs';
import {planWildsScenery} from '../../src/manual-biomes/enchanted-wilds-scenery.mjs';
import {physicalRegionAt,upperOccupancy} from '../../src/world-height.mjs';
test('six physical designs and 24 rotations preserve walkable approaches',()=>{
 for(let id=0;id<WILDS_LANDMARKS.length;id++)for(let turn=0;turn<4;turn++){
  const p=buildWildsLandmark(id,-16,8,-32,turn);
  assert.deepEqual(p,buildWildsLandmark(id,-16,8,-32,turn));
  assert.ok(p.cells.length>=10&&p.cells.length<=100);
  const cells=new Set(p.cells.map(r=>r.slice(0,3).join(',')));
  assert.equal(cells.size,p.cells.length);
  assert.equal(p.approach.length,36);
  assert.ok(p.approach.every(r=>!cells.has(r.join(','))));
  assert.ok(p.cells.every(([x,y,z])=>Math.abs(x+16)<=4&&Math.abs(z+32)<=4&&y>=9&&y<=15));
  for(const [x,,z] of p.cells.filter(r=>r[1]===9))assert.ok(p.footprint.some(([a,b])=>x===a&&z===b));
 }
 console.log('WILDS E7 GEOMETRY',JSON.stringify({families:WILDS_LANDMARKS,rotations:24}));
});
test('natural landmarks preserve source, clearance, native mesh and editable physical cells',()=>{
 const found=new Map();let samples=0,upper=0;
 for(const seed of [179,2026,-88]){
  const w=new WildsFamilyResearchWorld(seed),old=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR),{experimentalEnchantedWilds:true});
  outer:for(let cz=-58;cz<=58;cz++)for(let cx=-58;cx<=58;cx++){
    if(wildsRegionAt(cx*16+8,cz*16+8,seed)===null)continue;
    const p=w.wildsSource.landmark(cx,cz);if(!p||found.has(p.id))continue;
    const [x,floor,z]=p.origin;
    for(const [a,b,c,id] of p.cells){assert.equal(w.get(a,b,c),id);assert.equal(old.get(a,b,c),BLOCK.AIR);if(b>19){assert.ok(upperOccupancy(w,physicalRegionAt(a,b,c).key));upper++;}}
    for(const [a,b,c] of p.approach){assert.equal(w.get(a,b,c),BLOCK.AIR);assert.equal(w.wildsSource.reserved(a,b,c),true);}
    for(const [a,b,c] of p.approach.filter(r=>r[1]===floor+1)){
      assert.equal(collides(w,a+.5,b+.01,c+.5),false);
      assert.notEqual(w.get(a,b-1,c),BLOCK.AIR);
    }
    const plan=planWildsScenery(w,cx,cz,wildsRegionAt);
    assert.ok(plan.every(q=>!w.wildsSource.reserved(...q.anchor)));
    const [a,b,c]=p.cells[0],before=meshChunk(w,cx,cz);
    assert.ok(w.set(a,b,c,BLOCK.AIR));assert.equal(w.get(a,b,c),BLOCK.AIR);
    assert.notDeepEqual(meshChunk(w,cx,cz),before);
    assert.equal(w.naturalAndLandmarkBlock(a,b,c),p.cells[0][3]);
    assert.throws(()=>w.save(),/historical M8/);
    found.set(p.id,{seed,origin:p.origin,name:p.name,cells:p.cells.length});samples++;
    if(found.size===6)break outer;
  }
  if(found.size===6)break;
 }
 console.log('WILDS E7 NATURAL',JSON.stringify({samples,upper,found:[...found.values()]}));
 assert.equal(found.size,6,'all six natural landmark witnesses required');
});
test('green cap mosaic changes only the intended biome cap; retains peat and other biomes',()=>{
 const seed=179,w=new WildsFamilyResearchWorld(seed),old=new FourRegionWorld(seed,fourRegionProfile(seed,M8_MOUNTAIN_GENERATOR),{experimentalEnchantedWilds:true});
 let moss=0,retained=0,nonforest=0;
 for(let x=-128;x<=128;x+=3)for(let z=-640;z<=-360;z+=3){
  const col=old._columnPlan(x,z);if(!col.size)continue;
  const y=Math.max(...col.keys()),b=old.get(x,y,z),n=w.get(x,y,z);
  if(wildsRegionAt(x,z,seed)===null){assert.equal(n,b);nonforest++;continue;}
  if(b===G.woodlandLoam||b===G.woodlandPeat){if(n===G.woodlandMoss)moss++;else{assert.equal(n,b);retained++;}}
 }
 console.log('WILDS E6 CAP MOSAIC',JSON.stringify({moss,retained,nonforest}));
 assert.ok(moss>0&&retained>0);
});
