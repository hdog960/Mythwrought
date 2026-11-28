// PM8 fixture receipt admission, no world writes or XP. Owner must prove natural provenance.
const id=x=>typeof x==='string'&&/^[a-zA-Z0-9_-]{1,16}$/.test(x);
const cell=x=>Array.isArray(x)&&x.length===3&&Array.from(x).every(Number.isSafeInteger)&&x[1]>=-210&&x[1]<=256&&Math.abs(x[0])<=2147483647&&Math.abs(x[2])<=2147483647;
const same=(a,b)=>a.every((n,i)=>n===b[i]);
export function createFixtureGatheringVerifier({scope,profile,generation,readWitness,readContext}={}){
  if(typeof scope!=='string'||!/^fixture:[a-zA-Z0-9:_./-]{1,80}$/.test(scope)||!id(profile)||!id(generation)||typeof readWitness!=='function'||typeof readContext!=='function')throw Error('Invalid gathering host');
  return evidence=>{
    try{
      const c=readContext(),w=readWitness(evidence);
      if(c?.scope!==scope||c.mode!=='survival'||c.writable!==true||w?.scope!==scope||w.profile!==profile||w.generation!==generation||w.mode!=='survival'||w.operation!=='mine'||w.origin!=='natural-unedited'||w.committed!==true||w.saveVerified!==true||w.recoveryRequired!==false||!id(w.transaction)||!cell(w.target)||!cell(w.anchor)||!Array.isArray(w.removed)||w.removed.length<1||w.removed.length>512||!Array.from(w.removed).every(cell)||new Set(w.removed.map(a=>a.join(','))).size!==w.removed.length||!w.removed.some(a=>same(a,w.target))||!w.removed.some(a=>same(a,w.anchor)))return null;
      if(w.family==='mineral'&&(!same(w.anchor,w.target)||w.removed.length!==1))return null;
      if(w.family!=='mineral'&&w.family!=='tree')return null;
      // Do NOT use transaction ID or skill to distinguish repeated extraction of the same resource.
      const semantic=[profile,generation,...w.anchor].join(':');
      return Object.freeze({skill:w.family==='mineral'?'pm:mining':'pm:woodcutting',semantic,transaction:w.transaction});
    }catch{return null;}
  };
}
