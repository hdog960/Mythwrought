// Native isolated diagnostic, not a gameplay fairness or device release gate.
import {createLiquidEngine,LIQUID_IDS} from '../../../src/liquids/core/engine.mjs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';

const definitions=LIQUID_IDS.map((id,i)=>({id,gravityLimit:0,lateralLimit:i===0?4:1}));
const faces=[[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]];
const key=p=>p.join(',');

// A constantly replenished hub with four equally eligible drains. Drain after
// each visit and refill only the exact amount removed. All rates except water
// are synthetic, not the peer owners' policy. No terrain or infinite source.
export function measureDirectionService({id='water',cycles=64}={}){
  if(!LIQUID_IDS.includes(id)||!Number.isSafeInteger(cycles)||cycles<1||cycles>4096)throw new RangeError('Invalid diagnostic workload');
  const allowed=new Set(['0,0,0',...faces.map(key)]);
  const e=createLiquidEngine({definitions,isLoaded:()=>true,isOpen:(...p)=>allowed.has(key(p)),maxCells:5,maxVisits:1});
  assert.equal(e.insert(0,0,0,id,8,{trace:80}),true);
  const units=[0,0,0,0],first=[null,null,null,null],last=[null,null,null,null],maxGap=[0,0,0,0];
  for(let i=0;i<cycles;i++){
    const r=e.tick(1);assert.equal(r.visited,1);assert.ok(r.changed.length<=5);
    let returned=0,trace=0;
    for(let j=0;j<faces.length;j++){
      const c=e.extract(...faces[j],8);if(!c)continue;
      units[j]+=c.units;returned+=c.units;trace+=c.quantities.trace??0;
      if(first[j]===null)first[j]=i+1;
      if(last[j]!==null)maxGap[j]=Math.max(maxGap[j],i+1-last[j]);
      last[j]=i+1;
    }
    assert.equal(returned,r.moved);
    if(returned)assert.equal(e.insert(0,0,0,id,returned,{trace}),true);
    assert.equal(e.getCell(0,0,0).units,8);assert.equal(e.getCell(0,0,0).quantities.trace,80);
  }
  return {id,cycles,faces:faces.map(key),units,first,maxGap: maxGap.map((n,j)=>last[j]===null?null:Math.max(n,first[j]-1,cycles-last[j])),unserved:units.filter(n=>n===0).length};
}

// Continually wake each visited cell in a disconnected sealed fixture. The
// resulting queue has no neighbor interactions; measure actual origin visits
// via the first host read in a one-visit tick, not guessed pending counts.
export function measureFifoService({count=1024,rounds=3}={}){
  if(!Number.isSafeInteger(count)||count<1||count>8192||!Number.isSafeInteger(rounds)||rounds<1||rounds>8)throw new RangeError('Invalid diagnostic workload');
  let reads=[];
  const open=(x,y,z)=>y===0&&z===0&&x>=0&&x%3===0&&x/3<count;
  const options={definitions,isLoaded:(x,y,z)=>{reads.push([x,y,z]);return true;},isOpen:open,maxCells:count,maxVisits:1};
  let e=createLiquidEngine(options);
  for(let i=0;i<count;i++)assert.equal(e.insert(i*3,0,0,LIQUID_IDS[i%LIQUID_IDS.length],8,{trace:i+1}),true);
  const last=new Array(count).fill(null),visits=new Array(count).fill(0);let maxGap=0;
  for(let i=0;i<count*rounds;i++){
    reads=[];const result=e.tick(1);assert.equal(result.visited,1);assert.equal(result.moved,0);
    const [x,y,z]=reads[0];assert.equal(y,0);assert.equal(z,0);assert.equal(x%3,0);const index=x/3;
    assert.equal(index,i%count);visits[index]++;
    if(last[index]!==null)maxGap=Math.max(maxGap,i-last[index]);last[index]=i;
    e.wake(x,y,z);
    if(i===Math.floor(count*rounds/2))e=createLiquidEngine({...options,snapshot:JSON.parse(JSON.stringify(e.save()))});
  }
  const cells=e.save().cells;
  assert.equal(cells.reduce((n,c)=>n+c.units,0),count*8);
  assert.equal(cells.reduce((n,c)=>n+(c.quantities.trace??0),0),count*(count+1)/2);
  return {count,rounds,totalVisits:visits.reduce((a,b)=>a+b,0),minimumVisits:Math.min(...visits),maximumVisits:Math.max(...visits),maxVisitGap:maxGap,restoredMidRun:true};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  console.log(JSON.stringify({node:process.version,platform:process.platform,arch:process.arch,policy:'synthetic descriptors; fixed lateral order',direction:LIQUID_IDS.map(id=>measureDirectionService({id})),fifo:measureFifoService()},null,2));
}
