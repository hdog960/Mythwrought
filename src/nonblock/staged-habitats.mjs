import {BLOCK,terrainHeight,worldKey} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {M3_DESERT_IDS} from '../manual-biomes/desert-m3.mjs';
import {M4_PHYSICAL_MATERIALS} from '../manual-biomes/three-regions-m4.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {surfaceBiomeAt} from '../surface-regions/regions.mjs';
import {LIVE_DISTRICT_SIZE} from '../live-voxel-world.mjs';
import {createCandidateScene} from './candidate-scene.mjs';
import {candidateFamilies} from './candidate-families.mjs';

const flora=names=>names.split(' ').map(name=>'scene48:'+name);
const scenery=(group,names)=>names.split(' ').map(name=>'nonblock:'+group+':'+name);
const alpine=scenery('d','alpine-wildflower dwarf-juniper');
const rock=[BLOCK.STONE,BLOCK.DEEPSTONE];
const caveCover=[...rock,BLOCK.DIRT,BLOCK.GRASS];
const landmarkProps=['signpost','freestanding-torch','campfire-fuel-stack','brazier',
  'broken-pottery-scatter','rope-coil','cloth-banner','hanging-bell','ladder-assembly',
  'rope-ladder','hanging-chain','hanging-cobweb'].map(name=>'scene36:'+name);
const directions=[[0,1],[-1,0],[0,-1],[1,0]];
const mounts=new Map([
  ['meadow',{families:flora('crawling-ivy trail-vine'),blocks:[BLOCK.WOOD]}],
  ['enchanted',{families:flora('shelf-fungus glowing-vine'),blocks:[G.aetherBark,BLOCK.WOOD]}],
  ['snow',{families:scenery('d','icicle-spear'),blocks:[276,279,G.snowyNeedles]}]
]);
const habitats=new Map([
  ['meadow',{ground:[BLOCK.GRASS],families:flora(
    'low-grass short-fern single-wildflower lavender-spike heather-sprig clover-clump meadow-sedge clover-patch grass-plume meadow-fescue buttercup-bunch seedhead-meadow-mix button-mushroom')}],
  ['desert',{ground:[M3_DESERT_IDS.pale,M3_DESERT_IDS.red,M3_DESERT_IDS.salt],
    families:scenery('d','desert-scrub prickly-pear-cactus column-cactus agave-rosette tumblebrush desert-bloom saltgrass')}],
  ['snow',{ground:[276,...Object.values(M4_PHYSICAL_MATERIALS.snow)],
    families:[...scenery('d','snowgrass frost-fern'),...alpine]}],
  ['mountain',{ground:[G.slate,G.scree,G.gneiss,272,...Object.values(M4_PHYSICAL_MATERIALS.mountain)],
    families:[...alpine,...scenery('e','pebble-scatter')]}],
  ['enchanted',{ground:[G.woodlandLoam,G.woodlandPeat,G.woodlandMoss,...Object.values(M4_PHYSICAL_MATERIALS.enchanted)],
    families:flora('spore-pod enchanted-flower lantern-mushroom ringed-morel starpetal inkcap-cluster velvet-cup forest-leaf-litter woodland-horsetail moss-cushion woodland-sapling woodland-shrub bracken-fern exposed-root fallen-branch forest-moss-mat forest-lichen-patch clustered-toadstools')}],
  ['cave',{ground:rock,families:[...scenery('e','small-stalagmite giant-stalagmite-spire hanging-stalactite clustered-dripstone limestone-cave-column flowstone-curtain crystal-shard branching-crystal-cluster geode-opening pebble-scatter cave-rubble-cluster mineral-encrustation'),...flora('cavecap')]}]
]);
const emptyStorage={getItem:()=>null};
const canopyIds=new Set([BLOCK.LEAVES,G.coldNeedles,G.snowyNeedles,G.aetherLeaves,G.moonLeaves]);
const emptyPick=()=>null;

function coordinates(value,size){
  return Array.isArray(value)&&value.length===size&&
    value.every(number=>Number.isInteger(number)&&Math.abs(number)<10_000);
}

function surfaceHabitat(world,x,z){
  const {seed,generationProfile:profile}=world;
  const evolved=profile?.generator===M7_ENVIRONMENT_GENERATOR;
  const sample=evolved||profile?.generator===M6_BALANCED_GENERATOR?v6BiomeAt:surfaceBiomeAt;
  const region=profile?sample(x,z,seed):null;
  return region?.weight>=.35?region.name:'meadow';
}

function surfaceAnchor(world,habitat,column){
  if(!coordinates(column,2))throw new TypeError('Invalid scenery surface column');
  const [x,z]=column;
  if(surfaceHabitat(world,x,z)!==habitat)return null;
  const evolved=world.generationProfile?.generator===M7_ENVIRONMENT_GENERATOR;
  const floor=terrainHeight(x,z,world.seed)-2;
  for(let y=WORLD_MAX_Y;y>=floor;y--){
    const block=evolved?world.naturalAndLandmarkBlock(x,y,z):world.get(x,y,z);
    if(block!==BLOCK.AIR&&(!evolved||!canopyIds.has(block)))return [x,y+1,z];
  }
  return null;
}

function caveAnchor(world,anchor){
  if(!coordinates(anchor,3))throw new TypeError('Invalid scenery cave anchor');
  const [x,y,z]=anchor;
  const cover=terrainHeight(x,z,world.seed)-2;
  const coverBlock=world.get(x,cover,z);
  return y>WORLD_MIN_Y&&y<cover&&!world.edits.has(worldKey(x,cover,z))&&
    caveCover.includes(coverBlock)?anchor:null;
}

// Resolve plans against the same exact placement geometry used by gameplay.
// The planner leaves voxel edits and scenery removal records to their owners.
export function planStagedHabitat(world,requests,{occupied=()=>false}={}){
  if(!Array.isArray(requests)||requests.length>32)throw new TypeError('Invalid scenery site requests');
  const editedAt=(x,y,z)=>world.edits.has(worldKey(x,y,z))||occupied(x,y,z);
  const blockAt=(x,y,z)=>world.get(x,y,z)!==BLOCK.AIR;
  const sceneDeps={storage:emptyStorage,blockAt,editedAt,voxelPick:emptyPick};
  const worldId=world.generationProfile?.generator??'legacy';
  const accepted=[];
  const used=new Set();
  for(const request of requests){
    const {habitat,sceneId,column,anchor:hint,variant=0,orientation=0}=request??{};
    const rules=habitats.get(habitat);
    const mount=mounts.get(habitat);
    const mounted=mount?.families.includes(sceneId);
    if(!mounted&&!rules?.families.includes(sceneId))continue;
    const anchor=habitat==='cave'?caveAnchor(world,hint):mounted?
      (coordinates(hint,3)&&surfaceHabitat(world,hint[0],hint[2])===habitat?hint:null):
      surfaceAnchor(world,habitat,column);
    if(!anchor||used.has(anchor.join(','))||anchor[1]>WORLD_MAX_Y)continue;
    const placement={sceneId,anchor:[...anchor],variant,orientation};
    const [visible]=createCandidateScene(world.seed,worldId,[placement],sceneDeps).visible();
    const blocks=mounted?mount.blocks:rules.ground;
    if(!visible||!visible.supports.every(([x,y,z])=>
      blocks.includes(world.naturalAndLandmarkBlock(x,y,z))))continue;
    accepted.push(placement);
    used.add(anchor.join(','));
  }
  return accepted;
}

function placementRoll(x,z,seed){
  let value=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^seed;
  value=Math.imul(value^(value>>>16),0x45d9f3b);
  return (value^(value>>>16))>>>0;
}

function terrainOnly(world){
  const natural=(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z);
  return {seed:world.seed,generationProfile:world.generationProfile,get:natural,
    naturalAndLandmarkBlock:natural,edits:new Map()};
}

function surfaceMount(world,habitat,x,z,hash){
  const rule=mounts.get(habitat);
  if(!rule)return null;
  const sceneId=rule.families[(hash>>>19)%rule.families.length];
  const floor=terrainHeight(x,z,world.seed);
  const above=habitat==='snow';
  for(let y=floor;y<=Math.min(WORLD_MAX_Y-1,floor+8);y++){
    if(world.get(x,y,z)!==BLOCK.AIR)continue;
    for(let r=0;r<(above?1:4);r++){
      const orientation=(r+hash)%4;
      const [dx,dz]=above?[0,0]:directions[orientation];
      if(!rule.blocks.includes(world.get(x+dx,y+1,z+dz)))continue;
      if(!above&&!rule.blocks.includes(world.get(x+dx,y,z+dz)))continue;
      const request={habitat,sceneId,anchor:[x,y,z],variant:hash%4,orientation};
      if(planStagedHabitat(world,[request]).length)return request;
    }
  }
  return null;
}

function findLandmarkProp(baseline,district,x,z,hash){
  const nearby=[district?.court,district?.rotunda,district?.twinwood,district?.canopyGate]
    .filter(site=>site?.origin&&Math.abs(x-site.origin[0])<=10&&Math.abs(z-site.origin[2])<=10);
  if(!nearby.length)return null;
  const sceneId=landmarkProps[(hash>>>12)%landmarkProps.length];
  const family=candidateFamilies.get(sceneId);
  const mountSet=new Set(nearby.flatMap(site=>site.cells.filter(([,,,id])=>
    id===BLOCK.STONE||id===BLOCK.WOOD).map(([a,b,c])=>worldKey(a,b,c))));
  const ceiling=family.attachment==='ceiling';
  const attached=family.wall||ceiling;
  const terrain=terrainHeight(x,z,baseline.seed);
  const placement={sceneId,variant:hash%4,orientation:hash%4};
  const dep={storage:emptyStorage,blockAt:(...p)=>baseline.get(...p)!==BLOCK.AIR,voxelPick:emptyPick};
  for(let y=Math.max(terrain-1,0);y<=Math.min(terrain+8,WORLD_MAX_Y-1);y++){
    if(baseline.get(x,y,z)!==BLOCK.AIR)continue;
    if(!attached&&(baseline.get(x,y-1,z)===BLOCK.AIR||canopyIds.has(baseline.get(x,y-1,z))))continue;
    for(let r=0;r<(family.wall?4:1);r++){
      const orientation=(r+hash)%4;
      const [dx,dz]=family.wall?directions[orientation]:[0,0];
      const supportY=y+(ceiling?1:family.wallY??1);
      if(attached&&!mountSet.has(worldKey(x+dx,supportY,z+dz)))continue;
      if(!attached){
        // Keep the center of the authored route clear for ordinary walking.
        const court=nearby.find(site=>site===district.court);
        if(court&&Math.abs(x-court.origin[0])<=2)continue;
      }
      const candidate={...placement,anchor:[x,y,z],orientation};
      if(createCandidateScene(baseline.seed,M7_ENVIRONMENT_GENERATOR,[candidate],dep).visible().length)
        return candidate;
    }
  }
  return null;
}

function environmentalCaveSite(world,baseline,x,z,section,hash,options){
  const families=habitats.get('cave').families;
  const sceneId=families[(hash>>>12)%families.length];
  const family=candidateFamilies.get(sceneId);
  const natural=baseline.get;
  for(let i=0;i<8;i++){
    const y=section*8+(i+hash)%8;
    const anchor=[x,y,z];
    if(natural(...anchor)!==BLOCK.AIR)continue;
    if(family.attachment==='ceiling'&&!rock.includes(natural(x,y+1,z)))continue;
    if(!family.wall&&family.attachment!=='ceiling'&&!rock.includes(natural(x,y-1,z)))continue;
    const directionCount=family.wall?4:1;
    for(let r=0;r<directionCount;r++){
      const orientation=family.wall?(r+hash)%4:0;
      const request={habitat:'cave',sceneId,anchor,variant:hash%4,orientation};
      if(planStagedHabitat(baseline,[request]).length)
        return planStagedHabitat(world,[request],options)[0]??null;
    }
  }
  return null;
}

export function planEnvironmentalScenery(world,cx,cz,options={}){
  if(world.generationProfile?.generator!==M7_ENVIRONMENT_GENERATOR)return [];
  const requests=[];
  const cave=[];
  const props=[];
  const baseline=terrainOnly(world);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(let site=0;site<3;site++){
    const tx=cx+dx,tz=cz+dz;
    const hash=placementRoll(tx*5+site,tz*7-site,world.seed);
    const x=tx*16+2+(site&1)*8+hash%5;
    const z=tz*16+2+(site>>1)*8+(hash>>>8)%5;
    if(Math.abs(x)>=10_000||Math.abs(z)>=10_000)continue;
    if(Number.isInteger(options.caveSection)){
      const specimen=environmentalCaveSite(world,baseline,x,z,options.caveSection,hash,options);
      if(specimen)cave.push(specimen);
      continue;
    }
    if(site===2){
      const districtId=Math.floor(x/LIVE_DISTRICT_SIZE)+','+Math.floor(z/LIVE_DISTRICT_SIZE);
      // Initialize the ordinary deterministic district through the same voxel
      // reader used by player collision. Only its source-authored sites count.
      baseline.get(x,terrainHeight(x,z,world.seed),z);
      const prop=findLandmarkProp(baseline,world.liveDistrictCache.get(districtId),x,z,hash);
      if(prop){
        const editedAt=(x,y,z)=>world.edits.has(worldKey(x,y,z))||options.occupied?.(x,y,z);
        const dep={storage:emptyStorage,blockAt:(...p)=>world.get(...p)!==BLOCK.AIR,editedAt,voxelPick:emptyPick};
        if(createCandidateScene(world.seed,M7_ENVIRONMENT_GENERATOR,[prop],dep).visible().length)props.push(prop);
        continue;
      }
    }
    const habitat=surfaceHabitat(world,x,z);
    if(habitat==='desert'&&site===2){
      const shore=world.environmentOasisShore(tx,tz);
      if(shore.length){
        const column=shore[hash%shore.length];
        const sceneId=hash&2?'nonblock:d:saltgrass':'nonblock:d:desert-bloom';
        if(!requests.some(row=>row.column?.join(',')===column.join(',')))
          requests.push({habitat,column,sceneId,variant:hash%4});
      }
      continue;
    }
    const mounted=surfaceMount(baseline,habitat,x,z,hash);
    if(mounted){requests.push(mounted);continue;}
    const families=habitats.get(habitat).families;
    requests.push({habitat,column:[x,z],sceneId:families[(hash>>>12)%families.length],variant:hash%4});
  }
  return Number.isInteger(options.caveSection)?cave:[...planStagedHabitat(world,requests,options),...props];
}
