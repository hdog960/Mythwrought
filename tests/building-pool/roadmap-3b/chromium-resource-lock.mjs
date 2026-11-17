// Builder 3B independent Chromium resource permit.
// Node --test executes test FILES in separate worker processes. Starting seven
// software-WebGL2 Chrome sessions at once can exceed the CI runner's shared
// process/memory budget: earlier exact-head CI witnessed Chromium CDP port
// creation failures in three old screenshot tests while the other four passed.
// This isolated, atomic filesystem mutex serializes only 3B's screenshot tests.
// No shared workflow, game runtime, CI files outside 3B or build assets changed.
import {mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const lockPath=join(tmpdir(),'mythwrought-3b-webgl-'+(process.env.GITHUB_RUN_ID||'local')+'-'+(process.env.GITHUB_RUN_ATTEMPT||'1'));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function acquire3BChromiumPermit(timeoutMs=205000){
 const began=Date.now();
 while(true){
  try{
   await mkdir(lockPath);
   let released=false;
   return async()=>{
    if(released)return;
    released=true;
    await rm(lockPath,{recursive:true,force:true});
   };
  }catch(e){if(e?.code!=='EEXIST')throw e;}
  if(Date.now()-began>timeoutMs)
   throw new Error('Builder 3B Chrome resource permit wait expired; refusing to fake WebGL2 evidence');
  await sleep(120);
 }
}
