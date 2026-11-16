// Builder 2A new original twin-wing / U-courtyard buildings. Actual coordinate carving; source only.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
import {validateBlueprint} from './schema.mjs';
export const M1_U_COURT_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "mountain",
    "size": "medium",
    "variation": 3,
    "w": 23,
    "d": 23,
    "h": 8,
    "entry": 11,
    "left": 8,
    "right": 15,
    "depth": 8,
    "frontSide": "west",
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "annex": "merchant-protected-storage",
    "name": "Thorncrag Split-Ridge Merchants",
    "masses": [
      [
        3,
        7,
        5,
        11,
        5,
        "northwest-caravan-loft"
      ],
      [
        16,
        19,
        5,
        9,
        3,
        "ledger-annex-hip"
      ],
      [
        9,
        14,
        12,
        13,
        5,
        "trade-ridge-roof"
      ]
    ],
    "gables": [
      [
        "front",
        7,
        15,
        6
      ],
      [
        "rear",
        5,
        18,
        5
      ]
    ],
    "furniture": [
      [
        15,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        12,
        8,
        "pack5:087",
        "retail-display",
        "curio-arcade"
      ],
      [
        18,
        10,
        "pack5:087",
        "retail-display",
        "curio-arcade"
      ],
      [
        3,
        8,
        "pack5:091",
        "bookkeeper-desk",
        "cartographers-oak-desk"
      ],
      [
        17,
        20,
        "pack4:057",
        "caravan-supply",
        null
      ]
    ],
    "stepWidth": 3,
    "stepDepth": 4
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "large",
    "variation": 2,
    "w": 27,
    "d": 24,
    "h": 9,
    "entry": 13,
    "left": 11,
    "right": 20,
    "depth": 11,
    "frontSide": "east",
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "annex": "empty-feed-tack-annex",
    "name": "Coppersand Empty-Stable Arcade",
    "masses": [
      [
        3,
        7,
        6,
        12,
        4,
        "western-tack-sunshade"
      ],
      [
        20,
        24,
        6,
        9,
        6,
        "eastern-windbreak-tower"
      ],
      [
        10,
        17,
        10,
        12,
        3,
        "market-overstory"
      ]
    ],
    "gables": [
      [
        "rear",
        8,
        20,
        4
      ]
    ],
    "furniture": [
      [
        20,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        18,
        9,
        "pack5:087",
        "tack-shelf",
        "curio-arcade"
      ],
      [
        2,
        5,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        5,
        8,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        2,
        11,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        24,
        21,
        "pack4:057",
        "dry-feed",
        null
      ]
    ],
    "stepWidth": 4,
    "stepDepth": 6
  },
  {
    "category": "magic-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 2,
    "w": 26,
    "d": 25,
    "h": 10,
    "entry": 12,
    "left": 7,
    "right": 19,
    "depth": 11,
    "frontSide": "west",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "annex": "inert-sigil-records",
    "name": "Moonveil Twin-Wing Curio Hall",
    "masses": [
      [
        4,
        8,
        7,
        16,
        7,
        "unpowered-west-rune-observatory"
      ],
      [
        18,
        21,
        7,
        10,
        4,
        "forest-reliquary-tower"
      ],
      [
        11,
        15,
        13,
        15,
        5,
        "inner-arcane-ridge"
      ]
    ],
    "gables": [
      [
        "front",
        7,
        17,
        6
      ],
      [
        "rear",
        6,
        19,
        5
      ]
    ],
    "furniture": [
      [
        19,
        4,
        "pack5:086",
        "curio-counter",
        "ledger-service"
      ],
      [
        15,
        9,
        "pack5:093",
        "inert-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        19,
        11,
        "pack5:093",
        "inert-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        8,
        "pack5:091",
        "appraisal-desk",
        "cartographers-oak-desk"
      ],
      [
        23,
        22,
        "pack4:057",
        "sealed-curios",
        null
      ]
    ],
    "stepWidth": 4,
    "stepDepth": 7
  },
  {
    "category": "potion-shop",
    "biome": "snow",
    "size": "large",
    "variation": 2,
    "w": 25,
    "d": 23,
    "h": 9,
    "entry": 12,
    "left": 7,
    "right": 16,
    "depth": 9,
    "frontSide": "east",
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "annex": "herb-drying-annex",
    "name": "Wintervale Moonherb Conservatory",
    "masses": [
      [
        3,
        7,
        7,
        13,
        6,
        "steep-west-inert-mixing-flue"
      ],
      [
        18,
        21,
        7,
        13,
        4,
        "winter-drying-upper-roof"
      ],
      [
        10,
        16,
        12,
        14,
        5,
        "ice-insulated-crossridge"
      ]
    ],
    "gables": [
      [
        "front",
        6,
        17,
        6
      ]
    ],
    "furniture": [
      [
        18,
        4,
        "pack5:086",
        "remedy-counter",
        "ledger-service"
      ],
      [
        15,
        8,
        "pack5:087",
        "sealed-flasks",
        "curio-arcade"
      ],
      [
        3,
        8,
        "pack5:089",
        "cold-cauldron",
        "iron-tripod-cauldron"
      ],
      [
        3,
        11,
        "pack5:091",
        "botanist-ledger",
        "cartographers-oak-desk"
      ],
      [
        19,
        20,
        "pack4:057",
        "winter-herbs",
        null
      ]
    ],
    "stepWidth": 4,
    "stepDepth": 5
  },
  {
    "category": "bakery",
    "biome": "temperate",
    "size": "large",
    "variation": 2,
    "w": 28,
    "d": 25,
    "h": 10,
    "entry": 14,
    "left": 5,
    "right": 17,
    "depth": 12,
    "frontSide": "west",
    "wall": "pack2:013",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "annex": "flour-inventory-annex",
    "name": "Fernbrook Twin-Oven Bread Hall",
    "masses": [
      [
        21,
        24,
        6,
        11,
        7,
        "tall-cold-bakery-vent"
      ],
      [
        4,
        9,
        7,
        15,
        4,
        "western-flour-loft"
      ],
      [
        11,
        17,
        14,
        16,
        6,
        "breadhall-crossroof"
      ]
    ],
    "gables": [
      [
        "front",
        8,
        20,
        5
      ],
      [
        "rear",
        7,
        20,
        6
      ]
    ],
    "furniture": [
      [
        18,
        4,
        "pack5:086",
        "bakery-counter",
        "ledger-service"
      ],
      [
        13,
        8,
        "pack5:087",
        "shelf",
        "curio-arcade"
      ],
      [
        23,
        8,
        "pack5:090",
        "inactive-oven",
        "ashstone-bake-oven"
      ],
      [
        3,
        9,
        "pack5:091",
        "grain-tally",
        "cartographers-oak-desk"
      ],
      [
        22,
        22,
        "pack4:057",
        "dry-flour",
        null
      ]
    ],
    "stepWidth": 4,
    "stepDepth": 7
  },
  {
    "category": "bank",
    "biome": "desert",
    "size": "large",
    "variation": 2,
    "w": 27,
    "d": 25,
    "h": 10,
    "entry": 13,
    "left": 6,
    "right": 15,
    "depth": 12,
    "frontSide": "east",
    "wall": "pack1:005",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "annex": "bonded-stamp-records",
    "name": "Amberstone Double-Wing Treasury",
    "masses": [
      [
        4,
        8,
        6,
        14,
        6,
        "west-bonded-records-tower"
      ],
      [
        19,
        23,
        7,
        12,
        5,
        "east-guard-terrace"
      ],
      [
        10,
        16,
        14,
        15,
        7,
        "vault-temple-clerestory"
      ]
    ],
    "gables": [
      [
        "front",
        9,
        17,
        5
      ],
      [
        "rear",
        9,
        18,
        6
      ]
    ],
    "furniture": [
      [
        18,
        4,
        "pack5:086",
        "bank-counter",
        "ledger-service"
      ],
      [
        21,
        8,
        "pack5:086",
        "teller-counter",
        "ledger-service"
      ],
      [
        3,
        8,
        "pack5:091",
        "safe-ledger",
        "cartographers-oak-desk"
      ],
      [
        21,
        22,
        "pack5:093",
        "inert-seal",
        "sunspire-reliquary-plinth"
      ],
      [
        4,
        22,
        "pack4:057",
        "bonded-crate",
        null
      ]
    ],
    "stepWidth": 4,
    "stepDepth": 7
  }
]);
const R=(name,[x0,x1,z0,z1],uses,access)=>({name,bounds:{x0,x1,z0,z1},uses,access});
export function author2AUProfile(o){
 const split=o.d-o.depth-1,door=o.w-4,main=o.category==='bank'?'public-hall':'sales-floor';
 const publicUse=o.category==='bank'?['public-hall','teller-service']:o.category==='general-store'?['sales-floor','service-counter','display-shelves']:o.category==='pet-shop'?['sales-floor','service-counter','empty-animal-display']:o.category==='magic-shop'?['sales-floor','service-counter','arcane-display']:['sales-floor','service-counter'];
 const privateUse=o.category==='bank'?['administrative-office']:o.category==='general-store'?['ledger-work']:o.category==='pet-shop'?['empty-animal-display']:o.category==='magic-shop'?['secure-handling']:o.category==='potion-shop'?['alchemy-workspace']:['oven','food-preparation'];
 const backUse=o.category==='bank'?['vault']:['storage'];
 return {category:o.category,biome:o.biome,size:o.size,variation:o.variation,w:o.w,d:o.d,h:o.h,entry:o.entry,
  foundation:o.biome==='snow'?'pack1:004':'pack1:005',floor:o.floor,wall:o.wall,roof:o.roof,
  partZ:[[split,door]],partX:[[6,4,split-1,8]],caps:[],windows:[[5,0],[o.w-6,0],[0,9],[o.w-1,9]],fixtures:o.furniture,
  rooms:[R(o.name+' public arcade',[7,o.w-2,1,split-1],publicUse,[o.entry,7]),R(o.name+' private side wing',[1,5,4,split-1],privateUse,[3,10]),R(o.name+' rear right annex',[o.right+2,o.w-2,split+1,o.d-2],backUse,[o.w-4,o.d-3])],
  routes:[['exterior',main,'double-wide covered front approach'],[main,privateUse[0],'private west door'],[main,backUse[0],'rear right archive threshold']],
  lamp:[o.entry,o.h,3],towers:[[o.w-4,14,4],[4,13,4]],roofMassing:o.masses,facadeGables:o.gables,frontPorticoes:[[o.entry-4,o.entry+4,3,o.category+'-deep-front-loggia']],
  title:o.name,roofForm:'two genuine rear wings and asymmetric regional stepped roof',signature:'independent U-shaped roof and exterior courtyards with new west access and stepped front',
  openRearCourt:{x0:o.left,x1:o.right,depth:o.depth,role:o.category+'-U-open-court'},frontWingSetback:{side:o.frontSide,width:o.stepWidth??3,depth:o.stepDepth??4,role:o.category+'-stepped-front-wing'},
  rearAnnexUse:o.annex,
  ...(o.category==='bank'?{vaultDoor:[door,split],vaultDoorOrientation:'north',vaultDoorVariant:'citadel-ironbound-leaves'}:{})
 };
}
export function carve2AUFootprint(bp,p){
 const key=(x,y,z)=>[x,y,z].join(','),cells=new Map(bp.voxels.map(v=>[key(v.x,v.y,v.z),{...v}])),courts=[];
 const remove=(x,z)=>{for(let y=0;y<bp.extents.y;y++){const at=key(x,y,z),v=cells.get(at);if(v&&['window','fixture','decor'].includes(v.kind))throw Error('courtyard intersects authored special cell '+at);cells.delete(at);}};
 const wall=(x,z,role)=>{for(let y=2;y<=p.h;y++){const at=key(x,y,z),prior=cells.get(at);if(prior&&prior.kind!=='wall')throw Error('new weather wall blocked by interior '+at);cells.set(at,{x,y,z,kind:'wall',material:p.wall,architecturalRole:role});}};
 const c=p.openRearCourt,start=p.d-c.depth-0;if(c.x0<5||c.x1>=p.w-5||c.x1<=c.x0||start<12)throw Error('invalid full open rear courtyard');
 for(let x=c.x0;x<=c.x1;x++)for(let z=start;z<p.d;z++)remove(x,z);
 for(let z=start;z<p.d;z++){wall(c.x0-1,z,c.role+'-west-inner-wall');wall(c.x1+1,z,c.role+'-east-inner-wall');}
 for(let x=c.x0;x<=c.x1;x++)wall(x,start-1,c.role+'-inner-return-wall');
 courts.push({kind:'open-rear-U-courtyard',role:c.role,x0:c.x0,x1:c.x1,z0:start,z1:p.d-1,removedColumns:(c.x1-c.x0+1)*c.depth,returnedWallColumns:c.depth*2+(c.x1-c.x0+1)});
 const f=p.frontWingSetback,west=f.side==='west',xInner=west?f.width:p.w-f.width-1;
 for(let z=0;z<f.depth;z++)for(let x=west?0:p.w-f.width;x<(west?f.width:p.w);x++)remove(x,z);
 for(let z=0;z<f.depth;z++)wall(xInner,z,f.role+'-offset-facade');
 for(let x=west?0:p.w-f.width;x<(west?f.width:p.w);x++)wall(x,f.depth,f.role+'-facade-return');
 courts.push({kind:'asymmetric-front-step',role:f.role,side:f.side,width:f.width,depth:f.depth,removedColumns:f.width*f.depth});
 const uses=p.rearAnnexUse,annex={name:p.title+' independent far-left rear annex',bounds:{x0:1,x1:c.x0-2,z0:start,z1:p.d-2},uses:[uses],access:[3,p.d-3]};
 // Physical three-high door in the already-authored rear partition: not a metadata-only edge.
 const newDoor=key(3,2,start-1);
 for(let y=2;y<=4;y++){const at=key(3,y,start-1),v=cells.get(at);if(v?.kind!=='wall')throw Error('annex return has no door partition '+at);cells.delete(at);}
 const result={...bp,rooms:[...bp.rooms,annex],openings:[...bp.openings,{type:'internal-doorway',role:'new-independent-west-annex',x:3,y:2,z:start-1,clearHeightCells:3}],
  circulation:[...bp.circulation,{from:p.category==='bank'?'public-hall':'sales-floor',to:uses,via:'source-cleared three-high west annex threshold'}],
  architecturalSignature:bp.architecturalSignature+' / explicit U courtyard, rear twin wing and asymmetric front step',features:[...bp.features,'open-air source-removal U footprint','real new enclosed west annex room'],
  courtyardGeometry:courts,voxels:[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x)};
 validateBlueprint(result);return Object.freeze(result);
}
export const M1_U_COURT_PROFILES=Object.freeze(M1_U_COURT_SPECS.map(author2AUProfile));
export const M1_U_COURT_SHOPS=Object.freeze(M1_U_COURT_PROFILES.map(p=>carve2AUFootprint(assembleSpecialistProfile(p),p)));
