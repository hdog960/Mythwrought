// Mountain V8 isolated physical-cell proposal. NOT connected to world.set,
// meshing, original V7 vegetation, saves, or runtime. No side effects.
// Requires source-confirmed V8 meadow and original pre-uplift AIR provenance.
export const MOUNTAIN_V8_PLANT_CELL_LIMIT=18;
const valid=n=>Number.isSafeInteger(n);
const pattern=Object.freeze({
  'alpine-flower':Object.freeze([[0,1,0,'flower'],[0,2,0,'flower-petal']]),
  'low-heather':Object.freeze([[0,1,0,'heather'],[0,2,0,'heather-tip']]),
  'dwarf-conifer':Object.freeze([
    [0,1,0,'conifer-trunk'],[0,2,0,'conifer-trunk'],
    [0,3,0,'conifer-trunk'],[0,4,0,'conifer-needles'],
    [1,2,0,'conifer-needles'],[-1,2,0,'conifer-needles'],
    [0,2,1,'conifer-needles'],[0,2,-1,'conifer-needles'],
    [1,3,0,'conifer-needles'],[-1,3,0,'conifer-needles'],
    [0,3,1,'conifer-needles'],[0,3,-1,'conifer-needles'],
    [0,5,0,'conifer-needles']
  ])
});

/** Pure bounded candidate, not a voxel writer.
 * The original world before uplift must be AIR in every occupied cell.
 * Vegetation may only appear at the selected sparse site on verified gentle
 * alpine-grass, and its entire 3x3 volume must remain in the mountain biome.
 * No terrain/block IDs are invented: material strings require separate owner
 * mapping when a distinctly versioned V8 world is approved.
 */
export function planMountainV8PlantCells(proposal,{
  worldMaxY=19,airId=0,readOriginalBlock,protectedAt=()=>false,
  mountainAt=()=>false,proposedSurfaceAt
}={}){
  if(!proposal||proposal.safeToIntegrate!==false||
     proposal.generatorIdentityRequired!=='v8-new-opt-in'||
     proposal.cap!=='alpine-grass'||proposal.snowy||proposal.cliff||
     !(proposal.slope<.35)||!proposal.vegetation||
     !proposal.vegetationSite?.chosen||
     ![proposal.x,proposal.z,proposal.top,worldMaxY,airId].every(valid)||
     typeof readOriginalBlock!=='function'||typeof protectedAt!=='function'||
     typeof mountainAt!=='function'||
     typeof proposedSurfaceAt!=='function')return null;
  const pieces=pattern[proposal.vegetation];
  if(!pieces||pieces.length>MOUNTAIN_V8_PLANT_CELL_LIMIT)return null;
  const cells=[],seen=new Set();
  for(const [dx,dy,dz,material] of pieces){
    const x=proposal.x+dx,y=proposal.top+dy,z=proposal.z+dz;
    const key=x+','+y+','+z;
    const proposedTop=proposedSurfaceAt(x,z);
    if(!valid(proposedTop)||y<=proposedTop||
       y>worldMaxY||seen.has(key)||!mountainAt(x,z)||
       protectedAt(x,y,z)||readOriginalBlock(x,y,z)!==airId)return null;
    seen.add(key);
    cells.push(Object.freeze({x,y,z,material}));
  }
  return Object.freeze({site:Object.freeze([proposal.x,proposal.top,proposal.z]),
    kind:proposal.vegetation,cells:Object.freeze(cells),
    estimatedCells:cells.length,safeToIntegrate:false,
    needsApprovedV8MaterialRegistry:true});
}
