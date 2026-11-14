import test from 'node:test';
import assert from 'node:assert/strict';
import {allM1} from '../../../src/building-pool/roadmap-4/m1-blueprints.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-4/schema.mjs';

// This suite covers false positives exposed by reviewing actual M1 sections:
// a roof-only hole is NOT an atrium, and a door over an open shaft is NOT an entrance.
const models=allM1();
const index=b=>new Map(b.cells.map(c=>[c.at.join(','),c]));
const k=(x,y,z)=>[x,y,z].join(',');
const navIndex=b=>new Map(b.navigation.map(n=>[n.at.join(','),n]));

test('every M1 doorway has two-cell standing clearance, floor support and authored navigation',()=>{
  let count=0;
  for(const b of models){
    const cells=index(b),nav=navIndex(b);
    for(const o of b.openings.filter(x=>x.kind!=='window')){
      const [x,y,z]=o.at;
      assert.equal(cells.has(k(x,y,z)),false,b.id);
      assert.equal(cells.has(k(x,y+1,z)),false,b.id+': blocked headroom');
      assert.ok(cells.has(k(x,y-1,z)),b.id+': unsupported opening');
      assert.ok(nav.has(k(x,y,z)),b.id+': false door');
      count++;
    }
  }
  assert.ok(count>100,'must verify more than one nominal main entrance per building');
});

test('desert courtyards stay sky-open across every upper story instead of a roof-only aperture',()=>{
  let checked=0;
  for(const b of models.filter(x=>x.biome==='desert')){
    const cells=index(b);
    const [w,d,stories,,front,court]=b.architecturalNotes.structuralSignature;
    assert.ok(court>=2);
    const mid=Math.floor(w/2),centerZ=Math.floor((front+d-2)/2),roofY=stories*4;
    let ground=0;
    for(let x=mid-court;x<=mid+court;x++)for(let z=centerZ-court;z<=centerZ+court;z++){
      if(!cells.has(k(x,0,z)))continue;ground++;
      for(let l=1;l<stories;l++)assert.equal(cells.has(k(x,l*4,z)),false,b.id+' courtyard obstructed at '+l);
      assert.equal(cells.has(k(x,roofY,z)),false,b.id+' roof blocks real court');
    }
    assert.ok(ground>=4,b.id+' courtyard has no ground');
    checked++;
  }
  assert.equal(checked,6);
});

test('upper desert gallery doors avoid open-air columns and remain supported',()=>{
  for(const b of models.filter(x=>x.biome==='desert')){
    const nav=navIndex(b),cells=index(b);
    for(const o of b.openings.filter(o=>o.kind==='door'&&o.at[1]>1)){
      const [x,y,z]=o.at;
      assert.ok(cells.has(k(x,y-1,z))&&nav.has(k(x,y,z)),b.id+' upper door into void');
      assert.ok(cells.has(k(x,y-1,z-1))||cells.has(k(x,y-1,z+1)),b.id+' no longitudinal approach');
    }
  }
});

test('every multilevel flight has four raised tread coordinates and landing connection',()=>{
  for(const b of models){
    const cells=index(b),nav=navIndex(b),[w,,stories]=b.architecturalNotes.structuralSignature;
    const entranceZ=b.openings.find(x=>x.kind==='entrance').at[2],mx=Math.floor(w/2),flightZ=entranceZ+3;
    const stairCount=b.cells.filter(c=>c.role==='stair').length;
    assert.equal(stairCount,(stories-1)*4,b.id);
    for(let l=0;l<stories-1;l++){
      for(let step=0;step<4;step++){
        const x=mx-2+step,y=l*4+step,z=flightZ;
        assert.equal(cells.get(k(x,y,z))?.role,'stair',b.id+' missing step '+step);
        assert.equal(nav.get(k(x,y+1,z))?.mode,'stair',b.id+' no path on step '+step);
      }
      assert.equal(cells.get(k(mx+2,(l+1)*4,flightZ))?.role,'landing',b.id);
      assert.equal(nav.get(k(mx+2,(l+1)*4+1,flightZ))?.mode,'landing',b.id);
    }
  }
});

test('every architectural story has at least one authored usable room and 2-high walking routes',()=>{
  for(const b of models){
    const cells=index(b),stories=b.architecturalNotes.storyCount;
    const roomLevels=new Set(b.spaces.map(s=>s.level));
    for(let l=0;l<stories;l++){
      const yy=l*4+1;
      assert.ok(roomLevels.has(yy),b.id+' has unlabeled storey '+l);
      assert.ok(b.navigation.some(n=>n.at[1]===yy),b.id+' missing level circulation');
      for(const s of b.spaces.filter(s=>s.level===yy)){
        assert.ok(s.footprint.length>=2,b.id+' token room');
        for(const [x,z] of s.footprint){
          assert.ok(cells.has(k(x,yy-1,z)),b.id+' missing structural floor');
          assert.equal(cells.has(k(x,yy,z)),false,b.id+' blocked room foot');
          assert.equal(cells.has(k(x,yy+1,z)),false,b.id+' blocked room head');
        }
      }
    }
  }
});

test('validator refuses falsely declared stair navigation and blocked doorway headroom',()=>{
  const a=structuredClone(models.find(x=>x.id==='r4:civic-hall:temperate:medium:01'));
  const normal=a.navigation.find(n=>n.mode==='walk');
  normal.mode='stair';
  assert.throws(()=>validateBlueprint(a),/stair path has no authored stair-tread support/);
  const b=structuredClone(models.find(x=>x.id==='r4:civic-hall:temperate:small:01'));
  const [x,y,z]=b.openings[0].at;
  b.cells.push({at:[x,y+1,z],role:'wall',asset:'base:stone',facing:'south'});
  assert.throws(()=>validateBlueprint(b),/two-cell doorway has blocked headroom/);
});

test('small and large castles have elevated roofline crowns with readable crenellations',()=>{
  let castles=0;
  for(const b of models.filter(b=>b.type==='castle-palace')){
    const [,,stories,,,,pitch]=b.architecturalNotes.structuralSignature;
    const top=stories*4+pitch+3+['small','medium','large'].indexOf(b.size);
    const cap=b.cells.filter(c=>c.at[1]===top&&c.role==='roof');
    const cren=b.cells.filter(c=>c.at[1]===top+1&&c.role==='parapet');
    assert.ok(cap.length>=15,b.id+': no readable tower crown');
    assert.ok(cren.length>=6,b.id+': no crenellated skyline');
    assert.ok(top+1<b.bounds[1],b.id+': crown over bounds');
    castles++;
  }
  assert.equal(castles,15);
});
