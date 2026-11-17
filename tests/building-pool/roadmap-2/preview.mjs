import {TEMPERATE_SMALL_GENERAL_STORE as bp} from "../../../src/building-pool/roadmap-2/temperate-store.mjs";
const palette={foundation:"#7a7167",floor:"#b69571",wall:"#c6ad8f",roof:"#6d5150",window:"#5cbed0",fixture:"#bd8e51",decor:"#c7a75c"};
const tint=(hex,f)=>"rgb("+[0,2,4].map(i=>Math.min(255,Math.round(parseInt(hex.slice(1+i,3+i),16)*f))).join(",")+")";
function draw(id,cut){
 const el=document.getElementById(id),w=el.clientWidth,h=el.clientHeight,dpr=window.devicePixelRatio||1;
 el.width=Math.round(w*dpr);el.height=Math.round(h*dpr);
 const c=el.getContext("2d");c.setTransform(dpr,0,0,dpr,0,0);
 c.fillStyle="#22303a";c.fillRect(0,0,w,h);
 const cells=bp.voxels.filter(v=>!cut||(
   v.kind!=="roof"&&(v.z>0||v.y<=1)&&(v.x<12||v.y<=1)));
 const exists=new Set(cells.map(v=>[v.x,v.y,v.z].join(",")));
 // Face the SOUTH storefront (z=0), unlike the former north-facing camera.
 const raw=(x,y,z)=>({x:(x+z)*.5,y:(x-z)*.28-y*.55});
 let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
 for(const v of cells)for(const dx of [0,1])for(const dy of [0,1])for(const dz of [0,1]){
   const p=raw(v.x+dx,v.y+dy,v.z+dz);
   minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
 }
 const spanX=maxX-minX,spanY=maxY-minY;
 const scale=Math.min((w-20)/spanX,(h-24)/spanY);
 const p=(x,y,z)=>{const v=raw(x,y,z);return {x:w/2+(v.x-(maxX+minX)/2)*scale,y:h/2+(v.y-(maxY+minY)/2)*scale};};
 const face=(arr,color)=>{c.beginPath();c.moveTo(arr[0].x,arr[0].y);for(const v of arr.slice(1))c.lineTo(v.x,v.y);c.closePath();c.fillStyle=color;c.fill();c.lineWidth=.42;c.strokeStyle="rgba(15,19,20,.22)";c.stroke();};
 cells.sort((a,b)=>(a.x-a.z+a.y)-(b.x-b.z+b.y)||a.y-b.y);
 for(const {x,y,z,kind} of cells){
   const base=palette[kind]||"#c1ad94";
   if(!exists.has([x,y,z-1].join(",")))face([p(x,y,z),p(x+1,y,z),p(x+1,y+1,z),p(x,y+1,z)],tint(base,.82));
   if(!exists.has([x+1,y,z].join(",")))face([p(x+1,y,z),p(x+1,y,z+1),p(x+1,y+1,z+1),p(x+1,y+1,z)],tint(base,.7));
   if(!exists.has([x,y+1,z].join(",")))face([p(x,y+1,z),p(x+1,y+1,z),p(x+1,y+1,z+1),p(x,y+1,z+1)],tint(base,1.16));
 }
 if(cut){
   c.fillStyle="rgba(19,25,28,.72)";c.fillRect(5,6,151,18);
   c.font="bold 10px system-ui";c.fillStyle="#ffe4a1";c.fillText("SALES + REAR STOCKROOM",11,18);
 }
}
draw("external",false);draw("inside",true);
document.getElementById("status").textContent=bp.voxels.length+" authored xyz cells · two rooms · symbolic assets · conceptual Canvas2D preview (not game WebGL2)";
document.documentElement.dataset.ready="true";
