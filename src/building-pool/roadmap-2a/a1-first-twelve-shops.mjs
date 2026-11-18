// Roadmap A / A1: twelve separately coordinate-authored commercial designs.
// The originals, public gameplay registry, save system and historic source census are untouched.
// Every roof mass, courtyard, room, entry, fixture and unique source position below is authored here.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
import {author2AUProfile,carve2AUFootprint} from './m1-u-court-shops.mjs';
import {carveOpposingForecourt} from './m1-stepped-court-shops.mjs';
import {validateBlueprint} from './schema.mjs';

export const A1_FIRST_TWELVE_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "temperate",
    "size": "large",
    "variation": 5,
    "w": 38,
    "d": 31,
    "h": 9,
    "entry": 19,
    "left": 7,
    "right": 30,
    "depth": 12,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 7,
    "opposite": true,
    "oppositeWidth": 3,
    "oppositeDepth": 4,
    "masses": [
      [
        3,
        9,
        6,
        13,
        7,
        "merchant-astral-belfry"
      ],
      [
        27,
        33,
        7,
        14,
        5,
        "rear-slate-carrier"
      ],
      [
        3,
        8,
        20,
        25,
        6,
        "tiered-ledger-crown"
      ]
    ],
    "gables": [
      [
        "front",
        12,
        27,
        7
      ],
      [
        "rear",
        3,
        9,
        5
      ]
    ],
    "name": "Mossbridge East-West Trading Hall",
    "annex": "temperate-general-store-rear-services",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "furniture": [
      [
        28,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        29,
        10,
        "pack5:087",
        "category-identity-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        33,
        27,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "mountain",
    "size": "small",
    "variation": 5,
    "w": 29,
    "d": 27,
    "h": 8,
    "entry": 14,
    "left": 9,
    "right": 19,
    "depth": 8,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 6,
    "opposite": false,
    "oppositeWidth": 0,
    "oppositeDepth": 0,
    "masses": [
      [
        3,
        7,
        6,
        12,
        7,
        "quarry-merchant-bell"
      ],
      [
        17,
        20,
        7,
        12,
        4,
        "scree-market-shed"
      ],
      [
        2,
        6,
        17,
        21,
        6,
        "high-slate-sorting-roof"
      ]
    ],
    "gables": [
      [
        "front",
        8,
        16,
        7
      ]
    ],
    "name": "Ridgetop Crow's Nest Mercantile",
    "annex": "mountain-general-store-rear-services",
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "furniture": [
      [
        19,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        20,
        10,
        "pack5:087",
        "category-identity-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        24,
        23,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "medium",
    "variation": 4,
    "w": 27,
    "d": 26,
    "h": 8,
    "entry": 13,
    "left": 7,
    "right": 20,
    "depth": 11,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 5,
    "opposite": false,
    "oppositeWidth": 0,
    "oppositeDepth": 0,
    "masses": [
      [
        3,
        8,
        7,
        12,
        5,
        "sunshade-courier-aviary-empty"
      ],
      [
        19,
        23,
        7,
        12,
        7,
        "high-dune-supply-tower"
      ],
      [
        2,
        7,
        18,
        22,
        4,
        "dry-grain-gallery"
      ]
    ],
    "gables": [
      [
        "front",
        9,
        18,
        6
      ]
    ],
    "name": "Sundapple Empty Habitat Outfitter",
    "annex": "desert-pet-shop-rear-services",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "furniture": [
      [
        17,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        18,
        10,
        "pack5:087",
        "category-identity-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        22,
        22,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 4,
    "w": 43,
    "d": 30,
    "h": 10,
    "entry": 21,
    "left": 7,
    "right": 32,
    "depth": 13,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 5,
    "opposite": true,
    "oppositeWidth": 3,
    "oppositeDepth": 4,
    "masses": [
      [
        3,
        9,
        7,
        14,
        7,
        "branch-perch-roof"
      ],
      [
        25,
        30,
        8,
        14,
        6,
        "fern-arched-goods-gallery"
      ],
      [
        2,
        8,
        21,
        26,
        5,
        "treehouse-feed-turret"
      ]
    ],
    "gables": [
      [
        "front",
        11,
        24,
        7
      ],
      [
        "rear",
        3,
        9,
        5
      ]
    ],
    "name": "Fernsage Arbor Supply Court",
    "annex": "enchanted-forest-pet-shop-rear-services",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "furniture": [
      [
        33,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        34,
        10,
        "pack5:087",
        "category-identity-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        38,
        26,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "temperate",
    "size": "large",
    "variation": 4,
    "w": 36,
    "d": 29,
    "h": 10,
    "entry": 18,
    "left": 7,
    "right": 29,
    "depth": 13,
    "frontSide": "east",
    "stepWidth": 3,
    "stepDepth": 5,
    "opposite": false,
    "oppositeWidth": 0,
    "oppositeDepth": 0,
    "masses": [
      [
        3,
        9,
        6,
        12,
        7,
        "sealed-observatory-roof"
      ],
      [
        27,
        32,
        7,
        13,
        8,
        "vaulted-reliquary-tower"
      ],
      [
        3,
        8,
        20,
        25,
        5,
        "herbal-scroll-wing"
      ]
    ],
    "gables": [
      [
        "front",
        12,
        24,
        8
      ]
    ],
    "name": "Hazelwick Arcane Curiosity Exchange",
    "annex": "temperate-magic-shop-rear-services",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "furniture": [
      [
        26,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        27,
        10,
        "pack5:093",
        "category-identity-display",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        31,
        25,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "small",
    "variation": 4,
    "w": 25,
    "d": 24,
    "h": 8,
    "entry": 12,
    "left": 8,
    "right": 16,
    "depth": 8,
    "frontSide": "west",
    "stepWidth": 3,
    "stepDepth": 4,
    "opposite": true,
    "oppositeWidth": 3,
    "oppositeDepth": 4,
    "masses": [
      [
        3,
        7,
        6,
        12,
        6,
        "aurora-ridge-roof"
      ],
      [
        18,
        22,
        7,
        12,
        7,
        "frost-archive-sentry"
      ],
      [
        2,
        6,
        17,
        21,
        4,
        "vaulted-ice-shelf"
      ]
    ],
    "gables": [
      [
        "front",
        8,
        17,
        7
      ]
    ],
    "name": "Blueglass Northern Charm Store",
    "annex": "snow-magic-shop-rear-services",
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "furniture": [
      [
        15,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        16,
        10,
        "pack5:093",
        "category-identity-display",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        20,
        20,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "medium",
    "variation": 4,
    "w": 29,
    "d": 28,
    "h": 9,
    "entry": 14,
    "left": 7,
    "right": 22,
    "depth": 13,
    "frontSide": "east",
    "stepWidth": 3,
    "stepDepth": 5,
    "opposite": false,
    "oppositeWidth": 0,
    "oppositeDepth": 0,
    "masses": [
      [
        3,
        8,
        7,
        12,
        5,
        "stone-drying-chimney-roof"
      ],
      [
        21,
        25,
        7,
        14,
        7,
        "rock-herb-terrace"
      ],
      [
        2,
        7,
        20,
        25,
        6,
        "waterless-press-tower"
      ]
    ],
    "gables": [
      [
        "front",
        9,
        20,
        7
      ],
      [
        "rear",
        3,
        8,
        5
      ]
    ],
    "name": "Copperfen Cliffside Herbarium",
    "annex": "mountain-potion-shop-rear-services",
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "furniture": [
      [
        19,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        20,
        10,
        "pack5:087",
        "category-identity-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:089",
        "private-functional-workplace",
        "iron-tripod-cauldron"
      ],
      [
        24,
        24,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "desert",
    "size": "large",
    "variation": 4,
    "w": 43,
    "d": 39,
    "h": 10,
    "entry": 21,
    "left": 15,
    "right": 32,
    "depth": 12,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 6,
    "opposite": true,
    "oppositeWidth": 3,
    "oppositeDepth": 4,
    "masses": [
      [
        3,
        9,
        7,
        13,
        7,
        "windcatcher-drywork-roof"
      ],
      [
        26,
        31,
        9,
        14,
        6,
        "sealed-spice-gallery"
      ],
      [
        2,
        8,
        23,
        28,
        5,
        "sundial-fume-hall"
      ]
    ],
    "gables": [
      [
        "front",
        11,
        24,
        7
      ]
    ],
    "name": "Miragewind Dry Alchemy Bazaar",
    "annex": "desert-potion-shop-rear-services",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "furniture": [
      [
        33,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        34,
        10,
        "pack5:087",
        "category-identity-display",
        "curio-arcade"
      ],
      [
        3,
        9,
        "pack5:089",
        "private-functional-workplace",
        "iron-tripod-cauldron"
      ],
      [
        38,
        35,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "temperate",
    "size": "large",
    "variation": 4,
    "w": 43,
    "d": 34,
    "h": 10,
    "entry": 21,
    "left": 14,
    "right": 29,
    "depth": 12,
    "frontSide": "east",
    "stepWidth": 4,
    "stepDepth": 6,
    "opposite": false,
    "oppositeWidth": 0,
    "oppositeDepth": 0,
    "masses": [
      [
        3,
        9,
        7,
        13,
        8,
        "bread-belfry"
      ],
      [
        30,
        35,
        8,
        13,
        5,
        "cooling-storage-hip"
      ],
      [
        2,
        9,
        21,
        26,
        6,
        "flour-lantern-roof"
      ]
    ],
    "gables": [
      [
        "front",
        12,
        27,
        8
      ],
      [
        "rear",
        3,
        9,
        5
      ]
    ],
    "name": "Rivermill Crescent Bakehouse",
    "annex": "temperate-bakery-rear-services",
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack3:023",
    "furniture": [
      [
        33,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        34,
        10,
        "pack5:090",
        "category-identity-display",
        "ashstone-bake-oven"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        38,
        30,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "medium",
    "variation": 4,
    "w": 35,
    "d": 33,
    "h": 9,
    "entry": 17,
    "left": 7,
    "right": 29,
    "depth": 14,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 7,
    "opposite": false,
    "oppositeWidth": 0,
    "oppositeDepth": 0,
    "masses": [
      [
        3,
        7,
        7,
        13,
        7,
        "steep-oven-snowcap"
      ],
      [
        21,
        25,
        7,
        12,
        5,
        "winter-cooling-roof"
      ],
      [
        2,
        7,
        19,
        23,
        6,
        "covered-grain-store"
      ]
    ],
    "gables": [
      [
        "front",
        10,
        20,
        6
      ]
    ],
    "name": "Glaciergrist Winter Breadhall",
    "annex": "snow-bakery-rear-services",
    "wall": "pack1:004",
    "floor": "pack5:081",
    "roof": "pack3:025",
    "furniture": [
      [
        25,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        26,
        10,
        "pack5:090",
        "category-identity-display",
        "ashstone-bake-oven"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        30,
        29,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "snow",
    "size": "small",
    "variation": 3,
    "w": 30,
    "d": 30,
    "h": 8,
    "entry": 15,
    "left": 14,
    "right": 22,
    "depth": 7,
    "frontSide": "east",
    "stepWidth": 3,
    "stepDepth": 4,
    "opposite": false,
    "oppositeWidth": 0,
    "oppositeDepth": 0,
    "masses": [
      [
        3,
        7,
        6,
        12,
        7,
        "ice-bond-teller-tower"
      ],
      [
        18,
        21,
        7,
        12,
        6,
        "stone-vault-watch"
      ],
      [
        2,
        7,
        17,
        22,
        5,
        "ridge-bond-archive"
      ]
    ],
    "gables": [
      [
        "front",
        8,
        17,
        7
      ]
    ],
    "name": "Snowbell Bondkeepers' Office",
    "annex": "snow-bank-rear-services",
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "furniture": [
      [
        20,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        20,
        10,
        "pack5:086",
        "second-teller-service",
        "ledger-service"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        25,
        26,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 3,
    "w": 37,
    "d": 35,
    "h": 10,
    "entry": 18,
    "left": 12,
    "right": 23,
    "depth": 8,
    "frontSide": "west",
    "stepWidth": 4,
    "stepDepth": 5,
    "opposite": true,
    "oppositeWidth": 3,
    "oppositeDepth": 4,
    "masses": [
      [
        3,
        9,
        7,
        14,
        8,
        "greenwood-escrow-tower"
      ],
      [
        26,
        31,
        7,
        15,
        7,
        "securitas-ledger-crown"
      ],
      [
        2,
        8,
        22,
        27,
        6,
        "canopy-sealed-vault-roof"
      ]
    ],
    "gables": [
      [
        "front",
        12,
        24,
        8
      ],
      [
        "rear",
        3,
        9,
        6
      ]
    ],
    "name": "Elderroot Three-Wing Treasury",
    "annex": "enchanted-forest-bank-rear-services",
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "furniture": [
      [
        27,
        5,
        "pack5:086",
        "service-counter",
        "ledger-service"
      ],
      [
        27,
        10,
        "pack5:086",
        "second-teller-service",
        "ledger-service"
      ],
      [
        3,
        9,
        "pack5:091",
        "private-functional-workplace",
        "cartographers-oak-desk"
      ],
      [
        32,
        31,
        "pack4:057",
        "sealed-rear-inventory",
        null
      ]
    ]
  }
].map(s=>Object.freeze(s)));
export const A1_FIRST_TWELVE_SHOPS=Object.freeze(A1_FIRST_TWELVE_SPECS.map(s=>{
 const physicalProfile=author2AUProfile(s);
 const authored=assembleSpecialistProfile(physicalProfile);
 const openU=carve2AUFootprint(authored,physicalProfile);
 const completed=s.opposite?carveOpposingForecourt(openU,s):openU;
 validateBlueprint(completed);
 return completed;
}));
export const A1_FIRST_TWELVE_CENSUS=Object.freeze({
 protectedPreviouslyAuthored:128,newlyAuthoredCandidateSources:A1_FIRST_TWELVE_SHOPS.length,
 cumulativeCandidateSources:128+A1_FIRST_TWELVE_SHOPS.length,stillUnauthored:420-128-A1_FIRST_TWELVE_SHOPS.length,
 historicCatalogUnchanged:true,creatorApproved:0,productionPlaced:0,realIphoneAccepted:false,
 screenshotAcceptancePending:true,fullPhysicalMeshAcceptancePending:true
});
