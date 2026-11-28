// FD0/FD1 isolated candidate planner. No VoxelWorld mount, reservation mutation or save write.
// Region and rarity constants are provisional research parameters, not approved balance.
export const FD_VERSION=1, REGION=4096, JITTER=512, MAX_REGION=500000;
function validRegion(n){return Number.isSafeInteger(n)&&Math.abs(n)<=MAX_REGION;}

function hash(seed,rx,rz,salt){let h=(seed^Math.imul(rx,0x9e3779b1)^Math.imul(rz,0x85ebca77)^salt)|0;h=Math.imul(h^(h>>>16),0x7feb352d);h=Math.imul(h^(h>>>15),0x846ca68b);return (h^(h>>>16))>>>0;}

export function candidateForRegion(seed,rx,rz){
 if(!Number.isInteger(seed)||seed!==(seed|0)||!validRegion(rx)||!validRegion(rz))throw new TypeError("Invalid dungeon seed or region");
 if(hash(seed,rx,rz,0x41a7)%4!==0)return null;
 const x=rx*REGION+REGION/2+(hash(seed,rx,rz,0x1781)%(2*JITTER+1))-JITTER;
 const z=rz*REGION+REGION/2+(hash(seed,rx,rz,0x53b9)%(2*JITTER+1))-JITTER;
 const floors=3+hash(seed,rx,rz,0x9a12)%5;
 const topY=-24-hash(seed,rx,rz,0x6711)%70;
 const width=192+16*(hash(seed,rx,rz,0x2712)%5);
 const length=192+16*(hash(seed,rx,rz,0x7391)%5);
 const bounds=Object.freeze({minX:x-width/2,maxX:x+width/2-1,minY:topY-floors*12+1,maxY:topY,minZ:z-length/2,maxZ:z+length/2-1});
 return Object.freeze({id:`fd:v${FD_VERSION}:${seed}:${rx}:${rz}`,version:FD_VERSION,seed,rx,rz,x,z,floors,bounds});
}

export function candidateAt(seed,x,z){if(!Number.isSafeInteger(x)||!Number.isSafeInteger(z))throw new TypeError("Invalid cell");return candidateForRegion(seed,Math.floor(x/REGION),Math.floor(z/REGION));}

export function assessReservation(candidate,evidence){
 if(!candidate||!evidence||evidence.candidateId!==candidate.id||evidence.generationVersion!==candidate.version||evidence.worldSeed!==candidate.seed||typeof evidence.worldProfile!=="string"||!evidence.worldProfile||typeof evidence.revision!=="string"||!evidence.revision)return Object.freeze({status:"hold",reason:"identity"});
 const checks=["newWorldEligible","volumeFits","terrainUnmodified","noStructureConflict","oneConnectedCaveSocket","surfacePreserved"];
 for(const check of checks)if(evidence[check]===false)return Object.freeze({status:"reject",reason:check});
 for(const check of checks)if(evidence[check]!==true)return Object.freeze({status:"hold",reason:check});
 return Object.freeze({status:"eligible-for-review",reason:"all-observations-present"});
}

export function editDisposition(cell,action){
 if(!["mine","place","damage"].includes(action))return "defer";
 if(cell==="protected-shell"||cell==="protected-masonry")return "deny";
 if(cell==="interior-air"||cell==="player-owned"||cell==="ordinary-interior")return "delegate";
 return "defer";
}
