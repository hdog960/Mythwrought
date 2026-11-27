import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {captureRetainedDeckSource,inspectRetainedDeckCandidate} from '../../src/living-underworld/retained-deck-combined-candidate.mjs';
import {CROWN_HALL_PROFILES} from '../../src/living-underworld/grade-hall-geometry.mjs';
import {auditGalleryEngineWorkingSet} from '../../src/living-underworld/gallery-streaming-working-set.mjs';
const out=resolve(process.env.RUNNER_TEMP??'artifacts','phase48');
await mkdir(out,{recursive:true});
let report={status:'INCOMPLETE',candidates:[]};
try{
 const capture=captureRetainedDeckSource();
 assert.equal(capture.owners.length,42);
 assert.equal(capture.checked,172032);
 assert.equal(capture.conflicts.size,327);
 assert.equal(capture.future.size,14706);
 assert.equal(capture.cuts.size,18390);
 assert.ok(capture.maxOwnerReads<=40000);
 for(const profile of CROWN_HALL_PROFILES){
  const r=inspectRetainedDeckCandidate({capture,profile});
  assert.equal(r.floorReadback,true);assert.equal(r.sourceSaveUnchanged,true);
  assert.equal(r.originalFloorConflicts,327);assert.equal(r.remainingFloorConflicts,0);
  assert.equal(r.peakCost.galleryFaces,1546);assert.equal(r.peakCost.galleryCuts,843);
  assert.equal(r.selectedCost.galleryFaces,1290);assert.equal(r.selectedCost.galleryCuts,837);
  assert.ok(r.futureCuts<capture.future.size);
  assert.equal(r.constructionAdmission,false);
  const routes=r.walking.routes;
  const cavern=routes.find(x=>x.label==='gallery to new cavern supported floor');
  const hub=routes.find(x=>x.label==='upper hub');
  const priorLong=routes.find(x=>x.label==='phase47 55-station endpoint');
  const previousCavern=routes.find(x=>x.label==='previous cavern endpoint');
  const previousHub=routes.find(x=>x.label==='previous hub endpoint');
  const walking=!!(cavern?.ok&&cavern.stations>=40&&hub?.ok);
  const budget=r.peakCost.withinLimits&&r.selectedCost.withinLimits;
  const finiteTopology=r.airConnectivity.splitComponents===0&&r.airConnectivity.disappearedComponents===0;
  const seams=r.seams.lostPatches===0;
  const gates={budget,walking,priorLong:!!priorLong?.ok,previousCavern:!!previousCavern?.ok,previousHub:!!previousHub?.ok,finiteTopology,seams,
   socket:!!routes.find(x=>x.label==='upper socket')?.ok,global:false,constructionAdmission:false};
  report.candidates.push({...r,gates});
  const {rows,...small}=r;
  console.log('CROWN_HALL '+JSON.stringify({...small,gates}));
 }
 const ranked=report.candidates.slice().sort((a,b)=>Number(b.gates.budget&&b.gates.walking&&b.gates.finiteTopology&&b.gates.seams)-Number(a.gates.budget&&a.gates.walking&&a.gates.finiteTopology&&a.gates.seams)||
  Number(b.gates.finiteTopology&&b.gates.seams)-Number(a.gates.finiteTopology&&a.gates.seams)||
  Number(b.gates.budget)-Number(a.gates.budget)||Number(b.gates.walking)-Number(a.gates.walking)||
  a.seams.lostPatches-b.seams.lostPatches||a.peakCost.stagedFaces-b.peakCost.stagedFaces);
 const best=ranked[0];
 report.selectedForFurtherResearch=best.candidate.id;
 // Partial scope is never an all-world proof. Reuse established real
 // engine working-set enumeration for all windows touching measured owners.
 report.partialWindowCosts=auditGalleryEngineWorkingSet(best.rows.map(r=>({key:r.key,cx:Number(r.key.split(',')[0]),cz:Number(r.key.split(',')[1]),section:Number(r.key.split(',')[2]),cuts:r.combinedCuts,faces:r.combinedGrowth})));
 report.partialWindowCostsAreNotFullRegion=true;
 report.status='CROWN_ALTERNATIVES_MEASURED_NOT_ADMITTED';
 console.log('PARTIAL_WINDOW '+JSON.stringify({profile:best.candidate.id,metrics:report.partialWindowCosts}));
}catch(e){report.error=String(e.stack??e);console.error(report.error);throw e;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
