// Isolated deterministic forest, not a registered production generator.
import {FrostboundS1Refined} from './s1-refined-candidate.mjs';
import {FAMILIES,admitTree} from './s2-trees.mjs';
import {createUpperNaturalRegistry} from '../world-height-natural-contract.mjs';
import {physicalRegionAt} from '../world-height.mjs';
import {terrainHeight} from '../voxel.mjs';
import {v6BiomeAt} from '../manual-biomes/v6-balanced-biomes.mjs';
const mod=(n,d)=>((n%d)+d)%d;
const key=(x,y,z)=>`${x},${y},${z}`;
function roll(x,z,seed,salt){let h=Math.imul(x^salt,0x7feb352d)^Math.imul(z^seed,0x846ca68b);h=Math.imul(h^(h>>>16),0x45d9f3b);return ((h^(h>>>16))>>>0)/4294967296;}
const normal=['snowpine','frostspire','silverbirch','glacierFir','winterwillow','blackfrost'];
// Select only feasible surface-family ranges before sampling height. Upper
// reservations still draw from the complete approved range; never trim a tree.
export function surfaceTreeChoice(floor,familyRoll,heightRoll){
 const pool=['snowpine','snowpine','snowpine','silverbirch','silverbirch','silverbirch','winterwillow','winterwillow','blackfrost','blackfrost'].filter(f=>FAMILIES[f][0]<=19-floor);
 if(!pool.length)return null;
 const family=pool[Math.floor(familyRoll*pool.length)], [lo,hi]=FAMILIES[family];
 return {family,height:lo+Math.floor(heightRoll*(Math.min(hi,19-floor)-lo+1))};
}
export function forestReservation(cx,cz,seed){
 const sx=mod(seed,12),sz=mod(seed>>>4,12),dx=mod(cx-sx,12),dz=mod(cz-sz,12);
 if(dx===0&&dz===0)return 'ancient';
 // Any five consecutive chunk indices contain at most two stride-three
 // sites. Each ordinary upper tree uses <=2 owners; an ancient root uses
 // <=4 and excludes all other upper sites that could share a 5x5 window.
 if(Math.min(dx,12-dx)<=4&&Math.min(dz,12-dz)<=4)return 'surface';
 return mod(cx-sx,3)===0&&mod(cz-sz,3)===0?'upper':'surface';
}
// Existing species-specific vertical logs only at non-junction shaft cells.
// Full-cube wood stays at horizontal branch junctions, preserving contact.
export function winterTreeMaterials(family,cells,x,z){
 const bark={snowpine:370,frostspire:371,silverbirch:369,glacierFir:370,winterwillow:372,frostfather:4,blackfrost:408}[family];
 const occupied=new Set(cells.map(c=>key(...c.slice(0,3))));
 return cells.map(([a,b,c,id])=>[a,b,c,id===406&&(family==='silverbirch'||family==='glacierFir')&&!occupied.has(key(a,b+1,c))?407:id===4&&(bark===408||(a===x&&c===z&&![[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>occupied.has(key(a+dx,b,c+dz)))))?bark:id]);
}
export class FrostboundForest extends FrostboundS1Refined{
 constructor(seed,options){super(seed,options);this._forest=new Map();this._forestLimit=64;
  const registry=createUpperNaturalRegistry(),generator='mythwrought-upper-frostbound-forest-research',sourceVersion='s2-lattice-v2';
  registry.register(generator,sourceVersion,p=>({...p,get:(x,y,z)=>this._forestCell(x,y,z),occupied:k=>this._forestOwner(k),revision:()=>0}));
  this._upperForest=registry.open({kind:'mythwrought-upper-source-profile',version:1,seed,generator,sourceVersion});
 }
 _sourceBlock(x,y,z){return super.naturalAndLandmarkBlock(x,y,z);}
 forestChunk(cx,cz){
  const k=`${cx},${cz}`;if(this._forest.has(k))return this._forest.get(k);
  const row={site:null,cells:new Map(),owners:new Set()};
  const x=cx*16+8,z=cz*16+8,r=v6BiomeAt(x,z,this.seed),reservation=forestReservation(cx,cz,this.seed);
  if(r?.name==='snow'&&r.weight>=.65&&roll(cx,cz,this.seed,81)<.88){
   const p=this._columnPlan(x,z),floor=p.size?Math.max(...p.keys()):terrainHeight(x,z,this.seed);
   const f=roll(cx,cz,this.seed,38),h=roll(cx,cz,this.seed,97);
   const upperFamily=reservation==='ancient'?'frostfather':normal[Math.floor(f*normal.length)];
   const [lo,hi]=FAMILIES[upperFamily];
   const choice=reservation==='surface'?surfaceTreeChoice(floor,f,h):{family:upperFamily,height:lo+Math.floor(h*(hi-lo+1))};
   const {family,height}=choice??{};
   // No height clipping or substitution after a failed admission.
   const capacity=reservation==='ancient'?4:reservation==='upper'?2:0;
   if(choice&&(capacity||floor+height<=19)){
    const source={seed:this.seed,environmentCaves:this.environmentCaves,naturalAndLandmarkBlock:(a,b,c)=>this._sourceBlock(a,b,c)};
    const tree=admitTree(source,family,x,floor,z,height);
    if(tree){const cells=winterTreeMaterials(family,tree,x,z);const owners=new Set(cells.filter(c=>c[1]>=20).map(c=>physicalRegionAt(...c.slice(0,3)).key));
     if(owners.size<=capacity&&cells.every(c=>Math.floor(c[0]/16)===cx&&Math.floor(c[2]/16)===cz)){
      row.site=Object.freeze({family,x,floor,z,height,reservation});row.owners=owners;row.cells=new Map(cells.map(([a,b,c,id])=>[key(a,b,c),id]));
     }
    }
   }
  }
  this._forest.set(k,row);if(this._forest.size>this._forestLimit)this._forest.delete(this._forest.keys().next().value);return row;
 }
 _forestCell(x,y,z){if(![x,y,z].every(Number.isSafeInteger)||y<3||y>77)return 0;return this.forestChunk(Math.floor(x/16),Math.floor(z/16)).cells.get(key(x,y,z))??0;}
 _forestOwner(k){const [cx,cz,s]=k.slice(4).split(',').map(Number);if(s>3)return false;return this.forestChunk(cx,cz).owners.has(k);}
 upperNaturalOccupied(k){return this._upperForest.occupied(k);}
 get upperNaturalRevision(){return this._upperForest.revision();}
 naturalAndLandmarkBlock(x,y,z){const prior=this._sourceBlock(x,y,z);if(prior||!this._upperForest||y<3)return prior;return y>=20?this._upperForest.get(x,y,z):this._forestCell(x,y,z);}
}
