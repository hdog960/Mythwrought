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
 if(player.y>legacyMax+1)return result('upper');
 if(upperCover!==false)return result(upperCover===true?'covered':'unknown');
 return legacyObservation||result('unknown');
}
