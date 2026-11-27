// Isolated Resonance B candidate: physical twin basin and connecting channel.
// Symbolic material roles only; no terrain, inventory or network writes.
export const CONTAINMENT_ID='resonance-twin-basin-v1';
const freeze=Object.freeze;
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const token=v=>typeof v==='string'&&v.length>0&&v.length<=128;
const key=(x,z)=>`${x},${z}`;
const directions=[[1,0],[0,1],[-1,0],[0,-1]];
const roles=freeze({floor:'resonance-containment-floor',rim:'resonance-containment-rim',keystone:'resonance-containment-keystone'});
function layout(){
  const wet=new Map(),rim=new Map();
  for(let x=-4;x<=4;x++)for(let z=-1;z<=1;z++){
    if(Math.abs(x)>=2||z===0)wet.set(key(x,z),[x,z]);
  }
  for(const [x,z] of wet.values())for(const [dx,dz] of directions){
    const nx=x+dx,nz=z+dz,k=key(nx,nz);
    if(!wet.has(k))rim.set(k,[nx,nz]);
  }
  return {wet:[...wet.values()],rim:[...rim.values()]};
}
function rotate(x,z,r){return [[x,z],[-z,x],[-x,-z],[z,-x]][r];}
// inspect receives the requested role and must attest loaded, empty physical
// terrain AND empty liquid, editable permission, unique owner and generation.
// Host callbacks must be synchronous, pure and stable for a planning batch.
export function planResonanceContainment({origin,rotation=0,fill=0,inspect,
  physics=null,store=null,canDraw=null,maxCells=128}={}){
  if(!Array.isArray(origin)||origin.length!==3||!Number.isSafeInteger(origin[0])||
    !int(origin[1],-209,256)||!Number.isSafeInteger(origin[2])||!int(rotation,0,3)||
    !int(fill,0,8)||!int(maxCells,1,128)||typeof inspect!=='function')throw new TypeError('invalid containment options');
  const [ox,oy,oz]=origin,{wet,rim}=layout();
  if(2*(wet.length+rim.length)>maxCells)return null;
  const edits=[],interior=[];
  function probe(x,y,z,kind,material){
    const [dx,dz]=rotate(x,z,rotation),px=ox+dx,pz=oz+dz,py=oy+y;
    if(!Number.isSafeInteger(px)||!Number.isSafeInteger(pz)||!int(py,-210,256))return null;
    const p=freeze({x:px,y:py,z:pz,kind,material});
    const s=inspect(p);
    if(s?.loaded!==true||s.empty!==true||s.permitted!==true||!token(s.owner)||!token(s.generation))return null;
    return freeze({...p,owner:s.owner,generation:s.generation});
  }
  for(const [x,z] of [...wet,...rim]){
    const p=probe(x,-1,z,'solid',roles.floor);if(!p)return null;edits.push(p);
  }
  for(const [x,z] of rim){
    const p=probe(x,0,z,'solid',Math.abs(x)===5&&z===0?roles.keystone:roles.rim);
    if(!p)return null;edits.push(p);
  }
  for(const [x,z] of wet){
    const p=probe(x,0,z,'interior',null);if(!p)return null;interior.push(p);
  }
  const deposits=[];let expectedStore=null,nextStore=null;
  if(fill){
    if(physics?.RESONANCE_ID!=='liquid-resonance'||typeof physics.restoreResonanceStore!=='function'||
      typeof physics.planResonanceInjection!=='function'||typeof canDraw!=='function'||!store)return null;
    expectedStore=physics.restoreResonanceStore(store);
    if(canDraw(expectedStore)!==true||expectedStore.units<wet.length*fill)return null;
    nextStore=expectedStore;
    for(const cell of interior){
      const p=physics.planResonanceInjection(nextStore,{permitted:true,loaded:true,contained:true,
        anchor:nextStore.anchor,availableCapacity:8,requested:fill,maxPerVisit:fill});
      if(!p||p.output.id!=='liquid-resonance'||p.output.units!==fill)return null;
      deposits.push(freeze({cell,output:p.output}));nextStore=p.nextStore;
    }
  }
  return freeze({version:1,id:CONTAINMENT_ID,origin:freeze([...origin]),rotation,fill,
    edits:freeze(edits),interior:freeze(interior),deposits:freeze(deposits),expectedStore,nextStore});
}
// A fresh canonical plan must match under the host's transaction lock. No
// commit executor here. Host rechecks revisions, material mappings, owner
// budgets and source/terrain permissions, then applies ALL edits and debits
// atomically or none. Never place a plan by iterating engine.insert calls.
export function revalidateResonanceContainment(plan,options){
  const fresh=planResonanceContainment(options);
  return fresh!==null&&JSON.stringify(fresh)===JSON.stringify(plan);
}
