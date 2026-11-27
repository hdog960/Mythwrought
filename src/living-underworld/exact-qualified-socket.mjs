// Exact qualified Phase49 fixture, copied from independently verified
// artifact15212008362 report.json. No search or substitute route.
// Detached native qualification only (Node crypto; never production import).
import {createHash} from 'node:crypto';
import {compileGalleryConstructionFootprint} from './combined-stair-footprints.mjs';
const sha=a=>createHash('sha256').update(a).digest('hex');
const key=p=>[p.x,p.y,p.z].join(',');
const steps='SssSEeeENnNNEeEESsSSWwWWNnNNEeEESsSSWwWWNnNNEeEESsSSWwWWNnNNEeEESsSSWwWWNnNNEeEESsSSWwWWNnNES';
const dirs={E:[1,0],W:[-1,0],S:[0,1],N:[0,-1]};
function decodeRoute(start, moves){
 const route=[start];
 for(const ch of moves){
  const [dx,dz]=dirs[ch.toUpperCase()], p=route.at(-1);
  route.push({x:p.x+dx,y:p.y+Number(ch===ch.toLowerCase()),z:p.z+dz});
 }
 return route;
}
function compileRoute(route){
 return compileGalleryConstructionFootprint({ok:true,segments:route.slice(1).map((b,i)=>({a:route[i],b}))});
}
export function exactQualifiedSocket(){
 const route=decodeRoute({x:-630,y:-31,z:-2152},steps);
 if(route.length!==94||sha(route.map(key).join('\n'))!=='706e172a1fa1d703ce87ec2dfd6cac685e1088861257b9329eaf42a4da1a947a')throw Error('PHASE49_ROUTE_DIGEST');
 const f=compileRoute(route);
 if(!f.ok||f.support.size!==234||f.clearance.size!==702||
  sha([...f.support].sort().join('\n'))!=='e776065ac93967c07618aad7caf66100ab5843fd612b318f9b97d05d6ea99f4a'||
  sha([...f.clearance].sort().join('\n'))!=='477ad0e9595865cd32e19c0aec3a0c042c09822e0451b7643b535ff510f2e1be')throw Error('PHASE49_FOOTPRINT_DIGEST');
 const approach=[[-625,-31,-2153],[-626,-31,-2153],[-626,-31,-2152],[-627,-31,-2152],[-628,-31,-2152],[-629,-31,-2152],[-630,-31,-2152]].map(([x,feet,z])=>({x,feet,z}));
 const joined=[...approach,...route.slice(1).map(({x,y,z})=>({x,feet:y,z}))];
 if(joined.length!==100)throw Error('PHASE49_JOIN_COUNT');
 return {route,joined,support:f.support,air:f.clearance,artifact:15212008362,routeDigestVerified:true,footprintDigestVerified:true};
}

// Exact Phase 50 alternative 9 from artifact 15221643500.
export function exactQualifiedInterlayer(){
 const moves='eeeENnnnNWwWWSSssSEeEEENnnNWwWWSSssSEeEEENnnNWwWWSSsSsSEeEEENnnNWwWWSSssSEeEEENnnNWwWWSSssSEeEEENnNENnnNWww';
 const route=decodeRoute({x:-632,y:-70,z:-2155},moves);
 if(route.length!==108||sha(route.map(key).join('\n'))!=='7bee3bcaff8c822542bdaa1aec2eabcc27db17371897f3d8c851014ed169a0de')throw Error('PHASE50_ROUTE_DIGEST');
 const footprint=compileRoute(route);
 if(!footprint.ok||footprint.support.size!==277||footprint.clearance.size!==831||
  sha([...footprint.support].sort().join('\n'))!=='20718db3354dea75b99187945cd4d575ea1507c2584ad0aa9733e5bedde2d157'||
  sha([...footprint.clearance].sort().join('\n'))!=='0e307c6415cb46f400941b754abad447bed685bae7cfd902818d6036f43cc16b')throw Error('PHASE50_FOOTPRINT_DIGEST');
 const joined=route.map(({x,y,z})=>({x,feet:y,z}));
 return {route,joined,support:footprint.support,air:footprint.clearance,artifact:15221643500};
}
