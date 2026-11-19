// :36 opt-in full five-family, three-viewport browser evidence orchestration.
// This is a browser-side harness, not proof of Chromium provenance or :00 integration.
import {captureFittingsInteraction,makeWitnessObjects,REQUIRED_WITNESS_SIZES} from './browser-interaction-witness.mjs';

const STAGES=Object.freeze(['visible','selected','removed','restored']);
export function validateFittingsWitness(result){
 if(!result||!Array.isArray(result.stages)||result.stages.length!==4)throw new Error('four stages required');
 const [a,b,c,d]=result.stages;
 for(let i=0;i<4;i++){
  const s=result.stages[i];
  if(s.stage!==STAGES[i]||s.width!==result.width||s.height!==result.height||
     s.instanceKey!==a.instanceKey||s.webgl2!==true||
     !Number.isSafeInteger(s.triangleCount)||s.triangleCount<0||
     !Number.isSafeInteger(s.uploadBytes)||s.uploadBytes<0||s.uploadBytes>4*1024*1024||
     typeof s.png!=='string'||!s.png.startsWith('data:image/png;base64,'))
   throw new Error('invalid witness stage '+i);
 }
 if(!a.visible||a.selected||a.tombstoned||
    !b.visible||!b.selected||b.tombstoned||
    c.visible||c.selected||!c.tombstoned||
    d.visible||d.selected||!d.tombstoned||
    a.triangleCount<=0||b.triangleCount<=0||
    c.triangleCount>=a.triangleCount||d.triangleCount!==c.triangleCount)
   throw new Error('invalid selection/removal/reload transition');
 return true;
}
// Canvas factory must create a fresh, actual browser WebGL2 canvas for each scene/size.
// Never run against the live world, shared saves, or the production renderer.
export function captureFittingsMatrix({createCanvas,seed=36,onStage=()=>{}}){
 if(typeof createCanvas!=='function'||typeof onStage!=='function')throw new TypeError('browser canvas factory and observer required');
 const scenes=makeWitnessObjects(seed).map(o=>o.sceneId);
 const results=[],seen=new Set();
 for(const [width,height] of REQUIRED_WITNESS_SIZES){
  for(const sceneId of scenes){
   const canvas=createCanvas({width,height,sceneId});
   const result=captureFittingsInteraction({canvas,width,height,seed,sceneId,onStage});
   validateFittingsWitness(result);
   const id=`${width}x${height}:${sceneId}`;
   if(seen.has(id))throw new Error('duplicate witness');seen.add(id);
   results.push(result);
  }
 }
 if(results.length!==15||results.reduce((n,r)=>n+r.stages.length,0)!==60)
  throw new Error('incomplete browser witness matrix');
 return Object.freeze({seed,sceneCount:5,viewportCount:3,captureCount:60,results:Object.freeze(results)});
}
