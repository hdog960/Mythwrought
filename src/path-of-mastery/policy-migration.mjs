// Non-destructive fixture policy migration preview. Never writes or opens a production save.
import {createDurableSpecialization} from './durable-specialization.mjs';
import {createFixtureRecoveryPort} from './specialization-recovery.mjs';
import {compileTypedFixtureTree} from './typed-tree.mjs';
import {candidatePoints} from './specialization.mjs';
export async function previewFixturePolicyMigration({scope,source,from,to,readContext,level,interval=3}={}){
 try{
  if(!scope?.startsWith('fixture:')||typeof source?.read!=='function'||from.definition.skill!==to.definition.skill)throw Error('Invalid migration');
  const raw=await source.read();if(raw===null)return {ok:false,reason:'missing-source'};
  // Capture original bytes once; use existing recovery and snapshot validators, with no write path.
  const locked={read:()=>raw,compareExchange:()=>false};
  const old=createDurableSpecialization({scope,definition:from.definition,typedEffects:from.typedEffects,readContext,readLevel:()=>level,storage:locked,interval});
  const recovery=createFixtureRecoveryPort({scope,storage:locked,readContext,validate:old.validateSnapshot});
  if((await recovery.status()).kind!=='ready')return {ok:false,reason:'source-not-ready'};
  const state=JSON.parse(await recovery.port.read()),compiled=compileTypedFixtureTree(to.definition,to.typedEffects);
  if(!old.validateSnapshot(JSON.stringify(state)))return {ok:false,reason:'invalid-source'};
  try{compiled.tree.inspect(state.ranks,level,candidatePoints(level,interval));for(const p of state.presets)compiled.tree.inspect(p.ranks,99,candidatePoints(99,interval));}catch{return {ok:false,reason:'incompatible-allocation',original:raw};}
  const next=JSON.stringify({...state,policy:JSON.stringify([compiled.policy,interval])});
  const validator=createDurableSpecialization({scope,definition:to.definition,typedEffects:to.typedEffects,readContext,readLevel:()=>level,storage:locked,interval});
  if(!validator.validateSnapshot(next)||await source.read()!==raw)return {ok:false,reason:'source-changed-or-invalid'};
  return Object.freeze({ok:true,kind:'migration-preview',original:raw,candidate:next,revision:state.revision,skill:to.definition.skill});
 }catch{return {ok:false,reason:'invalid-or-unavailable'};}
}
