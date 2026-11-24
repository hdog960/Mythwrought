// Full solid terrain for the explicit environmental world profile.
// The 130 authored Builder families retain their existing IDs and shapes.
export const M7_ENVIRONMENT_GENERATOR='mythwrought-five-surface-regions-v7';
// Explicitly versioned forest baseline; never a historical M7 alias.
export const ENCHANTED_P2_GENERATOR='mythwrought-five-surface-regions-v7-enchanted-p2';
export const isEnvironmentGenerator=generator=>generator===M7_ENVIRONMENT_GENERATOR||generator===ENCHANTED_P2_GENERATOR;
export const ENVIRONMENT_GROUND=Object.freeze({
  slate:400,scree:401,gneiss:402,woodlandLoam:403,woodlandPeat:404,woodlandMoss:405,
  coldNeedles:406,snowyNeedles:407,aetherBark:408,aetherLeaves:409,moonLeaves:410
});
const materials=new Map([
  [ENVIRONMENT_GROUND.slate, ['Mountain slate',[.36,.40,.43]]],
  [ENVIRONMENT_GROUND.scree, ['Weathered scree',[.46,.43,.40]]],
  [ENVIRONMENT_GROUND.gneiss, ['Pale ridge gneiss',[.56,.54,.51]]],
  [ENVIRONMENT_GROUND.woodlandLoam, ['Aether woodland loam',[.29,.23,.34]]],
  [ENVIRONMENT_GROUND.woodlandPeat, ['Deep woodland peat',[.25,.19,.29]]],
  [ENVIRONMENT_GROUND.woodlandMoss, ['Moonlit woodland moss',[.28,.37,.32]]],
  [ENVIRONMENT_GROUND.coldNeedles, ['Winter conifer needles',[.23,.39,.37]]],
  [ENVIRONMENT_GROUND.snowyNeedles, ['Snow-laden conifer needles',[.74,.86,.89]]],
  [ENVIRONMENT_GROUND.aetherBark, ['Aether bark',[.35,.24,.33]]],
  [ENVIRONMENT_GROUND.aetherLeaves, ['Aether canopy',[.41,.38,.56]]],
  [ENVIRONMENT_GROUND.moonLeaves, ['Moonleaf canopy',[.44,.60,.55]]]
].map(([id,[name,color]])=>[id,Object.freeze({name,color:Object.freeze(color)})]));
export const environmentGround=id=>materials.get(id);
