import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {isAbsolute,relative,resolve,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {verifyPngEvidence} from '../../src/auto-integration-support/nonblock-png-structure-gate.mjs';

export const stageEvidenceGroups=Object.freeze([
  'nonblock-runtime','nonblock-catalog','nonblock-meadow-woodland','nonblock-enchanted-fungi',
  'nonblock-caves','nonblock-inherited-extra','nonblock-world-props','nonblock-physical-fittings',
  'nonblock-effects','nonblock-offline'
]);
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const sizes=new Set(['667x375','844x390','932x430']);

function inside(root,path) {
  if(typeof path!=='string'||!path||isAbsolute(path))throw new Error('Unsafe evidence path');
  const absolute=resolve(root,path);
  const local=relative(root,absolute);
  if(!local||local==='..'||local.startsWith('..'+sep)||isAbsolute(local))
    throw new Error('Evidence path escapes root');
  return absolute;
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
  return {group,sourceFiles:Object.keys(fingerprints).length,screenshots:verified};
}

if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  const root=process.cwd();
  const groups=await Promise.all(stageEvidenceGroups.map(group=>verifyStageEvidenceGroup(root,group)));
  await writeFile(inside(root,'artifacts/nonblock-evidence-summary.json'),JSON.stringify({
    revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),groups
  },null,2)+'\n');
  console.log('Verified source and PNG integrity for',groups.reduce((n,g)=>n+g.screenshots.length,0),'captures');
}
