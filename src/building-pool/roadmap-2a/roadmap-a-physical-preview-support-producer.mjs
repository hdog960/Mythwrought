/** Original source-backed Manual Five Pack preview support audit. No A5 inputs. */
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
import {auditExplicitPack5PreviewSupports} from './roadmap-a-physical-preview-support-core.mjs';
const allowedFields=new Set(['symbol','variant','orientation','at','previewFixtureOnly']);
const permitted=new Set(['pack5:079','pack5:080','pack5:081']);
const requireTrue=(v,s)=>{if(!v)throw Error('Roadmap A original Pack5 support producer: '+s);};
/** Only explicit, isolated test fixtures; never chooses a variant for A5 buildings. */
export function resolveOriginalPack5SupportPreview(request){
  requireTrue(request&&typeof request==='object'&&!Array.isArray(request)&&
    request.previewFixtureOnly===true&&Object.keys(request).every(k=>allowedFields.has(k)),
    'source-building and other arbitrary fields forbidden');
  const {symbol,variant,orientation,at}=request;
  requireTrue(permitted.has(symbol)&&typeof variant==='string'&&variant.length>0&&
    Number.isInteger(orientation)&&orientation>=0&&orientation<4&&
    Array.isArray(at)&&at.length===3&&at.every(Number.isSafeInteger)&&
    at.every(n=>Math.abs(n)<=4096),'explicit original test-only material, rotation and anchor required');
  const family=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===symbol);
  requireTrue(family&&family.variants.includes(variant),'variant not in authentic Pack5 family');
  const asset=resolveManualFivePackAsset(symbol,{variant,orientation});
  requireTrue(asset.symbol===symbol&&asset.variant===variant&&asset.orientation===orientation&&
    asset.sourcePack===5&&asset.builderResolvable===true&&asset.physical===true&&
    asset.livePlaceable===false&&asset.saveWritten===false&&
    asset.supportPolicy===family.attachment,
    'original physical producer ABI changed');
  requireTrue(asset.occupiedOffsets.length===1&&asset.occupiedOffsets[0].join(',')==='0,0,0'&&
    asset.collisionBoxes.length>0&&asset.visibleBoxes.length>0,
    'original surface not a single source-authored physical cell');
  return {previewFixtureOnly:true,selectedForRoadmapASource:false,
    symbol,variant,orientation,at:[...at],
    occupiedOffsets:asset.occupiedOffsets.map(v=>[...v]),
    supportOffsets:asset.supportOffsets.map(v=>[...v]),
    supportPolicy:asset.supportPolicy,
    collisionBoxes:asset.collisionBoxes.map(v=>[...v])};
}
export function auditOriginalPack5PreviewPhysicalSupports(requests){
  requireTrue(Array.isArray(requests)&&requests.length>0&&requests.length<=96,
    'bounded isolated physical test fixture list required');
  const report=auditExplicitPack5PreviewSupports(requests.map(resolveOriginalPack5SupportPreview));
  return {...report,allCollidersAndOffsetsFromOriginalManualFivePack:true,
    allAlternativesExplicitlyProvidedByPreviewCaller:true,
    testOnlyNoOriginalA5BuildingMaterialsSelected:true,
    worldPhysicalStructuralLoadAcceptance:false,
    originalGameRuntimeAcceptance:false};
}
