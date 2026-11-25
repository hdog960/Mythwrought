// Mountain V8 only. Pure read-only adapter. NEVER dispatch into V7 worlds.
// The caller supplies authoritative terrain, biome and original-world block readers.
import {planMountainV8Candidate} from './mountain-v8-candidate.mjs';

const neighborOffsets=Object.freeze([[4,0],[-4,0],[0,4],[0,-4]]);
const validInteger=n=>Number.isInteger(n)&&Number.isSafeInteger(n);
const hash=(x,z,seed)=>{
  let h=Math.imul(x|0,0x7feb352d)^Math.imul(z|0,0x846ca68b)^(seed|0);
  h=Math.imul(h^(h>>>16),0x45d9f3b);
  return ((h^(h>>>16))>>>0)/4294967296;
};

/** One guaranteed candidate coordinate per tile, independently of loop order. */
export function mountainV8TileRoot(tileX,tileZ,seed){
  if(![tileX,tileZ,seed].every(validInteger)||seed!==(seed|0))return null;
  const rootX=tileX*8+2+Math.floor(hash(tileX,tileZ,seed+7921)*4);
  const rootZ=tileZ*8+2+Math.floor(hash(tileX,tileZ,seed+7927)*4);
  // Never alias a remote tile into an imprecise coordinate via IEEE-754.
  if(!validInteger(rootX)||!validInteger(rootZ)||
     Math.floor(rootX/8)!==tileX||Math.floor(rootZ/8)!==tileZ)return null;
  return Object.freeze({rootX,rootZ});
}

/** Returns null on missing or protected provenance. All callbacks must be read-only.
 * biomeAt(x,z,seed) => {name,weight}; heightAt(x,z,seed) => real old surface.
 * readBlock(x,y,z) => unedited original-world numeric block ID.
 * AIR/GRASS/DIRT/STONE are supplied by the owner; no guessed material IDs.
 */
export function surveyMountainV8Column({x,z,seed,worldMaxY=30,biomeAt,
    heightAt,readBlock,ids,protectedAt=()=>false,onVeto}={}){
  if(![x,z,seed,worldMaxY].every(validInteger)||
     ![biomeAt,heightAt,readBlock,protectedAt].every(f=>typeof f==='function')||
     !ids||![ids.AIR,ids.GRASS,ids.DIRT,ids.STONE].every(validInteger)||
     new Set([ids.AIR,ids.GRASS,ids.DIRT,ids.STONE]).size!==4||
     (onVeto!==undefined&&typeof onVeto!=='function'))return null;
  const veto=(reason,px=x,pz=z,y=null)=>{
    onVeto?.(Object.freeze({reason,x:px,z:pz,y}));
    return null;
  };
  const biome=biomeAt(x,z,seed),legacyTop=heightAt(x,z,seed);
  if(biome?.name!=='mountain'||!(biome.weight>=.82))
    return veto('biome-boundary');
  if(!validInteger(legacyTop)||legacyTop<2||legacyTop>=worldMaxY-2)
    return veto('height-unavailable');
  // A nearby cave, landmark, foreign cap or biome seam is not a valid build site.
  const probes=[[x,z],...neighborOffsets.map(([dx,dz])=>[x+dx,z+dz])];
  const neighboring=[],neighborWeights=[];
  for(const [px,pz] of probes){
    const climate=biomeAt(px,pz,seed),old=heightAt(px,pz,seed);
    if(climate?.name!=='mountain'||!(climate.weight>=.82))
      return veto('biome-boundary',px,pz);
    if(!validInteger(old)||old<2||old>=worldMaxY-2)
      return veto('height-unavailable',px,pz);
    for(let depth=0;depth<=3;depth++)
      if(protectedAt(px,old-depth,pz))
        return veto('protected-substrate',px,pz,old-depth);
    if(readBlock(px,old,pz)!==ids.GRASS)
      return veto('non-grass-original-cap',px,pz,old);
    for(let depth=1;depth<=3;depth++){
      const original=readBlock(px,old-depth,pz);
      if(original!==ids.DIRT&&original!==ids.STONE)
        return veto(original===ids.AIR?'cave-air':'foreign-substrate',
          px,pz,old-depth);
    }
    // Inspect the complete finite uplift envelope: no overwrites of authored AIR,
    // caves, trees, settlements, structures or unknown voxels.
    for(let y=old+1;y<=worldMaxY-2;y++){
      if(protectedAt(px,y,pz))return veto('protected-uplift',px,pz,y);
      if(readBlock(px,y,pz)!==ids.AIR)
        return veto('occupied-uplift',px,pz,y);
    }
    if(px!==x||pz!==z){
      neighboring.push(old);neighborWeights.push(climate.weight);
    }
  }
  const result=planMountainV8Candidate({x,z,seed,legacyTop,
    biomeWeight:biome.weight,neighborTops:neighboring,
    neighborBiomeWeights:neighborWeights,
    biomeName:biome.name,worldMaxY});
  if(!result)return veto('proposal-unavailable');
  // Intentional no in-world tree placement. A bounded, descriptive vegetation
  // proposal prevents canopy on cliffs, rock, snow, steeps or protected cells.
  const tileX=Math.floor(x/8),tileZ=Math.floor(z/8);
  const root=mountainV8TileRoot(tileX,tileZ,seed);
  if(!root)return veto('unsafe-tile');
  const {rootX,rootZ}=root;
  // Exactly one site may own this tile; unlike the earlier tile-wide roll,
  // neighboring eligible columns must not all materialize the same plant.
  const chosen=x===rootX&&z===rootZ;
  const chance=hash(tileX,tileZ,seed+7919);
  const kind=chosen&&result.cap==='alpine-grass'&&result.slope<.35?
    chance<.14?'dwarf-conifer':chance<.42?'alpine-flower':
    chance<.62?'low-heather':null:null;
  return Object.freeze({...result,vegetation:kind,
    sourceProvenance:Object.freeze({legacyTop,neighborTops:Object.freeze([...neighboring]),
      originalGroundIntact:true,protectedEnvelopeClear:true,
      neighborBiomeWeights:Object.freeze([...neighborWeights])}),
    vegetationSite:Object.freeze({tileX,tileZ,rootX,rootZ,chosen}),
    estimatedExtraCells:kind==='dwarf-conifer'?18:kind?2:0,
    // Descriptive only; future renderer/owner must enforce actual mesh budgets.
    safeToIntegrate:false});
}
