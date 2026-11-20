import {SCENE_FAMILIES,createSceneMesh} from '../nonblock-scene48/flora-phase1.mjs';
import {UNDERGROWTH_FAMILIES,makeUndergrowthMesh} from '../nonblock-scene48/undergrowth-phase1.mjs';
import {createForestCandidate} from '../nonblock-scene48/forest-phase1-candidates.mjs';
import {createForestLichenPatch} from '../nonblock-scene48/forest-lichen-patch.mjs';
import {createForestMossMat} from '../nonblock-scene48/forest-moss-mat.mjs';
import {createWoodlandSapling} from '../nonblock-scene48/woodland-sapling.mjs';
import {createWoodlandShrub} from '../nonblock-scene48/woodland-shrub.mjs';
import {makeAgaveRosette} from '../nonblock-environments24/agave-rosette.mjs';
import {makeAlpineWildflower} from '../nonblock-environments24/alpine-wildflower.mjs';
import {makeDesertBloom} from '../nonblock-environments24/desert-bloom.mjs';
import {makeDesertScrub} from '../nonblock-environments24/desert-scrub.mjs';
import {makeDwarfJuniper} from '../nonblock-environments24/dwarf-juniper.mjs';
import {makeFrostFern} from '../nonblock-environments24/frost-fern.mjs';
import {makeSaltgrass} from '../nonblock-environments24/saltgrass.mjs';
import {makeSnowgrass} from '../nonblock-environments24/snowgrass.mjs';
import {makeTumblebrush} from '../nonblock-environments24/tumblebrush.mjs';
import {makePebbleScatter} from '../nonblock-environments24/pebble-scatter.mjs';
import {makeCaveRubbleCluster} from '../nonblock-environments24/cave-rubble-cluster.mjs';
import {createEnchantedFungus,ENCHANTED_FUNGI_IDS} from '../nonblock-scene48/enchanted-fungi.mjs';
import {createMeadowWoodland,MEADOW_WOODLAND_IDS} from '../nonblock-scene48/meadow-woodland.mjs';
import {createCaveFormation} from '../nonblock-environments24/cave-formations.mjs';
import {inheritedStageFamilies} from './staged-inherited-families.mjs';
import {createWorldProp,WORLD_PROP_IDS,worldPropAttachment} from '../nonblock-fittings36/world-props.mjs';
import {describeFitting} from '../nonblock-fittings36/fittings-phase1.mjs';

const floraPalette = [
  [.24,.43,.25],[.36,.58,.30],[.31,.54,.29],[.96,.64,.32],[1,.84,.44],
  [.78,.65,.49],[.62,.34,.22],[.92,.80,.61],[.56,.39,.75],[.73,.37,.58],
  [.73,.48,.28],[.67,.47,.83],[.84,.45,.68],[.58,.44,.24],[.72,.59,.31]
];
const forestPalette = [[.37,.26,.16],[.28,.48,.24],[.49,.58,.29],[.62,.69,.37]];
const barkPalette = [[.36,.25,.17],[.50,.34,.20]];
const groundCoverPalette = [[.22,.35,.22],[.36,.48,.25],[.52,.61,.32],[.61,.66,.40]];
const fungiPalette = [null,null,null,null,[.81,.69,.56],[.64,.30,.40]];
const distantFlora=new Set(['scene48:low-grass','scene48:short-fern','scene48:clover-clump','scene48:meadow-sedge']);

function floraFamily(mesh,palette) {
  return {lane:'48',mesh,palette};
}

function authoredFloraFamily(sceneId){
  const mesh=({seed,anchor,variant},options)=>createSceneMesh(sceneId,seed,...anchor,variant,options).mesh;
  const family=floraFamily(mesh,floraPalette);
  if(distantFlora.has(sceneId))family.distantMesh=options=>mesh(options,{distant:true});
  return family;
}

function forestFamily(maker,palette) {
  // These sources number geometric options 1–3. The master identity's default
  // zero uses the source's own default mesh without remapping its instance key.
  return floraFamily(({seed,anchor,variant})=>maker(seed,...anchor,variant||1).mesh,palette);
}

function environmentFamily(maker,...palette) {
  return {lane:'24',mesh:options=>maker(options).mesh,palette};
}

function fittingFamily(sceneId,palette,wall=false) {
  return {lane:'36',wall,palette,mesh:options=>describeFitting({
    ...options,sceneId,mount:{[wall?'behind':'below']:true}
  }).render.localMesh};
}

function caveFamily(sceneId,attachment) {
  return {lane:'24',attachment,variantMax:7,build:options=>createCaveFormation(sceneId,options)};
}

function newFloraFamily(sceneId,build,wall) {
  return [sceneId,{lane:'48',wall,wallInset:.49,wallHeight:2,build:options=>build(sceneId,options)}];
}

export const stagedWorldPropFamilies = WORLD_PROP_IDS.map(sceneId=>{
  const attachment=worldPropAttachment(sceneId);
  return [sceneId,{lane:'36',attachment,wall:attachment==='wall',wallHeight:2,wallInset:.49,
    build:options=>createWorldProp(sceneId,options)}];
});

export const candidateFamilies = new Map([
  ...stagedWorldPropFamilies,
  ...inheritedStageFamilies,
  ...MEADOW_WOODLAND_IDS.map(sceneId=>newFloraFamily(sceneId,createMeadowWoodland,
    sceneId==='scene48:crawling-ivy'||sceneId==='scene48:trail-vine')),
  ...ENCHANTED_FUNGI_IDS.map(sceneId=>newFloraFamily(sceneId,createEnchantedFungus,
    sceneId==='scene48:shelf-fungus'||sceneId==='scene48:glowing-vine')),
  ...Object.keys(SCENE_FAMILIES).map(sceneId=>[sceneId,authoredFloraFamily(sceneId)]),
  ...Object.keys(UNDERGROWTH_FAMILIES).map(sceneId=>[sceneId,floraFamily(
    ({seed,anchor})=>makeUndergrowthMesh(sceneId,seed,...anchor).mesh,
    sceneId.endsWith('toadstools')?fungiPalette:groundCoverPalette)]),
  ['scene48:exposed-root',{...floraFamily(
    ({seed,anchor})=>createForestCandidate('scene48:exposed-root',seed,...anchor).mesh,barkPalette),
    embedDepth:.02}],
  ['scene48:fallen-branch',floraFamily(
    ({seed,anchor})=>createForestCandidate('scene48:fallen-branch',seed,...anchor).mesh,barkPalette)],
  ['scene48:woodland-sapling',forestFamily(createWoodlandSapling,forestPalette)],
  ['scene48:woodland-shrub',forestFamily(createWoodlandShrub,forestPalette)],
  ['scene48:forest-lichen-patch',forestFamily(createForestLichenPatch,
    [[.37,.43,.37],[.49,.54,.46],[.63,.64,.56],[.72,.69,.57]])],
  ['scene48:forest-moss-mat',forestFamily(createForestMossMat,groundCoverPalette)],
  ['nonblock:d:agave-rosette',environmentFamily(makeAgaveRosette,[.38,.55,.43])],
  ['nonblock:d:alpine-wildflower',environmentFamily(makeAlpineWildflower,[.73,.72,.90])],
  ['nonblock:d:desert-bloom',environmentFamily(makeDesertBloom,[.32,.51,.31],[.94,.45,.21],[.72,.23,.17],[1,.76,.30])],
  ['nonblock:d:desert-scrub',environmentFamily(makeDesertScrub,[.54,.62,.31])],
  ['nonblock:d:dwarf-juniper',environmentFamily(makeDwarfJuniper,[.37,.49,.32])],
  ['nonblock:d:frost-fern',environmentFamily(makeFrostFern,[.28,.45,.41],[.48,.66,.61],[.76,.87,.86])],
  ['nonblock:d:saltgrass',environmentFamily(makeSaltgrass,[.61,.64,.43])],
  ['nonblock:d:snowgrass',environmentFamily(makeSnowgrass,[.73,.79,.65])],
  ['nonblock:d:tumblebrush',environmentFamily(makeTumblebrush,[.44,.31,.22],[.58,.43,.29],[.79,.60,.37])],
  ['nonblock:e:pebble-scatter',environmentFamily(makePebbleScatter,[.49,.46,.41])],
  ['nonblock:e:cave-rubble-cluster',environmentFamily(makeCaveRubbleCluster,[.49,.49,.53])],
  ['nonblock:e:giant-stalagmite-spire',caveFamily('nonblock:e:giant-stalagmite-spire','ground')],
  ['nonblock:e:clustered-dripstone',caveFamily('nonblock:e:clustered-dripstone','ceiling')],
  ['nonblock:e:limestone-cave-column',caveFamily('nonblock:e:limestone-cave-column','span')],
  ['nonblock:e:flowstone-curtain',caveFamily('nonblock:e:flowstone-curtain','ceiling')],
  ['scene36:cloth-banner',fittingFamily('scene36:cloth-banner',
    [[.42,.27,.15],null,null,[.65,.19,.24],null,null,null,[.46,.12,.19],[.87,.64,.30],[.62,.40,.19]],true)],
  ['scene36:rope-coil',fittingFamily('scene36:rope-coil',
    [null,null,null,null,null,null,[.68,.48,.26],null,null,[.45,.31,.17],[.78,.57,.32]])]
]);
