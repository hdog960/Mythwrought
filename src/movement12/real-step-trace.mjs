// Opt-in genuine production stepPlayer trace recorder. Never registered by the game.
import {stepPlayer} from '../physics.mjs';
import {collides} from '../voxel.mjs';
import {auditTimeAlignedMovement} from './time-alignment.mjs';
export const REAL_STEP_TRACE_CONTRACT='movement12-real-step-trace-v1';
const finite = p => p && ['x','feet','z'].every(k => Number.isFinite(p[k]));
export function recordRealStepTrace({world,initial,inputAt,hz=60,duration=2,maxFrames=720}={}){
 if(!world||typeof world.get!=='function'||typeof inputAt!=='function')throw new TypeError('real world and input timeline required');
 if(!Number.isSafeInteger(hz)||hz<15||hz>240||!Number.isFinite(duration)||duration<=0||duration>10)throw new RangeError('invalid cadence or duration');
 const count=Math.round(hz*duration);
 if(count>maxFrames||Math.abs(count/hz-duration)>1e-8)throw new RangeError('unrepresentable or excessive frames');
 if(!finite(initial)||!['vX','vY','vZ'].every(k=>Number.isFinite(initial[k])))throw new TypeError('invalid player state');
 const player={...initial}, samples=[{time:0,position:{x:player.x,feet:player.feet,z:player.z}}],events=[];
 if(collides(world,player.x,player.feet,player.z))throw new RangeError('embedded initial player');
 for(let i=0;i<count;i++){
  const time=i/hz, input=inputAt(time,i,hz);
  if(!input||typeof input!=='object')throw new TypeError('input timeline must return object');
  const event=stepPlayer(world,player,input,1/hz);
  if(!finite(player)||collides(world,player.x,player.feet,player.z))throw new Error('invalid or embedded real stepPlayer result at frame '+i);
  events.push(event);
  samples.push({time:(i+1)/hz,position:{x:player.x,feet:player.feet,z:player.z}});
 }
 return Object.freeze({samples,events,final:{...player},hz,duration,source:'src/physics.mjs:stepPlayer',live:false});
}
export function compareRealStepCadences({world,initial,inputAt,cadences=[30,60,120],duration=2,tolerance=.08,checkpointCount=32}={}){
 if(!Array.isArray(cadences)||cadences.length<2||new Set(cadences).size!==cadences.length)throw new RangeError('distinct cadences required');
 const recordings=cadences.map(hz=>recordRealStepTrace({world,initial,inputAt,hz,duration}));
 const audit=auditTimeAlignedMovement({world,runs:recordings.map(r=>r.samples),collides,checkpointCount,tolerance,maxSamples:4096});
 return Object.freeze({recordings,audit,live:false,productionHooked:false});
}
