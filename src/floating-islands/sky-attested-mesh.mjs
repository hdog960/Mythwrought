// MYTHWROUGHT Floating Islands: physical original-voxel mesher attestation.
// Bridges createOriginalSkyPhysicalHost.meshSection to the certified GPU owner.
// The ORIGINAL host must build the mesh from the live sky/edits source, not
// a cache of stale triangles. Its source identity is rechecked before and
// after EVERY synchronous original-source section mesh operation.
import {skyIslandMeshKey} from './sky-runtime-adapter.mjs';

const fail=s=>{throw new TypeError('Sky attested mesh: '+s);};
const safe=Number.isSafeInteger;
const string=s=>typeof s==='string'&&s.length>0&&s.length<=128;
function identity(source){
  const v=source.readIdentity();
  if(!v||!string(v.worldToken)||!string(v.generatorFingerprint)||
    !safe(v.epoch)||v.epoch<0)fail('missing authentic source identity');
  return v;
}
const same=(a,b)=>a.worldToken===b.worldToken&&
  a.generatorFingerprint===b.generatorFingerprint&&a.epoch===b.epoch;
export function createAttestedOriginalSkyMesher({physicalHost,source}={}){
  if(!physicalHost||typeof physicalHost.meshSection!=='function'||
    !physicalHost.world||typeof physicalHost.world.get!=='function'||
    !physicalHost.materials||typeof physicalHost.materials.shapeFor!=='function'||
    !source||typeof source.readIdentity!=='function'||
    typeof source.sectionRevision!=='function')
    fail('original live voxel/shape host and certified generator readers required');
  return Object.freeze({meshSection(cx,cz,section){
    const key=skyIslandMeshKey(cx,cz,section);
    const before=identity(source),revision=source.sectionRevision(key);
    if(!safe(revision)||revision<0)fail('unverified original sky section revision');
    const mesh=physicalHost.meshSection(cx,cz,section);
    const after=identity(source),afterRevision=source.sectionRevision(key);
    if(!same(before,after)||afterRevision!==revision)
      fail('sky world or player edit changed during original physical meshing');
    if(!mesh||mesh.key!==key||mesh.sourceAuthoritative!==true||
       !(mesh.vertices instanceof Float32Array)||
       mesh.vertices.length%9!==0||mesh.vertexCount!==mesh.vertices.length/9||
       mesh.vertices.byteLength>884736||mesh.stagedOnly!==true)
      fail('original physical source did not produce bounded authoritative geometry');
    return Object.freeze({...mesh,sourceProof:Object.freeze({
      worldToken:before.worldToken,generatorFingerprint:before.generatorFingerprint,
      epoch:before.epoch,revision})});
  }});
}
