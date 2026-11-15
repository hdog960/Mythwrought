/**
 * Pack 5 source-authored indexed triangles -> production Mythwrought nine-float
 * terrain shader vertices: x,y,z,r,g,b,u,v,material. No cube substitution.
 * Material 0 deliberately preserves authored colors without applying the
 * special grass/stone/timber procedural shader to furniture.
 */
import {uploadChunkBuffer,MAX_CHUNK_UPLOAD_BYTES} from '../gpu-recovery.mjs';
export const PACK5_DRAW_INSTANCE_BUDGET=16;
export const PACK5_DRAW_DISTANCE=48;
const finite=v=>Number.isFinite(v);
const clamp=n=>Math.max(0,Math.min(1,n));

export function pack5TerrainVertices(mesh){
  if(!mesh||!mesh.positions||!mesh.colors||!mesh.indices||
      mesh.positions.length%3!==0||mesh.colors.length!==mesh.positions.length/3*4||
      mesh.indices.length%3!==0||mesh.indices.length>100000)
    throw Error('Invalid Pack 5 shaped mesh buffer');
  const vertices=mesh.positions.length/3;
  if(!Number.isInteger(vertices)||vertices<3)throw Error('Empty Pack 5 mesh');
  const output=new Float32Array(mesh.indices.length*9);
  for(let i=0;i<mesh.indices.length;i++){
    const n=mesh.indices[i];
    if(!Number.isSafeInteger(n)||n<0||n>=vertices)throw Error('Pack 5 triangle index outside mesh');
    const p=n*3,c=n*4,o=i*9;
    const x=mesh.positions[p],y=mesh.positions[p+1],z=mesh.positions[p+2];
    const r=mesh.colors[c],g=mesh.colors[c+1],b=mesh.colors[c+2],a=mesh.colors[c+3];
    if(![x,y,z,r,g,b,a].every(finite)||a<0||a>1)throw Error('Non-finite Pack 5 vertex');
    output[o]=x;output[o+1]=y;output[o+2]=z;
    output[o+3]=clamp(r);output[o+4]=clamp(g);output[o+5]=clamp(b);
    // Material 0 has no texture/material family: neutral authored pigments.
    output[o+6]=x-Math.floor(x);output[o+7]=z-Math.floor(z);
    output[o+8]=0;
  }
  if(output.byteLength>MAX_CHUNK_UPLOAD_BYTES)throw Error('Pack 5 mesh staging budget exceeded');
  return output;
}

/** A single extra GL buffer/draw call, limited to nearby shaped placements. */
export function createPack5GpuStream(gl,layer,{maxInstances=PACK5_DRAW_INSTANCE_BUDGET,
  maxDistance=PACK5_DRAW_DISTANCE,maxBytes=2*1024*1024}={}){
  if(!gl||typeof gl.createBuffer!=='function'||!layer||typeof layer.list!=='function'||
      !Number.isInteger(maxInstances)||maxInstances<1||maxInstances>64||
      !Number.isFinite(maxDistance)||maxDistance<=0||maxDistance>128||
      !Number.isSafeInteger(maxBytes)||maxBytes<1024||maxBytes>MAX_CHUNK_UPLOAD_BYTES)
    throw Error('Invalid Pack 5 GPU streaming budget');
  let buffer=null,count=0,signature='',displayed=0,lastError='';
  const api={
    stats(){return {vertices:count,instances:displayed,bytes:count*36,hasBuffer:!!buffer,
      lastError};},
    refresh(eye){
      if(!Array.isArray(eye)||eye.length!==3||!eye.every(finite))
        throw Error('Invalid Pack 5 view position');
      const max2=maxDistance*maxDistance;
      const selection=layer.list().map(record=>{
        const d=(record.anchor[0]+.5-eye[0])**2+(record.anchor[2]+.5-eye[2])**2;
        return {record,d};
      }).filter(o=>o.d<=max2&&Math.abs(o.record.anchor[1]-eye[1])<=32)
        .sort((a,b)=>a.d-b.d||a.record.anchor.join(',').localeCompare(b.record.anchor.join(',')))
        .slice(0,maxInstances).map(o=>o.record);
      const nextSignature=selection.map(r=>r.anchor.join(',')+'/'+r.symbolicId+'/'+r.rotation+'/'+r.variant).join('|');
      if(nextSignature===signature)return false;
      let remaining=Math.floor(maxBytes/4),parts=[],kept=0;
      for(const row of selection){
        const data=pack5TerrainVertices(layer.meshAt(row.anchor));
        if(data.length>remaining)break;
        remaining-=data.length;parts.push(data);kept++;
      }
      const total=parts.reduce((n,p)=>n+p.length,0);
      const vertices=new Float32Array(total);let at=0;
      for(const p of parts){vertices.set(p,at);at+=p.length;}
      // Staging before publication guarantees GPU upload failure does not
      // destroy the previous healthy buffer. The view can retry next refresh.
      let next=null;
      try{
        if(total)next=uploadChunkBuffer(gl,vertices);
      }catch(error){lastError=String(error);return false;}
      if(buffer)gl.deleteBuffer(buffer);
      buffer=next;count=total/9;displayed=kept;signature=nextSignature;lastError='';
      return true;
    },
    draw({atPos,atColor,atUv,atMat}){
      if(!buffer||!count)return 0;
      for(const loc of [atPos,atColor,atUv,atMat])
        if(!Number.isInteger(loc)||loc<0)throw Error('Missing Pack 5 terrain attribute');
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
      gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
      gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
      gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
      gl.drawArrays(gl.TRIANGLES,0,count);
      return count;
    },
    invalidate(){
      // GL context can be lost; don't call deleteBuffer on a lost context.
      buffer=null;count=0;displayed=0;signature='';lastError='';
    },
    dispose(){
      if(buffer)gl.deleteBuffer(buffer);
      api.invalidate();
    }
  };
  return Object.freeze(api);
}
