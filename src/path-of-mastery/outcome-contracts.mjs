// PM9/10 fixture-only witnesses. No health, movement, map or XP mutation.
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,14}$/.test(x);
const scopeOk=x=>typeof x==='string'&&/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(x);
const revision=x=>Number.isSafeInteger(x)&&x>0;
const methods=Object.freeze({melee:'pm:attack',projectile:'pm:archery',spell:'pm:sorcery'});
function host({scope,world,profile,readContext,readWitness}){
  if(!scopeOk(scope)||!id(world)||!id(profile)||typeof readContext!=='function'||typeof readWitness!=='function')throw Error('Invalid fixture host');
  return evidence=>{const c=readContext(),w=readWitness(evidence);
    return c?.scope===scope&&c.mode==='survival'&&c.writable===true&&w?.scope===scope&&w.world===world&&w.profile===profile&&w.mode==='survival'&&w.committed===true&&w.saveVerified===true&&w.recoveryRequired===false?w:null;};
}
export function createFixtureCombatVerifier(options){
  const read=host(options);
  return evidence=>{try{const w=read(evidence);
    if(!w||w.authority!=='fixture:health-owner'||w.sourceRole!=='player'||w.targetRole!=='hostile-natural'||!id(w.encounter)||!id(w.action)||!id(w.target)||!revision(w.healthRevision)||!Number.isFinite(w.appliedDamage)||w.appliedDamage<=0||w.appliedDamage>1000000||!Object.hasOwn(methods,w.delivery)||typeof w.permanentDefeat!=='boolean'||typeof w.downed!=='boolean'||(w.permanentDefeat&&w.downed))return null;
    // Reward policy candidate: accepted damage only. Permanent defeat is metadata,
    // not a second award. A health-owner revision identifies a single outcome.
    return Object.freeze({skill:methods[w.delivery],semantic:['hit',w.world,w.profile,w.target,w.encounter,w.healthRevision].join(':'),permanentDefeat:w.permanentDefeat});
  }catch{return null;}};
}
export function createFixtureDiscoveryVerifier(options){
  const read=host(options);
  return evidence=>{try{const w=read(evidence);
    if(!w||w.authority!=='fixture:navigation-owner'||!id(w.generation)||!id(w.landmark)||!['landmark','cave-entrance','summit'].includes(w.kind)||w.firstDiscovery!==true||w.observed!==true||w.generated!==true||w.method!=='physical-observation')return null;
    return Object.freeze({skill:'pm:exploration',semantic:['discover',w.world,w.profile,w.generation,w.landmark].join(':')});
  }catch{return null;}};
}
// Hostile engagement and active combat are separate authoritative signals.
export function fixtureRespecContext(readContext){
  return ()=>{const c=readContext();return {...c,inCombat:c?.inCombat===false&&c.hostileEngagement===false?false:true};};
}
