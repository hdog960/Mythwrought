// :36 underground candidate: physically carved, edit-respecting switchback descent.
// Explicit opt-in reader; no surface generator, engine contract or save mutation.
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from './depth.mjs';
import {BLOCK,worldKey} from './voxel.mjs';
export const DESCENT_ORIGIN=Object.freeze({x:192,z:192});
const SIDE=28,PERIMETER=4*SIDE;
export function descentRoute(origin=DESCENT_ORIGIN){
  const out=[];
  for(let i=0;i<(Math.abs(WORLD_MIN_Y-LEGACY_WORLD_MIN_Y)-7)*4;i++){
    const t=i%PERIMETER;
    const x=t<SIDE?t:t<2*SIDE?SIDE:t<3*SIDE?3*SIDE-t:0;
    const z=t<SIDE?0:t<2*SIDE?t-SIDE:t<3*SIDE?SIDE:4*SIDE-t;
    // Begin below the protected legacy -3 layer: the first four-cell-high
    // passage must not rely on carving legacy terrain for headroom.
    const floor=LEGACY_WORLD_MIN_Y-5-Math.floor(i/4);
    out.push({x:origin.x+x,z:origin.z+z,floor,feet:floor+1});
  }
  return out;
}
/** Candidate-owned below-legacy entrance stairs. :24/manual integration must
 * explicitly open the legacy -3 floor and clear surface headroom; this lane
 * never changes those cells or player edits. From z-4 at floor -4 the four
 * supported one-voxel steps descend to the main route at floor -8.
 */
export function descentEntranceApproach(origin=DESCENT_ORIGIN){
  return Object.freeze(Array.from({length:5},(_,i)=>Object.freeze({
    x:origin.x,z:origin.z-4+i,floor:LEGACY_WORLD_MIN_Y-1-i,
    feet:LEGACY_WORLD_MIN_Y-i
  })));
}
export function descentEntranceHandoff(origin=DESCENT_ORIGIN){
  const steps=descentEntranceApproach(origin);
  return Object.freeze({
    opening:Object.freeze({x:origin.x,y:LEGACY_WORLD_MIN_Y,z:origin.z-4}),
    approach:steps,requiresSurfaceOwner:true,
    note:'Surface owner must open the legacy floor and supply headroom; do not auto-carve saved terrain'
  });
}
export function descentCells(origin=DESCENT_ORIGIN){
  const cells=new Map(),route=descentRoute(origin);
  const set=(x,y,z,id)=>{
    if(y>=LEGACY_WORLD_MIN_Y||y<WORLD_MIN_Y+1)return;
    cells.set(worldKey(x,y,z),id);
  };
  // Only below -3: support the entrance's descending stairs while leaving
  // legacy surface blocks untouched for explicit :24/manual coordination.
  for(const p of descentEntranceApproach(origin)){
    for(let dx=-1;dx<=1;dx++){
      set(p.x+dx,p.floor,p.z,BLOCK.DEEPSTONE);
      for(let h=1;h<=4;h++)set(p.x+dx,p.floor+h,p.z,BLOCK.AIR);
    }
  }
  // Continuous 3-wide walk with four blocks of clearance. The 1:4 descent
  // is navigable as a series of one-voxel steps rather than a sheer shaft.
  for(const p of route)for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
    for(let h=1;h<=4;h++)set(p.x+dx,p.floor+h,p.z+dz,BLOCK.AIR);
  // Connected radial alcoves with broad flat floors at representative depths.
  for(const depth of [-30,-80,-130,-180]){
    const p=route.find(q=>q.floor===depth);
    if(!p)continue;
    for(let dx=-6;dx<=6;dx++)for(let dz=-6;dz<=6;dz++){
      if(dx*dx+dz*dz>36)continue;
      for(let h=1;h<=6;h++)set(p.x+dx,depth+h,p.z+dz,BLOCK.AIR);
      set(p.x+dx,depth,p.z+dz,BLOCK.DEEPSTONE);
    }
  }
  // Two outward galleries per depth. Both begin on the OUTSIDE of the
  // switchback perimeter, so the descending route cannot subsequently place
  // a higher step's supporting stone inside either gallery. The second turns
  // tangentially after leaving the route, giving each grotto its own chamber.
  for(const depth of [-30,-80,-130,-180]){
    const anchor=route.find(p=>p.floor===depth);
    if(!anchor)continue;
    const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
    const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    for(let branch=0;branch<2;branch++){
      const points=[];
      for(let along=0;along<=22;along++){
        const out=Math.min(along,12),turn=branch===1?Math.max(0,along-12):0;
        points.push([anchor.x+outward[0]*out+tangent[0]*turn,
                     anchor.z+outward[1]*out+tangent[1]*turn]);
      }
      const [cx,cz]=points.at(-1);
      for(const [i,[x,z]] of points.entries())for(let across=-2;across<=2;across++){
        const cross=branch===1&&i>12?outward:tangent;
        const px=x+cross[0]*across;
        const pz=z+cross[1]*across;
        set(px,depth,pz,BLOCK.DEEPSTONE);
        for(let h=1;h<=5;h++)set(px,depth+h,pz,BLOCK.AIR);
      }
      for(let dx=-7;dx<=7;dx++)for(let dz=-7;dz<=7;dz++){
        if(dx*dx+dz*dz>49)continue;
        set(cx+dx,depth,cz+dz,BLOCK.DEEPSTONE);
        for(let h=1;h<=6;h++)set(cx+dx,depth+h,cz+dz,BLOCK.AIR);
      }
    }
  }
  // An outer cross-gallery connects the two side grottoes into a real loop,
  // so explorers can return by a different route rather than backtracking.
  // Keep the loop outside the descending perimeter and on the same floor.
  for(const depth of [-30,-80,-130,-180]){
    const anchor=route.find(p=>p.floor===depth);
    if(!anchor)continue;
    const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
    const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    // Branch zero ends at outward=12, tangent=0. Branch one ends at
    // outward=12, tangent=10. The outer passage joins their chamber edges.
    for(let t=0;t<=10;t++)for(let across=-2;across<=2;across++){
      const x=anchor.x+outward[0]*(19+across)+tangent[0]*t;
      const z=anchor.z+outward[1]*(19+across)+tangent[1]*t;
      set(x,depth,z,BLOCK.DEEPSTONE);
      for(let h=1;h<=5;h++)set(x,depth+h,z,BLOCK.AIR);
    }
  }
  // A broad stepped echo hall between the middle and lower grotto bands.
  // Its outer placement avoids the main spiral. Two terraces descend by one
  // voxel each, with a continuous five-wide, five-high walking approach.
  // This is authored AIR and DEEPSTONE, not a render-only decoration.
  {
    const depth=-105,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      // Keep the first four steps single-file until clear of the spiral's
      // adjacent bearing wall; only then widen into the five-cell hall.
      for(let d=0;d<=42;d++){
        const floor=depth-Math.min(2,Math.floor(d/14));
        for(let across=-(d<4?0:2);across<=(d<4?0:2);across++){
          const x=anchor.x+outward[0]*d+tangent[0]*across;
          const z=anchor.z+outward[1]*d+tangent[1]*across;
          set(x,floor,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=6;h++)set(x,floor+h,z,BLOCK.AIR);
        }
      }
      for(let d=28;d<=44;d++)for(let across=-10;across<=10;across++){
        if((d-36)*(d-36)+across*across>100)continue;
        const floor=depth-2;
        const x=anchor.x+outward[0]*d+tangent[0]*across;
        const z=anchor.z+outward[1]*d+tangent[1]*across;
        set(x,floor,z,BLOCK.DEEPSTONE);
        for(let h=1;h<=9;h++)set(x,floor+h,z,BLOCK.AIR);
      }
    }
  }
  // Deepest-band crescent refuge: an outward approach opens into a broad,
  // asymmetrical cavern with a second smaller pocket. This is real voxel
  // topology at Y=-195, safely above the bedrock margin. No new IDs.
  {
    const depth=-195,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,r,height)=>{
        for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++){
          if(a*a+b*b>r*r)continue;
          const x=anchor.x+outward[0]*(d+a)+tangent[0]*(t+b);
          const z=anchor.z+outward[1]*(d+a)+tangent[1]*(t+b);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=30;d++)carve(d,0,2,5);
      carve(31,0,11,10);
      carve(40,10,7,7);
      for(let t=0;t<=10;t++)carve(39,t,2,5);
    }
  }
  // Two differently proportioned natural vaults in the gaps between the
  // established grotto levels. These are physically connected, outward-facing
  // passages with floors and overhead AIR, not independent isolated fixtures.
  // Their offset footprints create a winding erosion vault at -60 and a
  // long transverse gallery at -150 without touching protected shallow cells.
  for(const spec of [
    {depth:-60,reach:30,width:8,length:14,offset:5,height:8},
    {depth:-150,reach:35,width:5,length:23,offset:-7,height:10},
  ]){
    const anchor=route.find(p=>p.floor===spec.depth);
    if(!anchor)continue;
    const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
    const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    const carve=(d,t,halfWidth,headroom)=>{
      for(let cross=-halfWidth;cross<=halfWidth;cross++){
        const x=anchor.x+outward[0]*d+tangent[0]*(t+cross);
        const z=anchor.z+outward[1]*d+tangent[1]*(t+cross);
        set(x,spec.depth,z,BLOCK.DEEPSTONE);
        for(let h=1;h<=headroom;h++)set(x,spec.depth+h,z,BLOCK.AIR);
      }
    };
    for(let d=0;d<=spec.reach;d++)carve(d,0,2,5);
    for(let d=spec.reach-5;d<=spec.reach+5;d++)
      for(let t=spec.offset-spec.length;t<=spec.offset+spec.length;t++){
        const nd=(d-spec.reach)/5,nt=(t-spec.offset)/spec.length;
        if(nd*nd+nt*nt>1)continue;
        carve(d,t,Math.max(0,Math.floor(spec.width*(1-nd*nd-nt*nt)/4)),spec.height);
      }
  }
  // Lower-band bifurcated mineral gallery at -120: a broad outer
  // vestibule splits into two curving arms and rejoins in a quiet chamber.
  // All passages are supported voxel floors with physical body clearance.
  // No new block IDs, saved edits or global terrain changes.
  {
    const depth=-120,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,r=2,height=5)=>{
        for(let across=-r;across<=r;across++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+across);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+across);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=12;d++)carve(d,0);
      for(let d=12;d<=36;d++){
        const arc=Math.round(7*Math.sin(Math.PI*(d-12)/24));
        carve(d,arc,2,6);
        carve(d,-arc,2,6);
      }
      for(let d=33;d<=43;d++)for(let t=-8;t<=8;t++){
        if((d-38)*(d-38)+(t*t)/3>30)continue;
        carve(d,t,1,8);
      }
    }
  }
  // The -170 fault cathedral is a two-lobed, naturally pinched cavern.
  // Its lateral fault line bends away from the spiral, with a broad central
  // floor and an elevated roof profile; all cells remain below legacy Y.
  {
    const depth=-170,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,height)=>{
        const x=anchor.x+outward[0]*d+tangent[0]*t;
        const z=anchor.z+outward[1]*d+tangent[1]*t;
        set(x,depth,z,BLOCK.DEEPSTONE);
        for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
      };
      for(let d=0;d<=28;d++)for(let t=-1;t<=1;t++)carve(d,t,5);
      for(const lobe of [{d:29,t:-9,rx:13,rz:9},{d:36,t:11,rx:10,rz:12}]){
        for(let dd=-lobe.rx;dd<=lobe.rx;dd++)for(let tt=-lobe.rz;tt<=lobe.rz;tt++){
          const radial=(dd/lobe.rx)**2+(tt/lobe.rz)**2;
          if(radial>1)continue;
          carve(lobe.d+dd,lobe.t+tt,4+Math.floor(9*(1-radial)));
        }
      }
      for(let t=-9;t<=11;t++)for(let d=27;d<=29;d++)carve(d,t,5);
    }
  }
  // Middle-band rift terraces at -90: a walkable split-level cavern with
  // three broad landings. Each landing drops one block after a long run;
  // all connections remain outward of the switchback bearing walls.
  // Existing IDs only; the final corridor reassertion protects the descent.
  {
    const depth=-90,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,floor,height=6)=>{
        const x=anchor.x+outward[0]*d+tangent[0]*t;
        const z=anchor.z+outward[1]*d+tangent[1]*t;
        set(x,floor,z,BLOCK.DEEPSTONE);
        for(let h=1;h<=height;h++)set(x,floor+h,z,BLOCK.AIR);
      };
      // At d=12 and d=24 the next terrace descends one voxel.
      // The transition itself is a supported, one-block step.
      for(let d=0;d<=38;d++){
        const floor=depth-(d>=24?2:d>=12?1:0);
        const width=d<6?1:d<12?2:d<24?4:6;
        for(let t=-width;t<=width;t++)carve(d,t,floor,6);
      }
      // Two offset chambers add genuine lateral exploration space.
      for(const chamber of [{d:20,t:-9,r:7},{d:33,t:10,r:9}]){
        const floor=depth-(chamber.d>=24?2:1);
        for(let dd=-chamber.r;dd<=chamber.r;dd++)
          for(let tt=-chamber.r;tt<=chamber.r;tt++){
            const radial=dd*dd+tt*tt;
            if(radial>chamber.r*chamber.r)continue;
            carve(chamber.d+dd,chamber.t+tt,floor,4+Math.floor(5*(1-radial/(chamber.r*chamber.r))));
          }
      }
    }
  }
  // Upper/middle threshold: a branching, supported erosion labyrinth at -45.
  // A long outward nave divides into two asymmetric arms, each with a
  // distinct pocket and a short cross-connection near the far end.
  // The radial gallery stays outside the spiral; no legacy blocks are cut.
  {
    const depth=-45,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,r=2,height=5)=>{
        for(let cross=-r;cross<=r;cross++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+cross);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+cross);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=15;d++)carve(d,0);
      for(let d=15;d<=41;d++){
        const progress=(d-15)/26;
        carve(d,-Math.round(9*progress),2,6);
        carve(d,Math.round(12*progress),2,7);
      }
      // A transverse return passage connects the two outer pockets.
      for(let t=-9;t<=12;t++)carve(41,t,2,6);
      for(const pocket of [{d:41,t:-9,r:8},{d:41,t:12,r:10}]){
        for(let dd=-pocket.r;dd<=pocket.r;dd++)
          for(let tt=-pocket.r;tt<=pocket.r;tt++){
            const radial=dd*dd+tt*tt;
            if(radial>pocket.r*pocket.r)continue;
            carve(pocket.d+dd,pocket.t+tt,0,
              5+Math.floor(5*(1-radial/(pocket.r*pocket.r))));
          }
      }
    }
  }
  // Lower-band split-fault grotto at -135: an offset entry, broad oval
  // chamber and sheltered rear pocket, all carved from physical voxel cells.
  // A dogleg prevents the chamber from becoming another straight gray tube.
  {
    const depth=-135,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,r=2,height=5)=>{
        for(let across=-r;across<=r;across++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+across);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+across);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=38;d++){
        const bend=d<12?0:d<25?Math.floor((d-12)/3):4;
        carve(d,bend,2,6);
      }
      for(let d=26;d<=49;d++)for(let t=-7;t<=17;t++){
        const ellipse=((d-37)/12)**2+((t-4)/13)**2;
        if(ellipse>1)continue;
        carve(d,t,0,5+Math.floor(7*(1-ellipse)));
      }
      for(let d=45;d<=58;d++)carve(d,10,2,5);
      for(let d=53;d<=65;d++)for(let t=5;t<=17;t++){
        if(((d-59)/7)**2+((t-11)/7)**2>1)continue;
        carve(d,t,0,7);
      }
    }
  }
  // Deep fault bypass at -185: two diverging supported routes reconnect in
  // a remote oval chamber, giving the deepest band a genuine alternate path.
  // All geometry remains outside the main switchback and above bedrock.
  {
    const depth=-185,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,width=2,height=6)=>{
        for(let cross=-width;cross<=width;cross++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+cross);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+cross);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=12;d++)carve(d,0);
      for(let d=12;d<=48;d++){
        const offset=Math.round(11*Math.sin(Math.PI*(d-12)/36));
        carve(d,-offset,2,7);
        carve(d,offset,2,7);
      }
      // A flared terminus ties both arms together; irregular roof heights
      // make the remote destination read as a cavern rather than a corridor.
      for(let d=43;d<=57;d++)for(let t=-10;t<=10;t++){
        const radial=((d-50)/8)**2+(t/11)**2;
        if(radial<=1)carve(d,t,0,5+Math.floor(6*(1-radial)));
      }
    }
  }
  // Mid-depth braided ravine at -70. Two offset erosion channels diverge
  // around a solid island, then reconnect at an expanded terminal vault.
  // It remains outside the switchback and is carved from physical voxels.
  {
    const depth=-70,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,width=2,height=6)=>{
        for(let across=-width;across<=width;across++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+across);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+across);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=14;d++)carve(d,0);
      for(let d=14;d<=52;d++){
        const offset=Math.round(10*Math.sin(Math.PI*(d-14)/38));
        carve(d,-offset,2,6);
        carve(d,offset,2,7);
      }
      for(let d=48;d<=65;d++)for(let t=-12;t<=12;t++){
        const radial=((d-56)/9)**2+(t/13)**2;
        if(radial<=1)carve(d,t,0,5+Math.floor(7*(1-radial)));
      }
    }
  }
  // Deep transition's forked basalt sanctuary at -160. A broad throat
  // divides around an intact stone spine and rejoins in a high oval vault.
  // The shorter eastern arm opens into a smaller blind alcove. This adds a
  // physically connected destination at the lower/deepest boundary rather
  // than another detached cave fixture; all work stays below legacy terrain.
  {
    const depth=-160,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,r=1,height=6)=>{
        for(let a=-r;a<=r;a++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+a);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+a);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=14;d++)carve(d,0,2,6);
      for(let d=14;d<=46;d++){
        const spread=Math.round(9*Math.sin(Math.PI*(d-14)/32));
        carve(d,-spread,2,6);
        carve(d,spread,2,7);
      }
      // Reconnected high-roof terminal vault with irregular silhouette.
      for(let d=41;d<=62;d++)for(let t=-14;t<=14;t++){
        const radial=((d-51)/12)**2+((t-2)/15)**2;
        if(radial>1)continue;
        carve(d,t,0,5+Math.floor(9*(1-radial)));
      }
      // A narrow offset side pocket branches from the eastern passage.
      for(let d=25;d<=38;d++)for(let t=8;t<=18;t++){
        const radial=((d-32)/8)**2+((t-13)/6)**2;
        if(radial<=1)carve(d,t,0,5+Math.floor(3*(1-radial)));
      }
    }
  }
  // Lower-band stepped confluence at -110: a three-landing erosion hall.
  // The two outer arms flank an intact central rib, rejoining beyond it.
  // Each 12-cell landing drops exactly one block, with continuous physical
  // support and four-cell standing clearance. No new block IDs or legacy cuts.
  {
    const depth=-110,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,floor,width=1,height=7)=>{
        for(let a=-width;a<=width;a++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+a);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+a);
          set(x,floor,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,floor+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=14;d++)carve(d,0,depth,1);
      for(let d=14;d<=54;d++){
        const floor=depth-(d>=38?2:d>=26?1:0);
        const spread=Math.round(9*Math.sin(Math.PI*(d-14)/40));
        carve(d,-spread,floor,1,7);
        carve(d,spread,floor,1,7);
      }
      // Rejoined terminal hall and two sheltered chambers.
      for(let d=49;d<=70;d++)for(let t=-14;t<=14;t++){
        const radial=((d-59)/12)**2+(t/15)**2;
        if(radial<=1)carve(d,t,depth-2,0,5+Math.floor(8*(1-radial)));
      }
      for(const pocket of [{d:36,t:-15,r:6},{d:43,t:16,r:8}]){
        const floor=depth-(pocket.d>=38?2:1);
        for(let dd=-pocket.r;dd<=pocket.r;dd++)
          for(let tt=-pocket.r;tt<=pocket.r;tt++){
            const radial=(dd*dd+tt*tt)/(pocket.r*pocket.r);
            if(radial<=1)carve(pocket.d+dd,pocket.t+tt,floor,0,5+Math.floor(4*(1-radial)));
          }
      }
    }
  }
  // Upper-band windcut antechamber at -20. Two curving arms skirt an
  // uncarved stone island and rejoin at a broad asymmetric lookout hollow.
  // The opening is entirely below the protected legacy envelope and the
  // outbound throat is physically joined to the descending switchback.
  {
    const depth=-20,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,width=2,height=6)=>{
        for(let across=-width;across<=width;across++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+across);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+across);
          set(x,depth,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,depth+h,z,BLOCK.AIR);
        }
      };
      for(let d=0;d<=15;d++)carve(d,0);
      for(let d=15;d<=45;d++){
        const bend=Math.round(8*Math.sin(Math.PI*(d-15)/30));
        carve(d,-bend,2,6);
        carve(d,bend,2,7);
      }
      for(let d=40;d<=62;d++)for(let t=-14;t<=14;t++){
        const radial=((d-51)/12)**2+((t+2)/15)**2;
        if(radial<=1)carve(d,t,0,5+Math.floor(7*(1-radial)));
      }
      // A side niche opens off the north arm, not an isolated pocket.
      for(let d=25;d<=39;d++)for(let t=-18;t<=-7;t++){
        const radial=((d-32)/8)**2+((t+12)/7)**2;
        if(radial<=1)carve(d,t,0,5+Math.floor(3*(1-radial)));
      }
    }
  }
  // Three-level shattered shelf at -145: a supported zigzag descent into
  // an offset vault, with a separate upper return shelf. No new block IDs.
  // The entrance remains attached to the existing deep switchback.
  {
    const depth=-145,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,floor,width=2,height=6)=>{
        for(let a=-width;a<=width;a++){
          const x=anchor.x+outward[0]*d+tangent[0]*(t+a);
          const z=anchor.z+outward[1]*d+tangent[1]*(t+a);
          set(x,floor,z,BLOCK.DEEPSTONE);
          for(let h=1;h<=height;h++)set(x,floor+h,z,BLOCK.AIR);
        }
      };
      // Two long shelves each step down one voxel. The bends are gradual,
      // with no horizontal gap or vertical drop exceeding one block.
      for(let d=0;d<=56;d++){
        const floor=depth-(d>=38?2:d>=19?1:0);
        const bend=d<18?0:d<37?Math.floor((d-18)/4):4-Math.floor((d-37)/5);
        carve(d,bend,floor,d<5?1:2,7);
      }
      // A remote high vault and its smaller lateral refuge. Their floor
      // heights match the final shelf, preserving four-cell headroom.
      for(const room of [{d:59,t:0,rx:13,rz:11,h:11},
                         {d:66,t:15,rx:8,rz:7,h:7}]){
        for(let dd=-room.rx;dd<=room.rx;dd++)
          for(let tt=-room.rz;tt<=room.rz;tt++){
            const radial=(dd/room.rx)**2+(tt/room.rz)**2;
            if(radial>1)continue;
            carve(room.d+dd,room.t+tt,depth-2,0,
              5+Math.floor((room.h-5)*(1-radial)));
          }
      }
      for(let t=0;t<=15;t++)carve(66,t,depth-2,1,6);
    }
  }
  // Bedrock-margin labyrinth at -200: a meandering three-pronged chamber
  // network, with two joined galleries and a blind lower refuge. Every
  // path begins at the real descending corridor and remains above -209.
  // This intentionally differs from the oval vaults at shallower depths.
  {
    const depth=-200,anchor=route.find(p=>p.floor===depth);
    if(anchor){
      const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
      const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
      const tangent=[outward[1],-outward[0]];
      const carve=(d,t,floor=depth,height=6)=>{
        const x=anchor.x+outward[0]*d+tangent[0]*t;
        const z=anchor.z+outward[1]*d+tangent[1]*t;
        set(x,floor,z,BLOCK.DEEPSTONE);
        for(let h=1;h<=height;h++)set(x,floor+h,z,BLOCK.AIR);
      };
      const passage=(d,t,floor=depth)=>{
        for(let across=-2;across<=2;across++)carve(d,t+across,floor,7);
      };
      // Shared entry, diverging arms, and transverse return at the far end.
      for(let d=0;d<=16;d++)passage(d,0);
      for(let d=16;d<=58;d++){
        const spread=Math.round(12*Math.sin(Math.PI*(d-16)/42));
        passage(d,-spread);
        passage(d,spread);
      }
      for(let t=-5;t<=5;t++)passage(58,t);
      // Three irregular, genuinely navigable terminal pockets.
      for(const pocket of [
        {d:62,t:-12,rx:11,rz:8,h:10},
        {d:67,t:12,rx:9,rz:12,h:8},
        {d:79,t:0,rx:8,rz:7,h:9}
      ]){
        for(let dd=-pocket.rx;dd<=pocket.rx;dd++)
          for(let tt=-pocket.rz;tt<=pocket.rz;tt++){
            const radial=(dd/pocket.rx)**2+(tt/pocket.rz)**2;
            if(radial<=1)carve(pocket.d+dd,pocket.t+tt,depth,
              5+Math.floor((pocket.h-5)*(1-radial)));
          }
      }
      // Central corridor reaches the far refuge; no teleport or shaft.
      for(let d=58;d<=79;d++)passage(d,0);
    }
  }
  // Alcove floors can intersect the sloping approach at a different height.
  // Recarve the entire ordered player corridor AFTER the chambers, then
  // restore its support. Otherwise chamber floors seal three or more steps.
  // Two passes prevent a later step's support from being mistaken for air
  // while keeping all authored floor voxels solid.
  for(const p of route)for(let h=1;h<=4;h++)set(p.x,p.floor+h,p.z,BLOCK.AIR);
  for(const p of route)set(p.x,p.floor,p.z,BLOCK.DEEPSTONE);
  // Reassert the short entry's centerline after the main corridor's broad
  // side clearance. The entry meets the route at its first floor=-8 cell.
  for(const p of descentEntranceApproach(origin)){
    for(let y=p.feet;y<=Math.min(LEGACY_WORLD_MIN_Y-1,p.feet+3);y++)
      set(p.x,y,p.z,BLOCK.AIR);
    set(p.x,p.floor,p.z,BLOCK.DEEPSTONE);
  }
  return cells;
}
// Candidate topology is seed-independent. Build it once per origin rather than
// regenerating tens of thousands of cells for every collision/volume probe.
// Keep the cached Map private: the exported descentCells() remains an isolated
// mutable snapshot for callers, so their edits cannot corrupt the runtime read.
const descentCellCache=new Map();
function cachedDescentCells(origin){
  const key=origin.x+','+origin.z;
  let cells=descentCellCache.get(key);
  if(!cells){
    cells=descentCells(origin);
    descentCellCache.set(key,cells);
  }
  return cells;
}
export function descentWorld(world,origin=DESCENT_ORIGIN){
  if(!world||typeof world.get!=='function'||!(world.edits instanceof Map))throw Error('Invalid world');
  const cells=cachedDescentCells(origin);
  return {seed:world.seed,edits:world.edits,get(x,y,z){
    const key=worldKey(x,y,z);
    if(world.edits.has(key))return world.get(x,y,z);
    return cells.get(key)??world.get(x,y,z);
  }};
}
export function descentEvidence(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),route=descentRoute(origin);
  const bands=[[-4,-45],[-46,-100],[-101,-155],[-156,WORLD_MIN_Y+1]];
  return bands.map(([high,low])=>{
    const steps=route.filter(p=>p.floor<=high&&p.floor>=low);
    const invalid=steps.filter(p=>{
      const footing=reader.get(p.x,p.floor,p.z);
      return (footing!==BLOCK.STONE&&footing!==BLOCK.DEEPSTONE)||
        [0,1,2,3].some(h=>reader.get(p.x,p.feet+h,p.z)!==BLOCK.AIR);
    });
    return {high,low,count:steps.length,invalid:invalid.length};
  });
}

/**
 * Physical, ordered descent audit. A valid chamber alone is insufficient:
 * every consecutive foot position must be a walkable, one-voxel step with
 * two clear body cells and a solid supporting voxel. Edits take precedence.
 * This deliberately does NOT certify a surface entrance or browser runtime.
 */
export function descentConnectivity(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),route=descentRoute(origin);
  const failures=[],bands=[0,0,0,0];
  let highest=null,lowest=null;
  for(let i=0;i<route.length;i++){
    const p=route[i],prev=route[i-1];
    const band=p.floor>=-45?0:p.floor>=-100?1:p.floor>=-155?2:3;
    bands[band]++;
    if(highest===null)highest=p.floor;
    lowest=p.floor;
    // Match the authored four-cell player envelope, not just feet and head.
    // Saved overhead edits must fail readiness even when the lower two cells
    // remain clear. A floor must be solid, not merely non-air.
    if(reader.get(p.x,p.floor,p.z)!==BLOCK.DEEPSTONE &&
       reader.get(p.x,p.floor,p.z)!==BLOCK.STONE)
      failures.push({step:i,reason:'blocked-or-unsupported'});
    for(let h=0;h<4;h++)
      if(reader.get(p.x,p.feet+h,p.z)!==BLOCK.AIR)
        failures.push({step:i,reason:'blocked-or-unsupported',height:h});
    if(prev){
      const horizontal=Math.abs(p.x-prev.x)+Math.abs(p.z-prev.z);
      const vertical=Math.abs(p.feet-prev.feet);
      if(horizontal!==1||vertical>1)
        failures.push({step:i,reason:'disconnected-step'});
      // A player stepping downward must also have an unobstructed head path
      // at the shared boundary; checking only destination feet misses this.
      if(reader.get(p.x,Math.max(p.feet,prev.feet)+1,p.z)!==BLOCK.AIR)
        failures.push({step:i,reason:'step-head-obstruction'});
    }
  }
  return {connected:failures.length===0&&bands.every(n=>n>0),
    failures,bands,highest,lowest,steps:route.length,
    surfaceConnected:false,reason:'surface throat requires :24 coordination and runtime proof'};
}

/** Fixed-seed physical voxel occupancy evidence, including authored side rooms.
 * Count only candidate-owned cells in each depth band; do not mistake a
 * populated route array for carved air or supporting stone. Player edits
 * override the candidate and are reflected in these counts.
 */
export function descentVolumeEvidence(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),cells=descentCells(origin);
  const bands=[[-4,-45],[-46,-100],[-101,-155],[-156,WORLD_MIN_Y+1]];
  const counts=bands.map(([high,low])=>({high,low,air:0,solid:0,other:0}));
  for(const key of cells.keys()){
    const [x,y,z]=key.split(',').map(Number);
    const band=counts.find(b=>y<=b.high&&y>=b.low);
    if(!band)continue;
    const id=reader.get(x,y,z);
    if(id===BLOCK.AIR)band.air++;
    else if(id===BLOCK.DEEPSTONE||id===BLOCK.STONE)band.solid++;
    else band.other++;
  }
  return counts;
}


/**
 * Audit the four return loops as real walkable voxels, not merely carved
 * coordinates. A player edit blocking a gallery must invalidate that loop.
 * This is candidate geometry evidence, not a live-game entrance certificate.
 */
export function descentLoopConnectivity(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),route=descentRoute(origin);
  const levels=[];
  for(const depth of [-30,-80,-130,-180]){
    const anchor=route.find(p=>p.floor===depth);
    if(!anchor){levels.push({depth,connected:false,failures:['missing-anchor']});continue;}
    const lx=anchor.x-origin.x,lz=anchor.z-origin.z;
    const outward=lz===0?[0,-1]:lz===SIDE?[0,1]:lx===0?[-1,0]:[1,0];
    const tangent=[outward[1],-outward[0]];
    const failures=[];
    const check=(d,t,part)=>{
      const x=anchor.x+outward[0]*d+tangent[0]*t;
      const z=anchor.z+outward[1]*d+tangent[1]*t;
      const footing=reader.get(x,depth,z);
      if(footing!==BLOCK.DEEPSTONE&&footing!==BLOCK.STONE)
        failures.push({part,d,t,x,z,reason:'unsupported-floor'});
      for(let h=1;h<=4;h++)
        if(reader.get(x,depth+h,z)!==BLOCK.AIR)
          failures.push({part,d,t,x,z,height:h,reason:'blocked-headroom'});
    };
    // Both branches and their common outer cross-gallery form a closed loop.
    for(let d=0;d<=12;d++){check(d,0,'first-branch');check(d,0,'second-branch');}
    for(let t=0;t<=10;t++){
      check(12,t,'turning-branch');
      check(19,t,'outer-return');
    }
    // The chamber disks connect d=12 to d=19 at each end.
    for(let d=12;d<=19;d++){
      check(d,0,'first-chamber');
      check(d,10,'second-chamber');
    }
    levels.push({depth,connected:failures.length===0,failures});
  }
  return {connected:levels.every(level=>level.connected),levels};
}

/** Audit the candidate's five-step entrance independently of the protected
 * surface breach. Never label the world surface-connected until the surface
 * owner has supplied and verified the opening.
 */
export function descentEntranceConnectivity(world,origin=DESCENT_ORIGIN){
  const reader=descentWorld(world,origin),steps=descentEntranceApproach(origin);
  const failures=[];
  for(let i=0;i<steps.length;i++){
    const p=steps[i],prev=steps[i-1];
    const footing=reader.get(p.x,p.floor,p.z);
    if(footing!==BLOCK.DEEPSTONE&&footing!==BLOCK.STONE)
      failures.push({step:i,reason:'unsupported-floor'});
    for(let h=0;h<4;h++)
      if(reader.get(p.x,p.feet+h,p.z)!==BLOCK.AIR)
        failures.push({step:i,reason:'blocked-headroom',height:h});
    if(prev){
      if(Math.abs(p.x-prev.x)+Math.abs(p.z-prev.z)!==1 ||
         Math.abs(p.feet-prev.feet)>1)
        failures.push({step:i,reason:'disconnected-step'});
      if(reader.get(p.x,Math.max(p.feet,prev.feet)+1,p.z)!==BLOCK.AIR)
        failures.push({step:i,reason:'step-head-obstruction'});
    }
  }
  const first=descentRoute(origin)[0],last=steps.at(-1);
  if(!first||first.x!==last.x||first.z!==last.z||first.floor!==last.floor)
    failures.push({reason:'descent-join-mismatch'});
  return {approachConnected:failures.length===0,failures,
    surfaceConnected:false,requiresSurfaceOwner:true,
    opening:descentEntranceHandoff(origin).opening};
}

/**
 * Read-only surface seam probe for :24 and the manual incorporator.
 * No implicit surface excavation: every required air cell is checked against
 * the real world, including saved edits. A green seam is geometry evidence,
 * NOT proof the candidate is registered in the running WebGL2 world.
 */
export function descentSurfaceSeam(world,origin=DESCENT_ORIGIN){
  const steps=descentEntranceApproach(origin);
  const opening=descentEntranceHandoff(origin).opening;
  const failures=[];
  const reader=descentWorld(world,origin);
  // Probe protected legacy cells against the untouched surface world, but
  // probe deeper cells against the candidate's physical carving. Otherwise
  // unmodified DEEPSTONE below -3 produces a false blocked-entrance result.
  // descentWorld still gives saved player edits priority over candidate air.
  for(const p of steps){
    // A two-cell probe can certify a tunnel with a low ceiling even though
    // the authored route requires four clear body/head cells. Check the
    // entire standing envelope, including protected legacy roof voxels.
    for(let y=p.feet;y<=p.feet+3;y++){
      const id=y>=LEGACY_WORLD_MIN_Y?world.get(p.x,y,p.z):reader.get(p.x,y,p.z);
      if(id!==BLOCK.AIR)
        failures.push({x:p.x,y,z:p.z,reason:y>=LEGACY_WORLD_MIN_Y?'surface-headroom':'candidate-headroom'});
    }
  }
  // An open shaft without a supported stair is not a safe cave entrance.
  for(const p of steps){
    const support=reader.get(p.x,p.floor,p.z);
    if(support!==BLOCK.STONE&&support!==BLOCK.DEEPSTONE)
      failures.push({x:p.x,y:p.floor,z:p.z,reason:'missing-solid-support'});
  }
  return Object.freeze({opening,clear:failures.length===0,failures,
    runtimeVerified:false,requiresSurfaceOwner:true});
}
