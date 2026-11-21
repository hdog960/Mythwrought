import test from 'node:test';
import assert from 'node:assert/strict';
import {sourceVertexBounds,sourceBoundsInFrustum} from '../src/depth-draw-cull.mjs';
const packed=positions=>{
 const data=new Float32Array(positions.length*9);
 for(let i=0;i<positions.length;i++)data.set(positions[i],i*9);
 return data;
};

test('bounds preserve exact source xyz and union opaque/translucent geometry',()=>{
 const a=packed([[1,-64,2],[17,-48,18]]),w=packed([[-2,-61,3]]);
 assert.deepEqual(sourceVertexBounds(a,w),
   {minX:-2,minY:-64,minZ:2,maxX:17,maxY:-48,maxZ:18});
 assert.equal(sourceVertexBounds(new Float32Array()),null);
});
test('conservative culling rejects only source geometry outside terrain projection',()=>{
 const eye=[8,-70,8],forward=[0,0,1],right=[-1,0,0],up=[0,1,0];
 const box=(minX,minY,minZ,maxX,maxY,maxZ)=>
  ({minX,minY,minZ,maxX,maxY,maxZ});
 const visible=b=>sourceBoundsInFrustum(b,eye,forward,right,up,956/440,Math.tan(Math.PI/5));
 assert.equal(visible(box(0,-80,16,16,-64,32)),true,'front chunk');
 assert.equal(visible(box(0,-80,-16,16,-64,0)),false,'entirely behind');
 assert.equal(visible(box(300,-80,16,316,-64,32)),false,'far to the side');
 assert.equal(visible(box(0,-90,0,16,-50,16)),true,'camera inside');
 assert.equal(visible(null),true,'unknown bounds cannot be culled');
});
test('dense random visible source points never disappear under conservative AABB check',()=>{
 let seed=305419896;
 const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let k=0;k<3000;k++){
  const yaw=(random()-.5)*Math.PI*2,pitch=(random()-.5)*1.5;
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const forward=[sy*cp,sp,cy*cp],right=[-cy,0,sy],
    up=[-sp*sy,cp,-sp*cy],eye=[random()*10,-80+random()*20,random()*10],
    aspect=.9+random()*1.8,tan=Math.tan(Math.PI/5);
  const px=(random()-.5)*90,py=-80+(random()-.5)*90,pz=(random()-.5)*90;
  const x1=px-1-random()*15,x2=px+1+random()*15,
    y1=py-1-random()*15,y2=py+1+random()*15,
    z1=pz-1-random()*15,z2=pz+1+random()*15;
  const b={minX:x1,minY:y1,minZ:z1,maxX:x2,maxY:y2,maxZ:z2};
  // If any of 8 exact source corners lies inside the original clip planes,
  // it MUST pass our conservative whole-geometry visibility check.
  let hasVisibleCorner=false;
  for(const x of [x1,x2])for(const y of [y1,y2])for(const z of [z1,z2]){
    const delta=[x-eye[0],y-eye[1],z-eye[2]];
    const dot=v=>v[0]*delta[0]+v[1]*delta[1]+v[2]*delta[2];
    const d=dot(forward);
    if(d>.075&&Math.abs(dot(right))<=d*aspect*tan&&
       Math.abs(dot(up))<=d*tan)hasVisibleCorner=true;
  }
  if(hasVisibleCorner)assert.equal(sourceBoundsInFrustum(
    b,eye,forward,right,up,aspect,tan),true,'visible corner was culled');
 }
});

