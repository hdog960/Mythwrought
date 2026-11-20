// :24 E pebble scatter. Source-only opt-in non-block physical geometry.
export const PEBBLE_SCATTER_SCENE_ID = 'nonblock:e:pebble-scatter';
const validAnchor = a => Array.isArray(a) && a.length === 3 && a.every(Number.isSafeInteger);
function hash(s) { let h=2166136261; for (const c of s) h=Math.imul(h^c.charCodeAt(0),16777619); return h>>>0; }
export function makePebbleScatter({seed,anchor,variant=0}={}) {
  if (!Number.isSafeInteger(seed) || !validAnchor(anchor) || !Number.isInteger(variant) || variant<0 || variant>3)
    throw new TypeError('invalid pebble scatter identity');
  const sceneId=PEBBLE_SCATTER_SCENE_ID;
  const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
  const positions=[], selectionAabbs=[], count=3+variant, phase=hash(instanceKey)/4294967296*Math.PI*2;
  const emit=(a,b,c)=>positions.push(...a,...b,...c);
  // Each pebble is an irregular six-vertex low-poly stone, not a cube or billboard.
  for(let i=0;i<count;i++) {
    const theta=phase+i*2.3999632297, radius=.055+.047*(i%3);
    const x=Math.cos(theta)*radius,z=Math.sin(theta)*radius;
    const rx=.026+.007*((i+variant)%3),rz=.022+.006*((i+seed%3+3)%3),h=.025+.008*((i+variant)%3);
    const top=[x+.004,h,z-.003],bottom=[x,0,z];
    const ring=[[x+rx,.008,z],[x,.006,z+rz],[x-rx,.007,z],[x,.005,z-rz]];
    for(let j=0;j<4;j++){const next=(j+1)%4;emit(top,ring[j],ring[next]);emit(bottom,ring[next],ring[j]);}
    selectionAabbs.push({min:[x-rx-.003,0,z-rz-.003],max:[x+rx+.003,h+.003,z+rz+.003]});
  }
  const triangleCount=positions.length/9;
  if(triangleCount>48)throw new Error('pebble triangle cap');
  return Object.freeze({
    contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
    mesh:{primitive:'triangles',positions,triangleCount},selectionAabbs,
    collisionIntent:'pass-through',
    attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
    breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
    persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
    spawn:'explicit-opt-in-only',
    render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:48,lodTriangles:[48,24,8]},
    integrationStatus:'source-candidate-only'
  });
}
export function validatePebbleScatter(candidate) {
  if(!candidate || !validAnchor(candidate.anchor))throw new TypeError('invalid pebble scatter');
  const canonical=makePebbleScatter({seed:candidate.seed,anchor:candidate.anchor,variant:candidate.variant});
  for(const key of ['contract','sceneId','instanceKey','mesh','selectionAabbs','collisionIntent','attachment','breakIntent','persistence','spawn','render','integrationStatus'])
    if(JSON.stringify(candidate[key])!==JSON.stringify(canonical[key]))throw new TypeError('noncanonical pebble scatter '+key);
  return true;
}
