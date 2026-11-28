// Use the released renderer's upper occupancy and resident section contract.
export function inspectUpperCover({player,sections,bounds,occupied,resident,read}){
 const x=Math.floor(player.x),z=Math.floor(player.z),eye=player.y+1.55;
 for(let s=1;s<=sections;s++){
  const b=bounds(s);
  if(b.maxY+1<=eye||!occupied(x,z,s))continue;
  if(!resident(x,z,s))return null;
  for(let y=Math.max(b.minY,Math.floor(eye));y<=b.maxY;y++)if(read(x,y,z)!==0)return true;
 }
 return false;
}
export function classifyHeightObservation({player,legacyMax,physicalMax,legacyObservation,upperCover}){
 const x=Math.floor(player.x),z=Math.floor(player.z);
 const result=kind=>({kind,surfaceY:null,x,z});
 if(!Number.isFinite(player.y)||player.y>physicalMax+1)return result('unknown');
 if(player.y< -3)return result('underground');
 if(player.y>legacyMax+1)return result('unknown'); // legacy-only evidence cannot establish an upper surface
 if(upperCover!==false)return result(upperCover===true?'covered':'unknown');
 return legacyObservation||result('unknown');
}

// Per observation batch: renderer-owned residency/occupancy, no allocation,
// no arbitrary map-pan reads. Empty upper sections are known air; occupied
// but unresident sections are unknown. Callbacks are chunk-owner scoped.
export function createPhysicalNavigationReader({legacyMin,legacyMax,physicalMax,sections,bounds,occupied,resident,legacyResident,read}){
 const cache=new Map(),ranges=Array.from({length:sections},(_,i)=>bounds(i+1));
 function state(x,z,s){
  const key=Math.floor(x/16)+','+Math.floor(z/16)+','+s;
  if(!cache.has(key)){
   const filled=!!occupied(x,z,s);
   cache.set(key,filled?(resident(x,z,s)?2:0):1);
  }
  return cache.get(key);
 }
 function owner(x,y,z){
  if(y<legacyMin||y>physicalMax)return 0;
  if(y<=legacyMax)return legacyResident(x,y,z)?2:0;
  return state(x,z,Math.ceil((y-legacyMax)/16));
 }
 function cell(x,y,z){
  const status=owner(x,y,z);
  if(status===0)return undefined;
  if(status===1)return 0;
  const id=read(x,y,z);
  return Number.isInteger(id)&&id>=0?id:undefined;
 }
 function surfaceAt(x,z){
  for(let s=sections;s>=1;s--){
   const status=state(x,z,s);
   if(status===0)return null;
   if(status===1)continue;
   const {minY,maxY}=ranges[s-1];
   for(let y=maxY;y>=minY;y--){
    const id=cell(x,y,z);
    if(id===undefined)return null;
    if(id!==0)return {id,y,surfaceY:y+1};
   }
  }
  if(!legacyResident(x,legacyMax,z))return null;
  for(let y=legacyMax;y>=legacyMin;y--){
   const id=cell(x,y,z);
   if(id===undefined)return null;
   if(id!==0)return {id,y,surfaceY:y+1};
  }
  return null;
 }
 return Object.freeze({surfaceAt,resident:(x,y,z)=>owner(x,y,z)!==0,read:cell});
}
export function observePhysicalNavigationSurface({player,reader,minY,maxY}){
 const x=Math.floor(player.x),z=Math.floor(player.z);
 const result=kind=>({kind,surfaceY:null,x,z});
 if(![player.x,player.y,player.z].every(Number.isFinite)||player.y>maxY+1)return result('unknown');
 if(player.y<minY)return result('underground');
 const top=reader.surfaceAt(x,z);
 if(!top)return result('unknown');
 return {...top,x,z,kind:top.surfaceY>player.y+1.55?'covered':'surface'};
}
export function flightDiscoveryRadius(playerY,surfaceY,legacyMax){
 if(!Number.isFinite(playerY))return 3;
 const above=playerY-(Number.isFinite(surfaceY)?surfaceY:legacyMax);
 return Math.min(8,3+Math.max(0,Math.floor(above/32)));
}
