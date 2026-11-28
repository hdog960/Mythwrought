// Fixture-only candidate for the existing creature interaction owner. No XP writes.
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,20}$/.test(x);
export function createFixtureBeastMasteryVerifier({scope,world,profile,readContext,readWitness}={}){
  if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||!id(world)||!id(profile)||typeof readContext!=='function'||typeof readWitness!=='function')throw Error('Invalid host');
  return evidence=>{try{const c=readContext(),w=readWitness(evidence);
    if(c?.scope!==scope||c.mode!=='survival'||c.writable!==true||w?.scope!==scope||w.world!==world||w.profile!==profile||w.mode!=='survival'||w.authority!=='fixture:animal-owner'||w.action!=='tame'||w.natural!==true||w.previouslyOwned!==false||w.ownedAfter!==true||w.committed!==true||w.saveVerified!==true||w.recoveryRequired!==false||!id(w.creature))return null;
    return Object.freeze({skill:'pm:beast-mastery',semantic:['tame',world,profile,w.creature].join(':')});
  }catch{return null;}};
}
