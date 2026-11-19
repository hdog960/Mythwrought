import test from "node:test";
import assert from "node:assert/strict";
import {auditSiblingRemovalWitness as audit} from "../../src/auto-integration-support/nonblock-sibling-removal-gate.mjs";
const obj=(key)=>({key,family:"flora-a",seed:"179",anchor:"1,2,3",aabb:[0,0,0,1,1,1]});
const a=obj("nonblock:a"),b=obj("nonblock:b");
const heads=["00","24","36","48"].map(lane=>({lane,sha:"a".repeat(40)}));
const valid=()=>({productionEnabled:false,schema:1,seed:"179",before:[a,b],after:[b],reloaded:[b],targetKey:a.key,tombstonesBefore:["nonblock:historic"],tombstonesAfter:["nonblock:historic",a.key],tombstonesReloaded:["nonblock:historic",a.key],editsBefore:"edit-hash",editsAfter:"edit-hash",editsReloaded:"edit-hash",backupBefore:"backup-hash",backupAfter:"backup-hash",pick:{key:a.key},break:{key:a.key},remove:{key:a.key},reload:{seed:"179"},sourceHeads:heads.map(h=>({...h}))});
test("fixture accepted but never live",()=>assert.deepEqual(audit(valid()),{accepted:true,live:false,errors:[]}));
for(const [name,mutate] of [
["respawn",w=>w.reloaded.push(a)],
["sibling mutated",w=>w.after[0]={...b,anchor:"9,9,9"}],
["historical tombstone lost",w=>w.tombstonesReloaded=[a.key]],
["edit changed",w=>w.editsAfter="different"],
["backup changed",w=>w.backupAfter="different"],
["wrong pick",w=>w.pick.key=b.key],
["duplicate instance",w=>w.before.push(a)],
["invalid aabb",w=>w.before[0]={...a,aabb:[0,0,0,0,1,1]}],
["missing producer SHA",w=>w.sourceHeads[2].sha="stale"],
["production enabled",w=>w.productionEnabled=true],
["schema migration",w=>w.schema=2],
["seed drift",w=>w.reloaded[0]={...b,seed:"other"}]
])test("reject "+name,()=>{const w=valid();mutate(w);assert.equal(audit(w).accepted,false);});
