// Real original M7 terrain/cave/source collision acceptance, not a synthetic
// image, fake AABB, browser screenshot or generator-version migration.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {environmentalTreesForChunk}
  from '../../src/manual-biomes/environment-v7.mjs';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {BODY_HEIGHT,BODY_RADIUS,BLOCK,collides,chunkCoord}
  from '../../src/voxel.mjs';
import {ENCHANTED_WALKING_GROUND_NEIGHBORS}
  from '../../src/manual-biomes/enchanted-tree-walking-clearance.mjs';
import {stepPlayer} from '../../src/physics.mjs';
import {WORLD_MAX_Y} from '../../src/depth.mjs';

const seed=179,profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
const sites=[[-38,7,-525],[-36,10,-499],[20,6,-525]]; // real source witnesses from 44972193017
const leaf=id=>id===G.aetherLeaves||id===G.moonLeaves;
const trunk=id=>id===G.aetherBark;
const sourceReaders=world=>{
  const readColumn=(x,z)=>world._columnPlan(x,z);
  const readCell=(x,y,z)=>readColumn(x,z).get(y)??world._environmentBaseline(x,y,z);
  return {readColumn,readCell};
};

test('actual M7 experimental tree leaves always preserve two original air layers over genuine source solids',()=>{
 let naturallyAuthored=0,checkedLeaves=0,groundNearby=0;
 for(const worldSeed of [179,7919,-88]){
  const world=new FourRegionWorld(worldSeed,
    fourRegionProfile(worldSeed,M7_ENVIRONMENT_GENERATOR),
    {experimentalEnchantedTrees:true});
  const {readColumn,readCell}=sourceReaders(world);
  for(const [cx,cz] of [[-2,-33],[-1,-33],[0,-33],[-2,-32],[-1,-32],[0,-32]]){
   const cells=environmentalTreesForChunk(cx,cz,worldSeed,readColumn,readCell,
     {experimentalEnchantedTrees:true});
   naturallyAuthored+=cells.size;
   for(const [at,id] of cells){
    if(!leaf(id))continue;
    const [x,y,z]=at.split(',').map(Number);
    assert.equal(readCell(x,y,z),BLOCK.AIR,
      'experimental canopy may not overwrite original protected cave/landmark/terrain');
    for(const [dx,dz] of ENCHANTED_WALKING_GROUND_NEIGHBORS){
      assert.equal(readCell(x+dx,y-1,z+dz),BLOCK.AIR,
        'real original body edge needs clear first air layer at '+dx+','+dz);
      assert.equal(readCell(x+dx,y-2,z+dz),BLOCK.AIR,
        'real original body corner needs clear second air layer at '+dx+','+dz);
    }
    assert.equal(world.get(x,y,z),id,'actual original world reader material must match chunk planner');
    assert.ok(y<=WORLD_MAX_Y);
    checkedLeaves++;
    if(readCell(x,y-3,z)!==BLOCK.AIR)groundNearby++;
   }
  }
 }
 assert.ok(naturallyAuthored>=250,'genuine M7 source must generate physical tree geometry');
 assert.ok(checkedLeaves>=80,'must verify enough naturally generated leaf voxels');
 console.log('# ENCHANTED REAL WALK CLEARANCE '+JSON.stringify({
  bodyRadius:BODY_RADIUS,bodyHeight:BODY_HEIGHT,naturallyAuthored,
  checkedLeaves,groundThreeBelow:groundNearby,worldSeeds:[179,7919,-88]}));
});

test('real original player collision stays clear at naturally walkable terrain beside all 3 tree species',()=>{
 const world=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
 const historical=new FourRegionWorld(seed,profile);
 const kinds=[];
 for(const [centerX,floor,centerZ] of sites){
  let considered=0,standing=0;
  for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){
    const x=centerX+dx,z=centerZ+dz;
    const column=world._columnPlan(x,z);
    if(column.size===0)continue;
    const cap=Math.max(...column.keys());
    if(cap>WORLD_MAX_Y-3||world.get(x,cap,z)===BLOCK.AIR)continue;
    const feet=cap+1,px=x+.5,pz=z+.5;
    if(collides(historical,px,feet,pz))continue;
    const block1=world.get(x,feet,z),block2=world.get(x,feet+1,z);
    if(trunk(block1)||trunk(block2))continue; // physical trunk is intentionally solid
    considered++;
    assert.equal(collides(world,px,feet,pz),false,
      'opt-in crown cannot close historical walkable standing space '+x+','+cap+','+z);
    assert.equal(collides(world,px,feet-.065,pz),true,
      'original ground probe must contact actual physical terrain');
    standing++;
  }
  kinds.push({site:[centerX,floor,centerZ],considered,standing});
  assert.ok(considered>=1,
    'must find a real walkable neighboring patch at each source-authentic tree');
 }
 console.log('# ENCHANTED REAL PLAYER STANDING '+JSON.stringify({kinds}));
});

test('actual original stepPlayer can traverse a naturally clear adjacent corridor without leaf/head collision',()=>{
 const world=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
 let tested=false;
 const startSites=sites.map(([x,,z])=>[x,z]);
 for(const [centerX,centerZ] of startSites){
  if(tested)break;
  for(let dx=-5;dx<=5&&!tested;dx++)for(let dz=-5;dz<=5&&!tested;dz++){
   const x=centerX+dx,z=centerZ+dz;
   const col=world._columnPlan(x,z);
   if(col.size===0)continue;
   const cap=Math.max(...col.keys()),feet=cap+1;
   if(feet>WORLD_MAX_Y-2)continue;
   for(const [sx,sz,yaw] of [[1,0,Math.PI/2],[0,1,0],[-1,0,-Math.PI/2],[0,-1,Math.PI]]){
    const next=world._columnPlan(x+sx,z+sz);
    if(next.size===0||Math.max(...next.keys())!==cap)continue;
    let clear=true;
    for(const t of [0,.25,.5,.75,1]){
      const px=x+.5+sx*t,pz=z+.5+sz*t;
      if(collides(world,px,feet,pz)||!collides(world,px,feet-.065,pz)){
        clear=false;break;
      }
    }
    if(!clear)continue;
    const player={x:x+.5,z:z+.5,feet,yaw,pitch:0,
      vX:0,vZ:0,vY:0,onGround:true,coyote:0,jumpBuffer:0};
    const original={...player};
    let blocked=false,stepped=false;
    for(let i=0;i<8;i++){
      const out=stepPlayer(world,player,{forward:1,strafe:0,jump:false},.03);
      blocked ||= out.hitWall;stepped ||= out.stepped;
    }
    const distance=Math.hypot(player.x-original.x,player.z-original.z);
    assert.equal(blocked,false,'no leaves or trunk may block a prevalidated natural corridor');
    assert.equal(stepped,false,'flat adjacent source path should never need to step over foliage');
    assert.ok(distance>.22&&distance<1.2,'real original movement must traverse the path');
    assert.ok(Math.abs(player.feet-original.feet)<.07,'walking on flat ground should not fall or climb');
    assert.equal(collides(world,player.x,player.feet,player.z),false);
    tested=true;break;
   }
  }
 }
 assert.ok(tested,'at least one original-source, player-width, floor-supported corridor must exist');
});

test('original real M7 raised-ground edge and corner poses stay collision-clear with candidate leaves',()=>{
 const world=new FourRegionWorld(seed,profile,{experimentalEnchantedTrees:true});
 const historical=new FourRegionWorld(seed,profile);
 let compared=0,uneven=0,existingTrunks=0;
 const examples=[];
 for(const [centerX,,centerZ] of sites){
  for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){
   const x=centerX+dx,z=centerZ+dz;
   const capPlan=world._columnPlan(x,z);
   if(!capPlan.size)continue;
   const cap=Math.max(...capPlan.keys()),feet=cap+1;
   if(feet>WORLD_MAX_Y-2)continue;
   const raised=ENCHANTED_WALKING_GROUND_NEIGHBORS.slice(1).some(([ox,oz])=>{
     const neighbor=world._columnPlan(x+ox,z+oz);
     return neighbor.size&&Math.max(...neighbor.keys())!==cap;
   });
   for(const pxOff of [.22,.78])for(const pzOff of [.22,.78]){
     const px=x+pxOff,pz=z+pzOff;
     if(collides(historical,px,feet,pz)||
       !collides(historical,px,feet-.065,pz))continue;
     // Real mineable bark is deliberately solid, not supposed to be hollowed
     // to make a tree look "walkable".
     let hitsBark=false;
     for(let bx=Math.floor(px-BODY_RADIUS+1e-5);
       bx<=Math.floor(px+BODY_RADIUS-1e-5);bx++)
       for(let bz=Math.floor(pz-BODY_RADIUS+1e-5);
         bz<=Math.floor(pz+BODY_RADIUS-1e-5);bz++)
         for(let by=Math.floor(feet+1e-5);
           by<=Math.floor(feet+BODY_HEIGHT-1e-5);by++)
           hitsBark ||= world.get(bx,by,bz)===G.aetherBark;
     if(hitsBark){existingTrunks++;continue;}
     compared++;if(raised)uneven++;
     assert.equal(collides(world,px,feet,pz),false,
       'experimental moonleaf cannot block an originally walkable AABB edge/corner '+
         JSON.stringify({x,z,feet,px,pz,raised}));
     assert.equal(collides(world,px,feet-.065,pz),true,
       'real supporting ground must remain intact beneath edge/corner position');
     if(raised&&examples.length<5)examples.push({x,z,feet,px,pz});
   }
  }
 }
 assert.ok(compared>=120,'must exercise substantial physically authentic edge/corner poses');
 assert.ok(uneven>=10,'must exercise genuinely uneven neighboring M7 terrain, not only a synthetic flat plane');
 console.log('# ENCHANTED REAL RAISED EDGE AND CORNER WALK '+JSON.stringify({
   compared,uneven,existingTrunks,examples,originalBodyRadius:BODY_RADIUS,
   originalBodyHeight:BODY_HEIGHT
 }));
});
