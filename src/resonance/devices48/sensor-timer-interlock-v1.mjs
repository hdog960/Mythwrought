/** Source-only D2 sensor + timer interlock; no game actuation. */
export const CONTRACT='resonance48.sensor-timer-interlock.v1';
const id=x=>typeof x==='string' && /^[a-z0-9][a-z0-9_-]{0,47}$/.test(x);
const nat=x=>Number.isSafeInteger(x)&&x>=0;
function fail(){throw new TypeError('invalid sensor-timer interlock frame');}
export function stepSensorTimerInterlock(previous,frame){
 if(!frame||typeof frame!=='object'||Array.isArray(frame))fail();
 const {worldId,interlockId,targetId,tick,sensor,timer}=frame;
 if(!id(worldId)||!id(interlockId)||!id(targetId)||interlockId===targetId||!nat(tick)||
 !sensor||!timer||sensor.contract!=='resonance48.proximity-sensor.v1'||
 timer.contract!=='resonance48.timed-control.v1'||sensor.worldId!==worldId||
 timer.worldId!==worldId||sensor.tick!==tick||timer.tick!==tick||
 timer.targetId!==targetId||!id(sensor.sensorId)||!id(timer.controlId)||
 sensor.sensorId===timer.controlId||sensor.sensorId===targetId||timer.controlId===targetId||
 typeof sensor.detected!=='boolean'||typeof sensor.output!=='boolean'||
 typeof timer.requested!=='boolean'||typeof timer.active!=='boolean'||
 ![0,1].includes(sensor.observedGrant)||![0,1].includes(timer.observedGrant)||
 sensor.output!==(sensor.detected&&sensor.observedGrant===1)||
 timer.active!==(timer.requested&&timer.observedGrant===1)||
 sensor.activationAuthorized!==false||sensor.authoritativeDelivery!==false||
 sensor.productionBound!==false||timer.activationAuthorized!==false||
 timer.authoritativeDelivery!==false||timer.productionBound!==false)fail();
 if(previous!=null&&(previous.contract!==CONTRACT||previous.worldId!==worldId||
 previous.interlockId!==interlockId||previous.targetId!==targetId||
 previous.sensorId!==sensor.sensorId||previous.controlId!==timer.controlId||
 !nat(previous.tick)||tick!==previous.tick+1||typeof previous.requested!=='boolean'||
 previous.activationAuthorized!==false||previous.authoritativeDelivery!==false||
 previous.productionBound!==false))fail();
 const requested=sensor.output&&timer.active;
 return Object.freeze({contract:CONTRACT,worldId,interlockId,targetId,
 sensorId:sensor.sensorId,controlId:timer.controlId,tick,requested,
 reason:requested?'candidate-ready':!sensor.output?'sensor-inactive':'timer-inactive',
 activationAuthorized:false,authoritativeDelivery:false,productionBound:false});
}
