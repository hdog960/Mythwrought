import test from 'node:test';
import assert from 'node:assert/strict';
import {createAttestedOriginalSkyMesher} from '../../src/floating-islands/sky-attested-mesh.mjs';
const key=(cx,cz,section)=>`sky:${cx},${cz},${section}`;
function fixture(){
  let epoch=2,rev=0,calls=0,mutate=null;
  const source={readIdentity:()=>({worldToken:'179:w0',generatorFingerprint:'real-generator-sha',epoch}),
    sectionRevision:()=>rev};
  const host={world:{get:()=>0},materials:{shapeFor:()=>({cube:true,opaque:true})},
    meshSection(cx,cz,section){calls++;if(mutate)mutate();return {
      key:key(cx,cz,section),vertices:new Float32Array(54),vertexCount:6,
      sourceAuthoritative:true,stagedOnly:true,bytes:216};}};
  return {source,host,changeEpoch:n=>epoch=n,changeRevision:n=>rev=n,
    setMutation:f=>mutate=f,get calls(){return calls}};
}
const build=f=>createAttestedOriginalSkyMesher({physicalHost:f.host,source:f.source});
test('attests source-backed original mesh with exact world/gen/section revision',()=>{
  const f=fixture(),r=build(f).meshSection(-750,875,7);
  assert.deepEqual(r.sourceProof,{worldToken:'179:w0',generatorFingerprint:'real-generator-sha',
    epoch:2,revision:0});
  assert.equal(r.key,'sky:-750,875,7');assert.equal(f.calls,1);
});
test('revision changed during original voxel read refuses misleading mesh attestation',()=>{
  const f=fixture();f.setMutation(()=>f.changeRevision(3));
  assert.throws(()=>build(f).meshSection(0,0,1),/changed during/);
});
test('generator epoch changed during meshing fails closed even with matching geometry',()=>{
  const f=fixture();f.setMutation(()=>f.changeEpoch(4));
  assert.throws(()=>build(f).meshSection(0,0,0),/changed during/);
});
test('full original nine-float geometry and source-only flag mandatory',()=>{
  const f=fixture();f.host.meshSection=()=>({key:'sky:0,0,0',
    vertices:new Float32Array(53),vertexCount:6,sourceAuthoritative:true,stagedOnly:true});
  assert.throws(()=>build(f).meshSection(0,0,0),/bounded authoritative/);
});
test('unverified original renderer mesh cannot claim physical source status',()=>{
  const f=fixture();f.host.meshSection=()=>({key:'sky:0,0,0',
    vertices:new Float32Array(54),vertexCount:6,sourceAuthoritative:false,stagedOnly:true});
  assert.throws(()=>build(f).meshSection(0,0,0),/bounded authoritative/);
});
test('shape/world authority is required to attach a source proof',()=>{
  const f=fixture();delete f.host.materials;
  assert.throws(()=>build(f),/original live voxel/);
});
test('source refuses unverified or non-integer section revisions',()=>{
  const f=fixture();f.changeRevision(NaN);
  assert.throws(()=>build(f).meshSection(0,0,3),/unverified/);
});
test('physical source never writes saves or world cells',()=>{
  const f=fixture();let edits=0;f.host.world.set=()=>{edits++;throw Error('no writes')};
  const r=build(f).meshSection(0,0,0);
  assert.equal(r.vertexCount,6);assert.equal(edits,0);
});
