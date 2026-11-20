import {BLOCK,terrainHeight,worldKey} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {M6_BALANCED_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {M3_DESERT_IDS} from '../manual-biomes/desert-m3.mjs';
import {M4_PHYSICAL_MATERIALS} from '../manual-biomes/three-regions-m4.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
import {surfaceBiomeAt} from '../surface-regions/regions.mjs';
import {createCandidateScene} from './candidate-scene.mjs';

const flora=names=>names.split(' ').map(name=>'scene48:'+name);
const scenery=(group,names)=>names.split(' ').map(name=>'nonblock:'+group+':'+name);
const alpine=scenery('d','alpine-wildflower dwarf-juniper');
const rock=[BLOCK.STONE,BLOCK.DEEPSTONE];
const caveCover=[...rock,BLOCK.DIRT,BLOCK.GRASS];
const habitats=new Map([
  ['meadow',{ground:[BLOCK.GRASS],families:flora(
    'low-grass short-fern single-wildflower lavender-spike heather-sprig clover-clump meadow-sedge clover-patch grass-plume meadow-fescue buttercup-bunch seedhead-meadow-mix')}],
  ['desert',{ground:[M3_DESERT_IDS.pale,M3_DESERT_IDS.red,M3_DESERT_IDS.salt],
    families:scenery('d','desert-scrub prickly-pear-cactus column-cactus agave-rosette tumblebrush desert-bloom saltgrass')}],
  ['snow',{ground:Object.values(M4_PHYSICAL_MATERIALS.snow),
    families:[...scenery('d','snowgrass frost-fern'),...alpine]}],
  ['mountain',{ground:Object.values(M4_PHYSICAL_MATERIALS.mountain),
    families:[...alpine,...scenery('e','pebble-scatter')]}],
  ['enchanted',{ground:Object.values(M4_PHYSICAL_MATERIALS.enchanted),
    families:flora('spore-pod enchanted-flower lantern-mushroom ringed-morel starpetal inkcap-cluster velvet-cup forest-leaf-litter woodland-horsetail moss-cushion woodland-sapling woodland-shrub')}],
  ['cave',{ground:rock,families:[...scenery('e','small-stalagmite giant-stalagmite-spire hanging-stalactite clustered-dripstone limestone-cave-column flowstone-curtain crystal-shard branching-crystal-cluster geode-opening pebble-scatter cave-rubble-cluster mineral-encrustation'),...flora('cavecap')]}]
]);
const emptyStorage={getItem:()=>null};

function coordinates(value,size){
  return Array.isArray(value)&&value.length===size&&
    value.every(number=>Number.isInteger(number)&&Math.abs(number)<10_000);
}

function surfaceAnchor(world,habitat,column){
  if(!coordinates(column,2))throw new TypeError('Invalid scenery surface column');
  const [x,z]=column;
  const {seed,generationProfile:profile}=world;
  const sample=profile?.generator===M6_BALANCED_GENERATOR?v6BiomeAt:surfaceBiomeAt;
  const region=profile?sample(x,z,seed):null;
  const name=region?.weight>=.35?region.name:'meadow';
  if(name!==habitat)return null;
  const floor=terrainHeight(x,z,seed)-2;
  for(let y=WORLD_MAX_Y;y>=floor;y--){
    if(world.get(x,y,z)!==BLOCK.AIR)return [x,y+1,z];
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
