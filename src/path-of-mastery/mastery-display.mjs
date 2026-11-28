// Pure projection from the already validated view, not a second save or award source.
import {deriveMasterySummary} from './mastery-summary.mjs';
export function masteryDisplay(state){
 if(!state?.ok||!Array.isArray(state.skills)||state.skills.length!==24)return null;
 const summary=deriveMasterySummary({kind:state.kind,progress:{revision:state.revision,xp:Object.fromEntries(state.skills.map(s=>[s.id,s.xp]))}});
 const selected=summary?.entries.find(s=>s.id===state.skill?.id);if(!selected)return null;
 return Object.freeze({totalXp:summary.totalXp,totalLevel:summary.totalLevel,earned:summary.milestones,maximum:120,readOnly:summary.readOnly,levels:Object.freeze([10,25,50,75,99].map(level=>Object.freeze({level,earned:selected.milestones.includes(level)})))});
}
