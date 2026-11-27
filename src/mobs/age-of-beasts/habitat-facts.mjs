// Source-backed habitat facts for the implemented subset. Complex biome
// landmarks, natural-origin chambers and vegetation owners remain explicit
// vetoes until their own final source providers are available.
import {planBodyVolume} from './body-contract.mjs';
import {expansionSupport} from './environment-support.mjs';
import {BLOCK} from '../../voxel.mjs';
import {ENVIRONMENT_GROUND} from '../../environment-ground.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../../manual-biomes/mountain-v8-materials.mjs';
const rock=new Set([BLOCK.STONE,BLOCK.DEEPSTONE,ENVIRONMENT_GROUND.slate,ENVIRONMENT_GROUND.scree,ENVIRONMENT_GROUND.gneiss,M.stone,M.slate,M.scree,M.gneiss]);
const plants=new Set([BLOCK.LEAVES,BLOCK.WOOD,ENVIRONMENT_GROUND.aetherBark,ENVIRONMENT_GROUND.aetherLeaves,ENVIRONMENT_GROUND.moonLeaves,M.flower,M['flower-petal'],M.heather,M['heather-tip'],M['conifer-trunk'],M['conifer-needles']]);
const blooms=new Set([M['flower-petal'],M['heather-tip']]);
export function readExpansionHabitatFacts(view,point,capability,requirement){
 const q=view?.query,body=capability?.body,plan=planBodyVolume(point,body);
 if(!q||!plan||capability.id!==requirement?.id||!Array.isArray(requirement.habitat))return null;
 try{
  const revision=view.revision(),p=Object.freeze([...point]),touched=new Map();
  const read=(x,y,z)=>{const key=x+','+y+','+z;if(!touched.has(key))touched.set(key,[x,y,z]);return view.materialAt(x,y,z);};
  const result={},needed=new Set([...requirement.habitat,'darkness']);
  const env=q.environment(p);
  if(env?.hazard!==false||env.biome!==requirement.biome)return null;
  const checked=new Map(),support=kind=>{if(!checked.has(kind))checked.set(kind,expansionSupport(q,p,body,kind));return checked.get(kind);};
  const getFloor=()=>{
   const b=plan.bounds,out=[];
   for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)
    for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)out.push(read(x,Math.floor(b[1]-.035),z));
   return out;
  };
  let floor,nearby;
  const materialFloor=()=>floor??=(getFloor());
  const localMaterials=()=>nearby??=(()=>{
   const out=[],[x,y,z]=p.map(Math.floor);
   // 75 bounded cells, at most radius two; no unbounded terrain searches.
   for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=-1;dy<=1;dy++)out.push(read(x+dx,y+dy,z+dz));
   return out;
  })();
  // A landing site must be reached by a continuous clear descent, then
  // full footprint support. Bounded to 3 blocks/12 quarter-block steps.
  let landing;
  function findLanding(){
   if(landing!==undefined)return landing;
   landing=null;
   for(let step=0;step<=12;step++){
    const at=[p[0],p[1]-step*.25,p[2]];
    if(q.volume(at,body)!=='clear')break;
    if(expansionSupport(q,at,body,'ground')){landing=at;break;}
   }
   return landing;
  }
  // Require real grass under every footprint cell, not a biome label.
  function grassAt(at){
   const b=planBodyVolume(at,body)?.bounds;if(!b)return false;
   const y=Math.floor(b[1]-.035);
   for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)
    for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)
     if(read(x,y,z)!==BLOCK.GRASS)return false;
   return true;
  }
  for(const tag of needed){
   switch(tag){
    case 'ground':result[tag]=support('ground');break;
    case 'landing-site':result[tag]=findLanding()!==null;break;
    case 'open-grass':{const at=findLanding();result[tag]=at!==null&&grassAt(at);break;}
    case 'large-clearance':result[tag]=q.volume(p,body)==='clear';break;
    case 'ceiling':result[tag]=support('ceiling');break;
    case 'submerged-space':result[tag]=support('water');break;
    case 'flight-clearance':result[tag]=support('air');break;
    case 'climb-site':result[tag]=support('climb-surface');break;
    case 'darkness':result[tag]=Number.isFinite(env.light)&&env.light<=.3;break;
    case 'crystal-floor':result[tag]=support('ground')&&materialFloor().every(id=>id===BLOCK.CRYSTAL);break;
    case 'rock':result[tag]=localMaterials().includes(undefined)?false:localMaterials().some(id=>rock.has(id));break;
    case 'vegetation':result[tag]=localMaterials().includes(undefined)?false:localMaterials().some(id=>plants.has(id));break;
    case 'flowers':result[tag]=localMaterials().includes(undefined)?false:localMaterials().some(id=>blooms.has(id));break;
    default:result[tag]=false;
   }
  }
  if(![...touched.values()].every(cell=>q.residentAt(cell)===true)||!Object.is(view.revision(),revision)||!p.every((n,i)=>Object.is(n,point[i])))return null;
  return Object.freeze(result);
 }catch{return null;}
}
