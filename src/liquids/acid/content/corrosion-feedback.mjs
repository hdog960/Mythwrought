// Acid B: transient presentation cues, never corrosion or damage execution.
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const token=v=>typeof v==='string'&&/^[a-zA-Z0-9:_-]{1,96}$/.test(v);
const cellPoint=c=>[c?.x,c?.y,c?.z];
const normal=(p,c)=>cellPoint(c).map((v,i)=>v-p[i]);
const key=p=>p.join(',');

// Consume a fresh Acid A step receipt under a stable host read lease.
// isCurrentProposal must authenticate the live owner ledger/policy and edit
// eligibility; cell identity and material revision checks below are additional
// presentation guards, not a substitute for Acid A's eventual executor.
export function sampleAcidCorrosionFeedback({receipt,engine,isLoaded,isOpen,
  readMaterial,isCurrentProposal,isFaceVisible,maxProposals=256,maxCues=12}={}){
  if(typeof engine?.getCell!=='function'||[isLoaded,isOpen,readMaterial,isCurrentProposal,isFaceVisible].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit corrosion presentation host required');
  const proposals=receipt?.proposals;
  if(!int(maxProposals,1,256)||!int(maxCues,0,64)||!Array.isArray(proposals)||proposals.length>maxProposals)
    throw new RangeError('Corrosion presentation budget');
  // Validate the entire bounded batch before doing any host reads.
  for(const p of proposals){
    if(p?.product!=='corrosion-proposal'||!point(p.target)||!token(p.material)||!token(p.revision)||
      !int(p.progress,1,1000000)||!int(p.peakStrength,1,1000)||!Array.isArray(p.expectedAcid)||
      p.expectedAcid.length<1||p.expectedAcid.length>6)throw new TypeError('Invalid owner corrosion proposal');
    const contacts=new Set();
    for(const c of p.expectedAcid){
      const q=cellPoint(c);
      if(c?.id!=='acid'||!point(q)||!int(c.units,1,8)||contacts.has(key(q))||
        normal(p.target,c).reduce((n,d)=>n+Math.abs(d),0)!==1)throw new TypeError('Invalid corrosion contact');
      contacts.add(key(q));
    }
  }
  const cues=[],emitted=new Set();let inspected=0;
  for(const p of proposals){
    if(cues.length===maxCues)break;
    inspected++;
    const t=p.target,k=key(t);
    if(emitted.has(k)||isLoaded(...t)!==true||isOpen(...t)!==false)continue;
    const m=readMaterial(...t);
    if(m?.id!==p.material||m.revision!==p.revision||m.protected!==false||isCurrentProposal(p)!==true)continue;
    if(!p.expectedAcid.every(c=>{const q=cellPoint(c);return isLoaded(...q)===true&&isOpen(...q)===true&&engine.getCell(...q)===c;}))continue;
    // At most one visible face per target. Owner contact order is retained.
    for(const c of p.expectedAcid){
      const n=Object.freeze(normal(t,c));
      // Local voxel coordinates avoid loss of precision far from world origin.
      const center=Object.freeze(n.map((d,i)=>d===0?(i===1?c.units/16:0.5):d>0?1:0));
      if(isFaceVisible(t,n,center)!==true)continue;
      cues.push(Object.freeze({kind:'acid-corrosion-warning',target:Object.freeze([...t]),
        material:p.material,revision:p.revision,normal:n,center,
        intensity:p.peakStrength/1000}));
      emitted.add(k);break;
    }
  }
  return Object.freeze({inspected,uninspected:proposals.length-inspected,cues:Object.freeze(cues)});
}
