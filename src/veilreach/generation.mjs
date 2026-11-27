import {VEILREACH_GRASS_ID} from './flora.mjs';
import {BLOCK,chunkCoord,worldKey} from '../voxel.mjs';
import {MOUNTAIN_V8_MATERIAL as M} from '../manual-biomes/mountain-v8-materials.mjs';
import {runtimeSectionForY,runtimeSectionBounds} from '../world-height.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';

export const SKY_REGION_SIZE=768;
export const SKY_FAMILIES=Object.freeze(['Verdant Crowns','Shatterpeaks','Moonveil Gardens']);
const maxRadius=112;
const naturalMinY=30,naturalMaxY=232;
const air=BLOCK.AIR;
const mix=(a,b,t)=>a+(b-a)*t;
const fade=t=>t*t*(3-2*t);
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function roll(seed,x,z,salt=0){
  let hash=seed^Math.imul(x,0x45d9f3b)^Math.imul(z,0x27d4eb2d)^Math.imul(salt,0x9e3779b1);
  hash=Math.imul(hash^(hash>>>16),0x21f0aaad);
  hash=Math.imul(hash^(hash>>>15),0x735a2d97);
  return ((hash^(hash>>>15))>>>0)/2**32;
}

function noise(seed,x,z,scale,salt){
  const gx=Math.floor(x/scale),gz=Math.floor(z/scale);
  const tx=fade(x/scale-gx),tz=fade(z/scale-gz);
  return mix(mix(roll(seed,gx,gz,salt),roll(seed,gx+1,gz,salt),tx),
    mix(roll(seed,gx,gz+1,salt),roll(seed,gx+1,gz+1,salt),tx),tz);
}

function remember(cache,key,limit,create){
  if(cache.has(key))return cache.get(key);
  const value=create();
  cache.set(key,value);
  if(cache.size>limit)cache.delete(cache.keys().next().value);
  return value;
}

function makeRegion(seed,rx,rz){
  const r=i=>roll(seed,rx,rz,i);
  const x=rx*SKY_REGION_SIZE,z=rz*SKY_REGION_SIZE;
  const start=rx===0&&rz===0;
  const centerX=x+(start?46+Math.floor(r(1)*12):172+Math.floor(r(1)*395));
  const centerZ=z+(start?30+Math.floor(r(2)*16):167+Math.floor(r(2)*390));
  const family=start?0:Math.floor(r(3)*3);
  const altitude=start?108+Math.floor(r(4)*12):97+Math.floor(r(4)*86);
  const islands=[];
  function island(i,px,pz,y,scale,kind){
    return Object.freeze({id:`${rx},${rz}:${i}`,
      x:Math.floor(px),z:Math.floor(pz),y,family:kind,
      rx:scale*(.95+r(50+i)*.34),rz:scale*(.63+r(66+i)*.42),
      direction:(start&&i===0?.45:r(80+i)*Math.PI),bulk:Math.round(scale*.49+6+r(99+i)*6),
      seed:Math.floor(r(124+i)*2**32)|0});
  }
  islands.push(island(0,centerX,centerZ,altitude,start?39:31+r(6)*29,family));
  const arc=r(10)*6.28;
  const satellites=3+Math.floor(r(11)*3)+(r(12)>.83?3:0);
  for(let i=1;i<=satellites;i++){
    const a=arc+i*2.38;
    const dist=65+r(20+i)*94;
    islands.push(island(i,
      clamp(centerX+Math.cos(a)*dist,x+24,x+743),
      clamp(centerZ+Math.sin(a)*dist,z+24,z+743),
      clamp(altitude+Math.floor((r(35+i)-.5)*62),72,199),
      9+r(43+i)*(i>5?24:17),(family+(r(186+i)>.65?1:0))%3));
  }
  // Independent scattered outcrops fill the spaces between strong clusters.
  for(let i=1;i<=3;i++)
    islands.push(island(12+i,x+62+r(200+i)*644,z+62+r(207+i)*644,
      75+Math.floor(r(214+i)*120),6+r(221+i)*11,Math.floor(r(228+i)*3)));
  return Object.freeze(islands);
}

function shape(island,x,z){
  const dx=x+.5-island.x,dz=z+.5-island.z;
  if(Math.abs(dx)>maxRadius||Math.abs(dz)>maxRadius)return null;
  const c=Math.cos(island.direction),s=Math.sin(island.direction);
  const u=(dx*c+dz*s)/island.rx,v=(-dx*s+dz*c)/island.rz;
  const angle=Math.atan2(v,u);
  const radius=Math.hypot(u,v);
  if(radius>1.34)return null;
  const {seed,family}=island;
  const edge=1-radius+.125*Math.sin(angle*3+seed*.001)+.069*Math.cos(angle*5+u*2)+
    .13*(noise(seed,x,z,13,51)-.5)+.09*(noise(seed,x,z,5,56)-.5);
  if(edge<-.075)return null;
  const terrace=(noise(seed,x,z,23,61)-.5)*(family===1?26:13)+
    (noise(seed,x,z,8,62)-.5)*(family===1?8:4.5)+u*3.1-v*2.4;
  const top=Math.floor(island.y+terrace-2.6*Math.max(0,radius-.6));
  const depth=Math.max(2,Math.floor(island.bulk*Math.pow(Math.max(0,edge+.075),.71)*
    (.72+noise(seed,x,z,16,66)*.53)));
  return {island,edge,top,bottom:Math.max(naturalMinY+5,top-depth),u,v,texture:noise(seed,x,z,8,93)};
}

function geology(column,x,y,z){
  const {island,edge,top,bottom,u,v,texture}=column;
  if(y>top||y<bottom)return air;
  const below=top-y;
  // Erode only the side of the volume. A coherent ledge can project over
  // recessed strata without disconnecting a small island into loose voxels.
  if(edge<.11&&below>0&&edge+.031*Math.sin(y*.48+u*9-v*5)<-.05)return air;
  if(island.rx>24&&below>=5&&y>bottom+1&&
    Math.abs(v+.22*Math.sin(u*4+island.seed*.0009))<.095&&
    Math.abs(y-(island.y-11+Math.sin(u*5)*2))<2.7&&
    Math.abs(u)<1.1)return air;
  if(below===0){
    if(edge<.045)return island.family===1?G.gneiss:BLOCK.STONE;
    if(island.family===2)return texture<.44?G.woodlandLoam:G.woodlandMoss;
    if(island.family===1&&texture>.42)return texture>.69?G.scree:G.slate;
    return BLOCK.GRASS;
  }
  if(below<3&&edge>.13)return island.family===2?G.woodlandPeat:BLOCK.DIRT;
  const deposit=roll(island.seed^Math.imul(y,8761),x,z,104);
  if(below>3&&deposit>.996)return island.family===2?BLOCK.CRYSTAL:BLOCK.ORE;
  if(y<bottom+3||below>12&&(y+Math.floor(texture*4))%9<2)return BLOCK.DEEPSTONE;
  if(island.family===1)return texture<.42?G.slate:G.gneiss;
  if(island.family===2&&texture<.42)return G.slate;
  return BLOCK.STONE;
}

export function createSkylands(seed){
  if(!Number.isSafeInteger(seed))throw TypeError('Skylands require an integer seed');
  const regions=new Map(),columns=new Map(),plants=new Map(),occupancy=new Map(),trees=new Map();
  const region=(rx,rz)=>{
    if(!Number.isSafeInteger(rx)||!Number.isSafeInteger(rz))throw TypeError('Invalid Skylands region');
    return remember(regions,`${rx},${rz}`,48,()=>makeRegion(seed,rx,rz));
  };
  function nearby(x,z,radius=maxRadius){
    const result=[];
    for(let rx=Math.floor((x-radius)/SKY_REGION_SIZE);rx<=Math.floor((x+radius)/SKY_REGION_SIZE);rx++)
      for(let rz=Math.floor((z-radius)/SKY_REGION_SIZE);rz<=Math.floor((z+radius)/SKY_REGION_SIZE);rz++)
        for(const island of region(rx,rz))
          if(Math.abs(x-island.x)<=radius&&Math.abs(z-island.z)<=radius)result.push(island);
    return result;
  }
  const at=(x,z)=>remember(columns,`${x},${z}`,8192,()=>nearby(x,z)
    .flatMap(island=>{const column=shape(island,x,z);return column?[column]:[];})
    .sort((a,b)=>b.top-a.top));
  function rock(x,y,z){
    for(const column of at(x,z)){
      const block=geology(column,x,y,z);
      if(block!==air)return block;
    }
    return air;
  }

  // Jittered anchors span chunk boundaries. Every chunk replays the same
  // tree plan, with a stable ownership key for branches in neighboring chunks.
  function treePlan(gx,gz){
    return remember(trees,`${gx},${gz}`,512,()=>{
      const x=gx*5+Math.floor(roll(seed,gx,gz,300)*5);
      const z=gz*5+Math.floor(roll(seed,gx,gz,301)*5);
      const c=at(x,z)[0];
      if(!c||c.edge<.12||rock(x,c.top,z)===air)return null;
      const {top,bottom,island}=c;
      const selector=roll(seed,x,z,303),patch=noise(seed,x,z,12,302);
      const branch=[],hanging=[];
      if(selector<(.19+patch*.32)*(island.family===1?.33:1)){
        const height=3+Math.floor(roll(seed,x,z,304)*4);
        const trunk=Array.from({length:height},(_,i)=>i+1);
        if(trunk.every(dy=>rock(x,top+dy,z)===air)){
          const wood=island.family===2?G.aetherBark:BLOCK.WOOD;
          const leaf=island.family===2?G.moonLeaves:island.family===1?G.coldNeedles:BLOCK.LEAVES;
          for(const dy of trunk)branch.push([x,top+dy,z,wood]);
          const lean=roll(seed,x,z,305)>.5?1:-1;
          branch.push([x+lean,top+height-1,z,wood]);
          const wide=island.family===1?2:2+Math.floor(roll(seed,x,z,306)*2);
          for(let dy=-2;dy<=2;dy++)
            for(let dx=-wide;dx<=wide;dx++)for(let dz=-wide;dz<=wide;dz++){
              const canopy=Math.hypot(dx-lean*dy*.23,dz,dy*1.29);
              if(canopy<wide+.53+roll(seed,x+dx,z+dz,320+dy)*.67)
                branch.push([x+dx,top+height+dy,z+dz,leaf]);
            }
        }
      }
      if(c.edge<.55&&selector>.67&&rock(x,bottom,z)!==air){
        const length=1+Math.floor(roll(seed,x,z,332)*5);
        for(let i=1;i<=length;i++){
          if(rock(x,bottom-i,z)!==air)break;
          hanging.push([x,bottom-i,z,island.family===2&&i===1?289:381]);
        }
      }
      return {x,z,top,bottom,branch,hanging,key:`tree:${x},${z}`};
    });
  }

  function groundPlan(x,z){
    const c=at(x,z)[0];
    if(!c||c.edge<.035||rock(x,c.top,z)===air)return [];
    const t=roll(seed,x,z,340),patch=noise(seed,x,z,9,341),y=c.top+1;
    if(t>.988&&c.edge>.18)return [[x,y,z,c.island.family===2?295:306]];
    if(t>=patch*.30)return [];
    if((t<.011||t>=.036&&t<.047)&&rock(x,y,z)===air&&rock(x,y+1,z)===air){
      return t<.011?[[x,y,z,M.flower],[x,y+1,z,M['flower-petal']]]:
        [[x,y,z,M.heather],[x,y+1,z,M['heather-tip']]];
    }
    return [[x,y,z,t<.036?287:c.island.family===1&&t<.053?270:VEILREACH_GRASS_ID]];
  }

  function vegetation(cx,cz){
    return remember(plants,`${cx},${cz}`,72,()=>{
      const cells=new Map(),x0=cx*16,z0=cz*16;
      const emit=([x,y,z,id],owner)=>{
        if(x<x0||x>x0+15||z<z0||z>z0+15||rock(x,y,z)!==air)return;
        const key=worldKey(x,y,z);
        if(!cells.has(key)||id===BLOCK.WOOD||id===G.aetherBark)cells.set(key,{id,owner});
      };
      for(let gz=Math.floor((z0-5)/5);gz<=Math.floor((z0+20)/5);gz++)
        for(let gx=Math.floor((x0-5)/5);gx<=Math.floor((x0+20)/5);gx++){
          const plan=treePlan(gx,gz);
          if(!plan)continue;
          for(const cell of plan.branch)emit(cell,plan.key);
          for(const cell of plan.hanging)emit(cell,plan.key);
        }
      for(let x=x0;x<x0+16;x++)for(let z=z0;z<z0+16;z++){
        const plan=groundPlan(x,z),owner=`ground:${x},${z}`;
        if(plan.length&&cells.has(worldKey(...plan[0].slice(0,3))))continue;
        for(const cell of plan)emit(cell,owner);
      }
      return cells;
    });
  }

  function vegetationAt(x,y,z){
    return vegetation(chunkCoord(x),chunkCoord(z)).get(worldKey(x,y,z));
  }

  function supportedCells(x,y,z){
    const cells=new Map();
    const collect=(rows,owner)=>{
      for(const [px,py,pz,id] of rows){
        const cell=vegetationAt(px,py,pz);
        if(cell?.owner===owner&&cell.id===id)cells.set(worldKey(px,py,pz),[px,py,pz]);
      }
    };
    const tree=treePlan(Math.floor(x/5),Math.floor(z/5));
    const plant=vegetationAt(x,y,z);
    if(tree?.x===x&&tree.z===z){
      if(y===tree.top||(y<=tree.top+3&&plant?.owner===tree.key&&
         (plant.id===BLOCK.WOOD||plant.id===G.aetherBark)))
        collect(tree.branch.filter(row=>row[1]>=y),tree.key);
      if(y===tree.bottom||y===tree.bottom-1&&plant?.owner===tree.key)
        collect(tree.hanging,tree.key);
    }
    const ground=groundPlan(x,z);
    if(ground.length&&(y===ground[0][1]-1||y===ground[0][1]))
      collect(ground,`ground:${x},${z}`);
    return [...cells.values()];
  }

  function sectionMask(cx,cz){
    return remember(occupancy,`${cx},${cz}`,128,()=>{
      let mask=0;
      const candidates=nearby(cx*16+8,cz*16+8,maxRadius+16);
      if(!candidates.some(island=>{
        const reach=Math.max(island.rx,island.rz)*1.34+13;
        return Math.abs(cx*16+8-island.x)<reach&&Math.abs(cz*16+8-island.z)<reach;
      }))return mask;
      for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
        for(const column of at(x,z)){
          const first=runtimeSectionForY(column.bottom),last=runtimeSectionForY(column.top);
          for(let section=first;section<=last;section++){
            const bit=1<<(section-1);
            if(mask&bit)continue;
            const {minY,maxY}=runtimeSectionBounds(section);
            for(let y=Math.min(column.top,maxY);y>=Math.max(column.bottom,minY);y--){
              if(geology(column,x,y,z)===air)continue;
              mask|=bit;
              break;
            }
          }
        }
      }
      for(const key of vegetation(cx,cz).keys()){
        const y=Number(key.split(',')[1]);
        mask|=1<<(runtimeSectionForY(y)-1);
      }
      return mask;
    });
  }
  return Object.freeze({region,nearby,shapeAt:shape,rockMaterial:geology,sectionMask,supportedCells,
    topAt(x,z){return at(x,z)[0]?.top??null;},
    get(x,y,z){
      if(y<naturalMinY||y>naturalMaxY)return air;
      const cx=chunkCoord(x),cz=chunkCoord(z),section=runtimeSectionForY(y);
      if(!(sectionMask(cx,cz)&1<<(section-1)))return air;
      return rock(x,y,z)||vegetationAt(x,y,z)?.id||air;
    },
    stats:()=>({regions:regions.size,columns:columns.size,vegetation:plants.size,occupancy:occupancy.size,trees:trees.size})});
}
