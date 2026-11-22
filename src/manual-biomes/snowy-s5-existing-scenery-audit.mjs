// S5 DETACHED, READ-ONLY review of the EXISTING M7 non-block habitat planner.
// It does not create assets, change density, activate trees, touch the :48
// automation lane or alter terrain/save data. Counts real source-approved
// scenes only when a full original-scene planner is provided by the caller.
const M7='mythwrought-five-surface-regions-v7';
const ORIGINAL_STAGE_BLOB='b9badfcc9c6d243721429a9893b33fdb06e5076b';
const FAMILIES=Object.freeze([
  'nonblock:d:snowgrass','nonblock:d:frost-fern',
  'nonblock:d:alpine-wildflower','nonblock:d:dwarf-juniper',
  'nonblock:d:icicle-spear'
]);
const names=new Set(FAMILIES);
const ground=new Set([272,276,277,278,279]);
const key=(x,y,z)=>x+','+y+','+z;
const good=n=>Number.isSafeInteger(n)&&Math.abs(n)<100000;
export const SNOW_S5_REUSED_FAMILIES=FAMILIES;

/** Audit one original 16x16 source scenery chunk, not an S5 renderer.
 * `planScenery` must be the exact original planEnvironmentalScenery reader;
 * supplying a test stub establishes only adapter correctness.
 */
export function reviewSnowS5Scenery(world,cx,cz,{planScenery,biomeAt,
  originalSourceBlob=ORIGINAL_STAGE_BLOB,treeCells=[]}={}){
  if(world?.generationProfile?.generator!==M7||
    !(world.edits instanceof Map)||!Number.isInteger(world.seed)||
    !good(cx)||!good(cz)||typeof world.get!=='function'||
    typeof world.naturalAndLandmarkBlock!=='function'||
    typeof world.environmentCaves?.get!=='function'||
    typeof planScenery!=='function'||typeof biomeAt!=='function'||
    originalSourceBlob!==ORIGINAL_STAGE_BLOB||
    !Array.isArray(treeCells)||treeCells.length>640)
    throw new TypeError('Original M7/S5 read-only scenery planner required');
  const occupied=new Set();
  for(const cell of treeCells){
    if(!Array.isArray(cell)||cell.length!==4||!cell.every(Number.isSafeInteger)||
      ![4,406,407].includes(cell[3]))
      throw new TypeError('Invalid detached S3 canopy mask');
    occupied.add(key(...cell.slice(0,3)));
  }
  const saveBefore=typeof world.save==='function'?JSON.stringify(world.save()):null;
  const plans=planScenery(world,cx,cz);
  if(!Array.isArray(plans)||plans.length>48)
    throw new TypeError('Oversized source scenery plan');
  const counts=Object.fromEntries(FAMILIES.map(s=>[s,0]));
  const observed={all:plans.length,inSnowInterior:0,sourceWinter:0,
    otherExistingSources:0,outsideSnowInterior:0,
    editsAtAnchor:0,caveAtAnchor:0,treeAnchorConflicts:0,
    unsupportedGroundAtAnchor:0};
  const reviewed=[];
  for(const p of plans){
    if(!Array.isArray(p?.anchor)||p.anchor.length!==3||
      !p.anchor.every(good)||p.anchor[1]<-210||p.anchor[1]>19||
      typeof p.sceneId!=='string'||p.sceneId.length>90)
      throw new TypeError('Malformed original-source scenery placement');
    const [x,y,z]=p.anchor,climate=biomeAt(x,z,world.seed);
    if(climate?.name!=='snow'||!(climate.weight>=.8)){
      observed.outsideSnowInterior++;continue;
    }
    observed.inSnowInterior++;
    // Existing non-S5 scenes such as genuine district props stay owned by
    // the original planner; do not mark them as duplicate scenery bugs.
    if(!names.has(p.sceneId)){
      observed.otherExistingSources++;continue;
    }
    observed.sourceWinter++;
    counts[p.sceneId]++;
    const support=world.naturalAndLandmarkBlock(x,y-1,z);
    const cave=world.environmentCaves.get(x,y,z)!==undefined;
    const edited=world.edits.has(key(x,y,z));
    const collision=occupied.has(key(x,y,z));
    // Mountain, canopy and hanging icicles may use different source supports;
    // a root-anchor check is a DIAGNOSTIC, not a replacement for real
    // createCandidateScene supports[] or scene mesh collision.
    const expectedGround=p.sceneId==='nonblock:d:icicle-spear'||ground.has(support);
    observed.editsAtAnchor+=Number(edited);
    observed.caveAtAnchor+=Number(cave);
    observed.treeAnchorConflicts+=Number(collision);
    observed.unsupportedGroundAtAnchor+=Number(!expectedGround);
    reviewed.push(Object.freeze({sceneId:p.sceneId,
      anchor:Object.freeze([x,y,z]),supportId:support,
      sourceApproved:true,detachedTreeAnchorConflict:collision,
      caveOverride:cave,playerEditAtAnchor:edited,
      expectedGroundAtAnchor:expectedGround}));
  }
  if(saveBefore!==null&&JSON.stringify(world.save())!==saveBefore)
    throw new Error('Original S5 planner changed a schema-1 saved world');
  return Object.freeze({kind:'detached-existing-M7-winter-scenery-audit',
    originalSourceBlob:ORIGINAL_STAGE_BLOB,chunk:Object.freeze([cx,cz]),
    counts:Object.freeze(counts),summary:Object.freeze(observed),
    reviewed:Object.freeze(reviewed),
    caveAndSceneGeometryFullyAccepted:false,
    state:'read-only-reuse-existing-families-no-automation-edits'});
}
