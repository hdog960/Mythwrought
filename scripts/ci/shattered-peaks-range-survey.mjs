// Bounded SP2 survey, not a generator change or an approved seed shortcut.
// Compare coherent contiguous highland patches across ordinary signed seeds.
import {planShatteredPeakColumn} from '../../src/manual-biomes/shattered-peaks-sp1.mjs';
import {ShatteredPeaksTerraceWorld} from '../../src/manual-biomes/shattered-peaks-terrace.mjs';
const seeds=[179,2026,-42,711,9337,19777];
const results=[];
for(const seed of seeds){
 const candidates=[];
 // Score raw proposals cheaply before expensive original owner admission.
 for(let tile=-4;tile<=-1;tile++)for(let tz=-2;tz<=2;tz++)
  for(let z=tz*512-48;z<=tz*512+48;z+=12)for(let x=tile*512-48;x<=tile*512+48;x+=12){
   const p=planShatteredPeakColumn(x,z,seed);if(p)candidates.push(p);
  }
 candidates.sort((a,b)=>b.topY-a.topY||a.x-b.x||a.z-b.z);
 const sites=[];
 for(const p of candidates){
  if(sites.some(q=>Math.max(Math.abs(p.x-q.x),Math.abs(p.z-q.z))<40))continue;
  sites.push(p);if(sites.length===3)break;
 }
 const world=new ShatteredPeaksTerraceWorld(seed),rows=[];
 for(const site of sites){
  const n=25,heights=new Uint16Array(n*n);let admitted=0,veto=0,max=0,rawMax=0,high=0,witness=null;
  for(let j=0;j<n;j++)for(let i=0;i<n;i++){
   const x=site.x+i-12,z=site.z+j-12,p=world.terraceColumn(x,z);
   if(!p){veto++;continue;}admitted++;rawMax=Math.max(rawMax,p.rawTopY);
   heights[j*n+i]=p.topY;
   if(p.topY>max){max=p.topY;witness={x,z,...p};}
   if(p.topY>=140)high++;
  }
  // Largest four-connected patch at elevation 140, independently count
  // rare summit area rather than treating a single spike as a range.
  const seen=new Uint8Array(n*n);let largest=0;
  for(let i=0;i<heights.length;i++)if(heights[i]>=140&&!seen[i]){
   const q=[i];seen[i]=1;for(let k=0;k<q.length;k++){
    const a=q[k],x=a%n,z=Math.floor(a/n);
    for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]){
     const xx=x+dx,zz=z+dz;if(xx<0||zz<0||xx>=n||zz>=n)continue;
     const b=zz*n+xx;if(heights[b]>=140&&!seen[b]){seen[b]=1;q.push(b);}
    }
   }largest=Math.max(largest,q.length);
  }
  rows.push({site:[site.x,site.z],admitted,veto,rawMax,max,high,largest,witness});
 }
 results.push({seed,rawCandidates:candidates.length,rows});
}
console.log('SP5_RANGE_SURVEY',JSON.stringify(results));
