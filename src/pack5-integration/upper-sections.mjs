// Shared-height Pack5 geometry ownership: partition real source triangles
// by centroid into signed section owners, retaining exact original vertices.
// No triangle is clipped, duplicated or replaced. Physical footprint owners
// are indexed independently, including empty seam regions.
import {resolvePack5BuilderAsset} from './catalog.mjs';
import {orientedParts} from '../block-packs/pack-5/fixture.mjs';
import {pack5TerrainVertices} from './terrain-buffer.mjs';
import {runtimeMeshKey,runtimeSectionForY,PHYSICAL_MAX_Y,UPPER_MIN_Y} from '../world-height.mjs';
import {UPPER_SECTION_BYTES} from '../world-height-budget.mjs';
const EMPTY=new Float32Array();
const key=(x,y,z)=>runtimeMeshKey(Math.floor(x/16),Math.floor(z/16),runtimeSectionForY(y));
export function pack5UpperRecord(row){
 const [x,y,z,id,rotation,variant=null]=row;
 if(y<UPPER_MIN_Y)return null;
 const {descriptor,mesh}=resolvePack5BuilderAsset(id,variant);
 const cells=orientedParts(descriptor,rotation).map(p=>p.cell.map((v,i)=>v+[x,y,z][i]));
 if(cells.some(c=>c[1]<UPPER_MIN_Y||c[1]>PHYSICAL_MAX_Y))throw Error('Pack5 upper footprint outside physical height');
 const min=[0,1,2].map(i=>Math.min(...cells.map(c=>c[i]))),max=[0,1,2].map(i=>Math.max(...cells.map(c=>c[i])));
 const source=mesh(descriptor,{rotation}),positions=new Float32Array(source.positions.length);
 for(let i=0;i<positions.length;i++)positions[i]=source.positions[i]+[x,y,z][i%3];
 const packed=pack5TerrainVertices({...source,positions}),owners=new Map();
 for(const c of cells)owners.set(key(...c),[]);
 for(let i=0;i<packed.length;i+=27){
  const p=[0,1,2].map(a=>Math.max(min[a],Math.min(max[a],Math.floor((packed[i+a]+packed[i+9+a]+packed[i+18+a])/3))));
  const k=key(...p);if(!owners.has(k))owners.set(k,[]);
  const dest=owners.get(k);if((dest.length+27)*4>UPPER_SECTION_BYTES)throw Error('Pack5 upper instance exceeds section budget');
  for(let j=i;j<i+27;j++)dest.push(packed[j]);
 }
 return new Map([...owners].map(([k,v])=>[k,new Float32Array(v)]));
}
// Sparse copy-on-write index: no world-wide retained packed geometry.
// Each touched owner holds only source row identities and exact float counts.
const rowKey=r=>r.slice(0,3).join(',');
export class Pack5UpperIndex {
 #owners;#rows;
 constructor(owners=new Map(),rows=new Map()){this.#owners=owners;this.#rows=rows;}
 keys(){return this.#owners.keys();}
 has(k){return this.#owners.has(k);}
 get size(){return this.#owners.size;}
 get rowCount(){return this.#rows.size;}
 get(k){
  const bucket=this.#owners.get(k);if(!bucket)return undefined;
  const out=new Float32Array(bucket.floats);let at=0;
  for(const {row,length} of [...bucket.entries.values()].sort((a,b)=>rowKey(a.row).localeCompare(rowKey(b.row)))){
   const m=pack5UpperRecord(row)?.get(k);
   if(!m||m.length!==length)throw Error('Pack5 source geometry changed after indexing');
   out.set(m,at);at+=m.length;
  }
  return out;
 }
 *values(){for(const k of this.keys())yield this.get(k);}
 withAdded(row){
  const k=rowKey(row),record=pack5UpperRecord(row);
  if(!record)return {index:this,affected:new Set()};
  if(this.#rows.has(k)||this.#rows.size>=4096)throw Error('Pack5 upper index row budget');
  const owners=new Map(this.#owners),rows=new Map(this.#rows),affected=new Set(record.keys()),frozen=Object.freeze([...row]);
  for(const [owner,m] of record){
   const previous=owners.get(owner),entries=new Map(previous?.entries),floats=(previous?.floats??0)+m.length;
   if(floats*4>UPPER_SECTION_BYTES)throw Error('Pack5 upper section geometry budget exceeded');
   entries.set(k,{row:frozen,length:m.length});owners.set(owner,{entries,floats});
  }
  rows.set(k,affected);return {index:new Pack5UpperIndex(owners,rows),affected:new Set(affected)};
 }
 withRemoved(anchor){
  const k=rowKey(anchor),affected=this.#rows.get(k);
  if(!affected)return {index:this,affected:new Set()};
  const owners=new Map(this.#owners),rows=new Map(this.#rows);
  for(const owner of affected){
   const old=owners.get(owner),entries=new Map(old.entries),entry=entries.get(k);
   entries.delete(k);
   if(entries.size)owners.set(owner,{entries,floats:old.floats-entry.length});else owners.delete(owner);
  }
  rows.delete(k);return {index:new Pack5UpperIndex(owners,rows),affected:new Set(affected)};
 }
}
export function buildPack5UpperSections(rows){
 if(!Array.isArray(rows)||rows.length>4096)throw Error('Pack5 upper row budget');
 let index=new Pack5UpperIndex();
 for(const row of rows)index=index.withAdded(row).index;
 return index;
}
export function pack5UpperMesh(index,key){return index.get(key)??EMPTY;}
