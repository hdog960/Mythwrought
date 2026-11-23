// Detached Mountain V8 NON-REGISTERED flora physics study. This is an
// unapproved AABB proposal for cross-owner review, NOT actual gameplay,
// mining/placement, save, renderer, material ID, or collision dispatch.
// Unlike FULL_CUBE fallback, these selection volumes remain authored shapes.
// Official src/voxel-shape-interactions.mjs is the authoritative shape ABI.
import {validateShape,FULL_CUBE,rotateShape}
  from '../voxel-shape-interactions.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS}
  from './mountain-v8-vegetation-cells.mjs';
import {MOUNTAIN_V8_DESCRIPTOR_MATERIALS}
  from './mountain-v8-physical-descriptor-budget.mjs';

const freeze=Object.freeze;
const proposal=freeze({
  'flower':freeze({boxes:[[.46,0,.46,.54,.82,.54],[.30,.66,.43,.70,.72,.57]],
    bodySolid:false,selectionOnly:true,group:'alpine-flower'}),
  'flower-petal':freeze({boxes:[[.19,.24,.40,.81,.47,.60],[.40,.24,.19,.60,.47,.81]],
    bodySolid:false,selectionOnly:true,group:'alpine-flower'}),
  'heather':freeze({boxes:[[.20,0,.33,.80,.43,.67],[.33,0,.20,.67,.43,.80]],
    bodySolid:false,selectionOnly:true,group:'low-heather'}),
  'heather-tip':freeze({boxes:[[.18,.24,.24,.82,.70,.76],[.24,.19,.18,.76,.73,.82]],
    bodySolid:false,selectionOnly:true,group:'low-heather'}),
  'conifer-trunk':freeze({boxes:[[.36,0,.36,.64,1,.64]],
    bodySolid:true,selectionOnly:false,group:'dwarf-conifer'}),
  'conifer-needles':freeze({boxes:[[.08,.24,.30,.92,.74,.70],[.30,.20,.08,.70,.79,.92]],
    bodySolid:false,selectionOnly:true,group:'dwarf-conifer'})
});
const cloneBoxes=boxes=>freeze(boxes.map(box=>freeze([...box])));
const fullBox=box=>box.every((n,i)=>n===FULL_CUBE.boxes[0][i]);
export const MOUNTAIN_V8_PROVISIONAL_FLORA_MATERIALS=
  freeze(Object.keys(proposal));
/** Evaluate all six unapproved selection/collider suggestions against the
 * ACTUAL original V7 physical ABI and authored V8 flora cell patterns.
 * Returns no approval for placement, mining, targeting or persistence.
 */
export function auditMountainV8ProvisionalFloraPhysics(){
  const originalFlora=MOUNTAIN_V8_DESCRIPTOR_MATERIALS.filter(m=>
    !['stone','dirt','snow','alpine-grass','slate','gneiss','scree'].includes(m));
  if(originalFlora.length!==6||
     originalFlora.some(n=>!Object.hasOwn(proposal,n)))
    throw Error('Unknown V8 original flora descriptor');
  const patternMaterials=new Set(Object.values(MOUNTAIN_V8_PLANT_PATTERNS)
    .flat().map(cell=>cell[3]));
  if(patternMaterials.size!==6||
     originalFlora.some(material=>!patternMaterials.has(material)))
    throw Error('Mismatched source-authored flora pattern');
  const materialRecords=originalFlora.map(material=>{
    const p=proposal[material],shape={boxes:p.boxes};
    if(!validateShape(shape)||p.boxes.some(fullBox)||p.boxes.length>32)
      throw Error('Unapproved flora is not source-shape ABI compatible');
    for(let turns=0;turns<4;turns++)
      if(!validateShape(rotateShape(shape,turns)))
        throw Error('Provisional flora rotation invalid');
    const selection=cloneBoxes(p.boxes);
    const body=freeze(p.bodySolid?cloneBoxes(p.boxes):[]);
    return freeze({material,group:p.group,
      selectionBoxes:selection,bodyCollisionBoxes:body,
      bodySolid:p.bodySolid,rotationsChecked:4,
      newNumericBlockId:null,sourcePatternOnly:true,
      approvedForGameplay:false,approvedForMining:false,
      approvedForCreative:false,approvedForPwa:false});
  });
  // The authored 2/2/13 patterns must not expand or silently rearrange.
  const patterns=Object.entries(MOUNTAIN_V8_PLANT_PATTERNS).map(([kind,cells])=>
    freeze({kind,sourceCells:cells.length,
      cellMaterials:freeze(cells.map(cell=>cell[3]))}));
  if(patterns.length!==3||patterns[0].sourceCells!==2||
     patterns[1].sourceCells!==2||patterns[2].sourceCells!==13)
    throw Error('Original V8 flora source changed');
  return freeze({originalSourceMaterialCount:6,
    materials:freeze(materialRecords),authoredPatterns:freeze(patterns),
    originalShapeAbiValidated:true,actualMiningTargetingImplemented:false,
    actualV8ColliderImplemented:false,realV8GpuDataMeasured:false,
    noRuntimeRegistration:true,safeToIntegrate:false});
}
