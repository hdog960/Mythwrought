// Standalone canvas gallery for Pack 1 M4; all geometry derives from candidate AABBs.
// This is NOT the production renderer. No DOM/game interactions outside this page.
import {FOLIAGE_ASSETS,foliageDescriptor,foliageTexture,foliageOccupies} from './physical-foliage.mjs';
import {createFoliageFixture,restoreFoliageFixture} from './foliage-fixture.mjs';
const grid=document.querySelector('#grid'),output=document.querySelector('#status');
const cells=new Map(),views=new Map(),tiles=new Map();
let fixture=createFoliageFixture(179);
const cellAt=index=>[index*2,3,0];
const sliceY=id=>id===24?.55:id===25?.5:id===26?.65:id===27?.49:id===28?.6:.59;
const project=(x,y,z)=>[120+(x-z)*76,151+(x+z)*32-y*110];
function tile(id,role,face){
  const key=id+':'+role+':'+face;
  if(tiles.has(key))return tiles.get(key);
  const art=foliageTexture(id,face,24,role);
  const canvas=document.createElement('canvas');canvas.width=24;canvas.height=24;
  canvas.getContext('2d').putImageData(new ImageData(
    new Uint8ClampedArray(art.pixels),24,24),0,0);
  tiles.set(key,canvas);return canvas;
}
function face(ctx,id,role,side,origin,u,v,depth){
  const p=project(...origin),a=project(...u),b=project(...v);
  return {depth,draw(){
    ctx.save();ctx.imageSmoothingEnabled=false;
    ctx.setTransform((a[0]-p[0])/24,(a[1]-p[1])/24,
      (b[0]-p[0])/24,(b[1]-p[1])/24,p[0],p[1]);
    ctx.drawImage(tile(id,role,side),0,0,24,24);
    ctx.restore();
    const c=[a[0]+b[0]-p[0],a[1]+b[1]-p[1]];
    ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...a);
    ctx.lineTo(...c);ctx.lineTo(...b);ctx.closePath();
    ctx.strokeStyle='rgba(14,22,24,.68)';ctx.lineWidth=.65;ctx.stroke();
  }};
}
function paint(id,canvas,rotation,active){
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,240,220);
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(120,185,83,12,0,0,Math.PI*2);ctx.fill();
  const d=foliageDescriptor(id,{rotation}),faces=[];
  for(const part of d.parts){
    const [x,y,z,X,Y,Z]=part.box;
    const dist=(x+X+z+Z)/4;
    faces.push(face(ctx,id,part.role,'east',[X,y,z],[X,y,Z],[X,Y,z],dist+.08));
    faces.push(face(ctx,id,part.role,'south',[x,y,Z],[X,y,Z],[x,Y,Z],dist+.18));
    faces.push(face(ctx,id,part.role,'top',[x,Y,z],[X,Y,z],[x,Y,Z],dist+.27));
  }
  faces.sort((a,b)=>a.depth-b.depth);
  for(const f of faces)f.draw();
  ctx.font='bold 13px monospace';ctx.fillStyle=active?'#f4cc79':'#d9e7d4';
  ctx.fillText('ID '+id,8,19);
  ctx.font='12px monospace';ctx.fillText(rotation*90+'°',190,19);
  if(active){ctx.strokeStyle='#f0d38b';ctx.lineWidth=1.5;ctx.strokeRect(1,1,238,218);}
}
function paintSlice(id,canvas,rotation){
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,144,144);
  const size=12,y=sliceY(id);
  for(let z=0;z<size;z++)for(let x=0;x<size;x++){
    const point=[(x+.5)/size,y,(z+.5)/size];
    const selection=foliageOccupies(id,point,{rotation});
    const blocking=foliageOccupies(id,point,{rotation,mode:'collision'});
    ctx.fillStyle=selection?(blocking?'#e8b869':'#d3b16c'):'#11272e';
    ctx.fillRect(x*12,z*12,12,12);
    ctx.strokeStyle='rgba(211,239,223,.14)';ctx.strokeRect(x*12+.5,z*12+.5,11,11);
  }
}
function refresh(note=''){
  for(const [id,v] of views){
    const i=FOLIAGE_ASSETS.findIndex(a=>a.id===id),active=fixture.get(...cellAt(i))===id;
    const rotation=cells.get(id);
    v.card.classList.toggle('active',active);
    paint(id,v.preview,rotation,active);
    paintSlice(id,v.slice,rotation);
    v.place.textContent=active?'Remove physical piece':'Place physical piece';
    v.rotate.textContent='Rotate '+(rotation*90)+'°';
  }
  let saved;
  try{saved='Canonical schema-1 fixture edits: '+fixture.save().edits.length}
  catch(error){saved='Safe save BLOCKED: '+error.message}
  output.textContent=(note?note+'\n':'')+'Individually placed candidate cells: '+fixture.size+'\n'+
    saved+'\nLive game / block IDs 0–8 / seeded world / actual player saves: UNCHANGED.';
}
function placingOptions(id){
  return {rotation:cells.get(id),wallMount:[27,28].includes(id)};
}
for(const [i,asset] of FOLIAGE_ASSETS.entries()){
  cells.set(asset.id,0);
  const card=document.createElement('section');card.className='card';
  const heading=document.createElement('h2');heading.textContent=asset.name;
  const preview=document.createElement('canvas');preview.width=240;preview.height=220;
  preview.className='preview';preview.setAttribute('role','img');
  preview.setAttribute('aria-label',asset.name+' partial voxel gallery view');
  const desc=document.createElement('p');desc.className='desc';desc.textContent=asset.appearance;
  const info=document.createElement('p');info.className='metadata';
  info.textContent='collision: '+asset.collision+' / mount: '+asset.attachment;
  const slice=document.createElement('canvas');slice.width=144;slice.height=144;
  slice.className='slice';slice.tabIndex=0;slice.setAttribute('role','button');
  slice.setAttribute('aria-label','Select occupied or empty '+asset.name+' regions');
  const place=document.createElement('button');place.type='button';
  place.addEventListener('click',()=>{
    const cell=cellAt(i),active=fixture.get(...cell)===asset.id;
    const result=active?fixture.remove(...cell):fixture.place(...cell,asset.id,placingOptions(asset.id));
    refresh(result.ok?(active?'Removed ':'Placed ')+asset.name:'Placement rejected: '+result.reason);
  });
  const rotate=document.createElement('button');rotate.type='button';
  rotate.addEventListener('click',()=>{
    const rotation=(cells.get(asset.id)+1)%4;
    cells.set(asset.id,rotation);
    const cell=cellAt(i);
    if(fixture.get(...cell)===asset.id){
      fixture.remove(...cell);fixture.place(...cell,asset.id,placingOptions(asset.id));
    }
    refresh(asset.name+' rotated '+rotation*90+'°; orientation persistence is engine-blocked.');
  });
  const probe=(x,z)=>{
    const cell=cellAt(i),active=fixture.get(...cell)===asset.id;
    const point=[(x+.5)/12,sliceY(asset.id),(z+.5)/12];
    const result=active?fixture.probe(...cell,point):null;
    const collision=active?fixture.probe(...cell,point,'collision'):null;
    refresh(!active?'Place physical candidate before probing.':
      (result?'TARGETABLE physical voxel at ':'EMPTY selection space at ')+point.map(x=>x.toFixed(2)).join(',')+
      (collision?' (collidable)':' (not collidable)'));
  };
  slice.addEventListener('click',e=>{
    const box=slice.getBoundingClientRect();
    const x=Math.max(0,Math.min(11,Math.floor((e.clientX-box.left)*12/box.width)));
    const z=Math.max(0,Math.min(11,Math.floor((e.clientY-box.top)*12/box.height)));
    probe(x,z);
  });
  slice.addEventListener('keydown',e=>{
    if(e.key===' '||e.key==='Enter'){e.preventDefault();probe(6,6);}
  });
  card.append(heading,preview,desc,info,slice,place,rotate);
  grid.append(card);views.set(asset.id,{card,preview,slice,place,rotate});
}
document.querySelector('#all').addEventListener('click',()=>{
  fixture=createFoliageFixture();
  FOLIAGE_ASSETS.forEach((a,i)=>{cells.set(a.id,0);fixture.place(...cellAt(i),a.id,placingOptions(a.id));});
  refresh('Eight physical candidate cells installed in isolated test fixture only.');
});
document.querySelector('#clear').addEventListener('click',()=>{
  fixture=createFoliageFixture();refresh('Removed all eight fixture-only foliage candidates.');
});
document.querySelector('#save').addEventListener('click',()=>{
  try{
    fixture=restoreFoliageFixture(JSON.parse(JSON.stringify(fixture.save())),{mountForVines:true});
    refresh('PASS: canonical schema-1-shaped fixture save and restore.');
  }catch(error){refresh('SAFE SAVE BLOCKER: '+error.message);}
});
refresh('Select an asset to place, rotate or probe its genuine partial occupancy.');
