// C3 protected new-world cave entrances. Read-only proposal, never auto-spawn.
// Each candidate uses real source cave anchors, 3-wide supported voxel steps,
// 4-high player clearance and a surface landmark/edit protection survey.
// No writes to VoxelWorld, main, legacy Y=-3, localStorage or Pages.
import {BLOCK,worldKey,terrainHeight,baseBlock} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y,LEGACY_WORLD_MIN_Y} from '../depth.mjs';
import {DEEP_CAVE_ORIGIN,deepCaveRoute} from '../deep-cave-network.mjs';
import {descentEntranceApproach} from '../underground-switchback-descent.mjs';
import {UPPER_SITES} from '../cave-approaches/upper-network.mjs';

export const CAVE_ENTRANCE_PROFILE='new-cave-world-only';
export function originalCaveEntranceSites(){
  const old=deepCaveRoute(DEEP_CAVE_ORIGIN)[0];
  const deep=descentEntranceApproach()[0];
  return Object.freeze([
    Object.freeze({name:'old-deep24',x:old.x,z:old.z,floor:old.floor}),
    Object.freeze({name:'switchback36',x:deep.x,z:deep.z,floor:deep.floor}),
    ...UPPER_SITES.map((site,i)=>Object.freeze({
      name:i?'upper24-hollowbend':'upper24-windcut',
      x:site.x,z:site.z,floor:-8
    }))
  ]);
}
const directions=Object.freeze([[-1,0],[0,-1],[1,0],[0,1]]);
const key=(x,y,z)=>worldKey(x,y,z);
function surveyDirection(world,source,site,dx,dz,reserved){
  const cells=new Map(),route=[];
  let mouth=null,rejected=null;
  const seed=world.seed;
  for(let step=0;step<=64;step++){
    const x=site.x+dx*step,z=site.z+dz*step;
    const floor=site.floor+Math.floor(step/2);
    if(floor+4>WORLD_MAX_Y){rejected='HEIGHT_LIMIT';break;}
    for(const across of [-1,0,1]){
      const xx=x-dz*across,zz=z+dx*across;
      const support=baseBlock(xx,floor,zz,seed);
      const solid=floor<LEGACY_WORLD_MIN_Y?BLOCK.DEEPSTONE:
        support===BLOCK.AIR?BLOCK.STONE:support;
      for(let y=floor;y<=floor+4;y++){
        if(y<WORLD_MIN_Y||y>WORLD_MAX_Y){rejected='WORLD_BOUNDS';break;}
        const id=y===floor?solid:BLOCK.AIR,k=key(xx,y,zz);
        if(reserved.has(k)){rejected='OTHER_ENTRANCE_COLLISION';break;}
        const prior=source.get(k);
        if(prior!==undefined&&prior!==id){rejected='AUTHORED_SOURCE_COLLISION';break;}
        // No overwriting player edits or existing source-owned natural landmarks.
        // The legacy layer is permitted only in a NEW explicit cave-world mode.
        if(world.edits?.has(k)){rejected='PLAYER_EDIT_PROTECTION';break;}
        if(y>=LEGACY_WORLD_MIN_Y){
          const actual=world.get(xx,y,zz),natural=baseBlock(xx,y,zz,seed);
          if(actual!==natural&&actual!==id){
            rejected='PROTECTED_EXISTING_LANDMARK';break;
          }
        }
        const prev=cells.get(k);
        if(prev!==undefined&&prev!==id){rejected='INTERNAL_PORTAL_CONFLICT';break;}
        cells.set(k,id);
      }
      if(rejected)break;
    }
    if(rejected)break;
    route.push(Object.freeze({x,z,floor,feet:floor+1}));
    const localSurface=Math.max(...[-1,0,1].map(a=>
      terrainHeight(x-dz*a,z+dx*a,seed)));
    if(step>=4&&floor>=localSurface){
      mouth=Object.freeze({x,y:floor+1,z,approachSteps:step+1});
      break;
    }
  }
  if(!mouth)return Object.freeze({ok:false,reason:rejected||'NO_SUPPORTED_SURFACE_MOUTH'});
  return Object.freeze({ok:true,name:site.name,sourceAnchor:Object.freeze({...site}),
    direction:Object.freeze({dx,dz}),mouth,cells,route:Object.freeze(route),
    physicallyProposed:true,worldModified:false,runtimeConnected:false});
}
export function planNewCaveEntrances({world,sourceCells,approved=false}={}){
  if(approved!==true)return Object.freeze({ok:false,reason:'EXPLICIT_NEW_CAVE_WORLD_REQUIRED'});
  if(!world||!Number.isInteger(world.seed)||!(sourceCells instanceof Map)||
     typeof world.get!=='function'||!(world.edits instanceof Map))
    return Object.freeze({ok:false,reason:'SOURCE_WORLD_REQUIRED'});
  const selected=[],reserved=new Set(),failures=[];
  for(const site of originalCaveEntranceSites()){
    const attempts=[];
    let accepted=null;
    for(const [dx,dz] of directions){
      const plan=surveyDirection(world,sourceCells,site,dx,dz,reserved);
      if(plan.ok){accepted=plan;break;}
      attempts.push(plan.reason);
    }
    if(!accepted){failures.push(Object.freeze({name:site.name,attempts:Object.freeze(attempts)}));continue;}
    selected.push(accepted);
    for(const k of accepted.cells.keys())reserved.add(k);
  }
  const combined=new Map();
  for(const p of selected)for(const [key,id] of p.cells)combined.set(key,id);
  return Object.freeze({
    ok:failures.length===0&&selected.length===4,
    entrances:Object.freeze(selected),failures:Object.freeze(failures),
    cells:combined,profile:CAVE_ENTRANCE_PROFILE,
    modifiedExistingWorld:false,runtimeConnected:false
  });
}
