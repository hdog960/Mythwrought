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
export function buildPack5UpperSections(rows){
 const parts=new Map(),lengths=new Map();
 for(const row of rows){
  const record=pack5UpperRecord(row);if(!record)continue;
  for(const [k,mesh] of record){
   const n=(lengths.get(k)??0)+mesh.length;
   if(n*4>UPPER_SECTION_BYTES)throw Error('Pack5 upper section geometry budget exceeded');
   lengths.set(k,n);if(!parts.has(k))parts.set(k,[]);parts.get(k).push(mesh);
  }
 }
 return new Map([...parts].map(([k,meshes])=>{
  const out=new Float32Array(lengths.get(k));let at=0;
  for(const mesh of meshes){out.set(mesh,at);at+=mesh.length;}
  return [k,out];
 }));
}
export function pack5UpperMesh(index,key){return index.get(key)??EMPTY;}
