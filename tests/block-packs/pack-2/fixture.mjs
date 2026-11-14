// Isolated interactive acceptance fixture. NEVER passed to Mythwrought's VoxelWorld.
// It models candidate per-cell orientation until the :00 / :12 engines are integrated.
import {PACK_2_IDS,pack2Cell,pack2Shape,parsePack2Cell} from '../../../src/block-packs/pack-2/definitions.mjs';

const key=c=>c.join(',');
const cellCheck=c=>Array.isArray(c)&&c.length===3&&c.every(Number.isSafeInteger)&&c[1]>=-3&&c[1]<=19;
const EPS=1e-9;
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
  constructor(){this.cells=new Map();this.selected=59;this.rotation=0;}
  select(id){
    if(!PACK_2_IDS.includes(id))throw new RangeError('Unknown Pack 2 asset');
    this.selected=id;this.rotation=0;
    return this.selection();
  }
  turn(){
    this.rotation=this.selected===62?0:pack2Shape(this.selected,(this.rotation+1)%4).rotation;
    return this.selection();
  }
  selection(){return pack2Cell(this.selected,this.rotation);}
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
  target(origin,direction,reach=6){
    if(!Array.isArray(origin)||origin.length!==3||!origin.every(Number.isFinite)||
       !Array.isArray(direction)||direction.length!==3||!direction.every(Number.isFinite)||
       !Number.isFinite(reach)||reach<0||reach>64)throw new TypeError('Bad ray');
    const len=Math.hypot(...direction);if(len<EPS)throw new RangeError('Zero-length direction');
    const dir=direction.map(v=>v/len);
    let best=null;
    for(const [k,candidate] of this.cells){
      const cell=k.split(',').map(Number);
      for(const b of pack2Shape(candidate.id,candidate.rotation).boxes){
        const hit=hitBox(origin,dir,b,cell,reach);
        if(hit&&(!best||hit.distance<best.distance-EPS)){
          best={cell,id:candidate.id,rotation:candidate.rotation,
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
    // Separate fixture envelope, never compatible with the actual schema-1
    // VoxelWorld.restore implementation (which currently rejects IDs > 8).
    return {kind:'mythwrought-pack-2-fixture',version:1,
      selection:this.selection(),
      cells:[...this.cells.entries()].map(([k,v])=>[...k.split(',').map(Number),v.id,v.rotation])
        .sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2])};
  }
  static restore(data){
    if(!data||data.kind!=='mythwrought-pack-2-fixture'||data.version!==1||
       !Array.isArray(data.cells)||data.cells.length>64)throw new TypeError('Unsupported fixture');
    const out=new Pack2Fixture();
    const sel=parsePack2Cell(data.selection);out.select(sel.id);out.rotation=sel.rotation;
    for(const row of data.cells){
      if(!Array.isArray(row)||row.length!==5||!cellCheck(row.slice(0,3)))throw new TypeError('Bad saved cell');
      const [x,y,z,id,rotation]=row;
      const candidate=pack2Cell(id,rotation),coord=[x,y,z];
      if(out.cells.has(key(coord)))throw new TypeError('Duplicate saved cell');
      out.cells.set(key(coord),candidate);
    }
    return out;
  }
}
