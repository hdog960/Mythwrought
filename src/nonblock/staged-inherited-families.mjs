import {makePricklyPear} from '../nonblock-environments24/prickly-pear-cactus.mjs';
import {makeColumnCactus} from '../nonblock-environments24/column-cactus.mjs';
import {makeBranchingCrystalCluster} from '../nonblock-environments24/branching-crystal-cluster.mjs';
import {makeGeodeOpening} from '../nonblock-environments24/geode-opening.mjs';
import {makeMineralEncrustation} from '../nonblock-environments24/mineral-encrustation.mjs';
import {createCaveFormation} from '../nonblock-environments24/cave-formations.mjs';
import {describeFitting} from '../nonblock-fittings36/fittings-phase1.mjs';

function environment(maker,palette) {
  return {lane:'24',build:options=>{
    const source=maker(options);
    // Existing selection envelopes are per solid part. Keep those collision
    // parts separate so the space between branches remains navigable.
    const colliders=source.selectionAabbs.map(({min,max})=>[...min,...max]);
    return {mesh:source.mesh,palette,colliders};
  }};
}

function revisedCave(sceneId,attachment) {
  return {lane:'24',attachment,variantMax:7,build:options=>createCaveFormation(sceneId,options)};
}

function mountedGeode() {
  return {lane:'24',wall:true,wallY:0,wallInset:.49,build:options=>{
    const source=makeGeodeOpening(options);
    const {positions,triangleCount}=source.mesh;
    const transformed=new Float32Array(positions.length);
    for(let i=0;i<positions.length;i+=3){
      transformed[i]=positions[i];
      transformed[i+1]=positions[i+2]+.5;
      transformed[i+2]=-positions[i+1];
    }
    const colliders=source.selectionAabbs.map(({min,max})=>
      [min[0],min[2]+.5,-max[1],max[0],max[2]+.5,-min[1]]);
    return {mesh:{positions:transformed,triangleCount},palette:[[.46,.45,.64]],colliders};
  }};
}

function mineralWall() {
  return {lane:'24',wall:true,wallY:0,wallInset:.49,build:options=>{
    const source=makeMineralEncrustation({...options,face:'south'});
    return {mesh:source.mesh,palette:[[.59,.69,.46]],colliders:[]};
  }};
}

function fitting(sceneId,profile,mount,palette,colliders=[]) {
  return {lane:'36',...profile,build:options=>{
    const source=describeFitting({...options,sceneId,mount:{[mount]:true}});
    const mesh=source.render.localMesh;
    if(profile.attachment!=='ceiling') return {mesh,palette,colliders};
    let highest=-Infinity;
    for(let i=1;i<mesh.positions.length;i+=3)highest=Math.max(highest,mesh.positions[i]);
    const positions=mesh.positions.map((v,i)=>i%3===1?v-highest:v);
    return {mesh:{...mesh,positions},palette,colliders};
  }};
}

export const inheritedStageFamilies = [
  ['nonblock:d:prickly-pear-cactus',environment(makePricklyPear,[[.34,.55,.36]])],
  ['nonblock:d:column-cactus',environment(makeColumnCactus,[[.30,.48,.29]])],
  ['nonblock:d:icicle-spear',revisedCave('nonblock:d:icicle-spear','ceiling')],
  ['nonblock:e:small-stalagmite',revisedCave('nonblock:e:small-stalagmite','ground')],
  ['nonblock:e:hanging-stalactite',revisedCave('nonblock:e:hanging-stalactite','ceiling')],
  ['nonblock:e:crystal-shard',revisedCave('nonblock:e:crystal-shard','ground')],
  ['nonblock:e:branching-crystal-cluster',environment(makeBranchingCrystalCluster,[[.41,.62,.73]])],
  ['nonblock:e:geode-opening',mountedGeode()],
  ['nonblock:e:mineral-encrustation',mineralWall()],
  ['scene36:signpost',fitting('scene36:signpost',{},'below',
    [[.38,.26,.16],[.67,.49,.31]],[
      [-.057,0,-.057,.057,2.15,.057],[-.43,1.46,-.075,.44,1.81,.075]
    ])],
  ['scene36:hanging-chain',fitting('scene36:hanging-chain',{attachment:'ceiling'},'above',
    [null,null,[.47,.49,.51]])],
  ['scene36:hanging-cobweb',fitting('scene36:hanging-cobweb',{wall:true,corner:true,wallY:0,wallInset:.49},
    'corner',[null,null,null,null,[.70,.72,.69],[.64,.67,.65]])]
];
