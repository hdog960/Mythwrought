// MYTHWROUGHT — detached, renderer-owned physical sky publication gate.
// Closes the gap between original physical mesh attestations, mutable vertex
// arrays, player/ecology source revisions and the original in-place GPU owner.
// Nothing here enables a gameplay path, changes src/main.mjs or writes saves.
import {createAttestedOriginalSkyMesher} from './sky-attested-mesh.mjs';
import {planCertifiedSkyOwner,stageCertifiedSkyFrame,publishCertifiedSkyFrame}
  from './sky-certified-owner.mjs';

const fail=s=>{throw new TypeError('Sky physical frame gate: '+s);};
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const same=(a,b)=>a?.worldToken===b?.worldToken&&
  a?.generatorFingerprint===b?.generatorFingerprint&&a?.epoch===b?.epoch;
const bound=({source,overlay})=>{
  overlay.assertFresh();
  const id=source.readIdentity();
  if(!id||!same(id,overlay.identity))fail('original physical overlay has stale world identity');
  return id;
};
const verdict=(status,reason,more={})=>Object.freeze({status,reason,...more});

export function createSkyPhysicalFrameGate({physicalHost,source,overlay}={}){
  if(!physicalHost?.world||typeof physicalHost.meshSection!=='function'||
     typeof physicalHost.world.get!=='function'||
     !source||typeof source.readIdentity!=='function'||
     typeof source.sectionRevision!=='function'||
     !overlay||typeof overlay.assertFresh!=='function'||!overlay.identity)
    fail('original mesher, source revision readers and ecology fence required');
  const original=createAttestedOriginalSkyMesher({physicalHost,source});
  const owned=new WeakSet(),consumed=new WeakSet();

  // Source mesh geometry is mutable in the original world. Once it has been
  // attested, privately COPY it before exposing any bytes to the GPU upload
  // callback. Never return the original producer array to the renderer.
  const privateMesh=(cx,cz,section)=>{
    bound({source,overlay});
    const proof=original.meshSection(cx,cz,section);
    if(!proof?.sourceProof||!Object.isFrozen(proof.sourceProof)||
       !(proof.vertices instanceof Float32Array)||
       !valid(proof.vertexCount)||proof.vertexCount>24576||
       proof.vertices.length!==proof.vertexCount*9||
       !proof.vertices.every(Number.isFinite))
      fail('original certified mesh is not a bounded physical triangle stream');
    const vertices=proof.vertices.slice();
    bound({source,overlay});
    if(source.sectionRevision(proof.key)!==proof.sourceProof.revision)
      fail('original sky mesh section changed while snapshotting triangles');
    return Object.freeze({...proof,vertices});
  };

  // Planning does not obtain a GPU grant: the native renderer still must
  // explicitly release up to 8 of its 25 surface slots on this same revision.
  const plan=args=>{
    bound({source,overlay});
    const candidate=planCertifiedSkyOwner({...args,source});
    bound({source,overlay});
    return candidate;
  };
  const dispose=(stage,{gl,readRendererIdentity})=>{
    if(!stage?.transaction||!gl||typeof gl.deleteBuffer!=='function'||
       typeof readRendererIdentity!=='function')
      return verdict('fatal','No reliable original GPU owner for staged cleanup',
        {needsRendererReset:true});
    let current;
    try{current=readRendererIdentity();}catch(_){return verdict('fatal',
      'Original WebGL context identity inaccessible; buffers retained',
      {needsRendererReset:true});}
    if(current?.contextToken!==stage.contextToken)return verdict('stale',
      'WebGL context lost; unsafe staged-buffer deletion refused',
      {abandonedOnContextLoss:true});
    const seen=new Set(),released=[],failed=[];
    for(const buffer of stage.transaction.stagedBuffers){
      if(!buffer||seen.has(buffer))continue;
      seen.add(buffer);
      try{gl.deleteBuffer(buffer);released.push(buffer);}catch(_){failed.push(buffer);}
    }
    return verdict('stale','Physical ecology changed before renderer publication',
      {released:Object.freeze(released),failed:Object.freeze(failed)});
  };

  const stage=args=>{
    if(!args||Object.hasOwn(args,'meshSection')||Object.hasOwn(args,'source'))
      fail('untrusted mesh producer/source override prohibited');
    bound({source,overlay});
    const staged=stageCertifiedSkyFrame({...args,source,meshSection:privateMesh});
    if(!staged?.transaction)return staged; // existing certified owner disposed stale GPU staging
    owned.add(staged);
    try{bound({source,overlay});}
    catch(_){consumed.add(staged);return dispose(staged,args);}
    return staged;
  };

  const publish=args=>{
    if(!args||!owned.has(args.stage)||consumed.has(args.stage)||
       Object.hasOwn(args,'source'))fail('only an unconsumed stage owned by this gate may publish');
    consumed.add(args.stage); // before invoking callbacks, including reentrant hosts
    try{bound({source,overlay});}
    catch(_){return dispose(args.stage,args);}
    return publishCertifiedSkyFrame({...args,source});
  };
  return Object.freeze({plan,stage,publish,
    sourceOnly:true,worldWrites:0,saveWrites:0,lightingPassesAdded:0});
}
