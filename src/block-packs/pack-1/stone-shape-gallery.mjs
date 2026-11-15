import {STONE_SHAPES,stoneShapeDescriptor,stoneShapeTexture} from './stone-shapes.mjs';
import {createStoneShapeFixture,restoreStoneShapeFixture} from './stone-shape-fixture.mjs';

const grid=document.querySelector('#grid'),output=document.querySelector('#status');
const state=new Map(),cards=new Map(),tileCache=new Map();
let fixture=createStoneShapeFixture(179);
const cellFor=i=>[i*2,3,0];
const project=(x,y,z)=>[125+(x-z)*71,140+(x+z)*30-y*93];

function tile(id,face){
  const key=id+':'+face;
  if(tileCache.has(key))return tileCache.get(key);
  const source=stoneShapeTexture(id,face,32);
  const canvas=document.createElement('canvas');canvas.width=32;canvas.height=32;
  const ctx=canvas.getContext('2d');
  ctx.putImageData(new ImageData(new Uint8ClampedArray(source.pixels),32,32),0,0);
  tileCache.set(key,canvas);return canvas;
}
function face(ctx,id,kind,origin,u,v,depth){
  const a=project(...origin);
  const b=project(...u);
  const c=project(...v);
  return {depth,draw(){
    ctx.save();
    ctx.setTransform((b[0]-a[0])/32,(b[1]-a[1])/32,
      (c[0]-a[0])/32,(c[1]-a[1])/32,a[0],a[1]);
    ctx.imageSmoothingEnabled=false;
    ctx.drawImage(tile(id,kind),0,0,32,32);
    ctx.restore();
    const d=[b[0]+c[0]-a[0],b[1]+c[1]-a[1]];
    ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.lineTo(...d);
    ctx.lineTo(...c);ctx.closePath();
    ctx.strokeStyle='rgba(18,30,36,.68)';ctx.lineWidth=1;ctx.stroke();
  }};
}
function draw(id,canvas,rotation,variant,placed){
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,250,206);
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(125,177,74,12,0,0,Math.PI*2);ctx.fill();
  const geometry=stoneShapeDescriptor(id,{rotation,variant});
  const faces=[];
  for(const [x,y,z,X,Y,Z] of geometry.boxes){
    // The canvas previews only the three camera-facing surface directions.
    const d=(x+X+z+Z)/4;
    faces.push(face(ctx,id,'east',[X,y,z],[X,y,Z],[X,Y,z],d+.1));
    faces.push(face(ctx,id,'south',[x,y,Z],[X,y,Z],[x,Y,Z],d+.2));
    faces.push(face(ctx,id,'top',[x,Y,z],[X,Y,z],[x,Y,Z],d+.4));
  }
  faces.sort((a,b)=>a.depth-b.depth);
  faces.forEach(f=>f.draw());
  ctx.fillStyle=placed?'#f0c982':'#c9dedb';
  ctx.font='bold 13px monospace';ctx.fillText('ID '+id,8,17);
  ctx.font='12px monospace';ctx.fillText('rot '+rotation*90+'°'+(variant==='upper'?' upper':''),8,196);
  if(placed){ctx.strokeStyle='#ecc478';ctx.lineWidth=1.5;ctx.strokeRect(1,1,248,204);}
}
function refresh(message=''){
  for(const [id,card] of cards){
    const idx=STONE_SHAPES.findIndex(s=>s.id===id),cell=cellFor(idx);
    const option=state.get(id),active=fixture.get(...cell)===id;
    card.root.classList.toggle('active',active);
    draw(id,card.canvas,option.rotation,option.variant,active);
    card.action.textContent=active?'Remove physical cell':'Place physical cell';
    card.orientation.textContent='Rotate 90° ('+option.rotation*90+'°)';
    if(card.variant)card.variant.textContent='Variant: '+option.variant;
  }
  let saveState='';
  try{const save=fixture.save();saveState='schema-1 fixture edits: '+save.edits.length;}
  catch(e){saveState='schema-1 save blocked (rotated/upper preview): '+e.message;}
  output.textContent=(message?message+'\n':'')+'Physically placed test cells: '+fixture.size+
    '\n'+saveState+'\nWorld, live renderer, production block IDs and real player saves: UNCHANGED.';
}
function replaceIfPlaced(id){
  const idx=STONE_SHAPES.findIndex(s=>s.id===id),cell=cellFor(idx);
  if(fixture.get(...cell)!==id)return;
  fixture.remove(...cell);fixture.place(...cell,id,state.get(id));
}
for(const [idx,asset] of STONE_SHAPES.entries()){
  state.set(asset.id,{rotation:0,variant:'lower'});
  const root=document.createElement('section');root.className='card';
  const canvas=document.createElement('canvas');canvas.width=250;canvas.height=206;
  canvas.setAttribute('aria-label',asset.name+' partial-volume geometry preview');
  canvas.setAttribute('role','img');
  const title=document.createElement('h2');title.textContent=asset.name;
  const desc=document.createElement('p');desc.textContent=asset.appearance;
  const action=document.createElement('button');action.type='button';
  action.addEventListener('click',()=>{
    const cell=cellFor(idx);
    const active=fixture.get(...cell)===asset.id;
    const result=active?fixture.remove(...cell):fixture.place(...cell,asset.id,state.get(asset.id));
    refresh(result.ok?'Physical test cell '+(active?'removed':'placed')+' — '+asset.name:'Blocked: '+result.reason);
  });
  const orientation=document.createElement('button');orientation.type='button';
  orientation.addEventListener('click',()=>{
    const s=state.get(asset.id);s.rotation=(s.rotation+1)%4;
    replaceIfPlaced(asset.id);
    refresh(asset.name+' geometry rotated. Nonzero orientation is NOT safe for production schema-1 serialization.');
  });
  const variant=['slab','stairs'].includes(asset.kind)?document.createElement('button'):null;
  if(variant){
    variant.type='button';
    variant.addEventListener('click',()=>{
      const s=state.get(asset.id);s.variant=s.variant==='lower'?'upper':'lower';
      replaceIfPlaced(asset.id);
      refresh(asset.name+' '+s.variant+' variant previewed; upper variants require engine state support.');
    });
  }
  root.append(canvas,title,desc,action,orientation);
  if(variant)root.append(variant);
  grid.append(root);cards.set(asset.id,{root,canvas,action,orientation,variant});
}
document.querySelector('#place-all').addEventListener('click',()=>{
  fixture=createStoneShapeFixture();
  for(const [idx,asset] of STONE_SHAPES.entries()){
    state.set(asset.id,{rotation:0,variant:'lower'});
    fixture.place(...cellFor(idx),asset.id);
  }
  refresh('Six independently selectable and removable canonical physical fixtures placed.');
});
document.querySelector('#clear-all').addEventListener('click',()=>{
  fixture=createStoneShapeFixture();refresh('Isolated fixture cleared.');
});
document.querySelector('#save-check').addEventListener('click',()=>{
  try{fixture=restoreStoneShapeFixture(JSON.parse(JSON.stringify(fixture.save())));
    refresh('PASS: canonical schema-1-shaped fixture save and restore.');
  }catch(e){refresh('EXPECTED BLOCKER: '+e.message);}
});
refresh('Gallery ready. Rotate, inspect, and place or remove each candidate cell.');
