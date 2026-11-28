// Upright analytic displacement envelope of original live-render vertex shader.
// This is a conservative interval bound, not downed-body or combat certification.
// The original shader has independent sin terms; take their full intervals.
import {inspectBeastMesh} from './mesh-contract.mjs';
export function uprightMotionEnvelope(data){
 const info=inspectBeastMesh(data);let radius=0,minY=Infinity,maxY=-Infinity;
 for(let i=0;i<data.length;i+=7){
  const [x,y,z,,, ,j]=data.subarray(i,i+7);
  let dx=0,dy=0,dz=0,up=0,down=0;
  if(j>6.5)up=.14+.22*Math.max(0,z);
  else if(j>5.5){dy=Math.abs(y)*.19;dx=Math.abs(x)*.19*.55;}
  else if(j>4.5)up=.22;
  else if(Math.abs(j)>3.5)dy=Math.abs(x)*.5;
  else if(Math.abs(j)>2.5){up=.016;down=.056;}
  else if(Math.abs(j)>1.5)dx=.10;
  else dz=Math.abs(j)*.12*Math.max(0,.9-y);
  radius=Math.max(radius,Math.hypot(Math.abs(x)+dx,Math.abs(z)+dz));
  minY=Math.min(minY,y-dy-down-.015);
  maxY=Math.max(maxY,y+dy+up+.031);
 }
 const body=Object.freeze({radius:Math.ceil((radius+.025)*100)/100,height:Math.ceil((maxY+.025)*100)/100,collision:'aabb'});
 return Object.freeze({body,minY,maxY,radius,static:info});
}
