import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';
import {candidatePreviewShape} from '../../../src/building-pool/roadmap-4/m1-preview-shapes.mjs';
const models=allM1();
const k=(x,y,z)=>[x,y,z].join(',');
const mapOf=b=>new Map(b.cells.map(c=>[k(...c.at),c]));
const structural=new Set(['wall','column','parapet','partition']);

test('every retained M1 window is an exterior-facing clear tunnel with a supported wall socket',()=>{
  let windows=0;
  for(const b of models){
    const cells=mapOf(b), get=(x,y,z)=>cells.get(k(x,y,z));
    const seen=new Set();
    for(const c of b.cells.filter(c=>c.role==='window')){
      const [x,y,z]=c.at,outer=c.facing==='west'?-1:c.facing==='east'?1:0;
      assert.notEqual(outer,0,b.id+': window orientation must face east or west');
      assert.ok(!seen.has(k(...c.at)),b.id+': duplicate window');seen.add(k(...c.at));
      assert.equal(get(x+outer,y,z),undefined,b.id+': glass hidden behind exterior masonry');
      assert.equal(get(x-outer,y,z),undefined,b.id+': glass blocked by interior masonry');
      assert.equal(get(x,y-1,z)?.role,'wall',b.id+': window missing masonry sill');
      assert.equal(get(x,y+1,z)?.role,'wall',b.id+': window missing masonry head');
      assert.ok(b.openings.some(o=>o.kind==='window'&&k(...o.at)===k(...c.at)&&o.facing===c.facing),b.id+' window lacks opening');
      windows++;
    }
  }
  assert.ok(windows>=75,'more than 75 fully supported window sockets should remain after repairs');
});

test('genuine Pack 4 thin-pane shape sits in the now-clear outward wall normal and reveals its unresolved mounting gap',()=>{
  let checked=0;
  for(const b of models)for(const c of b.cells.filter(c=>c.role==='window')){
    const shape=candidatePreviewShape(c);
    assert.equal(shape.fidelity,'source-boxes',b.id);
    const thin=shape.boxes[0];
    assert.ok(thin[3]-thin[0]<0.07,b.id+': window plane is not correctly rotated into facade');
    // Pack 4 defines a narrow physically inset clear pane; the .045 gap at
    // top/bottom still needs a real frame/mount during later integration.
    assert.ok(thin[1]>0&&thin[4]<1,b.id+' mount must remain an explicit future dependency');
    assert.ok(b.dependencies.find(d=>d.ref===c.asset)?.unresolved.some(x=>/mount|pane/i.test(x)),b.id);
    checked++;
  }
  assert.ok(checked>=75);
});

test('each castle-tower upper roof cap has material beneath it and every new raised roof beam has a direct roof above',()=>{
  let caps=0,raisedBeams=0;
  for(const b of models){
    const map=mapOf(b),get=(x,y,z)=>map.get(k(x,y,z)),deck=b.architecturalNotes.storyCount*4;
    for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>deck)){
      const [x,y,z]=c.at;
      if(y!==deck+b.architecturalNotes.structuralSignature[6]+3+['small','medium','large'].indexOf(b.size))continue;
      const support=get(x,y-1,z);
      assert.ok(support,b.id+': tower roof cap floats with no joist or parapet underneath');
      assert.ok(support.role==='beam'||structural.has(support.role),b.id+': tower cap sits on nonbearing partial material');
      caps++;
    }
    for(const c of b.cells.filter(c=>c.role==='beam'&&c.at[1]>deck)){
      const [x,y,z]=c.at;
      assert.equal(get(x,y+1,z)?.role,'roof',b.id+' tower joist has no roof to brace');
      raisedBeams++;
    }
  }
  assert.ok(caps>200&&raisedBeams>90,'must cover all castle towers, not just one example');
});

const colliderIntersects=(cell,pose,radius=.24,height=1.8)=>{
  for(const [x,y,z,X,Y,Z] of candidatePreviewShape(cell).boxes){
    const [bx,by,bz]=cell.at;
    if(bx+X>pose[0]-radius+1e-6&&bx+x<pose[0]+radius-1e-6&&
      by+Y>pose[1]+1e-6&&by+y<pose[1]+height-1e-6&&
      bz+Z>pose[2]-radius+1e-6&&bz+z<pose[2]+radius-1e-6)return true;
  }
  return false;
};
test('source-box stair/landing clearances allow 280 standing poses for a bounded 0.48×1.8 prototype body',()=>{
  let poses=0;
  for(const b of models){
    const map=mapOf(b),mid=Math.floor(b.bounds[0]/2),entryZ=b.openings.find(o=>o.kind==='entrance').at[2];
    for(let level=0;level<b.architecturalNotes.storyCount-1;level++){
      const z=entryZ+3+(level%2)*3;
      for(let step=0;step<4;step++)for(const [offset,height] of [[.25,.5],[.75,1]]){
        const x=mid-2+step,y=level*4+step;
        const pose=[x+offset,y+height,z+.5];
        for(let bx=x-1;bx<=x+1;bx++)for(let by=Math.floor(pose[1]);by<=Math.ceil(pose[1]+1.8);by++)for(let bz=z-1;bz<=z+1;bz++){
          const cell=map.get(k(bx,by,bz));
          if(cell)assert.equal(colliderIntersects(cell,pose),false,b.id+' stair body intersects '+k(...cell.at));
        }
        poses++;
      }
    }
  }
  assert.equal(poses,280);
});
