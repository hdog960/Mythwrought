import test from "node:test";
import assert from "node:assert/strict";
import {BIOMES,SIZES,CATEGORIES,plannedSlots,inventory} from "../../../src/building-pool/roadmap-2/catalog.mjs";
import {validateBlueprint,validateSymbol,structuralFingerprint,assertDistinctArchitecture} from "../../../src/building-pool/roadmap-2/schema.mjs";
import {TEMPERATE_SMALL_GENERAL_STORE as bp} from "../../../src/building-pool/roadmap-2/temperate-store.mjs";
import {readFileSync} from "node:fs";
const manifest=JSON.parse(readFileSync(new URL("../../../src/building-pool/roadmap-2/manifest.json",import.meta.url)));
test("840 unique planned identities across 13 categories",()=>{
 const slots=plannedSlots();assert.equal(slots.length,840);
 assert.equal(new Set(slots.map(s=>s.id)).size,840);assert.equal(CATEGORIES.length,13);
 assert.equal(BIOMES.length,5);assert.equal(SIZES.length,3);
 assert.deepEqual(inventory().byMilestone,{M2:375,M3:300,M4:165});
 for(const c of CATEGORIES)assert.equal(inventory().byCategory[c.key],c.variants*15);
});
test("planned slots do not masquerade as authored buildings",()=>{
 assert(plannedSlots().every(s=>s.status==="planned"));assert.equal(manifest.plannedSlots,840);
 assert.equal(manifest.authoredCandidates,30);assert.equal(manifest.authored.length,30);assert.equal(manifest.acceptedBlueprints,0);
 assert.equal(manifest.worldPlacements,0);
});
test("actual authored store contains roof, windows, foundation and interiors",()=>{
 const v=validateBlueprint(bp);assert(v.valid);assert.equal(v.uniqueCells,685);
 assert(bp.rooms.length===2);
 for(const kind of ["foundation","floor","wall","roof","fixture","decor","window"])
 assert(bp.voxels.some(cell=>cell.kind===kind),kind);
});
test("symbols are unregistered roster positions, not block IDs",()=>{
 assert(bp.voxels.every(v=>validateSymbol(v.material)));
 assert(!validateSymbol("pack1:255"));assert(!validateSymbol("pack5:098"));assert(!validateSymbol("biome130:131"));
 assert(bp.unresolvedDependencies.length>=5);assert(!bp.numericIdsAssigned&&!bp.worldPlaced);
});
test("entrance and stockroom door have three-cell head clearance and reachable aisles",()=>{
 const cells=new Set(bp.voxels.map(v=>[v.x,v.y,v.z].join(",")));
 for(const [x,z] of [[6,0],[9,7]])for(const y of [2,3,4])
 assert(!cells.has([x,y,z].join(",")));
 const q=[[6,1]],seen=new Set();
 while(q.length){const [x,z]=q.shift(),k=x+","+z;
 if(seen.has(k)||x<1||x>11||z<1||z>9||[2,3,4].some(y=>cells.has([x,y,z].join(","))))continue;
 seen.add(k);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])q.push([x+dx,z+dz]);}
 assert(seen.has("9,8"));assert(seen.has("6,4"));
});
test("invalid geometry or identities are rejected",()=>{
 assert.throws(()=>validateBlueprint({...bp,voxels:[...bp.voxels,bp.voxels[0]]}),/overlapping/);
 assert.throws(()=>validateBlueprint({...bp,id:"r2:general-store:desert:small:99"}),/unreserved/);
 assert.throws(()=>validateBlueprint({...bp,rooms:[]}),/missing rooms/);
});
test("mirrors and recolors fail uniqueness",()=>{
 const recolor={...bp,voxels:bp.voxels.map(v=>({...v,material:"pack5:079"}))};
 const mirror={...bp,voxels:bp.voxels.map(v=>({...v,x:12-v.x}))};
 assert.equal(structuralFingerprint(recolor),structuralFingerprint(bp));
 assert.equal(structuralFingerprint(mirror),structuralFingerprint(bp));
 assert.throws(()=>assertDistinctArchitecture([bp,{...recolor,id:"r2:general-store:temperate:small:02"}]),/duplicate/);
 assert.deepEqual(assertDistinctArchitecture([bp]),{authored:1,distinctArchitectures:1});
});

test("public circulation is category-dependent: temples need no shop storage",()=>{
 const temple={...bp,id:"r2:temple:temperate:small:01",category:"temple",
 rooms:[{name:"Ceremonial nave",uses:["ceremonial-space","public-circulation"]},{name:"Sanctuary",uses:["altar"]}],
 circulation:[{from:"exterior",to:"ceremonial-space",via:"nave entrance"},{from:"ceremonial-space",to:"altar",via:"sanctuary aisle"}]};
 // Schema contract fixture only: store geometry reused here is NOT an authored temple.
 assert.equal(validateBlueprint(temple).valid,true);
 assert.throws(()=>validateBlueprint({...temple,circulation:[{from:"exterior",to:"ceremonial-space",via:"door"}]}),/inaccessible room/);
 assert.throws(()=>validateBlueprint({...temple,circulation:[{from:"exterior",to:"nonexistent",via:"door"}]}),/destination not a room use/);
});
test("entrance clearance, window geometry and opening bounds are enforced",()=>{
 assert.throws(()=>validateBlueprint({...bp,voxels:[...bp.voxels,{x:6,y:3,z:0,kind:"wall",material:"pack1:001"}]}),/blocked entrance/);
 assert.throws(()=>validateBlueprint({...bp,openings:bp.openings.map(o=>o.type==="entrance"?{...o,x:100}:o)}),/opening out of bounds/);
 assert.throws(()=>validateBlueprint({...bp,voxels:bp.voxels.map(v=>v.kind==="window"?{...v,kind:"wall"}:v)}),/missing physical window/);
});


test("internal and auxiliary room door declarations require physically clear three-high openings",()=>{
 const door=bp.openings.find(o=>o.type==="internal-doorway");
 assert(door);
 assert.throws(()=>validateBlueprint({...bp,voxels:[...bp.voxels,
   {x:door.x,y:3,z:door.z,kind:"wall",material:"pack1:001"}]}),/blocked internal doorway/);
 assert.throws(()=>validateBlueprint({...bp,openings:bp.openings.map(o=>o===door?{...o,clearHeightCells:2}:o)}),
   /invalid three-high opening clearance/);
});


test("all placed symbolic materials and door symbols require explicit unresolved ABI handoff",()=>{
 const missing="pack1:001";
 assert(bp.voxels.some(v=>v.material===missing));
 const altered={...bp,unresolvedDependencies:bp.unresolvedDependencies.filter(d=>d.ref!==missing)};
 assert.throws(()=>validateBlueprint(altered),/missing symbolic material dependency: pack1:001/);
 const absentDoor={...bp,unresolvedDependencies:bp.unresolvedDependencies.filter(d=>d.ref!=="pack2:020")};
 assert.throws(()=>validateBlueprint(absentDoor),/missing symbolic material dependency: pack2:020/);
});
