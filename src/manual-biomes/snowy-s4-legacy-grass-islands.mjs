// DETACHED S4 ORIGINAL-M7 LEGACY GRASS ISLAND TOPOLOGY.
// Evidence only: never repairs grass, activates a generator, changes biome
// classes, or writes to world caves, edits, meshes or schema-1 saves.
// A closed sample is NOT proof of natural provenance or permission to erase
// preexisting groves. Chunk boundaries are measured using floor division.
import {inspectSnowS4Transect} from './snowy-s4-source-transect.mjs';

const LIMIT=128, CHUNK=16;
const DIR=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]].map(Object.freeze));
const GREEN='retained-legacy-grass', SNOW='authored-snow';
const BLOCKED=new Set(['protected-cave','edited-surface','protected-legacy']);
const good=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
const key=(x,z)=>x+','+z;
const freeze=Object.freeze;

/** Inventory bounded, ORIGINAL M7 retained grass separated by existing snow.
 * Every component intersecting a sample edge remains OPEN, even if it looks
 * rectangular. Protected cave/edit neighbors are observed, never overwritten.
 */
export function surveySnowS4LegacyGrassIslands(world,{x,z,width,height}={},deps={}){
  if(!good(x)||!good(z)||!Number.isInteger(width)||!Number.isInteger(height)||
    width<2||height<2||width>16||height>16||width*height>LIMIT||
    !good(x+width-1)||!good(z+height-1))
    throw new RangeError('S4 original legacy-grass survey must fit 2–128 source columns');
  if(typeof world?.save!=='function'||typeof world?._columnPlan!=='function'||
    typeof world?.environmentCaves?.get!=='function'||typeof world?.get!=='function')
    throw new TypeError('S4 original source and schema-1 save readers required');
  const columns=[];
  for(let dz=0;dz<height;dz++)for(let dx=0;dx<width;dx++)
    columns.push(freeze([x+dx,z+dz]));
  // Existing source inspection guards schema-1. An additional bounded witness
  // detects transient cave/column-plan changes with unchanged save data.
  // This is deliberately not a whole-world integrity hash.
  const witness=()=>JSON.stringify(columns.map(([cx,cz])=>{
    const plan=world._columnPlan(cx,cz);
    if(!(plan instanceof Map)||plan.size>256)
      throw new TypeError('S4 original column plan unavailable or over budget');
    const entries=[...plan.entries()].sort((a,b)=>a[0]-b[0]);
    return [cx,cz,entries,Array.from({length:19},(_,i)=>{
      const y=i+1,cave=world.environmentCaves.get(cx,y,cz);
      return cave===undefined?null:cave;
    })];
  }));
  const beforeSave=JSON.stringify(world.save()),before=witness();
  const evidence=inspectSnowS4Transect(world,columns,deps);
  if(JSON.stringify(world.save())!==beforeSave||witness()!==before)
    throw new Error('S4 original cave, column or save source changed during island survey');
  const byKey=new Map(evidence.rows.map(row=>[key(row.x,row.z),row]));
  const visited=new Set(),components=[];
  let greenCells=0,snowContactEdges=0,protectedNeighborEdges=0,
    unknownExteriorEdges=0,crossChunkComponents=0,closedComponents=0;
  for(const row of evidence.rows){
    if(row.status!==GREEN||visited.has(key(row.x,row.z)))continue;
    const queue=[row],cells=[];
    visited.add(key(row.x,row.z));
    let contact=0,protectedEdges=0,exterior=0;
    let minX=row.x,maxX=row.x,minZ=row.z,maxZ=row.z;
    const chunkOwners=new Set();
    for(let i=0;i<queue.length;i++){
      const current=queue[i];
      cells.push(freeze([current.x,current.z]));
      greenCells++;
      minX=Math.min(minX,current.x);maxX=Math.max(maxX,current.x);
      minZ=Math.min(minZ,current.z);maxZ=Math.max(maxZ,current.z);
      chunkOwners.add(Math.floor(current.x/CHUNK)+','+Math.floor(current.z/CHUNK));
      for(const [dx,dz] of DIR){
        const nx=current.x+dx,nz=current.z+dz,k=key(nx,nz);
        const other=byKey.get(k);
        if(!other){exterior++;continue;}
        if(other.status===GREEN){
          if(!visited.has(k)){visited.add(k);queue.push(other);}
        }else if(other.status===SNOW)contact++;
        else if(BLOCKED.has(other.status))protectedEdges++;
      }
    }
    const closed=exterior===0,crossesChunk=chunkOwners.size>1;
    closedComponents+=Number(closed);crossChunkComponents+=Number(crossesChunk);
    snowContactEdges+=contact;protectedNeighborEdges+=protectedEdges;
    unknownExteriorEdges+=exterior;
    cells.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
    components.push(freeze({
      id:'sample-grass-'+(components.length+1),cells:freeze(cells),
      cellCount:cells.length,bounds:freeze([minX,minZ,maxX,maxZ]),
      fillRatio:cells.length/((maxX-minX+1)*(maxZ-minZ+1)),
      snowContactEdges:contact,protectedNeighborEdges:protectedEdges,
      unknownExteriorEdges:exterior,closedWithinSample:closed,
      crossesOriginalChunkBoundary:crossesChunk,
      disposition:'retain-original-until-proven-safe'
    }));
  }
  return freeze({kind:'detached-S4-original-M7-legacy-grass-island-survey',
    sampled:evidence.sampled,rectangle:freeze([x,z,width,height]),
    greenCells,snowContactEdges,protectedNeighborEdges,
    unknownExteriorEdges,closedComponents,crossChunkComponents,
    components:freeze(components),
    state:'read-only-source-provenance-not-generator-approval',
    originalSaveUnchanged:true,sampledCaveAndPlanWitnessUnchanged:true,
    notLiveM7:true});
}
