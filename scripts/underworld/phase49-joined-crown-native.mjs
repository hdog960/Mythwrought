import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {captureRetainedDeckSource,inspectRetainedDeckCandidate} from '../../src/living-underworld/retained-deck-combined-candidate.mjs';
import {JOINED_CROWN_PROFILES} from '../../src/living-underworld/grade-hall-geometry.mjs';
import {auditGalleryEngineWorkingSet} from '../../src/living-underworld/gallery-streaming-working-set.mjs';
const out=resolve(process.env.RUNNER_TEMP??'artifacts','phase49');await mkdir(out,{recursive:true});
let report={status:'INCOMPLETE',candidates:[]};
try{
 const extraOwners=[];for(let x=-41;x<=-39;x++)for(let z=-136;z<=-134;z++)extraOwners.push([x,z,-5].join(','));
 extraOwners.push('-42,-135,-4','-42,-135,-5');
 const capture=captureRetainedDeckSource({extraOwners});
 assert.equal(capture.baseOwners.length,42);assert.equal(capture.owners.length,53);
 assert.equal(capture.rows.filter(r=>capture.baseOwners.includes(r.key)).reduce((n,r)=>n+r.retainedDeck,0),327);
 assert.equal(capture.cuts.size,18390);assert.ok(capture.maxOwnerReads<=40000);
 for(const profile of JOINED_CROWN_PROFILES){
  const r=inspectRetainedDeckCandidate({capture,profile,joinAir:true});
  assert.equal(r.floorReadback,true);assert.equal(r.sourceSaveUnchanged,true);assert.equal(r.baseFloorConflicts,327);assert.equal(r.remainingFloorConflicts,0);assert.equal(r.constructionAdmission,false);
  assert.equal(r.peakCost.galleryCuts,843);assert.equal(r.selectedCost.galleryCuts,837);
  const long=r.walking.routes.find(x=>x.label==='phase48 52-station endpoint'),newWalk=r.walking.routes.find(x=>x.label==='gallery to new cavern supported floor');
  const gates={budget:r.peakCost.withinLimits&&r.selectedCost.withinLimits,walking:!!(long?.ok||newWalk?.ok&&newWalk.stations>=40),finiteTopology:r.airConnectivity.splitComponents===0&&r.airConnectivity.disappearedComponents===0,west:r.westPatch.actualOpenPairs>0,lowerWalking:r.lowerRoutes.some(x=>x.ok),upperToMiddleWalking:!!r.walking.routes.find(x=>x.label==='middle hub')?.ok,global:false,constructionAdmission:false};
  report.candidates.push({...r,gates});
  const {rows,connector,...small}=r;console.log('JOINED_CROWN '+JSON.stringify({...small,connector:connector?{ok:connector.ok,reason:connector.reason,components:connector.components,extra:connector.extra.length,paths:connector.paths.map(({cells,...p})=>p)}:null,gates}));
 }
 const ranked=report.candidates.slice().sort((a,b)=>Number(b.gates.budget&&b.gates.walking&&b.gates.finiteTopology&&b.gates.west)-Number(a.gates.budget&&a.gates.walking&&a.gates.finiteTopology&&a.gates.west)||Number(b.gates.finiteTopology)-Number(a.gates.finiteTopology)||Number(b.gates.budget)-Number(a.gates.budget)||a.peakCost.stagedFaces-b.peakCost.stagedFaces);
 const best=ranked[0];
 report.selectedForFurtherResearch=best.candidate.id;
 report.partialWindowCosts=auditGalleryEngineWorkingSet(best.rows.map(r=>({key:r.key,cx:Number(r.key.split(',')[0]),cz:Number(r.key.split(',')[1]),section:Number(r.key.split(',')[2]),cuts:r.combinedCuts,faces:r.combinedGrowth})));
 report.partialWindowCostsAreNotFullRegion=true;
 report.status='JOINED_CROWN_MEASURED_NOT_ADMITTED';
 console.log('PARTIAL_WINDOW '+JSON.stringify({profile:best.candidate.id,metrics:report.partialWindowCosts}));
}catch(e){report.error=String(e.stack??e);console.error(report.error);throw e;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
