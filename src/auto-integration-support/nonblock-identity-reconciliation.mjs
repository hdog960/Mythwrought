// Candidate-only identity check; no producer imports, registry or save writes.
const integer=Number.isSafeInteger;
const canonical=o=>'nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant;
export function reconcileNonblockIdentity({producer,object,verifiedSource,approvedOrientationMapping}={}){
 const errors=[];
 if(verifiedSource!==true)errors.push('SOURCE_NOT_AUTHENTICATED');
 if(![':24',':36',':48'].includes(producer))errors.push('UNKNOWN_PRODUCER');
 if(!object||typeof object!=='object')return {ok:false,status:'NOT_VERIFIED',errors:[...errors,'MISSING_OBJECT']};
 const o=object,prefix={':24':'nonblock:',':36':'scene36:',':48':'scene48:'}[producer];
 if(!prefix||typeof o.sceneId!=='string'||!o.sceneId.startsWith(prefix))errors.push('NAMESPACE');
 if(!integer(o.seed)||!Array.isArray(o.anchor)||o.anchor.length!==3||!o.anchor.every(integer)||!integer(o.variant)||o.variant<0||o.variant>3)errors.push('INVALID_IDENTITY');
 if(typeof o.instanceKey!=='string'||!o.instanceKey.length)errors.push('MISSING_KEY');
 if(errors.some(e=>['INVALID_IDENTITY','MISSING_KEY','NAMESPACE'].includes(e)))return {ok:false,status:'NOT_VERIFIED',errors};
 const expected=canonical(o);
 if(producer===':36'){
  if(!integer(o.orientation)||o.orientation<0||o.orientation>3)errors.push('MISSING_ORIENTATION');
  if(o.instanceKey!==expected&&(!approvedOrientationMapping||approvedOrientationMapping.sourceKey!==o.instanceKey||approvedOrientationMapping.canonicalKey!==expected||approvedOrientationMapping.orientation!==o.orientation||approvedOrientationMapping.persistenceOwner!==':00'))errors.push('ORIENTATION_MAPPING_UNAPPROVED');
 }else if(o.instanceKey!==expected)errors.push('NONCANONICAL_KEY');
 return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'IDENTITY_PROPOSAL_ONLY_NOT_LIVE',errors,canonicalKey:expected,sourceKey:o.instanceKey};
}
export function auditIdentityCollisions(entries){
 if(!Array.isArray(entries))throw new TypeError('entries required');
 const keys=new Map(),errors=[];
 for(let i=0;i<entries.length;i++){
  const r=reconcileNonblockIdentity(entries[i]);
  if(!r.ok){errors.push({index:i,errors:r.errors});continue;}
  if(keys.has(r.canonicalKey))errors.push({index:i,errors:['CANONICAL_TOMBSTONE_COLLISION'],previous:keys.get(r.canonicalKey)});
  else keys.set(r.canonicalKey,i);
 }
 return {ok:errors.length===0,status:errors.length?'NOT_VERIFIED':'IDENTITY_FIXTURE_ONLY',errors};
}
