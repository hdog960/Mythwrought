// Opt-in ownership and placement preflight; no producer imports or runtime writes.
export const OWNERS=Object.freeze({scene48:':48',environment24:':24',fittings36:':36'});
const fail=reason=>({ok:false,level:'NOT_VERIFIED',reason});
const validBox=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&b.min.length===3&&b.max.length===3&&b.min.every((n,i)=>Number.isFinite(n)&&Number.isFinite(b.max[i])&&n<b.max[i]);
const overlap=(a,b,m=0)=>a.min.every((n,i)=>n<b.max[i]+m&&b.min[i]<a.max[i]+m);
export function inspectNonblockOwnership({producers,seed,protectedBoxes=[],blockIds=[],maxTotalTriangles=200000,maxInstances=1024,clearance=0}={}){
 if(!Number.isSafeInteger(seed)||!Array.isArray(producers)||producers.length!==3||!Array.isArray(protectedBoxes)||!protectedBoxes.every(validBox)||!Array.isArray(blockIds)||!Number.isSafeInteger(maxTotalTriangles)||maxTotalTriangles<1||!Number.isSafeInteger(maxInstances)||maxInstances<1||!Number.isFinite(clearance)||clearance<0)return fail('invalid invocation');
 const namespaces=new Set(),keys=new Set(),families=new Set(),boxes=[];let triangles=0,count=0;
 for(const p of producers){
  if(!p||!Object.hasOwn(OWNERS,p.namespace)||p.owner!==OWNERS[p.namespace]||namespaces.has(p.namespace)||typeof p.head!=='string'||!/^[a-f0-9]{40}$/.test(p.head)||p.sourceAuthenticated!==true||!Array.isArray(p.objects))return fail('missing or unauthenticated producer');
  namespaces.add(p.namespace);
  for(const o of p.objects){
   if(!o||o.contract!=='nonblock-object-v1'||typeof o.sceneId!=='string'||!new RegExp('^'+p.namespace+':[a-z0-9-]+$').test(o.sceneId)||blockIds.includes(o.sceneId)||!Number.isSafeInteger(o.seed)||o.seed!==seed||!Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(Number.isSafeInteger)||!Number.isSafeInteger(o.variant)||o.variant<0||o.variant>3)return fail('invalid identity');
   const key='nb1:'+encodeURIComponent(o.sceneId)+':'+seed+':'+o.anchor.join(',')+':'+o.variant;
   if(o.instanceKey!==key||keys.has(key))return fail('duplicate or noncanonical instance');keys.add(key);families.add(o.sceneId);
   if(!Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length||!o.selectionAabbs.every(validBox)||o.breakIntent?.action!=='remove-object'||o.breakIntent?.targetKey!==key||o.breakIntent?.requiresOwner!==':00'||o.persistence?.kind!=='schema1-external-tombstone-sidecar'||o.persistence?.key!==key)return fail('missing picking or removal contract');
   if(!Number.isSafeInteger(o.render?.triangleCount)||o.render.triangleCount<1||o.render.instanced!==true||!Number.isSafeInteger(o.render.maxInstancesPerBatch)||o.render.maxInstancesPerBatch<1||o.render.maxInstancesPerBatch>512)return fail('invalid render metadata');
   triangles+=o.render.triangleCount;count++;if(triangles>maxTotalTriangles||count>maxInstances)return fail('scene budget exceeded');
   for(const box of o.selectionAabbs){
    if(protectedBoxes.some(b=>overlap(box,b,clearance)))return fail('protected geometry intersection');
    if(boxes.some(b=>overlap(box,b,clearance)))return fail('overlapping object footprints');
    boxes.push(box);
   }
  }
 }
 return {ok:true,level:'DECLARED_SOURCE_FIXTURE_ONLY',families:families.size,instances:count,triangles};
}
