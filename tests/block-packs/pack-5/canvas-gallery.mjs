/** Source-derived Canvas2D fallback preview; NOT WebGL2 or in-game renderer evidence. */
import {PACK5_SURFACES, PACK5_SURFACE_MATERIALS} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
import {rotateLocalBox} from '../../../src/block-packs/pack-5/fixture.mjs';

export function drawPack5CanvasGallery(canvas,{rotation=0}={}){
  if(!Number.isInteger(rotation)||rotation<0||rotation>3)throw Error('Invalid preview rotation');
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas2D unavailable');
  const width=canvas.width,height=canvas.height;
  const cellW=width/3,cellH=height/2;
  const cube=(box)=>{
    const [x0,y0,z0,x1,y1,z1]=rotateLocalBox(box,rotation);
    const faces=[
      {tag:'top',light:1.02,pts:[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]]},
      {tag:'right',light:.76,pts:[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]]},
      {tag:'front',light:.91,pts:[[x0,y0,z1],[x0,y1,z1],[x1,y1,z1],[x1,y0,z1]]}
    ];
    return faces;
  };
  const project=([x,y,z],cx,cy,s)=>[cx+(x-z)*s*.77,cy+((x+z)-1)*s*.37-(y-.5)*s*.95];
  const all=[];
  ctx.fillStyle='#15222c';ctx.fillRect(0,0,width,height);
  for(let i=0;i<6;i++){
    const d=PACK5_SURFACES[i],col=i%3,row=Math.floor(i/3),x=col*cellW,y=row*cellH;
    ctx.fillStyle=i%2?'#23323a':'#1e2b35';ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
    // Fit the actual rotated occupied volumes inside their own portrait panel, leaving title room.
    const rawVertices=d.art.flatMap(part=>{
      const [x0,y0,z0,x1,y1,z1]=rotateLocalBox(part.box,rotation);
      return [[x0,y0,z0],[x0,y0,z1],[x0,y1,z0],[x0,y1,z1],
        [x1,y0,z0],[x1,y0,z1],[x1,y1,z0],[x1,y1,z1]];
    });
    const projected=rawVertices.map(p=>project(p,0,0,1));
    const minX=Math.min(...projected.map(p=>p[0])),maxX=Math.max(...projected.map(p=>p[0]));
    const minY=Math.min(...projected.map(p=>p[1])),maxY=Math.max(...projected.map(p=>p[1]));
    const s=Math.min((cellW-20)/(maxX-minX),(cellH-42)/(maxY-minY));
    const cx=x+cellW/2-(minX+maxX)/2*s;
    const cy=y+(cellH+18)/2-(minY+maxY)/2*s;
    const faces=[];
    for(const part of d.art)for(const face of cube(part.box)){
      const raw=PACK5_SURFACE_MATERIALS[part.material];
      if(!raw)throw Error('Missing material color');
      const center=face.pts.reduce((a,p)=>a.map((v,k)=>v+p[k]/4),[0,0,0]);
      faces.push({pts:face.pts,shade:face.light,rgba:raw,layer:part.box[1],depth:center[0]+center[1]+center[2]});
    }
    faces.sort((a,b)=>a.layer-b.layer||a.depth-b.depth);
    for(const face of faces){
      ctx.beginPath();face.pts.forEach((p,k)=>{const [sx,sy]=project(p,cx,cy,s);if(k===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);});
      ctx.closePath();
      const c=face.rgba;ctx.fillStyle=`rgb(${c.slice(0,3).map(v=>Math.round(Math.min(1,v*face.shade)*255)).join(',')})`;
      ctx.fill();ctx.lineWidth=Math.max(.5,width/1100);ctx.strokeStyle='rgba(20,29,34,.25)';ctx.stroke();
    }
    ctx.fillStyle='#ede7d6';ctx.font=`600 ${Math.max(10,Math.min(15,Math.floor(cellW/20)))}px system-ui`;
    ctx.textAlign='left';ctx.fillText(`${d.symbolicId} — ${d.variant.replaceAll('-',' ')}`,x+8,y+17,cellW-12);
    all.push({id:d.symbolicId,variant:d.variant,parts:d.parts[0].boxes.length,rotation});
  }
  return all;
}
