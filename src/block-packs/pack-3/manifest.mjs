// Pack 3 ownership ledger. Roster numbers are NOT persistent block IDs.
// Reaudit against main + coordination Issue #109 before allocating another ID.
import {PACK3_ROOFING_ASSETS} from './roofing-materials.mjs';
import {PACK3_ROOF_GEOMETRY} from './roof-geometry.mjs';
import {PACK3_FORTIFIED_ASSETS} from './fortified-pieces.mjs';
import {PACK3_ORNAMENTAL_ASSETS} from './ornamental-pieces.mjs';
import {PACK3_MONUMENTAL_ASSETS} from './monumental-pieces.mjs';
export const PACK3_COORDINATION=Object.freeze({
  issue:'https://github.com/hdog960/Mythwrought/issues/109',
  auditedMain:'f27a887b1b98fc5fd6e6f3a80856d1b92f6ebf84',
  integratedCheckpoint:'006',
  provisionalIdMin:109,provisionalIdMax:158,reservedId:255,
  sourceOwner:'src/block-packs/pack-3/',
  testOwner:'tests/block-packs/pack-3/',
  phase:'Gate A v0.10',liveInstalled:false
});
const roofing=Object.freeze([
  [23,'Wooden shingles',109],[24,'Clay roof tiles',110],
  [25,'Slate roof tiles',111],[26,'Thatched roofing',112],
  [27,'Roof stair blocks',113],[28,'Roof corner blocks',114],
  [29,'Roof ridge blocks',115]
]);
const monumental=Object.freeze([
  [69,'Castle wall blocks',116],[70,'Battlement blocks',117],[71,'Stone buttresses',118],
  [72,'Ornamental columns',119],[73,'Decorative cornices',120],
  [74,'Large arched window blocks',121],[75,'Decorative stone reliefs',122],
  [76,'Aqueduct channel blocks',123],[77,'Crystal-topped spire blocks',124],
  [78,'Carved statue blocks',125]
]);
export const PACK3_ROSTER=Object.freeze([...roofing,...monumental].map(([roster,name,id=null])=>
  Object.freeze({
    roster,name,id,
    implementation:id===null?'not-started':'physical-candidate',
    duplicateAudit:id===null?'pending-new-main-review':'new-vs-main-006',
    dependency:roster>=27&&roster<=29?'generic :12 shapes and :00 stateful rotation':
      roster===76?'generic :00 rotated shape/persistence; water containment requires future fluid engine':
      roster===77?'generic :00 rotation save; lighting requires a shared light engine':
      roster>=69&&roster<=78?'generic :00 targeting/collision and safe rotation save integration':
      'generic :00 interaction/selection/save registration',
    tests:id===null?'not-run':'isolated-node-regression',
    integrated:false
  })));
export function validatePack3Manifest(){
  if(PACK3_ROSTER.length!==17)throw new Error('Pack 3 roster must contain 17 families');
  const ids=PACK3_ROSTER.filter(a=>a.id!==null).map(a=>a.id);
  if(new Set(ids).size!==ids.length)throw new Error('Pack 3 duplicate persistent ID');
  for(const id of ids)if(!Number.isInteger(id)||id<109||id>158||id===255)
    throw new RangeError('Pack 3 ID outside reserved range');
  const assets=[...PACK3_ROOFING_ASSETS,...PACK3_ROOF_GEOMETRY,...PACK3_FORTIFIED_ASSETS,...PACK3_ORNAMENTAL_ASSETS,...PACK3_MONUMENTAL_ASSETS];
  if(ids.length!==assets.length||assets.some(a=>
    !PACK3_ROSTER.some(row=>row.roster===a.roster&&row.id===a.id)))
    throw new Error('Ledger and physical Pack 3 asset definitions disagree');
  for(const a of [...PACK3_ROOF_GEOMETRY,...PACK3_FORTIFIED_ASSETS,...PACK3_ORNAMENTAL_ASSETS,...PACK3_MONUMENTAL_ASSETS]){
    if(a.boxes.length>32||a.collision.boxes!==a.selection.boxes||a.integrated)
      throw new Error('Invalid isolated Pack 3 shape contract');
  }
  return true;
}
