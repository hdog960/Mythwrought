// E2C research bridge: actual original GPU uploader, owner-granted native
// slots, real source mesh, and bounded synchronous publication. Not main.mjs.
import {uploadChunkBuffer} from '../gpu-recovery.mjs';
import {stageSkyIslandGpuTransaction} from '../floating-islands/sky-gpu-transaction.mjs';
import {skyIslandMeshKey,skyIslandBodyRegions} from '../floating-islands/sky-runtime-adapter.mjs';
const fail=s=>{throw Error('Wilds upper renderer: '+s);};
export function createWildsUpperFrameOwner(host,gl,chunks){
 if(!host||typeof host.meshUpper!=='function'||!(chunks instanceof Map)||!gl)fail('original source and renderer map required');
 const published=new Map();
 const resident=(region,revision=host.regionRevision(region.key))=>{
   const row=published.get(region.key);
   return !!row&&chunks.get(region.key)===row.chunk&&row.revision===revision;
 };
 function frame({position,visible=[],nativeWanted,contextCurrent=()=>true}={}){
   if(!position||![position.x,position.feet,position.z].every(Number.isFinite)||!Array.isArray(visible)||visible.length>256||
      !Array.isArray(nativeWanted)||new Set(nativeWanted).size!==nativeWanted.length||nativeWanted.some(k=>typeof k!=='string'||k.startsWith('sky:')))
     fail('bounded native owner grant required');
   const actual=[...chunks.keys()].filter(k=>!k.startsWith('sky:'));
   // The original owner must perform its own native retirement, including
   // transparent water buffers. This bridge never retires native geometry.
   if(actual.length!==nativeWanted.length||actual.some(k=>!nativeWanted.includes(k)))
     return {status:'blocked',reason:'Native renderer must first reconcile its own desired keys'};
   if(position.feet<-3||nativeWanted.length>25)return {status:'blocked',reason:'Native depth ownership retained'};
   const required=skyIslandBodyRegions(position);
   const available=Math.min(8,25-nativeWanted.length);
   if(required.length>available)return {status:'blocked',reason:'Insufficient owner-granted upper slots'};
   const chosen=new Map(required.map(r=>[r.key,r]));
   for(const p of visible){
     const key=skyIslandMeshKey(p.cx,p.cz,p.section);
     if(Math.max(Math.abs(p.cx-Math.floor(position.x/16)),Math.abs(p.cz-Math.floor(position.z/16)))>6)continue;
     if(chosen.size>=available)break;
     chosen.set(key,{...p,key});
   }
   const jobs=[...chosen.values()].filter(r=>!resident(r)).slice(0,2);
   const rev=host.revision;
   const meshes=jobs.map(r=>host.meshUpper(r.cx,r.cz,r.section));
   if(meshes.reduce((n,m)=>n+m.bytes,0)>2*1024*1024)fail('upper upload byte budget');
   if(!contextCurrent()||host.revision!==rev)return {status:'stale'};
   const t=stageSkyIslandGpuTransaction({gl,existingChunks:chunks,batch:{meshes},
     desiredKeys:[...nativeWanted,...chosen.keys()],uploadBuffer:uploadChunkBuffer});
   if(!contextCurrent())return {status:'context-lost',needsRendererReset:true};
   if(host.revision!==rev||chunks.size!==t.baseEntries.length||t.baseEntries.some(([k,v])=>chunks.get(k)!==v)){
     for(const b of t.stagedBuffers)gl.deleteBuffer(b);return {status:'stale'};
   }
   chunks.clear();for(const [k,v] of t.nextEntries)chunks.set(k,v);
   for(const b of t.obsoleteBuffers)gl.deleteBuffer(b);
   for(const k of [...published.keys()])if(!chunks.has(k))published.delete(k);
   for(const j of jobs)published.set(j.key,{chunk:chunks.get(j.key),revision:host.regionRevision(j.key)});
   return {status:'published',uploads:jobs.length,slots:chunks.size,requiredReady:required.every(r=>resident(r))};
 }
 return Object.freeze({frame,resident});
}
