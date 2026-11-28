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

// Per observation batch: renderer-owned residency/occupancy, no GPU allocation,
// no arbitrary map-pan reads. Empty upper sections are known air. Nonresident
// source reads are possible ONLY for a bounded live aerial survey, never pan,
// underground observation or painting. Callbacks are chunk-owner scoped.
export function createPhysicalNavigationReader({legacyMin,legacyMax,physicalMax,sections,bounds,occupied,resident,legacyResident,read,survey=null}){
 const cache=new Map(),sourceCache=new Map(),ranges=Array.from({length:sections},(_,i)=>bounds(i+1));
 let sourceReads=0;
 const validSurvey=!!survey&&[survey.x,survey.z,survey.radius].every(Number.isFinite)&&survey.radius>0&&survey.radius<=36&&Number.isInteger(survey.maxReads)&&survey.maxReads>0&&survey.maxReads<=128;
 const surveyed=(x,z)=>validSurvey&&Math.hypot(x+.5-survey.x,z+.5-survey.z)<=survey.radius;
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
  if(y<=legacyMax)return legacyResident(x,y,z)?2:surveyed(x,z)?3:0;
  const status=state(x,z,Math.ceil((y-legacyMax)/16));
  return status===0&&surveyed(x,z)?3:status;
 }
 function cell(x,y,z){
  const status=owner(x,y,z);
  if(status===0)return undefined;
  if(status===1)return 0;
  if(status===3){
   const key=x+','+y+','+z;
   if(sourceCache.has(key))return sourceCache.get(key);
   if(sourceReads>=survey.maxReads)return undefined;
   sourceReads++;
   let id;try{id=read(x,y,z);}catch(_){id=undefined;}
   const value=Number.isInteger(id)&&id>=0?id:undefined;
   sourceCache.set(key,value);return value;
  }
  const id=read(x,y,z);
  return Number.isInteger(id)&&id>=0?id:undefined;
 }
 function surfaceAt(x,z,ceiling=physicalMax){
  if(!Number.isFinite(ceiling))return null;
  const limit=Math.min(physicalMax,Math.floor(ceiling));
  for(let s=sections;s>=1;s--){
   const {minY,maxY}=ranges[s-1];
   if(minY>limit)continue;
   const top=Math.min(maxY,limit);
   const status=owner(x,top,z);
   if(status===0)return null;
   if(status===1)continue;
   for(let y=top;y>=minY;y--){
    const id=cell(x,y,z);
    if(id===undefined)return null;
    if(id!==0)return {id,y,surfaceY:y+1};
   }
  }
  const groundTop=Math.min(legacyMax,limit);
  if(!owner(x,groundTop,z))return null;
  for(let y=groundTop;y>=legacyMin;y--){
   const id=cell(x,y,z);
   if(id===undefined)return null;
   if(id!==0)return {id,y,surfaceY:y+1};
  }
  return null;
 }
 return Object.freeze({legacyMax,surfaceAt,resident:(x,y,z)=>owner(x,y,z)!==0,read:cell,get sourceReads(){return sourceReads;}});
}
export function observePhysicalNavigationSurface({player,reader,minY,maxY}){
 const x=Math.floor(player.x),z=Math.floor(player.z);
 const result=kind=>({kind,surfaceY:null,x,z});
 if(![player.x,player.y,player.z].every(Number.isFinite)||player.y>maxY+1)return result('unknown');
 if(player.y<minY)return result('underground');
 // Preserve legacy cave protection: do not look down into a cave to
 // manufacture surface discovery. Sky islands above the eye, however,
 // are not a roof over the entire ground map. Airborne survey chooses
 // the highest surface at/below the eye and still requires a real ray.
 const legacyMax=reader.legacyMax;
 const limit=player.y<=legacyMax+1?legacyMax:Math.floor(player.y+1.55)-1;
 const top=reader.surfaceAt(x,z,limit);
 if(!top)return result('unknown');
 return {...top,x,z,kind:top.surfaceY>player.y+1.55?'covered':'surface'};
}
export function flightDiscoveryRadius(playerY,surfaceY,legacyMax){
 if(!Number.isFinite(playerY))return 3;
 const above=playerY-(Number.isFinite(surfaceY)?surfaceY:legacyMax);
 return Math.min(8,3+Math.max(0,Math.floor(above/32)));
}
