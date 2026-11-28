// Read-only proposals for existing Movement, agriculture and machinery owners.
// No movement, crop growth, power, transport, gate edits or world activation.
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite)&&
  Number.isSafeInteger(Math.floor(p[0]))&&int(Math.floor(p[1]),-210,256)&&Number.isSafeInteger(Math.floor(p[2]));
const cellPoint=p=>point(p)&&p.every(Number.isSafeInteger);
const checked=(p,check)=>{if(!check(p))throw new RangeError('Invalid physical position');return Object.freeze([...p]);};
const same=(a,b)=>a.every((n,i)=>n===b[i]);
const result=(status,fields={})=>Object.freeze({status,...fields});

export function createWaterHostQueries({engine,isLoaded,isOpen,maxIrrigationSamples=32}={}){
  if(typeof engine?.getCell!=='function'||typeof engine?.samplePoint!=='function'||
     typeof isLoaded!=='function'||typeof isOpen!=='function')throw new TypeError('Explicit shared engine and readiness required');
  if(!int(maxIrrigationSamples,1,256))throw new RangeError('Invalid irrigation budget');
  function read(p){
    if(isLoaded(...p)!==true)return result('unavailable',{position:p});
    const open=isOpen(...p);
    if(open!==true)return result(open===false?'blocked':'unavailable',{position:p});
    const cell=engine.getCell(...p);
    return result(!cell?'empty':cell.id==='water'?'water':'other-liquid',{position:p,cell});
  }
  function sampleSwimming(points){
    if(!Array.isArray(points)||!int(points.length,1,8))throw new RangeError('Swimming probe budget');
    const positions=Array.from(points,p=>checked(p,point));
    return Object.freeze(positions.map(p=>{
      const b=Object.freeze(p.map(Math.floor));
      if(isLoaded(...b)!==true)return result('unavailable',{position:p});
      const open=isOpen(...b);
      if(open!==true)return result(open===false?'blocked':'unavailable',{position:p});
      const s=engine.samplePoint(...p);
      if(!s)return result('dry',{position:p});
      if(s.cell.id!=='water')return result('other-liquid',{position:p,id:s.cell.id});
      return result('water',{position:p,fill:s.fill,surfaceY:s.surfaceY});
    }));
  }
  function inspectIrrigation({positions,minUnits=1}={}){
    if(!Array.isArray(positions)||positions.length>maxIrrigationSamples||!int(minUnits,1,8))
      throw new RangeError('Invalid irrigation probe budget or threshold');
    const unique=new Map();
    for(const p of positions){const c=checked(p,cellPoint);unique.set(c.join(','),c);}
    const samples=Object.freeze([...unique.values()].map(read));
    const qualifying=Object.freeze(samples.filter(s=>s.status==='water'&&s.cell.units>=minUnits).map(s=>s.position));
    return result(qualifying.length?'water-present':(!samples.length||samples.some(s=>s.status==='unavailable'))?'unknown':'no-water',{samples,qualifying});
  }
  function inspectPump({intake,outlet,maxUnits=1}={}){
    const a=checked(intake,cellPoint),b=checked(outlet,cellPoint);
    if(same(a,b)||!int(maxUnits,1,8))throw new RangeError('Invalid pump endpoints or limit');
    const source=read(a),destination=read(b);
    const upperBound=source.status==='water'&&['water','empty'].includes(destination.status)
      ?Math.min(maxUnits,source.cell.units,8-(destination.cell?.units??0)):0;
    // Volume-only upper bound, NOT a transaction or quantity-capacity guarantee.
    return result(source.status==='unavailable'||destination.status==='unavailable'?'unavailable':upperBound?'candidate':'blocked',
      {source,destination,upperBound});
  }
  function inspectGate({position,axis,gateOpen}={}){
    const p=checked(position,cellPoint);
    if(!['x','y','z'].includes(axis)||typeof gateOpen!=='boolean')throw new TypeError('Explicit gate axis and state required');
    const i=['x','y','z'].indexOf(axis),a=[...p],b=[...p];a[i]--;b[i]++;
    // Physical world edges are not valid opposite ports.
    if(!cellPoint(a)||!cellPoint(b)||isLoaded(...p)!==true)return result('unavailable');
    // A mismatch indicates stale host gate state; never infer a terrain edit.
    const open=isOpen(...p);
    if(open!==gateOpen)return result('unknown');
    const negative=read(Object.freeze(a)),positive=read(Object.freeze(b));
    const known=[negative,positive].every(s=>s.status==='water'||s.status==='empty');
    const fillDifference=known?((negative.cell?.units??0)-(positive.cell?.units??0))/8:null;
    return result([negative,positive].some(s=>s.status==='unavailable')?'unavailable':gateOpen?'open':'closed',
      {negative,positive,fillDifference});
  }
  return Object.freeze({sampleSwimming,inspectIrrigation,inspectPump,inspectGate});
}
