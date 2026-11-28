// Native isolated sidecar staging diagnostic. No gameplay or CI activation.
// Run: node tests/liquids/water-core/persistence-memory.mjs
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createLiquidEngine,LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import {createLiquidPersistence} from '../../../src/liquids/core/persistence.mjs';
import {createWaterSources} from '../../../src/liquids/water/physics/sources.mjs';
import {physicalRegionAt} from '../../../src/world-height.mjs';

const N=8192,DEFAULT_CHARS=8*1024*1024,DIAGNOSTIC_CHARS=64*1024*1024;
const definitions=LIQUID_IDS.map(id=>({id,gravityLimit:1,lateralLimit:1}));
const sources=Array.from({length:128},(_,i)=>({id:`source-${i}`,x:80+i,y:0,z:0,
  mode:'finite',rate:3,target:8,initialUnits:4096}));
const options={worldId:'memory-fixture',policyId:'synthetic-v1',definitions,waterSourceOptions:{sources}};
const codec=wide=>createLiquidPersistence({...options,...(wide?{maxChars:DIAGNOSTIC_CHARS}:{})});
const point=c=>[c.x,c.y,c.z];
const sha=text=>createHash('sha256').update(text,'utf8').digest('hex');
const makeQuantities=(i,dense)=>dense?Object.fromEntries(Array.from({length:8},(_,k)=>
  [`q${k}${'x'.repeat(30)}`,2**40-(i%8)])):{trace:i%97+1};
const cell=(x,y,z,id,units,i,dense)=>({x,y,z,id,units,quantities:makeQuantities(i,dense)});
const grid=(i,x,y,id,units,dense)=>cell(x+i%16,y+Math.floor(i/256),Math.floor(i/16)%16,id,units,i,dense);
function snapshot(cells){
  return {version:1,cells,pending:cells.filter((_,i)=>i%2===0).map(point),
    capacityBlocked:cells.filter((_,i)=>i%2===1).map(point),
    lateralPhases:cells.map((c,i)=>[...point(c),i%3+1])};
}
function fixture(dense){
  const resident=snapshot(Array.from({length:N},(_,i)=>grid(i,0,-210,LIQUID_IDS[i%5],i%8+1,dense)));
  const owners=new Map();
  for(let i=0;i<N;i++){
    const c=grid(i,16,20,LIQUID_IDS[i%5],i%8+1,dense),owner=physicalRegionAt(...point(c));
    if(!owners.has(owner.key))owners.set(owner.key,{owner,cells:[]});
    owners.get(owner.key).cells.push(c);
  }
  const parked=[...owners.values()].map(({owner,cells})=>({owner,snapshot:snapshot(cells)}));
  const frozen=Array.from({length:N},(_,i)=>grid(i,32,225,'water',8,dense));
  const products=Array.from({length:N/2},(_,i)=>({id:`receipt-${i}`,product:'fixture-product',productInputs:[
    cell(48,0,0,'water',2,i,dense),cell(49,0,0,'lava',1,i,dense)]}));
  const engine=createLiquidEngine({definitions,isLoaded:()=>false,isOpen:()=>false});
  const waterSources=createWaterSources({engine,sources}).save();
  return {version:1,worldId:options.worldId,policyId:options.policyId,revision:1,
    resident,parked,frozen,waterSources,products};
}
function counts(s){
  const live=[s.resident,...s.parked.map(p=>p.snapshot)];
  const cells=[...live.flatMap(p=>p.cells),...s.frozen,...s.products.flatMap(p=>p.productInputs)];
  const quantities={};
  for(const c of cells)for(const [k,v] of Object.entries(c.quantities))quantities[k]=(quantities[k]??0n)+BigInt(v);
  return {resident:s.resident.cells.length,parked:s.parked.reduce((n,p)=>n+p.snapshot.cells.length,0),
    owners:s.parked.length,frozen:s.frozen.length,receipts:s.products.length,records:cells.length,
    units:cells.reduce((n,c)=>n+c.units,0),pending:live.reduce((n,p)=>n+p.pending.length,0),
    dormant:live.reduce((n,p)=>n+p.capacityBlocked.length,0),phases:live.reduce((n,p)=>n+p.lateralPhases.length,0),
    finiteStock:s.waterSources.remaining.reduce((a,b)=>a+b,0),
    quantities:Object.fromEntries(Object.entries(quantities).map(([k,v])=>[k,String(v)]))};
}
function memory(){const m=process.memoryUsage();return {rss:m.rss,heapUsed:m.heapUsed,heapTotal:m.heapTotal,external:m.external,
  peakRssKiB:process.resourceUsage().maxRSS};}
function child(stage,path,wide,expected){
  assert.equal(typeof global.gc,'function','Child requires explicit GC');
  const textInput=['decode','baseline-text','reject-decode'].includes(stage);
  const input=textInput?readFileSync(path,'utf8'):JSON.parse(readFileSync(path,'utf8'));
  const p=codec(wide);global.gc();
  const before=memory(),start=performance.now();let output=null,error=null;
  try{
    switch(stage){
      case 'validate':output=p.validate(input);break;
      case 'encode':case 'reject-encode':output=p.encode(input);break;
      case 'decode':case 'reject-decode':output=p.decode(input);break;
      case 'baseline-object':case 'baseline-text':break;
      default:throw Error('Unknown diagnostic stage');
    }
  }catch(e){error=e;}
  const elapsedMs=performance.now()-start,after=memory();global.gc();const retained=memory();
  // Assertions run after measurement. Keep both input and output alive through
  // GC to model host staging before atomic adoption; no hidden save writes.
  if(stage.startsWith('reject-')){
    assert.ok(error instanceof RangeError);assert.equal(error.message,'Liquid sidecar size budget');assert.equal(output,null);
  }else{assert.equal(error,null);if(!stage.startsWith('baseline-'))assert.equal(sha(typeof output==='string'?output:JSON.stringify(output)),expected);}
  assert.equal(sha(typeof input==='string'?input:JSON.stringify(input)),expected);
  return {stage,wide,elapsedMs,before,after,retained,rejected:error!==null,
    highWaterIncreaseKiB:after.peakRssKiB-before.peakRssKiB};
}
function run(){
  const dir=mkdtempSync(join(tmpdir(),'mythwrought-liquid-memory-'));
  const profiles=[];
  try{
    for(const dense of [false,true]){
      const state=fixture(dense),expected=counts(state),text=JSON.stringify(state),digest=sha(text);
      assert.equal(expected.records,32768);assert.equal(expected.resident,N);assert.equal(expected.parked,N);
      assert.equal(expected.frozen,N);assert.equal(expected.receipts,N/2);assert.equal(expected.pending,N);
      assert.equal(expected.dormant,N);assert.equal(expected.phases,2*N);assert.equal(expected.finiteStock,128*4096);
      assert.equal(expected.units,151552); // 2*8192*4.5 + 8192*8 + 4096*3
      assert.equal(text.length>DEFAULT_CHARS,dense);
      assert.equal(codec(dense).encode(state),text,'Canonical encoding changed exact input');
      const path=join(dir,dense?'dense.json':'mixed.json');writeFileSync(path,text);
      const results=[];
      const stages=['baseline-object','baseline-text','validate','encode','decode',...(dense?['reject-encode','reject-decode']:[])];
      for(const stage of stages)for(let repeat=0;repeat<3;repeat++){
        const wide=dense&&!stage.startsWith('reject-');
        const r=spawnSync(process.execPath,['--expose-gc',fileURLToPath(import.meta.url),'--child',stage,path,String(wide),digest],
          {encoding:'utf8',timeout:60000,maxBuffer:1024*1024});
        if(r.error||r.status!==0)throw Error(`${stage} failed: ${r.error??r.stderr}`);
        results.push({repeat,...JSON.parse(r.stdout)});
      }
      profiles.push({name:dense?'dense-max-quantities':'mixed-default-cap',counts:expected,chars:text.length,
        sha256:digest,acceptedCharLimit:dense?DIAGNOSTIC_CHARS:DEFAULT_CHARS,results});
    }
    return {version:1,node:process.version,v8:process.versions.v8,platform:process.platform,arch:process.arch,
      notes:'Fresh child per measurement. RSS high-water includes process startup and input loading; high-water increase is not exact operation-only peak. Heap is sampled before/after, not a peak. No device or release gate.',profiles};
  }finally{rmSync(dir,{recursive:true,force:true});}
}
if(process.argv[2]==='--child'){
  const [, , ,stage,path,wide,expected]=process.argv;
  console.log(JSON.stringify(child(stage,path,wide==='true',expected)));
}else{
  assert.equal(process.argv.length,2,'Unexpected diagnostic arguments');
  console.log(JSON.stringify(run(),null,2));
}
