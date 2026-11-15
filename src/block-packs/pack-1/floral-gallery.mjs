// Standalone source-only preview. Uses the same candidate boxes as the isolated
// targeting/shape contract. Does not invoke or alter any live Mythwrought systems.
import {FLORAL_CANDIDATES,floralDescriptor,floralTexture,floralOccupies} from './floral-forms.mjs';
import {createFloralFixture,restoreFloralFixture} from './floral-fixture.mjs';

const grid=document.querySelector('#grid'),output=document.querySelector('#status');
const rotations=new Map(),cards=new Map(),tiles=new Map();
const sectionHeight=new Map([[32,.51],[33,.81],[34,.84],[35,.87],[36,.68],[37,.75],[38,.80]]);
let fixture=createFloralFixture();
const cellAt=i=>[i*2,3,0];
const project=(x,y,z)=>[119+(x-z)*76,151+(x+z)*33-y*107];
function texture(id,role,face){
  const key=[id,role,face].join(':');
  if(tiles.has(key))return tiles.get(key);
  const art=floralTexture(id,role,face,24);
  const canvas=document.createElement('canvas');canvas.width=24;canvas.height=24;
  canvas.getContext('2d').putImageData(new ImageData(
    new Uint8ClampedArray(art.pixels),24,24),0,0);
  tiles.set(key,canvas);return canvas;
}
function face(ctx,id,role,side,origin,xpoint,ypoint,depth){
  const p=project(...origin),u=project(...xpoint),v=project(...ypoint);
  return {depth,paint(){
    ctx.save();
    ctx.imageSmoothingEnabled=false;
    ctx.setTransform((u[0]-p[0])/24,(u[1]-p[1])/24,
      (v[0]-p[0])/24,(v[1]-p[1])/24,p[0],p[1]);
    ctx.drawImage(texture(id,role,side),0,0,24,24);ctx.restore();
    const last=[u[0]+v[0]-p[0],u[1]+v[1]-p[1]];
    ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...u);ctx.lineTo(...last);
    ctx.lineTo(...v);ctx.closePath();
    ctx.strokeStyle='rgba(12,25,30,.66)';ctx.lineWidth=.8;ctx.stroke();
  }};
}
function drawSpecimen(id,canvas,rotation,placed){
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,240,220);
  ctx.fillStyle='rgba(0,0,0,.27)';
  ctx.beginPath();ctx.ellipse(120,185,80,12,0,0,Math.PI*2);ctx.fill();
  const desc=floralDescriptor(id,{rotation}),faces=[];
  for(const component of desc.parts){
    const [x,y,z,X,Y,Z]=component.box;
    const dist=(x+X+z+Z)/4;
    faces.push(face(ctx,id,component.role,'east',[X,y,z],[X,y,Z],[X,Y,z],dist+.07));
    faces.push(face(ctx,id,component.role,'south',[x,y,Z],[X,y,Z],[x,Y,Z],dist+.15));
    faces.push(face(ctx,id,component.role,'top',[x,Y,z],[X,Y,z],[x,Y,Z],dist+.26));
  }
  faces.sort((a,b)=>a.depth-b.depth);for(const f of faces)f.paint();
  ctx.fillStyle=placed?'#f9d690':'#e3ece7';ctx.font='bold 14px monospace';
  ctx.fillText('ID '+id,8,19);
  ctx.font='12px monospace';ctx.fillText(rotation*90+'°',188,19);
  if(placed){ctx.strokeStyle='#f0c980';ctx.lineWidth=1.5;ctx.strokeRect(1,1,238,218);}
}
function drawSection(id,canvas,rotation){
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,144,144);
  const y=sectionHeight.get(id);
  for(let z=0;z<12;z++)for(let x=0;x<12;x++){
    const p=[(x+.5)/12,y,(z+.5)/12];
    const occupied=floralOccupies(id,p,{rotation});
    const blocking=floralOccupies(id,p,{rotation,mode:'collision'});
    ctx.fillStyle=occupied?(blocking?'#ecc884':'#cdaa64'):'#102a32';
    ctx.fillRect(x*12,z*12,12,12);
    ctx.strokeStyle='rgba(210,226,218,.1)';
    ctx.strokeRect(x*12+.5,z*12+.5,11,11);
  }
}
function refresh(message=''){
  for(const [id,c] of cards){
    const index=FLORAL_CANDIDATES.findIndex(x=>x.id===id);
    const placed=fixture.get(...cellAt(index))===id;
    c.card.classList.toggle('active',placed);
    const rotation=rotations.get(id);
    drawSpecimen(id,c.canvas,rotation,placed);
    drawSection(id,c.slice,rotation);
    c.place.textContent=placed?'Remove specimen':'Place specimen';
    c.rotate.textContent='Rotate '+(rotation*90)+'°';
  }
  let saved;
  try{saved='Schema-1-shaped canonical fixture edits: '+fixture.save().edits.length;}
  catch(e){saved='Save safely BLOCKED: '+e.message;}
  output.textContent=(message?message+'\n':'')+
    'Individually placed physical specimens: '+fixture.size+'\n'+saved+
    '\nNo live renderer, world generation, game saves or harvesting modified.';
}
for(const [index,asset] of FLORAL_CANDIDATES.entries()){
  rotations.set(asset.id,0);
  const card=document.createElement('article');card.className='item';
  const header=document.createElement('h2');header.textContent=asset.name;
  const canvas=document.createElement('canvas');canvas.width=240;canvas.height=220;
  canvas.className='preview';canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',asset.name+' physical voxel 3D-style candidate preview');
  const desc=document.createElement('p');desc.className='desc';desc.textContent=asset.appearance;
  const meta=document.createElement('p');meta.className='meta';
  meta.textContent=asset.family+' · '+asset.collisionPolicy+' · no growth/harvest';
  const slice=document.createElement('canvas');slice.width=144;slice.height=144;
  slice.className='slice';slice.tabIndex=0;slice.setAttribute('role','button');
  slice.setAttribute('aria-label',asset.name+' occupancy cross-section probe');
  const place=document.createElement('button');place.type='button';
  place.addEventListener('click',()=>{
    const xyz=cellAt(index),placed=fixture.get(...xyz)===asset.id;
    const result=placed?fixture.remove(...xyz):fixture.place(...xyz,asset.id,{rotation:rotations.get(asset.id)});
    refresh(result.ok?(placed?'Removed ':'Placed ')+asset.name:'Fixture rejected: '+result.reason);
  });
  const rotate=document.createElement('button');rotate.type='button';
  rotate.addEventListener('click',()=>{
    const r=(rotations.get(asset.id)+1)%4;rotations.set(asset.id,r);
    const xyz=cellAt(index);
    if(fixture.get(...xyz)===asset.id){
      fixture.remove(...xyz);fixture.place(...xyz,asset.id,{rotation:r});
    }
    refresh(asset.name+' rotated '+r*90+'° (rotation save remains engine-blocked).');
  });
  function probe(x,z){
    const xyz=cellAt(index),placed=fixture.get(...xyz)===asset.id;
    const point=[(x+.5)/12,sectionHeight.get(asset.id),(z+.5)/12];
    const hit=placed?fixture.probe(...xyz,point):null;
    const solid=placed?fixture.probe(...xyz,point,'collision'):null;
    refresh(!placed?'Place this specimen first.':
      (hit?'TARGETABLE: ':'EMPTY: ')+asset.name+
      ' at '+point.map(x=>x.toFixed(2)).join(',')+
      (solid?' / collision':' / passable'));
  }
  slice.addEventListener('click',ev=>{
    const rect=slice.getBoundingClientRect();
    const x=Math.min(11,Math.max(0,Math.floor((ev.clientX-rect.left)*12/rect.width)));
    const z=Math.min(11,Math.max(0,Math.floor((ev.clientY-rect.top)*12/rect.height)));
    probe(x,z);
  });
  slice.addEventListener('keydown',e=>{
    if(e.key===' '||e.key==='Enter'){e.preventDefault();probe(6,6);}
  });
  card.append(header,canvas,desc,meta,slice,place,rotate);grid.append(card);
  cards.set(asset.id,{card,canvas,slice,place,rotate});
}
document.querySelector('#all').addEventListener('click',()=>{
  fixture=createFloralFixture();
  FLORAL_CANDIDATES.forEach((x,i)=>{rotations.set(x.id,0);fixture.place(...cellAt(i),x.id);});
  refresh('All seven physical candidates placed in isolated test cells.');
});
document.querySelector('#clear').addEventListener('click',()=>{
  fixture=createFloralFixture();refresh('Removed all fixture specimens.');
});
document.querySelector('#save').addEventListener('click',()=>{
  try{fixture=restoreFloralFixture(JSON.parse(JSON.stringify(fixture.save())));
    refresh('PASS: canonical schema-1-shaped fixture save and restore.');}
  catch(e){refresh('EXPECTED SAVE BLOCKER: '+e.message);}
});
refresh('Gallery ready: seven distinct physical, removable flower/mushroom candidates.');
