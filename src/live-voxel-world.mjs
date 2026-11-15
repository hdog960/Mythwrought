// Incorporation 010 candidate: save-safe activation of eligible automation scenery.
// Preserve checkpoint 008 seeded courts, groves, caves and the 10x depth engine.
// These are seed-derived baseline voxels, NOT schema-1 edits or new persistent block IDs.
// Read through VoxelWorld.get so collisions, selection, mining, saving and meshing all agree.
// Manual Block Packs 1-5 and the four building roadmaps are deliberately not imported.
import {BLOCK,baseBlock,terrainHeight} from './voxel.mjs';
import {planVoxelGrove} from './voxel-groves.mjs';
import {planVoxelPilgrimCourt} from './voxel-pilgrim-court.mjs';
import {branchedCaveWorld} from './branched-cave-world.mjs';
import {southGalleryCaveWorld} from './south-gallery-cave.mjs';
import {surveyPilgrimCourtSites} from './pilgrim-court-sites.mjs';
import {planStoneRotunda} from './stone-rotunda.mjs';
import {planTwinwood} from './voxel-forest-twinwood.mjs';

export const LIVE_DISTRICT_SIZE=128;
export const LIVE_DISTRICT_CACHE_LIMIT=16;
const key=(x,y,z)=>x+','+y+','+z;
const inside=(x,z,origin)=>x>=origin.x&&x<=origin.x+origin.length&&
  z>=origin.z-10&&z<=origin.z+4;
const inCaveBuffer=(x,z,origin)=>x>=origin.x-5&&
  x<=origin.x+origin.length+5&&z>=origin.z-15&&z<=origin.z+9;
// Only the exact newly authored south-gallery footprint may use the :24 reader.
// The existing north-wing corridor and all checkpoint 008 geometry retain priority.
const inSouthGallery=(x,z,o)=>{
  const t=x-o.x,d=z-o.z;
  return (t>=o.length-13&&t<=o.length-9&&d>=3&&d<=5)||
         (t>=o.length-17&&t<=o.length-9&&d>=5&&d<=11);
};
const rankSite=(seed,x,z,salt)=>{
  let n=(seed^salt^Math.imul(x,73856093)^Math.imul(z,19349663))|0;
  n=Math.imul(n^(n>>>16),0x7feb352d);
  n=Math.imul(n^(n>>>15),0x846ca68b);
  return (n^(n>>>16))>>>0;
};
function rankedSites(seed,minX,minZ,salt){
  const sites=[];
  for(let z=minZ+16;z<=minZ+112;z+=4)
    for(let x=minX+16;x<=minX+112;x+=4)
      sites.push({x,z,rank:rankSite(seed,x,z,salt)});
  sites.sort((a,b)=>a.rank-b.rank||a.z-b.z||a.x-b.x);
  return sites;
}
const near=(x,z,cx,cz,rx,rz)=>Math.abs(x-cx)<=rx&&Math.abs(z-cz)<=rz;

// Each chunk reads the SAME fixed world-aligned district overlay, regardless
// of load order. No tree or court is installed by VoxelWorld.set().
export function liveVoxelDistrict(seed,dx,dz,legacyGet){
  if(!Number.isInteger(seed)||!Number.isInteger(dx)||!Number.isInteger(dz)||
    typeof legacyGet!=='function')throw Error('Invalid live voxel district');
  const minX=dx*LIVE_DISTRICT_SIZE,minZ=dz*LIVE_DISTRICT_SIZE;
  const baseWorld={seed,get:legacyGet};
  const origins=[{x:minX+24,z:minZ+24,length:28,width:3},
                 {x:minX+80,z:minZ+80,length:28,width:3}];
  const caves=origins.map(origin=>({origin,world:branchedCaveWorld(baseWorld,origin)}));
  const southern=origins.map(origin=>southGalleryCaveWorld(baseWorld,origin));
  // Filled only AFTER legacy courts and trees have been planned. An existing
  // seeded tree or court wins over any conflicting new gallery.
  const enabledSouth=new Set();
  const caveGet=(x,y,z,baseline)=>{
    const original=baseline??legacyGet(x,y,z);
    // Pre-existing physical landmark cells retain priority over new caves.
    if(original!==baseBlock(x,y,z,seed))return original;
    for(let i=0;i<caves.length;i++){
      const origin=caves[i].origin;
      if(enabledSouth.has(i)&&inSouthGallery(x,z,origin))
        return southern[i].get(x,y,z);
      if(inside(x,z,origin))return caves[i].world.get(x,y,z);
    }
    return original;
  };
  const caveWorld={seed,get:caveGet};
  const blocks=new Map();
  let court=null,courtSource=null;
  // Pick one actual, fully walk-through physical court per suitable district.
  // Quick flat-corridor rejection avoids repeatedly planning full arch geometry.
  courtSearch:
  for(let z=minZ+16;z<=minZ+112;z+=4)for(let x=minX+16;x<=minX+112;x+=4){
    const h=terrainHeight(x,z,seed);
    if(h<3||h>11||origins.some(o=>inCaveBuffer(x,z,o)))continue;
    let level=true;
    for(let dz=-11;dz<=11&&level;dz++)
      for(let dx=-1;dx<=1;dx++)
        if(terrainHeight(x+dx,z+dz,seed)!==h){level=false;break;}
    if(!level)continue;
    const plan=planVoxelPilgrimCourt(caveWorld,x,z);
    if(!plan)continue;
    court=plan;courtSource='checkpoint-008';
    for(const [px,py,pz,id] of plan.cells)blocks.set(key(px,py,pz),id);
    break courtSearch;
  }
  // Only if the prior bounded court search failed, use the seeded :36 survey.
  // Its planner is confined to this district, legacy cave buffers and spawn.
  // Never relocate an already-present checkpoint 008 court.
  if(!court){
    const surveyed=surveyPilgrimCourtSites(caveWorld,minX+64,minZ+64,{
      minDistance:48,maxDistance:88,step:4,maxCandidates:128,maxResults:1,
      planner:(world,x,z)=>{
        if(x<minX+16||x>minX+112||z<minZ+16||z>minZ+112||
          near(x,z,0,0,18,24)||origins.some(o=>inCaveBuffer(x,z,o)))return null;
        const h=terrainHeight(x,z,seed);
        if(h<3||h>11)return null;
        for(const dz of [-11,0,11])for(const dx of [-1,0,1])
          if(terrainHeight(x+dx,z+dz,seed)!==h)return null;
        return planVoxelPilgrimCourt(world,x,z);
      }
    })[0];
    if(surveyed){
      court=surveyed;courtSource='survey-010';
      for(const [x,y,z,id] of surveyed.cells)blocks.set(key(x,y,z),id);
    }
  }

  const prepared={seed,get:(x,y,z)=>blocks.get(key(x,y,z))??caveGet(x,y,z)};
  const paths=court?[[[court.origin[0],court.origin[2]-11],
                       [court.origin[0],court.origin[2]+11]]]:[];
  const grove=planVoxelGrove(prepared,{
    minX:minX+7,maxX:minX+120,minZ:minZ+7,maxZ:minZ+120,
    spacing:11,maxTrees:32,paths
  });
  const trees=[];
  for(const plan of grove?.plans||[]){
    // Preserve spawn breathing room, cave openings and the whole visitor route.
    if(plan.cells.some(([x,y,z])=>
      (Math.abs(x)<=8&&Math.abs(z)<=8)||
      origins.some(origin=>inCaveBuffer(x,z,origin))||
      blocks.has(key(x,y,z))))continue;
    trees.push(plan);
    for(const [x,y,z,id] of plan.cells)blocks.set(key(x,y,z),id);
  }
  // :24 south galleries are activated only where the previous court/grove
  // baseline has NO occupied column in the new chamber or connecting throat.
  // This prevents silent replacement of pre-existing seeded world content.
  const occupiedColumns=new Set();
  for(const k of blocks.keys()){
    const [x,,z]=k.split(',');
    occupiedColumns.add(x+','+z);
  }
  for(let i=0;i<origins.length;i++){
    const origin=origins[i];
    let clear=true;
    galleryCheck:
    for(let t=origin.length-17;t<=origin.length-9;t++)
      for(let d=3;d<=11;d++)
        if(inSouthGallery(origin.x+t,origin.z+d,origin)&&
          occupiedColumns.has((origin.x+t)+','+(origin.z+d))){
          clear=false;break galleryCheck;
        }
    if(clear)enabledSouth.add(i);
  }

  // :36 / :48 landmarks are added AFTER old groves, so the original tree
  // plans and court remain stable. All new cells are real WOOD/LEAVES/STONE,
  // read through VoxelWorld.get, never saved as artificial player edits.
  const eligibleRotunda=((dx+dz+(seed&1))&1)===0;
  let rotunda=null,twinwood=null;
  if(eligibleRotunda){
    for(const {x,z} of rankedSites(seed,minX,minZ,0x726f).slice(0,256)){
      if(near(x,z,0,0,18,18)||
         origins.some(o=>near(x,z,o.x+14,o.z,35,30))||
         court&&near(x,z,court.origin[0],court.origin[2],22,26))continue;
      const h=terrainHeight(x,z,seed);
      if(h<3||h>11)continue;
      if([[-4,-4],[-4,4],[4,-4],[4,4],[-4,0],[4,0],[0,-4],[0,4]]
        .some(([a,b])=>terrainHeight(x+a,z+b,seed)!==h))continue;
      const plan=planStoneRotunda(prepared,x,z);
      if(!plan)continue;
      rotunda=plan;
      for(const [px,py,pz,id] of plan.cells)blocks.set(key(px,py,pz),id);
      break;
    }
  }else{
    for(const {x,z,rank} of rankedSites(seed,minX,minZ,0x7477).slice(0,200)){
      if(near(x,z,0,0,18,18)||
         origins.some(o=>near(x,z,o.x+14,o.z,35,30))||
         court&&near(x,z,court.origin[0],court.origin[2],18,24))continue;
      const primary=rank%2?'x':'z';
      const plan=planTwinwood(prepared,x,z,{axis:primary})||
                 planTwinwood(prepared,x,z,{axis:primary==='x'?'z':'x'});
      if(!plan)continue;
      twinwood=plan;
      for(const [px,py,pz,id] of plan.cells)blocks.set(key(px,py,pz),id);
      break;
    }
  }
  return {
    seed,dx,dz,trees,court,courtSource,caves:origins,
    southGalleries:[...enabledSouth].map(i=>origins[i]),rotunda,twinwood,
    blockCount:blocks.size,
    get(x,y,z,baseline){return blocks.get(key(x,y,z))??caveGet(x,y,z,baseline);}
  };
}
