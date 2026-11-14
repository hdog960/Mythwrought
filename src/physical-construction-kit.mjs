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


// Ruined masonry wall with a genuinely traversable doorway, staggered
// broken parapet and deterministic missing upper stones. Full cube voxels.
// Geometry only: the structures lane chooses where it belongs.
export function ruinedWall(at,{length=11,height=6,thickness=2,axis='x',doorWidth=3,doorHeight=3}={}){
  const [ox,oy,oz]=origin(at);
  dimensions(length,7,25,'length');dimensions(height,4,12,'height');
  dimensions(thickness,1,3,'thickness');
  dimensions(doorWidth,2,length-4,'doorWidth');
  dimensions(doorHeight,2,height-2,'doorHeight');
  if(axis!=='x'&&axis!=='z')throw new RangeError('axis must be x or z');
  const cells=[],seen=new Set();
  const doorStart=Math.floor((length-doorWidth)/2);
  for(let s=0;s<length;s++)for(let y=0;y<height;y++){
    const doorway=s>=doorStart&&s<doorStart+doorWidth&&y<doorHeight;
    // Bounded jagged silhouette: no random state, no floating isolated stones.
    const topLoss=(s*7+3)%5===0?2:(s*11+1)%4===0?1:0;
    if(doorway||y>=height-topLoss)continue;
    for(let d=0;d<thickness;d++){
      const x=ox+(axis==='x'?s:d),z=oz+(axis==='x'?d:s);
      emit(cells,seen,x,oy+y,z,BLOCK.STONE);
    }
  }
  return finish(cells);
}

// A physical, one-block-step stone stair flight for reachable elevations.
// The existing cube collider and raycaster work without special mesh shapes.
export function stoneSteps(at,{steps=5,width=3,axis='x',rise=1}={}){
  const [ox,oy,oz]=origin(at);
  dimensions(steps,2,12,'steps');dimensions(width,1,7,'width');
  if(axis!=='x'&&axis!=='z')throw new RangeError('axis must be x or z');
  if(rise!==1&&rise!==-1)throw new RangeError('rise must be 1 or -1');
  const cells=[],seen=new Set();
  for(let s=0;s<steps;s++)for(let w=0;w<width;w++){
    const y=oy+rise*s;
    const x=ox+(axis==='x'?s:w),z=oz+(axis==='x'?w:s);
    emit(cells,seen,x,y,z,BLOCK.STONE);
  }
  return finish(cells);
}


// A full-voxel, walkable causeway with low side parapets. The central deck
// is one block thick; the air above it is intentionally left empty.
// This is a reusable component, NOT landmark placement or world mutation.
export function stoneCauseway(at,{length=11,width=5,axis='x',parapets=true,pierSpacing=0,pierHeight=0}={}){
  const [ox,oy,oz]=origin(at);
  dimensions(length,5,31,'length');dimensions(width,3,9,'width');
  if(axis!=='x'&&axis!=='z')throw new RangeError('axis must be x or z');
  if(!integer(pierSpacing)||pierSpacing<0||pierSpacing>12)throw new RangeError('pierSpacing');
  if(!integer(pierHeight)||pierHeight<0||pierHeight>12)throw new RangeError('pierHeight');
  if((pierSpacing===0)!==(pierHeight===0))throw new RangeError('piers require spacing and height');
  const cells=[],seen=new Set();
  const put=(s,w,y)=>emit(cells,seen,ox+(axis==='x'?s:w),oy+y,oz+(axis==='x'?w:s),BLOCK.STONE);
  for(let s=0;s<length;s++)for(let w=0;w<width;w++){
    put(s,w,0);
    if(parapets&&(w===0||w===width-1)&&s>0&&s<length-1)put(s,w,1);
    if(pierSpacing&&s>0&&s<length-1&&s%pierSpacing===0&&(w===0||w===width-1))
      for(let y=1;y<=pierHeight;y++)put(s,w,-y);
  }
  return finish(cells);
}
