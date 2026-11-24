// MYTHWROUGHT SNOW S10 source-owner, zero-per-cell RGB object allocation.
// DETACHED: only a potential future ORIGINAL M7 meshChunk-local callable.
// It does NOT alter source world, saved edits, caves, material tags,
// old biome terrain, physics, chunk ownership, generator registration or PWA.
// A single mutable 3-float scratch is valid ONLY during synchronous mesh
// emission: appendVertex immediately copies each component into a GPU array.
// No object, Map, array or frozen palette is allocated per accepted cell.
export const S10_M7_SOURCE='mythwrought-five-surface-regions-v7';
const clamp=n=>Math.max(0,Math.min(1,n));
const valid=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
export function createSnowS10MeshResidentPigment(seed,biomeAt){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||
    typeof biomeAt!=='function')
   throw new TypeError('S10 requires exact original M7 mesh seed and climate function');
 const phase=(seed%223)*.017;
 const rgb=[0,0,0];
 let requests=0,climateReads=0,accepted=0;
 function colorAt(x,y,z,id,sourceSurface,observed,below,above,
   editedCap,editedSupport,caveCap,caveSupport){
  requests++;
  if(!valid(x)||!valid(z)||!Number.isSafeInteger(y)||y<2||y>19||
     id!==272&&id!==276&&id!==279||
     !sourceSurface||sourceSurface.top!==y||sourceSurface.id!==id||
     observed!==id||below===0||above!==0||
     editedCap!==false||editedSupport!==false||
     caveCap!==undefined||caveSupport!==undefined)return undefined;
  climateReads++;
  const region=biomeAt(x,z,seed);
  if(region?.name!=='snow'||!Number.isFinite(region.weight)||
     region.weight<0||region.weight>1)return undefined;
  const shift=.012*Math.sin(x*.067+z*.041+phase)+
    .009*Math.cos(x*.029-z*.053-phase*.5)+
    .009*(region.weight-.5);
  const r=id===272 ? .835 : id===276 ? .786 : .681;
  const g=id===272 ? .861 : id===276 ? .831 : .722;
  const b=id===272 ? .866 : id===276 ? .848 : .738;
  rgb[0]=Math.round(clamp(r+shift)*1e6)/1e6;
  rgb[1]=Math.round(clamp(g+shift)*1e6)/1e6;
  rgb[2]=Math.round(clamp(b+shift)*1e6)/1e6;
  accepted++;
  return rgb;
 }
 return Object.freeze({
  kind:'detached-original-M7-S10-single-mesh-rgb-scratch',
  colorAt,
  stats:()=>Object.freeze({requests,climateReads,accepted}),
  originalMaterialUvAndShapeUnchanged:true,
  scratchOwnedOnlyByThisSyncMesh:true,
  requiresOriginalSourceWitness:true,
  noPlayerWorldWrites:true,
  generatorUnregistered:true,
  realIphoneAcceptanceUnrun:true
 });
}
