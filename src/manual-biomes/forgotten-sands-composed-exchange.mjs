// Detached prepublication evidence. Matches current main's composed terrain
// and water mesh expressions. Requires all layer readers to be mounted;
// does not claim an atomic live renderer lease or reserve real GPU slots.
import {planP0EmptyOwnerExchange} from './forgotten-sands-empty-owner-exchange.mjs';
const concat=(a,b)=>{if(!b.length)return a;const v=new Float32Array(a.length+b.length);v.set(a);v.set(b,a.length);return v;};
export function prepareP0ComposedExchange({world,player,selected,H,V,I2,P3,M14,B,revision,farBytes}={}){
 if(typeof revision!=='function'||!world?.pack3Runtime||!world?.manual14Layer||!world?.pack5Layer)
  throw Error('All current composed layer readers required');
 const epoch=revision(),memo=new Map();
 if(!Number.isSafeInteger(epoch)||epoch<0)throw Error('Invalid mutation epoch');
 const current=()=>revision()===epoch;
 const inspect=(s,k)=>{
  if(!current())throw Error('Stale source while composing');
  if(memo.has(k))return memo.get(k);
  const {cx,cz,section}=s;
  if(section<0)throw Error('Surface approach only');
  const manual=M14.meshManual14Chunk(world.manual14Layer,cx,cz,section);
  const original=V.meshChunk(world,cx,cz,section);
  const p3=P3.combinePack3ChunkMesh(original,world.pack3Runtime,cx,cz,section);
  const p5=section>0?world.pack5Layer.upperMesh(k):new Float32Array();
  const solid=concat(concat(p3,manual.opaque),p5);
  const water=concat(I2.pack2WaterSectionVertices(world,cx,cz,section),manual.transparent);
  if(section>0)B.validateUpperSectionGeometry(solid,water);
  const e=Object.freeze({complete:true,solidBytes:solid.byteLength,waterBytes:water.byteLength});
  memo.set(k,e);return e;
 };
 const p=planP0EmptyOwnerExchange({world,player,selected,H,inspect,farBytes,sourceCurrent:current});
 const selectedKeys=Object.freeze(selected.map(s=>H.runtimeMeshKey(s.cx,s.cz,s.section)));
 const bodyKeys=Object.freeze((H.physicalBodyRegions(player)??[]).map(r=>r.key));
 // No allocation, map publication, or external write authority.
 const revalidate=(nowSelected,nowPlayer)=>{
  if(!p.allowed||!current())return false;
  const keys=nowSelected.map(s=>H.runtimeMeshKey(s.cx,s.cz,s.section));
  const body=H.physicalBodyRegions(nowPlayer)?.map(r=>r.key);
  if(JSON.stringify(keys)!==JSON.stringify(selectedKeys)||JSON.stringify(body)!==JSON.stringify(bodyKeys)||
     nowPlayer.feet<16||nowPlayer.feet>=20||p.removed&&H.upperOccupancy(world,p.removed))return false;
  return current();
 };
 return Object.freeze({plan:p,epoch,inspected:memo.size,inspect,revalidate,placementAuthority:false});
}
