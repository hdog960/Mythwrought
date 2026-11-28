// Conservative, bounded line-of-sight for a nearby physical surface cell.
export function surfaceWitness({eye,target,resident,read,maxSteps=64}){
 if(![...eye,...target].every(Number.isFinite)||!Number.isInteger(maxSteps)||maxSteps<1||maxSteps>64)return false;
 const delta=target.map((v,i)=>v-eye[i]);
 if(Math.hypot(...delta)>24)return false;
 const cell=eye.map(Math.floor),end=target.map(Math.floor),step=delta.map(Math.sign);
 const next=delta.map((d,i)=>d===0?Infinity:((cell[i]+(d>0?1:0))-eye[i])/d);
 const stride=delta.map(d=>d===0?Infinity:Math.abs(1/d));
 for(let n=0;n<maxSteps;n++){
  if(!resident(...cell)||read(...cell)!==0)return false;
  if(cell.every((v,i)=>v===end[i]))return true;
  const t=Math.min(...next);if(t>1||!Number.isFinite(t))return false;
  for(let i=0;i<3;i++)if(Math.abs(next[i]-t)<1e-10){cell[i]+=step[i];next[i]+=stride[i];}
 }
 return false;
}
export function nearestVisibleMarker({point,pins,landmarks,frame,radius=12}){
 if(![point?.x,point?.y,radius].every(Number.isFinite)||radius<=0)return null;
 const inside=p=>p.screenX>=frame.x&&p.screenX<=frame.x+frame.width&&p.screenY>=frame.y&&p.screenY<=frame.y+frame.height;
 let best=null;
 for(const [kind,items] of [['waypoint',pins],['landmark',landmarks]])for(const p of items){
  if(!inside(p))continue;const d=Math.hypot(p.screenX-point.x,p.screenY-point.y);
  if(d<=radius&&(!best||d<best.distance))best={kind,id:p.id,distance:d};
 }
 return best;
}
