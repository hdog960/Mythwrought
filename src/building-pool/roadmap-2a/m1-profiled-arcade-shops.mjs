// Roadmap 2A M1: six original source-occupied split roofline marketplaces.
// These are theoretical drafts; no numeric registration, production edit, save or integration.
import {M1_PROFILED_ARCADE_SPECS} from './m1-profiled-arcade-specs.mjs';
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export {M1_PROFILED_ARCADE_SPECS};
const K=(x,y,z)=>x+','+y+','+z;
function roofHeight(style,x,z,[x0,x1,z0,z1]){
 const u=(x-x0)/Math.max(1,x1-x0),v=(z-z0)/Math.max(1,z1-z0);
 const crest=t=>Math.max(0,1-Math.abs(2*t-1));
 if(style==='sawtooth')return 8+Math.floor((z-z0)%7);
 if(style==='butterfly')return 7+Math.ceil(7*Math.abs(2*u-1));
 if(style==='barrel')return 7+Math.ceil(7*Math.sqrt(Math.max(0,1-(2*v-1)**2)));
 if(style==='wave')return 7+Math.ceil(5*(1+Math.sin(2.3*Math.PI*u+Math.PI*v))/2);
 if(style==='ogee')return 8+Math.ceil(7*crest(u)*crest(v));
 if(style==='crenellated')return 8+(((x+z)%5===0)?6:0);
 if(style==='ramp')return 8+Math.floor(6*u);
 if(style==='stepped-gable')return 8+Math.ceil(6*crest(u));
 if(style==='zigzag')return 8+(((x+z)%5>=3)?4:0);
 if(style==='double-gable')return 7+Math.ceil(7*crest((2*u)%1));
 if(style==='mansard')return 8+((u>.25&&u<.75)?7:1);
 if(style==='fortified')return 8+(((x+z)%7===0)?6:0);
 throw Error('unknown architect-authored skyline profile: '+style);
}
export function author2AProfiledArcade(s){
 const base=author2ALandmark(s),v=new Map(base.voxels.map(c=>[K(c.x,c.y,c.z),{...c}])),
  openings=[...base.openings],carved=[],newWindows=[],buttress=[],roofAdds=[],skyline=[];
 const at=(x,y,z)=>v.get(K(x,y,z));
 const put=c=>{const key=K(c.x,c.y,c.z);if(v.has(key))throw Error('source occupied placement collision '+s.name+' '+key);v.set(key,c);return c;};
 const carve=(x,y,z,role)=>{
  const key=K(x,y,z),before=at(x,y,z);
  if(before?.kind!=='wall')throw Error('authentic source wall required for '+role+' at '+key);
  v.delete(key);carved.push({x,y,z,role});
 };
 // The camera-visible 3-wide eastern stone arcade, and a 2-wide rear
 // unloading portico, are literal holes in the OLD source walls.
 for(const z of [29,30,31])for(let y=2;y<=4;y++)carve(s.w-1,y,z,'actual-east-open-air-arcade');
 for(const z of [29,30,31])openings.push({type:'entrance',role:'open-eastern-goods-arcade',
  x:s.w-1,y:2,z,clearHeightCells:3,doorOpenState:'source-empty'});
 for(const x of [s.entry+8,s.entry+9])for(let y=2;y<=4;y++)
  carve(x,y,s.d-1,'actual-rear-two-cell-unloading-portico');
 for(const x of [s.entry+8,s.entry+9])openings.push({type:'entrance',role:'open-rear-unloading-portico',
  x,y:2,z:s.d-1,clearHeightCells:3,doorOpenState:'source-empty'});
 // Twelve physical source glass cells; mounts remain symbolic and unapproved.
 const uppers=[
  ...[16,21,28,34].flatMap(z=>[7,8].map(y=>[s.w-1,y,z])),
  ...[s.entry-6,s.entry+6].flatMap(x=>[7,8].map(y=>[x,y,s.d-1]))
 ];
 for(const [x,y,z] of uppers){
  const previous=at(x,y,z);
  if(previous?.kind!=='wall')throw Error('upper window not actually source-carved from a wall '+s.name+' '+K(x,y,z));
  const material=y===7?'pack4:030':'pack4:032';
  v.set(K(x,y,z),{x,y,z,kind:'window',material,architecturalRole:'physically-carved-upper-opening-producer-mount-unapproved'});
  openings.push({type:'window',x,y,z,material});newWindows.push([x,y,z]);
 }
 // Two side pilasters are actual connected floor-rooted, full-height source
 // cells. They are not decorations floating outside the occupied plan.
 for(const z of [16,38]){
  const x=s.w-3;
  if(at(x,1,z)?.kind!=='floor')throw Error('near-side buttress lacks actual source floor '+K(x,1,z));
  for(let y=2;y<=s.h;y++){
   const n=put({x,y,z,kind:'wall',material:s.wall,architecturalRole:'east-pier-full-height-on-original-floor'});
   if(y>2&&at(x,y-1,z)?.kind!=='wall')throw Error('broken vertical source wall bearing '+K(x,y,z));
   buttress.push(n);
  }
 }
 function elevate(rect,style,label){
  let rooted=0,newCells=0,peak=0;
  for(let x=rect[0];x<=rect[1];x++)for(let z=rect[2];z<=rect[3];z++){
   if(at(x,s.h+1,z)?.kind!=='roof')continue;
   rooted++;
   const height=roofHeight(style,x,z,rect),target=s.h+1+height;
   for(let y=s.h+2;y<=target;y++){
    const old=at(x,y,z);
    if(old){if(old.kind!=='roof')throw Error('profile intersects nonroof source '+K(x,y,z));continue;}
    if(at(x,y-1,z)?.kind!=='roof')throw Error('roof profile floats over open-air source '+K(x,y,z));
    put({x,y,z,kind:'roof',material:s.roof,
      architecturalRole:'original-'+label+'-'+style+'-profile',
      roofBearing:'contiguous-vertically-source-roof-root; final-span-approval-open'});
    newCells++;peak=Math.max(peak,y);
   }
  }
  if(rooted<55||newCells<75)throw Error('source profile is nominal or unsupported '+s.name+' '+label+' '+rooted+' '+newCells);
  skyline.push({role:label,style,rootedOriginalWeatherPlateColumns:rooted,authoredNewSourceCells:newCells,peak,
   mountedPackGeometryCertified:false,accessibleRoofUpperRooms:false});
 }
 elevate([s.w-10,s.w-1,14,34],s.eastRoofStyle,'eastern-skyline');
 elevate([s.entry-9,s.entry+10,s.d-7,s.d-1],s.rearRoofStyle,'rear-skyline');
 const voxels=[...v.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const result={...base,voxels,openings,
  extents:{...base.extents,y:Math.max(...voxels.map(v=>v.y))+1},
  architecturalSignature:base.architecturalSignature+' / '+s.architecturalTheme+' / distinct east:'+s.eastRoofStyle+' and rear:'+s.rearRoofStyle+' source rooftops',
  roof:{...base.roof,form:'two independently authored raised roof profiles with different family crest geometry'},
  premiumArchitecture:Object.freeze({theme:s.architecturalTheme,eastSourceCarvedArches:3,rearSourceCarvedPortals:2,
    authenticWindowCells:newWindows.length,originalFloorRootedPilasterCells:buttress.length,
    sourceWeatherWallCarves:carved.length,skyline:Object.freeze(skyline),
    totalNewRoofSourceCells:skyline.reduce((a,b)=>a+b.authoredNewSourceCells,0),
    creatorApproval:false,finalGlazingMountApproval:false,fullRoofSpanLoadApproval:false,
    walkableUpperLevelClaim:false}),
  features:[...base.features,s.architecturalTheme,'authentic eastern open wall and rear unloading gap',
   'independent camera-facing source-supported roof silhouette and upper Pack4 apertures'],
  worldPlaced:false,numericIdsAssigned:false,unresolvedDependencies:base.unresolvedDependencies};
 validateBlueprint(result);return Object.freeze(result);
}
export const M1_PROFILED_ARCADE_SHOPS=Object.freeze(M1_PROFILED_ARCADE_SPECS.map(author2AProfiledArcade));
