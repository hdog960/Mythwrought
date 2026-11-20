import {terrainHeight,BLOCK} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';

const smooth=value=>value*value*(3-2*value);
const clamp=value=>Math.max(0,Math.min(1,value));
const undulation=(angle)=>.5+.5*Math.sin(angle);

function groundAt(name,x,z,seed,top){
  const phase=(seed%223)*.19;
  const band=undulation(x*.043+z*.028+phase+Math.sin(z*.026)*.63);
  const patch=undulation(x*.023-z*.028-phase+Math.sin(x*.032)*.84);
  if(name==='desert')return {
    cap:band>.74?257:patch<.12?259:256,subsoil:258,rock:261
  };
  if(name==='snow')return {
    cap:patch<.10?276:band>.92?279:272,subsoil:278,rock:279
  };
  if(name==='mountain')return {
    cap:top>=15&&patch>.69?272:band>.72?G.gneiss:patch<.36?G.scree:G.slate,
    subsoil:G.slate,rock:BLOCK.STONE
  };
  return {
    cap:band>.79?G.woodlandMoss:patch<.25?G.woodlandPeat:G.woodlandLoam,
    subsoil:G.woodlandPeat,rock:BLOCK.STONE
  };
}

export function planEnvironmentalColumn(x,z,seed,readBaseline){
  const biome=v6BiomeAt(x,z,seed);
  if(!biome)return new Map();
  const old=terrainHeight(x,z,seed);
  // Coarse terrain changes smoothly over shoulders. Each column stays
  // attached to the original rock and protected cave or landmark envelope.
  const blend=smooth(clamp((biome.weight-.35)/.65));
  const phase=(seed%223)*.19;
  const wind=undulation(x*.06+z*.022+phase+Math.sin(z*.025)*.75);
  const fold=undulation(x*.034-z*.044+phase+Math.sin(x*.021)*1.3);
  const height=biome.name==='desert'?old+3.5*wind:
    biome.name==='snow'?old+2.6*fold:
    biome.name==='mountain'?Math.max(old,6+11*Math.pow(fold,1.7)+wind*2):
    old+2.1*wind;
  const top=Math.min(WORLD_MAX_Y-2,Math.round(old+(height-old)*blend));
  for(let y=old-2;y<=WORLD_MAX_Y;y++){
    const prior=readBaseline(x,y,z);
    if(y>old?prior!==BLOCK.AIR:![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior))return new Map();
  }
  const writes=new Map();
  // The shoulder replaces the grass in a broad contiguous band. The
  // natural wood and cave checks above remain authoritative.
  if(blend<.065)return writes;
  const {cap,subsoil,rock}=groundAt(biome.name,x,z,seed,top);
  for(let y=old-1;y<=top;y++)
    writes.set(y,y===top?cap:y>=top-2?subsoil:rock);
  return writes;
}
