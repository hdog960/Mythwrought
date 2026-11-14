// Isolated test/preview fixture; NEVER reads/writes Mythwrought's live VoxelWorld.
// Legacy fixture cells (ID 59–62) retain their original 5-column snapshot rows.
// Joinery cells use [x,y,z,id,rotation,variant,open]; ground cells (69–72)
// use the original five-column rows [x,y,z,id,rotation].
import {PACK_2_IDS,pack2Asset,pack2Cell,pack2Shape,parsePack2Cell}
  from '../../../src/block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY_IDS,joineryAsset,joineryCell,joineryShape,
  parseJoineryCell,nextJoineryState} from '../../../src/block-packs/pack-2/joinery.mjs';
import {PACK_2_GROUND_IDS,groundAsset,groundCell,groundShape,parseGroundCell}
  from '../../../src/block-packs/pack-2/ground.mjs';

export const PACK_2_FIXTURE_IDS=Object.freeze([...PACK_2_IDS,...PACK_2_JOINERY_IDS,...PACK_2_GROUND_IDS]);
const key=c=>c.join(',');
const cellCheck=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger)&&c[1]>=-3&&c[1]<=19;
const EPS=1e-9;
const shapeOf=c=>groundAsset(c.id)?groundShape(c.id,c.rotation):
  joineryAsset(c.id)?joineryShape(c.id,c):pack2Shape(c.id,c.rotation);
const cloneCell=c=>groundAsset(c.id)?groundCell(c.id,c.rotation):
  joineryAsset(c.id)?joineryCell(c.id,c):pack2Cell(c.id,c.rotation);
function hitBox(origin,dir,b,cell,reach){
  let enter=-Infinity,exit=Infinity,normal=[0,0,0];
  for(let axis=0;axis<3;axis++){
    const lo=cell[axis]+b[axis],hi=cell[axis]+b[axis+3],d=dir[axis];
    if(Math.abs(d)<EPS){if(origin[axis]<lo-EPS||origin[axis]>hi+EPS)return null;continue;}
    const a=(lo-origin[axis])/d,z=(hi-origin[axis])/d;
    const start=Math.min(a,z),end=Math.max(a,z);
    if(start>enter){enter=start;normal=[0,0,0];normal[axis]=a<z?-1:1;}
    exit=Math.min(exit,end);
    if(enter>exit+EPS)return null;
  }
  if(exit<-EPS||enter>reach+EPS)return null;
  return {distance:Math.max(0,enter),normal:enter<0?[0,0,0]:normal};
}
export class Pack2Fixture{
  constructor(){this.cells=new Map();this.selected=59;this.rotation=0;this.variant=null;this.open=false;}
  select(id){
    if(!PACK_2_FIXTURE_IDS.includes(id))throw new RangeError('Unknown Pack 2 asset');
    this.selected=id;this.rotation=0;
    this.variant=joineryAsset(id)?.defaultState.variant??null;
    this.open=false;
    return this.selection();
  }
  turn(){
    const ground=groundAsset(this.selected);
    const spec=joineryAsset(this.selected)??pack2Asset(this.selected);
    this.rotation=ground?(this.rotation+1)%ground.orientation.turns:
      spec.rotatable?(this.rotation+1)%4:0;
    return this.selection();
  }
  cycleVariant(){
    const spec=joineryAsset(this.selected);
    if(!spec)return this.selection();
    this.variant=spec.variants[(spec.variants.indexOf(this.variant)+1)%spec.variants.length];
    return this.selection();
  }
  toggleSelection(){
    if(!joineryAsset(this.selected)?.toggleable)throw new RangeError('This candidate is not hinged');
    this.open=!this.open;
    return this.selection();
  }
  selection(){
    return groundAsset(this.selected)?groundCell(this.selected,this.rotation):
      joineryAsset(this.selected)
        ?joineryCell(this.selected,{rotation:this.rotation,variant:this.variant,open:this.open})
        :pack2Cell(this.selected,this.rotation);
  }
  read(cell){
    if(!cellCheck(cell))throw new RangeError('Invalid fixture coordinate');
    return this.cells.get(key(cell))??null;
  }
  place(cell){
    if(!cellCheck(cell)||this.cells.size>=64)throw new RangeError('Fixture placement out of bounds/capacity');
    if(this.read(cell))return false;
    this.cells.set(key(cell),this.selection());
    return true;
  }
  remove(cell){
    if(!cellCheck(cell))throw new RangeError('Invalid fixture coordinate');
    return this.cells.delete(key(cell));
  }
  toggleCell(cell){
    const current=this.read(cell);
    if(!current||!joineryAsset(current.id)?.toggleable)return false;
    this.cells.set(key(cell),nextJoineryState(current.id,current));
    return this.read(cell);
  }
  target(origin,direction,reach=6){
    if(!Array.isArray(origin)||origin.length!==3||!origin.every(Number.isFinite)||
       !Array.isArray(direction)||direction.length!==3||!direction.every(Number.isFinite)||
       !Number.isFinite(reach)||reach<0||reach>64)throw new TypeError('Bad ray');
    const len=Math.hypot(...direction);if(len<EPS)throw new RangeError('Zero-length direction');
    const dir=direction.map(v=>v/len);
    let best=null;
    for(const [k,candidate] of this.cells){
      const cell=k.split(',').map(Number);
      for(const b of shapeOf(candidate).boxes){
        const hit=hitBox(origin,dir,b,cell,reach);
        if(hit&&(!best||hit.distance<best.distance-EPS)){
          best={cell,id:candidate.id,rotation:candidate.rotation,
            ...(joineryAsset(candidate.id)?{variant:candidate.variant,open:candidate.open}:{}),
            normal:hit.normal,distance:hit.distance};
        }
      }
    }
    return best;
  }
  mineRay(origin,direction,reach=6){
    const target=this.target(origin,direction,reach);
    return target?{...target,removed:this.remove(target.cell)}:null;
  }
  serialize(){
    // Strictly separate fixture format. NOT production schema-1.
    return {kind:'mythwrought-pack-2-fixture',version:1,
      selection:this.selection(),
      cells:[...this.cells.entries()].map(([k,c])=>
        [...k.split(',').map(Number),c.id,c.rotation,
          ...(joineryAsset(c.id)?[c.variant,c.open]:[])])
        .sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2])};
  }
  static restore(data){
    if(!data||data.kind!=='mythwrought-pack-2-fixture'||data.version!==1||
       !Array.isArray(data.cells)||data.cells.length>64)throw new TypeError('Unsupported fixture');
    const out=new Pack2Fixture();
    const raw=data.selection;
    const sel=groundAsset(raw?.id)?parseGroundCell(raw):
      joineryAsset(raw?.id)?parseJoineryCell(raw):parsePack2Cell(raw);
    out.select(sel.id);
    out.rotation=sel.rotation;
    if(joineryAsset(sel.id)){out.variant=sel.variant;out.open=sel.open;}
    for(const row of data.cells){
      if(!Array.isArray(row)||(row.length!==5&&row.length!==7)||
          !cellCheck(row.slice(0,3)))throw new TypeError('Bad saved fixture cell');
      const [x,y,z,id,rotation,variant,open]=row;
      const c=groundAsset(id)?(row.length===5?groundCell(id,rotation):null):
        joineryAsset(id)?(row.length===7?joineryCell(id,{rotation,variant,open}):null):
        (row.length===5?pack2Cell(id,rotation):null);
      if(!c)throw new TypeError('Candidate record width mismatch');
      const at=[x,y,z];
      if(out.cells.has(key(at)))throw new TypeError('Duplicate fixture coordinates');
      out.cells.set(key(at),cloneCell(c));
    }
    return out;
  }
}
