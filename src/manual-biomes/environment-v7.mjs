import {terrainHeight,BLOCK} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';

const smooth=value=>value*value*(3-2*value);
const clamp=value=>Math.max(0,Math.min(1,value));
const undulation=(angle)=>.5+.5*Math.sin(angle);
const shoulderSamples=[[14,0],[-14,0],[0,14],[0,-14]];

function sharedShoulder(biome,x,z,seed){
  if(biome.weight>.50)return null;
  let touchesPlains=false,hasOtherSpecial=false;
  for(const [dx,dz] of shoulderSamples){
    const neighbor=v6BiomeAt(x+dx,z+dz,seed);
    // Real V6 Plains is null, not a named biome. Preserve its dry Desert
    // fringe and the original non-Desert neighbor policy.
    if(!neighbor){touchesPlains=true;continue;}
    if(neighbor.name===biome.name)continue;
    // At an authentic three-way Desert/Snow(or Enchanted)/Mountain junction,
    // the old early return chose hardpan before it reached a later Mountain.
    // Check all four ORIGINAL offsets on Desert only: mountain scree wins
    // regardless of offset order, without touching other biome generation.
    if(biome.name==='desert'){
      if(neighbor.name==='mountain')return G.scree;
      hasOtherSpecial=true;
      continue;
    }
    // Preserve original ordering and material behavior outside the Desert.
    const pair=[biome.name,neighbor.name];
    if(pair.includes('mountain'))return G.scree;
    if(pair.includes('snow')&&pair.includes('enchanted'))return G.woodlandMoss;
    return 258;
  }
  if(biome.name==='desert'&&hasOtherSpecial)return 258;
  return biome.name==='desert'&&touchesPlains?'desert-plains':null;
}

function desertOutcrop(x,z,phase){
  const bed=undulation(x*.015+z*.024+phase);
  if(bed<.88)return 0;
  const stone=undulation(x*.113-z*.083+Math.sin(z*.062)*1.6-phase);
  return smooth(clamp((stone-.75)/.25))*smooth(clamp((bed-.88)/.12));
}

function mountainRelief(x,z,phase){
  const spine=x*.023+z*.037+phase+1.5*Math.sin(z*.017);
  const ribs=x*.059-z*.037-phase+Math.sin(x*.013);
  const crest=(1-Math.abs(Math.sin(spine)))**1.55;
  const buttress=undulation(ribs)**2.4;
  return 5.1+11.2*crest+3.5*buttress;
}

function groundAt(name,x,z,seed,top,outcrop){
  const phase=(seed%223)*.19;
  const band=undulation(x*.043+z*.028+phase+Math.sin(z*.026)*.63);
  const patch=undulation(x*.023-z*.028-phase+Math.sin(x*.032)*.84);
  if(name==='desert')return {
    cap:outcrop>.45?261:band>.74?257:patch<.12?259:256,
    subsoil:outcrop>.26?261:258,rock:261
  };
  if(name==='snow')return {
    cap:patch<.10?276:band>.92?279:272,subsoil:278,rock:279
  };
  if(name==='mountain')return {
    cap:top>=15&&patch>.52?272:band>.72?G.gneiss:patch<.36?G.scree:G.slate,
    subsoil:band>.66?G.gneiss:G.slate,rock:BLOCK.STONE
  };
  return {
    cap:band>.79?G.woodlandMoss:patch<.25?G.woodlandPeat:G.woodlandLoam,
    subsoil:G.woodlandPeat,rock:BLOCK.STONE
  };
}

export function planEnvironmentalColumn(x,z,seed,readBaseline,biome=v6BiomeAt(x,z,seed)){
  if(!biome)return new Map();
  const old=terrainHeight(x,z,seed);
  // Coarse terrain changes smoothly over shoulders. Each column stays
  // attached to the original rock and protected cave or landmark envelope.
  const blend=smooth(clamp((biome.weight-.35)/.65));
  const phase=(seed%223)*.19;
  const wind=undulation(x*.06+z*.022+phase+Math.sin(z*.025)*.75);
  const fold=undulation(x*.034-z*.044+phase+Math.sin(x*.021)*1.3);
  const outcrop=biome.name==='desert'?desertOutcrop(x,z,phase):0;
  const height=biome.name==='desert'?old+3.5*wind+4*outcrop:
    biome.name==='snow'?old+2.6*fold:
    biome.name==='mountain'?Math.max(old,mountainRelief(x,z,phase)):
    old+2.1*wind;
  const top=Math.min(WORLD_MAX_Y-2,Math.round(old+(height-old)*blend));
  for(let y=old-2;y<=WORLD_MAX_Y;y++){
    const prior=readBaseline(x,y,z);
    if(y>old?prior!==BLOCK.AIR:![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior))return new Map();
  }
  const writes=new Map(),shoulder=sharedShoulder(biome,x,z,seed);
  // The shoulder replaces the grass in a broad contiguous band. The
  // natural wood and cave checks above remain authoritative.
  // A Desert-classified column must never retain legacy green grass merely
  // because it is at the outermost, low-weight edge of the biome. Keep the
  // original terrain height and protected-geometry vetoes; use dry materials
  // at that height, while other biomes preserve their existing feathering.
  if(blend<.065&&shoulder===null&&biome.name!=='desert')return writes;
  const {cap,subsoil,rock}=groundAt(biome.name,x,z,seed,top,outcrop);
  // Keep the true red/pale dune caps at the Desert/Plains seam. Only the
  // conspicuous WHITE salt-crust cap is replaced by earthy hardpan; an
  // unconditional sand strip would lose the original red mesa variation.
  const surfaceCap=shoulder==='desert-plains'?(cap===259?258:cap):(shoulder??cap);
  for(let y=old-1;y<=top;y++)
    writes.set(y,y===top?surfaceCap:y>=top-2?subsoil:rock);
  return writes;
}

// A tree is forbidden if ANY of its naturally authored footprint occupies
// Desert, including a canopy reaching across from Plains. This is a V7-only
// generation policy: previously saved/older-profile worlds are untouched.
export function naturalTreeTouchesDesert(seed,cells,origin=null){
  if(origin&&v6BiomeAt(origin[0],origin[2],seed)?.name==='desert')return true;
  const checked=new Set();
  for(const [x,,z] of cells){
    const column=x+','+z;
    if(checked.has(column))continue;
    checked.add(column);
    if(v6BiomeAt(x,z,seed)?.name==='desert')return true;
  }
  return false;
}

export function keepLegacyGroveTree(seed,plan){
  if(naturalTreeTouchesDesert(seed,plan.cells,plan.origin))return false;
  const [x,,z]=plan.origin;
  const climate=v6BiomeAt(x,z,seed);
  return !climate||climate.weight<.56;
}

function treeRoll(x,z,seed){
  let n=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^(seed|0);
  n=Math.imul(n^(n>>>16),0x45d9f3b);
  return ((n^(n>>>16))>>>0)/4294967296;
}

function treeVoxels(climate,x,y,z,roll){
  const cells=[];
  const put=(dx,dy,dz,id)=>cells.push([x+dx,y+dy,z+dz,id]);
  if(climate==='enchanted'){
    const bend=roll<.5?-1:1;
    const height=roll<.25?5:6;
    for(let dy=1;dy<=height;dy++)put(dy>=4?bend:0,dy,0,G.aetherBark);
    put(bend,3,0,G.aetherBark);
    put(-bend,4,0,G.aetherBark);
    for(let dy=height-1;dy<=height+1;dy++){
      const radius=dy===height?2:1;
      for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
        if(Math.abs(dx)+Math.abs(dz)>radius+1||dx===0&&dz===0&&dy<=height)continue;
        put(bend+dx,dy,dz,roll<.36?G.moonLeaves:G.aetherLeaves);
      }
    }
    return cells;
  }
  const height=roll<.26?4:5;
  for(let dy=1;dy<=height;dy++)put(0,dy,0,BLOCK.WOOD);
  for(let dy=2;dy<=height+1;dy++){
    const radius=dy===2?2:dy<=height?1:0;
    for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
      if(Math.abs(dx)+Math.abs(dz)>radius+1||dx===0&&dz===0&&dy<=height)continue;
      put(dx,dy,dz,climate==='snow'&&dy>=height-1?G.snowyNeedles:G.coldNeedles);
    }
  }
  return cells;
}

export function environmentalTreesForChunk(cx,cz,seed,readColumn,readCell){
  const minX=cx*16,minZ=cz*16,maxX=minX+15,maxZ=minZ+15;
  const cells=new Map();
  // Each eight-block site can extend three blocks from its stem. Sample
  // neighboring sites on every chunk build and keep only this chunk's part.
  for(let tx=Math.floor((minX-3)/8);tx<=Math.floor((maxX+3)/8);tx++)
    for(let tz=Math.floor((minZ-3)/8);tz<=Math.floor((maxZ+3)/8);tz++){
      const roll=treeRoll(tx,tz,seed);
      const x=tx*8+2+Math.floor(treeRoll(tx,tz,seed+51)*4);
      const z=tz*8+2+Math.floor(treeRoll(tx,tz,seed+89)*4);
      const biome=v6BiomeAt(x,z,seed);
      if(!biome||biome.weight<.65||biome.name==='desert')continue;
      const canopy=undulation(x*.051+z*.037+Math.sin(z*.031));
      const threshold=biome.name==='enchanted'?.52+canopy*.34:biome.name==='snow'?.52:.13;
      if(roll>=threshold)continue;
      const column=readColumn(x,z);
      if(!column.size)continue;
      const floor=Math.max(...column.keys());
      const root=readCell(x,floor,z);
      const grounded=root===column.get(floor)&&readCell(x,floor-1,z)!==BLOCK.AIR;
      if(!grounded||floor>WORLD_MAX_Y-5)continue;
      const tree=treeVoxels(biome.name,x,floor,z,roll);
      // Reject the whole candidate in every chunk, not just Desert-side leaves.
      // Cross-chunk sites use the same world coordinates and decision.
      if(naturalTreeTouchesDesert(seed,tree,[x,floor,z]))continue;
      if(tree.some(([a,b,c])=>b>WORLD_MAX_Y||readCell(a,b,c)!==BLOCK.AIR))continue;
      for(const [a,b,c,id] of tree)
        if(a>=minX&&a<=maxX&&c>=minZ&&c<=maxZ)cells.set(a+','+b+','+c,id);
    }
  return cells;
}
