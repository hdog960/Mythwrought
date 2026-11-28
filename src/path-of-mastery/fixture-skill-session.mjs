// Isolated PM fixture composition. UI receives no XP write capability.
import {getSkill,SKILLS} from './registry.mjs';
import {experienceProgress} from './experience.mjs';
import {CANDIDATE_TREES} from './candidate-trees.mjs';
import {compileTypedFixtureTree} from './typed-tree.mjs';
import {createProtectedFixtureSpecialization} from './protected-specialization.mjs';
import {createSkillView} from './skill-view.mjs';
import {createFixtureSkillActions} from './skill-actions.mjs';
const deny=reason=>({ok:false,reason});
export function createFixtureSkillSession({scope,ledger,readContext,storageFor,definitions=CANDIDATE_TREES}={}){
  if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||typeof ledger?.read!=='function'||typeof readContext!=='function'||typeof storageFor!=='function'||!Array.isArray(definitions)||definitions.length!==24)throw Error('Invalid fixture host');
  const trees=new Map(),engines=new Map();let snapshot=null,closed=false,tail=Promise.resolve();
  const context=()=>{const c=readContext();return {...c,writable:!closed&&c?.scope===scope&&c.writable===true&&['empty','ready'].includes(snapshot?.kind)};};
  const valid=data=>['empty','ready','sealed'].includes(data?.kind)&&Number.isSafeInteger(data.progress?.revision)&&SKILLS.every(s=>Number.isSafeInteger(data.progress.xp?.[s.id]));
  const read=async()=>{const data=await ledger.read();snapshot=valid(data)?data:null;return data;};
  for(const candidate of definitions){const {definition,typedEffects}=candidate,id=definition.skill;if(!getSkill(id)||trees.has(id))throw Error('Invalid skill catalog');
    const tree=compileTypedFixtureTree(definition,typedEffects).tree,base=storageFor(id);
    if(typeof base?.read!=='function'||typeof base?.compareExchange!=='function')throw Error('Invalid port');
    const storage={read:()=>base.read(),async compareExchange(expected,next){const before=snapshot,now=await ledger.read();if(!valid(now)||!before||now.kind!==before.kind||now.progress.revision!==before.progress.revision||now.progress.xp[id]!==before.progress.xp[id])return false;
      const c=context();if(c.writable!==true||c.mode!=='survival'||c.inCombat!==false||c.hostileEngagement!==false)return false;
      return base.compareExchange(expected,next);}};
    const {engine}=createProtectedFixtureSpecialization({scope,definition,typedEffects,readContext:context,readLevel:()=>experienceProgress(snapshot.progress.xp[id]).level,storage});
    trees.set(id,{tree,engine});engines.set(id,engine);
  }
  const internal=createSkillView({ledger:{read},trees});
  const actions=createFixtureSkillActions({scope,readContext:context,readView:id=>internal.read(getSkill(id)?.category,id),engines});
  function queue(fn){const task=tail.then(async()=>{if(closed)return deny('closed');try{await read();return await fn();}catch{return deny('unavailable');}});tail=task.catch(()=>{});return task;}
  const view=Object.freeze({read:(...args)=>queue(()=>internal.read(...args)),invalidate:()=>internal.invalidate()});
  const controls=Object.freeze(Object.fromEntries(['purchase','previewRespec','confirmRespec','savePreset','applyPreset','removePreset'].map(op=>[op,(...args)=>queue(()=>actions[op](...args))]).concat([['close',()=>{closed=true;actions.close();internal.invalidate();}]])));
  return Object.freeze({view,actions:controls,close:controls.close});
}
