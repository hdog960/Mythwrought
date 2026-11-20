// :36 opt-in interaction-to-WebGL2 bridge. NEVER imported by production.
// Authorization is supplied by a fixture callback, not a substitute for :00 gameplay.
import {createFittingFixture, CONTRACT} from './fittings-phase1.mjs';
import {createFittingsWebGL2Fixture} from './webgl2-interactive-fixture.mjs';

export function createInteractiveFittingsDemo({canvas,seed,objects,authorize,readSidecar,writeSidecar}){
 if(typeof authorize!=='function'||typeof readSidecar!=='function'||typeof writeSidecar!=='function')
  throw new TypeError('explicit fixture authorization and sidecar callbacks required');
 if(!Array.isArray(objects)||new Set(objects.map(o=>o.instanceKey)).size!==objects.length)
  throw new TypeError('duplicate instance keys');
 const fixture=createFittingFixture(seed,objects);
 const renderer=createFittingsWebGL2Fixture(canvas);
 let selected=null,closed=false;
 const ensure=()=>{if(closed)throw new Error('fixture disposed');};
 const upload=()=>renderer.upload(fixture.visible(),{selectedKey:selected});
 try {
  const saved=readSidecar();
  if(saved!==null&&saved!==undefined)fixture.restore(saved);
  upload();
 }catch(error){renderer.dispose();throw error;}
 return Object.freeze({
  get selectedKey(){return selected;},
  get visibleKeys(){ensure();return fixture.visible().map(o=>o.instanceKey);},
  select(instanceKey){
   ensure();
   if(typeof instanceKey!=='string'||!fixture.visible().some(o=>o.instanceKey===instanceKey))
    throw new RangeError('object not visible');
   selected=instanceKey;
   upload();
   return objects.find(o=>o.instanceKey===instanceKey).selectionAabbs;
  },
  breakSelected(){
   ensure();
   const target=fixture.visible().find(o=>o.instanceKey===selected);
   if(!target)throw new RangeError('no visible selection');
   // Fail closed: async or non-true authorization is never treated as consent.
   if(authorize(Object.freeze({instanceKey:target.instanceKey,sceneId:target.sceneId,
     breakIntent:target.breakIntent}))!==true)throw new Error('fixture break not authorized');
   const before=fixture.snapshot();
   const outcome=fixture.breakObject(target);
   const after=fixture.snapshot();
   try {
    // Sidecar storage is caller-owned and MUST be an isolated test store.
    if(writeSidecar(after)!==true)throw new Error('fixture sidecar write not acknowledged');
    upload();
   }catch(error){
    fixture.restore(before);
    upload();
    throw error;
   }
   selected=null;
   return outcome;
  },
  reload(){
   ensure();
   const saved=readSidecar();
   if(saved===null||saved===undefined)throw new Error('missing fixture sidecar');
   fixture.restore(saved);
   selected=null;
   return upload();
  },
  draw(matrix){ensure();return renderer.draw(matrix);},
  snapshot(){ensure();return fixture.snapshot();},
  dispose(){if(!closed){closed=true;renderer.dispose();}}
 });
}
