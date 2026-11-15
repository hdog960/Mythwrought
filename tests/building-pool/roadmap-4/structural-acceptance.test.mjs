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
    const entranceZ=b.openings.find(x=>x.kind==='entrance').at[2],mx=Math.floor(w/2);
    const stairCount=b.cells.filter(c=>c.role==='stair').length;
    assert.equal(stairCount,(stories-1)*4,b.id);
    for(let l=0;l<stories-1;l++){
      const flightZ=entranceZ+3+(l%2)*3;
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

test('biome roof references are appropriate physical families, and specialty ribs/anchors never replace full walls',()=>{
  const roofs={temperate:'pack3:023',desert:'pack3:024',snow:'pack3:025','enchanted-forest':'pack3:026',mountain:'pack3:025'};
  const walls={temperate:'pack1:002',desert:'biome130:091',snow:'biome130:094','enchanted-forest':'base:wood',mountain:'pack1:002'};
  const accents={temperate:'pack2:015','enchanted-forest':'biome130:096',mountain:'biome130:098'};
  for(const b of models){
    assert.ok(b.cells.some(c=>c.role==='roof'&&c.asset===roofs[b.biome]),b.id+': wrong roofing reference');
    assert.ok(b.cells.some(c=>c.role==='wall'&&c.asset===walls[b.biome]),b.id+': wrong physical wall reference');
    if(accents[b.biome]){
      assert.ok(b.cells.filter(c=>c.role==='fixture'&&c.asset===accents[b.biome]).length>=2,b.id+': regional detailing missing');
      assert.ok(!b.cells.some(c=>c.role==='wall'&&c.asset===accents[b.biome]),b.id+': accent masquerades as masonry');
    }
  }
});

test('every authored interior room occupies one cardinally connected floor area',()=>{
  for(const b of models){
    for(const room of b.spaces){
      const footprints=new Set(room.footprint.map(p=>p.join(',')));
      const root=room.footprint[0],pending=[root],visited=new Set([root.join(',')]);
      while(pending.length){
        const [x,z]=pending.pop();
        for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const cell=[x+dx,z+dz],key=cell.join(',');
          if(footprints.has(key)&&!visited.has(key)){
            visited.add(key);pending.push(cell);
          }
        }
      }
      assert.equal(visited.size,room.footprint.length,b.id+'/'+room.id+' has disconnected floor islands');
      assert.ok(room.footprint.some(([x,z])=>x===room.access[0]&&z===room.access[2]),b.id+'/'+room.id+' access outside room');
    }
  }
});

test('all raised stair treads and landings have continuous occupied load paths to base floor',()=>{
  let checked=0,upperFlights=0;
  for(const b of models){
    const cells=index(b),floor=b.architecturalNotes.storyCount;
    for(const c of b.cells.filter(x=>x.role==='stair'||x.role==='landing')){
      const [x,y,z]=c.at;
      for(let iy=y-1;iy>=0;iy--){
        assert.ok(cells.has(k(x,iy,z)),b.id+' floating staircase at '+[x,y,z]+' missing support y='+iy);
      }
      checked++;
    }
    if(floor>=3){
      const zset=new Set(b.cells.filter(c=>c.role==='stair').map(c=>c.at[2]));
      assert.equal(zset.size,2,b.id+' upper stair flight overlaps lower support shaft');upperFlights++;
    }
  }
  assert.ok(checked>=140);assert.equal(upperFlights,10);
});

test('every roof joist stays above head clearance, has roof cover and joins a load-bearing wall or partition on both sides',()=>{
  const structural=new Set(['wall','column','parapet','partition']);
  let joists=0;
  for(const b of models){
    const occupancy=index(b),roofLevel=b.architecturalNotes.storyCount*4;
    for(const beam of b.cells.filter(c=>c.role==='beam')){
      const [x,y,z]=beam.at;
      const towerCapBeam=y>roofLevel;
      assert.ok(y===roofLevel-1||towerCapBeam,b.id+' joist blocks a walkable room at '+[x,y,z]);
      assert.equal(occupancy.get(k(x,y+1,z))?.role,'roof',b.id+' joist has no roof to support');
      // Main deck beams run between walls in X; elevated tower cap beams
      // run either X or Z between crenellated parapets.
      const axis=towerCapBeam&&beam.facing==='north'?[0,1]:[1,0];
      for(const sign of [-1,1]){
        let attached=false;
        for(let step=1;step<Math.max(...b.bounds);step++){
          const xx=x+sign*step*axis[0],zz=z+sign*step*axis[1];
          if(xx<0||zz<0||xx>=b.bounds[0]||zz>=b.bounds[2])break;
          const neighbor=occupancy.get(k(xx,y,zz));
          if(!neighbor)break;
          if(structural.has(neighbor.role)){attached=true;break;}
          if(neighbor.role!=='beam')break;
        }
        assert.ok(attached,b.id+' roof beam not anchored on BOTH ends at '+[x,y,z]);
      }
      joists++;
    }
  }
  assert.ok(joists>4000,'all-30 blueprints must carry real overhead roof framing');
});
