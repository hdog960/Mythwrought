// Mountain V8 candidate namespace. Old releases only know their original
// localStorage key names and IndexedDB database names. No global monkeypatch,
// no worker-based exclusion, no migration, no deletion of old data.
export const V8_STORAGE_PREFIX='mythwrought-mountain-v8-isolated-v1:';
export const V8_ACTIVE_KEY='mythwrought-mountain-v8-active-v1';
const prefix=key=>V8_STORAGE_PREFIX+String(key);
export function mountainV8Storage(raw){
 if(!raw||!['getItem','setItem','removeItem','key'].every(k=>typeof raw[k]==='function'))
  throw Error('Verified local storage required');
 const keys=()=>{const out=[];for(let i=0;i<raw.length;i++){
  const k=raw.key(i);if(typeof k==='string'&&k.startsWith(V8_STORAGE_PREFIX))out.push(k.slice(V8_STORAGE_PREFIX.length));
 }return out;};
 return Object.freeze({get length(){return keys().length;},key:i=>keys()[i]??null,
  getItem:k=>raw.getItem(prefix(k)),setItem:(k,v)=>raw.setItem(prefix(k),v),
  removeItem:k=>raw.removeItem(prefix(k))});
}
export function mountainV8DatabaseFactory(raw){
 if(!raw||typeof raw.open!=='function')return null;
 return Object.freeze({open:(name,...args)=>raw.open(prefix(name),...args),
  ...(typeof raw.databases==='function'?{databases:async()=>{
   const list=await raw.databases();
   return list.filter(x=>typeof x.name==='string'&&x.name.startsWith(V8_STORAGE_PREFIX))
    .map(x=>({...x,name:x.name.slice(V8_STORAGE_PREFIX.length)}));
  }}:{})});
}
export function setMountainV8Active(raw,active){
 if(active)raw.setItem(V8_ACTIVE_KEY,'1');else raw.removeItem(V8_ACTIVE_KEY);
 if(raw.getItem(V8_ACTIVE_KEY)!==(active?'1':null))throw Error('Mountain storage selection could not be verified');
}
