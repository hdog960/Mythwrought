import {BLOCK,terrainHeight,worldKey} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {M6_BALANCED_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {M3_DESERT_IDS} from '../manual-biomes/desert-m3.mjs';
import {M4_PHYSICAL_MATERIALS} from '../manual-biomes/three-regions-m4.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {surfaceBiomeAt} from '../surface-regions/regions.mjs';
import {createCandidateScene} from './candidate-scene.mjs';
import {candidateFamilies} from './candidate-families.mjs';

const flora=names=>names.split(' ').map(name=>'scene48:'+name);
const scenery=(group,names)=>names.split(' ').map(name=>'nonblock:'+group+':'+name);
const alpine=scenery('d','alpine-wildflower dwarf-juniper');
const rock=[BLOCK.STONE,BLOCK.DEEPSTONE];
const caveCover=[...rock,BLOCK.DIRT,BLOCK.GRASS];
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

function coordinates(value,size){
  return Array.isArray(value)&&value.length===size&&
    value.every(number=>Number.isInteger(number)&&Math.abs(number)<10_000);
}

function surfaceAnchor(world,habitat,column){
  if(!coordinates(column,2))throw new TypeError('Invalid scenery surface column');
  const [x,z]=column;
  const {seed,generationProfile:profile}=world;
  const evolved=profile?.generator===M7_ENVIRONMENT_GENERATOR;
  const sample=evolved||profile?.generator===M6_BALANCED_GENERATOR?v6BiomeAt:surfaceBiomeAt;
  const region=profile?sample(x,z,seed):null;
  const name=region?.weight>=.35?region.name:'meadow';
  if(name!==habitat)return null;
  const floor=terrainHeight(x,z,seed)-2;
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

// Explicit staging requests against existing terrain. The result can be passed
// to the loopback runtime as an ordinary layout. This function performs no edits,
// writes no save keys and never runs on world load or while streaming chunks.
export function planStagedHabitat(world,requests,{occupied=()=>false}={}){
  if(!Array.isArray(requests)||requests.length>32)throw new TypeError('Invalid scenery site requests');
  const editedAt=(x,y,z)=>world.edits.has(worldKey(x,y,z))||occupied(x,y,z);
  const blockAt=(x,y,z)=>world.get(x,y,z)!==BLOCK.AIR;
  const sceneDeps={storage:emptyStorage,blockAt,editedAt,voxelPick:()=>null};
  const worldId=world.generationProfile?.generator??'legacy';
  const accepted=[];
  const used=new Set();
  for(const request of requests){
    const {habitat,sceneId,column,anchor:cave,variant=0,orientation=0}=request??{};
    const rules=habitats.get(habitat);
    if(!rules?.families.includes(sceneId))continue;
    const anchor=habitat==='cave'?caveAnchor(world,cave):surfaceAnchor(world,habitat,column);
    if(!anchor||used.has(anchor.join(','))||anchor[1]>WORLD_MAX_Y)continue;
    const placement={sceneId,anchor:[...anchor],variant,orientation};
    const [visible]=createCandidateScene(world.seed,worldId,[placement],sceneDeps).visible();
    if(!visible||!visible.supports.every(([x,y,z])=>
      rules.ground.includes(world.naturalAndLandmarkBlock(x,y,z))))continue;
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

function environmentalCaveSite(world,x,z,section,hash,options){
  const families=habitats.get('cave').families;
  const sceneId=families[(hash>>>12)%families.length];
  const family=candidateFamilies.get(sceneId);
  const natural=(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c);
  const baseline={seed:world.seed,get:natural,naturalAndLandmarkBlock:natural,edits:new Map()};
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
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(let site=0;site<3;site++){
    const tx=cx+dx,tz=cz+dz;
    const hash=placementRoll(tx*5+site,tz*7-site,world.seed);
    const x=tx*16+2+(site&1)*8+hash%5;
    const z=tz*16+2+(site>>1)*8+(hash>>>8)%5;
    if(Math.abs(x)>=10_000||Math.abs(z)>=10_000)continue;
    if(Number.isInteger(options.caveSection)){
      const specimen=environmentalCaveSite(world,x,z,options.caveSection,hash,options);
      if(specimen)cave.push(specimen);
      continue;
    }
    const region=v6BiomeAt(x,z,world.seed);
    const habitat=region?.name??'meadow';
    if(habitat==='desert'&&site===2)continue;
    const families=habitats.get(habitat).families;
    requests.push({habitat,column:[x,z],sceneId:families[(hash>>>12)%families.length],variant:hash%4});
  }
  return Number.isInteger(options.caveSection)?cave:planStagedHabitat(world,requests,options);
}
