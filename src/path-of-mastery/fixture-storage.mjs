// Isolated real IndexedDB adapter. Never open a production database or save key.
const id = x => typeof x === 'string' && /^[a-zA-Z0-9:_./-]{1,96}$/.test(x);
const sequence = x => Number.isSafeInteger(x) && x > 0;
const MAX_BYTES = 65536, MAX_EVENTS = 1000000;
const validBytes = x => typeof x === 'string' && x.length <= MAX_BYTES;
export async function openFixtureStorage({indexedDB, scope, producer, verify, readContext}={}) {
  if (!indexedDB || !id(scope) || !/^fixture:.+$/.test(scope) || !id(producer) ||
      typeof verify !== 'function' || typeof readContext !== 'function') throw Error('Invalid fixture host');
  const db = await new Promise((resolve,reject)=>{
    const req=indexedDB.open('mythwrought-pm4-fixture:'+scope,1); let blocked=false;
    req.onupgradeneeded=()=>req.result.createObjectStore('records');
    req.onerror=()=>reject(req.error);req.onblocked=()=>{blocked=true;reject(Error('Blocked database'));};
    req.onsuccess=()=>{if(blocked)req.result.close();else resolve(req.result);};
  });
  db.onversionchange=()=>db.close();
  const context=()=>{const c=readContext();return c?.scope===scope&&c.mode==='survival'&&c.writable===true;};
  function transact(mode,work){
    return new Promise((resolve,reject)=>{
      const tx=db.transaction('records',mode), store=tx.objectStore('records');let value, failure;
      tx.oncomplete=()=>resolve(value);tx.onabort=()=>reject(failure??tx.error??Error('Aborted'));
      const abort=e=>{failure=e;try{tx.abort();}catch{reject(e);}};
      const get=(key,next)=>{const req=store.get(key);req.onsuccess=()=>{try{next(req.result);}catch(e){abort(e);}};};
      const put=(key,v)=>store.put(v,key);
      const done=v=>{value=v;};
      try{work({get,put,done});}catch(e){abort(e);}
    });
  }
  const prefix='producer|'+producer+'|';
  return Object.freeze({
    close:()=>db.close(),
    read:()=>transact('readonly',({get,done})=>get('ledger',v=>{if(v!==undefined&&!validBytes(v))throw Error('Corrupt ledger');done(v??null);})),
    compareExchange(expected,next){
      if(!(expected===null||validBytes(expected))||!validBytes(next))return Promise.reject(Error('Invalid CAS bytes'));
      return transact('readwrite',({get,put,done})=>get('ledger',v=>{
        if(v!==undefined&&!validBytes(v))throw Error('Corrupt ledger');
        if((v??null)!==expected||!context()){done(false);return;}
        put('ledger',next);done(true);
      }));
    },
    // Owner verifier must return canonical semantic identity for a committed action.
    // Sequence allocation and semantic uniqueness are committed in ONE transaction.
    record(evidence){return transact('readwrite',({get,put,done})=>{
      if(!context()){done({ok:false,reason:'context'});return;}
      const semantic=verify(evidence);if(!id(semantic)){done({ok:false,reason:'unverified'});return;}
      get(prefix+'semantic|'+semantic,existing=>{
        if(existing!==undefined){if(!sequence(existing))throw Error('Corrupt semantic index');done({ok:false,reason:'duplicate',sequence:existing});return;}
        get(prefix+'cursor',cursor=>{
          const last=cursor??0;if(!Number.isSafeInteger(last)||last<0||last>MAX_EVENTS)throw Error('Corrupt producer cursor');
          if(last===MAX_EVENTS||!context()){done({ok:false,reason:'capacity-or-context'});return;}
          const seq=last+1;put(prefix+'cursor',seq);put(prefix+'semantic|'+semantic,seq);put(prefix+'event|'+seq,semantic);
          done({ok:true,sequence:seq});
        });
      });
    });},
    // Retained outbox; recovery can replay against ledger's durable cursor.
    event(seq){if(!sequence(seq)||seq>MAX_EVENTS)return Promise.reject(Error('Invalid sequence'));
      return transact('readonly',({get,done})=>get(prefix+'event|'+seq,semantic=>{
        if(semantic!==undefined&&!id(semantic))throw Error('Corrupt event');
        done(semantic===undefined?null:Object.freeze({producer,sequence:seq,semantic}));
      }));},
  });
}
