// Isolated test/preview fixture; NEVER reads/writes Mythwrought's live VoxelWorld.
// Legacy fixture cells (ID 59–62) retain their original 5-column snapshot rows.
// Joinery cells use [x,y,z,id,rotation,variant,open]; ground cells (69–72)
// use the original five-column rows [x,y,z,id,rotation]. Infrastructure
// cells (73–75) have six columns [x,y,z,id,rotation,variant]. Water ID 76
// has seven [x,y,z,id,level,flow,source] fields, never a live save row.
import {PACK_2_IDS,pack2Asset,pack2Cell,pack2Shape,parsePack2Cell}
  from '../../../src/block-packs/pack-2/definitions.mjs';
import {PACK_2_JOINERY_IDS,joineryAsset,joineryCell,joineryShape,
  parseJoineryCell,nextJoineryState} from '../../../src/block-packs/pack-2/joinery.mjs';
import {PACK_2_GROUND_IDS,groundAsset,groundCell,groundShape,parseGroundCell}
  from '../../../src/block-packs/pack-2/ground.mjs';
import {PACK_2_INFRASTRUCTURE_IDS,infrastructureAsset,infrastructureCell,
  infrastructureShape,parseInfrastructureCell}
  from '../../../src/block-packs/pack-2/infrastructure.mjs';
import {WATER_CANDIDATE_ID,waterCell,parseWaterCell,waterRaycast,waterShape}
  from '../../../src/block-packs/pack-2/water.mjs';

export const PACK_2_FIXTURE_IDS=Object.freeze([...PACK_2_IDS,...PACK_2_JOINERY_IDS,...PACK_2_GROUND_IDS,...PACK_2_INFRASTRUCTURE_IDS,WATER_CANDIDATE_ID]);
const key=c=>c.join(',');
const cellCheck=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger)&&c[1]>=-3&&c[1]<=19;
const EPS=1e-9;
const shapeOf=c=>c.id===WATER_CANDIDATE_ID?waterShape(c):
  infrastructureAsset(c.id)?infrastructureShape(c.id,c):
  groundAsset(c.id)?groundShape(c.id,c.rotation):
  joineryAsset(c.id)?joineryShape(c.id,c):pack2Shape(c.id,c.rotation);
const cloneCell=c=>c.id===WATER_CANDIDATE_ID?waterCell(c):
  infrastructureAsset(c.id)?infrastructureCell(c.id,c):
  groundAsset(c.id)?groundCell(c.id,c.rotation):
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
  constructor(){this.cells=new Map();this.selected=59;this.rotation=0;this.variant=null;this.open=false;
    this.waterState=waterCell();}
  select(id){
    if(!PACK_2_FIXTURE_IDS.includes(id))throw new RangeError('Unknown Pack 2 asset');
    this.selected=id;this.rotation=0;
    this.variant=joineryAsset(id)?.defaultState.variant??infrastructureAsset(id)?.variants[0]??null;
    this.open=false;this.waterState=waterCell();
    return this.selection();
  }
  turn(){
    if(this.selected===WATER_CANDIDATE_ID)return this.selection();
    const infra=infrastructureAsset(this.selected),ground=groundAsset(this.selected);
    const spec=joineryAsset(this.selected)??pack2Asset(this.selected);
    this.rotation=infra?(this.rotation+1)%infra.rotations:
      ground?(this.rotation+1)%ground.orientation.turns:
      spec.rotatable?(this.rotation+1)%4:0;
    return this.selection();
  }
  cycleVariant(){
    const spec=joineryAsset(this.selected)??infrastructureAsset(this.selected);
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
    return this.selected===WATER_CANDIDATE_ID?this.waterState:
      infrastructureAsset(this.selected)
      ?infrastructureCell(this.selected,{rotation:this.rotation,variant:this.variant}):
      groundAsset(this.selected)?groundCell(this.selected,this.rotation):
      joineryAsset(this.selected)
        ?joineryCell(this.selected,{rotation:this.rotation,variant:this.variant,open:this.open})
        :pack2Cell(this.selected,this.rotation);
  }
  // Explicit fixture editing only: no fluid ticks, propagation or gameplay input.
  setWaterSelection(state){
    if(this.selected!==WATER_CANDIDATE_ID)throw new RangeError('Select water first');
    this.waterState=waterCell(state);
    return this.selection();
  }
  setWaterCell(cell,state){
    const prior=this.read(cell);
    if(prior?.id!==WATER_CANDIDATE_ID)throw new RangeError('No water candidate at location');
    const next=waterCell(state);
    this.cells.set(key(cell),next);
    return next;
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
      if(candidate.id===WATER_CANDIDATE_ID){
        const hit=waterRaycast(candidate,origin,dir,cell,reach);
        if(hit&&(!best||hit.distance<best.distance-EPS)){
          best={cell,id:WATER_CANDIDATE_ID,level:candidate.level,
            flow:candidate.flow,source:candidate.source,
            normal:hit.normal,face:hit.face,distance:hit.distance,fluid:true};
        }
        continue;
      }
      for(const b of shapeOf(candidate).boxes){
        const hit=hitBox(origin,dir,b,cell,reach);
        if(hit&&(!best||hit.distance<best.distance-EPS)){
          best={cell,id:candidate.id,rotation:candidate.rotation,
            ...(joineryAsset(candidate.id)?{variant:candidate.variant,open:candidate.open}:
              infrastructureAsset(candidate.id)?{variant:candidate.variant}:{}),
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
        c.id===WATER_CANDIDATE_ID
          ?[...k.split(',').map(Number),c.id,c.level,c.flow,c.source]
          :[...k.split(',').map(Number),c.id,c.rotation,
            ...(joineryAsset(c.id)?[c.variant,c.open]:
              infrastructureAsset(c.id)?[c.variant]:[])])
        .sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2])};
  }
  static restore(data){
    if(!data||data.kind!=='mythwrought-pack-2-fixture'||data.version!==1||
       !Array.isArray(data.cells)||data.cells.length>64)throw new TypeError('Unsupported fixture');
    const out=new Pack2Fixture();
    const raw=data.selection;
    const sel=raw?.id===WATER_CANDIDATE_ID?parseWaterCell(raw):
      infrastructureAsset(raw?.id)?parseInfrastructureCell(raw):
      groundAsset(raw?.id)?parseGroundCell(raw):
      joineryAsset(raw?.id)?parseJoineryCell(raw):parsePack2Cell(raw);
    out.select(sel.id);
    out.rotation=sel.rotation??0;
    if(sel.id===WATER_CANDIDATE_ID)out.waterState=sel;
    if(joineryAsset(sel.id)){out.variant=sel.variant;out.open=sel.open;}
    else if(infrastructureAsset(sel.id)){out.variant=sel.variant;}
    for(const row of data.cells){
      if(!Array.isArray(row)||(row.length!==5&&row.length!==6&&row.length!==7)||
          !cellCheck(row.slice(0,3)))throw new TypeError('Bad saved fixture cell');
      const [x,y,z,id,rotation,variant,open]=row;
      const c=id===WATER_CANDIDATE_ID?(row.length===7?waterCell({level:rotation,flow:variant,source:open}):null):
        infrastructureAsset(id)?(row.length===6?infrastructureCell(id,{rotation,variant}):null):
        groundAsset(id)?(row.length===5?groundCell(id,rotation):null):
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
