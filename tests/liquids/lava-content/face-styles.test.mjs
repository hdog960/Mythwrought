import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.env.LAVA_STYLE_ROOT;
if(!root)throw Error('LAVA_STYLE_ROOT must point to an exact-source overlay');
const pins={
  'src/liquids/presentation/mesh.mjs':'6eec04c065623b7046750e28fdb34cfc4908ec9a',
  'src/liquids/presentation/draw-plan.mjs':'b5487f525bdc1f494cbdbffa1f0d7d9f66d7b51d',
  'src/liquids/presentation/styled-draw.mjs':'e09d9e52b3882269fa79c47d4d597dedcef05b35',
  'src/liquids/lava/physics/definition.mjs':'93f6559d51ec1c1b6b2ac9aa4776129903fc3e96',
  'src/liquids/lava/content/material.mjs':'cfe40c0b49f7f3b0277dc126d9ff983f1ca5afbc'
};
for(const [p,h] of Object.entries(pins)){
  const b=readFileSync(resolve(root,p));assert.equal(createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),h,p);
}
const load=p=>import(pathToFileURL(resolve(root,'src/liquids/',p)).href);
const {buildLiquidMesh}=await load('presentation/mesh.mjs');
const {prepareLiquidFaceStyles,admitStyledLiquidDraws}=await load('presentation/styled-draw.mjs');
const {readLavaHeat}=await load('lava/physics/definition.mjs');
const {LAVA_MATERIAL,buildLavaTile}=await load('lava/content/material.mjs');
const {createLavaFaceStyleResolver}=await load('lava/content/face-styles.mjs');
const lava=(x,y,z,units,heat)=>Object.freeze({x,y,z,id:'lava',units,quantities:Object.freeze(heat?{'lava-heat':heat}:{})});
function fixture(cells,revision=1){
  const map=new Map(cells.map(c=>[[c.x,c.y,c.z].join(','),c]));
  const origin=[cells[0].x,cells[0].y,cells[0].z];
  const engine={getCell:(...p)=>map.get(p.join(','))??null};
  const host={engine,isLoaded:()=>true,isOpen:()=>true};
  const mesh=buildLiquidMesh({...host,origin,cells:cells.map(c=>[c.x,c.y,c.z])});
  const batch={id:'lava',revision,mesh};
  const gpu={get:()=>({id:batch.id,revision:batch.revision,origin,groups:mesh.groups.map(g=>({id:g.id,indexCount:g.indices.length}))})};
  const admit=(token,opts={})=>admitStyledLiquidDraws({batches:[batch],styleBindings:[token],gpu,materials:{lava:LAVA_MATERIAL},camera:origin,forward:[1,1,1],...opts});
  const bind=opts=>prepareLiquidFaceStyles({batch,styleForFace:createLavaFaceStyleResolver({...host,readLavaHeat,...opts})});
  return {host,batch,map,admit,bind};
}
test('fractional and clipped lava faces recover the producing cell heat once',()=>{
  const f=fixture([lava(1200,-209,-50,7,700),lava(1201,-209,-50,3,0)]);let reads=0;
  const t=f.bind({readLavaHeat:c=>{reads++;return readLavaHeat(c);}}),r=f.admit(t);
  assert.equal(reads,2);assert.equal(r.status,'admitted');assert.equal(r.plan.faces,f.batch.mesh.faceCount);
  assert.deepEqual(new Set(r.plan.opaque.map(c=>c.style[0])),new Set([0,1]));assert.equal(r.plan.transparent.length,0);
  assert.equal(r.plan.opaque.reduce((n,c)=>n+c.indexCount,0),f.batch.mesh.faceCount*6);
});
test('heat-only edit changes emitted texture and requires fresh revision',()=>{
  const a=fixture([lava(0,256,0,5,400)]),b=fixture([lava(0,256,0,5,0)],2);
  const old=a.bind(),newToken=b.bind();assert.equal(b.admit(old).status,'stale-style');
  const hot=a.admit(old).plan.opaque[0].style[0],cold=b.admit(newToken).plan.opaque[0].style[0];
  assert.equal(hot,.875);assert.equal(cold,0);
  assert.ok(buildLavaTile({heat:hot}).emission.some(n=>n>0));assert.ok(buildLavaTile({heat:cold}).emission.every(n=>n===0));
  assert.deepEqual(a.batch.mesh.groups[0].positions,b.batch.mesh.groups[0].positions);
});
test('all valid integer heat densities yield bounded monotone visual levels',()=>{
  for(let bands=1;bands<=16;bands++){
    const levels=new Set();let previous=-1;
    for(let h=0;h<=800;h++){
      const f=createLavaFaceStyleResolver({engine:{getCell:()=>lava(0,0,0,8,h)},isLoaded:()=>true,isOpen:()=>true,readLavaHeat,heatBands:bands});
      const [v]=f({liquid:'lava',cell:[0,0,0]});assert.ok(v>=previous&&v<=1);assert.equal(v===0,h===0);assert.equal(v,Math.ceil(h*bands/800)/bands);levels.add(v);previous=v;
    }
    assert.equal(levels.size,bands+1);
  }
});
test('nonlava faces compose without querying lava state',()=>{
  const f=createLavaFaceStyleResolver({engine:{getCell:()=>{throw Error('unexpected read');}},isLoaded:()=>{throw Error('unexpected readiness');},isOpen:()=>true,readLavaHeat});
  for(const liquid of ['water','acid','amber-sap','liquid-resonance'])assert.equal(f({liquid,cell:[0,0,0]}),null);
});
test('unloaded, closed, stale and malformed heat faces fail closed',()=>{
  const f=fixture([lava(0,0,0,8,200)]);
  assert.throws(()=>f.bind({isLoaded:()=>false}),/Unavailable/);assert.throws(()=>f.bind({isOpen:()=>false}),/Unavailable/);
  assert.throws(()=>f.bind({readLavaHeat:()=>null}),/Invalid lava face heat/);
  f.map.delete('0,0,0');assert.throws(()=>f.bind(),/Stale/);
});
test('lava style cell budget and mixed thermal draw budget never truncate',()=>{
  const f=fixture([lava(0,0,0,8,800),lava(1,0,0,8,0)]);
  assert.throws(()=>f.bind({maxCells:1}),/cell budget/);assert.throws(()=>f.bind({heatBands:17}),/inputs/);
  assert.deepEqual(f.admit(f.bind(),{maxDrawCalls:1}),{status:'draw-budget',plan:null});
});
