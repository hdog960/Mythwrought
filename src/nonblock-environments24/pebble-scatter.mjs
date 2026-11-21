// :24 E pebble scatter. Source-only opt-in non-block physical geometry.
export const PEBBLE_SCATTER_SCENE_ID = 'nonblock:e:pebble-scatter';
const validAnchor = a => Array.isArray(a) && a.length === 3 && a.every(Number.isSafeInteger);
function hash(s) { let h=2166136261; for (const c of s) h=Math.imul(h^c.charCodeAt(0),16777619); return h>>>0; }
export function makePebbleScatter({seed,anchor,variant=0}={}) {
  if (!Number.isSafeInteger(seed) || !validAnchor(anchor) || !Number.isInteger(variant) || variant<0 || variant>3)
    throw new TypeError('invalid pebble scatter identity');
  const sceneId=PEBBLE_SCATTER_SCENE_ID;
  const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
  const positions=[],materials=[],selectionAabbs=[],count=3+variant;
  const phase=hash(instanceKey)/4294967296*Math.PI*2;
  const emit=(a,b,c,material)=>{positions.push(...a,...b,...c);materials.push(material);};
  for(let i=0;i<count;i++) {
    const theta=phase+i*2.3999632297,spread=.054+.047*(i%3);
    const x=Math.cos(theta)*spread,z=Math.sin(theta)*spread;
    const rx=.028+.008*((i+variant)%3),rz=.024+.007*((i+seed%3+3)%3);
    const h=.023+.006*((i+variant)%3);
    const heading=theta*.71+i*.16;
    const tiers=[
      [[1,.16],[-.12,1],[-.92,-.10],[.10,-.91]],
      [[.59,.19],[-.20,.57],[-.55,-.14],[.18,-.61]]
    ];
    const [foot,plate]=tiers.map((tier,level)=>tier.map(([mx,mz],edge)=>{
      const u=mx*rx,v=mz*rz;
      return [
        x+u*Math.cos(heading)-v*Math.sin(heading)+level*.003,
        level?h*(.75+.08*((edge+i)%3)):0,
        z+u*Math.sin(heading)+v*Math.cos(heading)-level*.002
      ];
    }));
    for(let edge=0;edge<4;edge++){
      const next=(edge+1)%4,material=edge===i%4?1:0;
      emit(foot[edge],plate[edge],foot[next],material);
      emit(foot[next],plate[edge],plate[next],material);
    }
    emit(plate[0],plate[2],plate[1],2);
    emit(plate[0],plate[3],plate[2],i%2===0?2:1);
    emit(foot[0],foot[1],foot[2],0);
    emit(foot[0],foot[2],foot[3],0);
    const points=[...foot,...plate];
    selectionAabbs.push({
      min:[0,1,2].map(axis=>Math.min(...points.map(point=>point[axis]))-.003),
      max:[0,1,2].map(axis=>Math.max(...points.map(point=>point[axis]))+.003)
    });
  }
  const triangleCount=positions.length/9;
  if(triangleCount>72)throw new Error('pebble triangle cap');
  return Object.freeze({
    contract:'nonblock-object-v1-proposal-24',sceneId,instanceKey,seed,anchor:[...anchor],variant,
    mesh:{primitive:'triangles',positions,materials,triangleCount},selectionAabbs,
    collisionIntent:'pass-through',
    attachment:{face:'ground',requiresSolid:true,requiresClear:true,supportOffset:[0,-1,0]},
    breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
    persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
    spawn:'explicit-opt-in-only',
    render:{batchKey:sceneId+':'+variant,instanced:true,maxInstancesPerBatch:128,maxTrianglesPerInstance:72,lodTriangles:[72,36,12]},
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
