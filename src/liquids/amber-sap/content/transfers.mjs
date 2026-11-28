// Amber Sap B: pure content/host transaction proposals, never an inventory or engine.
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const symbol=s=>typeof s==='string'&&/^[a-zA-Z0-9:_-]{1,80}$/.test(s);
const maxQ=2**40;
function quantities(q){
  if(!q||typeof q!=='object'||Array.isArray(q))throw new TypeError('Invalid quantities');
  const entries=Object.entries(q).sort(([a],[b])=>a<b?-1:a>b?1:0);
  if(entries.length>8||entries.some(([k,v])=>!/^[a-z][a-z0-9-]{0,31}$/.test(k)||!int(v,0,maxQ)))throw new RangeError('Invalid quantity');
  return Object.freeze(Object.fromEntries(entries.filter(([,v])=>v!==0)));
}
function split(q,n,total){return quantities(Object.fromEntries(Object.entries(q).map(([k,v])=>[k,Math.floor(v*n/total)])));}
function remainder(q,t){return quantities(Object.fromEntries(Object.entries(q).map(([k,v])=>[k,v-(Object.hasOwn(t,k)?t[k]:0)])));}
function merge(a,b){const q=Object.fromEntries(Object.entries(a));for(const [k,v] of Object.entries(b))q[k]=(Object.hasOwn(q,k)?q[k]:0)+v;try{return quantities(q);}catch{return null;}}
const resource=(units,q)=>Object.freeze({id:units?'amber-sap':null,units,quantities:q});
export const AMBER_RESOURCE_PROPOSALS=Object.freeze([
  Object.freeze({id:'amber',label:'Hardened amber',kind:'solid-product',origin:'sap-curing',registered:false}),
  Object.freeze({id:'amber-adhesive',label:'Amber adhesive',kind:'crafting-proposal',input:'amber-sap',registered:false}),
  Object.freeze({id:'amber-preservation',label:'Amber preservation',kind:'crafting-proposal',input:'amber-sap',registered:false})
]);
// No recipe ratios, resource prices, inventory mutation or infinite Creative source.
// Host supplies an immutable, uniquely owned container record and explicit mode authorization.
export function planAmberTransfer({direction,position,units,container,engine,isLoaded,isOpen,canTransfer,creative=false}={}){
  if(!['collect','place'].includes(direction)||!point(position)||!int(units,1,8)||typeof creative!=='boolean'||
     !container||!symbol(container.id)||!int(container.revision,0,Number.MAX_SAFE_INTEGER)||!int(container.capacity,1,8)||!int(container.units,0,container.capacity)||
     [engine?.getCell,isLoaded,isOpen,canTransfer].some(f=>typeof f!=='function'))throw new TypeError('Invalid transfer host or request');
  if(container.liquidId!==(container.units?'amber-sap':null))return null;
  const cq=quantities(container.quantities);
  if(!container.units&&Object.keys(cq).length)return null;
  const p=Object.freeze([...position]);
  if(isLoaded(...p)!==true||isOpen(...p)!==true||canTransfer(direction,p,container,creative)!==true)return null;
  const cell=engine.getCell(...p);
  if(cell!==null&&(cell?.id!=='amber-sap'||!int(cell.units,1,8)||cell.x!==p[0]||cell.y!==p[1]||cell.z!==p[2]))return null;
  const wq=cell?quantities(cell.quantities):quantities({});
  const wu=cell?.units??0, cu=container.units;
  let moved,worldAfter,containerAfter;
  if(direction==='collect'){
    if(units>wu||units>container.capacity-cu)return null;
    moved=split(wq,units,wu);const q=merge(cq,moved);if(!q)return null;
    worldAfter=resource(wu-units,remainder(wq,moved));containerAfter=resource(cu+units,q);
  }else{
    if(units>cu||units>8-wu)return null;
    moved=split(cq,units,cu);const q=merge(wq,moved);if(!q)return null;
    worldAfter=resource(wu+units,q);containerAfter=resource(cu-units,remainder(cq,moved));
  }
  // Detached expectations are transient. Host rechecks identity, revision, policy,
  // capacity and terrain under its atomic world/inventory transaction before applying.
  return Object.freeze({kind:'amber-sap-transfer',direction,creative,position:p,units,moved,
    world:Object.freeze({expected:cell,after:worldAfter}),
    container:Object.freeze({id:container.id,revision:container.revision,expected:container,after:containerAfter})});
}
// Map only a ready physics-owned proposal. No dwell timer, no independent curing.
export function planHardenedAmber({proposal,curing,engine,isLoaded,isOpen,canPlaceAmber}={}){
  if([curing?.isReady,engine?.getCell,isLoaded,isOpen,canPlaceAmber].some(f=>typeof f!=='function'))throw new TypeError('Explicit curing host required');
  const c=proposal?.expected,p=[c?.x,c?.y,c?.z];
  if(!point(p)||c.id!=='amber-sap'||c.units!==8||proposal.consumeSap!==8||proposal.solidUnits!==8||proposal.product!=='amber'||Object.keys(quantities(c.quantities)).length)return null;
  if(isLoaded(...p)!==true||isOpen(...p)!==true||engine.getCell(...p)!==c||canPlaceAmber(...p)!==true||curing.isReady(proposal)!==true)return null;
  return Object.freeze({kind:'amber-solidification',position:Object.freeze(p),expected:c,physicsProposal:proposal,
    consumeSap:8,solidUnits:8,material:'amber'});
}
