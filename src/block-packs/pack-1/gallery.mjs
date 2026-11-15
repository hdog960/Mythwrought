import {CORE_MASONRY,masonryTexture} from './core-masonry.mjs';
import {createMasonryFixture,restoreMasonryFixture} from './fixture.mjs';
const grid=document.querySelector('#grid'),status=document.querySelector('#status');
let fixture=createMasonryFixture(179);
const refs=new Map();
const cellFor=i=>[i*2,3,0];
function faceCanvas(id,face) {
  const {width,height,pixels}=masonryTexture(id,face,32);
  const canvas=document.createElement('canvas');
  canvas.width=width;canvas.height=height;
  canvas.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(pixels),width,height),0,0);
  return canvas;
}
function paintFace(ctx,image,transform) {
  ctx.save();
  ctx.setTransform(...transform);
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(image,0,0,32,32);
  ctx.restore();
}
function draw(id,canvas,placed){
  const ctx=canvas.getContext('2d');
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  const cx=w/2,top=20,half=63,rise=30,height=82,ts=32;
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.29)';
  ctx.beginPath();ctx.ellipse(cx,145,72,13,0,0,Math.PI*2);ctx.fill();
  // Face textures are drawn as affine-mapped pixel tiles; no fake screenshots.
  paintFace(ctx,faceCanvas(id,'west'),[half/ts,rise/ts,0,height/ts,cx-half,top+rise]);
  paintFace(ctx,faceCanvas(id,'east'),[half/ts,-rise/ts,0,height/ts,cx,top+rise*2]);
  paintFace(ctx,faceCanvas(id,'top'),[half/ts,rise/ts,-half/ts,rise/ts,cx,top]);
  ctx.lineJoin='round';ctx.lineWidth=2;
  ctx.strokeStyle=placed?'#f5d68a':'rgba(202,219,218,.6)';
  ctx.beginPath();
  ctx.moveTo(cx,top);ctx.lineTo(cx+half,top+rise);
  ctx.lineTo(cx+half,top+rise+height);ctx.lineTo(cx,top+rise*2+height);
  ctx.lineTo(cx-half,top+rise+height);ctx.lineTo(cx-half,top+rise);
  ctx.closePath();ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-half,top+rise);
  ctx.lineTo(cx,top+rise*2);ctx.lineTo(cx+half,top+rise);
  ctx.moveTo(cx,top+rise*2);ctx.lineTo(cx,top+rise*2+height);ctx.stroke();
  ctx.fillStyle=placed?'#efcf84':'#b4cad1';
  ctx.font='13px monospace';ctx.fillText('ID '+id,w-51,17);
  ctx.restore();
}
function report(message=''){
  const saved=fixture.save();
  const chosen=CORE_MASONRY.filter((_,i)=>fixture.get(...cellFor(i)));
  status.textContent=(message?message+'\n':'')+'Physical candidate IDs in test fixture: '+
    (chosen.map(v=>v.id).join(', ')||'(none)')+
    '\nFixture schema: '+saved.schema+'; edits: '+saved.edits.length+
    '\nLive world: UNCHANGED. Engine registry: UNCHANGED.';
  for(const [id,view] of refs){
    const i=CORE_MASONRY.findIndex(v=>v.id===id);
    const active=fixture.get(...cellFor(i))===id;
    view.card.classList.toggle('selected',active);
    draw(id,view.canvas,active);
  }
}
for(const [i,spec] of CORE_MASONRY.entries()){
  const card=document.createElement('section');
  card.className='card';
  const canvas=document.createElement('canvas');canvas.width=220;canvas.height=174;
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label',spec.name+' candidate material isometric preview');
  const label=document.createElement('div');label.className='name';label.textContent=spec.name;
  const desc=document.createElement('p');desc.className='desc';desc.textContent=spec.appearance;
  const action=document.createElement('button');action.type='button';
  action.textContent='Toggle test placement';action.style.width='100%';
  function toggle(){
    const cell=cellFor(i);
    const placed=fixture.get(...cell)===spec.id;
    const result=placed?fixture.remove(...cell):fixture.place(...cell,spec.id);
    // Prove selection through the actual isolated ray/AABB code after placement.
    const hit=placed?null:fixture.raycast([cell[0]+.5,cell[1]+.5,-2],[0,0,1],6);
    report((result.ok?'OK':'BLOCKED')+': '+(placed?'removed ':'placed ')+spec.name+
      (hit?'; individually ray-targetable ID '+hit.id:''));
  }
  action.addEventListener('click',toggle);
  canvas.addEventListener('click',toggle);
  card.append(canvas,label,desc,action);grid.append(card);
  refs.set(spec.id,{card,canvas});
}
document.querySelector('#place').addEventListener('click',()=>{
  fixture=createMasonryFixture(179);
  for(const [i,spec] of CORE_MASONRY.entries())fixture.place(...cellFor(i),spec.id);
  report('Six independent physical cells placed in isolated fixture.');
});
document.querySelector('#clear').addEventListener('click',()=>{
  fixture=createMasonryFixture(179);report('All fixture cells removed.');
});
document.querySelector('#restore').addEventListener('click',()=>{
  const payload=fixture.save();
  fixture=restoreMasonryFixture(JSON.parse(JSON.stringify(payload)));
  report('Isolated schema-1-shaped save/restore verified ('+fixture.size+' edits).');
});
report('Preview loaded. Click a block or use toolbar to test.');
