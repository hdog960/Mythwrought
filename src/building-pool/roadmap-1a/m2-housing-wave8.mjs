// Builder 1A M2 wave8 — five original, explicitly coordinate-authored regional homes.
// Independent material, room, door, internal wall, fully absent concave outline and roof-wing source tables.
// All candidates are provisional and invisible to the live game until separate creator-approved integration.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
 {
  category:'house',biome:'temperate',size:'small',index:12,title:'Hazelbrook Split-Gable Croft',
  w:27,d:24,plan:'twin-open-rear-gardens-with-offset-west-and-east-private-bays',
  roof:'courtyard',skin:'live:wood',roofAsset:'pack3:023',
  exteriorNotches:[[10,12,17,23]],
  segments:[[2,11,9,11],[18,11,25,11],[2,17,9,17],[18,18,25,18]],
  entry:[13,1,'hall'],
  rooms:[
   {id:'hall',min:[2,1,2],max:[26,4,11]},
   {id:'west-sunroom',min:[2,1,12],max:[10,4,17]},
   {id:'east-kitchen',min:[18,1,12],max:[26,4,18]},
   {id:'west-bedroom',min:[2,1,18],max:[10,4,23]},
   {id:'east-store',min:[18,1,19],max:[26,4,23]}
  ],
  doors:[
   {at:[6,1,11],from:'hall',to:'west-sunroom'},
   {at:[22,1,11],from:'hall',to:'east-kitchen'},
   {at:[5,1,17],from:'west-sunroom',to:'west-bedroom'},
   {at:[22,1,18],from:'east-kitchen',to:'east-store'}
  ],
  windows:[[3,1,'north'],[23,1,'north'],[1,7,'west'],[25,8,'east']],
  fixtures:[
   {x:13,z:5,room:'hall',asset:'pack4:064'},
   {x:4,z:14,room:'west-sunroom',asset:'pack4:059'},
   {x:20,z:14,room:'east-kitchen',asset:'pack4:057'},
   {x:4,z:19,room:'west-bedroom',asset:'pack5:082',variant:'wanderer-quilt'},
   {x:20,z:20,room:'east-store',asset:'pack5:084'}
  ],
  roofWings:[
   {name:'split-front-timber-gable',rect:[0,0,26,11],style:'long-gable',raise:1},
   {name:'west-lantern-sunroom',rect:[0,12,9,23],style:'edge-rise',raise:0},
   {name:'east-service-hill',rect:[18,12,26,23],style:'double-hill',raise:1}
  ],
  posts:[4,23],detail:'independent lantern parlors on opposite sides of real missing orchard floor'
 },
 {
  category:'house',biome:'desert',size:'medium',index:12,title:'Kharim Saffron Steps House',
  w:33,d:27,plan:'wide-saffron-trading-front-and-deep-right-privacy-step-behind-open-west-sand-court',
  roof:'hip',skin:'pack5:080',roofAsset:'pack3:024',
  exteriorNotches:[[0,14,11,26]],
  segments:[[16,2,16,12],[12,13,31,13],[13,20,30,20]],
  entry:[24,1,'merchant-hall'],
  rooms:[
   {id:'weaving-room',min:[2,1,2],max:[16,4,13]},
   {id:'merchant-hall',min:[17,1,2],max:[32,4,13]},
   {id:'spice-gallery',min:[13,1,14],max:[31,4,20]},
   {id:'sleeping-step',min:[13,1,21],max:[31,4,26]}
  ],
  doors:[
   {at:[16,1,6],from:'merchant-hall',to:'weaving-room'},
   {at:[24,1,13],from:'merchant-hall',to:'spice-gallery'},
   {at:[23,1,20],from:'spice-gallery',to:'sleeping-step'}
  ],
  windows:[[3,1,'north'],[29,1,'north'],[1,7,'west'],[31,8,'east']],
  fixtures:[
   {x:4,z:5,room:'weaving-room',asset:'pack5:084'},
   {x:22,z:5,room:'merchant-hall',asset:'pack4:064'},
   {x:18,z:16,room:'spice-gallery',asset:'pack4:057'},
   {x:18,z:22,room:'sleeping-step',asset:'pack5:082',variant:'wanderer-quilt'}
  ],
  roofWings:[
   {name:'low-market-shade',rect:[0,0,32,13],style:'step-front',raise:0},
   {name:'long-sleeping-terrace',rect:[12,14,32,26],style:'edge-rise',raise:1}
  ],
  posts:[5,28],detail:'open western sand court and independent shaded weaving and sleeping houses'
 },
 {
  category:'house',biome:'snow',size:'large',index:12,title:'Sleetwatch Lantern Bastion',
  w:40,d:35,plan:'unequal-shouldered-t-bastion-with-three-front-chambers-and-rear-watch-spine',
  roof:'steep',skin:'live:wood',roofAsset:'pack3:025',
  exteriorNotches:[[0,16,12,34],[29,16,39,34]],
  segments:[[13,2,13,14],[27,2,27,14],[14,15,27,15],[14,25,27,25]],
  entry:[20,1,'lantern-hall'],
  rooms:[
   {id:'map-wing',min:[2,1,2],max:[13,4,15]},
   {id:'lantern-hall',min:[14,1,2],max:[27,4,15]},
   {id:'cold-pantry',min:[28,1,2],max:[38,4,15]},
   {id:'watch-gallery',min:[14,1,16],max:[28,4,25]},
   {id:'sleeping-bastion',min:[14,1,26],max:[28,4,34]}
  ],
  doors:[
   {at:[13,1,7],from:'lantern-hall',to:'map-wing'},
   {at:[27,1,8],from:'lantern-hall',to:'cold-pantry'},
   {at:[20,1,15],from:'lantern-hall',to:'watch-gallery'},
   {at:[20,1,25],from:'watch-gallery',to:'sleeping-bastion'}
  ],
  windows:[[3,1,'north'],[36,1,'north'],[1,8,'west'],[38,8,'east']],
  fixtures:[
   {x:5,z:5,room:'map-wing',asset:'pack5:084'},
   {x:19,z:5,room:'lantern-hall',asset:'pack4:064'},
   {x:31,z:5,room:'cold-pantry',asset:'pack4:058'},
   {x:16,z:19,room:'watch-gallery',asset:'pack4:059'},
   {x:18,z:28,room:'sleeping-bastion',asset:'pack5:082',variant:'wanderer-quilt'}
  ],
  roofWings:[
   {name:'broad-snowcatcher',rect:[0,0,39,15],style:'long-gable',raise:1},
   {name:'raised-watch-spine',rect:[13,16,28,34],style:'double-hill',raise:2}
  ],
  posts:[5,35],detail:'two physically absent sheltered snow sides and rear-backed lookout chamber'
 },
 {
  category:'house',biome:'enchanted-forest',size:'small',index:12,title:'Mossveil Starfold Hut',
  w:26,d:25,plan:'left-rear-moonlit-bower-with-right-front-atelier-and-open-eastern-fern-clearing',
  roof:'sawtooth',skin:'live:wood',roofAsset:'pack3:023',
  exteriorNotches:[[17,12,25,24]],
  segments:[[14,2,14,10],[2,11,15,11],[2,18,15,18]],
  entry:[8,1,'bower-hall'],
  rooms:[
   {id:'bower-hall',min:[2,1,2],max:[14,4,11]},
   {id:'atelier',min:[15,1,2],max:[25,4,11]},
   {id:'moon-room',min:[2,1,12],max:[16,4,18]},
   {id:'resting-glade',min:[2,1,19],max:[16,4,24]}
  ],
  doors:[
   {at:[14,1,6],from:'bower-hall',to:'atelier'},
   {at:[9,1,11],from:'bower-hall',to:'moon-room'},
   {at:[8,1,18],from:'moon-room',to:'resting-glade'}
  ],
  windows:[[3,1,'north'],[22,1,'north'],[1,7,'west'],[24,7,'east']],
  fixtures:[
   {x:5,z:5,room:'bower-hall',asset:'pack4:064'},
   {x:19,z:5,room:'atelier',asset:'pack5:084'},
   {x:5,z:14,room:'moon-room',asset:'pack4:059'},
   {x:5,z:21,room:'resting-glade',asset:'pack5:082',variant:'wanderer-quilt'}
  ],
  roofWings:[
   {name:'starfold-front-canopy',rect:[0,0,25,11],style:'double-hill',raise:1},
   {name:'living-moss-back-hip',rect:[0,12,16,24],style:'edge-rise',raise:0}
  ],
  posts:[4,21],detail:'east-side open fern clearing, rear sleeping hollow and living off-center canopy'
 },
 {
  category:'house',biome:'mountain',size:'medium',index:12,title:'Slatewalk Three-Bay Terrace House',
  w:32,d:31,plan:'two-armed-mountain-rear-courtyard-with-orthogonal-front-workshop-and-asymmetric-service-wing',
  roof:'courtyard',skin:'pack1:006',roofAsset:'pack3:025',
  exteriorNotches:[[13,15,19,30]],
  segments:[[10,2,10,13],[2,14,12,14],[20,14,29,14],[2,22,12,22]],
  entry:[17,1,'commons'],
  rooms:[
   {id:'atelier',min:[2,1,2],max:[10,4,14]},
   {id:'commons',min:[11,1,2],max:[30,4,14]},
   {id:'ore-room',min:[2,1,15],max:[13,4,22]},
   {id:'stone-rest',min:[2,1,23],max:[13,4,30]},
   {id:'ledge-study',min:[20,1,15],max:[30,4,30]}
  ],
  doors:[
   {at:[10,1,7],from:'commons',to:'atelier'},
   {at:[6,1,14],from:'atelier',to:'ore-room'},
   {at:[25,1,14],from:'commons',to:'ledge-study'},
   {at:[6,1,22],from:'ore-room',to:'stone-rest'}
  ],
  windows:[[3,1,'north'],[28,1,'north'],[1,8,'west'],[30,8,'east']],
  fixtures:[
   {x:4,z:5,room:'atelier',asset:'pack5:084'},
   {x:17,z:5,room:'commons',asset:'pack4:064'},
   {x:5,z:17,room:'ore-room',asset:'pack4:058'},
   {x:4,z:25,room:'stone-rest',asset:'pack5:082',variant:'wanderer-quilt'},
   {x:23,z:18,room:'ledge-study',asset:'pack4:059'}
  ],
  roofWings:[
   {name:'stone-front-hip',rect:[0,0,31,14],style:'step-front',raise:1},
   {name:'west-ore-ridge',rect:[0,15,12,30],style:'long-gable',raise:0},
   {name:'east-study-ridge',rect:[20,15,31,30],style:'double-hill',raise:2}
  ],
  posts:[4,27],detail:'physically unbuilt mountain gap separates rear stone resting room from ledge study'
 }
]);
export const M2_HOUSING_WAVE8_IDS=Object.freeze(SPECS.map(s=>'r1:house:'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getM2HousingWave8(){return SPECS.map(compileM2ArchitecturalSpec);}
