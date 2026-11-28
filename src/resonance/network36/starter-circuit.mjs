// R0 isolated runnable starter circuit. This owns fixture state, never world state.
// No fuelled source, player motion, live actor or production delivery authority.
// Machine position and energy receipts are committed together inside the isolated circuit.
import {describeGenerator,evaluateGenerator} from '../generation24/index.mjs';
import {toNetwork36Candidate} from '../generation24/network36-integer.mjs';
import {deriveSpatialWirelessAdmission} from './wireless-spatial-admission.mjs';
import {allocateScopedResonance} from './network-allocation.mjs';
import {createDevice} from '../devices48/consumer-v1.mjs';
import {createControl,createControlFrame,stepControlFrame} from '../devices48/controls-v1.mjs';
import {gatedDemand,applyGatedAllocation} from '../devices48/gated-consumer-v1.mjs';
import {ENVIRONMENT_BRIDGE} from '../generation24/environment-bridge.mjs';
import {exportGeneratorOutput} from '../generation24/output-handoff.mjs';
import {physicalCellY} from '../../world-height.mjs';
import {mapNetwork36Candidate} from '../devices48/network36-candidate-v1.mjs';
import {createReceiptLedger,appendReceiptFrame} from '../devices48/receipt-ledger-v1.mjs';
import {auditGrantContinuity} from '../devices48/grant-continuity-admission-v1.mjs';
import {createMotion,commandMotion} from '../devices48/motion-v1.mjs';
const NETWORK_ORIGIN='4a83ff51c838a02858dd9fceae980dd3268a573e';
const RECEIPT='resonance-network36-delivery-circuit-v1';
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const point=a=>Array.isArray(a)&&a.length===3&&a.every(n=>Number.isSafeInteger(n)&&Math.abs(n)<=1000000)&&physicalCellY(a[1]);
const pos=(id,a)=>{if(!point(a))throw Error('invalid physical fixture anchor');return {id,x:a[0],y:a[1],z:a[2],loaded:true}};
const validStore=s=>s&&typeof s.id==='string'&&s.id.length>0&&s.id.length<=64&&point(s.anchor)&&['capacity','charge','inputRate','outputRate'].every(k=>nat(s[k]))&&s.charge<=s.capacity;
export function createStarterCircuit({seed,generators,lamps,stores=[],machines=[],controls=[],controlLinks=[]}={}){
 if(!nat(seed)||!Array.isArray(generators)||!Array.isArray(lamps)||!Array.isArray(stores)||!Array.isArray(machines)||!Array.isArray(controls)||controls.length>128||!Array.isArray(controlLinks)||controlLinks.length>128||generators.length>128||lamps.length+machines.length>16||stores.length>16)throw Error('invalid fixture roster');
 const sources=generators.map(g=>{if(!['hand','crystal','waterwheel','windmill'].includes(g?.model)||!point(g.anchor))throw Error('unsupported or fuelled source');return describeGenerator({...g,seed})});
 const devices=lamps.map(l=>{if(!point(l?.anchor)||!/^[a-z0-9_-]{1,48}$/.test(l.id))throw Error('invalid lamp anchor or id');return createDevice({...l,seed,type:'lamp'})});
 let motions=new Map();
 for(const m of machines){
   if(!point(m?.anchor)||!/^[a-z0-9_-]{1,48}$/.test(m.id)||!['gate','lift','bridge','platform'].includes(m.kind)||motions.has(m.id))throw Error('invalid machine');
   devices.push(createDevice({...m,seed,type:m.kind==='gate'||m.kind==='bridge'?'gate':'platform'}));
   motions.set(m.id,createMotion({...m,seed}));
 }
 let batteries=stores.map(s=>{if(!validStore(s))throw Error('invalid storage');return {...s,anchor:[...s.anchor]}});
 const endpoints=[...sources.map(s=>pos(s.instanceKey,s.anchor)),...devices.map(d=>pos(d.id,d.anchor)),...batteries.map(s=>pos(s.id,s.anchor))];
 const checkPositions=items=>{const ids=new Set(),cells=new Set();for(const p of items){const k=[p.x,p.y,p.z].join(',');if(!point([p.x,p.y,p.z])||p.loaded!==true||ids.has(p.id)||cells.has(k))throw Error('duplicate, unloaded or out-of-height placement');ids.add(p.id);cells.add(k)}};
 checkPositions(endpoints);
 const roster=new Set(sources.map(s=>s.id));if(roster.size!==sources.length)throw Error('duplicate generator identity');
 const controlDescriptors=controls.map(c=>createControl({...c,seed}));
 const links=controlLinks.map(l=>Object.freeze({...l}));
 let controlFrame=controlDescriptors.length?createControlFrame(controlDescriptors,{seed,tick:0}):null;
 if(links.length&&!controlFrame)throw Error('missing controls');
 if(controlFrame)gatedDemand(devices,controlFrame,links);
 let nextTick=0, previous=new Map(),ledger=createReceiptLedger({seed,networkSha:NETWORK_ORIGIN});
 return Object.freeze({step({tick,channels=[],transmitters=[],observations={},commands={},controlEvents=[]}={}){
   if(tick!==nextTick||!nat(tick+1)||!Array.isArray(channels)||!Array.isArray(transmitters)||!observations||typeof observations!=='object'||Array.isArray(observations))throw Error('invalid or stale tick');
   if(Object.keys(observations).some(id=>!roster.has(id)))throw Error('unknown observation');
   if(!commands||typeof commands!=='object'||Array.isArray(commands)||Object.keys(commands).some(id=>!motions.has(id)))throw Error('unknown machine command');
   for(const cmd of Object.values(commands))if(!cmd||![0,1].includes(cmd.desired)||typeof cmd.clearance!=='boolean')throw Error('invalid machine command');
   if(!Array.isArray(controlEvents)||controlEvents.length>128||(!controlFrame&&controlEvents.length))throw Error('invalid control events');
   // Control time is one-based: network tick zero is the first control update.
   const nextControl=controlFrame?stepControlFrame(controlDescriptors,controlFrame,{tick:tick+1,events:controlEvents}):null;
   const gated=gatedDemand(devices,nextControl??{seed,states:[]},links);
   checkPositions([...endpoints,...channels,...transmitters]);
   const topology=deriveSpatialWirelessAdmission({channels,transmitters,endpoints});
   const attached=new Map(topology.endpoints.map(e=>[e.id,e]));
   const network=id=>attached.get(id)?.network;
   const current=new Map(),generation=[];let disconnectedAvailable=0;
   for(const s of sources){
     const observed=Object.hasOwn(observations,s.id)?observations[s.id]:null;
     const mechanical=s.model==='waterwheel'||s.model==='windmill';
     let e;
     if(observed!==null&&typeof observed==='object'&&Object.hasOwn(observed,'authority')){
       if(observed.authority!==ENVIRONMENT_BRIDGE||observed.verified!==true||observed.observedTick!==tick||observed.instanceKey!==s.instanceKey||!observed.values||typeof observed.values!=='object'||Array.isArray(observed.values))throw Error('invalid source observation');
       const v=observed.values;
       if(mechanical){
         const amount=s.model==='waterwheel'?v.flow:v.wind;
         const present=s.model==='waterwheel'?v.waterPresent:v.exposed;
         if(typeof present!=='boolean'||!Number.isFinite(amount)||amount<0||amount>1)throw Error('invalid normalized mechanical observation');
       }
       const out=exportGeneratorOutput(s,{verified:true,observedTick:tick,values:v},tick);
       e={contract:out.sourceContract,instanceKey:out.instanceKey,availablePerTick:out.availablePerTick,capacityPerTick:out.capacityPerTick};
     }else{
       // Only legacy hand/crystal fixture inputs accept bare values. Missing
       // mechanical evidence produces zero, never invented wind or flow.
       if(mechanical&&observed!==null)throw Error('mechanical observation requires tick and source identity');
       if(observed!==null&&(typeof observed!=='object'||Array.isArray(observed)))throw Error('invalid observation values');
       e=evaluateGenerator(s,observed??{});
     }
     const candidate=toNetwork36Candidate(e,tick,previous.get(s.instanceKey)??null);
     current.set(s.instanceKey,candidate.checkpoint);
     const n=network(s.instanceKey);if(n)generation.push({id:s.instanceKey,network:n,available:candidate.output});else disconnectedAvailable+=candidate.output;
   }
   const requests=gated.demand;
   const allocation=allocateScopedResonance({networks:topology.networks.map(n=>n.id),generation,
     devices:requests.filter(d=>network(d.id)&&d.requested>0).map(d=>({id:d.id,network:network(d.id),demand:d.requested,priority:d.priority})),
     stores:batteries.filter(s=>network(s.id)).map(s=>({id:s.id,network:network(s.id),capacity:s.capacity,charge:s.charge,inputRate:s.inputRate,outputRate:s.outputRate}))});
   const enabled=new Set(allocation.networks.flatMap(n=>n.enabled)),charges=new Map(allocation.networks.flatMap(n=>n.stores.map(s=>[s.id,s.charge])));
   // Receipt generated directly from the actual scoped allocation, not caller claims.
   const batch={contract:'resonance-devices48-batch-v1',seed,tick,entries:requests.map(d=>({deviceId:d.id,demand:d.requested})),demand:requests.reduce((n,d)=>n+d.requested,0)};
   const solution={contract:'resonance-network36-proposal-v1',tick,deviceStates:Object.fromEntries(requests.map(d=>[d.id,enabled.has(d.id)?'active':network(d.id)?'shortage':'disconnected']))};
   const candidate=mapNetwork36Candidate(batch,solution,{expectedTick:tick,expectedSeed:seed,sourceSha:NETWORK_ORIGIN});
   const receipt={contract:RECEIPT,seed,tick,sourceSha:NETWORK_ORIGIN,grants:candidate.candidateGrants.map(g=>({id:g.id,delivered:g.granted}))};
   const nextLedger=appendReceiptFrame(ledger,candidate,receipt,{trustedReceiptContract:RECEIPT});
   const delivered=nextLedger.frames.at(-1);
   if(delivered.total!==allocation.totals.spent)throw Error('receipt conservation mismatch');
   const grants=delivered.grants.map(g=>({id:g.id,granted:g.delivered}));
   const states=applyGatedAllocation(gated,grants,{tick,seed});
   const nextMotions=new Map();
   for(const [id,m] of motions){
     const state=states.find(s=>s.id===id);
     const continuous=state.requested>0&&auditGrantContinuity(nextLedger.frames,{deviceId:id,requiredUnits:state.requested}).transitions.at(-1).enabled;
     const cmd=Object.hasOwn(commands,id)?commands[id]:null;
     // Startup/blocked motors reserve energy but never move on an isolated grant.
     const motion=commandMotion(m,{seed,tick:tick+1,desired:cmd?.desired??m.desired,allocation:{id,mode:continuous&&state.mode==='running'?'running':'stopped'},clearance:cmd?.clearance===true});
     nextMotions.set(id,motion);
   }
   const consumed=states.reduce((n,s)=>n+(s.mode==='running'?s.granted:0),0);
   if(consumed!==allocation.totals.spent)throw Error('fixture consumption mismatch');
   const updated=batteries.map(s=>({...s,charge:charges.get(s.id)??s.charge}));
   const oldCharge=batteries.reduce((n,s)=>n+s.charge,0),newCharge=updated.reduce((n,s)=>n+s.charge,0);
   if(![oldCharge,newCharge].every(nat)||newCharge!==oldCharge+allocation.totals.charged-allocation.totals.drawn)throw Error('fixture storage imbalance');
   const result=Object.freeze({tick,productionBound:false,authoritativeWorldDelivery:false,topology,allocation,states,consumed,disconnectedAvailable,receipt:delivered,controls:nextControl?.states??Object.freeze([]),motions:Object.freeze([...nextMotions.values()]),stores:updated.map(s=>Object.freeze({id:s.id,charge:s.charge}))});
   // Commit only after all validations and conservation checks succeed.
   batteries=updated;previous=current;ledger=nextLedger;motions=nextMotions;controlFrame=nextControl;nextTick=tick+1;return result;
 }});
}
