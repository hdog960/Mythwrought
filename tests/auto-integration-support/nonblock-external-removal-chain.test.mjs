import test from 'node:test';
import assert from 'node:assert/strict';
import {verifyExternalRemovalChain as verify} from '../../src/auto-integration-support/nonblock-external-removal-chain.mjs';
const sha='a'.repeat(40), key='nb1:a', neighbor='nb1:b', old='nb1:old';
const fixture=()=>({seed:'seed-7',target:key,provenance:{kind:'external-real-hook-capture',mainCommit:sha,coreCommit:sha,producerCommits:{24:sha,36:sha,48:sha},schema1BackupVerified:true},stages:[
 {phase:'before',origin:'real-core',seed:'seed-7',captureSha:sha,visible:[key,neighbor],tombstones:[old],worldEditKeys:['edit1']},
 {phase:'picked',origin:'real-core',seed:'seed-7',captureSha:sha,visible:[key,neighbor],tombstones:[old],pickedKey:key},
 {phase:'removed',origin:'real-core',seed:'seed-7',captureSha:sha,visible:[neighbor],tombstones:[old,key],saveSchema:1,saveSeed:'seed-7',backupPreserved:true},
 {phase:'reloaded',origin:'real-schema1-reload',seed:'seed-7',captureSha:sha,visible:[neighbor],tombstones:[old,key],saveSchema:1,saveSeed:'seed-7',backupPreserved:true,worldEditKeys:['edit1']}
]});
test('consistent claimed trace is structurally valid, never live-certified',()=>{const r=verify(fixture());assert.equal(r.ok,true);assert.equal(r.live,false)});
const cases=[
 ['missing provenance',x=>delete x.provenance],
 ['bad commit',x=>x.provenance.coreCommit='not-a-sha'],
 ['wrong seed',x=>x.stages[2].seed='other'],
 ['duplicate identity',x=>x.stages[0].visible.push(key)],
 ['wrong pick',x=>x.stages[1].pickedKey=neighbor],
 ['pick mutates world',x=>x.stages[1].visible.pop()],
 ['neighbor deleted',x=>x.stages[2].visible=[]],
 ['respawn on reload',x=>x.stages[3].visible.push(key)],
 ['tombstone lost',x=>x.stages[3].tombstones=[old]],
 ['historical tombstone lost',x=>x.stages[2].tombstones=[key]],
 ['wrong save schema',x=>x.stages[2].saveSchema=2],
 ['backup not preserved',x=>x.stages[3].backupPreserved=false],
 ['edits changed',x=>x.stages[3].worldEditKeys=[]],
 ['fabricated reload origin',x=>x.stages[3].origin='real-core'],
 ['visible tombstone',x=>x.stages[2].visible.push(key)],
 ['incorrect phase',x=>x.stages[1].phase='removed']
];
for (const [name,mutate] of cases) test('rejects '+name,()=>{const x=fixture();mutate(x);assert.equal(verify(x).ok,false)});
