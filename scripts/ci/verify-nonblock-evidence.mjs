import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {isAbsolute,relative,resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {verifyPngEvidence} from '../../src/auto-integration-support/nonblock-png-structure-gate.mjs';
import {candidateFamilies} from '../../src/nonblock/candidate-families.mjs';
import {OWNED_FITTING_IDS} from '../../src/nonblock/physical-fittings.mjs';
import {EFFECT_IDS} from '../../src/nonblock/candidate-effects.mjs';

export const stageEvidenceGroups=Object.freeze([
  'nonblock-runtime','nonblock-catalog','nonblock-meadow-woodland','nonblock-enchanted-fungi',
  'nonblock-caves','nonblock-inherited-extra','nonblock-world-props','nonblock-physical-fittings',
  'nonblock-effects','nonblock-offline','nonblock-cache-recovery','nonblock-habitat',
  'forest-floor-review-after','nonblock-lod'
]);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const sizes=new Set(['667x375','844x390','932x430']);
const sceneryGroups=new Set(['nonblock-catalog','nonblock-meadow-woodland','nonblock-enchanted-fungi',
  'nonblock-caves','nonblock-inherited-extra','nonblock-world-props']);
const roster={scenery:[...candidateFamilies.keys()],fittings:OWNED_FITTING_IDS,effects:EFFECT_IDS};

function inside(root,path) {
  if(typeof path!=='string'||!path||isAbsolute(path))throw new Error('Unsafe evidence path');
  const absolute=resolve(root,path);
  const local=relative(root,absolute);
  if(!local||local==='..'||local.startsWith('..'+sep)||isAbsolute(local))
    throw new Error('Evidence path escapes root');
  return absolute;
}

function catalogEntries(group,data,shots) {
  if(sceneryGroups.has(group)){
    const ids=shots.map(shot=>{
      const id=shot.sceneId??shot.placement?.sceneId;
      if(typeof id!=='string'||!shot.instanceKey?.startsWith('nb1:'+encodeURIComponent(id)+':'))
        throw new Error(group+' screenshot does not identify its staged instance');
      return id;
    });
    if(data.storageSummary&&(data.storageSummary.tombstones!==ids.length||
        data.storageSummary.reopenedVisibleCount!==0||data.storageSummary.schema1SaveBytesUnchanged!==true))
      throw new Error(group+' scenery lifecycle did not survive reload');
    return {kind:'scenery',ids};
  }
  if(group==='nonblock-physical-fittings'){
    if(data.schema1SaveBytesUnchanged!==true||!Array.isArray(data.plans))
      throw new Error('Fitting ownership evidence missing');
    return {kind:'fittings',ids:data.plans.map(plan=>plan.sceneId)};
  }
  if(group==='nonblock-effects'){
    if(!Array.isArray(data.effects)||data.observed?.[0]?.effects!==data.effects.length||
        data.observed?.[1]?.afterRemovalAndContextRestore!==true)
      throw new Error('Effect lifecycle evidence missing');
    return {kind:'effects',ids:data.effects.map(effect=>effect.sceneId)};
  }
  return null;
}

export function verifyStageCatalogCoverage(groups) {
  return Object.fromEntries(Object.entries(roster).map(([kind,expected])=>{
    const observed=groups.filter(group=>group.catalog?.kind===kind).flatMap(group=>group.catalog.ids);
    const actual=new Set(observed);
    if(observed.length!==expected.length||actual.size!==expected.length||expected.some(id=>!actual.has(id)))
      throw new Error(kind+' catalog evidence mismatch');
    return [kind,actual.size];
  }));
}

export async function verifyStageEvidenceGroup(root,group) {
  const prefix='artifacts/'+group;
  const data=JSON.parse(await readFile(inside(root,prefix+'/manifest.json'),'utf8'));
  const fingerprints=data.sourceSha256??data.sources;
  if(!fingerprints||typeof fingerprints!=='object'||Object.keys(fingerprints).length===0)
    throw new Error(group+' has no exact source digests');
  for(const [path,expected] of Object.entries(fingerprints)){
    const actual=digest(await readFile(inside(root,path)));
    if(actual!==expected)throw new Error(group+' source digest mismatch for '+path);
  }
  const shots=data.captures??data.checks??data.results??[
    {file:prefix+'/cold-offline-932x430.png',sha256:data.screenshotSha256}
  ];
  if(!Array.isArray(shots)||shots.length===0)throw new Error(group+' has no screenshots');
  const verified=[];
  for(const shot of shots){
    const path=shot.path??shot.file??shot.filename;
    const groupRoot=inside(root,prefix);
    if(typeof path!=='string'||!inside(root,path).startsWith(groupRoot+sep))
      throw new Error(group+' screenshot outside artifact group');
    const bytes=await readFile(inside(root,path));
    if(bytes.length<33)throw new Error(group+' screenshot missing PNG header');
    const width=bytes.readUInt32BE(16), height=bytes.readUInt32BE(20);
    if(!sizes.has(width+'x'+height)||shot.width!==undefined&&shot.width!==width||
      shot.height!==undefined&&shot.height!==height)throw new Error(group+' screenshot size mismatch');
    const result=verifyPngEvidence(bytes.toString('base64'),{width,height,sha256:shot.sha256});
    if(!result.ok)throw new Error(path+' '+result.reason);
    verified.push({path,width,height,sha256:shot.sha256});
  }
  return {group,sourceFiles:Object.keys(fingerprints).length,screenshots:verified,catalog:catalogEntries(group,data,shots)};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  const root=process.cwd();
  const groups=await Promise.all(stageEvidenceGroups.map(group=>verifyStageEvidenceGroup(root,group)));
  const catalog=verifyStageCatalogCoverage(groups);
  await writeFile(inside(root,'artifacts/nonblock-evidence-summary.json'),JSON.stringify({
    revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),catalog,groups
  },null,2)+'\n');
  console.log('Verified the 96-slot roster and source and PNG integrity for',
    groups.reduce((n,g)=>n+g.screenshots.length,0),'captures');
}
