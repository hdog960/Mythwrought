// Authored candidate gallery only. Renders from the SAME boxes used in collision/targeting.
// Uses browser Canvas2D and isolated fixture; no game imports or world mutations.
import {GARDEN_COMPONENTS,gardenDescriptor,gardenTexture,gardenOccupies} from './garden-components.mjs';
import {createGardenFixture,restoreGardenFixture} from './garden-fixture.mjs';
const grid=document.querySelector('#grid');
const output=document.querySelector('#status');
let fixture=createGardenFixture(179);
const state=new Map(),cards=new Map(),tiles=new Map();
const cellAt=index=>[index*2,3,0];
const sliceY=new Map([[21,.76],[22,.51],[23,.49]]);
function texture(id,role,face){
  const key=id+':'+role+':'+face;
  if(tiles.has(key))return tiles.get(key);
  const tile=gardenTexture(id,face,24,role);
  const canvas=document.createElement('canvas');canvas.width=tile.width;canvas.height=tile.height;
  canvas.getContext('2d').putImageData(new ImageData(
    new Uint8ClampedArray(tile.pixels),tile.width,tile.height),0,0);
  tiles.set(key,canvas);return canvas;
}
const proj=(x,y,z)=>[132+(x-z)*78,152+(x+z)*34-y*107];
function drawFace(ctx,id,role,side,origin,u,v,depth){
  const p=proj(...origin),q=proj(...u),r=proj(...v);
  return {depth,paint(){
    ctx.save();ctx.imageSmoothingEnabled=false;
    ctx.setTransform((q[0]-p[0])/24,(q[1]-p[1])/24,
      (r[0]-p[0])/24,(r[1]-p[1])/24,p[0],p[1]);
    ctx.drawImage(texture(id,role,side),0,0,24,24);ctx.restore();
    const last=[q[0]+r[0]-p[0],q[1]+r[1]-p[1]];
    ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.lineTo(...last);
    ctx.lineTo(...r);ctx.closePath();
    ctx.strokeStyle='rgba(18,26,29,.67)';ctx.lineWidth=.85;ctx.stroke();
  }};
}
function paintVolume(id,canvas,rotation,placed){
  const ctx=canvas.getContext('2d');ctx.clearRect(0,0,264,220);
  ctx.fillStyle='rgba(0,0,0,.27)';
  ctx.beginPath();ctx.ellipse(132,185,83,13,0,0,Math.PI*2);ctx.fill();
  const descriptor=gardenDescriptor(id,{rotation}),faces=[];
  for(const part of descriptor.parts){
    const [x,y,z,X,Y,Z]=part.box;
    const depth=(x+X+z+Z)/4;
    faces.push(drawFace(ctx,id,part.role,'east',[X,y,z],[X,y,Z],[X,Y,z],depth+.11));
    faces.push(drawFace(ctx,id,part.role,'south',[x,y,Z],[X,y,Z],[x,Y,Z],depth+.17));
    faces.push(drawFace(ctx,id,part.role,'top',[x,Y,z],[X,Y,z],[x,Y,Z],depth+.32));
  }
  faces.sort((a,b)=>a.depth-b.depth);
  for(const face of faces)face.paint();
  ctx.fillStyle=placed?'#ffd68c':'#d5e3d5';
  ctx.font='bold 13px monospace';ctx.fillText('ID '+id,8,18);
  ctx.font='12px monospace';ctx.fillText(rotation*90+'°',222,18);
  if(placed){ctx.strokeStyle='#e9c986';ctx.lineWidth=1.5;ctx.strokeRect(1,1,262,218);}
}
function paintSlice(id,canvas,rotation){
  const ctx=canvas.getContext('2d'),N=12;
  ctx.clearRect(0,0,144,144);
  for(let z=0;z<N;z++)for(let x=0;x<N;x++){
    const occupied=gardenOccupies(id,[(x+.5)/N,sliceY.get(id),(z+.5)/N],{rotation});
    ctx.fillStyle=occupied?((x+z)&1?'#bf985e':'#d9b077'):'#122932';
    ctx.fillRect(x*12,z*12,12,12);
    ctx.strokeStyle='rgba(228,225,202,.12)';
    ctx.strokeRect(x*12+.5,z*12+.5,11,11);
  }
}
function refresh(message=''){
  for(const [id,c] of cards){
    const rotation=state.get(id),i=GARDEN_COMPONENTS.findIndex(a=>a.id===id);
    const placed=fixture.get(...cellAt(i))===id;
    c.card.classList.toggle('placed',placed);
    paintVolume(id,c.preview,rotation,placed);
    paintSlice(id,c.slice,rotation);
    c.place.textContent=placed?'Remove physical cell':'Place physical cell';
    c.rotate.textContent='Rotate ('+rotation*90+'°)';
  }
  let saveInfo;
  try{saveInfo='Canonical fixture edits: '+fixture.save().edits.length;}
  catch(error){saveInfo='Save blocked by engine dependency: '+error.message;}
  output.textContent=(message?message+'\n':'')+
    'Independent placed voxel cells: '+fixture.size+'\n'+saveInfo+
    '\nCurrent game, block registry, seeds and player saves: UNCHANGED.';
}
function alterOrientation(id){
  const i=GARDEN_COMPONENTS.findIndex(x=>x.id===id),pos=cellAt(i);
  const next=(state.get(id)+1)%4;
  state.set(id,next);
  if(fixture.get(...pos)===id){
    fixture.remove(...pos);fixture.place(...pos,id,{rotation:next});
  }
  refresh('Rotated '+id+' to '+(next*90)+'°. Noncanonical rotations are not production-save-compatible.');
}
for(const [i,item] of GARDEN_COMPONENTS.entries()){
  state.set(item.id,0);
  const card=document.createElement('section');card.className='card';
  const title=document.createElement('h2');title.textContent=item.name;
  const info=document.createElement('p');info.textContent=item.appearance;info.className='desc';
  const preview=document.createElement('canvas');preview.width=264;preview.height=220;
  preview.className='preview';preview.setAttribute('role','img');
  preview.setAttribute('aria-label',item.name+' shown with its physical box components');
  const label=document.createElement('p');label.className='tiny';
  label.textContent='Physical cross-section at y='+sliceY.get(item.id);
  const slice=document.createElement('canvas');slice.width=144;slice.height=144;
  slice.tabIndex=0;slice.className='slice';slice.setAttribute('role','button');
  slice.setAttribute('aria-label',item.name+' selectable cross-section probe');
  const place=document.createElement('button');place.type='button';
  place.addEventListener('click',()=>{
    const pos=cellAt(i),active=fixture.get(...pos)===item.id;
    const result=active?fixture.remove(...pos):fixture.place(...pos,item.id,{rotation:state.get(item.id)});
    refresh(result.ok?(active?'Removed ':'Placed ')+item.name:'Placement rejected: '+result.reason);
  });
  const rotate=document.createElement('button');rotate.type='button';
  rotate.addEventListener('click',()=>alterOrientation(item.id));
  const probe=(x,z)=>{
    const pos=cellAt(i);
    const active=fixture.get(...pos)===item.id;
    const point=[(x+.5)/12,sliceY.get(item.id),(z+.5)/12];
    const cell=active?fixture.probe(...pos,point):null;
    refresh(!active?'Place the physical test cell before probing.':
      (cell?'SOLID: targetable piece ID ':'EMPTY: real air in piece ID ')+item.id+
      ' at local '+point.map(v=>v.toFixed(2)).join(', '));
  };
  slice.addEventListener('click',ev=>{
    const rect=slice.getBoundingClientRect();
    const x=Math.max(0,Math.min(11,Math.floor((ev.clientX-rect.left)*12/rect.width)));
    const z=Math.max(0,Math.min(11,Math.floor((ev.clientY-rect.top)*12/rect.height)));
    probe(x,z);
  });
  slice.addEventListener('keydown',e=>{
    if(e.key==='Enter'||e.key===' '){e.preventDefault();probe(6,6);}
  });
  card.append(title,preview,info,label,slice,place,rotate);
  grid.append(card);cards.set(item.id,{card,preview,slice,place,rotate});
}
document.querySelector('#all').addEventListener('click',()=>{
  fixture=createGardenFixture(179);
  GARDEN_COMPONENTS.forEach((a,i)=>{state.set(a.id,0);fixture.place(...cellAt(i),a.id);});
  refresh('Three canonical physical garden pieces placed in independent fixture cells.');
});
document.querySelector('#clear').addEventListener('click',()=>{
  fixture=createGardenFixture(179);refresh('Garden fixture cleared; no game-world effect.');
});
document.querySelector('#save').addEventListener('click',()=>{
  try{fixture=restoreGardenFixture(JSON.parse(JSON.stringify(fixture.save())));
    refresh('PASS: isolated schema-1-shaped canonical save/restore.');
  }catch(error){refresh('BLOCKED (safe by design): '+error.message);}
});
refresh('Ready. The gold cross-section squares are real occupied regions.');
