// Personal Master Builder, two original provisional 1A houses. No runtime registration.
import {compileM2ArchitecturalSpec} from '../roadmap-1a/m2-originals.mjs';
const R=(id,x0,z0,x1,z1)=>({id,min:[x0,1,z0],max:[x1+1,4,z1+1]});
const D=(x,z,from,to)=>({at:[x,1,z],from,to});
const F=(x,z,room,asset,variant)=>({x,z,room,asset,...(variant?{variant}:{})});
const W=(name,rect,style,raise)=>({name,rect,style,raise});
const specs=[{category:"house",biome:"desert",size:"small",index:18,title:"Saffronstep Three-Court Artisan House",w:42,d:31,plan:"northwestern studio and reception, broad transverse shaded hall, east pantry wing and twin southern chambers",roof:"terrace",skin:"pack5:080",roofAsset:"pack3:024",
exteriorNotches:[[24,0,41,11],[0,20,15,30],[34,24,41,30]],segments:[[9,2,9,11],[2,12,23,12],[26,13,26,29],[16,19,25,19],[27,23,33,23]],entry:[15,1,"arrival"],
doors:[D(9,6,"arrival","studio"),D(15,12,"arrival","hall"),D(5,12,"studio","hall"),D(26,16,"hall","pantry"),D(20,19,"hall","bedroom"),D(30,23,"pantry","guest"),D(26,26,"bedroom","guest")],
rooms:[R("arrival",10,2,22,11),R("studio",2,2,8,11),R("hall",2,13,25,18),R("pantry",27,13,39,22),R("bedroom",17,20,25,28),R("guest",27,24,32,28)],
windows:[[4,1,"north"],[18,1,"north"],[1,6,"west"],[1,16,"west"],[23,6,"east"],[32,12,"north"],[40,16,"east"],[16,25,"west"],[33,26,"east"],[20,29,"south"],[30,29,"south"],[5,19,"south"]],
fixtures:[F(14,5,"arrival","pack4:064"),F(5,8,"studio","pack5:084"),F(10,15,"hall","pack4:059"),F(34,18,"pantry","pack4:057"),F(19,23,"bedroom","pack5:082","wanderer-quilt"),F(29,25,"guest","pack5:082","wanderer-quilt")],courtyard:[20,14,23,16],
roofWings:[W("studio-shade",[0,0,9,12],"edge-rise",0),W("arrival-terrace",[10,0,23,12],"step-front",1),W("crosshall",[0,13,26,19],"long-gable",0),W("east-pavilion",[27,12,41,23],"double-hill",2),W("sleep-wing",[16,20,26,30],"edge-rise",1),W("guest-terrace",[27,24,33,30],"step-front",0)],posts:[5,19],detail:"Desert three exterior recesses, masonry stepped shade, grounded open garden; no world placement."},
{category:"house",biome:"snow",size:"small",index:18,title:"Frostwillow Dogleg Hearth House",w:31,d:42,plan:"narrow eastern arrival and hearth, western craft wing, cross-gallery and paired southern lodgings",roof:"steep",skin:"live:wood",roofAsset:"pack3:025",
exteriorNotches:[[0,0,12,14],[20,15,30,27],[0,34,8,41]],segments:[[14,8,28,8],[13,15,19,15],[8,16,8,27],[1,28,19,28],[9,34,29,34],[18,35,18,39]],entry:[22,1,"arrival"],
doors:[D(22,8,"arrival","hearth"),D(16,15,"hearth","central"),D(8,21,"workshop","central"),D(5,28,"workshop","gallery"),D(14,28,"central","gallery"),D(14,34,"gallery","bedroom"),D(24,34,"gallery","guest"),D(18,37,"bedroom","guest")],
rooms:[R("arrival",14,2,28,7),R("hearth",14,9,28,14),R("workshop",2,16,7,27),R("central",9,16,18,27),R("gallery",2,29,28,33),R("bedroom",10,35,17,39),R("guest",19,35,28,39)],
windows:[[16,1,"north"],[26,1,"north"],[13,5,"west"],[29,5,"east"],[13,11,"west"],[29,11,"east"],[4,15,"north"],[19,20,"east"],[1,21,"west"],[23,28,"north"],[29,31,"east"],[1,31,"west"],[9,38,"west"],[29,38,"east"],[13,40,"south"],[24,40,"south"],[4,33,"south"]],
fixtures:[F(22,4,"arrival","pack4:059"),F(23,11,"hearth","pack4:064"),F(4,19,"workshop","pack5:084"),F(15,24,"central","pack4:057"),F(20,31,"gallery","pack4:058"),F(12,36,"bedroom","pack5:082","wanderer-quilt"),F(23,36,"guest","pack5:082","wanderer-quilt")],courtyard:[11,19,13,21],
roofWings:[W("arrival-snow-gable",[13,0,30,8],"long-gable",2),W("hearth-ridge",[13,9,30,14],"double-hill",1),W("craft-wing",[0,15,8,27],"edge-rise",0),W("central-winter-court",[9,15,19,27],"long-gable",1),W("cross-gallery",[0,28,30,34],"edge-rise",1),W("western-bed",[9,35,18,41],"double-hill",2),W("eastern-bed",[19,35,30,41],"long-gable",0)],posts:[18,24],detail:"Three alternating perimeter cuts with protected snow court, steep supported roofs and connected winter rooms."}];
export function getMasterBuilderSession3Houses(){return specs.map(compileM2ArchitecturalSpec);}
