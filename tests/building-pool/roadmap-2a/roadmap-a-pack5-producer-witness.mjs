/** Exact real Pack5 authored AABB/colors via original surfaceBoxMesh; never commits or chooses a variant for any commerce blueprint. */
import {getPack5Surface,surfaceBoxMesh,PACK5_SURFACE_MATERIALS} from '../../../src/block-packs/pack-5/architectural-surfaces.mjs';
import {PACK5_BUILDER_CATALOG} from '../../../src/pack5-integration/catalog.mjs';
const symbols=['pack5:079','pack5:080','pack5:081'];
const options=symbols.flatMap(symbol=>{
 const row=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId===symbol);
 if(!row||row.variants.length!==2)throw Error('Real Pack5 physical variant roster drift '+symbol);
 return row.variants.map(variant=>({symbol,variant,key:symbol+'/'+variant,attachment:row.attachment}));
});
const select=document.getElementById('asset'),view=document.getElementById('view'),info=document.getElementById('evidence');
for(const a of options){const el=document.createElement('option');el.value=a.key;el.textContent=a.symbol+' · '+a.variant;select.append(el);}
const query=new URLSearchParams(location.search);
select.value=options.some(a=>a.key===query.get('id'))?query.get('id'):options[0].key;
view.value=query.get('view')==='side'?'side':'front';
const canvas=document.getElementById('scene'),gl=canvas.getContext('webgl2',{alpha:false,preserveDrawingBuffer:true,antialias:true});
if(!gl)throw Error('Actual WebGL2 required for real producer mesh witness');
const VS=[
 '#version 300 es','precision highp float;',
 'layout(location=0) in vec3 aPosition;',
 'layout(location=1) in vec4 aColor;',
 'layout(location=2) in vec3 aNormal;',
 'uniform float uAngle;uniform float uAspect;out vec3 vColor;',
 'void main(){',
 'vec3 p=aPosition-vec3(.5,.5,.5);float c=cos(uAngle),s=sin(uAngle);',
 'vec3 q=vec3(p.x*c-p.z*s,p.y,p.x*s+p.z*c);',
 'float sx=q.x*1.08,sy=q.y*1.22-q.z*.28;',
 'gl_Position=vec4(sx*.99/max(1.0,uAspect/1.65),sy*1.22,-q.z*.24,1.0);',
 'float shade=.72+.28*abs(dot(normalize(aNormal),normalize(vec3(.45,.8,.62))));',
 'vColor=aColor.rgb*shade;}'
].join('\n');
const FS=['#version 300 es','precision highp float;','in vec3 vColor;out vec4 outColor;','void main(){outColor=vec4(vColor,1.0);}'].join('\n');
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);
if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
const vao=gl.createVertexArray();gl.bindVertexArray(vao);
function attr(loc,count,data){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,count,gl.FLOAT,false,0,0);return b;}
const positionBuffer=attr(0,3,new Float32Array(3)),colorBuffer=attr(1,4,new Float32Array(4)),normalBuffer=attr(2,3,new Float32Array(3));
const indexBuffer=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
gl.useProgram(program);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
const angleUniform=gl.getUniformLocation(program,'uAngle'),aspectUniform=gl.getUniformLocation(program,'uAspect');
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function normals(vertices){const out=new Float32Array(vertices.length);
 for(let q=0;q<vertices.length/3;q+=4){
  const a=[...vertices.slice(q*3,q*3+3)],b=[...vertices.slice((q+1)*3,(q+1)*3+3)],c=[...vertices.slice((q+2)*3,(q+2)*3+3)];
  const n=cross(b.map((x,i)=>x-a[i]),c.map((x,i)=>x-a[i])),length=Math.hypot(...n)||1;
  for(let j=q;j<q+4;j++)out.set(n.map(x=>x/length),j*3);
 }return out;
}
function draw(){
 const choice=options.find(a=>a.key===select.value);if(!choice)throw Error('Unrecognized real Pack5 surface option');
 const desc=getPack5Surface(choice.symbol,choice.variant),mesh=surfaceBoxMesh(desc,{rotation:0});
 if(mesh.vertexCount!==desc.art.length*24||mesh.triangles!==desc.art.length*12)throw Error('Real producer geometry mismatch');
 gl.bindVertexArray(vao);
 for(const [buffer,data] of [[positionBuffer,mesh.positions],[colorBuffer,mesh.colors],[normalBuffer,normals(mesh.positions)]]){
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
 }
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.indices,gl.DYNAMIC_DRAW);
 const w=Math.round(canvas.clientWidth*Math.min(devicePixelRatio||1,2)),h=Math.round(canvas.clientHeight*Math.min(devicePixelRatio||1,2));
 if(w<1||h<1)throw Error('No real WebGL2 framebuffer');
 canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);
 gl.clearColor(.06,.105,.133,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.uniform1f(angleUniform,view.value==='side'?1.08:-.25);gl.uniform1f(aspectUniform,w/h);
 gl.drawElements(gl.TRIANGLES,mesh.indices.length,gl.UNSIGNED_SHORT,0);
 const error=gl.getError();if(error!==gl.NO_ERROR)throw Error('Real Pack5 producer WebGL2 draw failed '+error);
 const materialKeys=[...new Set(desc.art.map(p=>p.material))].sort();
 if(materialKeys.some(m=>!PACK5_SURFACE_MATERIALS[m]))throw Error('Unknown actual Pack5 material in source descriptor');
 info.textContent=choice.key+' · '+desc.art.length+' real colored AABBs · '+mesh.triangles+' original producer triangles · support '+choice.attachment+' · not assigned to a building';
 window.__MW2A_PACK5_WITNESS={
  ready:true,webgl2:true,id:choice.key,symbol:choice.symbol,variant:choice.variant,view:view.value,
  attachment:choice.attachment,designCount:options.length,viewport:[innerWidth,innerHeight],
  producerSourceFile:'src/block-packs/pack-5/architectural-surfaces.mjs',
  physicalBoxCount:desc.art.length,vertexCount:mesh.vertexCount,triangleCount:mesh.triangles,
  materialKeys,producerMesh:true,actualSourcePalette:true,glError:error,
  assignsVariantToRoadmapABuilding:false,actualPlacedGameBuilding:false,
  roofBearingAccepted:false,realIPhone:false,creatorArtApproved:false
 };
}
select.addEventListener('change',draw);view.addEventListener('change',draw);addEventListener('resize',draw);draw();
