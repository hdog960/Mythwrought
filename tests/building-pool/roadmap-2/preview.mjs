import {TEMPERATE_SMALL_GENERAL_STORE as bp} from "../../../src/building-pool/roadmap-2/temperate-store.mjs";
const palette={foundation:"#7d746a",floor:"#a07c54",wall:"#d1bba1",roof:"#705956",window:"#68bdc4",fixture:"#b88950",decor:"#c6a55f"};
const tone=(hex,k)=>"rgb("+[0,2,4].map(i=>Math.min(255,Math.round(parseInt(hex.slice(i+1,i+3),16)*k))).join(",")+")";
function paint(id,cut){
 const el=document.getElementById(id),W=el.clientWidth,H=el.clientHeight;
 el.width=Math.floor(W*devicePixelRatio);el.height=Math.floor(H*devicePixelRatio);
 const ctx=el.getContext("2d");ctx.scale(devicePixelRatio,devicePixelRatio);
 ctx.fillStyle="#243039";ctx.fillRect(0,0,W,H);
 const tw=Math.min((W-20)/15,(H-12)/11)*1.5,th=tw*.55;
 const p=(x,y,z)=>({x:W/2+(x-z)*tw/2,y:H*.56+(x+z)*th/2-y*th});
 const face=(v,c)=>{ctx.beginPath();ctx.moveTo(v[0].x,v[0].y);for(let i=1;i<v.length;i++)ctx.lineTo(v[i].x,v[i].y);ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.strokeStyle="rgba(0,0,0,.16)";ctx.lineWidth=.3;ctx.stroke();};
 const blocks=bp.voxels.filter(v=>!cut||(v.kind!=="roof"&&(v.z>0||v.y<=1)&&(v.x>0||v.y<=1)&&(v.z<10||v.y<4)));
 blocks.sort((a,b)=>(a.x+a.z+a.y)-(b.x+b.z+b.y)||a.y-b.y);
 for(const b of blocks){
  const {x,y,z}=b,base=palette[b.kind]||"#aaaaaa";
  face([p(x,y,z+1),p(x+1,y,z+1),p(x+1,y+1,z+1),p(x,y+1,z+1)],tone(base,.73));
  face([p(x+1,y,z),p(x+1,y,z+1),p(x+1,y+1,z+1),p(x+1,y+1,z)],tone(base,.88));
  face([p(x,y+1,z),p(x+1,y+1,z),p(x+1,y+1,z+1),p(x,y+1,z+1)],tone(base,1.14));
 }
 if(cut){ctx.font="bold 11px system-ui";ctx.fillStyle="#ffe8ad";ctx.fillText("STOCKROOM",8,18);ctx.fillText("SALES FLOOR",8,H-12);}
}
paint("external",false);paint("inside",true);
document.getElementById("status").textContent=bp.voxels.length+" conceptual xyz cells · two rooms · symbolic assets · Canvas2D, NOT game WebGL2";
document.documentElement.dataset.ready="true";
