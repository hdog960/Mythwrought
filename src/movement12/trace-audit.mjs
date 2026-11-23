// Source-only evidence audit: never certifies geometry without world collision provenance.
const finitePoint=p=>p&&typeof p==='object'&&['x','y','z'].every(k=>Number.isFinite(p[k]));
const eventKeys=['stepped','landed','jumped','hitWall','ceiling'];
const validEvent=e=>e===null||(e&&typeof e==='object'&&!Array.isArray(e)&&eventKeys.every(k=>e[k]===undefined||typeof e[k]==='boolean'));
export function auditStepTrace(trace,{maxHorizontalSpeed=4.25,maxVerticalSpeed=30,tolerance=.025}={}){
  if(!trace||!Array.isArray(trace.frames)||trace.frames.length<2||trace.frames.length>1025||
    !Number.isFinite(maxHorizontalSpeed)||maxHorizontalSpeed<=0||
    !Number.isFinite(maxVerticalSpeed)||maxVerticalSpeed<=0||
    !Number.isFinite(tolerance)||tolerance<0||tolerance>.1)throw Error('Invalid trace audit contract');
  const violations=[];
  let prior=null;
  for(let i=0;i<trace.frames.length;i++){
    const f=trace.frames[i];
    if(!f||!Number.isFinite(f.time)||!finitePoint(f.start)||!finitePoint(f.end)||!validEvent(f.event??null)||
      (i>0&&trace.source==='injected-stepPlayer'&&(f.event===undefined||f.event===null)))throw Error('Malformed trace frame '+i);
    if(i===0){if(f.event!==undefined&&f.event!==null)violations.push({frame:i,kind:'anchor-event'});if(f.time!==0||Math.hypot(f.end.x-f.start.x,f.end.y-f.start.y,f.end.z-f.start.z)>1e-9)violations.push({frame:i,kind:'anchor'});}
    else {
      const dt=f.time-prior.time;
      if(dt<=0||dt>.05+1e-9)violations.push({frame:i,kind:'time'});
      if(Math.hypot(f.start.x-prior.end.x,f.start.y-prior.end.y,f.start.z-prior.end.z)>1e-7)violations.push({frame:i,kind:'continuity'});
      if(dt>0){
        const horizontal=Math.hypot(f.end.x-f.start.x,f.end.z-f.start.z);
        const vertical=Math.abs(f.end.y-f.start.y);
        if(horizontal>maxHorizontalSpeed*dt+tolerance)violations.push({frame:i,kind:'horizontal-speed'});
        if(vertical>maxVerticalSpeed*dt+tolerance)violations.push({frame:i,kind:'vertical-speed'});
      }
    }
    prior=f;
  }
  return {valid:violations.length===0,violations,geometryCertified:false,liveIntegrated:false};
}
