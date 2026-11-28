// Original Master Builder 1A provisional source. Canonical small temperate house 019.
// Explicit architecture only: no random generation, live registration, save or settlement writes.
import {compileM2ArchitecturalSpec} from '../roadmap-1a/m2-originals.mjs';
const R=(id,x0,z0,x1,z1)=>({id,min:[x0,1,z0],max:[x1+1,4,z1+1]});
const D=(x,z,from,to)=>({at:[x,1,z],from,to});
const F=(x,z,room,asset,variant)=>({x,z,room,asset,...(variant?{variant}:{})});
const W=(name,rect,style,raise)=>({name,rect,style,raise});
const spec={category:"house",biome:"temperate",size:"small",index:19,title:"Alderweir Switchback Garden House",w:34,d:31,
plan:"offset north arrival pair, transverse workshop and garden hall, narrow southern link to paired private chambers",roof:"hip",skin:"pack2:013",roofAsset:"pack3:023",
exteriorNotches:[[0,0,10,9],[23,17,33,30],[0,21,8,30]],
segments:[[22,2,22,9],[11,10,32,10],[12,11,12,16],[1,17,22,17],[9,21,22,21],[16,22,16,28]],
entry:[16,1,"arrival"],
doors:[D(22,5,"arrival","sunroom"),D(16,10,"arrival","garden-hall"),D(27,10,"sunroom","garden-hall"),D(12,13,"workshop","garden-hall"),D(7,17,"workshop","south-link"),D(17,17,"garden-hall","south-link"),D(13,21,"south-link","bedroom"),D(19,21,"south-link","guest-room"),D(16,25,"bedroom","guest-room")],
rooms:[R("arrival",12,2,21,9),R("sunroom",23,2,31,9),R("workshop",2,11,11,16),R("garden-hall",13,11,31,16),R("south-link",2,18,21,20),R("bedroom",10,22,15,28),R("guest-room",17,22,21,28)],
windows:[[13,1,"north"],[30,1,"north"],[11,5,"west"],[32,5,"east"],[1,13,"west"],[32,13,"east"],[22,19,"east"],[5,20,"south"],[9,25,"west"],[22,25,"east"],[12,29,"south"],[19,29,"south"]],
fixtures:[F(17,4,"arrival","pack4:064"),F(27,6,"sunroom","pack4:058"),F(5,13,"workshop","pack5:084"),F(19,14,"garden-hall","pack4:059"),F(11,19,"south-link","pack4:057"),F(12,25,"bedroom","pack5:082","wanderer-quilt"),F(19,25,"guest-room","pack5:082","wanderer-quilt")],
courtyard:[26,12,28,14],
roofWings:[W("arrival-gable",[11,0,22,10],"long-gable",1),W("sunroom-hip",[23,0,33,10],"double-hill",2),W("western-workshop",[0,10,12,17],"edge-rise",0),W("garden-hall",[13,11,33,16],"step-front",1),W("southern-link",[0,17,22,21],"edge-rise",0),W("private-west",[9,22,16,30],"long-gable",1),W("private-east",[17,22,22,30],"double-hill",2)],
posts:[14,29],detail:"Three physical perimeter cuts separate a sunny front pavilion, west craft room, sky-open garden and offset private tail. No settlement/runtime placement."};
export function getAlderweirSwitchbackHouse(){return compileM2ArchitecturalSpec(spec);}
