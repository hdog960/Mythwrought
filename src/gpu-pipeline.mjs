// MYTHWROUGHT v0.10 Gate A: WebGL2 shader and dynamic-buffer reconstruction.
// Graphics handles are process-local ephemeral data. They are never saved in a
// seed, journal, mirror, device vault or other player-controlled storage.
function compiledShader(gl,type,source){
  const shader=gl.createShader(type);
  if(!shader)throw Error('WebGL shader allocation failed');
  gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
    const reason=gl.getShaderInfoLog(shader)||'unknown shader error';
    gl.deleteShader(shader);
    throw Error('Shader compile failed: '+reason);
  }
  return shader;
}
function linkedProgram(gl,vs,fs){
  const vertex=compiledShader(gl,gl.VERTEX_SHADER,vs),fragment=compiledShader(gl,gl.FRAGMENT_SHADER,fs);
  let program=null;
  try{
    program=gl.createProgram();
    if(!program)throw Error('WebGL program allocation failed');
    gl.attachShader(program,vertex);
    gl.attachShader(program,fragment);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))
      throw Error('WebGL program link failed: '+(gl.getProgramInfoLog(program)||'unknown error'));
    return program;
  }catch(error){
    if(program)gl.deleteProgram(program);
    throw error;
  }finally{
    gl.deleteShader(vertex);gl.deleteShader(fragment);
  }
}
export function buildGpuPipeline(gl,{terrainVertex,terrainFragment,skyVertex,skyFragment}){
  if(!gl||[terrainVertex,terrainFragment,skyVertex,skyFragment].some(v=>typeof v!=='string'||!v.length))
    throw Error('Invalid WebGL pipeline sources');
  const resources={terrainProgram:null,skyProgram:null,outlineBuffer:null};
  try{
    resources.terrainProgram=linkedProgram(gl,terrainVertex,terrainFragment);
    resources.skyProgram=linkedProgram(gl,skyVertex,skyFragment);
    gl.useProgram(resources.terrainProgram);
    resources.atPos=gl.getAttribLocation(resources.terrainProgram,'aPos');
    resources.atColor=gl.getAttribLocation(resources.terrainProgram,'aColor');
    resources.atUv=gl.getAttribLocation(resources.terrainProgram,'aUv');
    resources.atMat=gl.getAttribLocation(resources.terrainProgram,'aMat');
    for(const index of [resources.atPos,resources.atColor,resources.atUv,resources.atMat]){
      if(index<0)throw Error('Missing required voxel vertex attribute');
      gl.enableVertexAttribArray(index);
    }
    resources.uniforms={};
    for(const key of ['uEye','uForward','uRight','uUp','uAspect','uTan','uFog','uArtQuality'])
      resources.uniforms[key]=gl.getUniformLocation(resources.terrainProgram,key);
    resources.skyUniforms={
      resolution:gl.getUniformLocation(resources.skyProgram,'uResolution'),
      yaw:gl.getUniformLocation(resources.skyProgram,'uYaw'),
      pitch:gl.getUniformLocation(resources.skyProgram,'uPitch')
    };
    resources.outlineBuffer=gl.createBuffer();
    if(!resources.outlineBuffer)throw Error('WebGL outline buffer allocation failed');
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
    return resources;
  }catch(error){
    if(resources.outlineBuffer)gl.deleteBuffer(resources.outlineBuffer);
    if(resources.terrainProgram)gl.deleteProgram(resources.terrainProgram);
    if(resources.skyProgram)gl.deleteProgram(resources.skyProgram);
    throw error;
  }
}
