import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';

const models=allM1();
const k=(x,y,z)=>`${x},${y},${z}`;
const loadRoles=new Set(['beam','column','wall','partition','parapet']);
const horizontal=[[1,0],[-1,0],[0,1],[0,-1]];

function world(b){
  const blocks=new Map(b.cells.map(c=>[k(...c.at),c]));
  return (x,y,z)=>blocks.get(k(x,y,z));
}

test('all raised M1 roof surfaces rest on genuine timber or masonry rather than stacked thin roof tiles',()=>{
  let above=0,unsupported=0;
  for(const b of models){
    const get=world(b),deck=b.architecturalNotes.storyCount*4;
    for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>deck)){
      const [x,y,z]=c.at,below=get(x,y-1,z);
      assert.ok(below&&loadRoles.has(below.role),b.id+' thin tile rests on another thin roof tile or unsupported air at '+k(x,y,z));
      if(!below||!loadRoles.has(below.role))unsupported++;
      above++;
    }
  }
  assert.ok(above>12000,'check entire 30-building raised roof, not a decorative sample');
  assert.equal(unsupported,0);
});

test('all raised roof purlins have continuous braced run to vertical masonry/wood on both ends',()=>{
  let beams=0;
  for(const b of models){
    const get=world(b),deck=b.architecturalNotes.storyCount*4;
    for(const cell of b.cells.filter(c=>c.role==='beam'&&c.at[1]>=deck)){
      const [x,y,z]=cell.at,[dx,dz]=cell.facing==='north'?[0,1]:[1,0];
      for(const side of [-1,1]){
        let bearing=false;
        for(let n=1;n<=Math.max(b.bounds[0],b.bounds[2]);n++){
          const node=get(x+dx*n*side,y,z+dz*n*side);
          if(!node)break;
          if(['wall','column','parapet','partition'].includes(node.role)){bearing=true;break;}
          if(node.role!=='beam')break;
        }
        assert.ok(bearing,b.id+' orphan roof purlin at '+k(x,y,z)+' side '+side);
      }
      beams++;
    }
  }
  assert.ok(beams>6000);
});

test('raised roof support posts transmit load to directly supported top-floor joists instead of thin tiles',()=>{
  let roots=0,upperPiers=0;
  for(const b of models){
    const get=world(b),deck=b.architecturalNotes.storyCount*4;
    for(const cell of b.cells.filter(c=>c.role==='column'&&c.at[1]>=deck)){
      const [x,y,z]=cell.at;
      if(y===deck){
        const bearing=get(x,deck-1,z);
        assert.ok(bearing&&loadRoles.has(bearing.role),b.id+' timber purlin rests on nonbearing roof at '+k(x,y,z));
        roots++;
      }else{
        const lower=get(x,y-1,z);
        assert.equal(lower?.role,'column',b.id+' floating upper rafter at '+k(x,y,z));
        upperPiers++;
      }
    }
  }
  assert.ok(roots>2500&&upperPiers>2500);
});

test('all exposed stepped-roof height transitions are weather-blocked without bridging desert courtyards',()=>{
  let sealed=0;
  for(const b of models){
    const get=world(b),deck=b.architecturalNotes.storyCount*4;
    const pitch=b.architecturalNotes.structuralSignature[6],surface=new Map();
    for(const c of b.cells.filter(c=>c.role==='roof'&&c.at[1]>deck&&c.at[1]<=deck+pitch)){
      const [x,y,z]=c.at,xy=`${x},${z}`;
      surface.set(xy,Math.max(surface.get(xy)||deck,y));
    }
    for(const [xy,top] of surface){
      const [x,z]=xy.split(',').map(Number);
      for(const [dx,dz] of horizontal){
        const adjacent=surface.get(`${x+dx},${z+dz}`)||deck;
        if(top-adjacent<=1)continue;
        for(let y=adjacent+1;y<top;y++){
          assert.ok(get(x,y,z),b.id+' open vertical roof seam '+k(x,y,z));
          sealed++;
        }
      }
    }
    if(b.biome==='desert'){
      const [width,depth,storeys,wing,front,court]=b.architecturalNotes.structuralSignature;
      const cx=Math.floor(width/2),cz=Math.floor((front+depth-2)/2);
      for(let x=cx-court;x<=cx+court;x++)for(let z=cz-court;z<=cz+court;z++){
        for(let y=deck;y<=deck+pitch;y++)assert.equal(get(x,y,z),undefined,b.id+' closed the open desert court');
      }
    }
  }
  assert.ok(sealed>4000);
});

test('lightweight roof retains distinct skyline while removing majority of previous solid attic infill',()=>{
  const previousSolidRisers=21951;
  let newRisers=0,allRoofCaps=0,allStructural=0;
  for(const b of models){
    const deck=b.architecturalNotes.storyCount*4;
    for(const c of b.cells){
      if(c.at[1]>deck&&c.role==='column')newRisers++;
      if(c.at[1]>deck&&c.role==='roof')allRoofCaps++;
      if(c.at[1]>=deck&&c.role==='beam')allStructural++;
    }
  }
  assert.ok(newRisers<previousSolidRisers*0.4,'attic roof still filled with excessive solid piers');
  assert.ok(allRoofCaps>12500,'roof silhouette lost');
  assert.ok(allStructural>8000,'supporting timber framework missing');
});
