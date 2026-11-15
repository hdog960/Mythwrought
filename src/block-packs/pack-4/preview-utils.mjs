// Mythwrought Pack 4 — isolated preview-only transparent triangle ordering.
// This is NOT a replacement for the shared world renderer's alpha/depth pass.
// Matches the fixed two-stage yaw+tilt transform in gallery.mjs.
export function sortPack4PreviewTranslucent(data,stride=10){
  if(!(data instanceof Float32Array)||
     !Number.isInteger(stride)||stride<10||
     data.length%(stride*3)!==0)
    throw TypeError('Invalid Pack 4 translucent triangle stream');
  if(!data.length)return new Float32Array(0);
  const width=stride*3;
  const triangles=[];
  for(let start=0;start<data.length;start+=width){
    let zDepth=0;
    for(let v=0;v<3;v++){
      const base=start+v*stride;
      const x=data[base]-.5,y=data[base+1]-.5,z=data[base+2]-.5;
      if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(z))
        throw RangeError('Non-finite candidate vertex');
      // Farther from the preview camera means greater projected NDC depth.
      zDepth+=(.34*y + .94*(-.61*x + .79*z))/3;
    }
    triangles.push({start,zDepth});
  }
  triangles.sort((a,b)=>b.zDepth-a.zDepth||a.start-b.start);
  const ordered=new Float32Array(data.length);
  for(let i=0;i<triangles.length;i++){
    const start=triangles[i].start;
    ordered.set(data.subarray(start,start+width),i*width);
  }
  return ordered;
}


// Restores shared WebGL2 state even if one candidate render fails.
// A failed transparent draw must never leave depth writes disabled for the
// following item in the isolated single-context review gallery.
export function releasePack4PreviewGpu(gl,{buffer=null,vertexArray=null,program=null}={}){
  if(!gl||typeof gl.depthMask!=='function'||typeof gl.disable!=='function')
    throw new TypeError('Expected Pack 4 WebGL2 preview context');
  gl.depthMask(true);
  gl.disable(gl.BLEND);
  gl.useProgram(null);
  gl.bindVertexArray(null);
  gl.bindBuffer(gl.ARRAY_BUFFER,null);
  if(buffer)gl.deleteBuffer(buffer);
  if(vertexArray)gl.deleteVertexArray(vertexArray);
  if(program)gl.deleteProgram(program);
}
