import test from 'node:test';
import assert from 'node:assert/strict';
import {previewProcessorCommitFence as check} from '../src/resonance/devices48/processor-commit-fence-v1.mjs';
const base = () => {
 const p={worldId:'w',ownerId:'o',deviceId:'d',tick:5,worldRevision:8,inventoryRevision:3,canActuate:false};
 return {...p,plan:{...p,inputs:[{itemId:'i',quantity:1}],outputs:[{typeId:'ore',quantity:1}],energyDemand:2},observation:{...p,protected:false,ownerAuthorized:true,fixtureOptIn:true,deliveredEnergy:2,authenticatedDelivery:true,inventoryCapacityAccepted:true,inputsStillPresent:true}};
};
test('valid snapshot remains advisory',()=>{const r=check(base());assert.equal(r.ok,true);assert.equal(r.canActuate,false);assert.equal(Object.isFrozen(r),true)});
for(const [name,mutate] of [
 ['missing proof',r=>delete r.observation],['world mismatch',r=>r.observation.worldId='x'],['tick mismatch',r=>r.plan.tick=6],['world changed',r=>r.observation.worldRevision=9],['inventory changed',r=>r.plan.inventoryRevision=4],['forged authority',r=>r.plan.canActuate=true],['protected',r=>r.observation.protected=true],['owner denied',r=>r.observation.ownerAuthorized=false],['fixture absent',r=>r.observation.fixtureOptIn=false],['duplicate inputs',r=>r.plan.inputs.push({itemId:'i',quantity:1})],['empty inputs',r=>r.plan.inputs=[]],['invalid quantity',r=>r.plan.inputs[0].quantity=0],['insufficient energy',r=>r.observation.deliveredEnergy=1],['unauthenticated energy',r=>r.observation.authenticatedDelivery=false],['no capacity',r=>r.observation.inventoryCapacityAccepted=false],['missing inventory',r=>r.observation.inputsStillPresent=false],['invalid revision',r=>r.inventoryRevision=1.5]
]) test(name,()=>{const r=base();mutate(r);assert.equal(check(r).ok,false);assert.equal(check(r).canActuate,false)});
