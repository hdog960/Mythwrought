// Fixture contracts only; descriptors cannot execute gameplay or grant XP.
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9:_-]{0,63}$/.test(x);
const exact=(x,keys)=>x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>Object.hasOwn(x,k));
const modifier=x=>Number.isInteger(x)&&x>=-10000&&x<=10000;
export function validateFixtureEffect(e){
  if(!exact(e,['id','kind','contract','payload'])||!id(e.id)||!id(e.contract)||!e.contract.startsWith('fixture:'))throw Error('Invalid effect');
  const p=e.payload;let valid=false;
  switch(e.kind){
    case 'passive':valid=exact(p,['stat','basisPoints'])&&id(p.stat)&&modifier(p.basisPoints);break;
    case 'active':valid=exact(p,['ability'])&&id(p.ability);break;
    case 'conditional':valid=exact(p,['condition','stat','basisPoints'])&&id(p.condition)&&id(p.stat)&&modifier(p.basisPoints);break;
    case 'mastery':valid=exact(p,['milestone'])&&id(p.milestone);break;
    case 'discovery':valid=exact(p,['discovery'])&&id(p.discovery);break;
  }
  if(!valid)throw Error('Invalid payload');return Object.freeze({...e,payload:Object.freeze({...p})});
}
// Discovery owner supplies a trusted witness reader, not a client-supplied boolean.
export function verifyFixtureDiscovery(effect,evidence,readWitness,scope){
  try{
    const e=validateFixtureEffect(effect);if(e.kind!=='discovery'||typeof readWitness!=='function'||typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope))return null;
    const w=readWitness(evidence);
    if(!exact(w,['scope','discovery','identity','committed'])||w.scope!==scope||w.discovery!==e.payload.discovery||w.committed!==true||!id(w.identity))return null;
    return w.identity;
  }catch{return null;}
}
