import test from 'node:test';
import assert from 'node:assert/strict';
import {proposeSnowS12Conifer as tree,createSnowS12ClimateBoundTreeFactory as factory}
 from '../src/manual-biomes/snowy-s12-natural-conifer-prototypes.mjs';
const styles=['compact-fir','layered-spruce','highland-pine','windswept-alpine'];
const heights=[5,7,9,6];
const key=(x,y,z)=>[x,y,z].join(',');
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
test('four distinct original-ID silhouettes preserve exact S3 envelope and root connection',()=>{
 for(const [i,style] of styles.entries()){
  for(const wind of [-1,1])for(let n=0;n<20;n++){
   const x=-77+n*19,z=512+n*7,floor=7;
   const t=tree(style,x,floor,z,{wind});
   assert.ok(t,style+' omitted valid lower-floor shape');
   assert.equal(t.height,heights[i]);
   assert.ok(t.cells.length>=16&&t.cells.length<=119);
   assert.deepEqual(t,tree(style,x,floor,z,{wind}));
   const cells=new Map(t.cells.map(c=>[key(...c.slice(0,3)),c]));
   assert.equal(cells.size,t.cells.length);
   for(let y=floor+1;y<=floor+t.height;y++)
    assert.equal(cells.get(key(x,y,z))?.[3],4);
   assert.equal(cells.get(key(x,floor+t.height+1,z))?.[3],407);
   const queue=[[x,floor+1,z]],seen=new Set([key(...queue[0])]);
   for(let j=0;j<queue.length;j++){
    const [a,b,c]=queue[j];
    for(const [dx,dy,dz] of dirs){
     const p=[a+dx,b+dy,c+dz],k=key(...p);
     if(cells.has(k)&&!seen.has(k)){seen.add(k);queue.push(p);}
    }
   }
   assert.equal(seen.size,cells.size,'floating original foliage voxel');
   let snowy=0,dark=0;
   for(const [a,b,c,id] of t.cells){
    assert.ok([4,406,407].includes(id)&&Math.abs(a-x)<=3&&Math.abs(c-z)<=3&&b<=19);
    if(id!==4)assert.ok(b>=floor+3,'low branch reduces original walking clearance');
    if(id===407){snowy++;assert.equal(cells.has(key(a,b+1,c)),false);}
    if(id===406)dark++;
   }
   assert.ok(snowy>0&&dark>0,'both sheltered and snow-laden foliage needed');
  }
 }
});
test('absolute-coordinate variety is not an alternating horizontal snow strip',()=>{
 const shapes=new Set();
 for(let n=0;n<24;n++){
  const x=n*11,z=-28+n*13;
  const t=tree('layered-spruce',x,6,z);
  shapes.add(JSON.stringify(t.cells.map(([a,b,c,id])=>[a-x,b-6,c-z,id])));
 }
 assert.ok(shapes.size>=12);
});
test('entire physical canopy climate footprint must remain genuine snow',()=>{
 const original=factory(179,()=>({name:'snow',weight:.9}));
 const t=original('layered-spruce',-16,7,32,{wind:1});
 assert.ok(t);
 const edge=t.cells.find(c=>c[0]!==-16||c[2]!==32);
 const x=edge[0],z=edge[2];
 for(const climate of [null,{name:'desert',weight:1},{name:'mountain',weight:1},{name:'snow',weight:.4}]){
  const reject=factory(179,(a,b)=>a===x&&b===z?climate:{name:'snow',weight:1});
  assert.equal(reject('layered-spruce',-16,7,32,{wind:1}),null);
 }
 assert.equal(tree('highland-pine',0,10,0),null);
});
