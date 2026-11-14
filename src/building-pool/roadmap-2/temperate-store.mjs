import {SCHEMA,validateBlueprint} from "./schema.mjs";
// All refs are ROSTER symbols, not persistent block IDs.
const M={stone:"pack1:001",plank:"pack2:013",beam:"pack2:015",wall:"pack5:079",
 roof:"pack3:023",glass:"pack4:030",frame:"pack4:032",shelf:"pack5:087",
 counter:"pack5:086",crate:"pack4:057",lantern:"pack4:035"};
function geometry(){
 const vox=new Map();
 const key=(x,y,z)=>[x,y,z].join(",");
 const put=(x,y,z,material,kind)=>{const k=key(x,y,z);if(vox.has(k))throw Error("overlap: "+k);vox.set(k,{x,y,z,material,kind});};
 const remove=(x,y,z)=>vox.delete(key(x,y,z));
 for(let x=0;x<13;x++)for(let z=0;z<11;z++){put(x,0,z,M.stone,"foundation");put(x,1,z,M.plank,"floor");}
 for(let y=2;y<=5;y++){
   for(let x=0;x<13;x++)for(const z of [0,10])put(x,y,z,M.wall,"wall");
   for(let z=1;z<10;z++)for(const x of [0,12])put(x,y,z,M.wall,"wall");
 }
 for(const y of [2,3,4])remove(6,y,0);
 for(const x of [2,3,9,10])for(const y of [3,4]){remove(x,y,0);put(x,y,0,y===3?M.glass:M.frame,"window");}
 for(const z of [3,4])for(const y of [3,4])for(const x of [0,12]){remove(x,y,z);put(x,y,z,M.glass,"window");}
 // A rear stockroom has an offset 3-cell-high opening at x=9.
 for(let x=1;x<12;x++)for(let y=2;y<=4;y++)if(x!==9)put(x,y,7,M.beam,"wall");
 for(let x=5;x<=7;x++)put(x,2,5,M.counter,"fixture");
 for(const z of [2,3,5])for(const y of [2,3])for(const x of [2,10])put(x,y,z,M.shelf,"fixture");
 for(const [x,z] of [[2,9],[3,9],[10,9],[2,8],[10,8]])put(x,2,z,M.crate,"decor");
 for(const [x,z] of [[4,3],[8,3],[6,8]])put(x,5,z,M.lantern,"decor");
 for(const x of [5,7])for(const y of [2,3,4]){remove(x,y,0);put(x,y,0,M.beam,"wall");}
 const slope=[6,6,7,7,8,8,9,8,8,7,7,6,6];
 for(let x=0;x<13;x++)for(let z=0;z<11;z++)put(x,slope[x],z,M.roof,"roof");
 for(const z of [0,10])for(let x=1;x<12;x++)for(let y=6;y<slope[x];y++)put(x,y,z,M.beam,"wall");
 return [...vox.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
}
export const TEMPERATE_SMALL_GENERAL_STORE=Object.freeze({
 schema:SCHEMA,id:"r2:general-store:temperate:small:01",category:"general-store",biome:"temperate",size:"small",variation:1,
 title:"Hearthlane Two-Room Provisioner",status:"authored-candidate",isolated:true,worldPlaced:false,numericIdsAssigned:false,
 extents:{x:13,y:10,z:11},face:"south",units:"conceptual coordinate voxels; asset dimensions unresolved",
 architecturalSignature:"gable roof, offset rear stockroom door, double street windows, counter and side shelving",
 roof:{form:"steep timber-shingle gable",ridgeAxis:"north-south",highestY:9},
 rooms:[{name:"Public sales floor",bounds:{x0:1,x1:11,z0:1,z1:6},uses:["sales-floor","service-counter","display-shelves"]},
 {name:"Stockroom",bounds:{x0:1,x1:11,z0:8,z1:9},uses:["storage"]}],
 features:["street-facing sign mount","hanging lanterns","real separating stockroom wall"],
 openings:[{type:"entrance",x:6,y:2,z:0,clearHeightCells:3,doorSymbol:"pack2:020",doorOpenState:"unknown"},
 {type:"window",x:2,y:3,z:0},{type:"window",x:9,y:3,z:0},
 {type:"internal-doorway",x:9,y:2,z:7,clearHeightCells:3}],
 circulation:[{from:"exterior",to:"sales-floor",via:"south x6 entrance"},
 {from:"sales-floor",to:"storage",via:"offset x9 opening in partition z7"}],
 unresolvedDependencies:[
 {ref:"pack1:001",issue:"stone foundation durability and real registered block geometry unverified"},
 {ref:"pack2:013",issue:"plank floor geometry, rotation and collision unverified"},
 {ref:"pack2:015",issue:"wooden beam spans and real beam shape unverified"},
 {ref:"pack4:032",issue:"physical window frame dimensions, glass fit and collision unverified"},
 {ref:"pack4:057",issue:"storage crate mesh, placement and collision unverified"},
 {ref:"pack5:079",issue:"plaster thickness and support unverified"},
 {ref:"pack3:023",issue:"real sloped roof mesh and orientation unverified"},
 {ref:"pack2:020",issue:"real hinged-door swing/open collision unverified"},
 {ref:"pack4:030",issue:"glass thickness, framing and collision unverified"},
 {ref:"pack5:086",issue:"counter dimensions and physical fit unverified"},
 {ref:"pack5:087",issue:"shelves dimensions and physical fit unverified"},
 {ref:"pack4:035",issue:"lantern mounting and actual emissive runtime unverified"}],
 voxels:geometry()
});
validateBlueprint(TEMPERATE_SMALL_GENERAL_STORE);
