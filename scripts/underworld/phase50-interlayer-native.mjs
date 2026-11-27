import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {inspectDriftingInterlayer} from '../../src/living-underworld/drifting-interlayer-stair.mjs';
const out=resolve(process.env.RUNNER_TEMP??'artifacts','phase50-interlayer');await mkdir(out,{recursive:true});
let report={status:'INCOMPLETE'};
try{
 const r=inspectDriftingInterlayer();report={status:'DRIFTING_INTERLAYER_MEASURED_NOT_ADMITTED',...r};
 assert.ok(r.attempted<=12);assert.ok(r.directCalls<=40000);assert.equal(r.worldWrites,0);assert.equal(r.sourceSaveUnchanged,true);assert.equal(r.constructionAdmission,false);
 if(r.best){assert.equal(r.best.forward.ok,true);assert.equal(r.best.reverse.ok,true);assert.equal(r.best.supportParity,true);}
 console.log('DRIFTING_INTERLAYER '+JSON.stringify({...r,best:r.best?Object.fromEntries(Object.entries(r.best).filter(([k])=>!['route','supportCells','airCells'].includes(k))):null}));
}catch(e){report.error=String(e.stack??e);console.error(report.error);throw e;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
