// Roadmap C source-only topological acceptance for future fortifications.
// This module reads actual authored voxel cells. It neither registers nor places buildings.
const goodInt=n=>Number.isSafeInteger(n);
const key=(x,y,z)=>x+','+y+','+z;
const ground=(x,z)=>x+','+z;
function must(ok,why){if(!ok)throw new Error('Roadmap C source topology: '+why);}
function source(b){
 must(b&&Array.isArray(b.modules)&&b.envelope,'blueprint geometry missing');
 const out=new Map(),e=b.envelope;
 for(const m of b.modules){
  must(typeof m.role==='string'&&Array.isArray(m.cells),'source module malformed');
  for(const cell of m.cells){
   must(Array.isArray(cell)&&cell.length===4&&cell.slice(0,3).every(goodInt),'non-integer source voxel');
   const [x,y,z]=cell;
   must(x>=e.x&&x<e.x+e.width&&y>=e.y&&y<e.y+e.height&&z>=e.z&&z<e.z+e.depth,'source voxel outside envelope');
   must(!out.has(key(x,y,z)),'overlapping source voxels');
   out.set(key(x,y,z),m.role);
  }
 }
 return {out,has:(x,y,z)=>out.has(key(x,y,z)),role:(x,y,z)=>out.get(key(x,y,z))};
}
function requirePassage(b,geo,p,{floorRequired=false}={}){
 must(p&&['x','z'].includes(p.axis)&&goodInt(p.floorY)&&p.width>=2&&goodInt(p.width)&&goodInt(p.height)&&p.height>=3,'physical passage minimum 2 wide by 3 high');
 must(Array.isArray(p.points)&&p.points.length>=3,'passage route is missing actual coordinates');
 const cells=new Set();
 let prior=null;
 for(const item of p.points){
  must(Array.isArray(item)&&item.length===2&&item.every(goodInt),'passage point is not an integral source coordinate');
  const [x,z]=item;
  if(prior){
   const dx=x-prior[0],dz=z-prior[1];
   must(p.axis==='z'?dx===0&&Math.abs(dz)===1:dz===0&&Math.abs(dx)===1,'passage has a gap or off-axis turn');
  }
  for(let w=0;w<p.width;w++){
   const xx=x+(p.axis==='z'?w:0),zz=z+(p.axis==='x'?w:0);
   must(xx>=b.envelope.x&&xx<b.envelope.x+b.envelope.width&&zz>=b.envelope.z&&zz<b.envelope.z+b.envelope.depth,'passage outside actual source envelope');
   for(let y=p.floorY;y<p.floorY+p.height;y++)
    must(!geo.has(xx,y,zz),'blocked physical gateway at '+key(xx,y,zz));
   if(floorRequired)must(geo.has(xx,p.floorY-1,zz),'gateway lacks a physical continuous walking floor');
   cells.add(ground(xx,zz));
  }
  prior=item;
 }
 return cells;
}
function posts(geo,p,at,maxY,minY){
 const [x,z]=at;
 const left=p.axis==='z'?[x-1,z]:[x,z-1];
 const right=p.axis==='z'?[x+p.width,z]:[x,z+p.width];
 for(const [xx,zz] of [left,right]){
  for(let y=minY;y<=maxY;y++)
   must(geo.has(xx,y,zz),'unanchored physical gate flanking post at '+key(xx,y,zz));
  must(['wall','foundation','floor','rampart','battlement','support'].includes(geo.role(xx,p.floorY+1,zz)),
   'gateway flank is not an actual structural wall');
 }
}
function oppositeOpenings(b,p){
 const faces=p.axis==='z'?['north','south']:['west','east'];
 const op=(b.openings||[]).filter(o=>faces.includes(o.facing)&&o.width>=p.width&&o.height>=p.height&&o.y===p.floorY);
 must(op.some(o=>o.facing===faces[0]&&o.x===p.points[0][0]&&o.z===p.points[0][1]),'passage start has no aligned exterior opening');
 const last=p.points.at(-1);
 must(op.some(o=>o.facing===faces[1]&&o.x===last[0]&&o.z===last[1]),'passage exit has no oppositely oriented exterior opening');
}
export function validateGatehouseTopology(b){
 must(b?.type==='gatehouse','not a gatehouse source blueprint');
 const geo=source(b),p=b.fortification?.gateRoute;
 const cells=requirePassage(b,geo,p,{floorRequired:true});
 oppositeOpenings(b,p);
 const middle=p.points[Math.floor(p.points.length/2)];
 posts(geo,p,middle,p.floorY+p.height,b.envelope.y);
 for(let w=0;w<p.width;w++){
  const x=middle[0]+(p.axis==='z'?w:0),z=middle[1]+(p.axis==='x'?w:0);
  must(geo.has(x,p.floorY+p.height,z),'missing physical overhead arch / lintel');
 }
 must((b.navigation?.edges||[]).some(e=>e.kind==='stair')&&
   (b.modules||[]).some(m=>m.role==='stair'),'no physically authored rampart access');
 must((b.spaces||[]).some(s=>s.kind==='gateway'),'gateway room is not source-reserved');
 return Object.freeze({id:b.id,clearCells:cells.size,routeSteps:p.points.length,sourceVoxels:geo.out.size,oppositeAccess:true});
}
function perimeter(path){
 must(Array.isArray(path)&&path.length>=5,'perimeter has fewer than four corners');
 must(path.every(p=>Array.isArray(p)&&p.length===2&&p.every(goodInt)),'perimeter has non-integer vertex');
 must(path[0][0]===path.at(-1)[0]&&path[0][1]===path.at(-1)[1],'perimeter does not close');
 const raster=[];
 for(let i=1;i<path.length;i++){
  const [x,z]=path[i-1],[xx,zz]=path[i],dx=Math.sign(xx-x),dz=Math.sign(zz-z);
  must((dx===0)!==(dz===0),'perimeter includes a diagonal or zero-length segment');
  const distance=Math.abs(xx-x)+Math.abs(zz-z);
  for(let t=0;t<distance;t++)raster.push([x+dx*t,z+dz*t]);
 }
 must(raster.length>=12&&new Set(raster.map(p=>ground(...p))).size===raster.length,'perimeter crosses itself or duplicates a section');
 // A complete non-branching ring must have exactly two cardinal neighbors at every cell.
 const occupied=new Set(raster.map(p=>ground(...p)));
 for(const [x,z] of raster){
  const degree=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]]
   .filter(p=>occupied.has(ground(...p))).length;
  must(degree===2,'perimeter intersection, disconnected join or ornamental tower at '+ground(x,z));
 }
 return raster;
}
export function validateCityWallTopology(b){
 must(b?.type==='city-wall','not a city-wall source blueprint');
 const geo=source(b),wall=b.fortification;
 const ring=perimeter(wall?.wallPath);
 must(Array.isArray(wall?.rampartRoute)&&wall.rampartRoute.length===ring.length,'source rampart route is not a complete perimeter');
 const gates=wall.gatePassages;
 must(Array.isArray(gates)&&gates.length>0,'no actual gatehouse passage in closed city wall');
 const underGate=new Set();
 for(const p of gates){
  const passage=requirePassage(b,geo,p);
  const crossings=[...passage].filter(c=>ring.some(q=>ground(...q)===c));
  must(crossings.length>=p.width,'gate does not actually cross the wall source line');
  const cross=p.points.find(q=>ring.some(point=>ground(...point)===ground(...q)));
  must(cross,'gate crossing lacks source-backed connection');
  posts(geo,p,cross,p.floorY+p.height,b.envelope.y);
  for(const k of crossings)underGate.add(k);
 }
 const gateRingCount=underGate.size;
 let prior=null,walkYmin=Infinity,walkYmax=-Infinity;
 for(let i=0;i<ring.length;i++){
  const p=wall.rampartRoute[i];
  must(Array.isArray(p)&&p.length===3&&p.every(goodInt),'invalid physical rampart access point');
  const [x,y,z]=p,[rx,rz]=ring[i];
  must(x===rx&&z===rz,'rampart metadata does not match the actual closed wall segment');
  must(y>=b.envelope.y+4,'rampart too low for a defensible passable wall');
  must(geo.has(x,y-1,z)&&!geo.has(x,y,z)&&!geo.has(x,y+1,z),'rampart not physically walkable with two-high headroom');
  must(['rampart','roof','floor','battlement'].includes(geo.role(x,y-1,z)),'rampart is supported by the wrong source geometry');
  const gate=underGate.has(ground(x,z));
  if(!gate)for(let supportY=b.envelope.y;supportY<y;supportY++)
   must(geo.has(x,supportY,z),'wall segment lacks true foundation-to-rampart continuity at '+ground(x,z));
  else must(geo.has(x,y-2,z),'gatehouse upper bridge lacks real arch beneath rampart');
  if(prior)must(Math.abs(y-prior[1])<=1,'rampart steps between connected sections exceed one voxel');
  prior=p;walkYmin=Math.min(walkYmin,y);walkYmax=Math.max(walkYmax,y);
 }
 must(Math.abs(wall.rampartRoute.at(-1)[1]-wall.rampartRoute[0][1])<=1,'rampart loop elevation fails to reconnect');
 must((b.navigation?.edges||[]).some(e=>e.kind==='stair')&&
   (b.modules||[]).some(m=>m.role==='stair'),'city wall lacks physically authored rampart access');
 must((b.spaces||[]).some(s=>s.kind==='battlement')&&
   (b.spaces||[]).some(s=>s.kind==='wall-run'),'city-wall battlement and wall-run are not declared');
 return Object.freeze({id:b.id,perimeterCells:ring.length,physicalRampartCells:wall.rampartRoute.length,gateCrossingCells:gateRingCount,sourceVoxels:geo.out.size,elevationRange:[walkYmin,walkYmax],closed:true});
}
