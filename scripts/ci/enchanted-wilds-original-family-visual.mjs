// Actual original main.mjs renderer, existing local test camera, original
// M8 admission/save/restore. Explicit specimen edits only in disposable
// browser storage; NOT natural-world mount/production acceptance.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
const out='artifacts/wilds-family-visual';await mkdir(out,{recursive:true});
const report={actualOriginalMain:true,sourceRewrite:false,physicalIphone:false,explicitSpecimens:true,naturalProviderMounted:false,checks:[],errors:[]};
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
 const context=await browser.newContext({viewport:{width:956,height:440},deviceScaleFactor:1,isMobile:true,hasTouch:true,serviceWorkers:'block'});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/tests/');
 const sites=await page.evaluate(async()=>{
   const {createMountainV8IsolatedWorld}=await import('/src/manual-biomes/mountain-v8-new-world-admission.mjs');
   const {mountainV8Storage,setMountainV8Active}=await import('/src/manual-biomes/mountain-v8-isolated-storage.mjs');
   const {saveM2World}=await import('/src/manual-biomes/m2-runtime-bridge.mjs');
   const {buildWildsFamily,WILDS_FAMILIES}=await import('/src/manual-biomes/enchanted-wilds-families.mjs');
   const {physicalRegionAt}=await import('/src/world-height.mjs');
   const {v6BiomeAt}=await import('/src/manual-biomes/v6-balanced-biomes.mjs');
   const {findSafeSpawn}=await import('/src/physics.mjs');
   const {WILDS_GROUND_FAMILIES}=await import('/src/manual-biomes/enchanted-wilds-ground.mjs');
   const seed=2026,r=await createMountainV8IsolatedWorld(String(seed),{confirmed:true,storage:localStorage});
   const w=r.world,g=w.base,sites=[];
   for(const family of WILDS_FAMILIES){
     let site=null;
     outer:for(let cz=-64;cz<=64;cz+=2)for(let cx=-64;cx<=64;cx+=2){
       const x=cx*16+8,z=cz*16+8;
       if(sites.some(s=>Math.max(Math.abs(s.x-x),Math.abs(s.z-z))<96)||v6BiomeAt(x,z,seed)?.name!=='enchanted'||v6BiomeAt(x,z,seed)?.weight<.90)continue;
       const col=g._columnPlan(x,z);if(!col.size)continue;
       const floor=Math.max(...col.keys()),p=buildWildsFamily(family.id,x,floor,z,seed,0);if(!p)continue;
       if(p.footprint.some(([a,c])=>{const q=g._columnPlan(a,c);return !q.size||Math.max(...q.keys())!==floor||w.get(a,floor,c)!==q.get(floor)||w.get(a,floor-1,c)===0;}))continue;
       if(p.cells.some(([a,b,c])=>w.get(a,b,c)!==0||v6BiomeAt(a,c,seed)?.name!=='enchanted'))continue;
       let cam=null;
       for(const [dx,dz] of [[0,1],[1,0],[0,-1],[-1,0]]){
         const q=findSafeSpawn(w,x+dx*28,z+dz*28);
         if(Math.abs(q.x-(x+dx*28))>2||Math.abs(q.z-(z+dz*28))>2||Math.abs(q.feet-floor)>5)continue;
         let clear=true;
         for(let k=1;k<24;k++){const t=k/24,a=Math.floor(q.x+(x+.5-q.x)*t),b=Math.floor(q.feet+1.55+(floor+p.height*.60-q.feet-1.55)*t),c=Math.floor(q.z+(z+.5-q.z)*t);if(w.get(a,b,c)!==0){clear=false;break;}}
         if(clear){cam=q;break;}
       }
       if(!cam)continue;
       for(const [a,b,c,id] of p.cells)if(!w.set(a,b,c,id))throw Error('Actual native placement refused '+family.name);
       // Existing vegetation source specimens near trunk where actual free
       // ground is available. Never overwrite the tree or natural terrain.
       let flora=0;
       for(let j=0;j<WILDS_GROUND_FAMILIES.length;j++){
         const a=x-6+j*2,c=z+6,q=g._columnPlan(a,c);if(!q.size)continue;
         const b=Math.max(...q.keys())+1;
         if(w.get(a,b,c)===0&&w.get(a,b-1,c)!==0&&w.set(a,b,c,WILDS_GROUND_FAMILIES[j].id))flora++;
       }
       const keys=[...new Set(p.cells.filter(row=>row[1]>19).map(([a,b,c])=>physicalRegionAt(a,b,c).key))];
       const trunk=p.cells.find(([a,b,c])=>a===x&&b===20&&c===z);
       site={family:family.name,x,z,floor,height:p.height,cells:p.cells.length,cam,keys,trunk,flora};
       break outer;
     }
     if(!site)throw Error('No supported visible specimen site for '+family.name);
     sites.push(site);
   }
   const saved=saveM2World(mountainV8Storage(localStorage),w);
   if(!saved.ok)throw Error('Actual specimen fixture save failed '+saved.reason);
   setMountainV8Active(localStorage,true);
   return sites;
 });
 report.sites=sites;console.log('WILDS VISUAL SOURCE FIXTURES',JSON.stringify(sites));
 await page.goto('http://127.0.0.1:4173/?production-ui=1');
 await page.waitForFunction(()=>window.__mythwroughtTest?.snapshot()?.seed===2026,null,{timeout:120000});
 for(let i=0;i<sites.length;i++){
   const s=sites[i];
   await page.evaluate(s=>{
     const t=window.__mythwroughtTest;
     if(t.block(...s.trunk.slice(0,3))!==s.trunk[3])throw Error('Specimen cold reload mismatch');
     t.teleport(s.cam.x,s.cam.z);
     t.aimAt(s.x,s.floor+s.height*.51,s.z);
   },s);
   await page.waitForFunction(s=>{
     const t=window.__mythwroughtTest,snap=t.snapshot(),p=t.m5ObservedPose(),c=document.querySelector('#scene');
     return Math.hypot(p.x-s.cam.x,p.z-s.cam.z)<2&&snap.pending.length===0&&s.keys.every(k=>snap.chunks.includes(k))&&Number(c.dataset.upperMeshVertices)>0&&snap.graphics.shaderReady&&!snap.graphics.lost;
   },s,{timeout:90000});
   const state=await page.evaluate(()=>{
     const c=document.querySelector('#scene'),snap=window.__mythwroughtTest.snapshot();
     return {chunks:snap.chunks.length,upperOwners:Number(c.dataset.upperGpuOwners),upperBytes:Number(c.dataset.upperGpuBytes),upperVertices:Number(c.dataset.upperMeshVertices),glError:c.getContext('webgl2').getError(),gpuRetry:snap.gpuRetry};
   });
   assert.ok(state.chunks<=25&&state.upperOwners<=8&&state.upperBytes<=7077888&&state.upperVertices>0&&state.glError===0);
   const image=String(i+1).padStart(2,'0')+'-'+s.family.toLowerCase().replaceAll(' ','-')+'.png';
   await page.screenshot({path:out+'/'+image});
   report.checks.push({family:s.family,image,...state});
   console.log('WILDS ORIGINAL RENDERER SPECIMEN',JSON.stringify(report.checks.at(-1)));
 }
 assert.equal(report.checks.length,10);assert.equal(report.errors.length,0,report.errors.join('\n'));
}finally{await writeFile(out+'/report.json',JSON.stringify(report,null,2));if(browser)await browser.close();}
