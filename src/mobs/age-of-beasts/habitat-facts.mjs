// Source-backed habitat facts for the implemented subset. Complex biome
// landmarks, natural-origin chambers and vegetation owners remain explicit
// vetoes until their own final source providers are available.
import {planBodyVolume} from './body-contract.mjs';
import {shallowWade,shelteredAt} from './wildlife-activities.mjs';
import {expansionSupport} from './environment-support.mjs';
import {BLOCK} from '../../voxel.mjs';
import {ENVIRONMENT_GROUND} from '../../environment-ground.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../../manual-biomes/mountain-v8-materials.mjs';
const rock=new Set([BLOCK.STONE,BLOCK.DEEPSTONE,ENVIRONMENT_GROUND.slate,ENVIRONMENT_GROUND.scree,ENVIRONMENT_GROUND.gneiss,M.stone,M.slate,M.scree,M.gneiss]);
const plants=new Set([BLOCK.LEAVES,BLOCK.WOOD,ENVIRONMENT_GROUND.aetherBark,ENVIRONMENT_GROUND.aetherLeaves,ENVIRONMENT_GROUND.moonLeaves,M.flower,M['flower-petal'],M.heather,M['heather-tip'],M['conifer-trunk'],M['conifer-needles']]);
const sand=new Set([256,257]),snow=new Set([272,276,279,M.snow]);
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
 const floorIs=ids=>support('ground')&&materialFloor().length>0&&materialFloor().every(id=>ids.has(id));
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
  // Every probed cell must be available through the same source view.
  // For spawning, view.materialAt is generatedMaterialAt, not a placed-block reader.
  const knownVolume=(at,b=body)=>{const v=planBodyVolume(at,b);return !!v&&v.cells.every(({x,y,z})=>read(x,y,z)!==undefined);};
  const knownFloor=at=>{const b=planBodyVolume(at,body)?.bounds;if(!b)return false;
   for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)if(read(x,Math.floor(b[1]-.035),z)===undefined)return false;return true;};
  // Baseline alpine elevation is intentionally limited to current natural
  // generator height. The final mountain owner must approve final bands.
  const highTerrain=new Set([...rock,M.snow,M['alpine-grass']]);
  const ledgeAt=()=>{
   const at=findLanding();if(!at||!knownVolume(at)||!knownFloor(at)||at[1]<10)return false;
   const b=planBodyVolume(at,body).bounds,fy=Math.floor(b[1]-.035);
   // A real supported rock platform next to a >=2-cell drop, not a biome flag.
   for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)
    for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)if(!highTerrain.has(read(x,fy,z)))return false;
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const x=Math.floor(at[0]+dx*(body.radius+1.25)),z=Math.floor(at[2]+dz*(body.radius+1.25));
    if(read(x,fy,z)===BLOCK.AIR&&read(x,fy-1,z)===BLOCK.AIR&&read(x,fy-2,z)===BLOCK.AIR)return true;
   }
   return false;
  };
  let ledge;
  const ledgeSite=()=>ledge??=ledgeAt();
  const highElevation=()=>env.biome==='alpine'&&p[1]>=14&&knownVolume(p)&&support('air')&&(()=>{
   // Actual nearby alpine terrain, below the actor, not a floating coordinate.
   const [x,y,z]=p.map(Math.floor);
   for(let dy=1;dy<=6;dy++){const id=read(x,y-dy,z);if(id===undefined)return false;if(highTerrain.has(id))return y-dy>=10;if(id!==BLOCK.AIR)return false;}
   return false;
  })();
  let refuge,shore;
  const refugeSite=()=>refuge??=(()=>{
   const at=findLanding();if(!at||!knownFloor(at)||!shelteredAt(q,at,body))return false;
   // Require known source across the whole possible overhead contact region.
   for(let i=0;i<=4;i++)if(!knownVolume([at[0],at[1]+i*.25,at[2]]))return false;
   const b=planBodyVolume(at,body).bounds;
   for(let y=Math.floor(b[4]);y<=Math.floor(b[4]+1.035);y++)
    for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)if(read(x,y,z)===undefined)return false;
   return true;
  })();
  const shoreline=()=>shore??=(()=>{
   const at=findLanding();if(!at||!knownVolume(at)||!knownFloor(at))return false;
   // Bounded two-block radial shoreline check: same-height dry standing
   // and actual shallow supported water, with source-known footprints.
   const dry=pos=>knownVolume(pos)&&knownFloor(pos)&&expansionSupport(q,pos,body,'ground')&&expansionSupport(q,pos,body,'air');
   const wet=pos=>knownVolume(pos)&&knownFloor(pos)&&shallowWade(q,pos,body);
   // Center can straddle the bank. Search independently on each side
   // for complete dry and wet footprints; never require the center to be dry.
   for(const [dx,dz] of [[1,0],[0,1]]){
    const samples=[-2,-1.5,-1,-.5,0,.5,1,1.5,2].map(d=>[at[0]+dx*d,at[1],at[2]+dz*d]);
    const drySites=samples.filter(dry),wetSites=samples.filter(wet);
    for(const a of drySites)for(const b of wetSites){
     if(Math.hypot(...a.map((n,i)=>n-b[i]))>2*body.radius+1)continue;
     if(q.lineOfSight([a[0],a[1]+body.height*.6,a[2]],[b[0],b[1]+body.height*.6,b[2]])===true)return true;
    }
   }
   return false;
  })();
  for(const tag of needed){
   switch(tag){
    case 'ground':result[tag]=support('ground');break;
    case 'emergence-site':case 'burrow-site':result[tag]=refugeSite();break;
    case 'vegetation-or-hills':result[tag]=!localMaterials().includes(undefined)&&localMaterials().some(id=>plants.has(id));break;
    case 'water-nearby':case 'shoreline':result[tag]=shoreline();break;
    case 'sand':case 'loose-sand':result[tag]=floorIs(sand);break;
    case 'snow-ground':case 'frozen-ground':result[tag]=floorIs(snow);break;
    case 'snow-or-vegetation':result[tag]=floorIs(snow)||(!localMaterials().includes(undefined)&&localMaterials().some(id=>plants.has(id)));break;
    case 'rock-or-sand':result[tag]=floorIs(sand)||(!localMaterials().includes(undefined)&&localMaterials().some(id=>rock.has(id)));break;
    case 'magical-or-dark-forest':result[tag]=env.biome==='forest'&&Number.isFinite(env.light)&&env.light<=.3;break;
    case 'high-elevation':result[tag]=highElevation();break;
    case 'cliff-ledge':case 'perch-site':result[tag]=ledgeSite();break;
    case 'high-meadow':result[tag]=p[1]>=10&&floorIs(new Set([M['alpine-grass']]));break;
    case 'open-ground':case 'running-clearance':case 'open-snow':case 'traversable-cave':{
     const at=findLanding(),required=tag==='open-snow'?floorIs(snow):true;
     result[tag]=required&&at!==null&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>{
      for(let i=1;i<=8;i++){
       const next=[at[0]+dx*i*.25,at[1],at[2]+dz*i*.25];
       if(!expansionSupport(q,next,body,'ground'))return false;
       const volume=planBodyVolume(next,body);if(!volume)return false;
       for(const {x,y,z} of volume.cells)if(read(x,y,z)===undefined)return false;
       const b=volume.bounds,y=Math.floor(b[1]-.035);
       for(let x=Math.floor(b[0]+1e-5);x<=Math.floor(b[3]-1e-5);x++)for(let z=Math.floor(b[2]+1e-5);z<=Math.floor(b[5]-1e-5);z++)if(read(x,y,z)===undefined)return false;
      }
      return true;
     });break;
    }
    case 'landing-site':result[tag]=findLanding()!==null;break;
    case 'rider-clearance':{
     // Provisional adult player envelope, original interaction reach.
     // Do not infer aerial mount availability or relax the actual body bounds.
     const at=findLanding(),rider={radius:.24,height:1.78,collision:'aabb'},offset=body.radius+.40;
     const generatedClear=pos=>{
      const volume=planBodyVolume(pos,rider);
      return !!volume&&q.volume(pos,rider)==='clear'&&volume.cells.every(({x,y,z})=>read(x,y,z)!==undefined);
     };
     result[tag]=at!==null&&offset<=2&&generatedClear([at[0],at[1]+body.height,at[2]])&&
      [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>{
       const side=[at[0]+dx*offset,at[1],at[2]+dz*offset];
       if(!generatedClear(side)||!expansionSupport(q,side,rider,'ground'))return false;
       const bounds=planBodyVolume(side,rider).bounds,y=Math.floor(bounds[1]-.035);
       for(let x=Math.floor(bounds[0]+1e-5);x<=Math.floor(bounds[3]-1e-5);x++)
        for(let z=Math.floor(bounds[2]+1e-5);z<=Math.floor(bounds[5]-1e-5);z++)if(read(x,y,z)===undefined)return false;
       return q.lineOfSight([at[0],at[1]+body.height*.6,at[2]],[side[0],side[1]+rider.height*.5,side[2]])===true;
      });break;
    }
    case 'open-grass':{const at=findLanding();result[tag]=at!==null&&grassAt(at);break;}
    case 'large-clearance':result[tag]=q.volume(p,body)==='clear';break;
    case 'ceiling':result[tag]=support('ceiling');break;
    case 'submerged-space':result[tag]=support('water');break;
    case 'flight-clearance':result[tag]=support('air');break;
    case 'climb-site':result[tag]=support('climb-surface');break;
    case 'darkness':result[tag]=Number.isFinite(env.light)&&env.light<=.3;break;
    case 'crystal-floor':result[tag]=support('ground')&&materialFloor().every(id=>id===BLOCK.CRYSTAL);break;
    case 'rock':result[tag]=localMaterials().includes(undefined)?false:localMaterials().some(id=>rock.has(id));break;
    case 'rock-or-vegetation':result[tag]=!localMaterials().includes(undefined)&&localMaterials().some(id=>rock.has(id)||plants.has(id));break;
    case 'shallow-or-middle-cave':result[tag]=env.biome==='cave'&&p[1]>=-100&&p[1]<=-4;break;
    case 'middle-or-deep-cave':result[tag]=env.biome==='cave'&&p[1]<=-35;break;
    case 'deep-cave':result[tag]=env.biome==='cave'&&p[1]<=-80;break;
    case 'vertical-clearance':result[tag]=q.volume([p[0],p[1]-.25,p[2]],body)==='clear';break;
    case 'vegetation':result[tag]=localMaterials().includes(undefined)?false:localMaterials().some(id=>plants.has(id));break;
    case 'flowers':result[tag]=localMaterials().includes(undefined)?false:localMaterials().some(id=>blooms.has(id));break;
    default:result[tag]=false;
   }
  }
  if(![...touched.values()].every(cell=>q.residentAt(cell)===true)||!Object.is(view.revision(),revision)||!p.every((n,i)=>Object.is(n,point[i])))return null;
  return Object.freeze(result);
 }catch{return null;}
}
