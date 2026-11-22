import {terrainHeight,BLOCK} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {buildEnchantedTreeCandidate,ENCHANTED_TREE_MAX_RADIUS} from './enchanted-tree-candidates.mjs';
import {enchantedTreeFootingsSupported} from './enchanted-tree-footings.mjs';
import {resolveEnchantedTreeOverlap} from './enchanted-tree-overlap.mjs';
import {clearEnchantedCanopyForWalking} from './enchanted-tree-walking-clearance.mjs';
import {EnchantedCandidateSourceCache,
  ENCHANTED_CANDIDATE_SOURCE_CACHE_MAX_ENTRIES as MAX_SOURCE_CACHE,
  ENCHANTED_CANDIDATE_SOURCE_CACHE_DEFAULT_ENTRIES as DEFAULT_SOURCE_CACHE}
  from './enchanted-tree-source-cache.mjs';
import {EnchantedSiteBiomeCache} from './enchanted-tree-site-biome-cache.mjs';

const smooth=value=>value*value*(3-2*value);
const clamp=value=>Math.max(0,Math.min(1,value));
const undulation=(angle)=>.5+.5*Math.sin(angle);
const shoulderSamples=[[14,0],[-14,0],[0,14],[0,-14]];
// The source's largest possible tree admission threshold is Enchanted:
// .52 + undulation(...)*.34, where undulation is bounded to [0,1].
// Use the ORIGINAL JavaScript arithmetic expression for the maximum:
// literal .86 is one representable float below (.52+.34) in JS, so the
// exact cutoff MUST be (.52+.34) to avoid any rounding-boundary ambiguity.
// In explicit experimental generation only, a roll at or above the
// computed maximum cannot plant any tree in any V6 biome.
// Do NOT apply this early filter to historical/default M7.
export const ENCHANTED_TREE_MAX_DENSITY_THRESHOLD=.52+.34;

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

function groundAt(name,x,z,seed,top,outcrop,biomeWeight=1){
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
  // Moonlit moss is a deliberately green-gray enchanted material. The old
  // single slow-varying band generated an almost unbroken moss carpet near
  // seed 7919's genuine landmark camera (551/729 ground samples, 75.58%).
  // Break those bands into organic smaller pockets without changing the
  // physical terrain, protected caves, other biomes, or blended shoulders.
  const mossWisp=undulation(x*.17-z*.11+phase*.43+
    1.4*Math.sin(z*.11)+.7*Math.sin(x*.075));
  const mossPulse=undulation(x*.103+z*.137-phase*.27+
    .8*Math.sin(x*.067+z*.045));
  const mossPocket=.64*mossWisp+.36*mossPulse;
  return {
    cap:band>.79&&(biomeWeight<.70||mossPocket>.66)?G.woodlandMoss:
      patch<.25?G.woodlandPeat:G.woodlandLoam,
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
  // An original landmark can occupy AIR above the old grass. Do not raise
  // terrain into its stone/ore/wood, but allow the *unchanged* grass footprint
  // to receive enchanted soil instead of leaving a bright plains patch.
  // Other biomes, old profiles, underground caves and protected cap cells
  // retain the original fail-closed terrain behavior.
  let occupiedAbove=false,openBelow=false;
  for(let y=old-2;y<=WORLD_MAX_Y;y++){
    const prior=readBaseline(x,y,z);
    if(y>old&&prior!==BLOCK.AIR){
      if(biome.name!=='enchanted'||biome.weight<.70)return new Map();
      occupiedAbove=true;
    }else if(y<=old&&![BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE].includes(prior)){
      // An existing cave/gallery can already remove the DIRT just beneath
      // untouched surface GRASS (measured in 7-seed audit 44951588596).
      // Never fill its AIR or replace protected rock/ore. Only the existing
      // grass cap may change material, and only inside enchanted interiors.
      if(y===old||prior!==BLOCK.AIR||
        biome.name!=='enchanted'||biome.weight<.70)return new Map();
      openBelow=true;
    }
  }
  if(occupiedAbove||openBelow){
    if(readBaseline(x,old,z)!==BLOCK.GRASS)return new Map();
    // Cap only: preserve ALL original air, landmark cells and subsoil.
    // This cannot create a new ceiling, fill a cave, or change terrain height.
    return new Map([[old,groundAt('enchanted',x,z,seed,old,0).cap]]);
  }
  const writes=new Map(),shoulder=sharedShoulder(biome,x,z,seed);
  // The shoulder replaces the grass in a broad contiguous band. The
  // natural wood and cave checks above remain authoritative.
  if(blend<.065&&shoulder===null)return writes;
  const {cap,subsoil,rock}=groundAt(biome.name,x,z,seed,top,outcrop,biome.weight);
  for(let y=old-1;y<=top;y++)
    writes.set(y,y===top?(shoulder??cap):y>=top-2?subsoil:rock);
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

export function environmentalTreesForChunk(cx,cz,seed,readColumn,readCell,
  {experimentalEnchantedTrees=false,onCandidateCacheSummary=null,
    onCandidateSiteSummary=null,disableCandidateSiteCulling=false,
    disableCandidateDensityCulling=false,
    candidateSiteBiomeCache=null,
    candidateSourceCacheCapacity=DEFAULT_SOURCE_CACHE}={}){
  // This capacity parameter is for isolated source-memory experiments;
  // ordinary candidate runtime always uses its fixed reviewed default.
  if(!Number.isInteger(candidateSourceCacheCapacity)||
     candidateSourceCacheCapacity<1||candidateSourceCacheCapacity>MAX_SOURCE_CACHE)
    throw Error('Invalid enchanted candidate source cache capacity');
  if(onCandidateCacheSummary!==null&&
     typeof onCandidateCacheSummary!=='function')
    throw Error('Invalid enchanted cache diagnostics callback');
  if(onCandidateSiteSummary!==null&&
     typeof onCandidateSiteSummary!=='function')
    throw Error('Invalid enchanted site diagnostics callback');
  // Test-only read-only control to compare this fast path against the
  // previous exact source's unculled planner within the same live M7 world.
  if(typeof disableCandidateSiteCulling!=='boolean')
    throw Error('Invalid enchanted source site culling comparison flag');
  if(typeof disableCandidateDensityCulling!=='boolean')
    throw Error('Invalid enchanted density culling comparison flag');
  if(candidateSiteBiomeCache!==null&&(
    !experimentalEnchantedTrees||
    !(candidateSiteBiomeCache instanceof EnchantedSiteBiomeCache)))
    throw Error('Invalid experimental Enchanted site biome cache');
  const minX=cx*16,minZ=cz*16,maxX=minX+15,maxZ=minZ+15;
  const cells=new Map();
  // Lazily created only when an experimental enchanted tree is present.
  // All proposals within this one chunk read the same immutable original M7
  // terrain/cave baseline, so reusing exact source probes is safe. Never
  // persist this short-lived cache or use it for other biome generations.
  let candidateClearanceCache=null;
  // Native acceptance can account for actual cache reuse at dense sites.
  // Normal gameplay never supplies the diagnostic callback, so no per-cell
  // statistics are updated on the iPhone production path.
  let diagnosticHits=0,diagnosticMisses=0;
  let sampledSites=0,geometricallyCulledSites=0,
    densityCulledSites=0,biomeLookupSites=0;
  // The same original source cell can be read for rooting, collision
  // preflight, and 3x3 headroom across several nearby prototype trees.
  // A fresh chunk-scoped cache prevents repeated cave/landmark/terrain
  // lookups. No cache exists for the historical M7 tree path.
  const candidateReadCell=(x,y,z)=>{
    candidateClearanceCache??=new EnchantedCandidateSourceCache(candidateSourceCacheCapacity);
    const key=x+','+y+','+z;
    if(!candidateClearanceCache.has(key)){
      if(onCandidateCacheSummary)diagnosticMisses++;
      candidateClearanceCache.set(key,readCell(x,y,z));
    }else if(onCandidateCacheSummary)diagnosticHits++;
    return candidateClearanceCache.get(key);
  };
  // The *default* M7 path keeps its exact historical +/-3 site sampling.
  // Explicit Phase 2 prototypes need a +/-4 crown halo; sites outside the
  // original envelope may add ONLY Enchanted candidate voxels, never conifers.
  const oldTxMin=Math.floor((minX-3)/8),oldTxMax=Math.floor((maxX+3)/8);
  const oldTzMin=Math.floor((minZ-3)/8),oldTzMax=Math.floor((maxZ+3)/8);
  const radius=experimentalEnchantedTrees?ENCHANTED_TREE_MAX_RADIUS+1:3;
  for(let tx=Math.floor((minX-radius)/8);tx<=Math.floor((maxX+radius)/8);tx++)
    for(let tz=Math.floor((minZ-radius)/8);tz<=Math.floor((maxZ+radius)/8);tz++){
      if(onCandidateSiteSummary)sampledSites++;
      const roll=treeRoll(tx,tz,seed);
      const x=tx*8+2+Math.floor(treeRoll(tx,tz,seed+51)*4);
      const z=tz*8+2+Math.floor(treeRoll(tx,tz,seed+89)*4);
      // A source site outside the candidate's genuine +/-4 voxel envelope
      // cannot write to this chunk, even when its crown is regenerated as
      // a seam halo. Cull before the costly biome and original terrain
      // readers. This path is NEVER entered by historical/default M7.
      // Non-enchanted original conifer/wood trees are smaller than this
      // envelope, so no original neighbor can be lost by this check.
      if(experimentalEnchantedTrees&&!disableCandidateSiteCulling&&(
        x+ENCHANTED_TREE_MAX_RADIUS<minX||
        x-ENCHANTED_TREE_MAX_RADIUS>maxX||
        z+ENCHANTED_TREE_MAX_RADIUS<minZ||
        z-ENCHANTED_TREE_MAX_RADIUS>maxZ)){
        if(onCandidateSiteSummary)geometricallyCulledSites++;
        continue;
      }
      // Site admission is impossible at or above the maximum threshold
      // regardless of the warped biome. Density/shape/style rolls remain
      // bit-for-bit unchanged; this simply avoids a guaranteed rejection.
      if(experimentalEnchantedTrees&&!disableCandidateDensityCulling&&
         roll>=ENCHANTED_TREE_MAX_DENSITY_THRESHOLD){
        if(onCandidateSiteSummary)densityCulledSites++;
        continue;
      }
      if(onCandidateSiteSummary)biomeLookupSites++;
      // Immutable V6 name/weight is independent of caves, terrain and edits.
      // Share ONLY that classification between adjacent experimental chunks.
      // Every grounding, AIR, cave, landmark and collision read below stays
      // freshly sourced per plan. Historical M7 uses its original direct path.
      const biome=candidateSiteBiomeCache?
        candidateSiteBiomeCache.getOrRead(x,z,seed,v6BiomeAt):
        v6BiomeAt(x,z,seed);
      if(!biome||biome.weight<.65||biome.name==='desert')continue;
      const candidate=experimentalEnchantedTrees&&biome.name==='enchanted';
      if(!candidate&&(tx<oldTxMin||tx>oldTxMax||tz<oldTzMin||tz>oldTzMax))
        continue;
      const canopy=undulation(x*.051+z*.037+Math.sin(z*.031));
      const threshold=biome.name==='enchanted'?.52+canopy*.34:biome.name==='snow'?.52:.13;
      if(roll>=threshold)continue;
      const column=readColumn(x,z);
      if(!column.size)continue;
      const floor=Math.max(...column.keys());
      const readNatural=candidate?candidateReadCell:readCell;
      const root=readNatural(x,floor,z);
      const grounded=root===column.get(floor)&&readNatural(x,floor-1,z)!==BLOCK.AIR;
      if(!grounded)continue;
      let tree;
      if(candidate){
        // Deterministic species choice independent of the legacy density roll.
        const shaped=buildEnchantedTreeCandidate(x,floor,z,treeRoll(tx,tz,seed+151));
        if(!shaped)continue;
        // Historical one-root Starspire/Moonwillow checks stay untouched.
        // For the 2x2 Ancient Giant, every corner must be a genuine M7
        // surface cap with physical subsoil, not a cave void or landmark roof.
        // The same world readers work across 16-block chunk boundaries.
        if(shaped.footprint.length>1){
          if(!enchantedTreeFootingsSupported(x,floor,z,shaped.footprint,
            readColumn,readNatural,BLOCK.AIR))continue;
        }else if(shaped.footprint.some(([dx,dz])=>
          readNatural(x+dx,floor,z+dz)===BLOCK.AIR||
          readNatural(x+dx,floor+1,z+dz)!==BLOCK.AIR))continue;
        tree=shaped.cells;
      }else{
        if(floor>WORLD_MAX_Y-5)continue;
        tree=treeVoxels(biome.name,x,floor,z,roll);
      }
      if(tree.some(([a,b,c])=>b>WORLD_MAX_Y||readNatural(a,b,c)!==BLOCK.AIR))continue;
      // The game treats moonleaf/aetherleaf as true solid cubes. Real
      // player height is 1.78: leave both voxels immediately above nearby
      // M7 ground unobstructed, without changing mineable bark or terrain.
      // Only experimental candidates use this additional headroom filter.
      if(candidate){
        candidateClearanceCache??=new EnchantedCandidateSourceCache(candidateSourceCacheCapacity);
        tree=clearEnchantedCanopyForWalking(tree,candidateReadCell,BLOCK.AIR,
          candidateClearanceCache);
      }
      for(const [a,b,c,id] of tree)if(a>=minX&&a<=maxX&&c>=minZ&&c<=maxZ){
        const key=a+','+b+','+c;
        // The old M7 path and non-enchanted trees retain exactly their
        // historical write order. Only overlapping experimental Enchanted
        // crowns use order-independent ownership: physical bark always
        // survives incoming leaves, even across neighboring chunk rebuilds.
        // Most cells are unique. Avoid ranking or allocating anything
        // until an actual candidate overlap exists (cheap iPhone fast path).
        const previous=candidate?cells.get(key):undefined;
        cells.set(key,previous===undefined?id:
          resolveEnchantedTreeOverlap(previous,id));
      }
    }
  if(onCandidateSiteSummary){
    onCandidateSiteSummary(Object.freeze({
      sampledSites,geometricallyCulledSites,densityCulledSites,
      biomeLookupSites,experimental:experimentalEnchantedTrees
    }));
  }
  if(onCandidateCacheSummary){
    onCandidateCacheSummary(Object.freeze({
      entries:candidateClearanceCache?.size??0,
      peakEntries:candidateClearanceCache?.peakEntries??0,
      evictions:candidateClearanceCache?.evictions??0,
      limit:candidateClearanceCache?.limit??0,
      hits:diagnosticHits,
      misses:diagnosticMisses
    }));
  }
  return cells;
}
