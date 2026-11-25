import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:932,height:430}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/tests/');
 const report=await page.evaluate(async()=>{
   const {createWildsNaturalSession}=await import('/src/manual-biomes/enchanted-wilds-natural-session.mjs');
   const {createWildsUpperFrameOwner}=await import('/src/manual-biomes/enchanted-wilds-upper-frame.mjs');
   const s=createWildsNaturalSession(179),h=s.host;
   let root=null;
   outer:for(let cx=-5;cx<=-1;cx++)for(let cz=-35;cz<=-31;cz++){const p=s.source.origins(cx,cz)[0];if(p){root=p;break outer;}}
   if(!root)throw Error('No genuine natural tower');
   const [x,,z]=root,canvas=document.createElement('canvas');
   canvas.width=932;canvas.height=430;document.body.append(canvas);
   const gl=canvas.getContext('webgl2');if(!gl)throw Error('Real WebGL2 required');
   const chunks=new Map(),owner=createWildsUpperFrameOwner(h,gl,chunks);
   const position={x:x+.5,z:z+.5,feet:20};
   const args={position,visible:s.visibleUpper(position),nativeWanted:[],contextCurrent:()=>!gl.isContextLost()};
   for(let i=0;i<4;i++){const r=owner.frame(args);if(r.status!=='published'||r.uploads>2)throw Error('Frame publication failed');}
   const k=h.meshKey(Math.floor(x/16),Math.floor(z/16),0);
   const row=chunks.get(k);if(!row||!gl.isBuffer(row.buffer))throw Error('Actual tower buffer missing');
   const check=()=>{
     const expected=h.meshUpper(Math.floor(x/16),Math.floor(z/16),0).vertices;
     const current=chunks.get(k);gl.bindBuffer(gl.ARRAY_BUFFER,current.buffer);
     const bytes=gl.getBufferParameter(gl.ARRAY_BUFFER,gl.BUFFER_SIZE);
     if(bytes!==expected.byteLength)throw Error('GPU bytes mismatch');
     const actual=new Float32Array(expected.length);gl.getBufferSubData(gl.ARRAY_BUFFER,0,actual);
     if(actual.some((n,i)=>n!==expected[i]))throw Error('GPU source vertices mismatch');
     return bytes;
   };
   const before=check();
   if(!h.setPhysical(x,20,z,0))throw Error('Natural upper edit refused');
   if(owner.resident({key:k}))throw Error('Stale GPU revision admitted');
   for(let i=0;i<4;i++)owner.frame(args);
   const after=check();if(before===after)throw Error('Actual edited mesh unchanged');
   if(gl.getError()!==gl.NO_ERROR)throw Error('GPU error');
   return {root,before,after,slots:chunks.size,realWebGL2:true,sourceBufferExact:true,actualOriginalUploader:true,liveMainLoop:false};
 });
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('WILDS REAL WEBGL2 SOURCE BUFFER',JSON.stringify(report));
}finally{await browser.close();}
