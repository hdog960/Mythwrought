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
