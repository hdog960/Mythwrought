// Persistent, bounded observations; painting never invokes world generation.
export const OBSERVATION_LIMIT=8192, LANDMARK_LIMIT=128, SAMPLE_LIMIT=6;
const keyOf=(x,z)=>x+','+z;
const coord=n=>Number.isSafeInteger(n)&&Math.abs(n)<=10000000;
const tile=t=>Array.isArray(t)&&t.length===4&&coord(t[0])&&coord(t[1])&&/^#[0-9a-f]{6}$/i.test(t[2])&&Number.isInteger(t[3])&&t[3]>=-210&&t[3]<=257;
const mark=p=>p&&typeof p.id==='string'&&/^[a-zA-Z0-9_-]{1,48}$/.test(p.id)&&['cave','alpine'].includes(p.kind)&&[p.x,p.y,p.z].every(Number.isFinite)&&Math.abs(p.x)<=40000000&&Math.abs(p.z)<=40000000&&p.y>=-210&&p.y<=257;
export function createObservationCatalog({seed,discovery,storage=null}){
 if(!Number.isSafeInteger(seed)||!(discovery?.seen instanceof Set)||typeof discovery.has!=='function')throw Error('Real discovery required');
 const key='mythwrought-navigation00-observations-v1-'+seed;
 let tiles=new Map(),marks=new Map(),rawBefore=null,dirty=false,readOnly=false,warning='';
 try{
  if(storage&&(rawBefore=storage.getItem(key))!==null){
   if(rawBefore.length>1048576)throw Error('Observation record too large');
   const v=JSON.parse(rawBefore);
   if(v.version!==1||v.seed!==seed||!Array.isArray(v.tiles)||v.tiles.length>OBSERVATION_LIMIT||!v.tiles.every(tile)||!Array.isArray(v.marks)||v.marks.length>LANDMARK_LIMIT||!v.marks.every(mark))throw Error('Invalid observation record');
   tiles=new Map(v.tiles.map(t=>[keyOf(t[0],t[1]),Object.freeze([...t])]));
   marks=new Map(v.marks.map(p=>[p.id,Object.freeze({id:p.id,kind:p.kind,x:p.x,y:p.y,z:p.z})]));
   if(tiles.size!==v.tiles.length||marks.size!==v.marks.length)throw Error('Duplicate observation record');
  }
 }catch(e){tiles.clear();marks.clear();readOnly=true;warning=String(e);}
 return Object.freeze({
  key,get warning(){return warning;},get readOnly(){return readOnly;},get tileCount(){return tiles.size;},
  ink(x,z){const k=keyOf(x,z);return discovery.seen.has(k)?tiles.get(k)?.[2]||'#35464a':'#122126';},
  height(x,z){const k=keyOf(x,z);return discovery.seen.has(k)?tiles.get(k)?.[3]??null:null;},
  has(x,z){return tiles.has(keyOf(x,z));},
  observeTile(x,z,ink,y,{witnessed=false}={}){
   const t=[x,z,ink,y],k=keyOf(x,z);
   if(readOnly||!witnessed||!tile(t)||!discovery.seen.has(k))return false;
   const prior=tiles.get(k);
   if(prior?.[2]===ink&&prior[3]===y)return true;
   if(!prior&&tiles.size>=OBSERVATION_LIMIT){warning='Observation capacity reached';return false;}
   tiles.set(k,Object.freeze(t));dirty=true;return true;
  },
  observeLandmark(p,{witnessed=false}={}){
   if(readOnly||!witnessed||!mark(p)||!discovery.has(p.x,p.z))return false;
   if(marks.has(p.id))return true;
   if(marks.size>=LANDMARK_LIMIT){warning='Landmark capacity reached';return false;}
   marks.set(p.id,Object.freeze({id:p.id,kind:p.kind,x:p.x,y:p.y,z:p.z}));dirty=true;return true;
  },
  visible(){return [...marks.values()].filter(p=>discovery.has(p.x,p.z)).map(p=>({...p,label:p.kind==='cave'?'Observed natural cave passage':'Observed alpine rock'}));},
  flush(){
   if(readOnly)return false;
   if(!dirty)return true;
   if(!storage){dirty=false;return true;}
   try{
    if(storage.getItem(key)!==rawBefore){readOnly=true;throw Error('Observation record changed in another session');}
    const raw=JSON.stringify({version:1,seed,tiles:[...tiles.values()],marks:[...marks.values()]});
    if(raw.length>1048576)throw Error('Observation storage budget exceeded');
    storage.setItem(key,raw);
    if(storage.getItem(key)!==raw){readOnly=true;throw Error('Observation readback mismatch');}
    rawBefore=raw;dirty=false;warning='';return true;
   }catch(e){warning=String(e);return false;}
  }
 });
}
export function sampleNearbyObservations({catalog,discovery,player,residentAt,sample,refreshIndex=0,admit=null}){
 if(![player.x,player.z].every(Number.isFinite))return 0;
 const cx=Math.floor(player.x/4),cz=Math.floor(player.z/4),candidates=[];
 for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){
  if(dx*dx+dz*dz>9)continue;
  const x=cx+dx,z=cz+dz;
  if(admit||discovery.seen.has(keyOf(x,z)))candidates.push({x,z,d:dx*dx+dz*dz});
 }
 candidates.sort((a,b)=>a.d-b.d||a.z-b.z||a.x-b.x);
 const missing=candidates.filter(t=>!catalog.has(t.x,t.z)),known=candidates.filter(t=>catalog.has(t.x,t.z));
 const rotate=known.length?Math.abs(refreshIndex)%known.length:0;
 const shift=missing.length?Math.abs(refreshIndex*SAMPLE_LIMIT)%missing.length:0;
 let sampled=0;
 for(const t of [...missing.slice(shift),...missing.slice(0,shift),...known.slice(rotate),...known.slice(0,rotate)]){
  if(sampled>=SAMPLE_LIMIT)break;
  const x=t.x*4+2,z=t.z*4+2;
  if(!residentAt(x,z))continue;
  sampled++;const observed=sample(x,z);
  if(observed&&(!admit||admit(t.x,t.z)))catalog.observeTile(t.x,t.z,observed.ink,observed.y,{witnessed:true});
 }
 return sampled;
}
