/**
 * Game-facing, opt-in Pack 5 construction actions. Uses the genuine schema-1
 * world only for read-only supports and legacy ray occlusion. No new block IDs.
 * A caller must explicitly wire this into a reviewed game mode.
 */
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,raycast as legacyRaycast} from '../voxel.mjs';
import {createPack5ConstructionLayer} from './construction-layer.mjs';
import {resolvePack5BuilderAsset} from './catalog.mjs';
import {orientedParts,rotateCellOffset} from '../block-packs/pack-5/fixture.mjs';
import {loadPack5SidecarSafe,savePack5SidecarSafe} from './sidecar-storage.mjs';
export const PACK5_REACH=6;
const validVec3=v=>Array.isArray(v)&&v.length===3&&v.every(Number.isFinite);
const playerBounds=p=>{
  if(!p||![p.x,p.feet,p.z].every(Number.isFinite))throw Error('Invalid Pack 5 builder player');
  return [p.x-BODY_RADIUS,p.feet,p.z-BODY_RADIUS,p.x+BODY_RADIUS,p.feet+BODY_HEIGHT,p.z+BODY_RADIUS];
};
export function createPack5LiveAdapter(world,{storage=null}={}){
  const layer=createPack5ConstructionLayer(world);
  const load=storage?loadPack5SidecarSafe(storage,layer):{source:'new',recovered:false,count:0};
  const persist=action=>{
    const old=layer.snapshot(),result=action();
    if(result===false||result?.ok===false)return result;
    if(storage){
      try{savePack5SidecarSafe(storage,layer);}
      catch(error){
        // Rejected storage must not produce a silently unsaved game edit.
        layer.restore(old);
        return {ok:false,reason:'Pack 5 save failed; placement rolled back',detail:String(error)};
      }
    }
    return result;
  };
  const api={
    layer,load,
    collision(box){return layer.collidesPack5(box);},
    // Live terrain mining must never remove the backing support beneath an
    // existing floor, wall or ceiling furnishing or a multi-cell floor piece.
    supportsLegacyCell(cell){
      if(!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger))
        throw Error('Invalid Pack 5 backing query');
      for(const row of layer.list()){
        const {descriptor}=resolvePack5BuilderAsset(row.symbolicId,row.variant);
        let required=[];
        if(descriptor.attachment==='floor')
          required=orientedParts(descriptor,row.rotation).map(p=>[
            row.anchor[0]+p.cell[0],row.anchor[1]+p.cell[1]-1,row.anchor[2]+p.cell[2]]);
        if(descriptor.attachment==='ceiling')
          required=[[row.anchor[0],row.anchor[1]+1,row.anchor[2]]];
        if(descriptor.attachment==='wall'){
          const back=rotateCellOffset([0,0,-1],row.rotation);
          required=[row.anchor.map((n,i)=>n+back[i])];
        }
        if(required.some(c=>c.every((n,i)=>n===cell[i])))return true;
      }
      return false;
    },
    inspect(origin,direction){
      if(!validVec3(origin)||!validVec3(direction))throw Error('Invalid Pack 5 builder aim');
      const shape=layer.raycast(origin,direction,PACK5_REACH),
        legacy=legacyRaycast(world,origin,direction,PACK5_REACH);
      return {shape,legacy,adjacent:legacy?.adjacent??null};
    },
    placeFacing(origin,direction,symbolicId,rotation,variant,player){
      const {shape,legacy,adjacent}=api.inspect(origin,direction);
      if(!legacy||!adjacent)return {ok:false,reason:'Aim at a nearby physical support'};
      if(shape&&shape.distance<=legacy.distance+1e-8)
        return {ok:false,reason:'Cannot place through another shaped object'};
      // An arbitrary up/down/wall-facing hit supplies the adjacent target,
      // but the authored attachment rule still independently validates backing.
      return persist(()=>layer.place(symbolicId,adjacent,rotation,variant,
        {playerBox:playerBounds(player)}));
    },
    removeFacing(origin,direction){
      const {shape}=api.inspect(origin,direction);
      if(!shape)return {ok:false,reason:'No Pack 5 shaped object targeted'};
      const ok=persist(()=>layer.remove(shape.cell));
      return typeof ok==='object'?ok:{ok,reason:ok?'':'No placed shape'};
    },
    save(){if(!storage)throw Error('No Pack 5 sidecar storage supplied');
      return savePack5SidecarSafe(storage,layer);},
    snapshot(){return layer.snapshot();}
  };
  return Object.freeze(api);
}
