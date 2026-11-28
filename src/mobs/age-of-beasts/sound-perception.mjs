// Reuse the original controller's sense(), with bounded owner-supplied
// disturbance observations. A heard position is not a combat target.
import {sense} from '../behavior.mjs';
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
export function hearExpansionDisturbance(query,actor,readDisturbances,revision){
 if(actor?.species?.id!=='echo-stalker'||typeof readDisturbances!=='function')return null;
 try{
  const snapshot=readDisturbances();
  if(snapshot?.revision!==revision||!Array.isArray(snapshot.events)||snapshot.events.length>8||query.revision()!==revision)return null;
  const events=snapshot.events.filter(e=>point(e?.position)&&Number.isFinite(e.loudness)&&e.loudness>0&&e.loudness<=1&&query.residentAt(e.position)===true)
    .map(e=>Object.freeze({position:Object.freeze([...e.position]),loudness:e.loudness}));
  const heard=sense(query,actor,{disturbances:events}).heard;
  return point(heard)&&query.residentAt(heard)===true&&query.revision()===revision?Object.freeze([...heard]):null;
 }catch{return null;}
}
