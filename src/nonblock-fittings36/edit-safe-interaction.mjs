// :36 opt-in interaction staging; never writes production world or schema-1 saves.
export function createEditSafeInteraction({seed,objects,inspectMount,pick}){
 if(!Number.isSafeInteger(seed)||!Array.isArray(objects)||typeof inspectMount!=='function'||typeof pick!=='function')throw new TypeError('invalid session');
 const registered=new Map(),removed=new Set();
 const overlaps=(a,b)=>a.min.every((n,i)=>n<b.max[i]&&a.max[i]>b.min[i]);
 for(const o of objects){
  if(o?.contract!=='nonblock-object-v1'||o.seed!==seed||!o.instanceKey||registered.has(o.instanceKey)||
    !Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(Number.isSafeInteger)||
    !Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length||o.breakIntent?.targetKey!==o.instanceKey||
    o.breakIntent?.requiresOwner!==':00')throw new TypeError('invalid or duplicate descriptor');
  const witness=inspectMount(Object.freeze([...o.anchor]),o.attachment);
  if(witness?.verified!==true||witness.playerEdited!==false||witness.mountSupported!==true||witness.occupied!==false)throw new RangeError('mount unverified or edit-protected');
  for(const other of registered.values()){
   if(o.collisionIntent==='solid-proposed'&&other.collisionIntent==='solid-proposed'&&
     o.selectionAabbs.some(a=>other.selectionAabbs.some(b=>overlaps(a,b))))throw new RangeError('overlapping solid props');
  }
  registered.set(o.instanceKey,o);
 }
 const visible=()=>[...registered.values()].filter(o=>!removed.has(o.instanceKey));
 return Object.freeze({
  visible,
  pick:ray=>pick(visible(),ray),
  breakPicked:(ray,authorize)=>{
   if(typeof authorize!=='function')throw new TypeError('missing :00 approval');
   const hit=pick(visible(),ray);if(!hit)return null;
   const o=registered.get(hit.instanceKey);
   if(!o||removed.has(o.instanceKey)||authorize(Object.freeze({action:'remove-object',instanceKey:o.instanceKey,sceneId:o.sceneId}))!==true)return null;
   removed.add(o.instanceKey);
   return Object.freeze({action:'remove-object',instanceKey:o.instanceKey,sidecarOnly:true});
  },
  snapshot:()=>({contract:'nonblock-object-v1',seed,tombstones:[...removed].sort()}),
  restore:sidecar=>{
   if(sidecar?.contract!=='nonblock-object-v1'||sidecar.seed!==seed||!Array.isArray(sidecar.tombstones)||
      new Set(sidecar.tombstones).size!==sidecar.tombstones.length||sidecar.tombstones.some(k=>!registered.has(k)))
     throw new TypeError('invalid external tombstones');
   removed.clear();for(const k of sidecar.tombstones)removed.add(k);
  }
 });
}
