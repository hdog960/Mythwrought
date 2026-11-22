/** Adapter to the authentic, unmodified Manual Five Pack producer.
 * Only samples source-authored alternative materials. Never assigns a source
 * building variant/yaw, writes to a world, or declares structural acceptance.
 */
import {auditRoadmapAAll79PackBacking} from './roadmap-a-all79-original-pack5-backing-census.mjs';
import {buildRoadmapA79PhysicalHoldMatrix} from './roadmap-a-physical-integration-holds-core.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
import {getPack5Surface,PACK5_SURFACE_MATERIALS} from '../../block-packs/pack-5/architectural-surfaces.mjs';
const required=(v,msg)=>{if(!v)throw Error('Roadmap A authentic producer options: '+msg);};
/** Source palette and 4-yaw support options: NONE of these is a building choice. */
export function inspectRoadmapAUnassignedPack5Options(){
 const options={};
 for(const symbol of ['pack5:079','pack5:080','pack5:081']){
  const family=PACK5_BUILDER_CATALOG.find(row=>row.symbolicId===symbol);
  required(family&&family.variants?.length===2,'actual Pack5 catalog drift '+symbol);
  const choices=[];
  for(const variant of family.variants){
   const source=getPack5Surface(symbol,variant);
   const resolved=[0,1,2,3].map(yaw=>resolveManualFivePackAsset(symbol,{orientation:yaw,variant}));
   required(resolved.every(r=>r.visibleBoxes.length===source.art.length&&
    r.collisionBoxes.length>0&&r.livePlaceable===false&&r.saveWritten===false),
    'source/real physical producer asset mismatch '+symbol+'/'+variant);
   required(source.art.every(a=>Object.hasOwn(PACK5_SURFACE_MATERIALS,a.material)),
    'missing authentic source RGBA palette '+symbol+'/'+variant);
   choices.push({
    symbol,variant,visibleBoxes:resolved[0].visibleBoxes.length,
    collisionBoxes:resolved[0].collisionBoxes.length,
    supportPolicy:resolved[0].supportPolicy,
    supportByYaw:resolved.map(r=>r.supportOffsets.map(x=>[...x])),
    paletteMaterialKeys:[...new Set(source.art.map(x=>x.material))].sort(),
    chosenForRoadmapA:false
   });
  }
  options[symbol]=choices;
 }
 return options;
}
export function auditRoadmapA79PhysicalIntegrationHolds(){
 return buildRoadmapA79PhysicalHoldMatrix(
  auditRoadmapAAll79PackBacking(),inspectRoadmapAUnassignedPack5Options());
}
