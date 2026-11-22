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
  for(const [dx,dz] of shoulderSamples){
    const neighbor=v6BiomeAt(x+dx,z+dz,seed);
    if(!neighbor||neighbor.name===biome.name)continue;
    // Both sides of a special-biome seam share an actual continuous material.
    const pair=[biome.name,neighbor.name];
    if(pair.includes('mountain'))return G.scree;
    if(pair.includes('snow')&&pair.includes('enchanted'))return G.woodlandMoss;
    return 258;
  }
  return null;
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

// Phase 1: World-space deterministic alpine grass. No chunk coordinates,
// tree state, saved edits or runtime RNG enter the decision.
const mountainLattice=(x,z,seed)=>{
  let h=Math.imul((x|0)^seed,0x27d4eb2d)^Math.imul((z|0)+seed,0x165667b1);
  h^=h>>>15;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
  return (h>>>0)/4294967295;
};
function mountainCoherent(x,z,seed){
  const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);
  const p=mountainLattice(a,b,seed)*(1-u)+mountainLattice(a+1,b,seed)*u;
  const q=mountainLattice(a,b+1,seed)*(1-u)+mountainLattice(a+1,b+1,seed)*u;
  return p*(1-v)+q*v;
}
function mountainAlpineMeadow(x,z,seed,top,biome,readBaseline){
  if(biome.name!=='mountain'||biome.weight<.92||top<5||top>11)return false;
  const patch=.8*mountainCoherent(x/64,z/64,seed+7103)+
    .2*mountainCoherent(x/20,z/20,seed+7139);
  if(patch<.54)return false;
  // A second independently seeded, world-space exposure field breaks up
  // unusually broad lower meadows into naturally connected stone pockets.
  // Keep mineable rock exposed even on gentle slopes without adding blocks,
  // tree-relative grids, cave edits, or terrain-height modifications.
  if(mountainCoherent(x/11,z/11,seed+30001)<.56)return false;
  const phase=(seed%223)*.19;
  // Neighbor prediction uses only height/biome math, not four recursive
  // full column plans. Keep the extra baseline probes bounded and cave-safe.
  for(const [dx,dz] of [[2,0],[-2,0],[0,2],[0,-2]]){
    const nx=x+dx,nz=z+dz,neighbor=v6BiomeAt(nx,nz,seed);
    if(neighbor?.name!=='mountain'||neighbor.weight<.90)return false;
    const old=terrainHeight(nx,nz,seed);
    const blend=smooth(clamp((neighbor.weight-.35)/.65));
    const height=Math.max(old,mountainRelief(nx,nz,phase));
    const nearbyTop=Math.min(WORLD_MAX_Y-2,Math.round(old+(height-old)*blend));
    if(Math.abs(nearbyTop-top)>1||readBaseline(nx,old,nz)!==BLOCK.GRASS)
      return false;
  }
  return true;
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
    if(y>old?prior!==BLOCK.AIR:![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior)){
      // Mountain-only, material-only rescue for legacy grass exposed when
      // existing trees/landmarks ABOVE the old surface veto full uplift.
      // Do not raise this column, replace its protected content, or seal
      // cave/opening supports. Keep the complete original veto envelope.
      if(biome.name==='mountain'&&y>old&&blend>=.065&&
        readBaseline(x,old,z)===BLOCK.GRASS&&
        [BLOCK.DIRT,BLOCK.STONE].includes(readBaseline(x,old-1,z))){
        const shoulder=sharedShoulder(biome,x,z,seed);
        const safeCap=shoulder??groundAt('mountain',x,z,seed,old,0).cap;
        return new Map([[old,safeCap]]);
      }
      return new Map();
    }
  }
  const writes=new Map(),shoulder=sharedShoulder(biome,x,z,seed);
  // The shoulder replaces the grass in a broad contiguous band. The
  // natural wood and cave checks above remain authoritative.
  if(blend<.065&&shoulder===null)return writes;
  const {cap,subsoil,rock}=groundAt(biome.name,x,z,seed,top,outcrop);
  const meadow=shoulder===null&&biome.name==='mountain'&&
    mountainAlpineMeadow(x,z,seed,top,biome,readBaseline);
  for(let y=old-1;y<=top;y++)
    writes.set(y,y===top?(meadow?BLOCK.GRASS:(shoulder??cap)):
      y>=top-2?(meadow?BLOCK.DIRT:subsoil):rock);
  return writes;
}

export function keepLegacyGroveTree(seed,plan){
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
      if(tree.some(([a,b,c])=>b>WORLD_MAX_Y||readCell(a,b,c)!==BLOCK.AIR))continue;
      for(const [a,b,c,id] of tree)
        if(a>=minX&&a<=maxX&&c>=minZ&&c<=maxZ)cells.set(a+','+b+','+c,id);
    }
  return cells;
}
