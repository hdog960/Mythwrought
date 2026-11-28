// Source-side admission only; use the host's existing physical owner lookup.
// No owner registry, terrain edits, machinery access or automatic generation.
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&
  Number.isSafeInteger(p[1])&&p[1]>=-210&&p[1]<=256&&Number.isSafeInteger(p[2]);
export function createResonanceOwnerAuthorization({physicalRegionAt,isOwnerLoaded,
  isLoaded,resolveAnchor,canDischarge}={}){
  if([physicalRegionAt,isOwnerLoaded,isLoaded,resolveAnchor,canDischarge].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit physical ownership and containment callbacks required');
  return function authorize(descriptor,store){
    if(!descriptor||!store||descriptor.store?.storeId!==store.storeId||
      descriptor.store?.anchor!==store.anchor||!point(descriptor.point))return false;
    // Resolve the exact reservoir identity, never infer a location from its ID.
    const anchor=resolveAnchor(store.anchor,store.storeId);
    if(!anchor||anchor.anchor!==store.anchor||anchor.storeId!==store.storeId||!point(anchor.point))return false;
    const source=Object.freeze([anchor.point[0],anchor.point[1],anchor.point[2]]);
    const outlet=Object.freeze([descriptor.point[0],descriptor.point[1],descriptor.point[2]]);
    const sourceOwner=physicalRegionAt(...source),outletOwner=physicalRegionAt(...outlet);
    if(!sourceOwner||!outletOwner||typeof sourceOwner.key!=='string'||typeof outletOwner.key!=='string'||
      isOwnerLoaded(sourceOwner)!==true||isOwnerLoaded(outletOwner)!==true||
      isLoaded(...source)!==true||isLoaded(...outlet)!==true)return false;
    // A reservoir anchor may be solid. The actual core checks outlet openness;
    // the host independently verifies containment, identity and permission.
    return canDischarge(Object.freeze({descriptor,store,source,outlet,sourceOwner,outletOwner}))===true;
  };
}
