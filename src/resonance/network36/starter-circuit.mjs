// R0 isolated runnable starter circuit. This owns fixture state, never world state.
// No fuelled source, player motion, live actor or production delivery authority.
import {describeGenerator,evaluateGenerator} from '../generation24/index.mjs';
import {toNetwork36Candidate} from '../generation24/network36-integer.mjs';
import {deriveSpatialWirelessAdmission} from './wireless-spatial-admission.mjs';
import {allocateScopedResonance} from './network-allocation.mjs';
import {createDevice,demandSnapshot,stepDevices} from '../devices48/consumer-v1.mjs';
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const point=a=>Array.isArray(a)&&a.length===3&&a.every(n=>Number.isSafeInteger(n)&&Math.abs(n)<=1000000)&&a[1]>=-210&&a[1]<=256;
const pos=(id,a)=>{if(!point(a))throw Error('invalid physical fixture anchor');return {id,x:a[0],y:a[1],z:a[2],loaded:true}};
const validStore=s=>s&&typeof s.id==='string'&&s.id.length>0&&s.id.length<=64&&point(s.anchor)&&['capacity','charge','inputRate','outputRate'].every(k=>nat(s[k]))&&s.charge<=s.capacity;
export function createStarterCircuit({seed,generators,lamps,stores=[]}={}){
 if(!nat(seed)||!Array.isArray(generators)||!Array.isArray(lamps)||!Array.isArray(stores)||generators.length>128||lamps.length>16||stores.length>16)throw Error('invalid fixture roster');
 const sources=generators.map(g=>{if(!['hand','crystal'].includes(g?.model)||!point(g.anchor))throw Error('only starter sources supported');return describeGenerator({...g,seed})});
 const devices=lamps.map(l=>{if(!point(l?.anchor))throw Error('invalid lamp anchor');return createDevice({...l,seed,type:'lamp'})});
 let batteries=stores.map(s=>{if(!validStore(s))throw Error('invalid storage');return {...s,anchor:[...s.anchor]}});
 const endpoints=[...sources.map(s=>pos(s.instanceKey,s.anchor)),...devices.map(d=>pos(d.id,d.anchor)),...batteries.map(s=>pos(s.id,s.anchor))];
 const checkPositions=items=>{const ids=new Set(),cells=new Set();for(const p of items){const k=[p.x,p.y,p.z].join(',');if(!point([p.x,p.y,p.z])||p.loaded!==true||ids.has(p.id)||cells.has(k))throw Error('duplicate, unloaded or out-of-height placement');ids.add(p.id);cells.add(k)}};
 checkPositions(endpoints);
 const roster=new Set(sources.map(s=>s.id));if(roster.size!==sources.length)throw Error('duplicate generator identity');
 let nextTick=0, previous=new Map();
 return Object.freeze({step({tick,channels=[],transmitters=[],observations={}}={}){
   if(tick!==nextTick||!nat(tick+1)||!Array.isArray(channels)||!Array.isArray(transmitters)||!observations||typeof observations!=='object'||Array.isArray(observations))throw Error('invalid or stale tick');
   if(Object.keys(observations).some(id=>!roster.has(id)))throw Error('unknown observation');
   checkPositions([...endpoints,...channels,...transmitters]);
   const topology=deriveSpatialWirelessAdmission({channels,transmitters,endpoints});
   const attached=new Map(topology.endpoints.map(e=>[e.id,e]));
   const network=id=>attached.get(id)?.network;
   const current=new Map(),generation=[];let disconnectedAvailable=0;
   for(const s of sources){
     const e=evaluateGenerator(s,Object.hasOwn(observations,s.id)?observations[s.id]:{});
     const candidate=toNetwork36Candidate(e,tick,previous.get(s.instanceKey)??null);
     current.set(s.instanceKey,candidate.checkpoint);
     const n=network(s.instanceKey);if(n)generation.push({id:s.instanceKey,network:n,available:candidate.output});else disconnectedAvailable+=candidate.output;
   }
   const requests=demandSnapshot(devices);
   const allocation=allocateScopedResonance({networks:topology.networks.map(n=>n.id),generation,
     devices:requests.filter(d=>network(d.id)&&d.requested>0).map(d=>({id:d.id,network:network(d.id),demand:d.requested,priority:d.priority})),
     stores:batteries.filter(s=>network(s.id)).map(s=>({id:s.id,network:network(s.id),capacity:s.capacity,charge:s.charge,inputRate:s.inputRate,outputRate:s.outputRate}))});
   const enabled=new Set(allocation.networks.flatMap(n=>n.enabled)),charges=new Map(allocation.networks.flatMap(n=>n.stores.map(s=>[s.id,s.charge])));
   const grants=requests.map(d=>({id:d.id,granted:enabled.has(d.id)?d.requested:0}));
   const states=stepDevices(devices,grants,{tick,seed});
   const consumed=states.reduce((n,s)=>n+(s.mode==='running'?s.granted:0),0);
   if(consumed!==allocation.totals.spent)throw Error('fixture consumption mismatch');
   const updated=batteries.map(s=>({...s,charge:charges.get(s.id)??s.charge}));
   const oldCharge=batteries.reduce((n,s)=>n+s.charge,0),newCharge=updated.reduce((n,s)=>n+s.charge,0);
   if(![oldCharge,newCharge].every(nat)||newCharge!==oldCharge+allocation.totals.charged-allocation.totals.drawn)throw Error('fixture storage imbalance');
   const result=Object.freeze({tick,productionBound:false,authoritativeWorldDelivery:false,topology,allocation,states,consumed,disconnectedAvailable,stores:updated.map(s=>Object.freeze({id:s.id,charge:s.charge}))});
   // Commit only after all validations and conservation checks succeed.
   batteries=updated;previous=current;nextTick=tick+1;return result;
 }});
}
