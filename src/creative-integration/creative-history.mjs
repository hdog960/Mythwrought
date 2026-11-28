// Session-only Creative undo/redo journal. Owner adapters remain responsible
// for real collision, support, geometry rebuild, persistence and rollback.
// Only verified owner transactions enter this journal; no storage writes here.
const canonical=value=>{
  if(value===null||typeof value==='string'||typeof value==='boolean'||Number.isFinite(value))return value;
  if(Array.isArray(value))return Object.freeze(value.map(canonical));
  if(value&&Object.getPrototypeOf(value)===Object.prototype){
    return Object.freeze(Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])));
  }
  throw Error('History requires finite JSON owner state');
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function createCreativeHistory({limit=64}={}){
  if(!Number.isInteger(limit)||limit<1||limit>128)throw RangeError('Invalid Creative history capacity');
  let token=null,undo=[],redo=[];
  function reset(worldToken=null){token=worldToken;undo=[];redo=[];}
  function status(){return Object.freeze({worldToken:token,undo:undo.length,redo:redo.length});}
  function record({worldToken,owner,target,before,after}={}){
    if(typeof worldToken!=='string'||!worldToken||typeof owner!=='string'||!owner)
      throw Error('Missing Creative world or placement owner');
    const entry=Object.freeze({owner,target:canonical(target),before:canonical(before),after:canonical(after)});
    if(same(entry.before,entry.after))return false;
    if(JSON.stringify(entry).length>65536)throw Error('Creative edit too large for session history');
    if(token!==worldToken)reset(worldToken);
    undo.push(entry);if(undo.length>limit)undo.shift();redo=[];return true;
  }
  function replay(direction,{worldToken,read,apply}={}){
    const from=direction==='undo'?undo:redo,to=direction==='undo'?redo:undo;
    if(worldToken!==token)return {ok:false,reason:'History belongs to another world'};
    if(!from.length)return {ok:false,reason:'No '+direction+' available'};
    if(typeof read!=='function'||typeof apply!=='function')return {ok:false,reason:'Placement owner unavailable'};
    const entry=from[from.length-1],expected=direction==='undo'?entry.after:entry.before,
      desired=direction==='undo'?entry.before:entry.after;
    let current;
    try{current=canonical(read(entry));}catch(_){return {ok:false,reason:'Cannot read current owner state'};}
    if(!same(current,expected)){
      reset(token);return {ok:false,reason:'Block changed outside Creative history; history cleared'};
    }
    let committed=false;
    try{committed=apply(entry,desired,expected)===true;}catch(_){/* verify rollback below */}
    try{current=canonical(read(entry));}catch(_){reset(token);return {ok:false,reason:'Owner readback unavailable; history cleared'};}
    if(!committed||!same(current,desired)){
      if(!same(current,expected)){
        reset(token);return {ok:false,reason:'Owner state changed without verified commit; history cleared'};
      }
      return {ok:false,reason:'Owner refused edit; original state retained'};
    }
    from.pop();to.push(entry);return {ok:true,owner:entry.owner,target:entry.target};
  }
  return Object.freeze({record,reset,status,undo:adapter=>replay('undo',adapter),redo:adapter=>replay('redo',adapter)});
}
