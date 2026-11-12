import test from 'node:test';
import assert from 'node:assert/strict';
import {buildGpuPipeline} from '../src/gpu-pipeline.mjs';
function mockGl({brokenShader=false,brokenLink=false,brokenBuffer=false}={}){
 let shaderNum=0,programNum=0,bufferNum=0,deletedShaders=0,deletedPrograms=0;
 const gl={
  VERTEX_SHADER:35633,FRAGMENT_SHADER:35632,COMPILE_STATUS:35713,
  LINK_STATUS:35714,DEPTH_TEST:2929,LEQUAL:515,CULL_FACE:2884,
  createShader:type=>({type,id:++shaderNum}),
  shaderSource:()=>{},compileShader:()=>{},
  getShaderParameter:()=>!brokenShader,
  getShaderInfoLog:()=>brokenShader?'Injected compile failure':'',
  deleteShader:()=>{deletedShaders++;},
  createProgram:()=>({id:++programNum}),
  attachShader:()=>{},linkProgram:()=>{},
  getProgramParameter:()=>!brokenLink,
  getProgramInfoLog:()=>brokenLink?'Injected link failure':'',
  deleteProgram:()=>{deletedPrograms++;},
  useProgram:()=>{},getAttribLocation:(_,name)=>({aPos:0,aColor:1,aUv:2,aMat:3})[name],
  enableVertexAttribArray:()=>{},getUniformLocation:(_,name)=>({name}),
  createBuffer:()=>brokenBuffer?null:{id:++bufferNum},
  deleteBuffer:()=>{},enable:()=>{},depthFunc:()=>{},disable:()=>{}
 };
 return {gl,counts:()=>({shaderNum,programNum,bufferNum,deletedShaders,deletedPrograms})};
}
const shaderSources={terrainVertex:'void main(){}',terrainFragment:'void main(){}',
 skyVertex:'void main(){}',skyFragment:'void main(){}'};
test('graphics pipeline can be reconstructed after context restore with entirely new handles',()=>{
 const {gl,counts}=mockGl();
 const first=buildGpuPipeline(gl,shaderSources),second=buildGpuPipeline(gl,shaderSources);
 assert.notEqual(first.terrainProgram,second.terrainProgram);
 assert.notEqual(first.skyProgram,second.skyProgram);
 assert.notEqual(first.outlineBuffer,second.outlineBuffer);
 assert.equal(first.atPos,0);
 assert.equal(first.atColor,1);
 assert.equal(first.atUv,2);
 assert.equal(first.atMat,3);
 assert.ok(first.uniforms.uArtQuality);
 assert.ok(first.skyUniforms.pitch);
 assert.equal(counts().programNum,4);
 assert.equal(counts().bufferNum,2);
 assert.equal(counts().deletedShaders,8,'Recreated pipeline leaked shader handles');
});
test('reinitialization fails closed if shader compile or link fails',()=>{
 const a=mockGl({brokenShader:true});
 assert.throws(()=>buildGpuPipeline(a.gl,shaderSources),/Shader compile failed/);
 const b=mockGl({brokenLink:true});
 assert.throws(()=>buildGpuPipeline(b.gl,shaderSources),/program link failed/);
 assert.equal(b.counts().deletedPrograms,1);
 const c=mockGl({brokenBuffer:true});
 assert.throws(()=>buildGpuPipeline(c.gl,shaderSources),/outline buffer allocation failed/);
 assert.equal(c.counts().deletedPrograms,2,'Partial pipelines left allocated');
 assert.throws(()=>buildGpuPipeline(null,shaderSources),/Invalid/);
});
