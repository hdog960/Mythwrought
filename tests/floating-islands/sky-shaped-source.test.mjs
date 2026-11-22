import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkyIslandSourceView,meshSkyIslandSection} from '../../src/floating-islands/sky-source-mesh.mjs';
const cell=(x,y,z)=>`${x},${y},${z}`;
// Same prototypeSurfaceMesh public data contract as original shape-prototypes.mjs:
// positions/normals Float32Array, indices Uint16Array, box geometry in [0,1].
function singleBox([x0,y0,z0,x1,y1,z1]){
  const positions=[],normals=[],indices=[];
  const faces=[
    [[1,0,0],[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]]],
    [[-1,0,0],[[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[x0,y0,z0]]],
    [[0,1,0],[[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0]]],
    [[0,-1,0],[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]]],
    [[0,0,1],[[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[x0,y0,z1]]],
    [[0,0,-1],[[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[x1,y0,z0]]]
  ];
  for(const [normal,corners] of faces){const start=positions.length/3;
    for(const corner of corners){positions.push(...corner);normals.push(...normal);}
    indices.push(start,start+1,start+2,start,start+2,start+3);
  }
  return {positions:new Float32Array(positions),normals:new Float32Array(normals),indices:new Uint16Array(indices)};
}
const slab=singleBox([0,0,0,1,.5,1]);
const post=singleBox([.375,0,.375,.625,1,.625]);
const data=(entries,shapes={})=>{
  const sky=new Map(entries);
  return {source:createSkyIslandSourceView({groundGet:()=>0,skyGet:(x,y,z)=>sky.get(cell(x,y,z))??0}),
    shapeFor:id=>({cube:id===3,opaque:id!==7}),appearanceFor:id=>({color:[.4,.6,.8],mat:id}),
    surfaceMeshFor:(id,rotation)=>shapes[id]?.[rotation]??slab};
};
test('real-shaped slab mesh yields authored half-height geometry without full-cube fallback',()=>{
  const host=data([[cell(4,40,4),9]]);const m=meshSkyIslandSection({...host,cx:0,cz:0,section:1});
  assert.equal(m.vertexCount,36);assert.equal(m.shapedTriangles,12);assert.equal(m.exposedFaces,0);
  const heights=new Set();for(let i=1;i<m.vertices.length;i+=9)heights.add(m.vertices[i]);
  assert.deepEqual([...heights].sort((a,b)=>a-b),[40,40.5]);
  assert.equal(m.bytes,36*36);
});
test('shaped boundary face hidden only by physically full opaque cube neighbor',()=>{
  const host=data([[cell(15,40,4),9],[cell(16,40,4),3]]);
  const a=meshSkyIslandSection({...host,cx:0,cz:0,section:1});
  const b=meshSkyIslandSection({...host,cx:1,cz:0,section:1});
  assert.equal(a.shapedTriangles,10);assert.equal(b.exposedFaces,5);
});
test('neighboring shaped geometry never masquerades as full opaque blocker',()=>{
  const host=data([[cell(15,40,4),9],[cell(16,40,4),9]]);
  assert.equal(meshSkyIslandSection({...host,cx:0,cz:0,section:1}).shapedTriangles,12);
});
test('slim physical post preserves correct dimensions and rotates through original-authority reader',()=>{
  const host=data([[cell(-1,100,-1),8]],{8:{2:post}});
  const seen=[];
  const out=meshSkyIslandSection({...host,cx:-1,cz:-1,section:5,
    rotationFor:(x,y,z,id)=>{seen.push([x,y,z,id]);return 2;}});
  assert.equal(out.shapedTriangles,12);assert.ok(seen.length>0);
  let min=Infinity,max=-Infinity;
  for(let i=0;i<out.vertices.length;i+=9){min=Math.min(min,out.vertices[i]);max=Math.max(max,out.vertices[i]);}
  assert.equal(min,-.625);assert.equal(max,-.375);
});
test('source-provider missing noncube surface remains fail-closed',()=>{
  const host=data([[cell(3,44,3),9]]);
  assert.throws(()=>meshSkyIslandSection({...host,surfaceMeshFor:undefined,cx:0,cz:0,section:1}),/original shaped-geometry/);
});
test('malformed shape arrays, normals, rotations and out-of-cell geometry fail closed',()=>{
  const host=data([[cell(3,44,3),9]]);
  const base={...host,cx:0,cz:0,section:1};
  assert.throws(()=>meshSkyIslandSection({...base,surfaceMeshFor:()=>({positions:[1],normals:[],indices:[]})}),/geometry/);
  assert.throws(()=>meshSkyIslandSection({...base,surfaceMeshFor:()=>singleBox([-1,0,0,1,1,1])}),/geometry/);
  assert.throws(()=>meshSkyIslandSection({...base,rotationFor:()=>5}),/rotation/);
});
test('original-shaped world editing AIR=0 eliminates complete post geometry',()=>{
  const edits=new Map([[cell(2,42,2),0]]);
  const source=createSkyIslandSourceView({groundGet:()=>0,skyGet:(x,y,z)=>x===2&&y===42&&z===2?9:0,skyEdits:edits});
  const host=data([]);
  const a=meshSkyIslandSection({...host,source,cx:0,cz:0,section:1});
  assert.equal(a.shapedTriangles,0);assert.equal(a.vertexCount,0);
});
