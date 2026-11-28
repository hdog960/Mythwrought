// UI actions delegate to protected specialization; no XP authority.
const fail=reason=>({ok:false,reason});
export function createFixtureSkillActions({scope,readContext,readView,engines}={}){
  if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||typeof readContext!=='function'||typeof readView!=='function'||!(engines instanceof Map))throw Error('Invalid UI host');
  const owned=new Map(engines);let busy=false,closed=false;const previews=new WeakMap();
  const allowed=()=>{const c=readContext();return !closed&&c?.scope===scope&&c.mode==='survival'&&c.writable===true&&c.inCombat===false&&c.hostileEngagement===false;};
  async function check(skill,revision){if(!allowed())return null;const v=await readView(skill);if(!allowed()||!v?.ok||!['empty','ready'].includes(v.kind)||v.skill?.id!==skill||v.allocation?.revision!==revision||!owned.has(skill))return null;return v;}
  async function change(skill,revision,op,arg){if(busy)return fail('busy');busy=true;try{const v=await check(skill,revision);if(!v)return fail('stale-or-context');const e=owned.get(skill);if(!allowed())return fail('context');return await (op==='respec'?e.respec(revision):e[op](arg,revision));}catch{return fail('unavailable');}finally{busy=false;}}
  return Object.freeze({async previewRespec(skill,revision){try{const v=await check(skill,revision);if(!v)return fail('stale-or-context');const p=Object.freeze({ok:true,skill,revision,refund:v.allocation.spent});previews.set(p,true);return p;}catch{return fail('unavailable');}},
    confirmRespec(p){if(!p||!previews.has(p))return Promise.resolve(fail('invalid-preview'));previews.delete(p);return change(p.skill,p.revision,'respec');},
    purchase:(s,r,n)=>change(s,r,'purchase',n),savePreset:(s,r,n)=>change(s,r,'savePreset',n),applyPreset:(s,r,n)=>change(s,r,'applyPreset',n),removePreset:(s,r,n)=>change(s,r,'removePreset',n),close(){closed=true;}});
}
// Derived statistics only; not a durable historical activity log.
export function skillStatistics(state){if(!state?.ok||!Array.isArray(state.skills)||state.skills.length!==24)return null;return Object.freeze({totalLevel:state.skills.reduce((n,s)=>n+s.level,0),totalXp:state.skills.reduce((n,s)=>n+s.xp,0),maxed:state.skills.filter(s=>s.maxed).length});}
