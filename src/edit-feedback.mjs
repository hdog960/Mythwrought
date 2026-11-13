// Bounded in-world edit history and blocked-build affordance.
// Transient only: never touches world data, saves, controls or draw-call count.
import {createEditEcho,sampleEditEcho} from './edit-echo.mjs';
import {outlineVertices} from './voxel.mjs';

export const MAX_EDIT_TRAILS=3;
export const BLOCKED_FEEDBACK_MS=360;
const EMPTY=new Float32Array();
const validCell=cell=>Array.isArray(cell)&&cell.length===3&&cell.every(Number.isInteger);
const BLOCKED_REASONS=new Set(['Placement space occupied','Cannot place inside the player','Outside editable height','No free space for placement']);

export function recordWorldEditFeedback(previous,result,now,inspection=null){
  const events=Array.isArray(previous)?previous.filter(e=>e&&e.start<=now&&now-e.start<480):[];
  if(!Number.isFinite(now))return events.slice(-MAX_EDIT_TRAILS);
  const echo=createEditEcho(result,now);
  if(echo)return [...events,{...echo,kind:'success'}].slice(-MAX_EDIT_TRAILS);
  if(result?.ok===false&&BLOCKED_REASONS.has(result.reason)&&
    validCell(inspection?.adjacent)&&inspection.adjacent[1]>=0){
    return [...events,{kind:'blocked',cell:[...inspection.adjacent],start:now}].slice(-MAX_EDIT_TRAILS);
  }
  return events.slice(-MAX_EDIT_TRAILS);
}

export function sampleWorldEditFeedback(events,now){
  if(!Array.isArray(events)||!Number.isFinite(now))return {key:'',vertices:EMPTY};
  const pieces=[],keys=[];
  for(const event of events.slice(-MAX_EDIT_TRAILS)){
    if(!event||!validCell(event.cell)||!Number.isFinite(event.start))continue;
    if(event.kind==='success'){
      const sample=sampleEditEcho(event,now);
      if(sample.key){keys.push('s:'+sample.key);pieces.push(sample.vertices);}
    }else if(event.kind==='blocked'){
      const elapsed=now-event.start;
      if(elapsed<0||elapsed>=BLOCKED_FEEDBACK_MS)continue;
      const beat=Math.floor(elapsed/(BLOCKED_FEEDBACK_MS/3));
      const intensity=[1,.68,.34][beat];
      keys.push('b:'+event.cell.join(',')+':'+beat);
      pieces.push(outlineVertices(event.cell,[.98*intensity,.22*intensity,.28*intensity]));
    }
  }
  if(!pieces.length)return {key:'',vertices:EMPTY};
  const total=pieces.reduce((sum,p)=>sum+p.length,0);
  const vertices=new Float32Array(total);
  let offset=0;
  for(const part of pieces){vertices.set(part,offset);offset+=part.length;}
  return {key:keys.join('|'),vertices};
}
