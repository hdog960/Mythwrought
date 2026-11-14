/** Isolated Pack 5 shape/placement fixture. Does not import or modify game code. */
export const PACK5_FIXTURE_FORMAT = 'mythwrought-pack5-fixture-v1';
const key = (x,y,z) => `${x},${y},${z}`;
const integer3 = p => Array.isArray(p) && p.length===3 && p.every(Number.isSafeInteger);
const finiteBox = b => Array.isArray(b) && b.length===6 && b.every(Number.isFinite)
  && b.slice(0,3).every((v,i)=>v>=0 && v<b[i+3] && b[i+3]<=1);
const copyBox = b => [...b];
export function rotateLocalBox(box, rotation=0){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3||!finiteBox(box))throw Error('Invalid box or rotation');
  let b=copyBox(box);
  for(let n=0;n<rotation;n++)b=[1-b[5],b[1],b[0],1-b[2],b[4],b[3]];
  return b;
}
export function rotateCellOffset(cell, rotation=0){
  if(!integer3(cell)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Invalid offset or rotation');
  let [x,y,z]=cell;
  for(let n=0;n<rotation;n++)[x,z]=[-z,x];
  return [x===0?0:x,y,z===0?0:z];
}
const rotateDirection=(dir,rotation)=>rotateCellOffset(dir,rotation);
export function validatePhysicalDescriptor(descriptor){
  if(!descriptor||typeof descriptor!=='object'||
      typeof descriptor.symbolicId!=='string'||!/^pack5:(?:0(?:7[9]|8\d|9[0-6]))$/.test(descriptor.symbolicId)||
      typeof descriptor.name!=='string'||descriptor.name.length<2||
      !['floor','wall','ceiling','none'].includes(descriptor.attachment)||
      !Array.isArray(descriptor.parts)||descriptor.parts.length<1||descriptor.parts.length>64||
      descriptor.numericId!==undefined||descriptor.integrated===true)
    throw Error('Invalid isolated Pack 5 descriptor');
  const cells=new Set();let boxes=0;
  for(const part of descriptor.parts){
    if(!part||!integer3(part.cell)||!Array.isArray(part.boxes)||!Array.isArray(part.collisionBoxes)||
        part.boxes.length<1||part.boxes.length>64||part.collisionBoxes.length>64||
        !part.boxes.every(finiteBox)||!part.collisionBoxes.every(finiteBox))throw Error('Invalid physical part');
    const cellKey=key(...part.cell);
    if(cells.has(cellKey))throw Error('Duplicate occupied cell in descriptor');
    cells.add(cellKey);boxes+=part.boxes.length;
  }
  if(boxes>256||!cells.has('0,0,0'))throw Error('Invalid anchor or mesh budget');
  if(descriptor.variants!==undefined){
    if(!Array.isArray(descriptor.variants)||!descriptor.variants.length||!descriptor.variant)throw Error('Invalid variants');
    const seen=new Set([descriptor.variant]);
    for(const v of descriptor.variants){
      if(typeof v.variant!=='string'||seen.has(v.variant))throw Error('Duplicate/invalid variant');
      seen.add(v.variant);
      validatePhysicalDescriptor({...descriptor,parts:v.parts,variant:v.variant,variants:undefined});
    }
  }
  return true;
}
export function orientedParts(descriptor,rotation=0){
  validatePhysicalDescriptor(descriptor);
  return descriptor.parts.map(p=>({cell:rotateCellOffset(p.cell,rotation),
    boxes:p.boxes.map(b=>rotateLocalBox(b,rotation)),
    collisionBoxes:p.collisionBoxes.map(b=>rotateLocalBox(b,rotation))}));
}
const asAabb=(box,cell)=>box.map((v,i)=>v+cell[i%3]);
const overlaps=(a,b)=>a[0]<b[3]&&a[3]>b[0]&&a[1]<b[4]&&a[4]>b[1]&&a[2]<b[5]&&a[5]>b[2];
function rayBox(origin,direction,box){
  let lo=-Infinity,hi=Infinity;
  for(let a=0;a<3;a++){
    const d=direction[a];
    if(Math.abs(d)<1e-12){if(origin[a]<box[a]||origin[a]>box[a+3])return null;continue;}
    const t0=(box[a]-origin[a])/d,t1=(box[a+3]-origin[a])/d;
    lo=Math.max(lo,Math.min(t0,t1));hi=Math.min(hi,Math.max(t0,t1));
    if(hi<lo)return null;
  }
  return hi<0?null:Math.max(0,lo);
}
export function makePack5Fixture(descriptors=[]){
  const registry=new Map(),placed=new Map(),occupied=new Map(),supports=new Set();
  for(const d of descriptors){validatePhysicalDescriptor(d);if(registry.has(d.symbolicId))throw Error('Duplicate symbolic ID');registry.set(d.symbolicId,d);}
  const resolve=(id,variant)=>{
    const d=registry.get(id);
    if(!d)throw Error('Unknown symbolic ID');
    if(variant===null||variant===d.variant)return d;
    const v=d.variants?.find(v=>v.variant===variant);
    if(!v)throw Error('Unknown geometry variant');
    return {...d,parts:v.parts,variant:v.variant,variants:undefined};
  };
  const plan=(id,anchor,rotation=0,variant=null)=>{
    if(!integer3(anchor)||!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Invalid placement');
    return orientedParts(resolve(id,variant),rotation).map(p=>({cell:p.cell.map((v,i)=>v+anchor[i]),boxes:p.boxes,collisionBoxes:p.collisionBoxes}));
  };
  const requiredSupport=(d,a,rotation)=>{
    if(d.attachment==='none')return null;
    let v=d.attachment==='floor'?[0,-1,0]:d.attachment==='ceiling'?[0,1,0]:[0,0,-1];
    v=rotateDirection(v,rotation);return a.map((n,i)=>n+v[i]);
  };
  const fixture={
    setSupport(cell,enabled=true){if(!integer3(cell))throw Error('Invalid support cell');if(enabled)supports.add(key(...cell));else supports.delete(key(...cell));},
    place(id,anchor,rotation=0,variant=null){
      const parts=plan(id,anchor,rotation,variant),d=registry.get(id),anchorKey=key(...anchor);
      if(placed.has(anchorKey))return {ok:false,reason:'Anchor occupied'};
      if(parts.some(p=>occupied.has(key(...p.cell))))return {ok:false,reason:'Occupied cell'};
      const support=requiredSupport(d,anchor,rotation);
      if(support&&!supports.has(key(...support)))return {ok:false,reason:'Missing attachment'};
      // Every occupied floor-supported cell must actually stand on material.
      // A long bed cannot hang in midair merely because its head has support.
      if(d.attachment==='floor' && parts.some(p=>!supports.has(key(p.cell[0],p.cell[1]-1,p.cell[2]))))
        return {ok:false,reason:'Missing attachment'};
      placed.set(anchorKey,{id,anchor:[...anchor],rotation,variant,parts});
      for(const p of parts)occupied.set(key(...p.cell),anchorKey);
      return {ok:true,cells:parts.map(p=>[...p.cell])};
    },
    remove(cell){if(!integer3(cell))throw Error('Invalid removal cell');const a=occupied.get(key(...cell));if(!a)return false;
      for(const p of placed.get(a).parts)occupied.delete(key(...p.cell));placed.delete(a);return true;},
    cell(cell){if(!integer3(cell))throw Error('Invalid query cell');const a=occupied.get(key(...cell));const p=a&&placed.get(a);return p?{symbolicId:p.id,anchor:[...p.anchor],rotation:p.rotation,variant:p.variant}:null;},
    collides(box){if(!Array.isArray(box)||box.length!==6||!box.every(Number.isFinite)||box.some((v,i)=>i<3&&v>=box[i+3]))throw Error('Invalid collision probe');
      for(const p of placed.values())for(const part of p.parts)for(const b of part.collisionBoxes)
        if(overlaps(asAabb(b,part.cell),box))return true;
      return false;},
    raycast(origin,direction,maxDistance=6){if(!Array.isArray(origin)||!Array.isArray(direction)||origin.length!==3||direction.length!==3||
      ![...origin,...direction,maxDistance].every(Number.isFinite)||maxDistance<0||direction.every(v=>v===0))throw Error('Invalid ray');
      let hit=null;for(const p of placed.values())for(const part of p.parts)for(const b of part.boxes){
        const t=rayBox(origin,direction,asAabb(b,part.cell));
        if(t!==null&&t<=maxDistance&&(!hit||t<hit.distance))hit={symbolicId:p.id,anchor:[...p.anchor],cell:[...part.cell],distance:t};
      }return hit;},
    removeRay(origin,direction,maxDistance=6){const hit=fixture.raycast(origin,direction,maxDistance);return hit?fixture.remove(hit.cell):false;},
    snapshot(){const entries=[...placed.values()].map(p=>p.variant===null?[...p.anchor,p.id,p.rotation]:[...p.anchor,p.id,p.rotation,p.variant]);
      entries.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]||a[3].localeCompare(b[3]));
      return {format:PACK5_FIXTURE_FORMAT,entries};},
    restore(snapshot){
      if(!snapshot||snapshot.format!==PACK5_FIXTURE_FORMAT||!Array.isArray(snapshot.entries)||snapshot.entries.length>4096||
        snapshot.schema!==undefined)throw Error('Not a Pack 5 fixture snapshot');
      const backup=fixture.snapshot(),positions=[...supports];
      placed.clear();occupied.clear();
      try{for(const row of snapshot.entries){if(!Array.isArray(row)||(row.length!==5&&row.length!==6)||
          !fixture.place(row[3],row.slice(0,3),row[4],row[5]??null).ok)throw Error('Invalid snapshot entry');}}
      catch(err){placed.clear();occupied.clear();supports.clear();for(const k of positions)supports.add(k);
        for(const row of backup.entries)fixture.place(row[3],row.slice(0,3),row[4],row[5]??null);throw err;}
      return true;
    },
    count(){return placed.size;}
  };
  return fixture;
}
