// :36 browser-only, opt-in interaction witness. No production imports or world writes.
// A browser runner must supply a real canvas and retain its own isolated sidecar.
import {describeFitting} from './fittings-phase1.mjs';
import {createInteractiveFittingsDemo} from './interactive-webgl2-demo.mjs';

const SIZES=Object.freeze([[667,375],[844,390],[932,430]]);
const MOUNTS=Object.freeze({
 'scene36:signpost':{below:true},
 'scene36:hanging-chain':{above:true},
 'scene36:cloth-banner':{behind:true},
 'scene36:hanging-cobweb':{corner:true},
 'scene36:rope-coil':{below:true}
});
const SCENES=Object.freeze(Object.keys(MOUNTS));
const MATRIX=new Float32Array([.26,0,0,0,0,.26,0,0,0,0,.26,0,0,0,0,1]);
function checkCanvas(canvas,width,height){
 if(!canvas||typeof canvas.getContext!=='function'||typeof canvas.toDataURL!=='function')
  throw new TypeError('real browser canvas required');
 canvas.width=width;canvas.height=height;
}
export function makeWitnessObjects(seed=36){
 if(!Number.isSafeInteger(seed))throw new TypeError('seed');
 return SCENES.map((sceneId,i)=>describeFitting({
  sceneId,seed,anchor:[i*2-4,0,0],orientation:i%4,mount:MOUNTS[sceneId]
 }));
}
// Returns actual canvas pixel captures; does NOT claim they came from Chromium.
// External automation must establish browser provenance, source SHA and PNG integrity.
export function captureFittingsInteraction({canvas,width,height,seed=36,sceneId='scene36:signpost',onStage}){
 if(!SIZES.some(([w,h])=>w===width&&h===height))throw new RangeError('unsupported viewport');
 if(typeof onStage!=='function')throw new TypeError('stage evidence callback required');
 checkCanvas(canvas,width,height);
 const objects=makeWitnessObjects(seed);
 const target=objects.find(o=>o.sceneId===sceneId);
 if(!target)throw new RangeError('unknown witness scene');
 let sidecar=null;
 const make=()=>createInteractiveFittingsDemo({
  canvas,seed,objects,authorize:({instanceKey})=>instanceKey===target.instanceKey,
  readSidecar:()=>sidecar,writeSidecar:s=>{sidecar=structuredClone(s);return true;}
 });
 const stages=[];
 const emit=(stage,session)=>{
  const draw=session.draw(MATRIX);
  const png=canvas.toDataURL('image/png');
  if(!png.startsWith('data:image/png;base64,'))throw new Error('PNG canvas capture failed');
  const entry=Object.freeze({stage,width,height,instanceKey:target.instanceKey,
   visible:session.visibleKeys.includes(target.instanceKey),
   selected:session.selectedKey===target.instanceKey,
   tombstoned:!!sidecar?.tombstones.includes(target.instanceKey),
   triangleCount:draw.triangleCount,uploadBytes:draw.uploadBytes,webgl2:draw.webgl2,png});
  onStage(entry);stages.push(entry);
 };
 let session=make();
 try{
  emit('visible',session);
  session.select(target.instanceKey);emit('selected',session);
  session.breakSelected();emit('removed',session);
  session.dispose();
  session=make();emit('restored',session);
  if(stages.length!==4||stages[0].visible!==true||stages[1].selected!==true||
     stages[2].visible!==false||stages[3].visible!==false||!stages[3].tombstoned)
   throw new Error('interaction witness transition failed');
  return Object.freeze({seed,sceneId,width,height,stages});
 }finally{session.dispose();}
}
export const REQUIRED_WITNESS_SIZES=SIZES;
