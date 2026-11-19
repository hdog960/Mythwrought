// :36 isolated browser runner: call only from an explicitly opened test page.
// No production imports, automatic spawn, save access, or network requests.
import {captureFittingsMatrix} from './browser-matrix-witness.mjs';

const EXPECTED=Object.freeze([[667,375],[844,390],[932,430]]);
const STAGES=Object.freeze(['visible','selected','removed','restored']);
export function planFittingsBrowserArtifacts(){
 const scenes=['scene36:signpost','scene36:hanging-chain','scene36:cloth-banner','scene36:hanging-cobweb','scene36:rope-coil'];
 return Object.freeze(EXPECTED.flatMap(([width,height])=>scenes.flatMap(sceneId=>
  STAGES.map(stage=>Object.freeze({width,height,sceneId,stage,
   filename:`fittings36-${width}x${height}-${sceneId.slice(8)}-${stage}.png`}))
 )));
}
// Explicit opt-in; does not assert Chromium provenance. Caller must record
// executable/version, Git source SHA, context details, and independently audit PNGs.
export function runFittingsBrowserArtifacts({documentRef,seed=36,writeArtifact,recordMetadata}={}){
 if(!documentRef||typeof documentRef.createElement!=='function')throw new TypeError('browser document required');
 if(typeof writeArtifact!=='function'||typeof recordMetadata!=='function')
  throw new TypeError('artifact and metadata callbacks required');
 const planned=planFittingsBrowserArtifacts(),written=[];
 const matrix=captureFittingsMatrix({seed,createCanvas:({width,height})=>{
  const canvas=documentRef.createElement('canvas');
  if(!canvas||typeof canvas.getContext!=='function')throw new Error('browser canvas unavailable');
  canvas.width=width;canvas.height=height;return canvas;
 },onStage:entry=>{
  const matching=planned.find(p=>p.width===entry.width&&p.height===entry.height&&
   p.stage===entry.stage&&entry.instanceKey.startsWith(p.sceneId+':'));
  // The instanceKey is not required to contain the scene ID: validate
  // ordering against the actual matrix result after capture instead.
  void matching;
 }});
 let index=0;
 for(const result of matrix.results){
  for(const stage of result.stages){
   const expected=planned[index++];
   if(expected.sceneId!==result.sceneId||expected.width!==stage.width||
      expected.height!==stage.height||expected.stage!==stage.stage)
    throw new Error('browser matrix artifact order mismatch');
   const base64=stage.png.slice('data:image/png;base64,'.length);
   if(!base64||!/^[A-Za-z0-9+/]+={0,2}$/.test(base64))
    throw new Error('invalid browser PNG data URL');
   writeArtifact(expected.filename,stage.png,Object.freeze({
    sceneId:result.sceneId,stage:stage.stage,width:stage.width,height:stage.height,
    instanceKey:stage.instanceKey,triangleCount:stage.triangleCount,uploadBytes:stage.uploadBytes
   }));
   written.push(expected.filename);
  }
 }
 if(written.length!==60||new Set(written).size!==60)throw new Error('incomplete browser artifacts');
 recordMetadata(Object.freeze({seed,sceneCount:5,viewportCount:3,captureCount:60,
  chromiumProvenanceVerified:false,productionBreakVerified:false,
  filenames:Object.freeze(written)}));
 return Object.freeze({captureCount:60,filenames:Object.freeze(written)});
}
