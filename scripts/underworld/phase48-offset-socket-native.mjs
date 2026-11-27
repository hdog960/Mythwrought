import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {inspectOffsetSocketSpiral} from '../../src/living-underworld/offset-socket-stair-research.mjs';
const out=resolve(process.env.RUNNER_TEMP??'artifacts','phase48-socket');await mkdir(out,{recursive:true});
let report={status:'INCOMPLETE'};
try{
 const r=inspectOffsetSocketSpiral();
 report={status:'OFFSET_SOCKET_MEASURED_NOT_ADMITTED',...r};
 assert.equal(r.attempted,192);
 assert.equal(r.candidates.length+r.skippedAfterCap,r.attempted);
 assert.ok(r.sourceAttempts<=16);
 assert.ok(r.sourceCalls<=40000);
 assert.equal(r.sourceSaveUnchanged,true);assert.equal(r.worldWrites,0);assert.equal(r.constructionAdmission,false);
 if(r.best){assert.equal(r.best.forward.ok,true);assert.equal(r.best.reverse.ok,true);assert.equal(r.best.joinedForward.ok,true);assert.equal(r.best.joinedReverse.ok,true);assert.equal(r.best.topClearance,-4);assert.equal(r.best.route.at(-1).x,r.socket.x);assert.equal(r.best.route.at(-1).z,r.socket.z);}
 const {candidates,best,...summary}=r;
 console.log('OFFSET_SOCKET '+JSON.stringify({...summary,best:best?Object.fromEntries(Object.entries(best).filter(([k])=>!['route','approach','support','air'].includes(k))):null,examples:candidates.filter(x=>x.reason==='ORIGINAL_SOURCE_VETO'||x.reason==='NATIVE_CONTROLLER_OR_JOIN').slice(0,4)}));
}catch(e){report.error=String(e.stack??e);console.error(report.error);throw e;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
