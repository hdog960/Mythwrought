// Future natural height providers must be versioned with their actual
// production generator. This is an interface validator, NOT registration or
// generation. No research source may override a historical world's baseline.
export function validateUpperNaturalProvider(provider,{seed,generator}={}){
 if(!provider||!Number.isSafeInteger(seed)||typeof generator!=='string'||
   provider.seed!==seed||provider.generator!==generator||
   typeof provider.sourceVersion!=='string'||!provider.sourceVersion||
   typeof provider.get!=='function'||typeof provider.occupied!=='function'||
   typeof provider.revision!=='function')throw TypeError('Invalid versioned upper natural provider');
 return provider;
}

// Explicit, new source identities only. No historical profile can be rebound.
const PROFILE_KIND='mythwrought-upper-source-profile';
export function createUpperNaturalRegistry(){
 const factories=new Map();
 return Object.freeze({
  register(generator,sourceVersion,factory){
   if(typeof generator!=='string'||!generator.startsWith('mythwrought-upper-')||
      typeof sourceVersion!=='string'||!sourceVersion||typeof factory!=='function'||factories.has(generator))
    throw Error('New unique upper generator identity required');
   factories.set(generator,{sourceVersion,factory});
  },
  open(profile){
   if(!profile||profile.kind!==PROFILE_KIND||profile.version!==1||
      !Number.isSafeInteger(profile.seed)||profile.seed!==(profile.seed|0)||
      Object.keys(profile).sort().join(',')!=='generator,kind,seed,sourceVersion,version')throw Error('Invalid upper generation profile');
   const row=factories.get(profile.generator);
   if(!row||row.sourceVersion!==profile.sourceVersion)throw Error('Unknown exact upper source version');
   const identity=Object.freeze({...profile});
   const provider=validateUpperNaturalProvider(row.factory(identity),identity);
   if(provider.sourceVersion!==identity.sourceVersion)throw Error('Upper source version mismatch');
   const get=provider.get.bind(provider),occupied=provider.occupied.bind(provider),revision=provider.revision.bind(provider);
   return Object.freeze({profile:identity,
    get(x,y,z){
     if(![x,y,z].every(Number.isSafeInteger)||y<20||y>256)return 0;
     const id=get(x,y,z);if(!Number.isInteger(id)||id<0||id>65534)throw Error('Invalid natural source block');return id;
    },
    occupied(key){if(typeof key!=='string'||!/^sky:-?\d+,-?\d+,(?:[0-9]|1[0-4])$/.test(key))return false;
     const v=occupied(key);if(typeof v!=='boolean')throw Error('Invalid natural occupancy result');return v;},
    revision(){const v=revision();if(!Number.isSafeInteger(v)||v<0)throw Error('Invalid natural source revision');return v;}
   });
  }
 });
}
