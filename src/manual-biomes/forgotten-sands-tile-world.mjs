// Detached, bounded new-world research composite. Site identity is derived
// from ordinary seed and tile coordinates, never an opt-in player mode.
// No registration with production profile selectors or storage.
import {researchP0TileSite,P0_SITE_POLICY} from './forgotten-sands-tile-site-policy.mjs';
import {P0_MAX_COLUMNS_PER_STEP} from './forgotten-sands-grounded-probe.mjs';
export const P0_TILE_WORLD_KIND='mythwrought-forgotten-sands-tile-world-research-v1';
export const P0_TILE_BASE='7b04720b4d8d68209e7e47837fbc71e1d26a9b51';
const key=(x,y,z)=>[x,y,z].join(',');
const digest=async v=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(v)))),b=>b.toString(16).padStart(2,'0')).join('');
const freeze=o=>{if(o&&typeof o==='object'&&!Object.isFrozen(o)){for(const v of Object.values(o))freeze(v);Object.freeze(o);}return o;};
function tilesOf(tiles){
 if(!Array.isArray(tiles)||tiles.length<1||tiles.length>4||tiles.some(t=>!Array.isArray(t)||t.length!==2||!t.every(Number.isSafeInteger)||t.some(n=>Math.abs(n)>1900)))throw Error('Invalid bounded tile list');
 const sorted=tiles.map(t=>[...t]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 if(new Set(sorted.map(t=>t.join(','))).size!==sorted.length)throw Error('Duplicate research tile');
 return sorted;
}
export async function openP0TileWorld(seed,tiles,{P,V,F,H,N,reserved,revision,yieldControl}={}){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||!P||!V||!F||!H||!N||typeof reserved!=='function'||typeof revision!=='function')throw Error('Invalid detached tile world inputs');
 if(yieldControl!==undefined&&typeof yieldControl!=='function')throw TypeError('Expected a source scheduler callback');
 const epoch=revision();if(typeof epoch!=='string'||!epoch||epoch.length>256)throw Error('Invalid reservation epoch');
 const profile=P.fourRegionProfile(seed,P.M8_MOUNTAIN_GENERATOR),base=new P.FourRegionWorld(seed,profile),ordered=tilesOf(tiles);
 const lower=new Map(),upper=new Map(),occupied=new Set(),sites=[],outcomes=[],witnesses=[];
 const current=()=>revision()===epoch&&base.edits.size===0;
 const assertCurrent=()=>{if(!current())throw Error('Stale detached tile world');};
 for(const [tx,tz] of ordered){
  assertCurrent();
  const p=await researchP0TileSite(base,tx,tz,{P,V,F,H,reserved,revision,yieldControl});
  assertCurrent();
  if(!p.accepted){outcomes.push({tx,tz,reason:p.reason});continue;}
  const s=p.identity.site,r=(s.size-1)/2+8,rows=[];
  let columns=0;
  for(let x=s.x-r;x<=s.x+r;x++)for(let z=s.z-r;z<=s.z+r;z++){
   if(yieldControl&&columns===P0_MAX_COLUMNS_PER_STEP){await yieldControl({stage:'assemble',tile:[tx,tz],columns});assertCurrent();columns=0;}
   columns++;
   for(let y=0;y<=17+s.height;y++){
    const old=base.get(x,y,z),id=p.get(x,y,z);if(old===id)continue;
    const k=key(x,y,z);
    if(old!==0||id===0||base.environmentCaves.get(x,y,z)!==undefined||reserved(x,z)!==false||lower.has(k)||upper.has(k))throw Error('Tile source collision or reservation veto');
    rows.push([x,y,z,id]);(y<20?lower:upper).set(k,id);
    if(y>=20)occupied.add(H.physicalRegionAt(x,y,z).key);
    if(lower.size+upper.size>100000)throw Error('Detached total cell cap');
   }
  }
  if(rows.length!==p.identity.cells||await digest(rows)!==p.identity.geometrySha)throw Error('Tile geometry digest mismatch');
  sites.push(p.identity);outcomes.push({tx,tz,reason:'admitted'});
  witnesses.push({site:s,turn:p.identity.turn,lower:rows.find(r=>r[1]<20)??null,upper:rows.find(r=>r[1]>=20)??null});
 }
 assertCurrent();
 const manifest={kind:P0_TILE_WORLD_KIND,version:1,sourceBase:P0_TILE_BASE,sitePolicy:P0_SITE_POLICY,baseProfile:{...profile},reservationRevision:epoch,tiles:ordered,outcomes,sites};
 const identity=freeze({...manifest,manifestSha:await digest(manifest)});
 assertCurrent();
 const upperIdentity=freeze({kind:'mythwrought-upper-source-profile',version:1,seed,generator:'mythwrought-upper-forgotten-sands-tile-world-research-v1',sourceVersion:identity.manifestSha});
 const registry=N.createUpperNaturalRegistry();
 registry.register(upperIdentity.generator,upperIdentity.sourceVersion,p=>({seed:p.seed,generator:p.generator,sourceVersion:p.sourceVersion,get:(x,y,z)=>upper.get(key(x,y,z))??0,occupied:k=>occupied.has(k),revision:()=>0}));
 const provider=registry.open(upperIdentity);
 class Composite extends P.FourRegionWorld{
  constructor(){super(seed,profile);}
  naturalAndLandmarkBlock(x,y,z){return y>=20?provider.get(x,y,z):lower.get(key(x,y,z))??super.naturalAndLandmarkBlock(x,y,z);}
  upperNaturalOccupied(k){return provider.occupied(k);}
  get upperNaturalRevision(){return provider.revision();}
 }
 const world=new Composite();
 const portable=(w=world)=>{
  assertCurrent();if(!(w instanceof Composite))throw Error('Wrong detached world identity');
  return {identity,world:w.save()};
 };
 const restore=payload=>{
  assertCurrent();
  if(!payload||Object.keys(payload).sort().join(',')!=='identity,world'||JSON.stringify(payload.identity)!==JSON.stringify(identity))throw Error('Tile world identity mismatch');
  const w=payload.world;
  if(!w||w.schema!==1||w.seed!==seed||!Array.isArray(w.edits)||w.edits.length>10000||Object.keys(w).some(k=>!['schema','seed','edits','rotations'].includes(k))||w.rotations!==undefined&&!Array.isArray(w.rotations))throw Error('Invalid detached world save');
  const out=new Composite(),seen=new Set(),rotations=new Map();
  for(const r of w.rotations??[]){
   if(!Array.isArray(r)||r.length!==4||!r.every(Number.isSafeInteger)||r[3]<1||r[3]>3||rotations.has(key(...r.slice(0,3))))throw Error('Invalid detached rotation');
   rotations.set(key(...r.slice(0,3)),r[3]);
  }
  for(const r of w.edits){
   if(!Array.isArray(r)||r.length!==4||!r.every(Number.isSafeInteger))throw Error('Invalid detached edit');
   const k=key(...r.slice(0,3));if(seen.has(k)||!out.set(...r,rotations.get(k)??0)||!out.edits.has(k))throw Error('Noncanonical detached edit');
   seen.add(k);rotations.delete(k);
  }
  if(rotations.size||JSON.stringify(out.save())!==JSON.stringify(w))throw Error('Detached replay mismatch');
  assertCurrent();return out;
 };
 return Object.freeze({world,identity,portable,restore,witnesses:freeze(witnesses),counts:freeze({lower:lower.size,upper:upper.size,upperOwners:occupied.size}),placementAuthority:false});
}
