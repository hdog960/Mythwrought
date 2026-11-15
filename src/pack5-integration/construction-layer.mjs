/**
 * Opt-in builder construction layer for the 18 REAL physical Pack 5 families.
 * No VoxelWorld.set(), no legacy ID allocation, no localStorage writes.
 * Hosts may render the returned meshes and persist the VERSIONED SIDECAR
 * separately. Until host renderer/input wiring is reviewed, this is NOT
 * the playable game's registered Build palette.
 */
import {BLOCK,raycast as raycastLegacy} from '../voxel.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {makePack5Fixture,orientedParts,rotateCellOffset} from '../block-packs/pack-5/fixture.mjs';
import {PACK5_BUILDER_FAMILIES,PACK5_BUILDER_CATALOG,resolvePack5BuilderAsset} from './catalog.mjs';

export const PACK5_BUILDER_SIDECAR='mythwrought.pack5.builder-layer.v1';
export const PACK5_BUILDER_MAX_INSTANCES=4096;
const validCell=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isSafeInteger);
const cellKey=v=>v.join(',');
const offset=(a,b)=>a.map((n,i)=>n+b[i]);
const within=(cell)=>validCell(cell)&&cell[1]>=WORLD_MIN_Y&&cell[1]<=WORLD_MAX_Y;
const overlap=(a,b)=>a[0]<b[3]&&a[3]>b[0]&&a[1]<b[4]&&a[4]>b[1]&&a[2]<b[5]&&a[5]>b[2];
const worldBox=(box,cell)=>box.map((v,i)=>v+cell[i%3]);
// Exact ray/AABB math matches the canonical Pack 5 fixture; only discovery
// changes, from scanning ALL furnishings to probing nearby occupied cells.
function hitBox(origin,unit,box){
  let lo=-Infinity,hi=Infinity;
  for(let i=0;i<3;i++){
    const d=unit[i];
    if(Math.abs(d)<1e-12){
      if(origin[i]<box[i]||origin[i]>box[i+3])return null;
      continue;
    }
    const a=(box[i]-origin[i])/d,b=(box[i+3]-origin[i])/d;
    lo=Math.max(lo,Math.min(a,b));
    hi=Math.min(hi,Math.max(a,b));
    if(hi<lo)return null;
  }
  return hi<0?null:Math.max(0,lo);
}
function checkBox(box){
  if(!Array.isArray(box)||box.length!==6||!box.every(Number.isFinite)||
     box.slice(0,3).some((x,i)=>x>=box[i+3]))throw Error('Invalid physical bounds');
}

/** A host supplies the REAL read-only voxel world. */
export function createPack5ConstructionLayer(world){
  if(!world||typeof world.get!=='function'||!Number.isSafeInteger(world.seed))
    throw Error('Builder layer requires a seeded, readable voxel world');
  const seed=world.seed;
  let fixture=makePack5Fixture(PACK5_BUILDER_FAMILIES);
  // Newer main hosts registered biome or physical asset IDs beyond legacy
  // 0–8, some of them non-solid. Do not treat *every* nonzero ID as support.
  // Only a future cross-pack registry can certify non-legacy supports.
  const supportSolid=cell=>{
    if(!within(cell))return false;
    const id=world.get(...cell);
    if(!Number.isSafeInteger(id)||id<=BLOCK.AIR)return false;
    if(id<=BLOCK.DEEPSTONE)return true;
    return typeof world.pack5StructuralSupport==='function'&&
      world.pack5StructuralSupport([...cell],id)===true;
  };
  // Collision against other registered shapes is the combined host's job.
  // Never accidentally turn a decorative registered plant into a full cube.
  const legacySolid=cell=>within(cell)&&
    Number.isSafeInteger(world.get(...cell))&&
    world.get(...cell)>BLOCK.AIR&&world.get(...cell)<=BLOCK.DEEPSTONE;
  const supportsFor=(into,descriptor,anchor,rotation,parts)=>{
    const need=[];
    if(descriptor.attachment==='floor')
      for(const p of parts)need.push([p.cell[0],p.cell[1]-1,p.cell[2]]);
    if(descriptor.attachment==='ceiling')need.push(offset(anchor,[0,1,0]));
    if(descriptor.attachment==='wall')
      need.push(offset(anchor,rotateCellOffset([0,0,-1],rotation)));
    for(const cell of need)into.setSupport(cell,supportSolid(cell));
    return need.every(supportSolid);
  };
  const attempt=(into,id,anchor,rotation=0,variant=null,playerBox=null)=>{
    if(!validCell(anchor)||!Number.isInteger(rotation)||rotation<0||rotation>3)
      throw Error('Invalid Pack 5 placement coordinates or orientation');
    if(playerBox!==null)checkBox(playerBox);
    const asset=resolvePack5BuilderAsset(id,variant);
    const parts=orientedParts(asset.descriptor,rotation).map(p=>({
      ...p,cell:offset(anchor,p.cell)
    }));
    if(parts.some(p=>!within(p.cell)||world.get(...p.cell)!==BLOCK.AIR))
      return {ok:false,reason:'Legacy world cell occupied or outside editable bounds'};
    if(playerBox&&parts.some(p=>p.collisionBoxes.some(b=>overlap(worldBox(b,p.cell),playerBox))))
      return {ok:false,reason:'Player collision'};
    if(!supportsFor(into,asset.descriptor,anchor,rotation,parts))
      return {ok:false,reason:'Missing world attachment'};
    return into.place(id,anchor,rotation,asset.variant);
  };
  const readRows=()=>{
    const rows=fixture.snapshot().entries;
    return rows.map(r=>Object.freeze({anchor:Object.freeze(r.slice(0,3)),symbolicId:r[3],
      rotation:r[4],variant:r[5]??null}));
  };
  const api={
    catalog:PACK5_BUILDER_CATALOG,
    get seed(){return seed;},
    count(){return fixture.count();},
    list(){return readRows();},
    cell(cell){return fixture.cell(cell);},
    place(id,anchor,rotation=0,variant=null,{playerBox=null}={}){
      if(fixture.count()>=PACK5_BUILDER_MAX_INSTANCES)
        return {ok:false,reason:'Pack 5 builder instance budget reached'};
      return attempt(fixture,id,anchor,rotation,variant,playerBox);
    },
    remove(cell){return fixture.remove(cell);},
    /** Shape-exact hit, with legacy solid-world occlusion checked first. */
    raycast(origin,direction,maxDistance=6){
      // For low density, retain the source-exact reference behavior.
      let hit;
      if(fixture.count()<=64||maxDistance>8){
        hit=fixture.raycast(origin,direction,maxDistance);
      }else{
        // Legacy ray semantics and validation remain unchanged.
        if(!Array.isArray(origin)||!Array.isArray(direction)||
          origin.length!==3||direction.length!==3||
          ![...origin,...direction,maxDistance].every(Number.isFinite)||
          maxDistance<0||direction.every(v=>v===0))
          throw Error('Invalid Pack 5 ray');
        const length=Math.hypot(...direction);
        if(!Number.isFinite(length)||length===0)throw Error('Invalid Pack 5 ray length');
        const unit=direction.map(v=>v/length);
        const end=origin.map((n,i)=>n+unit[i]*maxDistance);
        const min=origin.map((n,i)=>Math.floor(Math.min(n,end[i])-1e-8));
        const max=origin.map((n,i)=>Math.floor(Math.max(n,end[i])+1e-8));
        if([...min,...max].some(n=>!Number.isSafeInteger(n)))
          hit=fixture.raycast(origin,direction,maxDistance);
        else{
          hit=null;
          for(let x=min[0];x<=max[0];x++)
            for(let y=min[1];y<=max[1];y++)
              for(let z=min[2];z<=max[2];z++){
                const cell=[x,y,z],record=fixture.cell(cell);
                if(!record)continue;
                const {descriptor}=resolvePack5BuilderAsset(record.symbolicId,record.variant);
                for(const p of orientedParts(descriptor,record.rotation)){
                  const at=offset(record.anchor,p.cell);
                  if(at[0]!==x||at[1]!==y||at[2]!==z)continue;
                  for(const b of p.boxes){
                    const t=hitBox(origin,unit,worldBox(b,cell));
                    if(t!==null&&t<=maxDistance&&(!hit||t<hit.distance))
                      hit={symbolicId:record.symbolicId,anchor:[...record.anchor],
                        cell:[...cell],distance:t};
                  }
                }
              }
        }
      }
      if(!hit)return null;
      const obstruction=raycastLegacy(world,origin,direction,maxDistance);
      return obstruction&&obstruction.distance<=hit.distance+1e-8?null:hit;
    },
    removeRay(origin,direction,maxDistance=6){
      const hit=api.raycast(origin,direction,maxDistance);
      return hit?fixture.remove(hit.cell):false;
    },
    // Spatial shape collision: do not scan every distant decoration on each
    // mobile physics substep. Inspect only occupied cells intersecting the box.
    collidesPack5(box){
      checkBox(box);
      if(box.slice(0,3).some((v,i)=>box[i+3]-v>8))
        throw Error('Pack 5 collision probe exceeds eight-cell budget');
      const eps=1e-7;
      for(let x=Math.floor(box[0]+eps);x<=Math.floor(box[3]-eps);x++)
        for(let y=Math.floor(box[1]+eps);y<=Math.floor(box[4]-eps);y++)
          for(let z=Math.floor(box[2]+eps);z<=Math.floor(box[5]-eps);z++){
            const cell=[x,y,z],record=fixture.cell(cell);
            if(!record)continue;
            const asset=resolvePack5BuilderAsset(record.symbolicId,record.variant);
            for(const part of orientedParts(asset.descriptor,record.rotation)){
              const at=offset(record.anchor,part.cell);
              if(at[0]!==x||at[1]!==y||at[2]!==z)continue;
              if(part.collisionBoxes.some(b=>overlap(worldBox(b,cell),box)))return true;
            }
          }
      return false;
    },
    /** Collision against Pack 5 partial shapes AND legacy solid cubes. */
    collides(box){
      checkBox(box);
      if(fixture.collides(box))return true;
      if(box.some((v,i)=>i<3&&box[i+3]-v>8))
        throw Error('Collision probe exceeds 8-voxel budget');
      const eps=1e-6;
      for(let x=Math.floor(box[0]+eps);x<=Math.floor(box[3]-eps);x++)
        for(let y=Math.floor(box[1]+eps);y<=Math.floor(box[4]-eps);y++)
          for(let z=Math.floor(box[2]+eps);z<=Math.floor(box[5]-eps);z++)
            if(legacySolid([x,y,z]))return true;
      return false;
    },
    /** Upload-ready authored triangle buffers for exactly one placed instance. */
    meshAt(cell){
      const record=fixture.cell(cell);
      if(!record)return null;
      const {descriptor,mesh}=resolvePack5BuilderAsset(record.symbolicId,record.variant);
      const result=mesh(descriptor,{rotation:record.rotation});
      if(!result||result.vertexCount<1||result.vertexCount>6144||
         !result.positions||!result.indices||!result.colors||
         result.positions.length!==result.vertexCount*3 ||
         result.colors.length!==result.vertexCount*4 ||
         result.indices.length%3!==0)throw Error('Invalid authored Pack 5 GPU mesh');
      const translated=new Float32Array(result.positions.length);
      for(let i=0;i<translated.length;i++)translated[i]=result.positions[i]+record.anchor[i%3];
      return {symbolicId:record.symbolicId,variant:record.variant,
        anchor:[...record.anchor],rotation:record.rotation,
        positions:translated,colors:result.colors,indices:result.indices,
        vertexCount:result.vertexCount,triangles:result.indices.length/3};
    },
    /** Bounded chunk-builder interface; callers decide streaming/upload schedule. */
    meshes({limit=64}={}){
      if(!Number.isInteger(limit)||limit<1||limit>256)
        throw Error('Mesh extraction budget must be 1..256 instances');
      return readRows().slice(0,limit).map(r=>api.meshAt(r.anchor));
    },
    snapshot(){
      return {format:PACK5_BUILDER_SIDECAR,seed,
        entries:fixture.snapshot().entries.map(row=>[...row])};
    },
    /** Atomic: on rejected incoming state, the old layer remains intact. */
    restore(snapshot){
      if(!snapshot||typeof snapshot!=='object'||snapshot.schema!==undefined||
         snapshot.format!==PACK5_BUILDER_SIDECAR||snapshot.seed!==seed||
         !Array.isArray(snapshot.entries)||snapshot.entries.length>PACK5_BUILDER_MAX_INSTANCES)
        throw Error('Invalid or cross-seed Pack 5 builder sidecar');
      const replacement=makePack5Fixture(PACK5_BUILDER_FAMILIES);
      for(const row of snapshot.entries){
        if(!Array.isArray(row)||(row.length!==5&&row.length!==6))
          throw Error('Invalid Pack 5 builder sidecar row');
        const placed=attempt(replacement,row[3],row.slice(0,3),row[4],row[5]??null);
        if(!placed.ok)throw Error('Invalid Pack 5 builder sidecar placement: '+placed.reason);
      }
      fixture=replacement;
      return true;
    }
  };
  return Object.freeze(api);
}
