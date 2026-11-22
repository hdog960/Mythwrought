// MYTHWROUGHT D19 original glazing variation: source-authentic, NONPLACED.
// Pack 4 clear-glass ID159 or sun/moon-stained physical ID160/161 are ALTERNATIVES,
// never stacked within the same voxel (verified real physical collision/selection).
// Original W16/17 source and immutable open-air geometry remain untouched.
const key=a=>a.join(',');
const wallRoles=new Set(['wall','partition','column']);
const byBiome=Object.freeze({
 temperate:Object.freeze({id:160,ref:'pack4:031',name:'sun-stained'}),
 desert:Object.freeze({id:160,ref:'pack4:031',name:'sun-stained'}),
 snow:Object.freeze({id:161,ref:'pack4:031',name:'moon-stained'}),
 'enchanted-forest':Object.freeze({id:161,ref:'pack4:031',name:'moon-stained'}),
 mountain:Object.freeze({id:161,ref:'pack4:031',name:'moon-stained'})
});
const original=Object.freeze({id:159,ref:'pack4:030',name:'clear'});
const yaw=Object.freeze({north:0,east:1,south:2,west:3});
function isAt(a){return Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger)}
function checkedPack4(fn,candidate,facing){
 const a=fn(candidate.ref,{candidateId:candidate.id,rotation:facing});
 if(!a||a.id!==candidate.id||a.ref!==candidate.ref||a.rotation!==yaw[facing]||
    a.hasRealPhysicalGeometry!==true||a.registeredInLiveGame!==false||
    !Array.isArray(a.visible)||!a.visible.length||!Array.isArray(a.selection)||
    !a.selection.length||!Array.isArray(a.collision)||!a.collision.length||
    !a.previewMesh||a.previewMesh.stride!==10||
    !(a.previewMesh.opaque instanceof Float32Array)||
    !(a.previewMesh.translucent instanceof Float32Array))
   throw Error('Missing original physical Pack4 clear/stained glazing '+candidate.ref+' '+candidate.id);
 const tri=(a.previewMesh.opaque.length+a.previewMesh.translucent.length)/30;
 if(!Number.isSafeInteger(tri)||tri<=0||tri>320)
   throw Error('Original stained-glass source exceeds bounded physical triangles');
 return Object.freeze({candidateId:a.id,sourceRef:a.ref,rotation:a.rotation,
  physicalVisibleParts:a.visible.length,physicalCollisionParts:a.collision.length,
  originalOpaqueTriangles:a.previewMesh.opaque.length/30,
  originalTranslucentTriangles:a.previewMesh.translucent.length/30,
  originalSourcePack4Mesh:true,finalAlphaSorted:false,worldRegistered:false});
}
export function planD19ExclusiveOriginalWindowGlass(blueprint,{
 resolvePack4Asset,maxPhysicalSamples=12,stainedModulo=5
}={}){
 if(!blueprint||blueprint.creatorApproved!==false||blueprint.integrated!==false||
    blueprint.worldPlaced!==false||!Array.isArray(blueprint.openings)||
    !Array.isArray(blueprint.cells)||!byBiome[blueprint.biome])
   throw Error('Original W16/17 theoretical source required; no live replacement permitted');
 if(typeof resolvePack4Asset!=='function')throw TypeError('Original Pack4 physical resolver mandatory');
 if(!Number.isSafeInteger(maxPhysicalSamples)||maxPhysicalSamples<1||maxPhysicalSamples>16||
    !Number.isSafeInteger(stainedModulo)||stainedModulo<3||stainedModulo>8)
   throw RangeError('D19 glazing sample and substitution budget violation');
 const source=new Map();
 for(const c of blueprint.cells){
  if(!isAt(c.at)||source.has(key(c.at)))throw Error('Duplicate/invalid original window source voxel');
  source.set(key(c.at),c);
 }
 const windows=blueprint.openings.filter(o=>o.kind==='window');
 if(windows.length<8)throw Error('No original actual window openings');
 const all=[],unframed=[];
 for(const o of windows){
  if(!isAt(o.at)||!Object.hasOwn(yaw,o.facing))
   throw Error('Window lacks original physical facade direction');
  const c=source.get(key(o.at));
  if(!c||c.role!=='window'||c.asset!=='pack4:030')
   throw Error('Original window opening lacks actual Pack4 clear glazing source');
  const [x,y,z]=o.at;
  const siblings=o.facing==='north'||o.facing==='south'?
    [[x-1,y,z],[x+1,y,z]]:[[x,y,z-1],[x,y,z+1]];
  const jambs=siblings.filter(p=>wallRoles.has(source.get(key(p))?.role)).length;
  const palette=byBiome[blueprint.biome];
  // Stable per-source-coordinate density, not random; zero world-edit or UUID.
  const selected=(Math.abs(Math.imul(x,31)+Math.imul(z,17))%stainedModulo)===0;
  const candidate=selected?palette:original;
  const plan=Object.freeze({at:Object.freeze([...o.at]),sourceOriginalAsset:'pack4:030',
    originalCellRetained:true,replacementOnly:true,neverOverlayOriginalGlass:true,
    candidateId:candidate.id,candidateRef:candidate.ref,candidateMaterial:candidate.name,
    authoritativeFacadeFacing:o.facing,originalCompilerFacingIgnored:c.facing!==o.facing,
    structuralJambCount:jambs,missingOneOrMoreJambs:jambs<2,
    sourceWindowRequiresRemediation:jambs<2,worldPlaced:false,
    creatorApproved:false,productionGlazingRegistered:false});
  all.push(plan);if(jambs<2)unframed.push(plan);
 }
 const requested=Math.min(maxPhysicalSamples,all.length);
 const physicalSamples=[];
 for(let i=0;i<requested;i++){
  const index=Math.floor(i*all.length/requested),p=all[index];
  physicalSamples.push(Object.freeze({at:p.at,...checkedPack4(resolvePack4Asset,
   {id:p.candidateId,ref:p.candidateRef},p.authoritativeFacadeFacing)}));
 }
 return Object.freeze({format:'mythwrought.builder-d.d19.exclusive-source-pack4-glazing.v1',
  blueprintId:blueprint.id,biome:blueprint.biome,
  originalWindowCount:windows.length,plannedOriginalWindowChoices:Object.freeze(all),
  plannedStainedGlassCount:all.filter(x=>x.candidateId!==159).length,
  unframedOriginalSources:Object.freeze(unframed),
  noJambOriginalSources:unframed.filter(x=>x.structuralJambCount===0).length,
  sourcePhysicalSamples:Object.freeze(physicalSamples),
  originalPack4CandidateGeometryResolved:true,glazingMutuallyExclusive:true,
  unchangedOriginalSourceCells:true,noSameCellWindowLayering:true,
  sourceJambAndGlazingPhysicalAcceptance:false,worldMountsAccepted:false,
  userArtApproval:false,iphonePerformanceAcceptance:false,
  originalSourceFilesChanged:false,worldPlaced:false,integrated:false
 });
}
