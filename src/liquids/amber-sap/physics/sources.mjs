// Finite tree-source coordinator; uses the existing single-source policy.
import {createSapSource} from './definition.mjs';
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
export function createSapSources({engine,isTreeAvailable,sources=[],maxSources=128,
  maxVisits=16,maxUnitsPerStep=16,snapshot=null}={}){
  if(typeof engine?.getCell!=='function'||typeof engine?.insert!=='function'||typeof isTreeAvailable!=='function')
    throw new TypeError('Explicit sap source host required');
  if(!int(maxSources,1,4096)||!int(maxVisits,1,4096)||!int(maxUnitsPerStep,1,32768)||
    !Array.isArray(sources)||sources.length>maxSources)throw new RangeError('Invalid sap source budget');
  const trees=new Set(),positions=new Set(),entries=[];
  let totalStock=0;
  for(const s of sources){
    if(!s||typeof s!=='object'||Array.isArray(s)||s.snapshot!==undefined)throw new TypeError('Invalid sap source descriptor');
    const {x,y,z,treeId,stock,rate=1,target=8}=s;
    const config=Object.freeze({x,y,z,treeId,stock,rate,target});
    const source=createSapSource(config),position=[x,y,z].join(',');
    if(trees.has(treeId)||positions.has(position))throw new TypeError('Duplicate tree or sap source position');
    if(!Number.isSafeInteger(totalStock+stock))throw new RangeError('Aggregate sap stock overflow');
    totalStock+=stock;trees.add(treeId);positions.add(position);
    entries.push({config,source});
  }
  const signature=JSON.stringify({maxSources,maxVisits,maxUnitsPerStep,sources:entries.map(e=>e.source.save().signature)});
  let cursor=0,busy=false;
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.signature!==signature||!int(snapshot.cursor,0,Math.max(0,entries.length-1))||
      !Array.isArray(snapshot.sources)||snapshot.sources.length!==entries.length)throw new TypeError('Invalid sap source collection snapshot');
    for(let i=0;i<entries.length;i++){
      if(!snapshot.sources[i])throw new TypeError('Missing sap source stock');
      entries[i].source=createSapSource({...entries[i].config,snapshot:snapshot.sources[i]});
    }
    cursor=snapshot.cursor;
  }
  function save(){
    if(busy)throw new Error('Active sap source collection');
    return {version:1,signature,cursor,sources:entries.map(e=>e.source.save())};
  }
  function step(){
    if(busy)throw new Error('Reentrant sap source collection');
    busy=true;
    let visited=0,inserted=0,fault=null;
    const changed=[];
    try{
      while(visited<Math.min(maxVisits,entries.length)&&inserted<maxUnitsPerStep){
        const {source,config}=entries[cursor];
        let n;
        try{n=source.collect(engine,isTreeAvailable,Math.min(8,maxUnitsPerStep-inserted));}
        catch(error){
          // Earlier successful injections retain their debit and dirty receipt.
          // A failed visit keeps its cursor; host must diagnose before retry.
          fault=Object.freeze({treeId:config.treeId,error});break;
        }
        if(n){inserted+=n;changed.push(Object.freeze([config.x,config.y,config.z]));}
        visited++;cursor=(cursor+1)%entries.length;
      }
      return Object.freeze({visited,inserted,changed:Object.freeze(changed),fault});
    }finally{busy=false;}
  }
  return Object.freeze({step,save});
}
