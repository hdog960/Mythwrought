// Source-only, conservative collision geometry evidence gate.
// The caller supplies authoritative world-space AABBs; no world hooks or mutation.
export function auditShapeMotionEvidence({start,end,halfWidth,height,shapes,maxShapes=4096}={}) {
 const bad=reason=>({ok:false,reason,contacts:[]});
 const finite=p=>p&&['x','y','z'].every(k=>Number.isFinite(p[k]));
 if(!finite(start)||!finite(end)||!Number.isFinite(halfWidth)||halfWidth<=0||!Number.isFinite(height)||height<=0)return bad('invalid-player');
 if(!Array.isArray(shapes)||!Number.isSafeInteger(maxShapes)||maxShapes<1||shapes.length>maxShapes)return bad('shape-budget');
 const contacts=[];
 for(let i=0;i<shapes.length;i++){
  const b=shapes[i];
  if(!b||!finite(b.min)||!finite(b.max)||!['x','y','z'].every(k=>b.min[k]<b.max[k]))return bad('invalid-shape');
  const pad={x:halfWidth,y:0,z:halfWidth},upper={x:halfWidth,y:height,z:halfWidth};
  let enter=0,exit=1,normal=null;
  let initial=true;
  for(const axis of ['x','y','z']){
   const lo=b.min[axis]-upper[axis],hi=b.max[axis]+pad[axis],v=end[axis]-start[axis],s=start[axis];
   if(s<=lo||s>=hi)initial=false;
   if(v===0){if(s<lo||s>hi){exit=-1;break;}continue;}
   const t1=(lo-s)/v,t2=(hi-s)/v,near=Math.min(t1,t2),far=Math.max(t1,t2);
   if(near>enter){enter=near;normal={axis,sign:v>0?-1:1};}
   exit=Math.min(exit,far);
  }
  if(initial){contacts.push({index:i,time:0,initialOverlap:true});continue;}
  if(exit>=enter&&exit>=0&&enter<=1&&normal){
   // Tangential or separating boundary contacts must not block motion.
   const axis=normal.axis,v=end[axis]-start[axis];
   const boundary=v>0?b.min[axis]-upper[axis]:b.max[axis]+pad[axis];
   if(enter===0&&Math.abs(start[axis]-boundary)<1e-10&&v*normal.sign>=0)continue;
   contacts.push({index:i,time:enter,normal,initialOverlap:false});
  }
 }
 contacts.sort((a,b)=>a.time-b.time||a.index-b.index);
 return {ok:true,reason:'audited',contacts};
}
