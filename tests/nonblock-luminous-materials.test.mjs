import assert from 'node:assert/strict';
import test from 'node:test';
import {candidateVertices,describeCandidateObject} from '../src/nonblock/candidate-scene.mjs';

for(const [sceneId,lit] of [['scene48:glowing-vine',[6,12]],['scene48:lantern-mushroom',[15,16]],
  ['scene48:cavecap',[]]]){
  test(sceneId+' assigns the existing luminous treatment to selected source faces',()=>{
    const shape=describeCandidateObject(179,{sceneId,anchor:[10,9,7],variant:1});
    const vertices=candidateVertices([shape]);
    assert.equal(vertices.length,shape.positions.length*3);
    let luminous=0,matte=0;
    for(let i=0;i<shape.materials.length;i++){
      const pigment=shape.materials[i];
      const treated=lit.includes(pigment);
      assert.equal(vertices[i*27+8],treated?11:21);
      if(treated){
        luminous++;
        const rgb=vertices.subarray(i*27+3,i*27+6);
        assert.ok(rgb.every((value,index)=>Math.abs(value-shape.palette[pigment][index])<1e-6));
      }else matte++;
    }
    assert.ok(matte>0);
    assert.equal(luminous>0,lit.length>0);
  });
}
