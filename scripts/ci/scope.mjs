// Fail closed: unknown/shared paths run full game verification.
export const LEGACY_LANES=Object.freeze(['pack-1','pack-2','pack-3','pack-4','pack-5','roadmap-1','roadmap-2','roadmap-3','roadmap-4']);
export const BUILDER_LANES=Object.freeze(['roadmap-1a','roadmap-1b','roadmap-2a','roadmap-2b','roadmap-3a','roadmap-3b','roadmap-4a','roadmap-4b']);
export const LANES=Object.freeze([...LEGACY_LANES,...BUILDER_LANES]);
export function laneForPath(path){
 if(typeof path!=='string'||path.includes('\\')||path.includes('\n')||path.split('/').some(x=>!x||x==='.'||x==='..'))return null;
 const p=/^(?:src|tests)\/block-packs\/(pack-[1-5])\/.+/.exec(path);if(p)return p[1];
 const b=/^(?:src|tests|docs)\/building-pool\/(roadmap-[1-4](?:[ab])?)\/.+/.exec(path);return b?b[1]:null;
}
export function classifyPaths(paths){
 if(!Array.isArray(paths)||!paths.length)return {mode:'full',lanes:[],reason:'empty-or-unavailable-diff'};
 const owners=new Set();
 for(const path of paths){const lane=laneForPath(path);if(!lane)return {mode:'full',lanes:[],reason:'shared-or-unrecognized-path'};owners.add(lane);}
 const lanes=LANES.filter(x=>owners.has(x));
 if(paths.every(x=>/^docs\/building-pool\/roadmap-[1-4][ab]\/.+\.md$/.test(x)))
  return {mode:'docs-only',lanes,reason:'exclusive-builder-markdown-only'};
 return {mode:'isolated',lanes,reason:'exclusive-lane-paths-only'};
}
