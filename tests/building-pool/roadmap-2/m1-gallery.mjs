import {M1_REPRESENTATIVES} from '../../../src/building-pool/roadmap-2/m1-representatives.mjs';
const ids=['category','biome','size'];
const colors={foundation:'#80776e',floor:'#bd956c',wall:'#cbaf90',roof:'#806358',window:'#68c7d5',fixture:'#c09458',decor:'#cfb368'};
const biomeColors={temperate:{wall:'#c4ad8f',roof:'#78544c',floor:'#ae865e'},desert:{wall:'#d3b989',roof:'#c1a36d',floor:'#d8c3a0'},snow:{wall:'#a7b9c4',roof:'#667585',floor:'#ad997f'},'enchanted-forest':{wall:'#718c72',roof:'#475f51',floor:'#9c7e5c'},mountain:{wall:'#969b9b',roof:'#747c82',floor:'#a38c72'}};
const tint=(hex,f)=>'rgb('+[1,3,5].map(i=>Math.min(255,Math.floor(parseInt(hex.slice(i,i+2),16)*f))).join(',')+')';
function render(bp,id,cutaway){
 const canvas=document.getElementById(id),w=canvas.clientWidth,h=canvas.clientHeight,dpr=window.devicePixelRatio||1;
 canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(h*dpr);
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.fillStyle='#21303b';ctx.fillRect(0,0,w,h);
 const cells=bp.voxels.filter(v=>!cutaway||(v.kind!=='roof'&&((v.z>0&&v.x<bp.extents.x-1)||v.y<=1)));
 const has=new Set(cells.map(v=>[v.x,v.y,v.z].join(',')));
 const raw=(x,y,z)=>({x:(x+z)*.5,y:(x-z)*.27-y*.56});
 let loX=Infinity,loY=Infinity,hiX=-Infinity,hiY=-Infinity;
 for(const v of cells)for(const a of [0,1])for(const b of [0,1])for(const c of [0,1]){
  const p=raw(v.x+a,v.y+b,v.z+c);loX=Math.min(loX,p.x);loY=Math.min(loY,p.y);hiX=Math.max(hiX,p.x);hiY=Math.max(hiY,p.y);
 }
 const scale=Math.min((w-24)/(hiX-loX),(h-20)/(hiY-loY));
 const p=(x,y,z)=>{const q=raw(x,y,z);return {x:w/2+(q.x-(hiX+loX)/2)*scale,y:h/2+(q.y-(hiY+loY)/2)*scale};};
 const paint=(vertices,fill)=>{ctx.beginPath();ctx.moveTo(vertices[0].x,vertices[0].y);for(const v of vertices.slice(1))ctx.lineTo(v.x,v.y);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='rgba(15,20,24,.2)';ctx.lineWidth=.4;ctx.stroke();};
 cells.sort((a,b)=>(a.x-a.z+a.y)-(b.x-b.z+b.y)||a.y-b.y);
 for(const {x,y,z,kind} of cells){
  const base=(biomeColors[bp.biome]||{})[kind]||colors[kind]||'#aaaaaa';
  if(!has.has([x,y,z-1].join(',')))paint([p(x,y,z),p(x+1,y,z),p(x+1,y+1,z),p(x,y+1,z)],tint(base,.84));
  if(!has.has([x+1,y,z].join(',')))paint([p(x+1,y,z),p(x+1,y,z+1),p(x+1,y+1,z+1),p(x+1,y+1,z)],tint(base,.7));
  if(!has.has([x,y+1,z].join(',')))paint([p(x,y+1,z),p(x+1,y+1,z),p(x+1,y+1,z+1),p(x,y+1,z+1)],tint(base,1.14));
 }
}
function refresh(){
 const [category,biome,size]=ids.map(id=>document.getElementById(id).value);
 const bp=M1_REPRESENTATIVES.find(b=>b.id===`r2:${category}:${biome}:${size}:01`);
 if(!bp)throw Error('No authored candidate for selection');
 render(bp,'external',false);render(bp,'interior',true);
 document.getElementById('status').textContent=`${bp.id} · ${bp.voxels.length} actual coordinate cells · ${bp.roof.form||'gable'} · 2 rooms · symbolic not in live world`;
 document.documentElement.dataset.ready=bp.id;
}
for(const id of ids)document.getElementById(id).addEventListener('change',refresh);
refresh();
