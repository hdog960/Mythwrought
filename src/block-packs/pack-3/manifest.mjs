// Pack 3 ownership ledger. Roster numbers are NOT persistent block IDs.
// Reaudit against main + coordination Issue #109 before allocating another ID.
import {PACK3_ROOFING_ASSETS} from './roofing-materials.mjs';
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
  [27,'Roof stair blocks',null],[28,'Roof corner blocks',null],
  [29,'Roof ridge blocks',null]
]);
const monumental=Object.freeze([
  [69,'Castle wall blocks'],[70,'Battlement blocks'],[71,'Stone buttresses'],
  [72,'Ornamental columns'],[73,'Decorative cornices'],
  [74,'Large arched window blocks'],[75,'Decorative stone reliefs'],
  [76,'Aqueduct channel blocks'],[77,'Crystal-topped spire blocks'],
  [78,'Carved statue blocks']
]);
export const PACK3_ROSTER=Object.freeze([...roofing,...monumental].map(([roster,name,id=null])=>
  Object.freeze({
    roster,name,id,
    implementation:id===null?'not-started':'physical-candidate',
    duplicateAudit:id===null?'pending-new-main-review':'new-vs-main-006',
    dependency:roster>=27&&roster<=29?'generic :12 shapes and :00 stateful rotation':
      roster===76?'future water containment, no fluid engine':
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
  if(ids.length!==PACK3_ROOFING_ASSETS.length||PACK3_ROOFING_ASSETS.some(a=>
    !PACK3_ROSTER.some(row=>row.roster===a.roster&&row.id===a.id)))
    throw new Error('Ledger and physical roofing definitions disagree');
  return true;
}
