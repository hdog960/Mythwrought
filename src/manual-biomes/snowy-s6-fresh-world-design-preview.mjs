// Snow S6: strictly DETACHED fresh-world opt-in design PREVIEW.
// Does not register a world profile or alter M7/save/renderer/cave/physics.
// Composes authenticated S4 source holds with S3 canonical-owner tree cells.
// "Opt-in" here is a research-token requirement, NOT production enablement.
import {inspectSnowS4OriginalTransitionHolds}
  from './snowy-s4-transition-source-check.mjs';
import {previewSnowS4PhysicalEdge}
  from './snowy-s4-physical-edge-preview.mjs';
import {previewSnowS3CanonicalOwnerChunk}
  from './snowy-s3-owner-chunk-preview.mjs';
import {SNOW_S6_CANDIDATE_PROFILE,previewSnowS6WinterTone}
  from './snowy-s6-winter-tone-proposal.mjs';

const M7='mythwrought-five-surface-regions-v7',SIZE=16;
const CAPS=new Set([272,276,279]),TREE_IDS=new Set([4,406,407]);
const STYLES=Object.freeze(['compact-fir','layered-spruce',
  'highland-pine','windswept-alpine']);
const freeze=Object.freeze;
const valid=n=>Number.isSafeInteger(n)&&Math.abs(n)<=100000;
const key=(x,y,z)=>x+','+y+','+z;
const safePlan=plan=>plan instanceof Map&&plan.size<=21&&
  [...plan].every(([y,id])=>Number.isSafeInteger(y)&&
    Number.isSafeInteger(id)&&y>=-3&&y<=19&&id>=0&&id<=65535);

/** Offline only; requires a pristine original M7 world AND explicit future
 * fresh-world research token. No existing M7 world or schema-1 save can be
 * migrated, registered, mounted, rendered or edited through this API.
 */
export function previewSnowS6FreshWorldTile(world,tile,deps={},request={}){
  if(world?.generationProfile?.generator!==M7||
    !(world.edits instanceof Map)||world.edits.size!==0||
    !(world.rotations instanceof Map)||world.rotations.size!==0||
    typeof world.get!=='function'||typeof world._columnPlan!=='function'||
    typeof world.save!=='function'||
    typeof world.environmentCaves?.get!=='function'||
    !valid(world.seed)||world.seed!==(world.seed|0)||
    !['biomeAt','terrainHeight','legacyNatural','proposedSnowTree',
      'planScenery','describeScene','collides'].every(n=>typeof deps[n]==='function')||
    request.profileProposal!==SNOW_S6_CANDIDATE_PROFILE||
    request.intent!=='fresh-new-world-research-only'||
    request.allowM7SaveMigration!==false)
    throw new TypeError('S6 requires pristine original M7, full physical readers and explicit research-only opt-in');
  const {x,z,width,height}=tile??{};
  if(!valid(x)||!valid(z)||!Number.isInteger(width)||
    !Number.isInteger(height)||width<2||height<2||width>8||height>8||
    !valid(x+width-1)||!valid(z+height-1)||
    Math.floor(x/SIZE)!==Math.floor((x+width-1)/SIZE)||
    Math.floor(z/SIZE)!==Math.floor((z+height-1)/SIZE))
    throw new RangeError('S6 physical preview must fit within one bounded 16x16 original chunk');
  const start=JSON.stringify(world.save()),payload=world.save();
  if(payload?.schema!==1||payload.seed!==world.seed||
    !Array.isArray(payload.edits)||payload.edits.length!==0||
    payload.rotations?.length)
    throw new TypeError('S6 refuses preexisting or unsupported schema-1 source');
  const cx=Math.floor(x/SIZE),cz=Math.floor(z/SIZE);
  const columns=[];
  for(let dz=0;dz<height;dz++)for(let dx=0;dx<width;dx++)
    columns.push(freeze([x+dx,z+dz]));
  // Snapshot actual original plans, caps/support, cave overrides and
  // biome weights before invoking S3 scene planners and S4 reviewers.
  const witness=()=>JSON.stringify(columns.map(([ax,az])=>{
    const plan=world._columnPlan(ax,az),biome=deps.biomeAt(ax,az,world.seed);
    if(!safePlan(plan)||!biome||typeof biome.name!=='string'||
      !Number.isFinite(biome.weight))
      throw new TypeError('S6 source column/biome reader failed');
    const prior=deps.terrainHeight(ax,az,world.seed);
    if(!Number.isSafeInteger(prior)||prior<2||prior>12)
      throw new TypeError('S6 source terrain height failed');
    const top=plan.size?Math.max(...plan.keys()):prior;
    if(top<2||top>19)throw new TypeError('S6 source surface exceeded world');
    const cave=world.environmentCaves.get(ax,top,az);
    const supportCave=world.environmentCaves.get(ax,top-1,az);
    return [ax,az,biome.name,biome.weight,prior,
      [...plan.entries()].sort((a,b)=>a[0]-b[0]),
      world.get(ax,top,az),world.get(ax,top-1,az),
      cave===undefined?null:cave,supportCave===undefined?null:supportCave,
      world.edits.has(key(ax,top,az))];
  }));
  const before=witness();
  const rectangle=freeze({x,z,width,height});
  const transition=inspectSnowS4OriginalTransitionHolds(world,rectangle,deps);
  const edge=previewSnowS4PhysicalEdge(world,transition,deps);
  const trees=previewSnowS3CanonicalOwnerChunk(world,cx,cz,deps);
  if(!trees.safe||!edge.originalSourceUnchanged||transition.writerEnabled!==false)
    throw new Error('S6 original tree or edge source gate unavailable: '+trees.reason);
  if(trees.physicalCells>640||trees.cells.length!==trees.physicalCells)
    throw new Error('S6 invalid canonical tree physics budget');
  const palette=[],deniedVisual=Object.create(null);
  for(const [ax,az] of columns){
    const region=deps.biomeAt(ax,az,world.seed),plan=world._columnPlan(ax,az);
    if(region?.name!=='snow'||region.weight<0||region.weight>1){
      deniedVisual['not-snow']=(deniedVisual['not-snow']??0)+1;continue;
    }
    const top=plan.size?Math.max(...plan.keys()):deps.terrainHeight(ax,az,world.seed);
    const material=world.get(ax,top,az);
    if(!CAPS.has(material)||plan.get(top)!==material||
      world.environmentCaves.get(ax,top,az)!==undefined||
      world.environmentCaves.get(ax,top-1,az)!==undefined||
      world.get(ax,top-1,az)===0||
      world.edits.has(key(ax,top,az))){
      deniedVisual['not-unedited-authored-snow']=
        (deniedVisual['not-unedited-authored-snow']??0)+1;continue;
    }
    palette.push(previewSnowS6WinterTone(world.seed,ax,az,material,region.weight));
  }
  const approvedTrees=trees.cells.filter(([bx,,bz])=>
    bx>=x&&bx<x+width&&bz>=z&&bz<z+height);
  for(const [bx,by,bz,id] of approvedTrees)
    if(!TREE_IDS.has(id)||world.get(bx,by,bz)!==0||
      world.edits.has(key(bx,by,bz))||
      world.environmentCaves.get(bx,by,bz)!==undefined)
      throw new Error('S6 original tree changed after approved physical owner');
  // S4's eligible references remain *research only*; reject conflicts with
  // admitted tree paths, including a low overhead canopy at that column.
  const eligible=[],blockedByTrees=[];
  for(const candidate of edge.proposed){
    if(!columns.some(([ax,az])=>ax===candidate.x&&az===candidate.z))
      throw new Error('S6 edge candidate outside original tile');
    if(approvedTrees.some(([bx,by,bz])=>bx===candidate.x&&
      bz===candidate.z&&by<=candidate.oldTop+3)){
      blockedByTrees.push(freeze({x:candidate.x,z:candidate.z,
        reason:'approved-conifer-physical-overhang'}));
      continue;
    }
    eligible.push(freeze({x:candidate.x,z:candidate.z,oldTop:candidate.oldTop,
      researchCapReference:272,authorizingTerrainWrites:false}));
  }
  if(witness()!==before||JSON.stringify(world.save())!==start)
    throw new Error('S6 source mutated during new-world design preview');
  return freeze({kind:'detached-S6-new-world-opt-in-design-preview',
    sourceProfile:M7,proposedProfile:SNOW_S6_CANDIDATE_PROFILE,
    profileRegistered:false,saveMigrationAllowed:false,
    requestVerified:true,rectangle,sourceChunk:freeze([cx,cz]),
    palette:freeze(palette),paletteSkipped:freeze({...deniedVisual}),
    physicalTrees:freeze(approvedTrees),sourceTreeSiteCount:trees.sourceSites,
    sourceOwnerReviews:trees.ownerReviews,
    possibleStyles:STYLES,chosenStylesNotProven:true,
    sourceEdgeGrass:transition.grassCells,
    sourceProtectedGrass:transition.counts.protectedOriginalSource,
    edgeReferrals:freeze(eligible),edgeRejectedCount:edge.rejected.length,
    edgeConflictsWithTrees:freeze(blockedByTrees),
    originalWorldUnchanged:true,notLiveM7:true,
    multiOwnerWholeWorldPathAccepted:false,
    originalVisualOrIPhoneAccepted:false,
    writerEnabled:false});
}
