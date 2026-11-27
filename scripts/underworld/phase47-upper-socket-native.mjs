import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {inspectOriginalSocketSpiral} from '../../src/living-underworld/upper-socket-spiral-research.mjs';
const out=resolve(process.env.RUNNER_TEMP??'artifacts','phase47-socket');await mkdir(out,{recursive:true});
let report={status:'INCOMPLETE'};
try{
 const r=inspectOriginalSocketSpiral();
 report={status:'SOCKET_GEOMETRY_MEASURED_NOT_ADMITTED',...r};
 assert.equal(r.attempted,128);
 assert.ok(r.sourceCalls<=40000);
 assert.equal(r.sourceSaveUnchanged,true);assert.equal(r.worldWrites,0);assert.equal(r.constructionAdmission,false);
 if(r.best){assert.equal(r.best.forward.ok,true);assert.equal(r.best.reverse.ok,true);assert.equal(r.best.joinedForward.ok,true);assert.equal(r.best.joinedReverse.ok,true);assert.equal(r.best.topClearance,-4);}
 const {candidates,best,...summary}=r;
 console.log('SOCKET_SPIRAL '+JSON.stringify({...summary,best:best?Object.fromEntries(Object.entries(best).filter(([k])=>!['route','approach','support','air'].includes(k))):null,examples:candidates.filter(x=>x.reason==='ORIGINAL_GEOMETRY_CONFLICT').slice(0,4)}));
}catch(e){report.error=String(e.stack??e);console.error(report.error);throw e;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
