/** Preview-only, original producer-authenticated Pack5 box witnesses.
 * Requires explicit caller-supplied variants and yaw; does not choose materials
 * for Roadmap A or edit original source/games/save worlds.
 */
import {auditExactPack5SeamCandidates} from './roadmap-a-physical-source-seam-core.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
import {getPack5Surface,surfaceBoxMesh,PACK5_SURFACE_MATERIALS} from '../../block-packs/pack-5/architectural-surfaces.mjs';
const requireTrue=(x,m)=>{if(!x)throw Error('Roadmap A authentic Pack5 preview: '+m);};
const allowedFields=new Set(['symbol','variant','orientation','at','previewFixtureOnly']);
const signature=b=>b.map(v=>(Math.round(v*1000000)/1000000).toFixed(6)).join(',');
/** This adapter builds isolated, test-only source-authored art descriptors, NOT meshes for a live world. */
export function resolveExplicitPack5PreviewFixture(request){
 requireTrue(request&&typeof request==='object'&&!Array.isArray(request)&&
  Object.keys(request).every(k=>allowedFields.has(k))&&request.previewFixtureOnly===true,
  'only explicit isolated preview fixtures are permitted, never source buildings');
 const {symbol,variant,orientation,at}=request;
 requireTrue(['pack5:079','pack5:080','pack5:081'].includes(symbol)&&
  typeof variant==='string'&&Number.isInteger(orientation)&&orientation>=0&&orientation<=3&&
  Array.isArray(at)&&at.length===3&&at.every(Number.isSafeInteger),
  'original source symbol, explicit authored variant/yaw and integer test anchor required');
 const catalog=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===symbol);
 requireTrue(catalog?.variants?.includes(variant),'variant not authored by original Pack5 physical producer');
 const surface=getPack5Surface(symbol,variant);
 const asset=resolveManualFivePackAsset(symbol,{variant,orientation});
 const mesh=surfaceBoxMesh(surface,{rotation:orientation});
 requireTrue(asset.livePlaceable===false&&asset.saveWritten===false&&
  surface.art.length===asset.visibleBoxes.length&&mesh.vertexCount===surface.art.length*24&&
  mesh.triangles===surface.art.length*12&&mesh.positions.length===mesh.vertexCount*3&&
  mesh.colors.length===mesh.vertexCount*4,'original Pack5 physical producer shape mismatch');
 const originalVisibleSignatures=asset.visibleBoxes.map(signature).sort();
 const art=[];
 for(let i=0;i<surface.art.length;i++){
  const original=surface.art[i],rgba=PACK5_SURFACE_MATERIALS[original.material];
  requireTrue(Array.isArray(rgba)&&rgba.length===4&&rgba.every(Number.isFinite)&&rgba[3]===1,
   'original producer palette must be fully opaque');
  const values=[];
  for(let j=i*24*3;j<(i+1)*24*3;j+=3){
   values.push([mesh.positions[j],mesh.positions[j+1],mesh.positions[j+2]]);
  }
  const bounds=[0,1,2].map(axis=>Math.min(...values.map(v=>v[axis]))).concat(
   [0,1,2].map(axis=>Math.max(...values.map(v=>v[axis]))));
  const colorSlice=mesh.colors.slice(i*24*4,i*24*4+4);
  requireTrue(colorSlice.length===4&&colorSlice.every((v,n)=>Math.abs(v-rgba[n])<=0.000001),
   'original source-authored RGBA/physical mesh material mismatch');
  art.push({bounds,material:original.material,color:[...rgba]});
 }
 requireTrue(JSON.stringify(art.map(x=>signature(x.bounds)).sort())===
  JSON.stringify(originalVisibleSignatures),'original mesh and builder-visible asset AABBs differ');
 return {previewFixtureOnly:true,symbol,variant,orientation,at:[...at],art};
}
export function auditExplicitPack5SourcePreviewSeams(requests){
 requireTrue(Array.isArray(requests)&&requests.length>=1&&requests.length<=96,
  'preview fixture count outside bounded source-only limit');
 const fixtures=requests.map(resolveExplicitPack5PreviewFixture);
 const report=auditExactPack5SeamCandidates(fixtures);
 return {...report,originalSourceAuthoredPack5MeshesChecked:true,
  allVariantsAndOrientationsExplicitlySuppliedByPreviewCaller:true,
  acceptedForInstalledPackRenderer:false,acceptedForAnyRoadmapABuilding:false,
  actualWebGL2OrIPhonePerformanceMeasured:false};
}
