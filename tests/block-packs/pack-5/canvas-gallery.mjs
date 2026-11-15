/** Source-derived software-z-buffer Canvas2D preview. NOT WebGL2 or in-game renderer evidence. */
import {PACK5_SURFACES, surfaceBoxMesh} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';

/** Physically sourced authored triangles; CPU depth buffering avoids the former false hollow-brick preview. */
export function drawPack5CanvasGallery(canvas,{rotation=0}={}){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Invalid preview rotation');
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas2D fallback unavailable');
  const width=canvas.width,height=canvas.height,cellW=width/3,cellH=height/2;
  const boxes=[];
  ctx.fillStyle='#15222c';ctx.fillRect(0,0,width,height);
  for(let i=0;i<6;i++){
    const col=i%3,row=Math.floor(i/3),x=col*cellW,y=row*cellH;
    ctx.fillStyle=i%2?'#23323a':'#1e2b35';ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
    boxes.push({x,y,mesh:surfaceBoxMesh(PACK5_SURFACES[i],{rotation}),asset:PACK5_SURFACES[i]});
  }
  const bitmap=ctx.getImageData(0,0,width,height),rgba=bitmap.data;
  const depthBuffer=new Float32Array(width*height);depthBuffer.fill(-Infinity);
  const project=([x,y,z])=>[(x-z)*.77, (x+z-1)*.37-(y-.5)*.95,x+z+y*.78];
  const faceShade=[.76,.72,1,.47,.91,.66];
  const out=[];
  for(const {x,y,asset:d,mesh:m} of boxes){
    const n=m.vertexCount,vertex=Array.from({length:n},(_,j)=>project(Array.from(m.positions.subarray(j*3,j*3+3))));
    const minX=Math.min(...vertex.map(v=>v[0])),maxX=Math.max(...vertex.map(v=>v[0]));
    const minY=Math.min(...vertex.map(v=>v[1])),maxY=Math.max(...vertex.map(v=>v[1]));
    const s=Math.min((cellW-20)/(maxX-minX),(cellH-42)/(maxY-minY));
    const cx=x+cellW/2-(minX+maxX)*s/2,cy=y+(cellH+18)/2-(minY+maxY)*s/2;
    const projected=vertex.map(v=>[cx+v[0]*s,cy+v[1]*s,v[2]]);
    for(let t=0;t<m.indices.length;t+=3){
      const i0=m.indices[t],i1=m.indices[t+1],i2=m.indices[t+2];
      const a=projected[i0],b=projected[i1],c=projected[i2];
      const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);
      if(Math.abs(den)<1e-10)continue;
      const lowX=Math.max(Math.floor(x),Math.floor(Math.min(a[0],b[0],c[0])));
      const highX=Math.min(Math.ceil(x+cellW)-1,Math.ceil(Math.max(a[0],b[0],c[0])));
      const lowY=Math.max(Math.floor(y),Math.floor(Math.min(a[1],b[1],c[1])));
      const highY=Math.min(Math.ceil(y+cellH)-1,Math.ceil(Math.max(a[1],b[1],c[1])));
      const face=Math.floor(t/6)%6,shade=faceShade[face],color=i0*4;
      const r=Math.round(Math.min(1,m.colors[color]*shade)*255),g=Math.round(Math.min(1,m.colors[color+1]*shade)*255),bl=Math.round(Math.min(1,m.colors[color+2]*shade)*255);
      for(let py=lowY;py<=highY;py++)for(let px=lowX;px<=highX;px++){
        const sx=px+.5,sy=py+.5;
        const u=((b[1]-c[1])*(sx-c[0])+(c[0]-b[0])*(sy-c[1]))/den;
        const v=((c[1]-a[1])*(sx-c[0])+(a[0]-c[0])*(sy-c[1]))/den;
        const w=1-u-v;
        if(u<-.00001||v<-.00001||w<-.00001)continue;
        const depth=a[2]*u+b[2]*v+c[2]*w,index=py*width+px;
        if(depth<=depthBuffer[index])continue;
        depthBuffer[index]=depth;const offset=index*4;
        rgba[offset]=r;rgba[offset+1]=g;rgba[offset+2]=bl;rgba[offset+3]=255;
      }
    }
    out.push({id:d.symbolicId,variant:d.variant,parts:d.parts[0].boxes.length,rotation});
  }
  ctx.putImageData(bitmap,0,0);
  for(const {x,y,asset:d} of boxes){
    ctx.fillStyle='#ede7d6';ctx.font=`600 ${Math.max(10,Math.min(15,Math.floor(cellW/20)))}px system-ui`;
    ctx.textAlign='left';ctx.fillText(`${d.symbolicId} — ${d.variant.replaceAll('-',' ')}`,x+8,y+17,cellW-12);
  }
  return out;
}
