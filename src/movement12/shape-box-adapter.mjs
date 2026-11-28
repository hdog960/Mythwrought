// Source-only geometry contract: never query or modify production terrain.
// Accepts actual axis-aligned shape bounds, rejects unknown/rotated geometry.
export function normalizeShapeBoxes(shapes,{maxBoxes=4096}={}) {
 const fail=(reason,index=-1)=>({ok:false,reason,index,boxes:[]});
 if(!Array.isArray(shapes))return fail('missing-shapes');
 if(!Number.isSafeInteger(maxBoxes)||maxBoxes<1||shapes.length>maxBoxes)return fail('shape-budget');
 const boxes=[];
 for(let i=0;i<shapes.length;i++){
  const s=shapes[i];
  if(!s||s.kind!=='aabb'||!s.min||!s.max)return fail('unsupported-shape',i);
  if(!['x','y','z'].every(a=>Number.isFinite(s.min[a])&&Number.isFinite(s.max[a])&&s.min[a]<s.max[a]))return fail('invalid-shape-bounds',i);
  boxes.push({min:{x:s.min.x,y:s.min.y,z:s.min.z},max:{x:s.max.x,y:s.max.y,z:s.max.z}});
 }
 return {ok:true,reason:'normalized',boxes};
}