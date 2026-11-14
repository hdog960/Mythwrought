// Physical, full-cube construction primitives for the :36 landmark lane.
// No world writes: consumers decide placement and MUST respect existing edits.
// Existing stable IDs only. No new block registry entries or save migration.
import {BLOCK,WORLD_MIN_Y,WORLD_MAX_Y} from './voxel.mjs';

export const CONSTRUCTION_IDS=Object.freeze({
  masonry:BLOCK.STONE, timber:BLOCK.WOOD, inset:BLOCK.CRYSTAL
});
export const CONSTRUCTION_CONTRACT=Object.freeze({
  kind:'full-voxel', orientation:'axis-aligned', renderTagFromBlockId:true,
  collision:'existing-solid-block', saveSchema:1, newBlockIds:0,
  // Optional overlays such as render-only trim 17 are NOT physical blocks.
  decorativeTagsAreNotPlaceable:true
});
const integer=(n)=>Number.isSafeInteger(n);
function dimensions(n,min,max,label){
  if(!integer(n)||n<min||n>max)throw new RangeError(label+' outside construction limits');
  return n;
}
function origin(o){
  if(!Array.isArray(o)||o.length!==3||!o.every(integer))throw new TypeError('Expected integer [x,y,z] origin');
  return o;
}
function emit(cells,seen,x,y,z,id){
  if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)throw new RangeError('Construction exceeds world vertical bounds');
  const key=x+','+y+','+z;
  if(seen.has(key))throw new Error('Overlapping construction cells');
  seen.add(key);cells.push(Object.freeze([x,y,z,id]));
}
function finish(cells){return Object.freeze(cells);}

// Solid freestanding column with a wider square capital and base.
// Width 1 or 3; the larger size is appropriate for ruined castle gateways.
export function stoneColumn(at,{height=5,width=1,cap=true}={}){
  const [ox,oy,oz]=origin(at);
  dimensions(height,2,16,'height');
  if(width!==1&&width!==3)throw new RangeError('width must be 1 or 3');
  const cells=[],seen=new Set(),radius=(width-1)/2;
  for(let y=0;y<height;y++){
    const r=(cap&&(y===0||y===height-1))?radius+1:radius;
    for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++)
      emit(cells,seen,ox+x,oy+y,oz+z,BLOCK.STONE);
  }
  return finish(cells);
}

// A genuinely hollow, walk-through stone gateway. The opening is AIR by
// omission, not by destructive AIR edits. Supports east-west or north-south.
export function stoneGateway(at,{span=5,height=6,depth=2,axis='x'}={}){
  const [ox,oy,oz]=origin(at);
  dimensions(span,3,13,'span');dimensions(height,4,16,'height');
  dimensions(depth,1,3,'depth');
  if(axis!=='x'&&axis!=='z')throw new RangeError('axis must be x or z');
  const cells=[],seen=new Set();
  const left=0,right=span-1,lintel=height-1;
  for(let s=0;s<span;s++)for(let d=0;d<depth;d++){
    const edge=s===left||s===right;
    for(let y=0;y<height;y++){
      // Two side piers and a complete upper lintel: clear central passage.
      if(!edge&&y!==lintel)continue;
      const x=ox+(axis==='x'?s:d),z=oz+(axis==='x'?d:s);
      emit(cells,seen,x,oy+y,z,BLOCK.STONE);
    }
  }
  return finish(cells);
}

// Timber crossbeam for actual block-built halls and bridges. Alternating
// supporting posts can be requested without touching terrain or controls.
export function timberFrame(at,{span=7,height=5,axis='x',posts=true}={}){
  const [ox,oy,oz]=origin(at);
  dimensions(span,3,15,'span');dimensions(height,3,14,'height');
  if(axis!=='x'&&axis!=='z')throw new RangeError('axis must be x or z');
  const cells=[],seen=new Set();
  for(let s=0;s<span;s++)for(let y=0;y<height;y++){
    if(y!==height-1&&!(posts&&(s===0||s===span-1)))continue;
    emit(cells,seen,ox+(axis==='x'?s:0),oy+y,oz+(axis==='z'?s:0),BLOCK.WOOD);
  }
  return finish(cells);
}

// Opt-in safe application contract. Existing saved edits always win.
// This helper only *plans* additions; the owning landmark lane must decide
// whether and when to write, and how to rebuild affected chunks.
export function planUneditedConstruction(world,cells){
  if(!world||typeof world.get!=='function'||!(world.edits instanceof Map))
    throw new TypeError('Expected VoxelWorld-compatible world with edits map');
  if(!Array.isArray(cells)||cells.length>4096)throw new RangeError('Invalid construction size');
  const additions=[],blocked=[];
  for(const cell of cells){
    if(!Array.isArray(cell)||cell.length!==4||!cell.every(integer)||
       ![BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL].includes(cell[3]))
      throw new TypeError('Invalid construction cell');
    const [x,y,z,id]=cell,key=x+','+y+','+z;
    if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)throw new RangeError('Outside world bounds');
    // Never silently cover a player-edited voxel, including saved AIR.
    if(world.edits.has(key)||world.get(x,y,z)!==BLOCK.AIR)
      blocked.push(cell);
    else additions.push(cell);
  }
  return Object.freeze({additions:finish(additions),blocked:finish(blocked),
    safe:blocked.length===0});
}
