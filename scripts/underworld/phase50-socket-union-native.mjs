import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {captureRetainedDeckSource,inspectRetainedDeckCandidate} from '../../src/living-underworld/retained-deck-combined-candidate.mjs';
import {SOCKET_UNION_PROFILES} from '../../src/living-underworld/grade-hall-geometry.mjs';
import {exactQualifiedSocket} from '../../src/living-underworld/exact-qualified-socket.mjs';
import {auditGalleryEngineWorkingSet} from '../../src/living-underworld/gallery-streaming-working-set.mjs';
import {meshReadOnlySharedBatch} from '../../src/living-underworld/shared-native-mesh-snapshot.mjs';
import {BLOCK} from '../../src/voxel.mjs';
const out=resolve(process.env.RUNNER_TEMP??'artifacts','phase50');await mkdir(out,{recursive:true});
let report={status:'INCOMPLETE',candidates:[]};
try{
 const socket=exactQualifiedSocket();
 const extraOwners=[];for(let x=-41;x<=-39;x++)for(let z=-136;z<=-134;z++)extraOwners.push([x,z,-5].join(','));
 extraOwners.push('-42,-135,-4','-42,-135,-5','-42,-136,-4','-42,-136,-5','-42,-134,-5','-43,-135,-4','-43,-135,-5');
 const capture=captureRetainedDeckSource({extraOwners,socket});
 assert.equal(capture.baseOwners.length,42);assert.equal(capture.owners.length,58);
 assert.equal(capture.rows.filter(r=>capture.baseOwners.includes(r.key)).reduce((n,r)=>n+r.retainedDeck,0),327);
 assert.equal(capture.cuts.size,18390);assert.ok(capture.maxOwnerReads<=40000);
 assert.equal(capture.socketConflicts.checkedSupport,234);assert.equal(capture.socketConflicts.checkedAir,702);assert.equal(capture.socketConflicts.addedCuts,693);
 assert.equal(capture.socketConflicts.outsideCompactCuts,136);
 const projections=new Map();
 for(const profile of SOCKET_UNION_PROFILES){
  const r=inspectRetainedDeckCandidate({capture,profile,joinAir:true,inspectProjection:p=>projections.set(profile.id,p)});
  assert.equal(r.floorReadback,true);assert.equal(r.sourceSaveUnchanged,true);assert.equal(r.baseFloorConflicts,327);
  assert.equal(r.socketReplay.supportParity,true);assert.equal(r.socketReplay.airParity,true);assert.equal(r.constructionAdmission,false);
  const actualWorkingSet=auditGalleryEngineWorkingSet(r.rows.map(row=>({key:row.key,cx:Number(row.key.split(',')[0]),cz:Number(row.key.split(',')[1]),section:Number(row.key.split(',')[2]),cuts:row.combinedCuts,faces:row.combinedGrowth})));
  const long=r.walking.routes.find(x=>x.label==='phase48 52-station endpoint');
  const gates={budget:r.peakCost.withinLimits&&r.selectedCost.withinLimits&&actualWorkingSet.maxEditStagedFaces<=3500&&actualWorkingSet.maxResidentFaces<=3500,walking:!!long?.ok,socket:r.socketReplay.ok,finiteTopology:r.airConnectivity.splitComponents===0&&r.airConnectivity.disappearedComponents===0,west:r.westPatch.actualOpenPairs>0,lowerWalking:r.lowerRoutes.filter(x=>x.ok).length,upperToMiddleWalking:!!r.walking.routes.find(x=>x.label==='middle hub')?.ok,global:false,constructionAdmission:false};
  report.candidates.push({...r,actualWorkingSet,gates});
  const {rows,connector,...small}=r;console.log('SOCKET_UNION '+JSON.stringify({...small,actualWorkingSet,connector:connector?{ok:connector.ok,reason:connector.reason,components:connector.components,extra:connector.extra.length,paths:connector.paths.map(({cells,...p})=>p)}:null,gates}));
 }
 const best=report.candidates.slice().sort((a,b)=>Number(b.gates.socket&&b.gates.walking&&b.gates.finiteTopology&&b.gates.lowerWalking===3)-Number(a.gates.socket&&a.gates.walking&&a.gates.finiteTopology&&a.gates.lowerWalking===3)||a.actualWorkingSet.maxEditStagedFaces-b.actualWorkingSet.maxEditStagedFaces)[0];
 report.selectedForFurtherResearch=best.candidate.id;
 const p=projections.get(best.candidate.id);
 const ownerRows=new Map(best.rows.map(r=>[r.key,r]));
 const historicalStage=['-39,-135,-2','-39,-135,-3','-40,-135,-2','-40,-135,-3','-40,-136,-2','-40,-136,-3'];
 const worst=best.actualWorkingSet.peakEdit.staged;
 report.nativeTransactions=[];
 for(const [label,keys] of [['upper historical edit',historicalStage],['expanded worst edit',worst]]){
  if(keys.some(k=>!ownerRows.has(k))){report.nativeTransactions.push({label,keys,ok:false,reason:'INCOMPLETE_OWNER_SCOPE'});continue;}
  let directOriginalCalls=0;
  const view=Object.create(p.original);
  Object.defineProperty(view,'get',{value(x,y,z){const k=x+','+y+','+z;if(capture.cuts.has(k)||p.future.has(k))return BLOCK.AIR;if(directOriginalCalls>=40000)throw Error('ORIGINAL_DIRECT_LIMIT');directOriginalCalls++;return p.original.get(x,y,z);}});
  Object.defineProperty(view,'set',{value(){throw Error('READ_ONLY_NATIVE_PROJECTION');}});
  const batch=meshReadOnlySharedBatch(view,keys);
  const rows=batch.meshes.map(m=>({key:m.key,actualVertices:m.vertices.length/9,expectedCubeVertices:ownerRows.get(m.key).combinedFaces*6,bytes:m.vertices.byteLength,digest:createHash('sha256').update(Buffer.from(m.vertices.buffer,m.vertices.byteOffset,m.vertices.byteLength)).digest('hex')}));
  const parity=batch.ok&&rows.every(r=>r.actualVertices===r.expectedCubeVertices);
  report.nativeTransactions.push({label,keys,ok:batch.ok,reason:batch.reason??null,sharedHalo:batch.theoretical,uniqueProjectionReads:batch.calls,directOriginalCalls,cacheHits:batch.hits,rows,faceVertexParity:parity,readLimitPassed:batch.ok&&directOriginalCalls<=40000,actualGpuPublication:false});
 }
 assert.equal(JSON.stringify(capture.original.save()),capture.p.initial);
 report.status='SOCKET_UNION_MEASURED_NOT_ADMITTED';
 console.log('UNION_NATIVE_TRANSACTIONS '+JSON.stringify(report.nativeTransactions));
}catch(e){report.error=String(e.stack??e);console.error(report.error);throw e;}
finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));}
