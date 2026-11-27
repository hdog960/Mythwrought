import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {inspectRetainedDeckCandidate} from '../../src/living-underworld/retained-deck-combined-candidate.mjs';
const out=resolve(process.env.RUNNER_TEMP??'artifacts','phase46');
await mkdir(out,{recursive:true});
let report={status:'INCOMPLETE'};
try{
 const r=inspectRetainedDeckCandidate();
 report={status:'MEASURED_NOT_ADMITTED',...r};
 assert.equal(r.owners,42);
 assert.equal(r.checked,172032);
 assert.equal(r.originalGalleryCuts,18390);
 assert.equal(r.rawRequests,15995);
 assert.equal(r.rawNewCuts,15033);
 assert.equal(r.originalFloorConflicts,327);
 assert.equal(r.futureCuts,14706);
 assert.equal(r.remainingFloorConflicts,0);
 assert.equal(r.otherVetoes,0);
 assert.equal(r.floorReadback,true);
 assert.equal(r.peakCost.galleryFaces,1546);
 assert.equal(r.peakCost.galleryCuts,843);
 assert.equal(r.selectedCost.galleryFaces,1290);
 assert.equal(r.selectedCost.galleryCuts,837);
 assert.ok(r.maxOwnerReads<=40000);
 assert.equal(r.sourceSaveUnchanged,true);
 assert.equal(r.worldWrites,0);
 assert.equal(r.constructionAdmission,false);
 assert.equal(r.fullRegionPortalConnectivityQualified,false);
 report.status='RETAINED_DECK_CANDIDATE_MEASURED';
 const {rows,...summary}=report;
 console.log('RETAINED_DECK '+JSON.stringify(summary));
}catch(e){report.error=String(e.stack??e);console.error(report.error);throw e;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
